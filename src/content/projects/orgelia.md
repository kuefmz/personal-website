---
title: "Orgelia"
description: "A multilingual product and shop discovery platform with structured catalog data, maps, comparison-oriented browsing, and a dedicated data pipeline."
date: "2026-08"
status: "Active product"
category: "Product"
tags: ["Product Discovery", "Data Engineering", "Web Scraping", "Entity Resolution", "Multilingual"]
technologies: ["Astro", "TypeScript", "Python", "PostgreSQL", "JSONL", "Web Scraping", "AWS"]
featured: true
previewImage: "/images/projects/orgelia-desktop.png"
previewImageAlt: "Screenshot of the Orgelia product and shop discovery website"
previewUrl: "https://orgelia.com/"
links:
  - label: "Visit Orgelia"
    href: "https://orgelia.com/"
  - label: "View data pipeline"
    href: "https://github.com/kuefmz/orgelia-data-pipeline"
---

Orgelia is a multilingual discovery and comparison platform for intimate products and shops. The project combines a public browsing experience with a separate data engineering pipeline for collecting, normalizing, enriching, validating, matching, and loading catalog data.

## Context

Product comparison becomes difficult when the same item appears across stores with different names, languages, descriptions, variants, and identifiers. Shop discovery adds another layer: locations, country coverage, map data, and structured business information need to stay consistent as the platform expands.

## My role

I designed and developed the product architecture, frontend experience, catalog pipeline, analytics, and supporting automation. I also worked on the scraper and normalization strategy used to transform store-specific source data into a reusable catalog model.

## Engineering challenges

- Separate source-specific scraping from the validated catalog served by the application.
- Normalize heterogeneous product and shop data across countries and languages.
- Preserve raw source records so transformations remain reproducible.
- Match products conservatively when names and descriptions differ between stores.
- Detect schema drift, locale redirects, missing fields, and scraper regressions.
- Keep product identity separate from store-specific offers and prices.

## Data pipeline

The pipeline follows a staged structure: scrape, normalize, enrich, validate, match, and load. JSONL is used as a durable intermediate format before validated records are loaded into PostgreSQL.

## Related writing

- [Building Orgelia: architecture for a multi-country product comparison platform](/blog/orgelia-product-comparison-platform-architecture/)
- [E-commerce data pipeline design](/blog/ecommerce-data-pipeline-scrape-normalize-enrich/)
- [Product matching across stores and languages](/blog/ecommerce-product-matching-across-stores-languages/)
- [Reliable e-commerce web scraping](/blog/reliable-ecommerce-web-scraping-schema-drift/)
- [JSONL to PostgreSQL catalog pipelines](/blog/jsonl-postgresql-catalog-data-pipeline/)
