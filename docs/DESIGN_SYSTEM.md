# NEXORA DIGITAL — Design system v2

## Direction

Le monogramme officiel représente un N continu, aux surfaces bleues et aux revers dorés. Les contrastes du logo, son ouverture centrale et ses contours lumineux guident cette identité. Le logo fourni reste la source officielle : aucune réinterprétation ne le remplace.

La composition associe un fond presque noir, une typographie ample, des lignes fines et des visuels produits. Le rythme alterne grands espaces éditoriaux et grilles de services. Répartition recherchée : 80 % sombre, 15 % bleu/cyan, 5 % doré maximum.

| Token | Valeur | Usage |
| --- | --- | --- |
| Primary | #246BFD | Boutons primaires, actions |
| Secondary | #58DDF5 | Titres accentués, liens |
| Accent | #D8B578 | Détails premium |
| Background | #060A14 | Fond global |
| Surface | #0D1423 | Cartes |
| Surface Elevated | #142034 | Menu, champs sélectionnés |
| Text Primary | #F4F6FC | Titres et contenu principal |
| Text Secondary | #AAB7CD | Paragraphes |
| Muted | #8A9BB8 | Métadonnées |
| Border | #28354B | Contours |
| Glow Blue | #246BFD | Lumière, opacité 12–20 % |
| Glow Cyan | #58DDF5 | Lumière, opacité 8–16 % |
| Gold Accent | #D8B578 | Numéros, séparateurs |
| Success | #72D8AD | Confirmation |
| Warning | #EAC183 | Information |
| Error | #FF9BAA | Erreur |

## Typographie

Titres : Space Grotesk, 500–700. Texte : Manrope, 400–700. Deux familles, locales et auto-hébergées. Display 52–100 px adaptatif, H1 44–80, H2 34–56, H3 24–32, H4 20, body large 20, body 16–18, small 14, caption 12. Interlignage des titres 1.06–1.15, corps 1.65. Titres avec approche -0.04em maximum.

## Mise en page et composants

Base de 4/8 px. Espacements : 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Conteneur 1280 px, gouttière 24 px desktop / 20 px mobile. Colonnes : 12 desktop, 6 tablette, 4 mobile. Sections 112 px desktop / 64 px mobile. Rayons 8/16/24 px. Bordures 1 px.

Composants partagés : Button (primary/secondary/text), Badge, Field, ServiceCard, ProjectCard, Accordion, Header, Footer, CTA. Taille tactile 44 px minimum. Focus visible cyan 2 px, décalage 4 px. État disabled lisible, hover sans déplacement excessif. Les erreurs de formulaire sont liées au champ et annoncées via aria-live.

Menu mobile avec fermeture par Échap, retour de focus et verrouillage du scroll. Accordéons natifs. Formulaire de devis : projet → périmètre → coordonnées, progression annoncée et saisie conservée en cas d'erreur.

## Animation et responsive

Hover 180–220 ms, apparitions 450–650 ms, déplacement 16 px maximum. Animations au premier passage uniquement. Respect de prefers-reduced-motion, aucune boucle permanente. Breakpoints 640/768/1024/1280/1536. Vérifications 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920 px.

## Contenu et évolution

Services et projets fortement typés. Études de cas à statut explicite. Témoignages affichés uniquement après validation. Adaptateur de contenu remplaçable pour un CMS ; dictionnaire FR séparé pour préparer EN. Les futures routes de compte et de blog restent hors du menu tant que leur contenu n'est pas activé.

Figma : https://www.figma.com/design/F3mAQLAymW1bILx9B6vVqS
