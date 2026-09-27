import { randomUUID } from "node:crypto";

const CONTACT_EMAIL = process.env.NEXORA_CONTACT_EMAIL || "nexoradigitalrdc@gmail.com";
const EMAIL_FROM = process.env.NEXORA_EMAIL_FROM || "Nexora Digital <onboarding@resend.dev>";
const LEGACY_ENDPOINT = "https://nexora-digital.kalonjiberekia.chatgpt.site/api/demandes";
const LEGACY_ORIGIN = "https://nexora-digital.kalonjiberekia.chatgpt.site";

const clean = (value, length = 5000) => String(value ?? "").trim().slice(0, length);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml = (value) => clean(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function normalize(input) {
  return {
    key: clean(input.key, 80) || randomUUID(),
    kind: input.kind === "devis" ? "devis" : "contact",
    name: clean(input.name, 120),
    email: clean(input.email, 254).toLowerCase(),
    company: clean(input.company, 160),
    phone: clean(input.phone, 40),
    subject: clean(input.subject, 160),
    message: clean(input.message, 5000),
    service: clean(input.service, 160),
    budget: clean(input.budget, 160),
    deadline: clean(input.deadline, 160),
    website: clean(input.website, 200),
    consent: input.consent === true,
  };
}

function isValid(payload) {
  if (payload.website) return false;
  if (payload.name.length < 2 || !emailPattern.test(payload.email) || payload.message.length < 20 || !payload.consent) return false;
  if (payload.kind === "contact" && payload.subject.length < 3) return false;
  if (payload.kind === "devis" && !payload.service) return false;
  return true;
}

function row(label, value) {
  return `<tr><th align="left" style="padding:10px;border-bottom:1px solid #dde6f2;color:#21314d">${escapeHtml(label)}</th><td style="padding:10px;border-bottom:1px solid #dde6f2">${escapeHtml(value || "Non renseigné")}</td></tr>`;
}

async function sendDirect(payload, reference) {
  const isQuote = payload.kind === "devis";
  const subject = isQuote
    ? `[Nexora Digital] Nouvelle demande de devis — ${payload.service} — ${reference}`
    : `[Nexora Digital] Nouveau message — ${payload.subject} — ${reference}`;
  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#f3f6fb;font-family:Arial,sans-serif;color:#13213a"><div style="max-width:720px;margin:28px auto;background:#fff;border-radius:16px;overflow:hidden"><div style="padding:24px;background:#071a36;color:#fff"><h1 style="margin:0;font-size:22px">${isQuote ? "Nouvelle demande de devis" : "Nouveau message du site"}</h1><p style="margin:8px 0 0">Référence ${escapeHtml(reference)}</p></div><div style="padding:24px"><table style="width:100%;border-collapse:collapse">${row("Nom", payload.name)}${row("E-mail", payload.email)}${row("Téléphone", payload.phone)}${row("Entreprise", payload.company)}${row("Service", payload.service)}${row("Objet", payload.subject)}${row("Budget", payload.budget)}${row("Délai", payload.deadline)}${row("Message", payload.message)}</table><p style="margin-top:22px;color:#52617a">Répondez directement à cet e-mail pour contacter le prospect.</p></div></div></body></html>`;
  const text = [
    subject,
    `Référence : ${reference}`,
    `Nom : ${payload.name}`,
    `E-mail : ${payload.email}`,
    `Téléphone : ${payload.phone || "Non renseigné"}`,
    `Entreprise : ${payload.company || "Non renseignée"}`,
    `Service : ${payload.service || "Non renseigné"}`,
    `Objet : ${payload.subject || "Demande de devis"}`,
    `Budget : ${payload.budget || "Non renseigné"}`,
    `Délai : ${payload.deadline || "Non renseigné"}`,
    `Message : ${payload.message}`,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `nexora-${payload.key}`,
    },
    body: JSON.stringify({ from: EMAIL_FROM, to: [CONTACT_EMAIL], reply_to: payload.email, subject, html, text }),
  });
  if (!response.ok) throw new Error("Le service d’e-mail a refusé la demande.");
}

async function forwardSecurely(payload) {
  const response = await fetch(LEGACY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: LEGACY_ORIGIN },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Le service d’e-mail est momentanément indisponible.");
  return body;
}

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Méthode non autorisée." });

  try {
    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body || {};
    const payload = normalize(body);
    if (!isValid(payload)) return response.status(400).json({ error: "Vérifiez les champs obligatoires, votre e-mail et la longueur du message." });

    if (!process.env.RESEND_API_KEY) {
      const result = await forwardSecurely(payload);
      return response.status(201).json(result);
    }

    const reference = `NX-${payload.key.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
    await sendDirect(payload, reference);
    return response.status(201).json({ reference, emailSent: true });
  } catch {
    return response.status(502).json({ error: "Votre demande n’a pas pu être transmise. Réessayez dans quelques instants ou utilisez WhatsApp." });
  }
}
