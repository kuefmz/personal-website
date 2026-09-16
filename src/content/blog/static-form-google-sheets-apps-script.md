---
title: "Static Website Form to Google Sheets with Google Apps Script"
description: "How to connect an Astro or static website form to Google Sheets using Google Apps Script, with validation, UTM tracking, email status, and no backend server."
publishedAt: 2026-09-08
tags: ["Google Apps Script", "Google Sheets", "Astro", "Forms", "Automation"]
category: "Automation"
draft: false
---

One useful pattern for a small product site is a **static website form that writes to Google Sheets**. You get a simple data store and operational view without deploying a dedicated backend.

I used this pattern for the Slap AI pre-launch flow.

## The architecture

The flow is deliberately small:

`Static website -> fetch() -> Google Apps Script web app -> Google Sheet -> email workflow`

The website stays static. Google Apps Script acts as the HTTP endpoint and writes the request into a Sheet.

This works well for a launch list, contact form, lightweight preorder interest, or internal lead capture where a full application backend would be unnecessary.

## What I capture

A form becomes much more useful when it records attribution from the beginning.

For Slap AI, the payload is designed to support fields such as:

- email;
- name;
- type of signup;
- quantity;
- source;
- campaign;
- consent;
- current page;
- `utm_source`;
- `utm_medium`;
- `utm_campaign`;
- `utm_content`;
- `utm_term`.

That gives the Sheet enough context to answer questions later without trying to reconstruct where a signup came from.

## Keep the endpoint configurable

I store the endpoint in configuration rather than hardcoding it throughout the frontend.

Conceptually:

```ts
export const SIGNUP_ENDPOINT = "https://script.google.com/.../exec";
```

The form can then post URL-encoded or JSON data depending on the Apps Script handler.

If the endpoint is missing, the frontend should show a configuration error rather than pretending that a submission succeeded.

## Validate before writing

The Apps Script should not append every request blindly.

At minimum I validate required values such as the email field. For more important forms, I also recommend validating length, allowed types, expected campaign fields, and any quantity fields before the row is written.

A useful pattern is:

1. acquire a script lock;
2. parse and validate the request;
3. find the target sheet;
4. append the row;
5. trigger downstream email logic;
6. record success or error status;
7. release the lock.

The lock matters because multiple visitors can submit at roughly the same time.

## Track email state separately

A row should distinguish between "form received" and "confirmation email sent."

For example, a status column can move through values such as:

- Pending;
- Sent;
- Error.

This makes failures visible. Without that field, an appended row can look successful even when the email step failed.

## Static-site form challenges

The difficult parts are usually integration details rather than the Sheet itself.

### CORS and response handling

Apps Script web apps have their own behavior around redirects and browser requests. Depending on how the endpoint is implemented, a normal `fetch()` may need careful response handling.

### Duplicate submissions

A user may click twice, refresh, or retry after a slow response. For important flows, check for duplicates using a stable identifier or recent matching email.

### Formula injection

If arbitrary user input is written into a spreadsheet, values beginning with spreadsheet formula characters should be sanitized before writing.

### Secrets

A static frontend cannot safely contain secrets. The endpoint can be public, but credentials and privileged operations belong inside Apps Script or another backend.

## Add analytics only after consent

The form itself can work without analytics.

If analytics consent exists, I track events such as:

- form view;
- submit attempt;
- success;
- error;
- preorder CTA click.

UTM parameters can still be submitted with the form even when analytics scripts are disabled, depending on the site's privacy design.

## When Google Sheets is the right choice

Google Sheets is useful when:

- traffic is modest;
- humans need to inspect or edit rows;
- the workflow is operational rather than transactional;
- you want a low-cost bridge before building a full backend.

It is not a replacement for a transactional database when concurrency, strict consistency, authentication, or complex relational queries become important.

For Slap AI, the lightweight approach matched the stage of the product and kept the pre-launch architecture simple.

See [Building Slap AI](/blog/slap-ai-astro-github-pages-prelaunch/) for the wider site architecture.
