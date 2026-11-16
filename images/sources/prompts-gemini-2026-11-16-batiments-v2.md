# Bâtiments de l'avant-poste, 2e méthode (2026-11-16)

Pourquoi : dans les 6 images reçues, Gemini a bien gardé le terrain au pixel près, mais il n'a pas respecté les enclos ni les niveaux demandés (bâtiments décalés d'un enclos, mélangés entre les images, très serrés les uns contre les autres ; les grands débordent sur les voisins). La découpe attrape alors le voisin ou un morceau de sol.

Nouvelle méthode : un bâtiment par image, ses 3 niveaux côte à côte, sur un fond vert uni (la méthode qui a toujours bien marché pour les zombies, Raja, les poules…). Le terrain est joint seulement comme modèle de style.

## À joindre à chaque fois
1. `images/sources/avantposte/batiments-terrain-4-gemini.jpg` (le terrain avec des bâtiments : modèle de style, d'angle et de lumière)

## Prompt (changer seulement la dernière phrase)
> Dessine un seul bâtiment de survie, en 3 niveaux d'amélioration posés côte à côte de gauche à droite (niveau 1 petit et de fortune, niveau 3 solide, niveau 5 grand et renforcé), sur un fond vert uni (#00FF00), avec beaucoup d'espace vert autour de chacun et sans qu'ils se touchent. Exactement le même style que l'image jointe : dessin cartoon peint à la main, contours brun foncé, couleurs chaudes et passées, lumière du haut à gauche, même angle de vue de trois quarts légèrement en plongée. Chaque niveau est posé sur un petit carré de terre battue, sans ombre portée sur le vert. Aucun texte, aucun personnage. Monde post-apocalyptique sans électricité.
> Le bâtiment : **[voir la liste]**

## La liste (une image par ligne)
1. une citerne d'eau de pluie : tonneaux reliés par une bâche → cuve en bois cerclée de fer sur un socle → grand château d'eau en bois et fer sur pieds
2. une serre : bâche transparente sur des bacs de légumes → serre en bois et plastique → grande serre vitrée pleine de plantes
3. une scierie : billot avec une hache plantée et des bûches → cabane avec une grande scie à manivelle → grande scierie couverte avec piles de planches
4. une palissade : quelques planches clouées en barrière → palissade de rondins pointus → rempart en rondins et tôle avec chemin de ronde
5. un entrepôt : caisses empilées sous une bâche → cabane de planches → grand entrepôt en tôle avec grande porte
6. une infirmerie : bâche tendue, lit de camp, caisse à croix rouge → cabane de planches avec drapeau à croix rouge → infirmerie en tôle et planches avec drapeau, lits et armoire à pharmacie
7. une forge : enclume sur un billot et petit foyer de pierres → forge avec cheminée en pierre et soufflet → forge avec haute cheminée en briques et outils
8. un poste radio : vieille radio sur une caisse avec antenne bricolée → cabane radio avec grande antenne → poste radio avec antenne parabolique bricolée et pylône
9. une tour de guet : grand poteau avec échelle et petite plate-forme → tour en bois sur quatre pieds avec toit → haute tour blindée de tôle avec sacs de sable et lanterne
10. un garage : bâche, jerricans et outils → abri en tôle avec établi et pneus → grand garage en tôle avec une vieille camionnette
11. une planque : trappe en planches dans le sol → trappe renforcée entourée de sacs de sable → bunker enterré avec porte blindée et filet de camouflage
12. des pièges : quelques pieux taillés et un piège à mâchoires → fosse à pieux et pièges à mâchoires → champ de pièges avec pieux, mâchoires et fil barbelé
13. une charrette : brouette en métal rouillé → charrette en bois à deux roues chargée de caisses → grand chariot blindé à quatre roues chargé de butin
14. un atelier de siège : établi avec un petit bélier en bois → bélier sur roues → bélier blindé sur roues avec une catapulte

(Pour économiser : on peut demander 2 bâtiments par image, l'un au-dessus de l'autre, en gardant bien de l'espace vert entre les rangées.)
