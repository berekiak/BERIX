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
const titles = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || "";
  for (const marker of ["<title>", 'name="description"', 'rel="canonical"', 'property="og:title"', 'name="twitter:card"']) {
    if (head.split(marker).length !== 2) throw new Error(`${file} needs exactly one ${marker} in <head>`);
  }
  const title = head.match(/<title>([^<]+)<\/title>/)?.[1];
  if (titles.has(title)) throw new Error(`${file} has a duplicate page title`);
  titles.add(title);
  if (!file.endsWith("404.html") && /name="robots"[^>]*content="[^"]*noindex/i.test(head)) throw new Error(`${file} blocks indexing`);
  for (const tag of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt="/.test(tag[0])) throw new Error(`${file} has an image without alt text`);
    for (const attribute of ["sizes", "srcset"]) {
      if ((tag[0].match(new RegExp(`\\s${attribute}=`, "gi")) || []).length > 1) throw new Error(`${file} has duplicate ${attribute}`);
    }
  }
  for (const reference of html.matchAll(/(?:src|href)="(\/[^"?#]*)[^"]*"/g)) {
    const target = reference[1];
    if (target.startsWith("//") || target.startsWith("/api/")) continue;
    if (![join(root, target), join(root, target, "index.html")].some(existsSync)) throw new Error(`${file} has a broken local reference: ${target}`);
  }
  if (html.includes("kalonjiberekia.chatgpt.site")) throw new Error(`${file} still references the former origin`);
  if (/re_[A-Za-z0-9_-]{12,}/.test(html)) throw new Error(`${file} contains a possible API key`);
}

for (const file of [...walk(root), ...walk("api"), ...walk("scripts")].filter((file) => /\.(?:html|js|mjs|css|json|txt|xml)$/.test(file))) {
  if (/re_[A-Za-z0-9_-]{12,}/.test(readFileSync(file, "utf8"))) throw new Error(`${file} contains a possible API key`);
}

console.log(`Checked ${htmlFiles.length} HTML files: metadata, canonical URLs and secret scan passed.`);
