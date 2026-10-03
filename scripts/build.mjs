import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
cpSync("public", "dist", { recursive: true });

// Temporary, preview-only responsive test surface. Never generated in production.
if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_GIT_COMMIT_REF === "refonte-spectrum") {
  for (const route of ["", "contact", "devis", "a-propos", "processus", "services", "services/sites-web", "faq"]) {
    const directory = `dist/__qa/${route}`;
    mkdirSync(directory, { recursive: true });
    const frames = [320, 375, 390, 430, 768, 1024, 1440, 1920].map((width) => `<section><h2>${width} px</h2><iframe title="Vue ${width} pixels" id="width-${width}" src="/${route}" width="${width}" height="960" style="border:0;display:block"></iframe></section>`).join("");
    writeFileSync(`${directory}/index.html`, `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Contrôles responsive privés</title></head><body style="margin:16px;background:#ddd;font:16px Arial"><h1>Contrôles responsive — ${route || "accueil"}</h1>${frames}</body></html>`);
  }
}

console.log("Static production output created in dist/.");
