# Jenifer Ciuciu-Kiss — Personal Website

Static, content-driven portfolio website for Jenifer Tabita Ciuciu-Kiss, an AI and Data Engineer in Zurich working across machine learning, LLM/RAG systems, OCR and document automation, data pipelines, knowledge graphs, semantic web research, and research software classification.

Built with Astro, TypeScript, Markdown content collections, and GitHub Pages deployment.

## Local Setup

Node.js 22.12 or newer is required.

```sh
npm install
npm run dev
```

Astro prints the local URL, usually `http://localhost:4321`.

## Commands

```sh
npm run check      # Astro type and content validation
npm run build      # check + production static build
npm run test:seo   # validates generated dist metadata, JSON-LD, links, H1s, and sitemap coverage
npm test           # production build + SEO smoke test
```

## Content Editing

Core profile data lives in `src/data/site.ts`: navigation, social links, email, CV path, experience, education, skills, and site-wide professional positioning.

Markdown collections live in:

- `src/content/projects/`
- `src/content/publications/`
- `src/content/blog/`

Main Astro routes live in `src/pages/`, including About, Projects, Research, Publications, Blog, Technical Skills, Talks/Conferences, and Contact. The main navigation keeps About as the hub for profile, experience, education, skills, and CV.

## Add A Project

Create `src/content/projects/my-project.md`:

```md
---
title: "My project"
description: "A concise summary for cards, metadata, and search snippets."
date: "2026-07-14"
status: "Prototype"
category: "Data"
tags: ["Machine Learning", "Data Engineering"]
technologies: ["Python", "SQL", "Docker"]
featured: false
previewImage: "/images/projects/example.png"
previewImageAlt: "Screenshot of the example project"
links:
  - label: "View source"
    href: "https://github.com/example/repo"
---

Write the case study with problem, context, role, approach, technologies, outcomes if public, lessons learned, and related links.
```

Valid project categories are `Product`, `Data`, `Automation`, and `Website`.

## Add A Publication

Create `src/content/publications/my-publication.md`:

```md
---
title: "Publication title"
abstract: "A short abstract used on publication pages and metadata."
authors: ["Jenifer Tabita Ciuciu-Kiss", "Co-author"]
date: "2026-07-14"
venue: "Conference or journal"
type: "Conference paper"
keywords: ["Knowledge Graphs", "Research Software"]
featured: true
doi: "https://doi.org/..."
pdf: "/assets/paper.pdf"
bibtex: |
  @inproceedings{example2026,
    title={Publication title},
    year={2026}
  }
citation: "Ciuciu-Kiss, J. T. (2026). Publication title."
project: "related-project-slug"
links:
  - label: "Source repository"
    href: "https://github.com/example/repo"
---

Add a plain-language summary and links to related projects where appropriate.
```

Valid publication types are `Journal article`, `Conference paper`, `Workshop paper`, `Thesis`, and `Report`.

## Add An Article

Create `src/content/blog/my-article.md`:

```md
---
title: "Article title"
description: "A short summary used on cards and by search engines."
publishedAt: 2026-07-14
tags: ["AI Engineering", "RAG"]
category: "AI Engineering"
draft: false
---

Write the article using Markdown headings, lists, and links.
```

Set `draft: true` to keep unfinished articles out of the site and RSS feed.

## SEO Checklist

Before publishing:

- Run `npm test`.
- Confirm every public page has one clear H1, a unique title, and a unique meta description.
- Keep internal links descriptive and route-based, for example `/projects/research-software-classification/`.
- Add project/publication relationships with the `project` frontmatter field only when the project slug exists.
- Avoid invented claims, confidential employer details, fake metrics, or unsupported publication statuses.
- Add image dimensions, useful alt text, and compressed screenshots when adding previews.
- Keep JSON-LD page-specific and factual; shared Person/WebSite schema is generated in `BaseLayout`.
- Use `noindex` only for utility pages such as thank-you and 404 pages.

## Deployment

The GitHub Actions workflow builds the static site on pushes to `main`, publishes `dist` to `gh-pages`, and deploys with GitHub Pages. The custom domain is preserved through `public/CNAME`.

Generated crawl files come from Astro routes/integrations:

- `src/pages/robots.txt.ts`
- `src/pages/rss.xml.js`
- `@astrojs/sitemap`

Do not add static `robots.txt`, `rss.xml`, or sitemap XML files to `public/`; they can shadow generated output.

## Static Forms

Newsletter subscriptions and project requests post to the Google Apps Script endpoint configured as `formsEndpoint` in `src/data/site.ts`. The site sends JSON as `text/plain` so static GitHub Pages hosting can submit cross-origin requests without a CORS preflight.

See [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md) for a more detailed editor guide.
