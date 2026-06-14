import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://jeniferciuciukiss.com",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.endsWith("/thanks/") && !page.endsWith("/404/"),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
      wrap: true,
    },
  },
  build: {
    format: "directory",
  },
});
