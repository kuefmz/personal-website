---
title: "Webhook Idempotency: A Durable Inbox for Duplicate Events"
description: "Handle duplicate webhooks with a durable inbox, atomic event keys, safe worker retries, and explicit boundaries for database and external side effects."
seoTitle: "Webhook Idempotency and Safe Retries"
publishedAt: 2026-10-12
tags: ["Webhooks", "API Integration", "Python", "Idempotency"]
category: "Automation"
draft: false
---

To handle duplicate webhooks reliably, verify the request, store the event under a unique provider/account/event key, and acknowledge it only after durable acceptance. Process accepted events with retry-safe business operations. Event deduplication and external side-effect idempotency solve different problems.

A successful webhook request is often only the beginning of a workflow. Updating a CRM, generating a document, and sending an email can continue after the receiver responds. A durable inbox makes the handoff visible and recoverable instead of relying on an in-memory background task.

This guide focuses on the delivery and recovery boundary. The broader [custom API integration guide](/blog/custom-api-integration-business-systems/) covers data ownership, contracts, polling, and adapter design.

## Why the same event arrives again

The sender may receive no response even though your server committed the event. A reverse proxy may time out while a worker continues. A manual replay can arrive days later. These are expected delivery scenarios, so a duplicate should normally be harmless.

Do not confuse a delivery attempt with a business event. Several attempts can describe one event, and several distinct events can concern the same customer or invoice. A customer identifier alone is usually too broad for deduplication.

Stripe's [webhook guidance](https://docs.stripe.com/webhooks) documents duplicate deliveries, signature verification, and unordered events. Use each provider's own identity and retry contract rather than assuming all providers behave like Stripe.

## Verify first, persist second

Check the signature using the original request bytes and the provider's supported verification library. Parse and validate the event after preserving the raw body needed for verification. Configure body-size limits and reject event types the endpoint does not support.

Authentication and deduplication are separate controls. A unique event ID does not prove that the sender is trusted. Scope the identity by provider and account or tenant so that two accounts using the same identifier cannot collide.

Store only the data needed for processing and recovery. A payload archive can contain personal information; apply the same access and retention rules as the destination system. Avoid logging entire payloads to make a retry easier to debug.

## Use an inbox as the durable queue

A compact inbox needs an identity, payload, processing state, and retry metadata. Useful states are pending, processing, completed, and failed. Store the attempt count and next eligible attempt time separately from the event's source timestamp.

The database uniqueness constraint is the authority. A preliminary `SELECT` followed by `INSERT` is insufficient under concurrency unless the operation has appropriate locking. Attempt the insert atomically and inspect whether it added a new event.

For a receiver backed by PostgreSQL, use a composite primary key and `INSERT ... ON CONFLICT DO NOTHING`. The [PostgreSQL INSERT reference](https://www.postgresql.org/docs/current/sql-insert.html) defines the conflict behavior. Do not suppress unrelated database exceptions as if they were duplicates.

## A runnable local acceptance example

This Python example demonstrates acceptance into a SQLite inbox, not an HTTP server. Call `accept` only after provider signature verification and event-schema validation. Save the code as `inbox.py` and run `python inbox.py`.

```python
import json
import sqlite3


def initialize(db):
    db.execute("""
        CREATE TABLE IF NOT EXISTS inbox (
            provider TEXT NOT NULL,
            account TEXT NOT NULL,
            event_id TEXT NOT NULL,
            payload TEXT NOT NULL,
            state TEXT NOT NULL DEFAULT 'pending',
            PRIMARY KEY (provider, account, event_id)
        )
    """)


def accept(db, provider, account, event_id, payload):
    if not all(isinstance(x, str) and x for x in (provider, account, event_id)):
        raise ValueError("event identity must be nonempty strings")
    encoded = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    with db:
        inserted = db.execute("""
            INSERT INTO inbox(provider, account, event_id, payload)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(provider, account, event_id) DO NOTHING
        """, (provider, account, event_id, encoded)).rowcount == 1
        stored = db.execute("""
            SELECT payload FROM inbox
            WHERE provider = ? AND account = ? AND event_id = ?
        """, (provider, account, event_id)).fetchone()[0]
        if stored != encoded:
            raise ValueError("same event identity with different payload")
    return inserted


if __name__ == "__main__":
    with sqlite3.connect(":memory:") as db:
        initialize(db)
        event = {"customer_id": "customer-9", "version": 3}
        assert accept(db, "demo", "account-a", "event-1", event)
        assert not accept(db, "demo", "account-a", "event-1", event)
        assert accept(db, "demo", "account-b", "event-1", event)
        print("duplicate skipped; account scopes kept separate")
```

Use durable storage instead of `:memory:` outside the demonstration. The receiver should return success for both a newly accepted event and an already accepted duplicate. If persistence fails, return an appropriate failure so the provider can retry according to its contract.

The payload comparison detects accidental reuse of an identity. Providers may vary delivery-specific metadata between attempts, so production comparison should use a documented canonical business payload or record the discrepancy for review. It should not reject ordinary retries merely because a delivery timestamp changed.

## Let workers recover pending events

An inbox can itself be the queue: workers poll eligible pending rows. If you add a message broker, avoid committing the inbox and then publishing without recovery. A crash between those operations leaves an accepted event stranded.

Either use an outbox for broker publication or make workers periodically reconcile inbox entries that have not been processed. A broker notification can accelerate work, while the inbox remains the durable source of truth.

For database-only effects, apply the business update and mark the inbox entry completed in the same transaction. If the worker crashes before commit, both roll back. If it crashes after commit, the completed state prevents reapplying that event.

Use row locks or conditional claims for concurrent workers. Keep transactions short; do not hold them during slow external requests. Expired leases need a recovery path, and stale workers need fencing or conditional writes.

Need a reliable webhook-to-CRM workflow? [Describe the provider, destination, and side effects](/contact/#project-request).

## Protect each external side effect

One event may require several actions. Give each action an identity such as `account:event:action:version` and record its outcome separately. A completed CRM update should not be repeated simply because email delivery failed afterward.

Reuse destination-supported idempotency keys across retries. The destination's retention period and response semantics matter. A timeout after acceptance is ambiguous; blindly sending again can duplicate the action even though the inbox contains only one event.

When the destination has no repeat-safe interface, consider reconciliation using a stable external reference. If neither is possible, explicitly choose whether the workflow favors avoiding duplication or avoiding omission. Do not advertise exactly-once behavior across systems without a mechanism that supports it.

## Deduplication does not solve ordering

Imagine customer version 5 arrives before version 4. Both event IDs are unique. Deduplication allows both, so a naive update can replace newer data with older data.

Prefer a provider revision, conditional update, or authoritative resource lookup. A timestamp is useful only if its ordering and precision are documented. Distinguish a repeated transport event from a legitimate later business transition.

Use periodic reconciliation for missed events and final-state correctness. The [incremental API sync guide](/blog/incremental-api-sync-cursors-checkpoints/) explains how to preserve progress during that reconciliation.

## Test the failure boundaries

Replay a verified test event twice, then concurrently. Stop the worker before commit and after commit. Deliver newer and older revisions in reverse order. Simulate a provider timeout after accepting an external request.

Monitor oldest pending-event age, retry count, failed-event backlog, duplicate rate, and acceptance failures. A spike in duplicates may reveal a latency problem; an empty queue does not prove that no events were missed.

## Next step

Begin with the inbox transaction and a worker that can restart. Add provider-specific verification, ordering rules, and external delivery guarantees deliberately. [Send an inquiry about your API integration](/contact/#project-request) if you need help reviewing those boundaries before production use.
