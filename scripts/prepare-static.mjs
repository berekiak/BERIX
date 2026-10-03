import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative, sep } from "node:path";

const publicDir = new URL("../public/", import.meta.url);
const previousOrigin = "https://nexora-digital.kalonjiberekia.chatgpt.site";
const canonicalOrigin = "https://nexora-digital-rdc.vercel.app";

function versionAsset(url) {
  const bare = url.split("?")[0];
  const path = bare.startsWith(canonicalOrigin) ? bare.slice(canonicalOrigin.length) : bare;
  if (!path.startsWith("/") || !/\.(?:css|js|webp|svg|woff)$/.test(path)) return url;
  const file = join(publicDir.pathname, path.slice(1));
  if (!existsSync(file)) return url;
  const version = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 12);
  return `${bare}?v=${version}`;
}

// Version CSS dependencies before hashing the stylesheet itself.
const stylesheet = join(publicDir.pathname, "site.css");
const css = readFileSync(stylesheet, "utf8").replace(/url\(['"]?(\/[^\s)'"?]+)(?:\?[^\s)'" ]*)?['"]?\)/g,
  (_, url) => `url("${versionAsset(url)}")`);
writeFileSync(stylesheet, css);

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(publicDir.pathname).filter((path) => path.endsWith(".html"))) {
  let html = readFileSync(file, "utf8");

  // The production snapshot is progressively enhanced by /site.js. Removing
  // framework hydration avoids obsolete runtime requests after migration.
  html = html.replace(/<script\b(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<link\b[^>]*rel="modulepreload"[^>]*\/?>(?:<\/link>)?/gi, "");
  html = html.replace(/<link\b[^>]*href="\/_next\/static\/css\/[^"]+"[^>]*\/?>(?:<\/link>)?/gi, "");
  html = html.replace(/<link\b[^>]*rel="preload"[^>]*imageSrcSet="[^"]*"[^>]*\/?>(?:<\/link>)?/gi, "");
  html = html.replace(/<link\b[^>]*href="\/site\.css(?:\?[^"]*)?"[^>]*\/?>(?:<\/link>)?/gi, "");
  html = html.replace(/\s+srcSet="[^"]*"/gi, "");
  html = html.replace(/\s+(?:data-nimg|imageSizes|fetchPriority)="[^"]*"/gi, "");
  html = html.replace(/src="\/_next\/image\?url=%2Fnexora-header-logo\.webp&amp;w=3840&amp;q=75"/g, 'src="/nexora-header-logo.webp"');
  html = html.replace(/src="\/_next\/image\?url=%2Fnexora-header-logo\.webp&w=3840&q=75"/g, 'src="/nexora-header-logo.webp"');
  html = html.replace(previousOrigin, canonicalOrigin).replaceAll(previousOrigin, canonicalOrigin);
  html = html.replaceAll('src="/nexora-header-logo.webp"', 'src="/nexora-concept-mark.svg"');
  html = html.replaceAll('src="/nexora-logo.webp"', 'src="/nexora-concept-lockup.svg"');
  html = html.replaceAll(`${canonicalOrigin}/nexora-logo.webp`, `${canonicalOrigin}/nexora-concept-lockup.svg`);
  html = html.replace("Le site est publié via ChatGPT Sites. Les coordonnées légales de l’hébergeur restent à confirmer pour la version publique.", "Le site est hébergé et publié sur l’infrastructure Vercel. Les informations contractuelles et légales de l’hébergeur sont disponibles sur le site officiel de Vercel.");
  html = html.replace('class="skip-link"', 'class="skip"');

  if (relative(publicDir.pathname, file).split(sep).join("/") === "index.html") {
    // Public ownership verification for Nexora Digital's Google account.
    if (!html.includes('name="google-site-verification"')) {
      html = html.replace("</head>", '<meta name="google-site-verification" content="e-Y7iPbK5AiBb_bCbo7nMaer0yS_as4EZ6gMP_0mZGs"/></head>');
    }
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
            logo: `${canonicalOrigin}/nexora-concept-lockup.svg`,
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
    html = html
      .replace("Construisons votre projet", "Demander un devis")
      .replace('href="/services" class="text-link">Découvrir nos expertises', 'href="/realisations" class="text-link">Découvrir nos réalisations');
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
    html = html.replace("</head>", `${social}</head>`);
  }

  // Keep accessible descriptions and intrinsic dimensions for the current art direction.
  const descriptions = {
    "/nexora-hero-city.webp": ["Portail numérique abstrait aux reflets indigo et cyan, univers visuel de Nexora Digital", 1600, 928],
    "/nexora-solutions-architecture.webp": ["Écosystème modulaire de solutions numériques et interfaces connectées", 1440, 1066],
    "/expertise-sites-web.webp": ["Composition numérique abstraite représentant la création de sites web", 1400, 880],
    "/expertise-applications.webp": ["Composition numérique abstraite représentant les applications connectées", 1400, 880],
    "/expertise-outils-de-gestion.webp": ["Composition numérique abstraite représentant les outils de gestion", 1400, 880],
    "/expertise-design-ui-ux.webp": ["Composition numérique abstraite représentant le design d’interfaces", 1400, 880],
    "/expertise-transformation-numerique.webp": ["Composition numérique abstraite représentant la transformation digitale", 1400, 880],
    "/expertise-sur-mesure.webp": ["Composition numérique abstraite représentant une solution numérique sur mesure", 1400, 880],
    "/nexora-concept-mark.svg": ["", 48, 52],
    "/nexora-concept-lockup.svg": ["Nexora Digital", 330, 76],
  };
  html = html.replace(/<img\b[^>]*>/g, (tag) => {
    const source = tag.match(/src="([^"]+)"/)?.[1]?.split("?")[0];
    const description = descriptions[source];
    if (!description) return tag;
    return tag.replace(/alt="[^"]*"/, `alt="${description[0]}"`)
      .replace(/width="[^"]*"/, `width="${description[1]}"`)
      .replace(/height="[^"]*"/, `height="${description[2]}"`);
  });
  html = html.replace(/<img\b[^>]*src="\/nexora-hero-city\.webp[^>]*>/g, (tag) => {
    const responsive = 'srcset="/nexora-portal-640.webp 640w, /nexora-portal-960.webp 960w, /nexora-portal-1440.webp 1440w, /nexora-portal-1920.webp 1920w" sizes="100vw"';
    return tag.replace(/\s(?:loading|fetchpriority|sizes)="[^"]*"/gi, "")
      .replace(/<img/, `<img ${responsive} loading="eager" fetchpriority="high"`);
  });
  html = html.replace(/<img\b[^>]*src="\/nexora-solutions-architecture\.webp[^>]*>/g, (tag) => {
    const responsive = 'srcset="/nexora-ecosystem-640.webp 640w, /nexora-ecosystem-960.webp 960w, /nexora-ecosystem-1440.webp 1440w" sizes="(max-width: 820px) 90vw, 52vw"';
    return tag.replace(/\ssizes="[^"]*"/gi, "").replace(/<img/, `<img ${responsive}`);
  });

  // The migrated framework snapshot streamed metadata into the body. Consolidate
  // it in <head>, where crawlers and social parsers consistently find it.
  const metadata = new Map();
  html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*rel="(?:canonical|icon|shortcut icon|apple-touch-icon)"[^>]*>/gi, (tag) => {
    let key;
    if (/^<title/i.test(tag)) key = "title";
    else if (/^<meta/i.test(tag)) key = tag.match(/(?:name|property|http-equiv)="([^"]+)"/i)?.[1]?.toLowerCase() || "charset";
    else key = tag.match(/rel="([^"]+)"/i)?.[1]?.toLowerCase();
    if (!metadata.has(key)) metadata.set(key, tag);
    return "";
  });
  const pageTitle = metadata.get("title")?.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "Nexora Digital";
  const pageDescription = metadata.get("description")?.match(/content="([^"]*)"/i)?.[1] || "Solutions numériques en RDC.";
  const pageUrl = metadata.get("canonical")?.match(/href="([^"]*)"/i)?.[1] || canonicalOrigin;
  for (const [key, value] of [["og:title", pageTitle], ["twitter:title", pageTitle], ["og:description", pageDescription], ["twitter:description", pageDescription], ["og:url", pageUrl]]) {
    const attribute = key.startsWith("og:") ? "property" : "name";
    metadata.set(key, `<meta ${attribute}="${key}" content="${value}"/>`);
  }
  if (!metadata.has("icon")) metadata.set("icon", '<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>');
  html = html.replace("</head>", `${[...metadata.values()].join("")}</head>`);
  html = html.replace("</head>", '<link rel="stylesheet" href="/site.css"/></head>');

  if (!html.includes('src="/site.js"')) {
    html = html.replace("</body>", '<script src="/site.js" defer></script></body>');
  }

  html = html.replace(/((?:src|href|content)=")([^"]+\.(?:css|js|webp|svg|woff))(?:\?[^"]*)?"/g,
    (_, prefix, url) => `${prefix}${versionAsset(url)}"`);

  writeFileSync(file, html);
}
