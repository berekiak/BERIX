import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import assert from "node:assert/strict";
import handler from "../api/demandes.js";

// Exercise the client responses without sending emails or requiring a browser.
const source = readFileSync("public/site.js", "utf8");
async function clientCase(reply, shouldSucceed) {
  const fields = { name: "Test technique", email: "test@example.com", subject: "Test", message: "Message de test suffisamment long", consent: "on", service: "Sites web", phone: "+243858181330" };
  const button = { disabled: false, textContent: "Envoyer ma demande" };
  let listener, statusNode, reset = false, request;
  const form = {
    querySelector(selector) {
      if (selector === 'button[type="submit"]') return button;
      if (selector === ".form-status") return statusNode;
      return null;
    },
    addEventListener(type, callback) { if (type === "submit") listener = callback; },
    reportValidity() { return true; }, reset() { reset = true; }, append(node) { statusNode = node; },
  };
  const document = {
    body: { classList: { toggle() {}, add() {} } },
    querySelector(selector) { return selector === ".project-form" ? form : null; },
    querySelectorAll() { return []; },
    createElement() { return { setAttribute() {}, focus() { this.focused = true; } }; },
  };
  runInNewContext(source, {
    document, location: { pathname: "/contact" }, window: {}, scrollY: 0,
    addEventListener() {}, matchMedia: () => ({ matches: true }),
    crypto: { randomUUID: () => "test-client-id" },
    FormData: class { get(key) { return fields[key] ?? ""; } },
    fetch: async (url, options) => { request = { url, ...JSON.parse(options.body) }; if (reply.reject) throw new Error("Failed to fetch"); return { ok: reply.ok, json: async () => reply.body }; },
  });
  await listener({ preventDefault() {} });
  assert.equal(reset, shouldSucceed);
  assert.equal(button.disabled, false);
  assert.equal(statusNode.className, `form-status ${shouldSucceed ? "success" : "error"}`);
  assert.equal(statusNode.focused, true);
  assert.equal(request.url, "/api/demandes");
  assert.equal(request.kind, "contact");
  assert.equal(request.phone, fields.phone);
  assert.equal(request.consent, true);
  assert.doesNotMatch(statusNode.textContent, /undefined/);
  assert.doesNotMatch(statusNode.textContent, /Failed to fetch/);
}
await clientCase({ ok: true, body: { reference: "NX-TEST1234", emailSent: true } }, true);
await clientCase({ ok: false, body: { error: "Service momentanément indisponible" } }, false);
await clientCase({ ok: true, body: { error: { code: 401 } } }, false);
await clientCase({ ok: true, body: {} }, false);
await clientCase({ reject: true }, false);
console.log("CLIENT: success, server error, protected response, malformed response and network failure verified; retry remains available");

const originalFetch = globalThis.fetch;
const previousKey = process.env.RESEND_API_KEY;
process.env.RESEND_API_KEY = "unit-test-placeholder";
const response = () => ({ code: null, body: null, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });
const valid = { key: "test-server-key", name: "Test <script>", email: "test@example.com", phone: "+243858181330", company: "Test", service: "Sites web", subject: "Sujet test", message: "Message de test suffisamment long", budget: "À définir ensemble", deadline: "Flexible", consent: true };
try {
  let calls = 0, mail;
  globalThis.fetch = async (url, options) => { calls++; mail = JSON.parse(options.body); assert.equal(url, "https://api.resend.com/emails"); return { ok: true }; };
  for (const kind of ["contact", "devis"]) {
    const result = response(); await handler({ method: "POST", body: { ...valid, kind } }, result);
    assert.equal(result.code, 201); assert.equal(result.body.emailSent, true);
    assert.deepEqual(mail.to, ["nexoradigitalrdc@gmail.com"]); assert.equal(mail.reply_to, valid.email);
    for (const value of [valid.email, valid.phone, valid.service, valid.message, valid.budget, valid.deadline]) assert.ok(mail.text.includes(value));
    assert.ok(mail.html.includes("Test &lt;script&gt;")); assert.ok(!mail.html.includes("Test <script>"));
  }
  for (const body of [{}, { ...valid, website: "spam.example" }, { ...valid, consent: false }]) {
    const result = response(); await handler({ method: "POST", body }, result); assert.equal(result.code, 400);
  }
  const method = response(); await handler({ method: "GET" }, method); assert.equal(method.code, 405); assert.equal(calls, 2);
  globalThis.fetch = async () => { throw new Error("Provider failure"); };
  const failure = response(); await handler({ method: "POST", body: valid }, failure);
  assert.equal(failure.code, 502); assert.match(failure.body.error, /WhatsApp/); assert.ok(!failure.body.error.includes("Provider failure"));
  console.log("SERVER: contact/quote payloads, structured emails, escaping, validation, consent, honeypot, 405 and 502 verified");
} finally {
  globalThis.fetch = originalFetch;
  if (previousKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = previousKey;
}
