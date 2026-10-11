---
title: "Incremental API Sync: Cursors, Checkpoints and Safe Restarts"
description: "Build resumable API synchronization with atomic page checkpoints, version-aware upserts, deletion handling, cursor recovery, and reconciliation."
seoTitle: "Incremental API Sync and Checkpoints"
publishedAt: 2026-10-12
tags: ["API Integration", "Data Engineering", "Python", "Data Pipeline"]
category: "Data Engineering"
draft: false
---

A reliable incremental API sync commits each page's records and its next checkpoint together. If a process stops before commit, replay the page. If it stops after commit, continue from the saved checkpoint. Add source-version checks so an older replay cannot replace newer data.

Fetching only changed records reduces repeated work, but introduces state. The checkpoint is part of the pipeline's correctness, not just a performance optimization. Losing or advancing it incorrectly can skip updates that a successful HTTP response will never reveal.

This guide complements the [JSONL-to-PostgreSQL pipeline](/blog/jsonl-postgresql-catalog-data-pipeline/): that article discusses staged catalog data, while this one addresses progress through a changing remote API.

## Distinguish a page cursor from a change token

Pagination describes how to traverse a result set. Change tracking describes how to ask what changed after a previous synchronization. An API may offer both, only one, or neither.

An opaque page cursor might expire after the current traversal. A delta token might represent a durable synchronization boundary. Do not assume that the last page cursor can be reused next week to request changes.

Microsoft Graph's [delta query documentation](https://learn.microsoft.com/en-us/graph/delta-query-overview) describes next links for continuing a traversal and delta links for later change tracking. Treat these returned links as opaque and preserve their documented query scope.

For every provider, establish:

| Contract | Question to answer |
| --- | --- |
| Pagination | Is the traversal a stable snapshot or a moving list? |
| Ordering | Are changes ordered, versioned, or possibly repeated? |
| Deletion | Are deleted resources returned as tombstones? |
| Retention | How long can a cursor or change token be resumed? |
| Scope | Does state depend on tenant, filters, or API version? |
| Recovery | What response means a full resync is required? |

Offset pagination over a changing collection can miss or repeat records as earlier rows are inserted or removed. Cursor pagination helps only within the provider's stated guarantees.

## Make the checkpoint identity explicit

Store synchronization state per provider, account, resource, filter set, and relevant API version. A checkpoint for one tenant must never be applied to another.

Include the current traversal token, last successful commit time, run identifier, and synchronization mode. Keep backfill state separate from normal incremental state so an operator cannot accidentally move the production checkpoint backward.

Protect tokens and returned URLs like integration configuration. Do not log opaque links unnecessarily. When following a returned URL, validate its origin against the provider's allowed hosts before attaching credentials. A generic request helper should not send an authorization header to arbitrary hosts.

## A runnable page commit boundary

The following standard-library example uses a local SQLite database to show the transaction. It assumes the provider supplies a monotonically increasing integer revision for each entity. Many APIs do not: adapt the comparison to the actual provider contract rather than inventing a revision.

Save as `sync_page.py` and run `python sync_page.py`.

