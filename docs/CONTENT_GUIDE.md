# Website Content Guide

This guide explains how to update the website without changing its component code.

## Quick Start

The website requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Open the local address printed by Astro, usually `http://localhost:4321`.

Before publishing changes, run:

```bash
npm run check
npm run build
```

If your computer still uses Node 20 and you do not have `nvm`, you can run Astro temporarily with Node 22:

```bash
npm exec --package=node@22 -- node node_modules/astro/bin/astro.mjs check
npm exec --package=node@22 -- node node_modules/astro/bin/astro.mjs build
```

## Where Content Lives

| Content | Folder or file |
| --- | --- |
| Projects and websites | `src/content/projects/` |
| Publications | `src/content/publications/` |
| Blog posts | `src/content/blog/` |
| Biography, experience, and education | `src/pages/about.astro` and `src/data/site.ts` |
| Homepage introduction | `src/pages/index.astro` |
| Contact page | `src/pages/contact.astro` |
| Social links and email | `src/data/site.ts` |
| Downloadable CV | `public/assets/jenifer_tabita_ciuciu_kiss_cv.pdf` |
| Profile photo | `public/images/jenifer-ciuciu-kiss.jpg` |
| Navigation | `navigation` in `src/data/site.ts` |

Files in the three content folders are Markdown. The block between the first two `---` lines is metadata called frontmatter. The text after it is the page content.

File names become URLs. For example:

```text
src/content/blog/my-new-post.md
→ /blog/my-new-post/
```

Use lowercase file names with words separated by hyphens. Do not rename a published file unless you also want its URL to change.

## Add a Blog Post

Create `src/content/blog/my-post-title.md`:

```md
---
title: "My post title"
description: "A short summary used on cards and by search engines."
publishedAt: 2026-06-14
tags: ["AI", "Research"]
category: "AI"
draft: false
linkedin: "https://www.linkedin.com/posts/..."
---

Write the introduction here.

## A section heading

Continue the post using normal Markdown.
```

Notes:

- Remove `linkedin` when the post was not originally published on LinkedIn.
- Set `draft: true` to keep an unfinished post out of the website and RSS feed.
- Posts are automatically ordered by `publishedAt`, newest first.
- The newest published post automatically appears on the homepage.
- Use `##` and `###` headings to generate a table of contents on longer posts.

## Add a Project or Website

Projects, products, automation concepts, data work, and websites all use the same collection.

Create `src/content/projects/my-project.md`:

```md
---
title: "My project"
description: "A concise explanation of what it is and why it matters."
year: 2026
status: "Active project"
category: "Product"
tags: ["AI", "Knowledge Graphs"]
technologies: ["Python", "Astro"]
featured: false
order: 10
links:
  - label: "Visit the project"
    href: "https://example.com/"
  - label: "View source"
    href: "https://github.com/example/repository"
---

Explain the problem, your contribution, the approach, and what you learned.
```

Valid categories are exactly:

- `Product`
- `Data`
- `Automation`
- `Website`

Projects are ordered by `year` from newest to oldest. `order` breaks ties between projects from the same year; a lower number appears first.

For website projects, put the live website URL first in `links`. The project card will display a direct **Visit website** link.

The newest project automatically appears on the homepage.

## Add a Publication

Create `src/content/publications/publication-name.md`:

```md
---
title: "Publication title"
abstract: "A short abstract for the publication list."
authors: ["Jenifer Ciuciu-Kiss", "Co-author"]
year: 2026
venue: "Conference or journal"
type: "Conference paper"
keywords: ["Knowledge Graphs", "Research Software"]
featured: true
doi: "https://doi.org/..."
pdf: "/assets/paper-file.pdf"
slides: "/assets/slides-file.pdf"
bibtex: |
  @inproceedings{example2026,
    title={Publication title},
    year={2026}
  }
citation: "Ciuciu-Kiss, J. T. (2026). Publication title."
project: "related-project-file-name"
links:
  - label: "Source repository"
    href: "https://github.com/example/repository"
order: 1
---

Add a plain-language explanation of the publication here.
```

Valid publication types are:

