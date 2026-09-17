import fs from "node:fs";
import path from "node:path";

const site = "https://jeniferciuciukiss.com";
const dist = path.resolve("dist");
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const read = (file) => fs.readFileSync(file, "utf8");

if (!fs.existsSync(dist)) {
  throw new Error("dist/ does not exist. Run npm run build before npm run test:legacy.");
}

const redirects = {
  "resume.html": "/cv/",
  "portfolio.html": "/projects/",
  "blog.html": "/blog/",
};

for (const [legacy, target] of Object.entries(redirects)) {
  const file = path.join(dist, legacy);
  assert(fs.existsSync(file), `${legacy}: legacy redirect file missing`);
  if (!fs.existsSync(file)) continue;

  const html = read(file);
  assert(/name="robots" content="noindex,follow"/i.test(html), `${legacy}: missing noindex,follow`);
  assert(html.includes(`rel="canonical" href="${site}${target}"`), `${legacy}: canonical must point to ${target}`);
  assert(html.includes(`http-equiv="refresh" content="0; url=${target}"`), `${legacy}: missing redirect to ${target}`);
}

const sitemapText = fs
  .readdirSync(dist)
  .filter((name) => /^sitemap.*\.xml$/.test(name))
  .map((name) => read(path.join(dist, name)))
  .join("\n");

for (const legacy of Object.keys(redirects)) {
  assert(!sitemapText.includes(`${site}/${legacy}`), `${legacy}: legacy URL must stay out of the sitemap`);
}

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
const redirectFiles = new Set(Object.keys(redirects).map((name) => path.join(dist, name)));
const forbidden = Object.keys(redirects).map((name) => `/${name}`);

for (const file of walk(dist).filter((candidate) => candidate.endsWith(".html") && !redirectFiles.has(candidate))) {
  const html = read(file);
  for (const stale of forbidden) {
    assert(
      !html.includes(`href="${stale}"`) && !html.includes(`href='${stale}'`),
      `${path.relative(dist, file)}: links to legacy URL ${stale}`,
    );
  }
}

if (failures.length) {
  console.error(`Legacy SEO check failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Legacy SEO checks passed.");
