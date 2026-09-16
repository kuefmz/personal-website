---
title: "Building Before You Trust: Evidence-First Public-Web Search"
description: "How I built Before You Trust with SearXNG, YaCy, identity confirmation, source filtering, privacy controls, and evidence-first search."
publishedAt: 2026-09-16
tags: ["Search Engineering", "SearXNG", "YaCy", "Privacy", "Web Development"]
category: "Projects"
draft: false
---

One of my recent side projects is **Before You Trust**, a public-web research tool designed around a simple idea: before drawing conclusions about a person or company, make sure you are looking at the right identity and the underlying sources.

The interesting technical decision is that the core search workflow **does not depend on an LLM**. Instead, it focuses on search coverage, identity matching, evidence filtering, and explicit user confirmation.

That constraint made the project a useful exercise in search engineering.

## The problem with name-based web search

Searching for a person by name is easy. Determining whether every result belongs to the same person is not.

Common names create obvious collisions, but even distinctive names can return:

- social profiles for different people;
- copied or syndicated articles;
- outdated pages;
- low-quality directory listings;
- results that mention the name without identifying the person;
- search snippets that look relevant but point to weak evidence.

A system that immediately summarizes all of those results risks producing a polished answer about the wrong person.

So I designed the workflow around **identity first, research second**.

## Step 1: search multiple public-web sources

Before You Trust uses self-hosted search infrastructure based on **SearXNG and YaCy**. The purpose is not to maximize the number of URLs. It is to obtain enough independent coverage to build plausible candidate identities without relying on a paid per-search API.

Results are normalized, deduplicated, bounded, and filtered before they reach the next stage.

This is similar to data engineering in miniature: raw search results are inputs, but they are not yet trustworthy data.

## Step 2: separate likely identities

The application groups evidence into candidate identities and asks the user to explicitly choose **“This is them”** before deeper research continues.

That interaction is important.

The system does not silently assume that the top search result is correct. The user remains part of the identity-resolution step, and deeper searches are anchored to the selected candidate.

For an evidence-heavy tool, this is more useful than pretending identity matching is perfectly automatic.

## Step 3: filter aggressively

Search systems often look better when they return more results, but quantity is not the same as quality.

For this project I deliberately prefer conservative filtering. Low-confidence results that may belong to a namesake should not be promoted into the final report simply because they match a keyword.

The final output is therefore closer to a **sourced research brief** than a generic search result page.

## Step 4: preserve evidence instead of generating a score

I also avoided a single “trust score” or “danger score”.

A numeric score can create false precision. Public-web evidence is incomplete, context dependent, and sometimes wrong. A result can be relevant without proving a claim, and an absence of results does not prove that somebody is safe.

The useful unit is the source itself: what was found, where it came from, and why it appears connected to the selected identity.

## Privacy was an architectural requirement

Ordinary searches are transient rather than stored as a permanent search-history database. Search and report request bodies are excluded from application logs and analytics, and optional report delivery is only triggered when a user explicitly requests it.

The project also includes consent-aware analytics and clear limitations around appropriate use.

These choices add implementation work, but they are part of the product rather than legal text added at the end.

## What this project taught me

Before You Trust reinforced a lesson I have seen in document processing and data pipelines as well: **reliability often comes from controlling the boundaries around a model or search engine, not from making the central algorithm more complicated**.

The important pieces are:

1. normalize the input;
2. keep provenance;
3. reject uncertain matches;
4. make assumptions visible;
5. let a user verify ambiguous identity decisions;
6. test the full workflow, not only one function.

Those principles also apply to RAG systems, OCR pipelines, entity resolution, and structured extraction.

Before You Trust is still a public-web research assistant rather than a background-check service, and its coverage can be incomplete. But as an engineering project, it has been a useful way to explore how far careful search, filtering, and product design can go **without using AI as a shortcut for every step**.
