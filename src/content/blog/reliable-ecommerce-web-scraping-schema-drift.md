---
title: "Reliable E-commerce Web Scraping: Locale Redirects, Schema Drift and Validation"
description: "Lessons from scraping e-commerce sites reliably when locale redirects, changing HTML, incomplete categories, anti-bot behavior, and schema drift break assumptions."
publishedAt: 2026-09-14
tags: ["Web Scraping", "E-commerce", "Schema Drift", "Data Validation", "Python"]
category: "Data Engineering"
draft: false
---

A scraper that works once is not yet a reliable data source.

While building the Orgelia catalog pipeline, I ran into the kinds of problems that make **e-commerce web scraping** difficult in production: locale redirects, missing product groups, unstable markup, inconsistent descriptions, and outputs that look valid syntactically while being wrong semantically.

## Validate the live site before blaming the parser

One of the easiest mistakes is to assume that a missing field is a selector bug.

Before changing parsing logic, check what the website actually returned.

A request can land on:

- another locale;
- a consent page;
- a redirect;
- a category landing page;
- a blocked response;
- a simplified mobile page;
- a page with client-rendered data missing from raw HTML.

The scraper should record the final URL and enough response metadata to reveal this.

## Locale redirects can silently change meaning

Multi-country stores often redirect based on language, cookies, region, or hostname.

A crawler requesting a Spanish URL may receive another locale without failing at the HTTP layer.

If the pipeline only checks for status `200`, it can ingest the wrong market.

Useful validation includes:

- expected hostname;
- expected locale path;
- canonical URL;
- language markers;
- currency;
- country-specific shop metadata.

A successful HTTP response is not the same as a correct source response.

## HTML selectors are only one extraction strategy

Modern e-commerce pages may contain useful product data in several places:

- visible HTML;
- JSON-LD;
- embedded application state;
- API responses;
- script tags;
- structured attributes.

I prefer extracting from the most stable structured source available, then using HTML as a fallback where necessary.

The pipeline should still verify the result because structured data can also be incomplete.

## Description-based classification can mislead

Product categories are not always explicit.

Inferring product type from descriptions can help fill gaps, but it creates a second-order problem: marketing text may mention accessories, compatible products, materials, or use cases that do not define the product itself.

This can produce false classifications.

For sensitive or heterogeneous catalogs, I prefer combining multiple signals and keeping a confidence or review path rather than treating a single keyword as truth.

## Schema drift needs a hard contract

A scraper can continue running after a source change while producing malformed records.

This is why I validate output against a strict contract before downstream processing.

Checks can include:

- required fields exist;
- types are correct;
- identifiers are strings rather than serialized objects;
- URLs are valid;
- currency and country values are allowed;
- arrays contain the expected element type;
- categories belong to a known taxonomy.

A crawl should fail loudly if the output shape no longer matches the contract.

## Sample the data, not just the logs

A pipeline can report "8,000 products scraped" and still be wrong.

After large crawls I want representative samples:

- first records;
- random records;
- records by category;
- records with missing fields;
- records with unusual prices;
- records rejected by validation.

This catches systematic mistakes that aggregate counts hide.

## Keep scraping separate from normalization

Source-specific scraper code should focus on faithfully extracting source data.

Normalization belongs in a later stage.

This boundary matters because when a source changes, I can fix the scraper without rewriting the catalog model. When the internal schema changes, I can rerun normalization without necessarily recrawling the site.

## Reliability is the real scraping problem

The hardest part of scraping is not writing a selector. It is detecting when the assumptions behind the selector are no longer true.

A maintainable scraper therefore needs:

- source checks;
- locale checks;
- structured validation;
- reproducible outputs;
- error samples;
- retry strategy;
- clear stage boundaries.

That is the mindset I now use for Orgelia's product and shop ingestion.

For the larger architecture, see [E-commerce Data Pipeline Design](/blog/ecommerce-data-pipeline-scrape-normalize-enrich/) and [Product Matching Across Stores and Languages](/blog/ecommerce-product-matching-across-stores-languages/).
