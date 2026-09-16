---
title: "JSONL to PostgreSQL: Designing a Reproducible Product Catalog Pipeline"
description: "How to use JSONL stage files, object storage, validation, idempotent loading, and PostgreSQL to build a reproducible product catalog data pipeline."
publishedAt: 2026-09-15
tags: ["JSONL", "PostgreSQL", "ETL", "Data Pipeline", "E-commerce"]
category: "Data Engineering"
draft: false
---

When an ingestion pipeline grows beyond one scraper, the intermediate data format becomes an architectural decision.

For the Orgelia data pipeline, **JSONL** is a useful boundary between collection, processing, and loading into PostgreSQL.

## Why JSONL works well for batch catalog data

JSONL stores one JSON object per line.

That simple structure makes it practical for product catalogs because it can be:

- streamed line by line;
- split into chunks;
- sampled with command-line tools;
- processed without loading the entire file into memory;
- stored in object storage;
- compared across pipeline runs;
- validated record by record.

It is also flexible enough to preserve nested source data before a later normalization stage.

## Stage files create reproducibility

A pipeline becomes easier to debug when each major transformation has an explicit input and output.

For example:

`raw -> normalized -> enriched -> validated -> matched -> load-ready`

Each stage can produce a versioned JSONL artifact.

If a validation rule changes, I can rerun the affected stages from the nearest durable input instead of downloading every source again.

This reduces external requests and makes experiments safer.

## Do not overwrite raw data

Raw data should answer the question: **what did the source give us?**

If normalization overwrites it, that evidence disappears.

Keeping immutable raw snapshots makes it possible to investigate whether a defect came from:

- the source;
- the scraper;
- normalization;
- enrichment;
- matching;
- database loading.

That is especially important when a live site has already changed by the time a bug is discovered.

## Validate JSONL before database loading

A file being valid JSONL only proves that each line can be parsed as JSON.

It does not prove that the records satisfy the catalog contract.

Before PostgreSQL loading, validate:

- required keys;
- field types;
- allowed enums;
- URL format;
- price representation;
- country codes;
- category values;
- identifier format;
- nested arrays and objects.

Invalid rows can be separated into an error artifact for inspection instead of being silently dropped.

## Make loading idempotent

The same validated batch may be retried.

A database load should therefore be designed so a retry does not create duplicate products or duplicate offers.

Depending on the model, that can use:

- stable source IDs;
- canonical product IDs;
- unique constraints;
- upserts;
- batch/run IDs;
- transaction boundaries.

Idempotency turns retrying from a risky action into a normal operational tool.

## Separate canonical products from shop offers

A comparison catalog usually benefits from separating the canonical product from a retailer-specific offer.

The canonical product represents product identity. An offer represents how one shop sells that product.

An offer can contain:

- shop;
- source URL;
- price;
- currency;
- availability;
- crawl timestamp;
- source-specific title;
- variant metadata.

This separation makes it possible for one product to have many current offers without duplicating the canonical product record.

## Object storage and PostgreSQL solve different problems

Object storage is useful for immutable pipeline artifacts and historical run outputs.

PostgreSQL is useful for the validated relational view consumed by the API.

Trying to use the database as both the raw archive and the serving model can make transformations harder to reproduce. Trying to serve the application directly from raw JSONL makes querying and relationships unnecessarily difficult.

Using both gives each layer a clear job.

## Add provenance to every record

A processed product should remain traceable.

Useful provenance includes:

- source shop;
- source URL;
- scrape timestamp;
- pipeline run;
- transformation version;
- validation status;
- matching evidence.

This allows a bad public record to be traced backward through the pipeline rather than debugged from the final database row alone.

## The architectural payoff

The main advantage of a JSONL-to-PostgreSQL pipeline is not the file format. It is the discipline of explicit, reproducible stage boundaries.

That makes it easier to:

- reprocess data;
- audit transformations;
- test new matching logic;
- compare pipeline versions;
- recover from failed loads;
- keep the public API isolated from scraper instability.

For the earlier stages, see [E-commerce Data Pipeline Design](/blog/ecommerce-data-pipeline-scrape-normalize-enrich/) and [Reliable E-commerce Web Scraping](/blog/reliable-ecommerce-web-scraping-schema-drift/).