- `Conference paper`
- `Workshop paper`
- `Thesis`
- `Report`

To host a PDF on the website:

1. Put it in `public/assets/`.
2. Reference it as `/assets/file-name.pdf`.

The optional `project` value is the related project file name without `.md`. It creates a link from the publication to that project.

Publications are ordered by year, then by `order`. The newest publication automatically appears on the homepage.

## Edit the About Me Page

The personal story and page layout are in:

```text
src/pages/about.astro
```

Most paragraphs can be edited directly between `<p>` and `</p>`.

Experience and education data are in:

```text
src/data/site.ts
```

Edit the `experience`, `education`, and `skillGroups` arrays while preserving their braces, commas, and quotation marks.

## Replace the Photo or CV

To replace the profile photo, overwrite:

```text
public/images/jenifer-ciuciu-kiss.jpg
```

Keep the same file name so no code change is needed. A reasonably compressed JPG around 900 pixels wide is sufficient.

To replace the CV, overwrite:

```text
public/assets/jenifer_tabita_ciuciu_kiss_cv.pdf
```

## Edit Contact and Social Links

Open `src/data/site.ts` to update:

- Email
- GitHub
- LinkedIn
- ORCID
- Google Scholar
- ResearchGate
- Website URL

## Contact Form and Newsletter

The static website submits both forms to the Google Apps Script URL configured as
`formsEndpoint` in `src/data/site.ts`.

- Newsletter submissions send JSON with `type: "newsletter"`, `email`, and the `website` honeypot.
- Project submissions send JSON with `type: "form"`, `name`, `email`, `company`,
  `projectStage`, `automationGoal`, `currentTools`, `timeline`, and the `website` honeypot.
- The JSON is sent with a `text/plain` content type so the cross-origin request works from GitHub
  Pages without an Apps Script CORS preflight.
- The Apps Script routes submissions based on `type`.
- The website displays a success message after the browser completes the request.

The Google Sheet stores the subscriber list, but it does not send newsletters unless the Apps
Script also implements sending. Newsletter delivery, unsubscribe handling, and address deletion
must be handled by your Apps Script or manually. Keep the sheet private and restrict access because
it contains personal data.

## Edit the Navigation

The navigation links are in the `navigation` array in `src/data/site.ts`:

```ts
export const navigation = [
  { href: "/projects/", label: "Projects" },
  { href: "/publications/", label: "Publications" },
  { href: "/blog/", label: "Blog" },
  { href: "/about/", label: "About me" },
] as const;
```

Reorder these lines to change the menu order. Contact is rendered separately by `src/components/Header.astro`.

## Markdown Basics

````md
## Section heading

**Bold text**

*Italic text*

[Link text](https://example.com)

- List item
- Another item

```python
print("Code block")
```
````

## Publish Changes

Commit and push changes to `main`:

```bash
git add .
git commit -m "Update website content"
git push origin main
```

The workflow in `.github/workflows/deploy.yml` will:

1. Install dependencies.
2. Validate and build the Astro website.
3. Publish the generated files to `gh-pages`.
4. Deploy the site through GitHub Pages.

You can watch its progress in the repository's **Actions** tab.

## Common Problems

### Astro says Node 20 is unsupported

Install Node 22.12 or newer, or use the temporary `npm exec --package=node@22` commands from the Quick Start section.

### A content file fails validation

Run `npm run check`. Astro will report the file and incorrect field. Compare its frontmatter with the templates above and with `src/content.config.ts`.

### A page is missing

Check that:

- The file ends in `.md` or `.mdx`.
- The frontmatter begins and ends with `---`.
- `draft` is not `true` for a blog post.
- The category or publication type uses one of the exact valid values.

### A GitHub Pages deployment fails

Open **Actions**, select the failed workflow, and inspect the **Build** step. Most failures are invalid content metadata or a missing file referenced by a page.

## Safe Editing Routine

1. Create or edit one content file.
2. Run `npm run check`.
3. Start `npm run dev` and inspect the page.
4. Run `npm run build`.
5. Commit and push to `main`.

This keeps content changes small and makes errors easy to identify.
