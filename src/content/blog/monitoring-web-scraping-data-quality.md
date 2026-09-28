---
title: "How to Monitor a Web Scraping Pipeline Without Checking Data by Hand"
description: "How to detect scraper breakage with data-quality checks, schema monitoring, anomaly detection, crawl metrics, and targeted alerts."
publishedAt: 2026-09-26
tags: ["Web Scraping", "Data Quality", "Monitoring", "Python", "Data Pipeline"]
category: "Data Engineering"
draft: false
---

A scraper can finish successfully and still produce bad data.

That is what makes production web scraping difficult.

A page may return HTTP 200 while the product title is empty. A redesigned layout may move the price. A locale redirect may return the wrong market. A consent page may be parsed as if it were real content.

The monitoring problem is therefore not simply:

> Did the script crash?

It is:

> Does the output still look like the data that was expected?

## Track crawl health separately from data quality

Crawl metrics describe whether pages could be fetched.

Useful crawl metrics include:

- attempted URLs;
- successful responses;
- redirects;
- timeouts;
- 403/429 responses;
- parse failures;
- average response time.

Data-quality metrics describe whether the extracted records make sense.

Examples include:

- missing title rate;
- missing price rate;
- duplicate identifier rate;
- category distribution;
- records per source;
- average description length;
- currency distribution.

Both are needed.

A scraper can have a 99% request success rate and still have a broken parser.

## Define invariants for important fields

A data invariant is a condition that should usually remain true.

Examples:

- price should be positive;
- currency should belong to an allowed set;
- source URL should be present;
- product ID should not be empty;
- country should match the configured market;
- title length should exceed a minimum.

These checks catch problems close to the source.

They are much more useful than discovering bad records after they have already entered the application database.

## Monitor distributions, not only nulls

Schema changes can produce plausible but incorrect values.

Suppose a selector that previously captured the product category now captures a navigation label.

The field is not null, so a simple completeness check passes.

Distribution monitoring can reveal that 80% of records suddenly have the same category.

Useful distribution checks include:

- top values;
- unique counts;
- min/max;
- percentiles;
- language mix;
- length distributions.

Large changes should trigger inspection.

## Compare with the previous successful run

Historical baselines are powerful.

For each source, compare:

- number of records;
- missing-field rates;
- duplicate rates;
- price ranges;
- category mix;
- crawl duration.

The system does not need sophisticated machine learning to detect that a source dropped from 5,000 products to 37 overnight.

A simple threshold can catch many high-impact failures.

## Preserve raw evidence

When a parser fails, debugging is much easier if the original response is still available.

Depending on storage and legal constraints, preserve:

- raw HTML samples;
- response metadata;
- crawl timestamp;
- source URL;
- parser version.

This makes it possible to distinguish source changes from transformation bugs.

The broader pipeline architecture is described in [E-commerce Data Pipeline Design](/blog/ecommerce-data-pipeline-scrape-normalize-enrich/).

## Do not retry every failure forever

Retries consume resources and can hide permanent problems.

Classify failures.

A timeout may deserve a retry.

A deleted page may not.

A parser that repeatedly fails because the HTML changed should be flagged for code inspection rather than retried indefinitely.

Rate limits should also be treated explicitly instead of being mixed with every other 403-style error.

## Add source-level health summaries

For multiple-source pipelines, create a compact health table.

For example:

| Source | Crawl success | Records | Missing price | Status |
| --- | ---: | ---: | ---: | --- |
| A | 99.8% | 4,982 | 0.4% | healthy |
| B | 95.2% | 2,104 | 11.7% | warning |
| C | 100% | 42 | 0% | investigate volume |

This allows attention to be focused where it is needed.

## Alert on meaningful changes

Too many alerts are as bad as no alerts.

Good alerts should answer:

- what changed;
- which source is affected;
- how large the change is;
- when it started;
- what evidence is available.

Thresholds should reflect business impact rather than minor noise.

## Validate before loading production data

The most important boundary is before the application database.

A run with severe quality failures should be prevented from replacing known-good data automatically.

Possible states include:

- publish;
- publish with warning;
- quarantine;
- reject.

This gives the pipeline a safety mechanism.

For more on schema-change resilience, see [Reliable E-commerce Web Scraping and Schema Drift](/blog/reliable-ecommerce-web-scraping-schema-drift/).

## The practical goal

Production scraping is not about making HTML parsing clever.

It is about making failures **visible, diagnosable, and containable**.

Once monitoring is treated as part of the scraper rather than a separate afterthought, maintenance becomes much more predictable.

Need a data-collection pipeline that can run repeatedly without manual checking? [Describe the sources and required output here](/contact/#project-request).
