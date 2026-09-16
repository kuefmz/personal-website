---
title: "Product Matching Across Stores and Languages: E-commerce Entity Resolution"
description: "How to match the same product across e-commerce stores and languages using identifiers, normalized attributes, variants, and conservative entity-resolution rules."
publishedAt: 2026-09-13
tags: ["Product Matching", "Entity Resolution", "E-commerce", "Data Engineering", "Multilingual Data"]
category: "Data Engineering"
draft: false
---

A price comparison platform needs to answer a deceptively difficult question:

**Are these two listings actually the same product?**

This is the core **product matching** problem I encountered while building Orgelia across multiple shops and countries.

## Why product matching is difficult

Each retailer controls its own catalog.

The same product can appear with different:

- titles;
- languages;
- punctuation;
- brand formatting;
- size units;
- variant names;
- descriptions;
- category paths;
- images.

One store may expose a manufacturer code while another omits it. One may translate the product name while another keeps the original brand wording.

A string comparison is therefore not enough.

## Start with strong identifiers

When reliable identifiers exist, they should be used before fuzzy techniques.

Examples include:

- GTIN/EAN;
- UPC;
- manufacturer part number;
- stable model number;
- source-specific SKU combined with source identity.

But identifiers also need validation. A field called `sku` is often only meaningful within one retailer.

The pipeline should distinguish global identifiers from local source identifiers.

## Normalize before comparing

Matching raw strings makes small formatting differences look important.

Before generating candidate matches, I normalize fields such as:

- case;
- whitespace;
- Unicode;
- punctuation;
- units;
- common brand variations;
- size representation;
- variant representation.

The original value should still be retained for traceability.

## Product identity includes the variant

Two listings can share the same base product but represent different purchasable variants.

For comparison purposes, differences such as these can matter:

- size;
- color;
- capacity;
- pack quantity;
- included accessories;
- model revision.

That means "same product family" and "same purchasable item" should be different concepts in the data model.

A comparison engine should not show two prices as directly comparable if one listing contains a materially different variant.

## Multilingual matching needs language-independent signals

Translation makes title similarity less reliable.

For cross-language catalogs, useful signals include:

- brand;
- identifiers;
- structured attributes;
- normalized measurements;
- model codes;
- category mappings;
- images or image hashes when appropriate;
- product-family metadata.

Text similarity can help, but I do not want language to be the only reason two products match.

The goal is a stable product identity that survives source wording changes.

## Use candidate generation before expensive comparison

As catalogs grow, comparing every record with every other record becomes impractical.

A more scalable approach is:

1. block or group records using strong fields;
2. generate plausible candidates;
3. compute richer comparison features only for those candidates;
4. accept high-confidence exact matches;
5. send ambiguous cases to review or leave them unmatched.

Blocking can use brand, category, identifiers, model fragments, or compatible normalized attributes.

## Conservative matching is better than confident mistakes

A false positive can be worse than a missed match.

If two different products are incorrectly merged, the platform can show a misleading price comparison. That damages trust in the catalog.

I therefore prefer three states:

- exact match;
- possible/similar match;
- no match.

The threshold for "exact" should be deliberately high.

## Store the reason for the match

A useful matched record should be explainable.

Instead of only storing `product_id = 123`, keep evidence such as:

- exact identifier match;
- brand + model match;
- normalized title similarity;
- matching size and variant;
- manual confirmation.

This makes debugging much easier when a shop changes its catalog.

## Product matching belongs inside the pipeline

Matching should happen after basic normalization and validation, not inside the frontend.

The frontend needs a stable canonical product plus shop offers. It should not decide whether two listings are the same.

That separation lets matching rules improve without changing the public application contract.

For the full pipeline around this process, see [E-commerce Data Pipeline Design](/blog/ecommerce-data-pipeline-scrape-normalize-enrich/).
