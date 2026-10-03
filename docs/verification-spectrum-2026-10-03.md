# Vérification de la refonte Spectrum — 3 octobre 2026

## Périmètre

Préversion de la branche `refonte-spectrum`, puis publication sur `main` dans le dépôt `berekiak/BERIX`, explicitement demandée par le propriétaire le 3 octobre 2026. La refonte est publiée sur https://nexora-digital-rdc.vercel.app/.

La version fonctionnelle contrôlée en production correspond au commit `09c4223230ed28920fc6d95e3e94bf40a6f46340`, déploiement `dpl_G6sne6zrzGDuTx5cjDJd2xCYM87M`, statut Vercel `READY`. Le présent bilan et le renforcement du script de vérification peuvent ensuite être publiés sans modification des assets ou du backend du site.

## Corrections effectuées

- Métadonnées déplacées du corps HTML vers un `<head>` unique sur les 17 pages, avec titres distincts, descriptions, canonical et cartes sociales cohérentes.
- Contrôle de build renforcé : unicité des métadonnées, références locales, attributs d’images, absence de clé Resend dans les sources.
- Menu mobile fermé rendu inerte ; Échap le ferme et restitue le focus au bouton ; lien `aria-controls` et changement de largeur pris en charge.
- Révélation des sections progressive : contenu visible si JavaScript est indisponible ; animations respectant la préférence de mouvement réduit.
- Contraste amélioré pour les boutons et les titres sur fond clair ; cartes de valeurs et étapes de processus corrigées.
- Champs à 16 px pour limiter le zoom automatique lors de la saisie sur iPhone ; mise en page du formulaire corrigée aux largeurs intermédiaires.
- Confirmation uniquement après une réponse serveur structurée ; erreur réseau en français ; données conservées en cas d’échec.
- Confirmation de devis annoncée et focalisée pour les lecteurs d’écran.

## Résultats observés

| Contrôle | Résultat et niveau de preuve |
| --- | --- |
| Build et validation statique | Réussis ; 17 fichiers HTML contrôlés, 16 pages dans le sitemap. |
| Pages déployées | Les 16 routes publiques de la préversion répondent HTTP 200 ; métadonnées présentes dans le head ; WhatsApp présent. |
| Page introuvable | HTTP 404 et page Nexora Digital dédiée. |
| Sitemap et robots.txt | HTTP 200 sur la préversion. Les préversions Vercel sont intentionnellement non indexables via leur en-tête HTTP ; cela ne constitue pas un défaut de production. |
| API | GET rejeté en 405 ; demande invalide rejetée en 400. |
| Envoi réel contact | HTTP 201, `emailSent: true`, référence `NX-4BB675DE`. |
| Envoi réel devis | HTTP 201, `emailSent: true`, référence `NX-B84986B9`. |
| Réception Gmail | Non vérifiée pour ces nouveaux tests : le connecteur correspond à un autre compte et la session de la boîte officielle est déconnectée. L’acceptation par le service d’envoi ne prouve pas la réception en boîte. |
| Responsive | Accueil, contact et devis contrôlés dans Chromium à 320, 375, 390, 430, 768, 1024, 1440 et 1920 px, à travers des cadres de test à largeur fixe ; pas de débordement horizontal observé. |
| Menu mobile | Ouverture/fermeture, état inerte et retour du focus après Échap contrôlés dans le navigateur. |
| Devis mobile | Trois étapes parcourues ; retour conservant le service, le message, le budget et le délai. Aucun envoi externe effectué via cette interaction navigateur. |
| Contact mobile | Champs vides bloqués par la validation native ; aucun faux message de succès. |
| Confirmations et erreurs | Tests automatisés locaux de l’interface avec réponses simulées : succès, refus serveur, réponse protégée/malformée et panne réseau. Ils ne remplacent pas un envoi intégral par l’interface live. |
| E-mails structurés | Tests serveur sans envoi : destinataire officiel, Reply-To, coordonnées, service, message, budget, délai et échappement HTML vérifiés. |
| WhatsApp | Lien officiel `https://wa.me/243858181330` conservé et bouton visible aux huit largeurs. Le clic a été tenté ; l’ouverture du protocole d’application est bloquée par le navigateur cloud. Aucune conversation ni aucun message n’a été envoyé. |
| Console | Pas d’erreur applicative observée pendant les parcours ; les messages observés provenaient de l’extension du navigateur de test. |
| Secrets | Aucun motif de clé Resend détecté dans les sources contrôlées ni dans les différences de l’historique Git local disponible. Ce contrôle ciblé n’est pas un audit exhaustif de secrets. |

