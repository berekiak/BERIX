# Architecture et évolution

## Parcours commercial

Accueil → expertise ou besoin → service détaillé → réalisation/étude de cas → devis. Les visiteurs qui veulent une discussion rapide disposent du contact, de l’e-mail et de WhatsApp.

## Structure

Next.js App Router. Contenus statiques rendus côté serveur. Composants client limités au menu mobile, aux filtres, au formulaire et à l’animation de la composition principale. Les pages restent lisibles sans animation. Les données de référence sont dans `data/content.ts` et les interfaces dans `types/content.ts`. `lib/content.ts` définit la frontière du futur CMS.

Pages livrées : accueil, services, huit services détaillés, solutions, réalisations, études de cas, trois études détaillées, à propos, processus, contact, devis, FAQ, mentions légales, confidentialité. Une page 404 et des états de chargement et d’erreur complètent les parcours.

## Formulaires

Validation client + serveur par Zod. Vérification de l’origine, limite de 20 Ko, champs bornés, contrôle des URLs, honeypot, délai minimum, consentement. Rate limit partagé via Redis REST (5 requêtes / 10 minutes / empreinte réseau). Sans Redis, une protection en mémoire bornée à 5 000 entrées s’applique par instance. Ce mode permet le lancement mais ne partage pas les quotas entre instances et ne survit pas aux redémarrages. Redis est recommandé pour des quotas et reçus uniformes en production. Aucune donnée de formulaire n’est journalisée.

Une notification est envoyée à Nexora via Resend lorsque la clé et l’expéditeur sont configurés. Sinon, le serveur transmet la demande au service de messagerie Nexora existant, à destination de nexoradigitalrdc@gmail.com. La reprise utilise ce même transport uniquement après un refus définitif de configuration ; un timeout ne déclenche pas un second transport. Tous les détails de qualification sont conservés dans le message, limité à 5 000 caractères par validation client et serveur. L’envoi au prospect est distinct ; son échec ne fait pas perdre la demande principale. Clés d’idempotence du fournisseur et reçus temporaires (24 h) empêchent les doublons lors d’une reprise réseau. Les secrets restent côté serveur.

## Évolution préparée

- CMS : les contenus et types sont séparés du rendu ; `contentRepository` fournit un contrat initial. Brancher les pages et leurs métadonnées sur cet adaptateur lors de l’intégration d’un CMS, puis valider les données entrantes. Témoignages invisibles tant qu’ils ne sont pas approuvés.
- Anglais : compléter `data/locales/en.ts`, déplacer les routes sous un segment de langue et ajouter hreflang après traduction réelle.
- Blog : contenus typés/MDX ou CMS, pages par article, schema Article seulement lorsque les articles existent.
- Secteurs : pages dédiées à partir de contenus sectoriels distincts, sans duplication de mots-clés.
- Espace client : groupe de routes `(client)`, authentification et autorisation serveur avant documents, factures et messages.
- Rendez-vous : service de calendrier sélectionné ultérieurement ; aucun faux calendrier n’est présenté.
- Analytics : activables via un collecteur serveur sans cookie publicitaire ; événements et chemins seuls, aucun champ de formulaire.

## SEO

Métadonnées par page, canonicals basés sur NEXT_PUBLIC_SITE_URL, images Open Graph, sitemap, robots, manifest et JSON-LD Organization/Service/BreadcrumbList/FAQPage. Pas de faux LocalBusiness sans adresse précise, pas d’Article sans contenu, pas de chiffres ou témoignages inventés.

## Réception des demandes

Une réponse API 201 confirme l’acceptation du transport, pas la présence du message dans la boîte de réception. Le reçu possède une référence permettant de rechercher le test dans la messagerie destinataire. `confirmationSent` indique séparément si un accusé a été envoyé au prospect. Ce dernier reste désactivé avec le transport existant tant qu’un expéditeur Resend vérifié n’est pas disponible.
