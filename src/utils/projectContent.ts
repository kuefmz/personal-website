import { getCollection } from "astro:content";
import { isScheduledPublished } from "./scheduledPublication";

export async function getProjects() {
  const projects = await getCollection("projects");
  const updates = await getCollection("projectUpdates", isScheduledPublished);
  return projects.map((project) => {
    const update = updates
      .filter(({ data }) => data.projectId === project.id)
      .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())[0];
    if (!update) return { project, content: project };
    return {
      project: {
        ...project,
        data: {
          ...project.data,
          title: update.data.title,
          description: update.data.description,
          status: update.data.status,
          technologies: update.data.technologies,
          tags: update.data.tags,
        },
      },
      content: update,
    };
  });
}
