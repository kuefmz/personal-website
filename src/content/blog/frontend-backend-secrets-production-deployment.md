---
title: "How to Keep API Keys and Admin Secrets Safe in a Frontend + Backend App"
description: "A practical deployment pattern for keeping API keys, database credentials, and admin secrets out of public frontend code."
publishedAt: 2026-09-24
tags: ["API Security", "Environment Variables", "Frontend", "Backend", "Deployment"]
category: "Web Engineering"
draft: false
---

Modern small web applications are often split into two deployments:

- a static frontend;
- a hosted backend API.

This is a clean architecture, but it creates an important security boundary.

**Anything shipped to the browser must be treated as public.**

That includes JavaScript bundles, HTML, network calls, and frontend environment variables that are compiled into the build.

## Public and private configuration are different

A public frontend may safely contain information such as:

- the backend API URL;
- public analytics IDs;
- public feature flags;
- non-secret application metadata.

It should not contain:

- database passwords;
- admin tokens;
- private API keys;
- SMTP credentials;
- service-account secrets;
- internal webhook secrets.

A variable being stored in a deployment dashboard does not automatically make it secret. If the frontend build embeds it in JavaScript, users can inspect it.

## Privileged operations belong behind the backend

Suppose a page needs to generate a report using a paid external API.

The unsafe pattern is:

`Browser -> external API with private key`

The safer pattern is:

`Browser -> application backend -> external API`

The backend can then:

- hold the key privately;
- validate requests;
- rate-limit usage;
- sanitize inputs;
- log failures;
- return only the required result.

This also makes it easier to replace providers later.

## Admin endpoints need more than an obscure URL

An endpoint such as `/admin/history` is not protected simply because users are unlikely to guess it.

Administrative operations should require explicit authorization.

For a small internal tool, this might begin with a strong server-side admin secret.

More mature systems may use:

- authenticated user accounts;
- OAuth/OIDC;
- role-based permissions;
- signed sessions;
- IP restrictions;
- VPN access.

The appropriate level depends on the risk and audience.

## Never put an admin secret in frontend code

If a browser needs to send an admin secret, every person using that page can potentially inspect it.

A safer admin interface requires an authentication flow that produces a limited session or token rather than exposing the underlying service secret.

For very small tools, keeping the admin functionality server-side or inaccessible from the public frontend may be simpler.

## Use environment variables deliberately

Backend secrets belong in the hosting platform's secret/environment configuration.

Useful practices include:

- different values for development and production;
- no secrets committed to Git;
- no secrets in screenshots or documentation;
- regular rotation;
- least-privilege credentials;
- clear naming.

A `.env.example` file can document required variable names without containing real values.

## CORS is not authentication

Cross-Origin Resource Sharing controls which browser origins may make certain requests.

It does not prove who the caller is.

CORS can reduce accidental browser access, but it does not replace:

- authentication;
- authorization;
- request validation;
- rate limiting.

Server-to-server callers do not need to respect browser CORS rules.

## Validate every public request

A public backend endpoint should assume that requests can be manipulated.

Validate:

- types;
- lengths;
- allowed values;
- URLs;
- required fields;
- file sizes;
- pagination limits.

This protects both the application and any paid services behind it.

## Protect expensive operations

AI calls, crawlers, report generation, and large database queries can create real cost.

Useful controls include:

- per-IP or per-user rate limits;
- job quotas;
- maximum input size;
- timeouts;
- caching;
- duplicate-request detection;
- queue limits.

Security and cost control often overlap.

## Keep logs useful but sanitized

Logs should help answer what happened without leaking private data.

Avoid writing:

- passwords;
- access tokens;
- complete API keys;
- sensitive form contents;
- database connection strings.

Structured logs with request IDs and status codes are usually more useful than dumping entire request objects.

## The deployment boundary is the key concept

The frontend is a public client.

The backend is the trusted execution environment.

Once that distinction is explicit, decisions around API keys, admin routes, paid services, and database access become much clearer.

For a broader system-integration pattern, see [How to Connect Business Systems with APIs and Webhooks](/blog/custom-api-integration-business-systems/).

Need to productionize a prototype without exposing its internal credentials? [Share the deployment setup here](/contact/#project-request/).
