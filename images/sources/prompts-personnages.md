# Prompts Gemini : les personnages dans les pièces (premier essai : la chambre)

Idée de Fabien (2026-11-11) : voir la famille dans les pièces (au lit quand elle dort, au canapé, à la cuisinière…).
Méthode (la même que les barricades, qui a très bien marché) : Gemini RETOUCHE la pièce elle-même en ajoutant UN seul
personnage à UN endroit précis ; Claude découpe ensuite juste cet endroit (le lit) et le colle au pixel près.
Comme chaque morceau ne couvre que son lit, ils se combinent : Papa dans un lit + Emma dans un autre, avec ou sans feu,
avec n'importe quel niveau de barricade. Le personnage a exactement la lumière et le style de la pièce : pas d'effet « collé ».

Une seule conversation Gemini. Au premier message, joindre `images/piece-chambre-propre.webp` ET les 4 portraits
`images/portrait-papa.webp`, `images/portrait-maman.webp`, `images/portrait-leo.webp`, `images/portrait-emma.webp`.
Puis un message = une image. À chaque fois, vérifier : un seul personnage, rien d'autre n'a bougé (lits, couvertures,
bougie, cheminée, fenêtre), même cadrage, même taille.

Message 1 (Papa, matelas au sol à gauche) :
> Reprends EXACTEMENT la première image (la chambre), même cadrage, même taille, même style, même lumière. Ajoute UNIQUEMENT l'homme du premier portrait (barbe, cheveux bruns en bataille, veste vert kaki) endormi dans le matelas posé au sol à gauche : allongé sur le côté, la tête sur l'oreiller, la couverture en patchwork remontée jusqu'aux épaules, les yeux fermés, l'air épuisé mais paisible. Il reste entièrement dans le matelas. Ne change rien d'autre dans la pièce, ne déplace rien. Aucun texte.

Message 2 (Maman, matelas au sol à droite) :
> Reprends EXACTEMENT la chambre d'origine (sans l'homme), même cadrage, même taille, même lumière. Ajoute UNIQUEMENT la femme du deuxième portrait (cheveux châtains attachés, veste marron) endormie dans le matelas posé au sol à droite : allongée sur le côté, la tête sur l'oreiller, la couverture en patchwork remontée jusqu'aux épaules, les yeux fermés. Elle reste entièrement dans le matelas. Ne change rien d'autre. Aucun texte.

Message 3 (Léo, lit du bas des lits superposés) :
> Reprends EXACTEMENT la chambre d'origine (sans personne), même cadrage, même taille, même lumière. Ajoute UNIQUEMENT l'adolescent du troisième portrait (cheveux noirs en bataille, sweat gris à capuche) endormi dans le lit du BAS des lits superposés : allongé, la tête sur l'oreiller à gauche, la couverture en patchwork sur lui, les yeux fermés. Il reste entièrement dans ce lit. Ne change rien d'autre. Aucun texte.

Message 4 (Emma, lit du haut des lits superposés) :
> Reprends EXACTEMENT la chambre d'origine (sans personne), même cadrage, même taille, même lumière. Ajoute UNIQUEMENT la jeune fille du quatrième portrait (longs cheveux châtains, pull rose) endormie dans le lit du HAUT des lits superposés : allongée, la tête sur l'oreiller à gauche, la couverture en patchwork sur elle, les yeux fermés. Elle reste entièrement dans ce lit. Ne change rien d'autre. Aucun texte.

Si l'essai plaît : les autres lits pour chacun (pour que n'importe qui puisse dormir n'importe où), les recrues
(Sam, Nora, Inès, Yanis), puis le canapé du salon (assis : normal, épuisé, moral bas, folie) et la cuisinière (le cuisinier).

## Correction demandée par Fabien (2026-11-11) : les lits vides ont l'air bombés (comme si quelqu'un dormait dessous)
Une seule image, à partir de la chambre d'origine (joindre `images/piece-chambre-propre.webp`) :
> Reprends EXACTEMENT cette image, même cadrage, même taille, même style, même lumière. Modifie UNIQUEMENT les quatre lits (le lit du haut et le lit du bas des lits superposés, et les deux matelas posés au sol) : ils sont vides et faits, la couverture en patchwork est tirée bien à plat, sans aucun creux ni bosse, l'oreiller posé à plat à la tête du lit. On doit voir au premier coup d'œil que personne n'est couché dedans. Ne change rien d'autre dans la pièce (cheminée, fenêtre, bougie, réveil, armoire, porte). Aucun texte.

