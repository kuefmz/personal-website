---
title: "When to Move from SQLite to PostgreSQL in a Small Web Application"
description: "How to decide when SQLite is no longer enough, and how to plan a safe migration to PostgreSQL for persistent deployed web applications."
publishedAt: 2026-09-22
tags: ["PostgreSQL", "SQLite", "Database Migration", "Backend Development", "FastAPI"]
category: "Data Engineering"
draft: false
---

SQLite is an excellent database for prototypes and small tools.

The problem appears when a project moves from **local experiment to deployed application** and persistence starts to matter.

This does not mean SQLite is bad. It means the operational requirements changed.

## SQLite is often the right place to start

For an early application, SQLite provides several advantages:

- almost zero setup;
- no database server;
- easy local development;
- simple backups;
- strong SQL support;
- fast iteration.

For a tool used by one process on one machine, it can be all that is needed.

The decision to migrate should be driven by requirements, not by the assumption that every application needs a large database.

## Deployment changes the problem

Some hosting environments use ephemeral filesystems.

A local SQLite file may disappear when:

- the service is redeployed;
- the container restarts;
- the instance is replaced;
- the platform moves the workload.

This is the moment many small applications discover that "the database worked in development" is different from "the data is durable in production."

Before deploying SQLite, verify how the hosting platform handles persistent disk.

## Concurrency may become the next limit

SQLite supports concurrent reads well, but writes are serialized.

That is acceptable for many workloads.

Problems can appear when the application starts handling:

- multiple simultaneous users;
- background jobs;
- repeated API writes;
- admin operations;
- scheduled processing;
- several application instances.

PostgreSQL is designed for this type of multi-client workload.

## Look for operational requirements

A migration becomes more attractive when the application needs:

- durable managed storage;
- multiple application instances;
- backups and point-in-time recovery;
- stronger concurrent write behavior;
- database roles;
- network access from several services;
- monitoring;
- more advanced indexing or extensions.

These are operational capabilities, not just SQL features.

## Prepare the schema before moving data

A migration is a good opportunity to remove prototype shortcuts.

Review:

- primary keys;
- foreign keys;
- nullability;
- unique constraints;
- timestamps;
- indexes;
- enum-like fields;
- default values.

SQLite's permissive typing can hide data that a stricter PostgreSQL schema will reject.

Running validation before import makes the migration much easier.

## Export in a controlled format

For small applications, a migration can be performed with a straightforward export-transform-load process.

Useful intermediate formats include:

- CSV;
- JSONL;
- SQL dumps.

The important part is preserving stable identifiers and relationships.

For larger JSONL-oriented workflows, see [From JSONL to PostgreSQL: A Reliable Catalog Data Pipeline](/blog/jsonl-postgresql-catalog-data-pipeline/).

## Make the import repeatable

Avoid a migration script that can only be run once manually.

A better script should:

- validate source rows;
- transform data deterministically;
- use transactions;
- report failures;
- support dry runs;
- avoid creating duplicates;
- print final record counts.

This makes it possible to rehearse the migration before switching production traffic.

## Compare before switching

After import, compare both databases.

Useful checks include:

- row counts;
- unique entity counts;
- missing foreign keys;
- null rates;
- sample records;
- aggregate totals.

The goal is not merely to finish the import. It is to prove that the important information survived.

## Plan the cutover

A small application can often use this sequence:

1. stop writes temporarily;
2. perform the final export;
3. run the migration;
4. verify counts and constraints;
5. update the production connection string;
6. deploy;
7. run smoke tests;
8. keep the old database available temporarily for rollback.

For systems that cannot stop writes, a more sophisticated synchronization strategy may be needed.

## Use environment variables for configuration

The application should not hard-code database credentials.

A production backend should read a connection URL from the deployment environment.

This makes local SQLite and production PostgreSQL easier to separate without changing application code.

## The useful rule

Do not migrate because PostgreSQL is more "professional."

Migrate when the application needs **durability, concurrency, managed operations, or multi-service access** that SQLite is not providing comfortably.

That keeps prototypes simple while giving production systems a clear upgrade path.

Need to move a prototype into a durable production setup? [Share the current architecture here](/contact/#project-request).
