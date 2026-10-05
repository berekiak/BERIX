# NEXORA DIGITAL

Site officiel de NEXORA DIGITAL, conçu comme une plateforme commerciale pour présenter les services, démontrer les réalisations et qualifier les demandes de projet.

## Stack

- Next.js 16 et React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Zod pour la validation serveur
- Resend pour les e-mails
- Redis compatible Upstash pour le rate limiting et l'idempotence

## Installation

Prérequis : Node.js 24 et npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Le site est alors disponible sur `http://localhost:3000`.

## Commandes

```bash
npm run dev        # serveur de développement
npm run lint       # analyse statique
npm run typecheck  # vérification TypeScript
npm test           # tests de sécurité et de validation
npm run build      # build de production
npm run start      # serveur de production local
```

## Configuration

Les variables publiques et secrètes attendues sont documentées dans `.env.example`. Les clés d'API doivent rester dans les variables d'environnement du serveur et ne doivent jamais être ajoutées au dépôt.

Pour activer l'envoi des demandes :

1. configurer `RESEND_API_KEY`, `NEXORA_CONTACT_EMAIL` et `NEXORA_EMAIL_FROM` ;
2. configurer idéalement `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` et `RATE_LIMIT_SALT` pour une limitation distribuée ;
3. vérifier le domaine d'expédition auprès du fournisseur d'e-mail ;
4. envoyer une demande de test depuis la prévisualisation Vercel avant la promotion en production.

Tant que le domaine Resend définitif n'est pas vérifié, le serveur peut utiliser le service d'e-mail Nexora déjà déployé comme transport de secours. Cette adresse n'est appelée que depuis l'API serveur.

Sans Redis, l'API utilise une limitation en mémoire par instance, avec des adresses IP hachées par une clé aléatoire propre au processus. Cette protection permet le lancement ; Redis reste recommandé pour appliquer les quotas de façon uniforme sur toutes les instances.

## Structure

- `app/` : routes, SEO, API et pages d'erreur
- `components/` : composants partagés et navigation
- `components/ui/` : primitives du design system
- `sections/` : composition des pages
- `data/` : contenu éditorial prêt pour une migration CMS
- `lib/` : configuration, validation, e-mails, analytics et sécurité
- `public/` : logo, polices et visuels optimisés
- `docs/` : design system et architecture
- `tests/` : tests serveur ciblés

## Déploiement Vercel

Le projet est compatible avec l'intégration GitHub de Vercel. Le build utilise `npm run build`. Après chaque déploiement, vérifier l'URL de prévisualisation, les formulaires, le sitemap, les en-têtes de sécurité et les principales tailles d'écran avant la promotion en production.

## Contenu et CMS

Les services, projets, FAQ et futurs témoignages sont centralisés dans `data/`. Cette séparation permet d'ajouter ultérieurement Sanity, Contentful, Strapi ou un autre CMS sans réécrire les pages.

## Ressources de marque

Le logo officiel fourni par NEXORA DIGITAL pilote les couleurs et la direction artistique. Les visuels de services ont été créés spécifiquement pour ce projet, puis convertis en WebP pour le web. Aucun témoignage ni résultat chiffré fictif n'est publié.
