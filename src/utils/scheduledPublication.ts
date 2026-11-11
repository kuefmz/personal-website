// Freeze the build clock so routes, links, and feeds agree at a release boundary.
const buildTime = new Date(process.env.CONTENT_BUILD_TIME ?? Date.now());
if (Number.isNaN(buildTime.valueOf())) throw new Error("Invalid CONTENT_BUILD_TIME");

export const isScheduledPublished = ({ data }: { data: { publishedAt: Date } }) =>
  data.publishedAt.valueOf() <= buildTime.valueOf();