### 2e essai (le 1er a rendu des lits presque identiques, avec en plus des dessins au mur sous le lit du haut)
Joindre `images/piece-chambre-propre.webp` :
> Reprends EXACTEMENT cette image, même cadrage, même taille, même style, même lumière. Modifie UNIQUEMENT les quatre lits pour qu'on voie tout de suite que personne n'y dort : sur chaque lit (lit du haut et lit du bas des lits superposés, et les deux matelas au sol), la couverture en patchwork est PLIÉE en carré et posée au pied du lit, le drap blanc est tiré bien à plat et bien visible sur le reste du matelas, l'oreiller est posé à plat. Aucune bosse, aucun creux. N'ajoute rien sur les murs, ne change rien d'autre dans la pièce (cheminée, fenêtre, bougie, réveil, armoire, porte). Aucun texte.

## Étape suivante (à faire le 2026-11-12, Fabien n'avait plus de crédits) : 3 images seulement
Astuce pour économiser : plusieurs personnes dans UNE image si elles sont à des endroits différents (Claude découpe chaque endroit).

Image 1 — les 4 recrues dans la chambre. Joindre `images/sources/chambre-lits-vides-gemini.webp` + `images/portrait-sam.webp`, `portrait-nora.webp`, `portrait-ines.webp`, `portrait-yanis.webp` :
> Reprends EXACTEMENT la première image (la chambre aux lits vides), même cadrage, même taille, même style, même lumière. Ajoute UNIQUEMENT quatre personnes endormies, une par lit, chacune sous sa couverture en patchwork dépliée sur elle, la tête sur l'oreiller, les yeux fermés : l'homme du premier portrait sur le matelas au sol à gauche, la femme du deuxième portrait sur le matelas au sol à droite, la femme du troisième portrait dans le lit du BAS des lits superposés, l'homme du quatrième portrait dans le lit du HAUT. Chacun reste entièrement dans son lit. Ne change rien d'autre dans la pièce. Aucun texte.

Image 2 — Papa et Maman sur le canapé. Joindre `images/refuge-fond-eteint-propre.webp` + `images/portrait-papa.webp`, `portrait-maman.webp` :
> Reprends EXACTEMENT la première image (le salon), même cadrage, même taille, même style, même lumière. Ajoute UNIQUEMENT deux personnes assises sur le canapé vert, bien séparées : l'homme du premier portrait assis à l'extrémité GAUCHE du canapé, et la femme du deuxième portrait assise à l'extrémité DROITE. Ils sont assis normalement, fatigués mais calmes, les mains sur les genoux ou une tasse à la main, les pieds au sol devant le canapé, sans toucher la table basse. Le milieu du canapé reste vide. Ne change rien d'autre dans la pièce (table basse, lanterne, livres, cheminée, fauteuil, portraits au mur). Aucun texte.

Image 3 — Léo et Emma sur le canapé. Mêmes pièces jointes que l'image 2, avec `portrait-leo.webp`, `portrait-emma.webp` :
> Reprends EXACTEMENT la première image (le salon), même cadrage, même taille, même style, même lumière. Ajoute UNIQUEMENT deux personnes assises sur le canapé vert, bien séparées : l'adolescent du premier portrait assis à l'extrémité GAUCHE du canapé, et la jeune fille du deuxième portrait assise à l'extrémité DROITE. Ils sont assis normalement, les pieds au sol devant le canapé, sans toucher la table basse ; l'adolescent lit un livre, la jeune fille tient un coussin contre elle. Le milieu du canapé reste vide. Ne change rien d'autre dans la pièce. Aucun texte.

Ensuite : humeurs sur le canapé (épuisé, moral bas, folie) et la cuisinière (meilleur cuisinier vivant).
