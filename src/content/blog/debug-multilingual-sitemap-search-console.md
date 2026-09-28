---
title: "How to Debug a Multilingual Sitemap When Google Is Missing Pages"
description: "A practical checklist for multilingual sitemap, canonical, hreflang, routing, and Search Console issues when Google discovers only part of a website."
publishedAt: 2026-09-25
tags: ["Multilingual SEO", "Sitemap", "Google Search Console", "Technical SEO", "Astro"]
category: "Web Engineering"
draft: false
---

A multilingual website can look complete in the browser while search engines discover only a fraction of it.

The problem is usually not "SEO" in the abstract. It is a mismatch between **routing, canonicals, alternate-language signals, internal links, and the sitemap**.

A systematic debugging process is much faster than repeatedly resubmitting the same sitemap.

## Start with the generated URLs

First, list the URLs that should exist.

For a three-language site, that might look like:

```text
/en/
/en/blog/
/de/
/de/blog/
/hu/
/hu/blog/
```

If country-specific content also exists, decide whether country is represented in:

- the URL;
- page content;
- structured metadata;
- application filters.

Language and country are not always the same thing.

A German-language page can still target Switzerland, Germany, or Austria depending on the product.

## Check the actual production HTML

Do not rely only on the source code.

Fetch the deployed page and verify:

- canonical URL;
- `hreflang` links;
- language attribute;
- robots meta tag;
- title;
- description;
- internal links.

Static-site generators can produce different output from what was expected due to route generation, build configuration, or deployment settings.

## Canonicals should usually be self-referential

Each translated page should normally canonicalize to itself.

For example:

`/de/service/` -> canonical `/de/service/`

It should not automatically canonicalize to the English version simply because the content represents the same service.

Doing so can tell Google that the translated page is a duplicate that should not be indexed separately.

## Hreflang connects equivalents

Alternate-language links help search engines understand that several URLs represent equivalent content in different languages.

A page can expose:

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/service/" />
<link rel="alternate" hreflang="de" href="https://example.com/de/service/" />
<link rel="alternate" hreflang="hu" href="https://example.com/hu/service/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/service/" />
```

Each localized version should reference the others consistently.

For a broader multilingual architecture, see [Building Websiteli with Astro: Multilingual SEO](/blog/websiteli-astro-multilingual-seo/).

## The sitemap should contain canonical crawlable pages

A sitemap is not a dump of every route.

It should contain URLs that are intended to be indexed.

Common sitemap problems include:

- missing localized routes;
- redirect URLs;
- duplicate trailing-slash variants;
- staging domains;
- parameterized pages;
- old paths;
- pages marked `noindex`.

The sitemap and canonical strategy should agree.

## Verify internal linking

Search engines discover pages through links as well as sitemaps.

A translated section that exists only in a sitemap but is never linked from navigation is a weak architecture.

Useful linking patterns include:

- a language selector;
- localized navigation;
- localized blog index;
- related-content links;
- breadcrumbs.

Internal links should point directly to canonical URLs instead of through redirects.

## Test one page before debugging the whole site

Search Console's URL inspection is useful for checking whether a representative page is:

- reachable;
- indexable;
- canonicalized as expected;
- discovered through the sitemap.

Choose one known missing page and debug it completely.

Once the cause is understood, apply the fix systematically.

## DNS verification is a separate problem

Search Console property verification and page indexing are related operationally, but they are not the same process.

A correct TXT record proves domain ownership.

It does not guarantee that:

- the sitemap is correct;
- pages are indexable;
- canonicals are correct;
- Google has crawled the new routes.

This distinction prevents troubleshooting the wrong layer.

## Watch for build-time omissions

Static sites often generate routes from content collections or configuration.

A localized page may be missing because:

- the language was not included in route generation;
- content was filtered unexpectedly;
- the sitemap integration did not see the route;
- a deployment used an older build;
- a path was excluded by configuration.

Checking the final build output can reveal these issues quickly.

## Resubmit only after the source is fixed

Repeatedly submitting an unchanged sitemap does not solve structural problems.

A better sequence is:

1. fix routing and metadata;
2. deploy;
3. verify the production page;
4. verify the sitemap;
5. inspect representative URLs;
6. submit or resubmit the sitemap;
7. monitor indexing over time.

## The core principle

Multilingual SEO becomes much easier when every language version is treated as a first-class page with its own URL, canonical, metadata, and internal links.

The sitemap should then reflect that architecture rather than compensate for it.

Need help untangling multilingual routes, canonicals, or Search Console coverage? [Share the site and symptoms here](/contact/#project-request/).
