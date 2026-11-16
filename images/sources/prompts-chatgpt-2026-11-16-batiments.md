# Bâtiments de l'avant-poste pour ChatGPT (2026-11-16) : 2 images seulement

Chaque image = format paysage, grille de 6 colonnes × 4 lignes (24 cases). Chaque ligne contient 2 bâtiments : colonnes 1-2-3 = bâtiment A (niveaux 1, 3, 5), colonnes 4-5-6 = bâtiment B (niveaux 1, 3, 5).
Image 1 = 8 bâtiments (4 lignes), image 2 = 6 bâtiments (3 lignes).

## À joindre aux deux images
`images/sources/avantposte/batiments-terrain-4-gemini.jpg` (modèle de style, d'angle et de lumière)

## Image 1 (à copier telle quelle)
> Crée une planche de sprites pour un jeu mobile de survie, dans EXACTEMENT le style de l'image jointe : dessin cartoon peint à la main, contours brun foncé épais, couleurs chaudes et un peu passées, lumière du haut à gauche, vue de trois quarts légèrement en plongée comme les bâtiments de l'image jointe.
> Format paysage. Fond vert uni #00FF00 partout. Grille invisible de 6 colonnes et 4 lignes, toutes les cases de la même taille : chaque case contient UN seul petit bâtiment, centré, entièrement visible, avec une marge de vert tout autour, sans toucher le bord de sa case ni un voisin. Chaque bâtiment est posé sur un petit carré de terre battue. Pas d'ombre portée sur le vert, pas de texte, pas de cadre, pas de personnage. Monde post-apocalyptique sans électricité (bois, tôle rouillée, bâches, cordes, récupération).
> Dans chaque ligne : colonnes 1, 2, 3 = premier bâtiment au niveau 1 (petit, de fortune), niveau 3 (solide), niveau 5 (grand, renforcé) ; colonnes 4, 5, 6 = second bâtiment aux mêmes 3 niveaux.
> Ligne 1 : CITERNE (tonneaux reliés par une bâche → cuve en bois cerclée de fer sur un socle → château d'eau en bois et fer sur pieds) puis SERRE (bâche transparente sur des bacs de légumes → serre en bois et plastique → grande serre vitrée pleine de plantes).
> Ligne 2 : SCIERIE (billot avec une hache plantée et des bûches → cabane avec une grande scie à manivelle → scierie couverte avec piles de planches) puis PALISSADE (quelques planches clouées en barrière → palissade de rondins pointus → rempart en rondins et tôle avec chemin de ronde).
> Ligne 3 : ENTREPÔT (caisses sous une bâche → cabane de planches → grand entrepôt en tôle avec grande porte) puis INFIRMERIE (bâche tendue avec lit de camp et caisse à croix rouge → cabane de planches avec drapeau à croix rouge → infirmerie en tôle avec drapeau et armoire à pharmacie).
> Ligne 4 : FORGE (enclume sur un billot et petit foyer de pierres → forge avec cheminée en pierre et soufflet → forge avec haute cheminée en briques et outils) puis POSTE RADIO (vieille radio sur une caisse avec antenne bricolée → cabane radio avec grande antenne → poste radio avec antenne parabolique et pylône).

## Image 2 (à copier telle quelle)
> Crée une planche de sprites pour un jeu mobile de survie, dans EXACTEMENT le style de l'image jointe : dessin cartoon peint à la main, contours brun foncé épais, couleurs chaudes et un peu passées, lumière du haut à gauche, vue de trois quarts légèrement en plongée comme les bâtiments de l'image jointe.
> Format paysage. Fond vert uni #00FF00 partout. Grille invisible de 6 colonnes et 3 lignes, toutes les cases de la même taille : chaque case contient UN seul petit bâtiment, centré, entièrement visible, avec une marge de vert tout autour, sans toucher le bord de sa case ni un voisin. Chaque bâtiment est posé sur un petit carré de terre battue. Pas d'ombre portée sur le vert, pas de texte, pas de cadre, pas de personnage. Monde post-apocalyptique sans électricité (bois, tôle rouillée, bâches, cordes, récupération).
> Dans chaque ligne : colonnes 1, 2, 3 = premier bâtiment au niveau 1 (petit, de fortune), niveau 3 (solide), niveau 5 (grand, renforcé) ; colonnes 4, 5, 6 = second bâtiment aux mêmes 3 niveaux.
> Ligne 1 : TOUR DE GUET (grand poteau avec échelle et petite plate-forme → tour en bois sur quatre pieds avec toit → haute tour blindée de tôle avec sacs de sable et grosse lanterne) puis GARAGE (bâche avec jerricans et outils → abri en tôle avec établi et pneus → grand garage en tôle avec une vieille camionnette).
> Ligne 2 : PLANQUE (trappe en planches dans le sol → trappe entourée de sacs de sable → bunker enterré avec porte blindée et filet de camouflage) puis PIÈGES (quelques pieux taillés et un piège à mâchoires → fosse à pieux → champ de pièges avec pieux, mâchoires et fil barbelé).
> Ligne 3 : CHARRETTE (brouette en métal rouillé → charrette en bois à deux roues chargée de caisses → chariot blindé à quatre roues chargé de butin) puis ATELIER DE SIÈGE (établi avec un petit bélier en bois → bélier sur roues → bélier blindé avec une petite catapulte).

## Ensuite (Claude)
Découpe des 42 bâtiments (fond vert), mêmes noms de fichiers qu'aujourd'hui (`images/avantposte/<bâtiment>-1|3|5.webp`) : le jeu les prend sans autre changement ; contrôle de la taille de chacun sur les 15 enclos.

## Image 3 : le terrain sans les enclos (pour effacer l'enclos sous un bâtiment terminé)
À joindre : `images/sources/avantposte/terrain-vide.png`
> Reprends EXACTEMENT cette image, au pixel près, même cadrage et même taille (1024 × 1024). Retire seulement les 15 enclos rectangulaires (les bordures de pierres et leurs petits piquets en bois) et remplace-les par le même sol de terre battue et d'herbe sèche que tout autour, comme s'ils n'avaient jamais existé. Ne change RIEN d'autre : le feu de camp, les rondins, le chemin, les clôtures, les arbres, les maisons, les voitures et les cailloux restent identiques et à la même place.