```python
import json
import sqlite3


def initialize(db):
    db.executescript("""
        CREATE TABLE IF NOT EXISTS entities (
            id TEXT PRIMARY KEY,
            revision INTEGER NOT NULL,
            payload TEXT NOT NULL,
            deleted INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS sync_state (
            stream TEXT PRIMARY KEY,
            token TEXT NOT NULL
        );
        INSERT OR IGNORE INTO sync_state VALUES ('demo', 'start');
    """)


def commit_page(db, expected_token, next_token, items, fail=False):
    db.execute("BEGIN IMMEDIATE")
    try:
        current = db.execute(
            "SELECT token FROM sync_state WHERE stream = 'demo'"
        ).fetchone()[0]
        if current != expected_token:
            raise ValueError("checkpoint changed; reload state")
        for item in items:
            db.execute("""
                INSERT INTO entities VALUES (?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    revision = excluded.revision,
                    payload = excluded.payload,
                    deleted = excluded.deleted
                WHERE excluded.revision > entities.revision
            """, (item['id'], item['revision'],
                  json.dumps(item, sort_keys=True), int(item.get('deleted', False))))
        if fail:
            raise RuntimeError("simulated crash before checkpoint")
        db.execute("UPDATE sync_state SET token = ? WHERE stream = 'demo'",
                   (next_token,))
        db.commit()
    except BaseException:
        db.rollback()
        raise


if __name__ == "__main__":
    with sqlite3.connect(":memory:", isolation_level=None) as db:
        initialize(db)
        commit_page(db, 'start', 'page-2', [{'id': 'a', 'revision': 3}])
        commit_page(db, 'page-2', 'delta-1', [{'id': 'a', 'revision': 2}])
        assert db.execute("SELECT revision FROM entities").fetchone()[0] == 3
        commit_page(db, 'delta-1', 'delta-2', [{'id': 'a', 'revision': 4, 'deleted': True}])
        assert db.execute("SELECT deleted FROM entities").fetchone()[0] == 1
        print("checkpoint advanced; stale update ignored; deletion retained")
```

The fixed `demo` stream keeps the example small. A real implementation scopes both entities and state by tenant. The checkpoint comparison stops a second worker from committing a page based on outdated local progress, but does not replace a complete distributed lease design.

Fetch and validate the page before opening this transaction. Keep the write transaction short. If any row fails validation, choose an explicit policy: fail the page, or durably quarantine the row with enough information to recover it. Silently dropping the row and advancing the checkpoint makes the loss permanent.

## Empty pages can still advance state

A response with no records may still contain a continuation link. Follow it until the provider indicates the traversal is complete. Persist a checkpoint even for an empty page when the provider advances state.

Stop loops with repeated-token detection, request limits, and a run deadline. These controls detect broken or unexpected pagination instead of allowing an integration to consume its entire API budget.

Retries should preserve the same request scope. After rate limiting, honor the provider's documented delay. After an expired token, use the resynchronization path rather than retrying the invalid token indefinitely.

## Timestamp watermarks need stronger assumptions

When an API supports only `updated_since`, keep the previous successful boundary and read an overlap window. Upsert by stable entity ID so overlap does not create duplicates. Advance the watermark only after processing the complete bounded traversal.

If the API supports a stable ordering by `(updated_at, id)`, that pair can disambiguate equal timestamps. If it cannot sort or filter consistently, a timestamp alone cannot guarantee completeness while data changes during paging.

A local clock time is not automatically the source's completion boundary. Clock skew, delayed indexing, and coarse timestamp precision can all hide changes. Document the lag assumptions and use reconciliation to detect drift.

## Handle deletions and full resynchronization deliberately

Keep tombstones or source revisions long enough to stop an older replay from resurrecting a deleted entity. A missing record on one page is not evidence of deletion.

For a full snapshot, stage a new generation and mark it complete only after every page succeeds. Then compare the completed snapshot with the previous generation. Never delete destination records based on an interrupted crawl or partial API response.

If permissions or filters changed, absence may mean the integration can no longer see a record. Decide whether to hide, archive, or delete it according to the business contract.

Need a sync that can restart without losing progress? [Describe the API, destination database, and update semantics](/contact/#project-request).

## Measure freshness and rehearse failure

Track time since the last committed page, source-to-destination lag where measurable, expired tokens, quarantined records, and reconciliation differences. Row throughput alone can look healthy while important updates are missing.

Test a crash before commit, a crash after commit, repeated pages, stale updates, deletion followed by stale replay, empty pages, and a lost token. Include concurrent attempts at the same checkpoint. The related [Python scheduled jobs guide](/blog/idempotent-python-scheduled-jobs/) explains how to identify and recover repeated runs.

## Next step

Write down the provider contract before writing the loop. Make page application and progress atomic, define token recovery, and verify deletions through a completed change feed or snapshot. [Send an inquiry about your data synchronization workflow](/contact/#project-request) if you need help translating those constraints into a dependable pipeline.
