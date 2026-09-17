import { spawn } from "node:child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const viewport = { width: 1280, height: 720 };
const outputDir = path.resolve("public/images/projects");

const targets = [
  {
    slug: "websiteli",
    title: "Websiteli",
    url: "https://websiteli.ch/en/",
    output: "websiteli-desktop.png",
    contentFile: "src/content/projects/websiteli.md",
  },
  {
    slug: "orgelia",
    title: "Orgelia",
    url: "https://orgelia.com/",
    output: "orgelia-desktop.png",
    contentFile: "src/content/projects/orgelia.md",
  },
  {
    slug: "before-you-trust",
    title: "Before You Trust",
    url: "https://www.beforeyoutrust.org/",
    output: "before-you-trust-desktop.png",
    contentFile: "src/content/projects/before-you-trust.md",
  },
  {
    slug: "semantic-web-science-association",
    title: "Semantic Web Science Association",
    url: "https://swsa.semanticweb.org/",
    output: "swsa-desktop.png",
    contentFile: "src/content/projects/semantic-web-science-association.md",
  },
  {
    slug: "movere-clinic",
    title: "Movere Clinic",
    url: "https://movereclinic.com/",
    output: "movere-clinic-desktop.png",
    contentFile: "src/content/projects/movere-clinic.md",
  },
  {
    slug: "slap-ai",
    title: "Slap AI",
    url: "https://slap-ai.com/",
    output: "slap-ai-desktop.png",
    contentFile: "src/content/projects/slap-ai.md",
  },
];

const browserCandidates = [
  process.env.CHROMIUM_PATH,
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
  "/snap/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean);

function findBrowser() {
  const browser = browserCandidates.find((candidate) => existsSync(candidate));
  if (!browser) {
    throw new Error(
      "No Chromium-compatible browser found. Install Chrome/Chromium or set CHROMIUM_PATH, then rerun npm run screenshots:projects.",
    );
  }
  return browser;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr.trim() || `${command} exited with code ${code}`));
    });
  });
}

function pointProjectAtLocalScreenshot(target) {
  const contentPath = path.resolve(target.contentFile);
  if (!existsSync(contentPath)) return;

  const localPreview = `/images/projects/${target.output}`;
  const current = readFileSync(contentPath, "utf8");
  const next = current.replace(/^previewImage:\s*.*$/m, `previewImage: "${localPreview}"`);

  if (next !== current) {
    writeFileSync(contentPath, next);
    console.log(`Updated ${target.contentFile} -> ${localPreview}`);
  }
}

async function capture(browser, target) {
  const outputPath = path.join(outputDir, target.output);
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    "--ignore-certificate-errors",
    "--no-first-run",
    "--no-sandbox",
    "--run-all-compositor-stages-before-draw",
    "--force-device-scale-factor=1",
    `--window-size=${viewport.width},${viewport.height}`,
    "--virtual-time-budget=7000",
    `--screenshot=${outputPath}`,
    target.url,
  ];

  await run(browser, args);

  if (!existsSync(outputPath) || statSync(outputPath).size < 10_000) {
    throw new Error(`Screenshot for ${target.title} was not created correctly.`);
  }

  pointProjectAtLocalScreenshot(target);
  console.log(`Saved ${path.relative(process.cwd(), outputPath)} from ${target.url}`);
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const browser = findBrowser();
  console.log(`Using ${browser}`);

  const failures = [];
  for (const target of targets) {
    try {
      await capture(browser, target);
    } catch (error) {
      failures.push(`${target.title}: ${error.message}`);
      console.error(`Failed ${target.title}: ${error.message}`);
    }
  }

  if (failures.length) {
    console.error("\nSome screenshots failed:\n- " + failures.join("\n- "));
    process.exit(1);
  }

  console.log("\nAll project screenshots refreshed. Review the images, then commit the generated files and Markdown changes.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
