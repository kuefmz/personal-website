---
title: "Building Websiteli with Astro: Multilingual SEO for a Service Website"
description: "How I structured Websiteli with Astro, localized routes, canonical URLs, hreflang, structured data, sitemaps, analytics, and reusable SEO content."
publishedAt: 2026-09-09
tags: ["Astro", "Multilingual SEO", "Technical SEO", "Web Development", "Websiteli"]
category: "Web Engineering"
draft: false
---

Building a multilingual service website is not just a translation problem. It is a routing, metadata, internal-linking, and maintenance problem.

For **Websiteli**, I use Astro to generate a static site with localized service, industry, portfolio, partner, pricing, and blog pages. The goal is to keep the site fast while making every locale understandable to search engines.

## Localized routes need a predictable structure

Websiteli uses language routes such as:

- `/en/`;
- `/de/`;
- `/hu/`;
- `/es/`;
- `/fr/`;
- and additional supported locales.

The language belongs in the URL, while other concerns such as market-based pricing are handled separately. That distinction is important because language and commercial market are not the same thing.

A visitor can read English while still belonging to a Swiss pricing market.

## Canonical and hreflang have different jobs

On multilingual sites I treat canonical URLs and `hreflang` as separate signals.

The canonical URL identifies the preferred URL for that specific page. `hreflang` connects language or regional alternatives.

For generated pages, this needs to be systematic. Manually maintaining alternate links across many services, industries, and blog posts does not scale.

The layout therefore provides shared metadata behavior while route/content modules provide page-specific titles and descriptions.

## Generate SEO pages from structured content

A repeated service page should not be copied and edited manually 20 times.

Websiteli keeps reusable service data in content modules and generates routes around it. A service entry can provide:

- slug;
- title;
- description;
- customer problem;
- solution;
- benefits;
- technologies;
- pricing connection;
- related services;
- FAQ content.

The route can then consistently generate canonical tags, Open Graph data, structured data, breadcrumbs, internal links, and CTAs.

This is one of the reasons Astro works well for **technical SEO on service websites**: content can stay structured while the output is normal crawlable HTML.

## Structured data should match the actual page

The site uses global schema where appropriate and route-specific schema for specific content types.

Examples include:

- Organization;
- WebSite;
- ProfessionalService;
- Service;
- FAQ;
- Article;
- BreadcrumbList.

The important rule is not to add schema because a validator accepts it. The structured data should reflect what the visible page actually contains.

## Sitemap and robots files need deliberate filtering

Large multilingual sites can accidentally create many low-value URLs through redirects, legacy routes, or demo pages.

The sitemap should contain canonical crawlable pages, not every path the application happens to support.

In Websiteli, the sitemap filters out redirect-only and legacy namespaces. `robots.txt` then points crawlers to the sitemap rather than trying to replace it.

## Internal linking matters more as the site grows

A site with services, industries, portfolio projects, partners, pricing, and blog content needs intentional links between those systems.

A blog article about automation should be able to lead to the relevant service. An industry page should link to services that solve its described problems. A portfolio page should link back into the capabilities demonstrated by the project.

This creates navigational value for users and a clearer content graph for search engines.

## Multilingual content creates a maintenance challenge

The engineering problem becomes keeping metadata and shared components synchronized as the site changes.

I prefer:

- shared content schemas;
- localized content files or typed modules;
- English fallback only where intentionally designed;
- reusable components;
- automated build checks;
- no manual page duplication when a data-driven route can generate the page.

That reduces the chance that one locale silently loses metadata, CTA behavior, analytics, or internal links.

## Performance is part of SEO architecture

Astro generates static output, so most pages do not need a large client-side JavaScript bundle.

I keep browser JavaScript focused on things that genuinely need it: analytics, forms, pricing resolution, navigation, theme behavior, and feedback UI.

The result is a multilingual site where SEO is not a plugin added after development. It is part of the content and route architecture.

You can see the project at [Websiteli](https://websiteli.ch/).
