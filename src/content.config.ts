import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      year: z.number(),
      status: z.string(),
      category: z.enum(["Product", "Data", "Automation", "Website"]),
      tags: z.array(z.string()),
      technologies: z.array(z.string()),
      featured: z.boolean().default(false),
      image: image().optional(),
      links: z.array(linkSchema).default([]),
      order: z.number().default(99),
    }),
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    abstract: z.string(),
    authors: z.array(z.string()),
    year: z.number(),
    venue: z.string(),
    type: z.enum(["Conference paper", "Workshop paper", "Thesis", "Report"]),
    keywords: z.array(z.string()),
    featured: z.boolean().default(false),
    doi: z.string().optional(),
    pdf: z.string().optional(),
    slides: z.string().optional(),
    bibtex: z.string(),
      citation: z.string(),
      project: z.string().optional(),
      links: z.array(linkSchema).default([]),
      order: z.number().default(99),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.string()),
      category: z.string(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      linkedin: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects, publications, blog };
