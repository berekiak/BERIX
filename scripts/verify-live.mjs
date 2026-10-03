import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";

const origin = new URL(process.argv[2] || "https://nexora-digital-rdc.vercel.app").origin;
const cookieFile = process.argv[3];
const sendTests = process.argv.includes("--send-tests");
const request = (path, method = "GET", payload) => new Promise((resolve, reject) => {
  const args = ["-sS", "--max-time", "35", "-w", "\n%{http_code}", "-X", method];
  if (cookieFile) args.push("-b", cookieFile);
  if (payload) args.push("-H", "Content-Type: application/json", "--data-binary", "@-");
  args.push(`${origin}${path}`);
  const child = spawn("curl", args);
  let output = "", error = "";
  child.stdout.on("data", (data) => { output += data; });
  child.stderr.on("data", (data) => { error += data; });
  child.on("error", reject);
  child.on("close", (code) => {
    if (code) return reject(new Error(error || `curl exited ${code}`));
    const boundary = output.lastIndexOf("\n");
    resolve({ status: Number(output.slice(boundary + 1)), body: output.slice(0, boundary) });
  });
  child.stdin.end(payload ? JSON.stringify(payload) : undefined);
});

const routes = [...readFileSync("public/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
for (let index = 0; index < routes.length; index += 4) {
  await Promise.all(routes.slice(index, index + 4).map(async (path) => {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    const head = response.body.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] || "";
    assert.match(head, /<title>[^<]+<\/title>/, path);
    assert.match(head, /rel="canonical"/, path);
    assert.doesNotMatch(head, /noindex/i, path);
    assert.match(response.body, /https:\/\/wa\.me\/243858181330/, path);
    console.log(`PAGE ${path}: HTTP 200, metadata in head, no HTML noindex, WhatsApp present`);
  }));
}
for (const path of ["/robots.txt", "/sitemap.xml"]) {
  const response = await request(path);
  assert.equal(response.status, 200, path);
  console.log(`SEO ${path}: HTTP 200`);
}
const missing = await request("/controle-page-inexistante-nexora");
assert.equal(missing.status, 404);
assert.match(missing.body, /Page introuvable/);
console.log("404: correct HTTP status and branded page");
const method = await request("/api/demandes");
assert.equal(method.status, 405);
const invalid = await request("/api/demandes", "POST", { kind: "contact", name: "", message: "court" });
assert.equal(invalid.status, 400);
console.log("API: GET rejected (405), invalid form rejected (400)");

if (sendTests) {
  for (const kind of ["contact", "devis"]) {
    const payload = {
      key: randomUUID(), kind, name: "Test technique Nexora", email: "nexoradigitalrdc@gmail.com",
      company: "Contrôle technique — préversion", phone: "+243858181330", service: "Sites web",
      subject: "TEST TECHNIQUE — intégration formulaire",
      message: `TEST TECHNIQUE ${kind.toUpperCase()} — ne pas traiter comme une demande commerciale. Vérification de transmission depuis la préversion Spectrum, des coordonnées, du service, du message et des informations de devis.`,
      budget: "À définir ensemble", deadline: "Flexible", website: "", consent: true,
    };
    const response = await request("/api/demandes", "POST", payload);
    const result = JSON.parse(response.body);
    assert.equal(response.status, 201, JSON.stringify(result));
    assert.equal(typeof result.reference, "string");
    assert.equal(result.emailSent, true);
    console.log(`EMAIL ${kind}: HTTP 201, accepted by sender, reference ${result.reference}`);
  }
}
