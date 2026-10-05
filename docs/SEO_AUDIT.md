# Contrôle Google Search — 6 octobre 2026, Kinshasa

Site : https://nexora-digital-rdc.vercel.app/

## État confirmé dans Search Console

La propriété est vérifiée (`siteOwner`), lisible et active. Les deux comptes Google connectés incluent le compte professionnel ; aucun nouvel accès n’a été nécessaire.

Les 23 URL actuelles ont été inspectées : **7 sont indexées**, **4 sont découvertes mais pas encore indexées**, **12 sont inconnues de Google**. Le détail horodaté figure dans `SEO_INSPECTIONS.json`. L’appel groupé a expiré côté transport, mais ses 22 inspections ont bien été terminées et récupérées depuis l’historique, en complément de l’inspection de l’accueil.

Pages indexées : accueil, sites web, UI/UX, solutions sur mesure, à propos, FAQ et mentions légales. Les dates de dernière exploration s’étendent du 2 au 4 octobre : Google n’a pas encore réexploré l’ensemble de la refonte du 5 octobre.

La fenêtre de performance renvoyée par Search Console, du 5 septembre au 2 octobre, ne comporte aucun clic ni impression. Cela ne permet pas d’annoncer une position Google. L’indexation d’une URL ne garantit pas son classement sur une recherche commerciale.

## Corrections

- Redirection permanente de `/services/transformation-numerique` vers `/solutions`. L’ancienne URL était indexée mais renvoyait une 404 après la refonte. Les redirections existantes des applications et outils de gestion sont conservées.
- Descriptions SEO spécifiques aux huit services, de 139 à 153 caractères, séparées du texte visible pour conserver son contenu.
- Titres plus courts sur Solutions, À propos, Processus et FAQ.
- Sitemap de 23 URL, avec une date de modification fixe correspondant à la publication du contenu. Cette date doit être actualisée lors d’une modification éditoriale, sans être recalculée à chaque requête.
- Soumission du sitemap et vérification des routes publiques : résultats de livraison consignés ci-dessous.

L’audit initial de 20 pages commerciales indique **20 pages indexables et aucun problème critique, élevé ou moyen**. Les avertissements mineurs concernaient les métadonnées, certaines pages courtes et trois logos décoratifs par page. Ces logos ont un `alt` vide intentionnel, dans des éléments correctement nommés ou masqués aux lecteurs d’écran. Aucun texte superflu ni description redondante n’a été ajouté pour supprimer ces avertissements automatiques.

## E-mail

Le destinataire du service de production est confirmé : `nexoradigitalrdc@gmail.com`. Le test qualifié précédent a reçu la référence `NX-3DB158F7`. La boîte Gmail actuellement accessible au connecteur est la boîte personnelle, ce qui ne permet pas de confirmer la réception dans la boîte professionnelle.

L’expéditeur de production est encore `onboarding@resend.dev`. Aucun domaine d’envoi vérifié n’est présent dans le compte Resend connecté. Les confirmations automatiques aux prospects restent donc désactivées sur ce transport. Leur activation nécessite un domaine détenu par NEXORA DIGITAL et une vérification DNS ; l’adresse Gmail professionnelle peut rester la destinataire des demandes.

## Validation

Les 9 tests de sécurité et de qualification, le lint et le build Next.js passent après les corrections. La version `de01b2a3a24e45acd1f5477880e06020980e7413` a été déployée en production, état Vercel `READY`.

Les quatre anciennes adresses configurées renvoient une redirection permanente HTTP 308, suivie d’une page HTTP 200 : sites internet, applications, outils de gestion et transformation numérique. L’accueil et le CTA de devis ont également été vérifiés dans Chrome sur la version publique.

Un second audit des douze pages aux métadonnées modifiées confirme leurs descriptions et titres actualisés, leur statut indexable, et l’absence d’erreur critique, élevée ou moyenne.

Search Console a accepté le sitemap le 5 octobre à 23:53:03 UTC et l’a téléchargé à 23:53:05 UTC : **23 URL soumises, aucun avertissement, aucune erreur, traitement terminé**. Les chiffres d’indexation de ce rapport proviennent des inspections individuelles ; le compteur agrégé du sitemap ne sert pas de confirmation. Soumettre un sitemap n’indexe pas instantanément les pages.

L’import Figma a été retesté avec un lien d’import neuf, en multipart et en octets bruts : les deux formats pris en charge renvoient HTTP 405 depuis le service d’import. Les visuels du site publié sont bien présents ; ce blocage concerne seulement leur insertion dans les maquettes éditables. Aucun contournement non pris en charge ni nouvelle demande de devis n’a été envoyé.

Références : [migration d’URL](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [descriptions](https://developers.google.com/search/docs/appearance/snippet).
