# Prompts Gemini : barricades aux fenêtres (3 niveaux)

Demandé par Fabien le 2026-11-11 : les planches posées sur la porte ne sont pas logiques (on ne les enlève pas à chaque sortie).
Les barricades iront sur les FENÊTRES, selon le niveau de barricade du refuge (0, 1, 2, 3).

Méthode : Gemini RETOUCHE chaque pièce (même image, seule la fenêtre change). Claude découpe ensuite juste la fenêtre de chaque version et la pose sur la pièce selon le niveau (comme les objets de confort). Ça garantit que les planches suivent exactement la perspective de la fenêtre et que le reste de la pièce ne bouge pas.

Une conversation Gemini par pièce. Joindre l'image indiquée, puis envoyer les messages dans l'ordre (un message = une image).
Pour chaque image, vérifier : même cadrage, même taille, rien d'autre n'a changé dans la pièce (meubles, lumière, couleurs).

Les 3 niveaux (même description pour toutes les pièces) :
- Niveau 1 « quelques planches » : 2 ou 3 planches de bois clouées en travers de la fenêtre, de travers, on voit encore bien la vitre et la lumière entre elles.
- Niveau 2 « bien barricadée » : des planches serrées, clouées en croix et à l'horizontale sur toute la fenêtre, gros clous visibles, il ne passe plus qu'un peu de lumière par les fentes.
- Niveau 3 « fortifiée » : la fenêtre est entièrement couverte de planches épaisses doublées de plaques de tôle rouillée rivetées, avec un rang de fil barbelé par-dessus ; plus aucune lumière ne passe.

---

## Salon — joindre `images/refuge-fond-propre.webp` (fenêtre à gauche, avec les rideaux)

Message 1 :
> Reprends EXACTEMENT cette image, même cadrage, même taille, même style, même lumière. Modifie UNIQUEMENT la fenêtre à gauche (celle avec les rideaux) : ajoute 2 ou 3 planches de bois clouées en travers, de travers, on voit encore bien la vitre et la lumière entre elles. Ne change rien d'autre dans la pièce. Aucun texte.

Message 2 :
> Même chose à partir de l'image d'origine, mais la fenêtre de gauche est bien barricadée : des planches serrées, clouées en croix et à l'horizontale sur toute la fenêtre, gros clous visibles, il ne passe plus qu'un peu de lumière par les fentes. Ne change rien d'autre.

Message 3 :
> Même chose à partir de l'image d'origine, mais la fenêtre de gauche est fortifiée : entièrement couverte de planches épaisses doublées de plaques de tôle rouillée rivetées, avec un rang de fil barbelé par-dessus ; plus aucune lumière ne passe. Les rideaux restent de chaque côté. Ne change rien d'autre.

## Cuisine — joindre `images/piece-cuisine.webp` (grande fenêtre au centre, au-dessus du plan de travail)

Ici la fenêtre est DÉJÀ barricadée sur l'image : il faut aussi une version sans planches (niveau 0).

Message 1 :
> Reprends EXACTEMENT cette image, même cadrage, même taille, même style, même lumière. Modifie UNIQUEMENT la grande fenêtre au centre, au-dessus du plan de travail : retire toutes les planches, la fenêtre est intacte avec ses vitres et ses croisillons en bois, on voit la nuit dehors. Ne change rien d'autre dans la pièce (bocaux, poêle, étagères, lanterne). Aucun texte.

Messages 2, 3, 4 : les 3 niveaux, à partir de la version sans planches (message 1), en reprenant les textes du salon (« Même chose à partir de la fenêtre sans planches, mais… »).

## Chambre — joindre `images/piece-chambre-propre.webp` (fenêtre à gauche, au-dessus de la cheminée)

La fenêtre est DÉJÀ barricadée sur l'image : il faut aussi une version sans planches.

Message 1 :
> Reprends EXACTEMENT cette image, même cadrage, même taille, même style, même lumière. Modifie UNIQUEMENT la fenêtre en haut à gauche : retire toutes les planches, la fenêtre est intacte avec ses vitres et ses croisillons en bois, on voit la nuit bleutée dehors. Ne change rien d'autre (lits, cheminée, bougie, armoire). Aucun texte.

Messages 2, 3, 4 : les 3 niveaux, à partir de la version sans planches, avec les textes du salon.

## Réserve — joindre `images/piece-reserve.webp` (2 petites fenêtres en haut à droite)

Message 1 :
> Reprends EXACTEMENT cette image, même cadrage, même taille, même style, même lumière. Modifie UNIQUEMENT les deux petites fenêtres en haut à droite : ajoute sur chacune 2 planches de bois clouées en travers, de travers, on voit encore la vitre entre elles. Ne change rien d'autre (étagères, bidons, caisses, ampoule). Aucun texte.

Messages 2 et 3 : niveaux 2 et 3 sur les deux fenêtres, avec les textes du salon.

## Atelier — joindre `images/piece-atelier.webp` (petite fenêtre à gauche, au-dessus des planches)

Message 1 :
> Reprends EXACTEMENT cette image, même cadrage, même taille, même style, même lumière. Modifie UNIQUEMENT la petite fenêtre à gauche, au-dessus du tas de planches : ajoute 2 ou 3 planches de bois clouées en travers, de travers, on voit encore la vitre entre elles. Ne change rien d'autre (établi, panneau d'outils, étagères, planches au sol). Aucun texte.

Messages 2 et 3 : niveaux 2 et 3, avec les textes du salon.

---

Le garage n'a pas de fenêtre (porte de garage) : rien à faire. Le salon et la chambre existent aussi en version « feu éteint » : la fenêtre est loin du feu, la même découpe servira pour les deux.
Total : 3 + 4 + 4 + 3 + 3 = 17 images.
