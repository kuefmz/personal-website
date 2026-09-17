---
title: "Slap AI"
description: "A static Astro pre-launch product website built to validate demand, capture signups, and support analytics and launch messaging for a novelty physical product."
date: "2026-09"
status: "Pre-launch"
category: "Product"
tags: ["Product Launch", "Astro", "Conversion", "Analytics", "Static Site"]
technologies: ["Astro", "HTML", "CSS", "JavaScript", "GitHub Pages", "Google Analytics 4", "Google Tag Manager"]
featured: false
previewImage: "/images/projects/slap-ai-desktop.png"
previewImageAlt: "Screenshot of the Slap AI product landing page"
previewUrl: "https://slap-ai.com/"
links:
  - label: "Visit Slap AI"
    href: "https://slap-ai.com/"
---

Slap AI is a deliberately simple pre-launch product website for a novelty desk product inspired by frustrating or confidently wrong AI answers. The site is designed around validating interest before adding unnecessary backend complexity.

## Context

For an early-stage physical product, the website has a different job from a mature application: explain the concept quickly, make the product memorable, capture demand, and give marketing experiments a measurable destination.

## My role

I designed and developed the pre-launch website, conversion flow, analytics setup, signup integration, deployment, and launch-oriented content structure.

## Engineering challenges

- Keep the site static while still supporting signup and preorder-oriented workflows.
- Connect an external signup endpoint without introducing a full application backend.
- Add analytics and consent handling without slowing down the landing page.
- Configure GitHub Pages and the custom domain reliably.
- Keep the product story focused enough for traffic from social posts and ads.

## Architecture

The public site is built with Astro, HTML, CSS, and minimal client-side JavaScript. Signup data is handled through an external endpoint rather than a dedicated application database, which keeps the pre-launch stack small while still supporting demand validation.

## Related writing

- [Building Slap AI: an Astro pre-launch site on GitHub Pages](/blog/slap-ai-astro-github-pages-prelaunch/)
- [GitHub Pages custom domain and HTTPS lessons from Slap AI](/blog/github-pages-custom-domain-https-slap-ai/)
- [Static website form to Google Sheets with Apps Script](/blog/static-form-google-sheets-apps-script/)
