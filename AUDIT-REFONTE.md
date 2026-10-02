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

## Seconde refonte — Noir / Atelier — 2 octobre 2026

- Identité sombre : anthracite, ivoire, or discret, bleu secondaire. Navigation, accueil, six expertises, pages institutionnelles, formulaires, FAQ et pied de page harmonisés.
- Monogramme N et logotype vectoriels, favicon assorti. Police Manrope hébergée localement, licence OFL conservée.
- Toutes les illustrations IA présentes dans l'interface remplacées par cinq photographies réelles sous licence Unsplash. Sources et affectations dans ASSETS-LICENSES.md. Les photos sont illustratives, sans prétendre montrer l'équipe ou les locaux de l'agence.
- Mise en forme manquante des grandes images des pages de services corrigée. Dimensions réelles des images renseignées pour réserver leur espace.
- Message d'erreur du devis désormais visible et accessible au clavier ; consentement conservé correctement entre les étapes.
- URLs des styles, scripts, polices et images versionnées à partir de leur contenu lors du build. Le cache des fichiers à nom fixe est revalidé, afin d'éviter qu'un visiteur conserve l'ancien design après une mise à jour.

### Vérifications effectuées

- Build de production et contrôle des 17 pages : réussis.
- Transformation du build exécutée plusieurs fois : résultat stable ; modifier le CSS change son URL, restaurer le CSS restitue la version initiale. Toutes les ressources versionnées correspondent à des fichiers présents.
- Contrôle des liens internes et ressources locales, un H1 par page : aucune erreur détectée.
- Toutes les images WebP ouvertes et vérifiées ; aucune image vide. Aucun secret ajouté au frontend ou au dépôt.
- Accueil ouvert dans Chrome distant : photographies et logo chargés, police Manrope chargée, aucun débordement horizontal. Aucun défaut JavaScript du site observé ; l'extension du navigateur distant produit ses propres logs.
- Contact : validation des champs vides, envoi réel réussi, confirmation affichée — référence NX-F33465AA.
- Devis : trois étapes, retour et conservation des valeurs, rejet serveur d'une adresse sans domaine public et message d'erreur visible, puis envoi réel réussi — référence NX-2E3E14E3.
- API Vercel : réponses de succès 201 et rejet attendu 400 observés dans les logs. L'acceptation par le service d'envoi ne constitue pas une preuve de présence dans la boîte Gmail ; la réception dans cette boîte n'a pas pu être vérifiée.
- WhatsApp : lien https://wa.me/243858181330 conservé sur les pages, clic effectué. Le navigateur distant bloque le protocole d'ouverture d'application native ; la conversation sur un appareil réel n'a pas pu être vérifiée.

### Limites et état de publication

La refonte est publiée en aperçu sur la branche redesign-signal-white. La production existante est conservée. Les adaptations CSS mobile et tablette sont présentes, mais aucun test sur iPhone physique, tablette physique ou Safari iOS n'a été effectué dans cet environnement. Aucun score Lighthouse supplémentaire n'est revendiqué.
