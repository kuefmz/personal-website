---
title: "Building Orgelia: Architecture for a Multi-Country Product Comparison Platform"
description: "How I separated frontend, API, catalog data, shop discovery, maps, and data ingestion while building Orgelia as a multi-country product comparison platform."
publishedAt: 2026-09-11
tags: ["Product Comparison", "E-commerce", "Data Engineering", "Architecture", "Orgelia"]
category: "Projects"
draft: false
---

A product comparison platform looks like a frontend problem until real catalog data arrives.

While building **Orgelia**, the difficult part quickly became the boundary between product discovery, shop data, scraping, normalization, product identity, and the API that serves the final catalog.

That pushed the architecture toward separate responsibilities rather than one repository trying to do everything.

## Separate product data collection from the application backend

The most important architectural decision was to separate the **data pipeline** from the backend.

The data pipeline handles external data:

`collect -> normalize -> enrich -> validate -> match -> load`

The backend is responsible for serving validated catalog data from PostgreSQL to the application.

This matters because scraping and catalog preparation have very different failure modes from API serving.

A shop can change its HTML without the public API being broken. A scraper can need a retry without a user request waiting for it. A normalization rule can be rerun over stored raw data without recrawling the source.

## Keep raw and processed stages distinct

External product data is messy.

Different shops may represent the same concept with different:

- field names;
- category structures;
- languages;
- currencies;
- variant formats;
- sizes;
- product titles;
- descriptions;
- identifiers.

If raw data is overwritten immediately with a normalized version, debugging becomes difficult.

I prefer immutable or clearly separated stages so I can answer:

- what did the source return?;
- what did normalization change?;
- what did enrichment add?;
- why did validation reject this record?;
- why were two listings matched?

This is also useful when the target schema evolves.

## The frontend should not understand scraper-specific data

A frontend should receive a stable product representation.

It should not need special logic such as "if this product came from shop X, use field A; otherwise use field B."

That source-specific complexity belongs earlier in the pipeline.

The same principle applies to shop listings and map data. The frontend should consume a consistent country/shop model rather than knowing how each shop source was collected.

## Multi-country support changes the data model

Adding Switzerland first and then expanding to Spain, Portugal, and Andorra creates requirements that a single-country prototype can ignore.

Examples include:

- country codes;
- language and locale handling;
- shop coverage;
- region-specific URLs;
- currencies;
- shipping and availability fields;
- map coordinates;
- duplicate shop records;
- source-specific redirects.

Country support is therefore not just a UI dropdown. It needs to exist in the underlying data contract.

## Product comparison depends on identity

A comparison platform only works when it knows whether two shop listings represent the same product.

Exact identifiers are ideal, but real websites do not always expose a stable shared identifier.

That turns comparison into an **entity-resolution and product-matching** problem. Titles, brands, variants, sizes, descriptions, and source metadata can all become signals.

I cover that challenge in [Product Matching Across Stores and Languages](/blog/ecommerce-product-matching-across-stores-languages/).

## Validation is part of the product

A scraper returning JSON is not enough.

The output needs schema validation and business validation before it reaches the public application.

I treat validation as a gate between ingestion and serving. It can detect:

- missing required fields;
- malformed URLs;
- impossible prices;
- invalid country codes;
- unexpected categories;
- duplicate records;
- broken product identity;
- fields whose type changed.

This reduces the chance that a source-site change silently becomes a user-facing bug.

## Architecture follows failure boundaries

The broader lesson from Orgelia is that repository boundaries should follow operational responsibilities.

Frontend rendering, public API serving, and external-data ingestion do not fail for the same reasons and should not need to deploy together.

That separation makes the platform easier to debug as the number of shops, countries, and products grows.

You can see the public project at [Orgelia](https://orgelia.com/). The deeper pipeline design is covered in [E-commerce Data Pipeline Design: Scrape, Normalize, Enrich, Validate and Load](/blog/ecommerce-data-pipeline-scrape-normalize-enrich/).
