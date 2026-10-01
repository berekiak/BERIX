# Audit et refonte — Nexora Digital

Date : 1er octobre 2026  
Périmètre : version locale issue du dépôt `berekiak/BERIX`, branche de travail `redesign-signal-white`.

## Diagnostic initial

### Points solides

- Architecture statique rapide et simple à maintenir.
- Seize routes publiques, une page 404, un sitemap et un fichier robots accessibles.
- Métadonnées SEO, URL canoniques et données structurées déjà présentes.
- Formulaires de contact et de devis reliés au backend sécurisé.
- Adresse e-mail officielle et canal WhatsApp séparés.
- Images WebP optimisées et comportement responsive existant.

### Défaillances repérées

1. La présentation reposait encore sur une feuille CSS générée par l’ancien framework, d’environ 148 Ko, contenant de nombreuses règles inutilisées.
2. Des attributs et références hérités de Next/Vinext subsistaient dans les fichiers HTML statiques.
3. L’identité visuelle était très sombre et répétitive, avec peu de respiration entre les sections.
4. La ville futuriste et le logo étaient visuellement répétés dans le premier écran, ce qui diluait le message principal.
5. Les textes de navigation et certains éléments secondaires étaient trop petits par rapport aux titres très imposants.
6. Les pages intérieures manquaient d’une signature graphique commune suffisamment forte.
7. La mention d’hébergement dans les mentions légales faisait encore référence à ChatGPT Sites alors que le site est publié sur Vercel.
8. La page 404 chargeait encore l’ancienne feuille de styles.

## Refonte réalisée

- Nouveau système visuel « Signal White » : blanc, bleu cobalt, bleu nuit et cyan.
- Hero entièrement recomposé avec une grille éditoriale, une meilleure hiérarchie et une image mieux cadrée.
- Cartes de services, processus, appels à l’action et pages intérieures entièrement restylés.
- Formulaires rendus plus lumineux, lisibles et cohérents avec la nouvelle identité.
- Navigation, pied de page, menu mobile et bouton WhatsApp conservés et harmonisés.
- Nouvelle proposition de logo orbital « N », livrée en SVG ainsi qu’en favicon.
- Ancienne feuille CSS supprimée et remplacée par un système dédié nettement plus léger.
- Nettoyage des références techniques obsolètes dans les fichiers HTML.
- Mention de l’hébergement corrigée vers Vercel.

## Contrôles effectués

- Build de production : réussi.
- Validation des 17 fichiers HTML : réussie.
- Scan de secrets : réussi.
- Vérification des 16 routes principales et des ressources : HTTP 200 en local.
- Prévisualisation Vercel isolée : déploiement `READY`.
- Contrôle visuel ordinateur : accueil et contact conformes.
- WhatsApp, e-mail officiel et logique des formulaires : code conservé sans modification fonctionnelle.

## Étape suivante

La refonte reste sur une branche de prévisualisation. Elle pourra être fusionnée vers `main` et publiée en production après validation visuelle du propriétaire de Nexora Digital.
