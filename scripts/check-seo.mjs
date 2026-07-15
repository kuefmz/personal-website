import fs from "node:fs";
import path from "node:path";

const site = "https://jeniferciuciukiss.com";
const dist = path.resolve("dist");
const failures = [];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });

const read = (file) => fs.readFileSync(file, "utf8");

const routeFromHtmlFile = (file) => {
  const relative = path.relative(dist, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  if (relative.endsWith(".html")) return `/${relative.slice(0, -".html".length)}/`;
  return `/${relative}`;
};

const htmlFileForPath = (pathname) => {
  const cleanPath = pathname.replace(/^\/+/, "");
  const candidates = [];

  if (!cleanPath) {
    candidates.push(path.join(dist, "index.html"));
  } else if (pathname.endsWith("/")) {
    candidates.push(path.join(dist, cleanPath, "index.html"));
    candidates.push(path.join(dist, `${cleanPath.slice(0, -1)}.html`));
  } else {
    candidates.push(path.join(dist, cleanPath));
    candidates.push(path.join(dist, cleanPath, "index.html"));
    candidates.push(path.join(dist, `${cleanPath}.html`));
  }

  return candidates.find((candidate) => fs.existsSync(candidate));
};

const fileForPath = (pathname) => {
  const cleanPath = pathname.replace(/^\/+/, "");
  return cleanPath ? path.join(dist, cleanPath) : path.join(dist, "index.html");
};

const getAttribute = (html, pattern) => html.match(pattern)?.[1]?.trim();

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

if (!fs.existsSync(dist)) {
  throw new Error("dist/ does not exist. Run npm run build before npm run test:seo.");
}

const files = walk(dist);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const routeMap = new Map(htmlFiles.map((file) => [routeFromHtmlFile(file), file]));
const sitemapFiles = files.filter((file) => /sitemap.*\.xml$/.test(path.basename(file)) && !file.endsWith("sitemap-index.xml"));
const sitemapUrls = new Set(
  sitemapFiles.flatMap((file) => [...read(file).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])),
);

for (const file of htmlFiles) {
  const html = read(file);
  const route = routeFromHtmlFile(file);
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  const canonical = getAttribute(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const description = getAttribute(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const jsonLdScripts = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];

  assert(Boolean(title), `${route}: missing <title>`);
  assert(Boolean(description), `${route}: missing meta description`);
  assert(Boolean(canonical), `${route}: missing canonical URL`);
  assert(canonical?.startsWith(site), `${route}: canonical is outside site (${canonical})`);
  assert(h1Count === 1, `${route}: expected exactly one h1, found ${h1Count}`);
  assert(/<meta\s+property="og:title"\s+content="[^"]+"/i.test(html), `${route}: missing og:title`);
  assert(/<meta\s+property="og:description"\s+content="[^"]+"/i.test(html), `${route}: missing og:description`);
  assert(/<meta\s+name="twitter:card"\s+content="summary_large_image"/i.test(html), `${route}: missing twitter card`);
  assert(jsonLdScripts.length > 0, `${route}: missing JSON-LD`);

  for (const [, json] of jsonLdScripts) {
    try {
      const parsed = JSON.parse(json);
      const graph = Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [];
      assert(graph.some((item) => item["@type"] === "Person"), `${route}: JSON-LD graph missing Person`);
      assert(graph.some((item) => item["@type"] === "WebSite"), `${route}: JSON-LD graph missing WebSite`);
    } catch (error) {
      failures.push(`${route}: invalid JSON-LD (${error.message})`);
    }
  }

  if (!noindex && canonical) {
    assert(sitemapUrls.has(canonical), `${route}: canonical URL missing from sitemap (${canonical})`);
  }

  for (const match of html.matchAll(/\s(?:href|src)=["']([^"']+)["']/g)) {
    const raw = match[1];
    if (
      raw.startsWith("http://") ||
      raw.startsWith("https://") ||
      raw.startsWith("mailto:") ||
      raw.startsWith("tel:") ||
      raw.startsWith("data:") ||
      raw.startsWith("javascript:") ||
      raw.startsWith("//")
    ) {
      if (!raw.startsWith(site)) continue;
    }

    const resolved = new URL(raw, `${site}${route}`);
    if (resolved.origin !== site) continue;

    const pathname = resolved.pathname;
    const targetHtml = htmlFileForPath(pathname);
    const targetFile = fileForPath(pathname);
    const hasExtension = /\.[a-z0-9]+$/i.test(path.basename(pathname));

    if (hasExtension) {
      assert(fs.existsSync(targetFile), `${route}: broken asset link ${raw}`);
      continue;
    }

    assert(Boolean(targetHtml), `${route}: broken internal link ${raw}`);

    if (resolved.hash && targetHtml) {
      const targetHtmlContent = read(targetHtml);
      const anchor = resolved.hash.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      assert(
        new RegExp(`\\s(?:id|name)=["']${anchor}["']`).test(targetHtmlContent),
        `${route}: missing anchor target ${raw}`,
      );
    }
  }
}

const homeHtml = read(routeMap.get("/") ?? path.join(dist, "index.html"));
assert(homeHtml.includes("/contact/"), "home: missing contact CTA link");
assert(homeHtml.includes("/about/#cv"), "home: missing CV section CTA link");
assert(homeHtml.includes("/projects/"), "home: missing projects CTA link");

const cvHtml = read(routeMap.get("/cv/") ?? "");
assert(cvHtml.includes("/assets/jenifer_tabita_ciuciu_kiss_cv.pdf"), "cv: missing PDF CV link");

if (failures.length) {
  console.error(`SEO smoke test failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO smoke test passed for ${htmlFiles.length} HTML pages.`);
