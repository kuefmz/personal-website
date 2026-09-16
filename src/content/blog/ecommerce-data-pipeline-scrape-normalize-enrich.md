---
title: "E-commerce Data Pipeline Design: Scrape, Normalize, Enrich, Validate and Load"
description: "A practical e-commerce data pipeline architecture for scraping product data, normalization, enrichment, validation, product matching, and database loading."
publishedAt: 2026-09-12
tags: ["E-commerce Data Pipeline", "ETL", "Web Scraping", "Data Engineering", "Python"]
category: "Data Engineering"
draft: false
---

An **e-commerce data pipeline** is not just a scraper plus a database insert.

The hard part is preserving meaning while different stores describe products differently and change their websites independently.

For Orgelia, I separated the workflow into explicit stages:

`Scrape -> Normalize -> Enrich -> Validate -> Match -> Load`

Each stage has a different contract and a different reason to fail.

## 1. Scrape: preserve what the source actually said

The collection stage should capture the source faithfully.

I want enough raw information to reproduce later decisions, including the source URL and crawl metadata.

This is important because a normalization bug discovered tomorrow should not require guessing what the source looked like yesterday.

Where practical, raw snapshots or raw JSONL outputs should be treated as immutable inputs to downstream processing.

## 2. Normalize: convert source-specific shapes into one schema

Every shop has its own naming conventions.

One source might expose `product_name`, another `title`, and another only a nested JSON-LD field.

Normalization turns those source-specific representations into a stable internal schema.

Typical normalization tasks include:

- whitespace and Unicode cleanup;
- price parsing;
- currency normalization;
- URL normalization;
- category mapping;
- brand cleanup;
- size/unit normalization;
- country codes;
- stable source identifiers.

Normalization should be deterministic when possible. If the same raw record is processed twice with the same rules, the result should be the same.

## 3. Enrich: add information not directly available from the source

Enrichment is different from normalization.

Normalization changes representation. Enrichment adds derived information.

Examples can include:

- mapped taxonomy labels;
- inferred structured attributes;
- normalized product types;
- geographic metadata;
- derived shop or country fields.

Keeping enrichment separate makes it easier to distinguish source facts from pipeline-generated fields.

## 4. Validate: reject bad records before matching

Validation should happen before a bad record contaminates later stages.

I use two types of checks:

### Schema validation

Does the record have the expected fields and types?

### Business validation

Does the record make sense?

For example:

- is a required URL present?;
- is the price positive?;
- is the country valid?;
- does a category belong to the allowed set?;
- is a required identifier empty?;
- did a scraper accidentally put a generator object string into a normal text field?

A strict data contract is especially valuable when many source-specific scrapers feed one catalog.

## 5. Match: resolve product identity across sources

Two listings from different shops may represent the same physical product while sharing few exact strings.

Matching can use:

- explicit product identifiers;
- brand;
- normalized title;
- model;
- variant;
- size;
- attributes;
- description signals.

Exact matching and "similar product" matching should not be mixed casually. A price comparison needs much stronger evidence than a recommendation saying two items are broadly comparable.

See [Product Matching Across Stores and Languages](/blog/ecommerce-product-matching-across-stores-languages/) for the identity problem in more detail.

## 6. Load: only publish validated catalog data

The load stage writes records that passed the pipeline into the application database.

This creates a clean boundary: the API serves validated data, while the pipeline owns preparation.

It also makes rollback and reruns easier because database loading becomes the final controlled step rather than something every scraper does directly.

## Why JSONL is useful between stages

For batch-oriented pipelines, JSONL has several advantages:

- one record per line;
- easy streaming;
- easy diffing and sampling;
- partial processing without loading the full dataset;
- works well with object storage;
- source and stage outputs can be versioned independently.

The important part is not JSONL itself. It is having a durable stage boundary.

## What makes the pipeline reliable

The main reliability improvements are architectural:

- preserve raw data;
- make transformations reproducible;
- validate every stage;
- isolate source-specific code;
- make records traceable to their source;
- keep the public API separate from scraping;
- rerun transformations without recrawling when possible.

That is the difference between a scraper script and a maintainable product-data system.

For the surrounding product architecture, see [Building Orgelia: Architecture for a Multi-Country Product Comparison Platform](/blog/orgelia-product-comparison-platform-architecture/).
