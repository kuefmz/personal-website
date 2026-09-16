---
title: "Building Slap AI: An Astro Pre-Launch Site on GitHub Pages"
description: "How I built Slap AI's pre-launch website with Astro, GitHub Pages, conversion-focused CTAs, analytics consent, and a lightweight static architecture."
publishedAt: 2026-09-06
tags: ["Astro", "GitHub Pages", "Product Launch", "Static Website", "Web Development"]
category: "Projects"
draft: false
---

**Slap AI** started as a deliberately simple product idea: a physical desk toy for the moment an AI system gives you a confidently wrong, frustrating, or hallucinated answer. The engineering challenge was different from the product joke itself. I needed a site that could explain the idea quickly, collect early demand, support a future pre-order flow, and stay cheap and easy to operate.

That made a static **Astro website deployed on GitHub Pages** a good fit.

## Why I chose a static architecture

A pre-launch site does not automatically need a backend. The first version of Slap AI only needed to:

- explain the product;
- show strong visual assets;
- drive a pre-order or waitlist action;
- collect email interest;
- record marketing attribution;
- support analytics and consent;
- serve legal pages.

Astro keeps the production output static while still giving me reusable components, typed configuration, and a proper build step. GitHub Pages then handles hosting without adding another application server.

For an early product, reducing infrastructure is useful. Every service that is not required is one less thing to configure, secure, monitor, or pay for.

## The landing page had to do one job

The site is intentionally not a large product catalog. It is a focused landing page.

The most important conversion paths are the pre-order CTA and email signup. That means the visual hierarchy has to make the product understandable before asking the visitor to act.

I treated the page as a sequence:

1. explain the product in the hero;
2. show what it looks like;
3. connect the joke to a recognizable AI frustration;
4. repeat the conversion action;
5. give visitors a low-commitment email signup option.

This is a useful pattern for any **product pre-launch landing page**: reduce the number of decisions while repeating the primary action at moments where the visitor has learned enough to continue.

## Static does not mean featureless

A static site can still support meaningful product instrumentation.

Slap AI includes cookie consent, analytics consent defaults, GA4/GTM integration, and exit-intent feedback. Consent is stored locally in the browser and optional analytics scripts are loaded only when the relevant consent exists.

The exit-feedback component is especially useful during a launch phase because traffic alone does not tell you why a visitor leaves. A lightweight question can reveal whether the issue is price, product clarity, trust, timing, or something else.

The important design decision is that these features should not turn a simple site into an unnecessarily complex application.

## The signup flow stays external

The frontend sends form data to an external endpoint rather than running its own backend. In my implementation, that endpoint can be a Google Apps Script web app connected to Google Sheets.

That keeps the page static while still allowing the product to capture:

- email;
- name;
- signup type;
- quantity or preorder interest;
- source;
- campaign;
- consent;
- page URL;
- UTM parameters.

I wrote a separate guide on the implementation in [How to Send a Static Website Form to Google Sheets with Apps Script](/blog/static-form-google-sheets-apps-script/).

## What was harder than expected

The difficult parts were not Astro components. They were the edges around deployment and conversion:

- making GitHub Pages paths behave correctly;
- moving from the GitHub Pages project URL to a custom domain;
- DNS and HTTPS certificate timing;
- preserving analytics consent correctly;
- connecting a static form to a reliable external workflow;
- keeping the CTA useful before a final checkout URL existed.

Those are common problems in small launch websites because the site itself is simple enough that infrastructure details become a large share of the work.

I cover the custom-domain side in [GitHub Pages Custom Domain and HTTPS: Lessons from Slap AI](/blog/github-pages-custom-domain-https-slap-ai/).

## What I would reuse

The main lesson from Slap AI is that a pre-launch stack should match the maturity of the product.

For a small physical-product experiment, I would reuse the same principles:

- static-first architecture;
- one clear conversion goal;
- configuration-driven external endpoints;
- explicit analytics consent;
- UTM capture from the beginning;
- a build step that fails before deployment if something is broken.

The result is a site that can be changed quickly without creating backend work before the product actually needs it.

You can see the project at [Slap AI](https://slap-ai.com/).
