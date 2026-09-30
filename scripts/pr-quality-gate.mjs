import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

const root = process.cwd();

const scanRoots = [
  "assets",
  "blocks",
  "config",
  "layout",
  "locales",
  "sections",
  "snippets",
  "templates",
  "scripts",
  "tests",
  "docs",
  ".github/workflows",
];

const textExtensions = new Set([
  ".css", ".js", ".json", ".liquid", ".md", ".mjs", ".ts", ".yml", ".yaml"
]);

const jsonRoots = new Set(["config", "locales", "templates"]);
const conflictPattern = /^(<{7}|={7}|>{7})/m;

function stripShopifyGeneratedHeader(content) {
  let value = content.replace(/^\uFEFF/, "").trimStart();
  while (value.startsWith("/*")) {
    const end = value.indexOf("*/");
    if (end === -1) return value;
    value = value.slice(end + 2).trimStart();
  }
  return value;
}

async function walk(dir) {
  const entries = await readdir(join(root, dir), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(rel));
    } else {
      files.push(rel);
    }
  }
  return files;
}

const failures = [];
let checkedText = 0;
let checkedJson = 0;

for (const scanRoot of scanRoots) {
  let files = [];
  try {
    files = await walk(scanRoot);
  } catch (error) {
    if (error?.code === "ENOENT") continue;
    throw error;
  }

  for (const file of files) {
    const extension = extname(file).toLowerCase();
    if (!textExtensions.has(extension)) continue;

    const content = await readFile(join(root, file), "utf8");
    checkedText += 1;

    if (conflictPattern.test(content)) {
      failures.push(`${file}: contains unresolved merge-conflict markers`);
    }

    const topLevel = file.split("/")[0];
    if (extension === ".json" && jsonRoots.has(topLevel)) {
      try {
        JSON.parse(stripShopifyGeneratedHeader(content));
        checkedJson += 1;
      } catch (error) {
        failures.push(`${file}: invalid JSON (${error.message})`);
      }
    }
  }
}

const workflowPath = ".github/workflows/pr-quality-gate.yml";
const workflowContent = await readFile(join(root, workflowPath), "utf8");

const forbiddenDeploySignals = [
  "scripts/theme-push.sh",
  "shopify theme push",
  "SHOPIFY_CLI_THEME_TOKEN",
];

for (const signal of forbiddenDeploySignals) {
  if (workflowContent.includes(signal)) {
    failures.push(`${workflowPath}: PR workflow must not deploy; forbidden signal found: ${signal}`);
  }
}

if (!workflowContent.includes("pull_request:")) {
  failures.push(`${workflowPath}: workflow must run on pull_request`);
}

if (failures.length > 0) {
  console.error("PR quality gate failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`PR quality gate passed: ${checkedText} text files scanned, ${checkedJson} JSON files parsed.`);
console.log("No deployment command or Shopify theme token is used by the PR workflow.");
