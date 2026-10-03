# Vérification de la refonte Spectrum — 3 octobre 2026

## Périmètre

Préversion de la branche `refonte-spectrum`, dans le dépôt `berekiak/BERIX`. La production n’a pas été remplacée : la validation visuelle du propriétaire reste attendue.

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

## Vérifications restant nécessaires

1. Reconnecter la boîte officielle et vérifier les deux références ci-dessus, y compris le dossier spam.
2. Faire un envoi final depuis l’interface live du contact et du devis, puis vérifier la confirmation et la réception correspondante.
3. Tester le bouton WhatsApp sur un véritable iPhone/Safari, une tablette et un ordinateur disposant de WhatsApp ; les largeurs Chromium ne prouvent pas le lancement d’une application sur un appareil réel.
4. Valider visuellement la refonte avant sa publication sur la branche principale.
5. Après publication, recontrôler les en-têtes d’indexation, canonical, sitemap, redirections, et mesurer Lighthouse/PageSpeed. Aucun score Core Web Vitals mesuré n’est revendiqué ici.

Le domaine personnalisé et le traitement du sitemap dans Search Console restent des points distincts ; aucune première place Google ni indexation immédiate n’est garantie.
