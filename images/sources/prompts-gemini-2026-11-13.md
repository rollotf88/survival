# Prompts Gemini du 2026-11-13

## A. Lampes à pétrole à la place des ampoules (plus d'électricité dans le jeu)

Une image par pièce. Joindre l'image de la pièce indiquée, puis envoyer le prompt.
Après chaque image, vérifier : MÊME cadrage, même taille, rien d'autre n'a bougé (Claude ne découpera que la lampe et sa lumière).

### Prompt commun (à envoyer avec chaque image)

Voici une image de mon jeu. Garde EXACTEMENT la même image, au pixel près : même cadrage, même taille, mêmes meubles, mêmes couleurs, même style dessiné. Change UNE SEULE chose : la lampe électrique suspendue au plafond (abat-jour vert avec une ampoule allumée) doit devenir une vieille lampe à pétrole en métal suspendue au plafond par une chaîne, allumée, avec une petite flamme orange et une lueur chaude et douce autour, dans le même style que les lanternes déjà présentes dans l'image. Il n'y a plus d'électricité dans ce monde. Ne modifie rien d'autre : ni les murs, ni le sol, ni les objets, ni la lumière générale de la pièce.

### Les images à joindre (une par message)

1. `images/refuge-fond-sans-table.webp` : le salon (suspension verte au-dessus du canapé)
2. `images/piece-atelier.webp` : l'atelier (suspension verte au-dessus de l'établi)
3. `images/piece-garage.webp` : le garage, voiture en panne (ampoule nue au plafond, au-dessus de la voiture). Pour ce message, remplacer « abat-jour vert avec une ampoule allumée » par « ampoule nue allumée dans une petite grille de protection »
4. `images/piece-reserve.webp` : la réserve (ampoule nue au plafond). Même remarque que pour le garage

Pas besoin de refaire `piece-garage-ok.webp` (voiture réparée) : même cadrage que le garage, Claude y collera la même lampe.
La cuisine a déjà une lanterne. Dans la chambre, l'ampoule est éteinte : on peut la laisser.

## B. Icône du Cocktail Molotov

Même conversation que les planches d'icônes si possible (sinon joindre `images/refuge-fond.webp` et une icône existante comme `images/icones/hache.webp` en référence de style).

Crée une seule icône d'objet pour un jeu mobile de survie post-apocalyptique, dans le même style que les images jointes : dessin cartoon peint, couleurs chaudes un peu usées, contour brun foncé épais et net, léger volume et lumière venant du haut à gauche, très lisible même en tout petit. L'objet : un cocktail Molotov, une bouteille en verre vert ou brun remplie d'un liquide ambré, avec un chiffon enfoncé dans le goulot dont le bout brûle (petite flamme orange et jaune). Format carré 1:1, l'objet centré, vu de trois quarts, il occupe environ 75 % de l'image avec une marge vide tout autour. Fond magenta pur uni (#FF00FF), sans dégradé, sans ombre portée, sans sol. Aucun texte, aucun cadre.
