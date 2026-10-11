---
title: "Idempotent Python Scheduled Jobs: Safe Retries and Recovery"
description: "Design scheduled Python workflows that can run again safely, with durable run keys, transactional results, bounded retries, and explicit recovery steps."
seoTitle: "Idempotent Python Scheduled Jobs"
publishedAt: 2026-10-12
tags: ["Python", "Automation", "Idempotency", "Scheduled Jobs"]
category: "Automation"
draft: false
---

An idempotent Python scheduled job produces the intended result even when the same logical run is attempted again. Start with a stable run key, persist the result and completion record together, and treat calls to external systems as a separate delivery problem.

This matters for weekly reports, catalog imports, and document-processing batches. A scheduler can trigger work twice, a worker can restart, and an operator can rerun a task after an ambiguous timeout. The useful guarantee is that these ordinary events do not create duplicate records or silently skip unfinished work.

The [website audit reporting workflow](/blog/automated-website-audit-report-workflow/) is a useful example: collecting findings, creating the report, and emailing it are related operations, but they have different recovery boundaries.

## Define the logical run before choosing the scheduler

A run key should identify the business operation, not the process attempting it. For a weekly report, it could combine the customer identifier, report type, and reporting period. For a document transformation, include the document checksum and transformation version.

Do not use the worker start time as the key. A retry starts later and would receive a different identity. Also avoid using only the job name: that would suppress every future weekly report after the first one.

Write down these decisions:

| Decision | Example |
| --- | --- |
| Scope | One website and one reporting week |
| Period boundary | Monday 00:00 UTC to the following Monday |
| Run key | `site-42:weekly-audit:2026-10-05` |
| Output version | Audit rules version stored with the result |
| Retry policy | Repeat the same key after transient failure |
| Recalculation policy | Explicit revision when inputs or rules change |

Keep time-zone conversion at the boundary. If a client expects a local Monday report, calculate that period in their configured time zone and store the resulting UTC interval. Daylight-saving changes make a fixed number of seconds an unreliable definition of a local calendar day.

## Separate overlap prevention from repeat safety

A lock answers whether two workers can execute together. Idempotency answers whether executing again changes the result incorrectly. You often need both.

A single-process scheduler setting can prevent overlap inside one process, but it does not coordinate several deployed instances. Conversely, a unique database key can prevent duplicate rows while still allowing two workers to spend time generating the same expensive report.

For small local jobs, serialize execution. For distributed jobs, use a durable claim or lease with an owner, expiry, and recovery policy. A lease alone is insufficient if an old worker continues after its lease expires: use fencing or conditional writes so that a newer owner cannot be overwritten.

## A runnable transaction boundary in Python

The following standard-library example uses SQLite to demonstrate a local database-only job. Save it as `job.py` and run `python job.py`. It stores one summary per run key and marks completion in the same transaction.

```python
import sqlite3


def initialize(db):
    db.executescript("""
        CREATE TABLE IF NOT EXISTS completed_runs (
            run_key TEXT PRIMARY KEY
        );
        CREATE TABLE IF NOT EXISTS report_results (
            run_key TEXT PRIMARY KEY,
            finding_count INTEGER NOT NULL
        );
    """)


def store_report(db, run_key, finding_count, fail=False):
    db.execute("BEGIN IMMEDIATE")
    try:
        if db.execute(
            "SELECT 1 FROM completed_runs WHERE run_key = ?",
            (run_key,),
        ).fetchone():
            db.rollback()
            return False
        db.execute(
            "INSERT INTO report_results VALUES (?, ?)",
            (run_key, finding_count),
        )
        if fail:
            raise RuntimeError("simulated failure before completion")
        db.execute("INSERT INTO completed_runs VALUES (?)", (run_key,))
        db.commit()
        return True
    except BaseException:
        db.rollback()
        raise


if __name__ == "__main__":
    with sqlite3.connect(":memory:", isolation_level=None) as db:
        initialize(db)
        assert store_report(db, "site-42:week-1", 7)
        assert not store_report(db, "site-42:week-1", 7)
        try:
            store_report(db, "site-42:week-2", 9, fail=True)
        except RuntimeError:
            pass
        assert store_report(db, "site-42:week-2", 9)
        assert db.execute("SELECT COUNT(*) FROM report_results").fetchone()[0] == 2
        print("duplicate skipped; failed run recovered")
```

