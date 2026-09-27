import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = "public";
const required = ["index.html", "robots.txt", "sitemap.xml", "404.html", "site.js", "site.css", "favicon.svg"];
for (const file of required) {
  if (!existsSync(join(root, file))) throw new Error(`Missing production file: ${file}`);
}

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const marker of ["<title>", 'name="description"', 'rel="canonical"']) {
    if (!html.includes(marker)) throw new Error(`${file} is missing ${marker}`);
  }
  if (html.includes("kalonjiberekia.chatgpt.site")) throw new Error(`${file} still references the former origin`);
  if (/re_[A-Za-z0-9_-]{12,}/.test(html)) throw new Error(`${file} contains a possible API key`);
}

console.log(`Checked ${htmlFiles.length} HTML files: metadata, canonical URLs and secret scan passed.`);
