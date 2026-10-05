# Architecture et évolution

## Parcours commercial

Accueil → expertise ou besoin → service détaillé → réalisation/étude de cas → devis. Les visiteurs qui veulent une discussion rapide disposent du contact, de l’e-mail et de WhatsApp.

## Structure

Next.js App Router. Contenus statiques rendus côté serveur. Composants client limités au menu mobile, aux filtres, au formulaire et à l’animation de la composition principale. Les pages restent lisibles sans animation. Les données de référence sont dans `data/content.ts` et les interfaces dans `types/content.ts`. `lib/content.ts` définit la frontière du futur CMS.

Pages livrées : accueil, services, huit services détaillés, solutions, réalisations, études de cas, trois études détaillées, à propos, processus, contact, devis, FAQ, mentions légales, confidentialité. Une page 404 et des états de chargement et d’erreur complètent les parcours.

## Formulaires

Validation client + serveur par Zod. Vérification de l’origine, limite de 20 Ko, champs bornés, contrôle des URLs, honeypot, délai minimum, consentement. Rate limit partagé via Redis REST (5 requêtes / 10 minutes / empreinte réseau). Le serveur refuse les envois si le limiteur partagé manque en production ; la mémoire locale est réservée au développement. Aucune donnée de formulaire n’est journalisée.

Une notification est envoyée à Nexora via Resend. L’envoi au prospect est distinct ; son échec ne fait pas perdre la demande principale. Clés d’idempotence du fournisseur et reçus temporaires (24 h) empêchent les doublons lors d’une reprise réseau. Les secrets restent côté serveur.

## Évolution préparée

- CMS : remplacer l’adaptateur `contentRepository` et valider les données entrantes. Témoignages invisibles tant qu’ils ne sont pas approuvés.
- Anglais : compléter `data/locales/en.ts`, déplacer les routes sous un segment de langue et ajouter hreflang après traduction réelle.
- Blog : contenus typés/MDX ou CMS, pages par article, schema Article seulement lorsque les articles existent.
- Secteurs : pages dédiées à partir de contenus sectoriels distincts, sans duplication de mots-clés.
- Espace client : groupe de routes `(client)`, authentification et autorisation serveur avant documents, factures et messages.
- Rendez-vous : service de calendrier sélectionné ultérieurement ; aucun faux calendrier n’est présenté.
- Analytics : activables via un collecteur serveur sans cookie publicitaire ; événements et chemins seuls, aucun champ de formulaire.

## SEO

Métadonnées par page, canonicals basés sur NEXT_PUBLIC_SITE_URL, images Open Graph, sitemap, robots, manifest et JSON-LD Organization/Service/BreadcrumbList/FAQPage. Pas de faux LocalBusiness sans adresse précise, pas d’Article sans contenu, pas de chiffres ou témoignages inventés.