`BEGIN IMMEDIATE` acquires the SQLite write transaction before checking completion. Another writer must wait or receive a busy error. The example therefore avoids a check-then-insert race between writers sharing this database.

The in-memory database makes the demonstration repeatable, but does not survive restart. Use a file on durable local storage for persistence. Do not treat this as a distributed queue or keep a database write transaction open while fetching websites. Collect or stage expensive inputs first, then keep the commit phase short.

The [Python sqlite3 documentation](https://docs.python.org/3/library/sqlite3.html) explains transaction controls. The [SQLite transaction reference](https://www.sqlite.org/lang_transaction.html) describes the behavior of `BEGIN IMMEDIATE`.

## Why external effects need another design

An email cannot participate in the SQLite transaction. If you send it first and crash before marking completion, the retry can send another. If you mark completion first and crash before sending, the email can be lost.

Use a transactional outbox: store the report and a pending delivery record together, then let a separate dispatcher send pending records. Give each delivery a stable key. If the provider supports idempotency, reuse that key on retries within its documented retention window.

An outbox makes the intention durable. It does not, by itself, guarantee exactly one email. When the provider accepts a message but the response is lost, the dispatcher needs provider-side idempotency or a reconciliation mechanism. Otherwise the workflow must acknowledge the possibility of duplicates.

The [webhook deduplication guide](/blog/webhook-idempotency-durable-inbox/) develops the same boundary for incoming events.

## Retry only recoverable failures

Classify errors before selecting delays. Temporary transport failures and service unavailability may justify bounded retries. Invalid input, missing permission, or an incompatible schema needs investigation rather than repeated execution.

Use exponential backoff with jitter, an attempt limit, and a maximum elapsed retry window. Respect provider retry guidance and rate-limit headers. Do not add a second retry loop around a client that already retries without understanding the combined maximum duration.

Cloud Scheduler documents [at-least-once delivery](https://docs.cloud.google.com/scheduler/docs/overview). That is a reminder to design the worker's business behavior independently of the scheduling product's reliability.

Need to make a recurring Python workflow recover safely? [Describe the job, its outputs, and the failures you need to handle](/contact/#project-request).

## Make missed runs explicit

After downtime, should a scheduler execute every missed period, only the latest period, or nothing automatically? There is no universal answer.

A financial reconciliation may require every period. A dashboard refresh may need only the latest state. A reminder email sent three days late may be confusing. Record the policy with the job definition, and give manual backfills their own run keys and rate limits.

Measure successful logical runs separately from attempts. Useful fields include run key, scheduled period, attempt number, input version, duration, output location, and final state. Alert on overdue completion, not merely process crashes: a job can exit successfully while doing no useful work.

## Rehearse recovery before deployment

Test repeated execution, a crash before commit, a crash after commit, concurrent starts, and an expired claim. For external delivery, simulate both a clear rejection and an ambiguous timeout after acceptance.

Also check a changed input under an existing key. Decide whether that is a configuration error or an explicit new revision; silently returning an old report may be as harmful as creating a duplicate.

For production persistence across multiple services, consider the operational requirements described in [moving from SQLite to PostgreSQL](/blog/sqlite-to-postgresql-production-migration/).

## Next step

Start with one job and a written failure table. Give it a stable identity, make database changes atomic, and isolate external delivery. Then choose scheduling and queue tools that fit those boundaries. [Send an inquiry about your automation workflow](/contact/#project-request) if you need help turning that recovery plan into an implementation.
