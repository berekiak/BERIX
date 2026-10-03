# Nexora Digital

Site officiel de **Nexora Digital**, agence digitale basée à Kinshasa et spécialisée dans la création de sites web, le développement d’applications, les outils de gestion, le design UI/UX et la transformation numérique en République démocratique du Congo.

## Fonctionnalités

- 16 pages publiques responsives ;
- présentation des expertises et du processus de collaboration ;
- formulaire de contact et demande de devis en plusieurs étapes ;
- transmission sécurisée des demandes par e-mail ;
- bouton WhatsApp indépendant ;
- métadonnées SEO, Open Graph et Twitter/X Cards ;
- sitemap XML, robots.txt, données structurées Schema.org et page 404 ;
- navigation accessible au clavier et prise en charge de `prefers-reduced-motion`.

## Développement local

Prérequis : Node.js 20 ou supérieur.

```bash
npm run check
npm run build
npm test
```

Le résultat de production est créé dans `dist/`.

`npm test` vérifie sans envoi réel les confirmations, les erreurs réseau/serveur, les réponses malformées, la validation des demandes et le contenu des e-mails.

Pour contrôler un déploiement public :

```bash
node scripts/verify-live.mjs https://nexora-digital-rdc.vercel.app
```

Le script ne transmet aucune demande par défaut. L’option explicite `--send-tests` envoie deux messages clairement identifiés comme tests à l’adresse officielle. Une préversion protégée nécessite un fichier de cookies autorisé en troisième argument. Ne jamais versionner ce fichier.

Le bilan de la refonte et ses limites de vérification sont consignés dans `docs/verification-spectrum-2026-10-03.md`.

Le build ajoute une version basée sur le contenu aux URLs des styles, scripts, images et polices. Toute modification d'un asset produit une nouvelle URL, pour que les visiteurs chargent la dernière identité visuelle.

## Variables d’environnement

Copier `.env.example` vers `.env.local` pour le développement local. La clé Resend doit être configurée exclusivement comme variable serveur :

```text
RESEND_API_KEY=
NEXORA_CONTACT_EMAIL=nexoradigitalrdc@gmail.com
NEXORA_EMAIL_FROM=Nexora Digital <onboarding@resend.dev>
```

Ne jamais exposer `RESEND_API_KEY` dans le navigateur, dans une variable publique ou dans Git.

## Déploiement Vercel

1. Importer ce dépôt dans Vercel.
2. Conserver la commande `npm run build && npm run check && npm test` et le dossier de sortie `dist` : chaque publication est bloquée si un contrôle échoue.
3. Ajouter `RESEND_API_KEY` aux variables d’environnement de production.
4. Déployer, puis vérifier `/contact`, `/devis`, `/robots.txt` et `/sitemap.xml`.

Tant que la variable Resend n’est pas encore configurée sur Vercel, la fonction serveur relaie les demandes vers le backend sécurisé déjà actif afin d’éviter toute interruption de service.

## Sécurité

- aucune clé API n’est incluse dans le dépôt ;
- validation serveur de toutes les demandes ;
- échappement des données intégrées aux e-mails ;
- champ anti-robot et identifiant d’idempotence ;
- en-têtes de sécurité configurés dans `vercel.json`.

## Coordonnées officielles

- E-mail : [nexoradigitalrdc@gmail.com](mailto:nexoradigitalrdc@gmail.com)
- WhatsApp : [+243 85 81 81 330](https://wa.me/243858181330)

© Nexora Digital.
