# Lieux et zombies de fin de partie (proposition du 2026-11-14)

Aujourd'hui, le dernier nouveau zombie arrive au jour 15 (Soldat) et le dernier lieu au jour 40 (Bunker). Un bon joueur tient environ 100 jours : ces ajouts remplissent la période 30-90 jours. Tous les chiffres seront réglés par simulation (le jeu doit toujours finir par gagner).

## Les lieux (découverts comme les lieux secrets : 2 jours plus tôt avec une radio)

| Lieu | Jour | Accès | Danger | Ce qu'on y trouve | Particularité |
|---|---|---|---|---|---|
| Zoo abandonné | 50 | à pied, distance moyenne | élevé | beaucoup de nourriture (réserves des soigneurs, viande séchée), trousses de la clinique du zoo, cordes, outils | lié à l'histoire de Raja : l'enclos du tigre vide, une rencontre avec le survivant qui l'a nourri. Zombie propre au zoo : le Gorille |
| Aéroport | 65 | voiture, loin | élevé | plein de jerricans (kérosène des pistes), plateaux-repas, valises (objets au hasard, objets de confort) | assez d'essence pour plusieurs trajets éloignés, mais très exposé (horde plus probable) |
| Prison | 75 | serrure, sombre | très élevé | armes, munitions, gilets, casques, boucliers anti-émeute | beaucoup de Costauds et de Soldats |
| Centrale électrique | 85 | voiture, loin, serrure | extrême | pièces rares : batteries, ferraille, adhésif, câbles, de quoi améliorer le refuge | Nids de zombies dans les sous-sols |

## Les zombies

| Zombie | Jour | Ce qu'il fait | Comment s'en sortir |
|---|---|---|---|
| Le Pilleur | 30 | au lieu de mordre, arrache un objet du butin et essaie de s'enfuir au tour suivant | le tuer (ou le pousser) avant qu'il parte : l'objet est récupéré |
| La Couveuse (le « nid ») | 45 | ne mord pas, mais fait sortir un Rampant tous les 2 tours (3 au plus) | la viser en premier, cocktail efficace |
| Le Brûlé | 55 | insensible aux cocktails ; chaque coup au corps à corps brûle celui qui frappe (−2 PV) | armes à feu, ou se protéger |
| Le Gorille | zoo seulement | très fort, frappe deux personnes à la fois | pousser ne marche presque pas ; tirer de loin |

---

# Prompts Gemini

## A. Les 4 lieux (une image par message)

Joindre une illustration de lieu existante comme référence de style, par exemple `images/lieux/hopital.webp` et `images/lieux/foret.webp`.

### Prompt commun (remplacer [LIEU])

Voici deux illustrations de lieux de mon jeu de survie post-apocalyptique. Crée une nouvelle illustration dans EXACTEMENT le même style : dessin cartoon peint, contours brun foncé épais, couleurs chaudes et un peu usées, lumière de fin de journée, même ambiance de ville abandonnée envahie par la végétation. Format paysage 16:9 (1376 × 768). Le lieu : [LIEU]. Pas de personnage vivant ; au plus un ou deux zombies lointains et flous. Aucun texte lisible, aucune marque, aucun logo réel (les panneaux restent vides ou avec des mots inventés illisibles).

### Les 4 lieux

1. **Zoo abandonné** : [LIEU] = l'entrée d'un zoo abandonné : un grand portail en fer forgé rouillé à moitié ouvert, une arche avec un panneau en bois délavé (sans texte lisible), une guérite de billetterie aux vitres cassées, derrière on devine des enclos vides aux grilles tordues, un rocher d'enclos, de grands arbres et des lianes, des herbes hautes sur les allées, une poussette renversée et des ballons dégonflés.
2. **Aéroport** : [LIEU] = un petit aéroport abandonné vu depuis le tarmac : un avion de ligne immobile avec un escalier roulant, des chariots à bagages renversés, des valises éparpillées, un camion-citerne de kérosène, la tour de contrôle aux vitres brisées au fond, des herbes qui poussent entre les dalles.
3. **Prison** : [LIEU] = l'extérieur d'une prison abandonnée : un haut mur gris avec des barbelés, un mirador, une grande porte blindée entrouverte, des projecteurs éteints, une voiture de transport de détenus renversée (sans marque ni inscription), des papiers qui volent.
4. **Centrale électrique** : [LIEU] = une petite centrale électrique abandonnée : bâtiments industriels en brique, grands transformateurs rouillés derrière un grillage, pylônes et câbles tombés, une cheminée d'usine, des panneaux de danger avec un éclair (sans texte), des flaques et des tuyaux qui fuient.

## B. Les 4 zombies (en pied, fond vert, à découper)

Joindre `images/sources/reference-zombies.jpg` (la planche des zombies existants).

### Prompt commun (remplacer [ZOMBIE])

Voici les zombies de mon jeu (planche jointe). Crée un nouveau zombie dans EXACTEMENT le même style : dessin cartoon peint, contours brun foncé épais et nets, peau gris-vert, vêtements déchirés, plutôt inquiétant que gore (pas de sang qui coule ni d'organes). Il est dessiné EN PIED, entier de la tête aux pieds, debout de trois quarts, sur un fond vert pur uni (#00FF00) sans ombre ni sol, avec une marge vide tout autour. Aucun texte. Le zombie : [ZOMBIE].

1. **Le Pilleur** : [ZOMBIE] = un zombie maigre et voûté qui porte un vieux sac à dos plein à craquer, une main crochue tendue en avant comme pour attraper quelque chose, un bonnet et une écharpe en lambeaux, l'air sournois.
2. **La Couveuse** : [ZOMBIE] = un zombie énorme et boursouflé, immobile, à moitié couvert de cocons gris et de racines, avec des petits bras de rampants qui sortent de son ventre, la bouche grande ouverte (ce n'est pas un humain qui marche, c'est une masse posée au sol).
3. **Le Brûlé** : [ZOMBIE] = un zombie noirci par le feu, la peau carbonisée et craquelée avec des braises orange qui rougeoient dans les fissures, de petites flammes sur les épaules, les restes d'un bleu de travail.
4. **Le Gorille** : [ZOMBIE] = un gorille zombie, énorme, debout sur ses pattes arrière et appuyé sur un poing, poils gris et arrachés par endroits, yeux blancs, un collier de suivi du zoo cassé autour du cou.

## C. Les portraits des 4 zombies (une seule image)

Joindre la grille de portraits existants (par exemple `images/sources/portraits-celebres-gemini.jpg`) et les 4 images en pied reçues.

Fais une grille 2 × 2 de portraits (tête et épaules) de ces 4 zombies, dans le même style et le même cadrage que les portraits joints : fond sombre uni, visage bien éclairé, contour brun foncé épais. Dans l'ordre : en haut à gauche le Pilleur, en haut à droite la Couveuse, en bas à gauche le Brûlé, en bas à droite le Gorille. Aucun texte.
