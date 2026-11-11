import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const read = (file) => fs.readFileSync(file, "utf8");
const entries = fs.readdirSync("src/content/funnel").map((file) => {
  const text = read(path.join("src/content/funnel", file));
  return {
    route: text.match(/^route: "([^"]+)"/m)[1],
    release: new Date(text.match(/^publishedAt: "([^"]+)"/m)[1]),
  };
});
const updateText = read("src/content/projectUpdates/pdf-processing-platform.md");
const updateTime = new Date(updateText.match(/^publishedAt: "([^"]+)"/m)[1]);
const releases = [...entries.map(({ release }) => release), updateTime].sort((a, b) => a - b);
const projectRoute = "dist/projects/pdf-processing-platform/index.html";
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});

for (const release of releases) {
  const localHour = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Zurich", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(release);
  assert.equal(localHour, "09:00", "Releases must occur at 09:00 Zurich time");
}
for (let index = 1; index < releases.length; index++) {
  assert.equal(releases[index] - releases[index - 1], 86400000, "One release per day in this November sequence");
}

// Exercise actual static output just before and exactly at every release.
for (const release of releases) {
  for (const time of [new Date(release.valueOf() - 1), release]) {
    const result = spawnSync("npm", ["exec", "--", "astro", "build"], {
      env: { ...process.env, CONTENT_BUILD_TIME: time.toISOString(), ASTRO_TELEMETRY_DISABLED: "1" },
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const files = walk("dist").filter((file) => /\.(html|xml|js|json)$/.test(file));
    const output = files.map(read).join("\n");
    const sitemap = files.filter((file) => /sitemap.*\.xml$/.test(file)).map(read).join("\n");
    const feed = read("dist/rss.xml");
    const listing = read("dist/blog/index.html");
    for (const { route, release: pageTime } of entries) {
      const visible = pageTime <= time;
      assert.equal(fs.existsSync(path.join("dist", route, "index.html")), visible, route);
      assert.equal(sitemap.includes(route), visible, "sitemap " + route);
      assert.equal(feed.includes(route), visible, "RSS " + route);
      assert.equal(listing.includes(route), visible, "listing " + route);
      if (!visible) assert.ok(!output.includes(route), "Unreleased route leaked into output: " + route);
    }
    const updated = updateTime <= time;
    assert.equal(read(projectRoute).includes("A Browser-Based PDF Editor"), updated);
    assert.equal(read("dist/projects/index.html").includes("A Browser-Based PDF Editor"), updated);
    assert.equal(feed.includes("A Browser-Based PDF Editor"), updated);
    const seo = spawnSync(process.execPath, ["scripts/check-seo.mjs"], { encoding: "utf8" });
    assert.equal(seo.status, 0, seo.stdout + seo.stderr);
    console.log(time.toISOString() + " publication boundaries and SEO passed");
  }
}
console.log("Scheduled content checks passed.");