Les cadres responsive temporaires sont retirés du build final ; aucune route de contrôle `__qa` n’est livrée.

## Contrôles après publication

- Les 16 pages publiques répondent HTTP 200 sans authentification ; métadonnées et liens WhatsApp vérifiés.
- L’accueil a été ouvert et observé dans le navigateur cloud : nouvelle identité visuelle présente, canonical correcte et images chargées.
- La page inexistante répond HTTP 404 ; la route de contrôle temporaire `__qa` répond également HTTP 404.
- `/robots.txt` et `/sitemap.xml` répondent HTTP 200.
- Les 16 pages ont été contrôlées de nouveau avec leurs en-têtes HTTP : aucun `noindex` HTML ou HTTP ; le robots.txt permet l’exploration des pages publiques et exclut seulement l’API.
- Deux nouveaux envois ont été effectués via l’API de production : contact `NX-7BAABCA3`, devis `NX-B7CAB4AD`, chacun HTTP 201 avec `emailSent: true`.
- Aucun journal d’erreur/fatal n’a été retourné pour le déploiement contrôlé. Cela n’est pas une garantie d’absence de toute erreur future.
- La réception dans la boîte officielle et le lancement de WhatsApp sur des appareils physiques restent non vérifiés pour les raisons exposées ci-dessus.
- L’API publique PageSpeed a été sollicitée pour la version mobile de production ; réponse HTTP 429, quota journalier dépassé. Aucun score Lighthouse n’a pu être obtenu.
- Le connecteur GSC Wizard n’affiche aucune propriété connectée : l’état actuel du sitemap dans Google Search Console ne peut pas être recontrôlé par ce connecteur. Cela ne signifie pas que la propriété auparavant créée a été supprimée.

La commande de build Vercel inclut désormais la validation statique et les tests automatisés, afin qu’un échec bloque les prochaines publications.

## Vérifications restant nécessaires

1. Reconnecter la boîte officielle et vérifier les deux références ci-dessus, y compris le dossier spam.
2. Faire un envoi final depuis l’interface live du contact et du devis, puis vérifier la confirmation et la réception correspondante.
3. Tester le bouton WhatsApp sur un véritable iPhone/Safari, une tablette et un ordinateur disposant de WhatsApp ; les largeurs Chromium ne prouvent pas le lancement d’une application sur un appareil réel.
4. Revoir visuellement la version publiée et signaler les éventuels ajustements souhaités.
5. Mesurer Lighthouse/PageSpeed et recontrôler Search Console. Aucun score Core Web Vitals mesuré n’est revendiqué ici.

Le domaine personnalisé et le traitement du sitemap dans Search Console restent des points distincts ; aucune première place Google ni indexation immédiate n’est garantie.

### Dernières actions Search Console

1. Dans le compte Google propriétaire, sélectionner la propriété URL-prefix `https://nexora-digital-rdc.vercel.app/`. Si elle n’existe pas dans ce compte, l’ajouter avec cette URL exacte.
2. Vérifier la propriété si demandé, en utilisant la balise HTML présente sur la page d’accueil et le bouton « Vérifier ». Pour un futur domaine personnalisé, utiliser la propriété de domaine et l’enregistrement DNS fourni par Google.
3. Dans « Sitemaps », soumettre ou recontrôler `https://nexora-digital-rdc.vercel.app/sitemap.xml` et vérifier que le statut devient « Réussite ».
4. Dans « Inspection de l’URL », inspecter l’accueil, `/services`, `/contact` et `/devis`, tester l’URL publiée et demander l’indexation lorsqu’elle est disponible. L’acceptation et le délai dépendent de Google.
