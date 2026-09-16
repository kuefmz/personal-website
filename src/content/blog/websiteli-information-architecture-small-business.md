---
title: "Website Information Architecture for Small Businesses: Lessons from Websiteli"
description: "What I learned simplifying Websiteli's navigation, service positioning, portfolio, pricing, and conversion paths for a small-business technology website."
publishedAt: 2026-09-10
tags: ["Information Architecture", "Conversion", "SEO", "Small Business Website", "Websiteli"]
category: "Web Strategy"
draft: false
---

A technically complete website can still be difficult to understand.

That became an important problem while developing **Websiteli**. The site can cover websites, automation, AI integrations, custom software, analytics, internal tools, and technical support. All of those capabilities are real, but putting every capability into the first screen creates a new problem: the visitor has to decode the business before deciding whether it can help them.

This is where **website information architecture** becomes part of both conversion and SEO.

## More services can create less clarity

An engineering-oriented site naturally accumulates technical language.

Terms such as:

- RAG;
- embeddings;
- OCR;
- APIs;
- webhooks;
- data pipelines;
- local LLMs;

can be useful deeper in the site. They are less useful as the first explanation of what a small business can buy.

The redesign challenge was to preserve the technical depth without making the homepage feel like a list of implementation technologies.

## Lead with the customer's buying language

A small-business owner is more likely to begin with a goal such as:

- I need a better website;
- I want more leads;
- I want to automate repetitive work;
- I need forms and systems to connect;
- I need a custom internal tool.

The technology can appear after that.

This led me to make the homepage more website-first, while keeping automation, AI, and custom software available through service pages.

That is not about hiding technical capability. It is about sequencing information.

## Separate homepage, services, and proof

A homepage should not carry every detail.

I prefer a hierarchy where:

1. the homepage explains the core promise;
2. service pages explain specific problems and solutions;
3. portfolio pages provide evidence;
4. pricing gives commercial orientation;
5. blog posts answer narrower search questions;
6. contact forms capture context from the page that generated the inquiry.

Each layer has a different job.

## Real work should appear before concept work

A portfolio is strongest when visitors can tell what is real, what is live, and what is a concept.

For Websiteli, I separated real public projects from concept or demonstration work. The portfolio data model also makes it possible to mark whether a public URL has been verified before showing it as a clickable project link.

That is a small implementation detail, but it prevents the site from accidentally overstating unfinished work.

## Preserve SEO while changing navigation

A conversion redesign can damage SEO if it casually deletes or renames routes.

The safer approach is to preserve:

- established service URLs;
- industry URLs;
- blog URLs;
- canonical tags;
- `hreflang`;
- sitemap behavior;
- redirect compatibility;
- important anchors;
- structured data.

The visible hierarchy can change without destroying the URL structure that search engines already know.

## Forms should preserve the visitor's context

One useful architectural improvement is to include hidden metadata with inquiries.

A contact form can include:

- package key;
- related project;
- related demo;
- source page;
- inquiry intent;
- locale;
- pricing market;
- UTM parameters.

That means a lead arriving from an automation case study does not become a context-free row saying only "contact request."

This is especially useful when the same CTA component appears across many pages.

## The key lesson

Information architecture is not only about menus. It is the relationship between business positioning, page purpose, URL structure, internal links, evidence, and conversion paths.

The Websiteli redesign taught me that adding capabilities is easy. Making the site progressively reveal those capabilities in the order a visitor needs them is the harder engineering and product problem.

For the technical SEO side, see [Building Websiteli with Astro: Multilingual SEO for a Service Website](/blog/websiteli-astro-multilingual-seo/).
