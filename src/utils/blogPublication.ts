// Date-only publication metadata is released by UTC calendar day.
export const isBlogPublished = (
  { data }: { data: { draft: boolean; publishedAt: Date } },
  now = new Date(),
) => !data.draft && data.publishedAt.toISOString().slice(0, 10) <= now.toISOString().slice(0, 10);
