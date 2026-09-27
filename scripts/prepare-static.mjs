import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const publicDir = new URL("../public/", import.meta.url);
const previousOrigin = "https://nexora-digital.kalonjiberekia.chatgpt.site";
const canonicalOrigin = "https://nexora-digital-rdc.vercel.app";

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(publicDir.pathname).filter((path) => path.endsWith("index.html"))) {
  let html = readFileSync(file, "utf8");

  // The production snapshot is progressively enhanced by /site.js. Removing
  // framework hydration avoids obsolete runtime requests after migration.
  html = html.replace(/<script\b(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<link\b[^>]*rel="modulepreload"[^>]*\/?>(?:<\/link>)?/gi, "");
  html = html.replace(/\s+srcSet="[^"]*"/gi, "");
  html = html.replace(/src="\/_next\/image\?url=%2Fnexora-header-logo\.webp&amp;w=3840&amp;q=75"/g, 'src="/nexora-header-logo.webp"');
  html = html.replace(/src="\/_next\/image\?url=%2Fnexora-header-logo\.webp&w=3840&q=75"/g, 'src="/nexora-header-logo.webp"');
  html = html.replace(previousOrigin, canonicalOrigin).replaceAll(previousOrigin, canonicalOrigin);

  if (relative(publicDir.pathname, file).split(sep).join("/") === "index.html") {
    html = html.replace(
      "<title>Nexora Digital — Créer. Innover. Transformer.</title>",
      "<title>Nexora Digital RDC | Agence web et solutions numériques à Kinshasa</title>",
    );
    html = html.replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      '<meta name="description" content="Nexora Digital est une agence digitale à Kinshasa : création de sites web, applications, outils de gestion et solutions de transformation numérique en RDC."/>',
    );
    html = html.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${canonicalOrigin}/#organization`,
            name: "Nexora Digital",
            url: canonicalOrigin,
            logo: `${canonicalOrigin}/nexora-logo.webp`,
            slogan: "Créer. Innover. Transformer.",
            email: "nexoradigitalrdc@gmail.com",
            telephone: "+243858181330",
          },
          {
            "@type": "WebSite",
            "@id": `${canonicalOrigin}/#website`,
            url: canonicalOrigin,
            name: "Nexora Digital",
            inLanguage: "fr-CD",
            publisher: { "@id": `${canonicalOrigin}/#organization` },
          },
          {
            "@type": "ProfessionalService",
            "@id": `${canonicalOrigin}/#service`,
            name: "Nexora Digital",
            url: canonicalOrigin,
            email: "nexoradigitalrdc@gmail.com",
            telephone: "+243858181330",
            areaServed: [
              { "@type": "City", name: "Kinshasa" },
              { "@type": "Country", name: "République démocratique du Congo" },
            ],
            parentOrganization: { "@id": `${canonicalOrigin}/#organization` },
          },
        ],
      })}</script>`,
    );
  }

  if (!html.includes('name="twitter:card"')) {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "Nexora Digital";
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "Solutions numériques en RDC.";
    const social = [
      '<meta property="og:type" content="website"/>',
      `<meta property="og:title" content="${title}"/>`,
      `<meta property="og:description" content="${description}"/>`,
      '<meta property="og:image" content="https://nexora-digital-rdc.vercel.app/nexora-hero-city.webp"/>',
      '<meta property="og:locale" content="fr_CD"/>',
      '<meta name="twitter:card" content="summary_large_image"/>',
      `<meta name="twitter:title" content="${title}"/>`,
      `<meta name="twitter:description" content="${description}"/>`,
      '<meta name="twitter:image" content="https://nexora-digital-rdc.vercel.app/nexora-hero-city.webp"/>',
    ].join("");
    html = html.replace("</head>", `${social}<link rel="stylesheet" href="/site.css"/></head>`);
  } else if (!html.includes('href="/site.css"')) {
    html = html.replace("</head>", '<link rel="stylesheet" href="/site.css"/></head>');
  }

  if (!html.includes('src="/site.js"')) {
    html = html.replace("</body>", '<script src="/site.js" defer></script></body>');
  }

  writeFileSync(file, html);
}
