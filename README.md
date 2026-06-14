# Jenifer Tabita Ciuciu-Kiss — Personal Website

A static, content-driven personal website built with Astro, TypeScript, and MDX.
Node.js 22.12 or newer is required.

## Development

```sh
npm install
npm run dev
```

## Quality checks

```sh
npm run check
npm run build
```

Content lives in `src/content` and is validated by the schemas in
`src/content.config.ts`.

See [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md) for step-by-step instructions
for editing projects, publications, blog posts, the About page, images, links,
and deployment.

## GitHub Pages

The deployment workflow runs on pushes to `main` and:

1. Builds the static Astro site.
2. Replaces the generated `gh-pages` branch with the contents of `dist`.
3. Deploys the same build with GitHub's official Pages deployment action.

In the repository's **Settings → Pages**, set the source to **GitHub Actions**.
The generated `gh-pages` branch remains a clean, inspectable copy of the exact
deployed output. The official action is used for the final deployment because
GitHub does not trigger a branch-based Pages build from a commit created with
the workflow's own `GITHUB_TOKEN`.

The custom domain is preserved through `public/CNAME`.

## Static forms

Newsletter subscriptions and project requests are posted from the static site
to the Google Apps Script endpoint configured as `formsEndpoint` in
`src/data/site.ts`. The endpoint is responsible for writing each submission to
the appropriate Google Sheet. Requests contain JSON sent as `text/plain` to
remain compatible with cross-origin submissions from GitHub Pages.
