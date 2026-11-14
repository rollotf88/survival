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

## C. Léo et Emma aux fourneaux (à refaire : avec l'ancien prompt, ils avaient une taille et une posture d'adultes)

Une image par enfant. Joindre `images/piece-cuisine.webp` + le portrait de l'enfant (`images/portrait-leo.webp` ou `images/portrait-emma.webp`), et en troisième image, comme repère de taille, `images/personnages/cuisine-maman.webp` (la mère déjà dessinée dans cette cuisine).

### Léo (adolescent d'environ 13 ans)

Voici une cuisine (première image), le portrait d'un garçon de 13 ans (deuxième image) et sa mère déjà dessinée devant cette même cuisinière (troisième image, seulement pour comparer les tailles, ne la dessine pas). Garde la cuisine IDENTIQUE au pixel près : même cadrage, même taille, même style, mêmes couleurs, même lumière. Ajoute UNIQUEMENT ce garçon devant la cuisinière, vu de trois quarts, qui remue une casserole avec une cuillère en bois. C'est un enfant de 13 ans, pas un adulte : il est nettement plus petit que sa mère (le haut de sa tête arrive à peu près à la hauteur de ses yeux à elle, environ 85 % de sa taille), plus fin, épaules étroites, visage enfantin comme sur le portrait. Il se tient un peu sur la pointe des pieds et tend le bras vers la casserole, l'air appliqué. Il est entier, de la tête aux pieds, ses deux pieds bien visibles au sol. Même style que le portrait : dessin cartoon peint, contours brun foncé épais et nets tout autour de lui (il sera découpé). Personne d'autre. Aucun texte.

### Emma (petite fille d'environ 9 ans)

Voici une cuisine (première image), le portrait d'une petite fille de 9 ans (deuxième image) et sa mère déjà dessinée devant cette même cuisinière (troisième image, seulement pour comparer les tailles, ne la dessine pas). Garde la cuisine IDENTIQUE au pixel près : même cadrage, même taille, même style, mêmes couleurs, même lumière. Ajoute UNIQUEMENT cette petite fille devant la cuisinière. C'est une enfant de 9 ans, beaucoup plus petite qu'un adulte : debout par terre, sa tête arriverait à peine à la poitrine de sa mère. Pour atteindre la casserole, elle est montée sur une petite caisse en bois retournée posée devant la cuisinière, et remue la casserole avec une cuillère en bois tenue à deux mains, concentrée, la langue un peu sortie. Visage rond et enfantin comme sur le portrait, petites mains, silhouette d'enfant. Elle et la caisse sont entières, ses deux pieds bien posés sur la caisse, la caisse bien posée au sol. Même style que le portrait : dessin cartoon peint, contours brun foncé épais et nets tout autour d'elle et de la caisse (elles seront découpées ensemble). Personne d'autre. Aucun texte.

## D. Les recrues qui n'ont pas de place au salon (2026-11-14)

Une recrue reprend la place d'un membre de la famille (Yanis = Papa, Nora = Léo, Sam = Emma, Inès = Maman). Quand ce membre est encore en vie, la recrue n'a pas de place au salon : on la montre ailleurs. Une image par recrue. Joindre l'image de la pièce + le portrait de la recrue. Vérifier ensuite que la pièce est IDENTIQUE (même cadrage, même taille, rien d'autre n'a bougé) et que la personne est entière, pieds compris.

### Prompt commun (remplacer [PERSONNE] et [ACTION])

Voici une pièce de mon jeu (première image) et le portrait d'une personne (deuxième image). Garde la pièce IDENTIQUE au pixel près : même cadrage, même taille, mêmes objets, mêmes couleurs, même lumière, même style dessiné. Ajoute UNIQUEMENT cette personne : [PERSONNE], [ACTION]. Elle est entière, de la tête aux pieds, ses deux pieds bien visibles posés au sol, à la même échelle qu'un adulte dans cette pièce. Même style que le portrait : dessin cartoon peint, contours brun foncé épais et nets tout autour d'elle (elle sera découpée). Personne d'autre. Aucun texte.

### 1. Yanis dans la réserve
Joindre : `images/piece-reserve.webp` + `images/portrait-yanis.webp`
[PERSONNE] = un homme barbu d'une quarantaine d'années avec un bonnet, comme sur le portrait
[ACTION] = debout devant les étagères, un peu à gauche du milieu, de trois quarts, qui compte les conserves en notant sur un petit carnet avec un crayon

### 2. Nora dans la réserve
Joindre : `images/piece-reserve.webp` + `images/portrait-nora.webp`
[PERSONNE] = la femme du portrait
[ACTION] = à droite, devant les caisses en bois empilées, accroupie, qui range des boîtes dans une caisse ouverte

### 3. Sam dans l'atelier
Joindre : `images/piece-atelier.webp` + `images/portrait-sam.webp`
[PERSONNE] = l'homme du portrait
[ACTION] = debout derrière l'établi, au milieu, de trois quarts, qui scie ou cloue une planche posée sur l'établi

### 4. Inès dans l'atelier
Joindre : `images/piece-atelier.webp` + `images/portrait-ines.webp`
[PERSONNE] = la femme blonde du portrait
[ACTION] = à gauche, près des planches appuyées contre le mur, qui en porte une sous le bras en vérifiant si elle est droite
