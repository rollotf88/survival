# Prompts Gemini du 2026-11-16 : la pièce « Avant-poste » au format des autres pièces

Problème : le terrain actuel (Leonardo) est en paysage (1344 × 1024, élargi par des bandes sombres), alors que toutes les pièces du jeu font 1024 × 1050 (presque carré, un peu plus haut que large). Sur le jeu, ça se voit.

## À joindre à Gemini
1. `images/piece-cour.webp` (la cour de la maison) : référence de STYLE et de FORMAT
2. `images/avantposte/terrain-jour.webp` (le terrain actuel) : référence de CONTENU

## Image 1 : le terrain de jour

> Redessine le terrain de la 2e image (un avant-poste de survivants en pleine nature, après une apocalypse zombie) dans EXACTEMENT le style de la 1re image : même dessin cartoon peint à la main, mêmes contours brun foncé, mêmes couleurs chaudes et un peu passées, même lumière, même angle de vue (vue de trois quarts, légèrement en plongée, comme la cour).
> Format : presque carré, un peu plus haut que large (comme la 1re image, 1024 × 1050 pixels).
> Contenu : un grand terrain de terre battue et d'herbe entouré d'une forêt et de collines, un feu de camp au centre avec quelques rondins autour, un chemin de terre qui part vers le haut de l'image (vers la carte du monde), et une quinzaine de CLAIRIÈRES PLATES ET VIDES bien séparées les unes des autres (des petits carrés de terre nivelée avec quelques piquets), réparties sur tout le terrain, pour y poser plus tard des bâtiments.
> AUCUN bâtiment, aucun personnage, aucun texte, aucun logo. Pas d'électricité (pas de poteaux, pas de lampadaires).

## Image 2 : le même terrain la nuit (dans la même conversation, juste après)

> Garde EXACTEMENT la même image, au pixel près (même cadrage, mêmes clairières, même chemin), mais la nuit : ciel sombre bleu nuit, lune, le feu de camp allumé qui éclaire doucement autour de lui, ombres bleutées, quelques yeux de zombies qui brillent dans la forêt au loin. Rien d'autre ne change.

## Plus tard (si les deux images vont bien)
Les bâtiments dessinés pour CE terrain (même vue, même lumière), pour qu'ils ne fassent plus « images collées » : je ferai le prompt quand le terrain sera validé, car il faudra donner la position des clairières.

---

# Bâtiments dessinés POUR le terrain (2026-11-15, choix de Fabien)

