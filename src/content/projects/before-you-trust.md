---
title: "Before You Trust"
description: "An evidence-first public-web research tool for reviewing identity-related findings with explicit identity selection and source-oriented reporting."
date: "2026-08"
status: "Live product"
category: "Product"
tags: ["Search", "Privacy", "Public Web Research", "Trust", "Web Application"]
technologies: ["Python", "SearXNG", "YaCy", "AWS EC2", "Caddy", "JavaScript", "Google Analytics 4"]
featured: true
previewImage: "https://raw.githubusercontent.com/kuefmz/websiteli/main/public/images/portfolio/before-you-trust.webp"
previewImageAlt: "Screenshot of the Before You Trust public-web research interface"
previewUrl: "https://www.beforeyoutrust.org/"
links:
  - label: "Visit Before You Trust"
    href: "https://www.beforeyoutrust.org/"
  - label: "View source on GitHub"
    href: "https://github.com/kuefmz/before-you-trust"
---

Before You Trust is a public-web research tool designed to help users review identity-related information before making their own trust decisions. The interface separates search, candidate identity selection, and evidence review instead of collapsing everything into a single opaque score.

## Context

Name-based public-web research is noisy. Multiple people may share the same name, search engines return ambiguous results, and a system can easily overstate confidence if identity resolution is handled carelessly.

## My role

I designed and implemented the product flow, search infrastructure, evidence presentation, privacy choices, deployment, analytics, and supporting website experience.

## Approach

- Search public-web sources through a self-hosted search stack.
- Require explicit user confirmation of the intended identity before presenting a report.
- Preserve source links so findings remain inspectable.
- Avoid presenting a simplistic universal trust score as fact.
- Keep search results transient rather than building a persistent profile database.
- Provide a manual research path when automated matching is uncertain.

## Infrastructure

The project uses SearXNG and YaCy components behind a deployed web application, with AWS EC2 and Caddy supporting the public service. The implementation also includes analytics, SEO files, and an optional report-delivery flow.

## Related writing

- [Building Before You Trust: evidence-first public-web search](/blog/building-before-you-trust-evidence-first-search/)
