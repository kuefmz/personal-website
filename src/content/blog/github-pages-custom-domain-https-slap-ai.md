---
title: "GitHub Pages Custom Domain and HTTPS: Lessons from Slap AI"
description: "A practical guide to GitHub Pages custom domains, DNS records, HTTPS certificate issues, apex vs www, and deployment debugging based on Slap AI."
publishedAt: 2026-09-07
tags: ["GitHub Pages", "DNS", "HTTPS", "Astro", "Deployment"]
category: "Web Engineering"
draft: false
---

Deploying a static website to GitHub Pages is easy until a custom domain enters the picture. While building **Slap AI**, the site itself worked, but the custom-domain transition exposed the usual combination of DNS, certificate, and path problems.

This is the checklist I now use for **GitHub Pages custom domain and HTTPS** debugging.

## Understand the three separate layers

When a custom domain fails, it helps to separate three systems:

1. the static build;
2. DNS resolution;
3. TLS/HTTPS certificate issuance.

A successful `npm run build` only proves that the site can be generated. It says nothing about whether the domain points to GitHub or whether GitHub has issued a certificate for that hostname.

That separation makes debugging much faster.

## Start by confirming the build URL

GitHub Pages can serve a user site or a project site. A project site may originally live under a path such as:

`https://username.github.io/project-name/`

If an Astro project is configured around that base path and then moves to a root custom domain, asset URLs can break even when DNS is correct.

The site configuration therefore needs to match the final deployment model. Check:

- Astro `site`;
- Astro `base`;
- generated asset paths;
- canonical URLs;
- sitemap URLs;
- internal absolute links.

A browser showing the HTML but failing to load CSS or images is often a base-path problem rather than a DNS problem.

## Decide how apex and www should behave

A domain can be accessed through an apex hostname such as `example.com` and a subdomain such as `www.example.com`.

Do not treat these as automatically interchangeable. Decide which one is canonical and configure the other to resolve or redirect consistently.

Problems appear when:

- the apex points to one host while `www` points somewhere else;
- old hosting records remain active;
- the GitHub Pages custom-domain setting contains a different hostname from the one being opened;
- a registrar or previous hosting provider still has stale records.

When debugging, I check the actual DNS records rather than only the registrar's visual dashboard.

## Why HTTPS can fail after DNS looks correct

During the Slap AI setup I encountered a certificate hostname mismatch. Errors such as `ERR_CERT_COMMON_NAME_INVALID` mean the browser received a certificate that does not match the requested hostname.

Common causes include:

- DNS still reaching the previous host;
- GitHub Pages has not finished provisioning the certificate;
- the repository custom-domain setting is wrong;
- apex and `www` are configured inconsistently;
- stale records are still resolving for some clients.

This is why changing DNS repeatedly while certificate issuance is still in progress can make the situation harder to reason about.

## My debugging order

I now debug custom-domain deployments in this order:

### 1. Build locally

```bash
npm install
npm run build
```

If the build fails, fix that before looking at DNS.

### 2. Verify GitHub Pages on its generated URL

Confirm that the deployed site works before involving the custom domain.

### 3. Verify the repository custom-domain configuration

The exact hostname must match the intended domain.

### 4. Inspect DNS

Confirm that the live records point to the intended GitHub Pages configuration and remove obsolete records that can send traffic elsewhere.

### 5. Wait for certificate provisioning before changing unrelated settings

If DNS is correct, give the certificate process a chance to complete.

### 6. Test both HTTP and HTTPS, apex and www

This reveals inconsistent host behavior quickly.

## Add deployment checks before DNS debugging

A custom domain can distract from problems that existed before the domain change.

For Astro projects, I prefer a deployment gate that checks:

- production build succeeds;
- expected files exist in `dist/`;
- canonical URL is correct;
- sitemap and robots files are generated;
- internal links use the intended base;
- the custom-domain file or Pages setting is correct.

That makes the DNS investigation smaller.

## The broader lesson

A custom domain is not a single switch. It is a chain from source code to generated files to GitHub Pages to DNS to TLS.

When each layer is checked independently, errors become much less mysterious.

For the project architecture behind this deployment, see [Building Slap AI: An Astro Pre-Launch Site on GitHub Pages](/blog/slap-ai-astro-github-pages-prelaunch/).
