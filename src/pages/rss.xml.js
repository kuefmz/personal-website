import { isBlogPublished } from "../utils/blogPublication";
import { isScheduledPublished } from "../utils/scheduledPublication";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../data/site";

export async function GET(context) {
  const posts = (await getCollection("blog", isBlogPublished)).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );

  const guides = await getCollection("funnel", isScheduledPublished);
  const updates = await getCollection("projectUpdates", isScheduledPublished);

  return rss({
    title: `${site.shortName} — Blog`,
    description: site.description,
    site: context.site,
    items: [...posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })), ...guides.map(({ data }) => ({
      title: data.title,
      description: data.description,
      pubDate: data.publishedAt,
      link: data.route,
      categories: [data.category],
    })), ...updates.map(({ data }) => ({
      title: data.title,
      description: data.description,
      pubDate: data.publishedAt,
      link: `/projects/${data.projectId}/`,
      categories: ["Projects"],
    }))].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()),
  });
}
