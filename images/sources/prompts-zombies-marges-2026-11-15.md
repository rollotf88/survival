# Zombies à redessiner avec de la marge (2026-11-15)

Sur les planches d'origine, Gemini a dessiné chaque zombie dans une case trop étroite : les bras du Costaud, le nuage du Gonflé, les mains du Rampant, la barricade du Défenseur, le bras du Soldat, le bras du Coureur et les ondes du Hurleur touchent le bord de la case et sont coupés.
En attendant, le jeu estompe les côtés coupés (originaux gardés dans `images/sources/zombies-avant-fondu/`).

Joindre à Gemini la planche de référence `images/sources/reference-zombies.jpg` (ou les planches `zombies-pied-1-gemini.jpg` / `zombies-pied-2-gemini.jpg`).

## Prompt (un zombie par image, à refaire pour chacun)

> Redraw ONLY the [ZOMBIE] from the attached reference sheet, exactly the same character, same pose, same cartoon style (thick dark outlines, flat colors with soft shading), full body from head to feet.
> Put it alone on a plain, flat, pure green background (#00FF00), with NO frame, NO border, NO panel lines and NO ground shadow.
> Leave a wide empty green margin all around: at least 15 % of the image on the left, right, top and bottom. Nothing must touch the edges of the image (arms, hands, smoke, weapon, objects).
> Portrait format, about 2:3.

Remplacer [ZOMBIE] par :
1. the big muscular zombie in blue overalls (Costaud)
2. the bloated zombie surrounded by yellow toxic smoke, with the whole smoke cloud fully visible (Gonflé)
3. the crawling zombie, both arms and clawed hands fully visible, landscape format 3:2 instead of portrait (Rampant)
4. the masked raider with the club, standing behind his small wooden barricade, the whole barricade and sandbags visible, landscape 4:3 (Défenseur)
5. the soldier zombie with the rifle, rifle fully visible (Soldat)
6. the running zombie in the red tracksuit (Coureur)
7. the screaming zombie in the grey hoodie, with the sound waves (Hurleur)

Fichiers attendus : `images/zombies/costaud.webp`, `gonfle.webp`, `rampant.webp`, `defenseur.webp`, `soldat.webp`, `coureur.webp`, `hurleur.webp` (Claude détoure le fond vert).
