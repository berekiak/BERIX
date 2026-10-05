# Contrôle qualité de la refonte

Contrôles effectués le 5 octobre 2026, sur un build de production local avec Chromium 153.

- `npm run lint` : réussi.
- `npm test` : 9 tests réussis (validation, consentement, tailles, URLs, échappement HTML, qualification complète, contrat du transport, noms longs et vérification des reçus).
- `npm run build` : réussi ; vérification TypeScript incluse.
- 23 pages contrôlées à 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 et 1920 px : 230 affichages, sans débordement horizontal.
- Captures visuelles sur ordinateur, tablette et mobile.
- Audit axe WCAG A/AA des 23 pages et du dernier écran de devis : aucune violation détectée après correction. Un audit automatique ne constitue pas une certification WCAG.
- Aucune erreur JavaScript observée pendant le parcours contrôlé.
- Navigation mobile : ouverture, fermeture par Échap, fermeture par lien et conservation du focus.
- Filtres du portfolio et accordéons FAQ vérifiés.
- Devis : présélection du service, validations, aller-retour entre étapes, conservation des valeurs, payload et affichage du reçu. Le test de confirmation visuelle utilise une réponse API simulée.
- API : origine incorrecte 403, format incorrect 415, payload invalide 400, dépassement de taille 413.
- Adresses inexistantes : réponses HTTP 404, y compris les services et études de cas inconnus.

Sur la version publique Vercel : les 23 pages du sitemap répondent HTTP 200, leurs titres et canonicals sont présents ; trois chemins inconnus répondent HTTP 404. Une première connexion automatisée a expiré sur une étude de cas ; les vérifications ciblées et le navigateur public ont ensuite confirmé sa disponibilité. La nouvelle galerie ITP et les liens Facebook/WhatsApp ont été vérifiés dans le navigateur public. Le formulaire de devis conserve son parcours en trois étapes.

## Lighthouse

Mesures de laboratoire locales en profil mobile, avec Lighthouse 13.5. Les dernières mesures valides sont :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | CLS |
|---|---:|---:|---:|---:|---:|
| Accueil | 93 | 100 | 100 | 100 | 0 |
| Services | 94 | 100 | 100 | 100 | 0 |
| Contact | 95 | 100 | 100 | 100 | 0 |

Ces valeurs dépendent de l’environnement, de la charge et du cache. Elles ne sont pas des mesures de trafic réel ni une garantie de score identique sur toutes les connexions. Une première série a présenté une anomalie de capture/trace ; seules les mesures valides, cohérentes avec l’observation du navigateur, sont retenues ici.

## Messagerie

Le formulaire publié a obtenu une acceptation HTTP 201 du transport Nexora, référence de contrôle NX-E3AC01F1. Cela confirme l’acceptation de l’envoi, mais ne vérifie pas la présence du message dans la boîte destinataire. Le compte Gmail connecté à l’assistant est distinct de la messagerie professionnelle. Les accusés automatiques au prospect nécessitent un expéditeur Resend vérifié ; aucun domaine vérifié n’est actuellement disponible dans le compte connecté.

## Figma et contrôles restant hors de cet environnement

Le fichier Figma contient les tokens, composants et wireframes éditables ordinateur/mobile. Le transfert des visuels par l’outil Figma a été tenté et renvoie HTTP 405 ; les emplacements restent nommés et les ressources sont disponibles dans `public/images/`. Les wireframes ne sont pas présentés comme des maquettes finales avec visuels intégrés.

Chrome/Chromium a été testé. Une validation dans Safari et Edge réels reste à réaliser sur ces applications. Le domaine personnalisé et la réception dans la messagerie destinataire doivent être contrôlés avec les accès correspondants. Redis distribué, CMS, anglais, espace client, calendrier et analytics restent des intégrations préparées, à configurer selon les besoins.