Idée : Gemini dessine les bâtiments directement DANS les enclos du terrain, avec la même vue et la même lumière. Claude découpe ensuite chaque bâtiment par différence avec le terrain vide (au pixel près, comme les personnages dans les pièces). Chaque bâtiment aura donc SON enclos fixe (il suivra l'inclinaison de cet enclos) :

| Enclos | Bâtiment | | Enclos | Bâtiment |
|---|---|---|---|---|
| 1 | Citerne | | 9 | Scierie |
| 2 | Serre | | 10 | Entrepôt |
| 3 | Palissade | | 11 | Forge |
| 4 | Infirmerie | | 12 | Tour de guet |
| 5 | Poste radio | | 13 | Planque |
| 6 | Garage | | 14 | Charrette |
| 7 | Pièges | | 15 | (libre, pour un futur bâtiment) |
| 8 | Atelier de siège | | | |

(Les 6 enclos ouverts au départ, 1-2-3-4-9-10, reçoivent les bâtiments du début : eau, nourriture, bois, défense, stock, soins.)

## À joindre à Gemini (à chaque image)
1. `images/sources/avantposte/terrain-vide.png` (le terrain sans rien, 1024 × 1024)
2. `images/sources/avantposte/terrain-numerote.jpg` (le même avec les numéros des enclos, seulement pour se repérer)

## Prompt commun (à mettre au début de chaque demande)
> Reprends EXACTEMENT la 1re image, au pixel près : même cadrage, même terrain, même feu de camp, mêmes clôtures, mêmes couleurs, même taille (1024 × 1024). La 2e image ne sert qu'à repérer les numéros des enclos : ne dessine AUCUN numéro ni cercle. Dessine seulement des bâtiments à l'intérieur de certains enclos, dans le même style cartoon peint à la main que le terrain (contours brun foncé, couleurs chaudes et passées, lumière qui vient du haut à gauche), en vue de trois quarts légèrement en plongée, comme le terrain. Chaque bâtiment est posé bien à plat dans son enclos, aligné sur l'inclinaison de cet enclos, et reste à l'intérieur de sa bordure de pierres (seul un toit ou une tour peut dépasser vers le haut). Monde post-apocalyptique sans électricité : bois, tôle rouillée, bâches, cordes, matériaux de récupération. Ne change RIEN d'autre : les enclos non cités restent vides, aucun personnage, aucun texte.

## Image A : niveau 1 (petit, de fortune), enclos 1 à 7
> [Prompt commun] Enclos 1 : une petite citerne de fortune (tonneaux reliés par une bâche qui récupère la pluie). Enclos 2 : une petite serre de fortune (bâche transparente sur quelques bacs de légumes). Enclos 3 : une palissade de fortune (quelques planches clouées en barrière). Enclos 4 : une infirmerie de fortune (bâche tendue, lit de camp, caisse avec une croix rouge). Enclos 5 : un poste radio de fortune (vieille radio posée sur une caisse, antenne bricolée). Enclos 6 : un garage de fortune (bâche, jerricans, quelques outils). Enclos 7 : quelques pièges (pieux taillés, un piège à mâchoires).

## Image B : niveau 1, enclos 8 à 14
> [Prompt commun] Enclos 8 : un atelier de siège de fortune (établi avec un petit bélier en bois). Enclos 9 : une scierie de fortune (billot, hache plantée, tas de bûches). Enclos 10 : un entrepôt de fortune (caisses empilées sous une bâche). Enclos 11 : une forge de fortune (enclume sur un billot, petit foyer en pierres). Enclos 12 : une tour de guet de fortune (un grand poteau avec une échelle et une petite plate-forme). Enclos 13 : une planque de fortune (trappe en planches dans le sol). Enclos 14 : une charrette de fortune (brouette en métal rouillé).

## Image C : niveau 3 (cabanes solides), enclos 1 à 7
> [Prompt commun] Mêmes bâtiments que pour le niveau 1, mais plus solides et plus grands, en vraies cabanes de bois et de tôle : Enclos 1 : citerne en bois cerclée de fer sur un petit socle. Enclos 2 : serre en bois et plastique avec des rangées de légumes. Enclos 3 : palissade de rondins pointus. Enclos 4 : infirmerie en cabane de planches avec un drapeau à croix rouge. Enclos 5 : cabane radio avec une grande antenne en métal. Enclos 6 : abri de garage en tôle avec un établi et des pneus. Enclos 7 : fosse à pieux et pièges à mâchoires.

## Image D : niveau 3, enclos 8 à 14
> [Prompt commun] Enclos 8 : atelier de siège avec un bélier sur roues. Enclos 9 : scierie en cabane avec une grande scie circulaire à manivelle. Enclos 10 : entrepôt en cabane de planches. Enclos 11 : forge avec une cheminée en pierre et un soufflet. Enclos 12 : tour de guet en bois sur quatre pieds avec un toit. Enclos 13 : planque avec une trappe renforcée et des sacs de sable. Enclos 14 : charrette en bois à deux roues chargée de caisses.

## Image E : niveau 5 (le plus impressionnant), enclos 1 à 7
> [Prompt commun] Les mêmes bâtiments au niveau maximum, grands, renforcés de métal, impressionnants mais toujours faits main : Enclos 1 : grand château d'eau en bois et fer sur pieds. Enclos 2 : grande serre vitrée pleine de plantes. Enclos 3 : rempart en rondins et tôle avec un chemin de ronde. Enclos 4 : infirmerie en dur (tôle et planches) avec drapeau, lits et armoire à pharmacie. Enclos 5 : poste radio avec antenne parabolique bricolée et pylône. Enclos 6 : grand garage en tôle avec un pont élévateur et une vieille camionnette. Enclos 7 : champ de pièges (pieux, mâchoires, fils barbelés, mines bricolées).

## Image F : niveau 5, enclos 8 à 14
> [Prompt commun] Enclos 8 : grand atelier de siège avec un bélier blindé sur roues et une catapulte. Enclos 9 : grande scierie couverte avec scie à ruban et piles de planches. Enclos 10 : grand entrepôt en tôle avec une grande porte. Enclos 11 : forge avec haute cheminée en briques, enclume et outils. Enclos 12 : haute tour de guet blindée de tôle avec sacs de sable et projecteur à lanterne. Enclos 13 : bunker enterré avec porte blindée et filet de camouflage. Enclos 14 : grand chariot blindé à quatre roues chargé de butin.

## Ensuite (Claude)
Découpe de chaque bâtiment par différence avec le terrain vide → `images/avantposte/<bâtiment>-1|3|5.webp` remplacés, chaque bâtiment posé dans son enclos fixe (`AP_PLACE` à créer dans avantposte.js : on ne choisit plus l'enclos, chaque enclos dit quel bâtiment il accueille). Si Gemini décale un peu le terrain, Claude recale l'image avant la découpe.
