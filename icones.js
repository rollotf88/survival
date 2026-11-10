/* =====================================================================
   icones.js : les icônes dessinées à la main (SVG), style cartoon.
   Une icône = le contenu d'un dessin de 48 × 48. Contour sombre épais
   ajouté automatiquement. Si une icône manque ici, le jeu affiche
   l'emoji de data.js à la place : on peut donc les dessiner petit à petit.
   ===================================================================== */

// Couleurs communes des dessins
var COUL = {
  trait:"#1d282c", peau:"#f2c09a", brun:"#6b4226", roux:"#b5602b", blond:"#d9a441",
  zombie:"#9bc27a", zombieFonce:"#6f9a52", zombieTresFonce:"#5a7f43",
  bois:"#c8894a", boisFonce:"#8a5428", metal:"#cfd8dc", metalFonce:"#90a4ae",
  eau:"#4fa3d9", eauClair:"#8fcbf0", rouge:"#d9534f", jaune:"#f0b429", olive:"#6b8e4e", oliveFonce:"#557a3c",
  blanc:"#fffdf7", gris:"#3d4a50", tissu:"#f5d6b0"
};


// Petits morceaux de dessin réutilisés
function boiteConserve(x, y, l, h, etiquette){
  return '<path d="M' + x + ' ' + (y + 3) + ' V' + (y + h) + ' Q' + (x + l / 2) + ' ' + (y + h + 4) + ' ' + (x + l) + ' ' + (y + h) + ' V' + (y + 3) + '" fill="' + COUL.metal + '"/>' +
    '<rect x="' + x + '" y="' + (y + h * 0.3) + '" width="' + l + '" height="' + (h * 0.45) + '" fill="' + etiquette + '"/>' +
    '<ellipse cx="' + (x + l / 2) + '" cy="' + (y + 3) + '" rx="' + (l / 2) + '" ry="3" fill="' + COUL.metal + '"/>';
}
function manche(x1, y1, x2, y2, couleur, ep){ // trait épais avec contour (manches, barres)
  ep = ep || 3.5;
  return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" stroke-width="' + (ep + 3.5) + '"/>' +
    '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" stroke="' + couleur + '" stroke-width="' + ep + '"/>';
}
function balleDessin(x, y){ // une balle debout, pied en (x, y)
  return '<path d="M' + (x - 3) + ' ' + y + ' V' + (y - 9) + ' Q' + x + ' ' + (y - 16) + ' ' + (x + 3) + ' ' + (y - 9) + ' V' + y + 'Z" fill="' + COUL.blond + '"/>';
}
function cartoucheDessin(x, y){
  return '<rect x="' + (x - 3.5) + '" y="' + (y - 13) + '" width="7" height="10" fill="' + COUL.rouge + '"/><rect x="' + (x - 3.5) + '" y="' + (y - 4) + '" width="7" height="4" fill="' + COUL.jaune + '"/>';
}

function visage(peau, cheveuxDerriere, cheveuxDevant, extra){ // tête de personnage
  return (cheveuxDerriere || '') + '<circle cx="24" cy="26" r="13" fill="' + peau + '"/>' + (cheveuxDevant || '') +
    '<circle cx="19.5" cy="26" r="1.6" fill="' + COUL.trait + '"/><circle cx="28.5" cy="26" r="1.6" fill="' + COUL.trait + '"/>' + (extra || '<path d="M20 32 Q24 35 28 32"/>');
}
function fenetre(x, y, l, h, c){ return '<rect x="' + x + '" y="' + y + '" width="' + l + '" height="' + h + '" fill="' + (c || COUL.eauClair) + '" stroke-width="1.8"/>'; }

var ICONES_SVG = {
  /* ---------- La famille ---------- */
  papa:
    '<circle cx="24" cy="26" r="14" fill="' + COUL.peau + '"/>' +
    '<path d="M10 23 Q11 9 24 9 Q37 9 38 23 Q32 17 24 17 Q16 17 10 23Z" fill="' + COUL.brun + '"/>' +
    '<circle cx="19" cy="26" r="1.6" fill="' + COUL.trait + '"/><circle cx="29" cy="26" r="1.6" fill="' + COUL.trait + '"/>' +
    '<path d="M18 31 Q24 28 30 31" stroke-width="3"/>' +
    '<path d="M20 35 Q24 37 28 35"/>',
  maman:
    '<path d="M9 27 Q8 8 24 8 Q40 8 39 27 L40 41 Q34 39 32 33 L16 33 Q14 39 8 41Z" fill="' + COUL.roux + '"/>' +
    '<circle cx="24" cy="25" r="12.5" fill="' + COUL.peau + '"/>' +
    '<path d="M12 22 Q14 11 24 11 Q34 11 36 22 Q30 15 22 18 Q17 20 12 22Z" fill="' + COUL.roux + '"/>' +
    '<circle cx="19.5" cy="25" r="1.6" fill="' + COUL.trait + '"/><circle cx="28.5" cy="25" r="1.6" fill="' + COUL.trait + '"/>' +
    '<path d="M20 30 Q24 33 28 30"/>',
  leo:
    '<circle cx="24" cy="27" r="13" fill="' + COUL.peau + '"/>' +
    '<path d="M11 25 Q9 13 17 12 Q19 7 25 9 Q31 6 33 12 Q40 13 37 25 Q34 19 29 20 Q25 16 21 20 Q15 19 11 25Z" fill="' + COUL.blond + '"/>' +
    '<circle cx="19.5" cy="27" r="1.6" fill="' + COUL.trait + '"/><circle cx="28.5" cy="27" r="1.6" fill="' + COUL.trait + '"/>' +
    '<circle cx="17" cy="31" r=".8" fill="' + COUL.roux + '" stroke="none"/><circle cx="31" cy="31" r=".8" fill="' + COUL.roux + '" stroke="none"/>' +
    '<path d="M20 33 Q24 36 28 33"/>',
  emma:
    '<circle cx="9" cy="23" r="5.5" fill="' + COUL.brun + '"/><circle cx="39" cy="23" r="5.5" fill="' + COUL.brun + '"/>' +
    '<circle cx="24" cy="27" r="12.5" fill="' + COUL.peau + '"/>' +
    '<path d="M11.5 25 Q12 13 24 13 Q36 13 36.5 25 Q31 18 24 21 Q17 18 11.5 25Z" fill="' + COUL.brun + '"/>' +
    '<path d="M20 12 L24 15 L28 12 L28 18 L24 15 L20 18Z" fill="' + COUL.rouge + '"/>' +
    '<circle cx="19.5" cy="27" r="2" fill="' + COUL.trait + '"/><circle cx="28.5" cy="27" r="2" fill="' + COUL.trait + '"/>' +
    '<path d="M21 33 Q24 35 27 33"/>',

  /* ---------- Les zombies ---------- */
  rodeur:
    '<circle cx="24" cy="25" r="15" fill="' + COUL.zombie + '"/>' +
    '<path d="M11 19 L14 12 L17 16 L21 9 L24 14 L29 10 L30 15 L36 12 L37 19" fill="' + COUL.zombieTresFonce + '"/>' +
    '<circle cx="18" cy="24" r="4" fill="' + COUL.blanc + '"/><circle cx="18.5" cy="24.5" r="1.4" fill="' + COUL.trait + '"/>' +
    '<path d="M26 23 L32 25"/>' +
    '<path d="M16 33 L19 31 L22 34 L25 31 L28 34 L31 32"/>' +
    '<path d="M33 30 L37 33 M34 33 L36 30" stroke-width="1.8"/>',
  coureur:
    '<path d="M3 20 H9 M2 26 H8 M3 32 H9" stroke-width="2.2"/>' +
    '<ellipse cx="27" cy="26" rx="13" ry="15" fill="' + COUL.zombie + '"/>' +
    '<path d="M15 20 Q18 9 28 10 Q38 11 40 21 Q34 16 27 17 Q20 17 15 20Z" fill="' + COUL.zombieTresFonce + '"/>' +
    '<path d="M19 22 L25 24 M30 24 L36 22"/>' +
    '<circle cx="22" cy="27" r="1.6" fill="' + COUL.rouge + '"/><circle cx="33" cy="27" r="1.6" fill="' + COUL.rouge + '"/>' +
    '<path d="M22 35 Q27 31 33 35 Z" fill="' + COUL.trait + '"/>',
  costaud:
    '<rect x="7" y="9" width="34" height="32" rx="9" fill="' + COUL.zombieFonce + '"/>' +
    '<path d="M12 20 L22 22 M26 22 L36 20" stroke-width="3.5"/>' +
    '<circle cx="18" cy="26" r="1.8" fill="' + COUL.rouge + '"/><circle cx="30" cy="26" r="1.8" fill="' + COUL.rouge + '"/>' +
    '<rect x="15" y="31" width="18" height="6" rx="1.5" fill="' + COUL.blanc + '"/>' +
    '<path d="M19.5 31 V37 M24 31 V37 M28.5 31 V37" stroke-width="1.8"/>' +
    '<path d="M10 13 L14 16 M12 12 L12 16" stroke-width="1.8"/>',

  /* ---------- Objets ---------- */
  bidon:
    '<path d="M18 12 V7 H30 V12" stroke-width="3"/>' +
    '<rect x="11" y="12" width="26" height="31" rx="4" fill="' + COUL.eau + '"/>' +
    '<rect x="31" y="5" width="6" height="5" rx="1" fill="' + COUL.jaune + '"/>' +
    '<path d="M15 29 Q19.5 26 24 29 T33 29" stroke="' + COUL.blanc + '" stroke-width="2.2"/>',
  bouteille:
    '<rect x="19.5" y="3" width="9" height="5" rx="1.5" fill="' + COUL.eau + '"/>' +
    '<path d="M20 8 H28 V12 Q34 15 34 22 V40 Q34 44 30 44 H18 Q14 44 14 40 V22 Q14 15 20 12Z" fill="' + COUL.eauClair + '"/>' +
    '<rect x="14" y="24" width="20" height="9" fill="' + COUL.blanc + '"/>' +
    '<path d="M18 28.5 H30" stroke="' + COUL.eau + '" stroke-width="2"/>',
  conserve:
    '<path d="M11 13 V39 Q24 45 37 39 V13" fill="' + COUL.metal + '"/>' +
    '<path d="M11 19 Q24 24 37 19 V33 Q24 38 11 33Z" fill="' + COUL.rouge + '"/>' +
    '<ellipse cx="24" cy="13" rx="13" ry="4.5" fill="' + COUL.metal + '"/>' +
    '<circle cx="24" cy="27" r="3" fill="' + COUL.jaune + '"/>',
  bandage:
    '<g transform="rotate(-35 24 24)"><rect x="4" y="17" width="40" height="14" rx="7" fill="' + COUL.tissu + '"/>' +
    '<rect x="17" y="17" width="14" height="14" fill="' + COUL.blanc + '"/>' +
    '<circle cx="9" cy="22" r=".9" fill="' + COUL.trait + '" stroke="none"/><circle cx="9" cy="26" r=".9" fill="' + COUL.trait + '" stroke="none"/>' +
    '<circle cx="39" cy="22" r=".9" fill="' + COUL.trait + '" stroke="none"/><circle cx="39" cy="26" r=".9" fill="' + COUL.trait + '" stroke="none"/></g>',
  trousse:
    '<path d="M18 14 V9 H30 V14" stroke-width="3"/>' +
    '<rect x="7" y="14" width="34" height="26" rx="4" fill="' + COUL.rouge + '"/>' +
    '<path d="M21 19 H27 V24 H32 V30 H27 V35 H21 V30 H16 V24 H21Z" fill="' + COUL.blanc + '"/>',
  couteau:
    '<path d="M13 35 L36 9 Q41 9 39 15 L17 39Z" fill="' + COUL.metal + '"/>' +
    '<path d="M5 43 L12 34 L18 40 L9 47Z" fill="' + COUL.boisFonce + '"/>' +
    '<path d="M20 31 L34 15" stroke="' + COUL.blanc + '" stroke-width="1.6"/>',
  hache:
    '<path d="M13 44 L33 9" stroke-width="7"/><path d="M13 44 L33 9" stroke="' + COUL.bois + '" stroke-width="3.5"/>' +
    '<path d="M27 8 Q36 1 44 9 Q41 18 36 20 L32 16 L29 14Z" fill="' + COUL.metal + '"/>' +
    '<path d="M38 8 Q41 11 40 15" stroke="' + COUL.blanc + '" stroke-width="1.6"/>',
  batte:
    '<path d="M7 43 Q4 40 7 37 L32 10 Q38 4 43 9 Q47 14 40 19 L12 42 Q9 45 7 43Z" fill="' + COUL.bois + '"/>' +
    '<path d="M9 35 L14 40 M12 32 L17 37" stroke="' + COUL.boisFonce + '" stroke-width="2.4"/>',
  lampe:
    '<path d="M6 32 L19 19 L29 29 L16 42Z" fill="' + COUL.gris + '"/>' +
    '<path d="M19 19 L27 11 L37 21 L29 29Z" fill="' + COUL.jaune + '"/>' +
    '<path d="M33 9 L36 4 M38 14 L44 12 M39 19 L45 20" stroke="' + COUL.jaune + '" stroke-width="2.6"/>' +
    '<circle cx="16" cy="31" r="2" fill="' + COUL.rouge + '"/>',
  pile:
    '<rect x="20" y="5" width="8" height="5" rx="1" fill="' + COUL.metalFonce + '"/>' +
    '<rect x="14" y="10" width="20" height="33" rx="3" fill="' + COUL.gris + '"/>' +
    '<path d="M14 13 Q14 10 17 10 H31 Q34 10 34 13 V22 H14Z" fill="' + COUL.jaune + '"/>' +
    '<path d="M24 28 V36 M20 32 H28" stroke="' + COUL.blanc + '" stroke-width="2.4"/>',
  planche:
    '<g transform="rotate(-8 24 18)"><rect x="5" y="13" width="38" height="10" rx="2" fill="' + COUL.bois + '"/></g>' +
    '<g transform="rotate(6 24 31)"><rect x="5" y="26" width="38" height="10" rx="2" fill="' + COUL.bois + '"/></g>' +
    '<path d="M12 18 Q17 16 22 18 M26 31 Q31 33 37 31" stroke="' + COUL.boisFonce + '" stroke-width="1.6"/>' +
    '<circle cx="9" cy="18.5" r="1" fill="' + COUL.trait + '"/><circle cx="39" cy="32" r="1" fill="' + COUL.trait + '"/>',
  sacados:
    '<path d="M19 10 Q24 4 29 10" stroke-width="3"/>' +
    '<path d="M11 19 Q11 10 24 10 Q37 10 37 19 V40 Q37 44 33 44 H15 Q11 44 11 40Z" fill="' + COUL.olive + '"/>' +
    '<rect x="15" y="27" width="18" height="12" rx="3" fill="' + COUL.oliveFonce + '"/>' +
    '<path d="M15 31 H33"/><rect x="22" y="29" width="4" height="4" rx="1" fill="' + COUL.jaune + '"/>',
  outils:
    '<path d="M17 18 V12 H31 V18" stroke-width="3"/>' +
    '<rect x="5" y="18" width="38" height="23" rx="3" fill="' + COUL.rouge + '"/>' +
    '<path d="M5 25 H43"/>' +
    '<rect x="21" y="22.5" width="6" height="6" rx="1" fill="' + COUL.metal + '"/>',

  /* ---------- Nourriture ---------- */
  conserves:
    boiteConserve(5, 24, 18, 18, COUL.rouge) + boiteConserve(25, 24, 18, 18, COUL.jaune) + boiteConserve(15, 5, 18, 17, COUL.olive),
  riz:
    '<path d="M12 17 Q9 40 14 44 H34 Q39 40 36 17 Q30 13 24 15 Q18 13 12 17Z" fill="#e8d9b5"/>' +
    '<path d="M15 18 Q24 22 33 18" stroke-width="2"/>' +
    '<path d="M18 9 L20 14 M24 7 V13 M30 9 L28 14" stroke-width="2"/>' +
    '<rect x="16" y="26" width="16" height="10" rx="2" fill="' + COUL.rouge + '"/>' +
    '<ellipse cx="21" cy="31" rx="1.6" ry="1" fill="' + COUL.blanc + '" stroke="none"/><ellipse cx="27" cy="31" rx="1.6" ry="1" fill="' + COUL.blanc + '" stroke="none"/>',
  biscuits:
    '<circle cx="18" cy="28" r="12" fill="' + COUL.blond + '"/><circle cx="30" cy="20" r="11" fill="' + COUL.blond + '"/>' +
    '<circle cx="14" cy="26" r="1.6" fill="' + COUL.brun + '"/><circle cx="20" cy="32" r="1.6" fill="' + COUL.brun + '"/><circle cx="22" cy="24" r="1.4" fill="' + COUL.brun + '"/>' +
    '<circle cx="28" cy="17" r="1.6" fill="' + COUL.brun + '"/><circle cx="34" cy="22" r="1.6" fill="' + COUL.brun + '"/><circle cx="31" cy="25" r="1.3" fill="' + COUL.brun + '"/>',
  pates:
    '<rect x="11" y="6" width="26" height="38" rx="3" fill="#4f7fd9"/>' +
    '<rect x="15" y="16" width="18" height="16" rx="2" fill="' + COUL.jaune + '"/>' +
    '<path d="M17 20 Q24 26 31 20 M17 24 Q24 30 31 24 M17 28 Q24 34 31 28" stroke="' + COUL.blond + '" stroke-width="1.6"/>' +
    '<path d="M11 11 H37" />',
  barre:
    '<g transform="rotate(-25 24 24)"><rect x="5" y="17" width="38" height="14" rx="4" fill="' + COUL.boisFonce + '"/>' +
    '<rect x="16" y="17" width="16" height="14" fill="' + COUL.jaune + '"/>' +
    '<path d="M5 20 L2 19 M5 28 L2 29 M43 20 L46 19 M43 28 L46 29" stroke-width="2"/></g>',
  ration:
    '<rect x="8" y="11" width="32" height="29" rx="3" fill="' + COUL.olive + '"/>' +
    '<path d="M8 17 H40" stroke-dasharray="2 3" stroke-width="1.8"/>' +
    '<rect x="14" y="22" width="20" height="11" rx="1.5" fill="#e8d9b5"/>' +
    '<path d="M24 24.5 L25.3 27 L28 27.2 L26 29 L26.6 31.6 L24 30.2 L21.4 31.6 L22 29 L20 27.2 L22.7 27Z" fill="' + COUL.rouge + '" stroke-width="1.2"/>',

  /* ---------- Soins et énergie ---------- */
  antibio:
    '<rect x="15" y="5" width="18" height="7" rx="2" fill="' + COUL.blanc + '"/>' +
    '<rect x="13" y="12" width="22" height="31" rx="4" fill="#e38c2d"/>' +
    '<rect x="13" y="20" width="22" height="13" fill="' + COUL.blanc + '"/>' +
    '<path d="M24 23 V30 M20.5 26.5 H27.5" stroke="' + COUL.rouge + '" stroke-width="2.4"/>',
  canette:
    '<path d="M15 9 Q15 6 18 6 H30 Q33 6 33 9 V40 Q33 43 30 43 H18 Q15 43 15 40Z" fill="' + COUL.gris + '"/>' +
    '<path d="M15 10 H33 M15 39 H33" stroke="' + COUL.metal + '" stroke-width="2"/>' +
    '<path d="M26 14 L19 26 H24 L21 36 L29 23 H24Z" fill="' + COUL.jaune + '" stroke-width="1.8"/>',

  /* ---------- Armes ---------- */
  barrefer:
    manche(9, 43, 37, 10, COUL.metalFonce, 4) +
    '<path d="M37 10 Q41 5 44 9" stroke-width="7"/><path d="M37 10 Q41 5 44 9" stroke="' + COUL.metalFonce + '" stroke-width="4"/>',
  machette:
    '<path d="M14 34 L35 8 Q44 5 41 15 L20 39Z" fill="' + COUL.metal + '"/>' +
    '<path d="M6 44 L13 34 L20 39 L12 47Z" fill="' + COUL.gris + '"/>' +
    '<path d="M21 31 L36 13" stroke="' + COUL.blanc + '" stroke-width="1.6"/>',
  pistolet:
    '<path d="M6 14 H42 V23 H27 L25 27 H21 L19 40 H10 L12 26 H6Z" fill="' + COUL.gris + '"/>' +
    '<path d="M21 27 Q20 33 25 32" stroke-width="2.2"/>' +
    '<path d="M10 18 H38" stroke="' + COUL.metal + '" stroke-width="1.8"/>' +
    '<rect x="12" y="30" width="5" height="7" rx="1" fill="' + COUL.boisFonce + '" stroke-width="1.6"/>',
  fusil:
    '<g transform="rotate(-32 24 24)">' +
    '<rect x="20" y="18" width="27" height="4.5" rx="1" fill="' + COUL.metalFonce + '"/>' +
    '<rect x="22" y="22.5" width="14" height="3" rx="1" fill="' + COUL.bois + '" stroke-width="1.8"/>' +
    '<path d="M1 21 L20 17 H24 V26 H19 L12 31 H2 Z" fill="' + COUL.bois + '"/>' +
    '<path d="M18 26 Q18.5 31 23 29.5" stroke-width="2.2"/></g>',
  lance:
    manche(8, 44, 35, 13, COUL.bois, 3.5) +
    '<path d="M32 10 L44 3 L39 16Z" fill="' + COUL.metal + '"/>' +
    '<path d="M30 14 L35 19 M28 16 L33 21" stroke="' + COUL.rouge + '" stroke-width="2.4"/>',
  gourdin:
    '<path d="M9 42 Q7 40 9 38 L30 13 Q35 7 40 10 Q45 15 38 20 L13 43 Q11 45 9 42Z" fill="' + COUL.bois + '"/>' +
    '<path d="M33 10 L31 5 M39 12 L44 9 M40 18 L45 20 M28 16 L24 13" stroke="' + COUL.metalFonce + '" stroke-width="2.4"/>',

  /* ---------- Munitions ---------- */
  balle:
    '<path d="M18 42 V20 Q24 2 30 20 V42Z" fill="' + COUL.blond + '"/>' +
    '<path d="M18 20 Q24 2 30 20Z" fill="' + COUL.roux + '"/>' +
    '<path d="M18 36 H30"/>',
  cartouche:
    '<rect x="15" y="8" width="18" height="26" rx="2" fill="' + COUL.rouge + '"/>' +
    '<rect x="13" y="34" width="22" height="8" rx="1.5" fill="' + COUL.jaune + '"/>' +
    '<path d="M19 13 V29" stroke="' + COUL.blanc + '" stroke-width="1.8"/>',
  boiteBalles:
    balleDessin(15, 22) + balleDessin(22, 22) + balleDessin(29, 22) +
    '<rect x="7" y="20" width="34" height="22" rx="3" fill="' + COUL.olive + '"/>' +
    '<rect x="15" y="26" width="18" height="10" rx="1.5" fill="#e8d9b5"/>',
  boiteCart:
    cartoucheDessin(16, 22) + cartoucheDessin(24, 22) + cartoucheDessin(32, 22) +
    '<rect x="7" y="20" width="34" height="22" rx="3" fill="' + COUL.rouge + '"/>' +
    '<rect x="15" y="26" width="18" height="10" rx="1.5" fill="' + COUL.blanc + '"/>',

  /* ---------- Outils ---------- */
  briquet:
    '<path d="M24 3 Q31 9 27 14 Q25 12 23 14 Q17 9 24 3Z" fill="' + COUL.jaune + '"/>' +
    '<rect x="15" y="14" width="18" height="8" rx="1.5" fill="' + COUL.metal + '"/>' +
    '<rect x="15" y="22" width="18" height="22" rx="3" fill="' + COUL.rouge + '"/>' +
    '<circle cx="21" cy="18" r="1.3" fill="' + COUL.trait + '"/>',
  pdb:
    manche(13, 42, 35, 10, COUL.rouge, 4) +
    '<path d="M35 10 Q38 4 43 7" stroke-width="7.5"/><path d="M35 10 Q38 4 43 7" stroke="' + COUL.rouge + '" stroke-width="4"/>' +
    '<path d="M13 42 Q8 45 7 40" stroke-width="7.5"/><path d="M13 42 Q8 45 7 40" stroke="' + COUL.rouge + '" stroke-width="4"/>',
  torche:
    manche(17, 44, 28, 18, COUL.bois, 4) +
    '<path d="M24 20 L32 23 L30 15 L26 13Z" fill="#e8d9b5"/>' +
    '<path d="M29 2 Q38 9 34 16 Q31 13 28 16 Q21 9 29 2Z" fill="' + COUL.jaune + '"/>' +
    '<path d="M29 8 Q32 11 30 13 Q28 11 29 8Z" fill="' + COUL.rouge + '" stroke-width="1.2"/>',

  /* ---------- Sacs ---------- */
  sacoche:
    '<path d="M10 22 Q24 0 38 22" stroke-width="3"/>' +
    '<rect x="7" y="20" width="34" height="22" rx="4" fill="#a0673a"/>' +
    '<path d="M7 24 Q7 20 11 20 H37 Q41 20 41 24 V31 H7Z" fill="' + COUL.boisFonce + '"/>' +
    '<rect x="21" y="28" width="6" height="6" rx="1" fill="' + COUL.jaune + '"/>',
  randonnee:
    '<rect x="12" y="3" width="24" height="9" rx="4.5" fill="' + COUL.rouge + '"/>' +
    '<path d="M11 18 Q11 12 24 12 Q37 12 37 18 V41 Q37 45 33 45 H15 Q11 45 11 41Z" fill="#e07b39"/>' +
    '<rect x="15" y="25" width="18" height="14" rx="3" fill="#b85e24"/>' +
    '<path d="M15 30 H33"/><path d="M11 22 H37" stroke-width="2"/>',

  /* ---------- Voiture ---------- */
  batterie:
    '<rect x="12" y="10" width="7" height="6" rx="1" fill="' + COUL.rouge + '"/><rect x="29" y="10" width="7" height="6" rx="1" fill="' + COUL.metalFonce + '"/>' +
    '<rect x="6" y="16" width="36" height="26" rx="3" fill="' + COUL.gris + '"/>' +
    '<path d="M15.5 25 V33 M11.5 29 H19.5 M28.5 29 H36.5" stroke="' + COUL.blanc + '" stroke-width="2.4"/>',
  roue:
    '<circle cx="24" cy="24" r="19" fill="' + COUL.gris + '"/>' +
    '<circle cx="24" cy="24" r="10" fill="' + COUL.metal + '"/>' +
    '<circle cx="24" cy="24" r="3" fill="' + COUL.metalFonce + '"/>' +
    '<circle cx="24" cy="18" r="1.2" fill="' + COUL.trait + '"/><circle cx="29.5" cy="26" r="1.2" fill="' + COUL.trait + '"/><circle cx="18.5" cy="26" r="1.2" fill="' + COUL.trait + '"/>' +
    '<path d="M24 5 V8 M24 40 V43 M5 24 H8 M40 24 H43 M10.5 10.5 L12.6 12.6 M35.4 35.4 L37.5 37.5 M37.5 10.5 L35.4 12.6 M12.6 35.4 L10.5 37.5" stroke="' + COUL.metalFonce + '" stroke-width="2"/>',
  courroie:
    '<ellipse cx="24" cy="24" rx="19" ry="12" stroke-width="8"/>' +
    '<ellipse cx="24" cy="24" rx="19" ry="12" stroke="' + COUL.gris + '" stroke-width="4.5"/>' +
    '<circle cx="12" cy="24" r="5" fill="' + COUL.metal + '"/><circle cx="36" cy="24" r="5" fill="' + COUL.metal + '"/>',
  jerrican:
    '<path d="M9 15 L16 8 H39 V43 Q39 45 37 45 H11 Q9 45 9 43Z" fill="' + COUL.rouge + '"/>' +
    '<rect x="25" y="11" width="10" height="5" rx="2" fill="' + COUL.trait + '"/>' +
    '<rect x="9" y="4" width="6" height="8" rx="1.5" fill="' + COUL.jaune + '" transform="rotate(-45 12 8)"/>' +
    '<path d="M14 21 L34 40 M34 21 L14 40" stroke="#a93c38" stroke-width="2.4"/>',

  /* ---------- Confort ---------- */
  couverture:
    '<rect x="6" y="11" width="36" height="13" rx="4" fill="#4f7fd9"/>' +
    '<rect x="6" y="24" width="36" height="13" rx="4" fill="#3c6bbf"/>' +
    '<path d="M6 17 H42 M6 30 H42" stroke="' + COUL.jaune + '" stroke-width="2"/>' +
    '<path d="M10 37 V41 M15 37 V41 M20 37 V41 M25 37 V41 M30 37 V41 M35 37 V41" stroke-width="1.8"/>',
  radio:
    '<path d="M30 16 L40 4" stroke-width="2.2"/><circle cx="40" cy="4" r="1.6" fill="' + COUL.trait + '"/>' +
    '<rect x="5" y="16" width="38" height="25" rx="4" fill="' + COUL.bois + '"/>' +
    '<circle cx="17" cy="28.5" r="7" fill="' + COUL.gris + '"/>' +
    '<path d="M13 26 H21 M12 29 H22 M13 32 H21" stroke="' + COUL.metalFonce + '" stroke-width="1.4"/>' +
    '<rect x="28" y="22" width="11" height="6" rx="1" fill="' + COUL.jaune + '"/>' +
    '<circle cx="31" cy="34" r="2" fill="' + COUL.trait + '"/><circle cx="37" cy="34" r="2" fill="' + COUL.trait + '"/>',
  peluche:
    '<circle cx="13" cy="12" r="5.5" fill="#c08a5a"/><circle cx="35" cy="12" r="5.5" fill="#c08a5a"/>' +
    '<ellipse cx="24" cy="40" rx="12" ry="7" fill="#c08a5a"/>' +
    '<circle cx="24" cy="22" r="12" fill="#c08a5a"/>' +
    '<ellipse cx="24" cy="26" rx="5.5" ry="4" fill="' + COUL.tissu + '"/>' +
    '<circle cx="19" cy="19" r="1.6" fill="' + COUL.trait + '"/><circle cx="29" cy="19" r="1.6" fill="' + COUL.trait + '"/>' +
    '<path d="M23 24.5 H25" stroke-width="2.4"/>' +
    '<path d="M31 31 L35 35 M33 31 L33 35" stroke="' + COUL.rouge + '" stroke-width="1.6"/>',
  photo:
    '<rect x="6" y="8" width="36" height="32" rx="2" fill="' + COUL.bois + '"/>' +
    '<rect x="11" y="13" width="26" height="22" fill="' + COUL.eauClair + '"/>' +
    '<path d="M11 35 L19 25 L24 30 L29 23 L37 35Z" fill="' + COUL.olive + '" stroke-width="1.8"/>' +
    '<circle cx="31" cy="18" r="2.6" fill="' + COUL.jaune + '" stroke-width="1.6"/>',
  cartes:
    '<rect x="7" y="10" width="20" height="28" rx="3" fill="' + COUL.blanc + '" transform="rotate(-14 17 24)"/>' +
    '<rect x="20" y="9" width="20" height="28" rx="3" fill="' + COUL.blanc + '" transform="rotate(10 30 23)"/>' +
    '<path d="M30 19 Q30 15 33 16 Q35 17 33 21 L30 25 L27 21 Q25 17 27 16 Q30 15 30 19Z" fill="' + COUL.rouge + '" stroke-width="1.6"/>' +
    '<path d="M14 18 L16 14 L18 18 M15 16.5 H17" stroke-width="1.6"/>',

  /* ---------- Matériaux ---------- */
  epingle:
    '<path d="M18 6 V36 Q18 43 24 43 Q30 43 30 36 V30 Q27 27 30 24 Q33 21 30 18 V6" stroke-width="6"/>' +
    '<path d="M18 6 V36 Q18 43 24 43 Q30 43 30 36 V30 Q27 27 30 24 Q33 21 30 18 V6" stroke="' + COUL.metalFonce + '" stroke-width="3"/>' +
    '<circle cx="18" cy="6" r="2.4" fill="' + COUL.rouge + '"/><circle cx="30" cy="6" r="2.4" fill="' + COUL.rouge + '"/>',
  chiffon:
    '<path d="M8 14 Q16 8 24 13 Q32 8 40 14 Q36 22 41 30 Q34 38 26 34 Q18 41 9 35 Q12 26 8 14Z" fill="#e8d9b5"/>' +
    '<path d="M15 18 Q20 24 17 30 M27 18 Q30 25 28 31" stroke-width="1.8"/>' +
    '<rect x="29" y="22" width="7" height="6" fill="' + COUL.rouge + '" stroke-width="1.6"/>',
  clous:
    '<g transform="rotate(-25 14 24)"><rect x="9" y="8" width="10" height="3" rx="1" fill="' + COUL.metalFonce + '"/><path d="M14 11 V36 L12.5 39" stroke-width="5"/><path d="M14 11 V36" stroke="' + COUL.metal + '" stroke-width="2.4"/></g>' +
    '<g><rect x="19" y="6" width="10" height="3" rx="1" fill="' + COUL.metalFonce + '"/><path d="M24 9 V40" stroke-width="5"/><path d="M24 9 V40" stroke="' + COUL.metal + '" stroke-width="2.4"/></g>' +
    '<g transform="rotate(25 34 24)"><rect x="29" y="8" width="10" height="3" rx="1" fill="' + COUL.metalFonce + '"/><path d="M34 11 V36" stroke-width="5"/><path d="M34 11 V36" stroke="' + COUL.metal + '" stroke-width="2.4"/></g>',
  ferraille:
    '<path d="M6 30 L14 14 L30 10 L34 20 L26 26 L30 38 L12 40Z" fill="' + COUL.metalFonce + '"/>' +
    '<path d="M14 14 L18 30 L12 40" stroke-width="1.8"/>' +
    '<path d="M33 30 L39 26 L45 30 L45 37 L39 41 L33 37Z" fill="' + COUL.metal + '"/>' +
    '<circle cx="39" cy="33.5" r="2.5" fill="' + COUL.gris + '"/>' +
    '<circle cx="22" cy="18" r="1.6" fill="' + COUL.trait + '"/>',
  ruban:
    '<path d="M24 40 L40 44 L42 38 L30 36" fill="' + COUL.metal + '"/>' +
    '<circle cx="22" cy="24" r="17" fill="' + COUL.metalFonce + '"/>' +
    '<circle cx="22" cy="24" r="8" fill="#c8a27a"/>' +
    '<circle cx="22" cy="24" r="12.5" stroke="' + COUL.metal + '" stroke-width="1.6"/>',
  alcool:
    '<rect x="20" y="3" width="8" height="5" rx="1" fill="' + COUL.boisFonce + '"/>' +
    '<path d="M20 8 H28 V15 Q34 18 34 25 V41 Q34 44 31 44 H17 Q14 44 14 41 V25 Q14 18 20 15Z" fill="#c47a2c"/>' +
    '<rect x="14" y="26" width="20" height="10" fill="' + COUL.blanc + '"/>' +
    '<path d="M18 28 L21 34 M21 28 L18 34 M23 28 L26 34 M26 28 L23 34 M28 28 L31 34 M31 28 L28 34" stroke="' + COUL.rouge + '" stroke-width="1.4"/>',

  /* ---------- Installations et défense ---------- */
  bache:
    '<path d="M14 6 Q17 10 14 12 Q11 10 14 6Z M24 3 Q27 7 24 9 Q21 7 24 3Z M34 6 Q37 10 34 12 Q31 10 34 6Z" fill="' + COUL.eauClair + '" stroke-width="1.6"/>' +
    '<path d="M4 40 L24 16 L44 40Z" fill="#4f7fd9"/>' +
    '<path d="M24 16 V40" stroke-width="2"/>' +
    '<path d="M18 40 Q24 34 30 40Z" fill="' + COUL.eau + '"/>',
  collet:
    manche(10, 44, 10, 10, COUL.bois, 3.5) +
    '<path d="M10 12 Q26 8 30 20" stroke-width="2.2"/>' +
    '<circle cx="32" cy="30" r="10" stroke-width="5"/><circle cx="32" cy="30" r="10" stroke="' + COUL.metalFonce + '" stroke-width="2.2"/>',
  piege:
    '<path d="M4 41 H44" stroke-width="6"/><path d="M4 41 H44" stroke="' + COUL.gris + '" stroke-width="3"/>' +
    '<path d="M6 8 L11 18 L16 9 L21 18 L24 9 L27 18 L32 9 L37 18 L42 8 V22 H6Z" fill="' + COUL.metal + '"/>' +
    '<path d="M6 40 L11 30 L16 39 L21 30 L24 39 L27 30 L32 39 L37 30 L42 40 V26 H6Z" fill="' + COUL.metal + '"/>' +
    '<rect x="20" y="21" width="8" height="6" rx="1.5" fill="' + COUL.jaune + '"/>',

  canne:
    manche(8, 44, 34, 6, COUL.boisFonce, 3) +
    '<circle cx="13" cy="36" r="4" fill="' + COUL.metalFonce + '"/>' +
    '<path d="M34 6 Q42 14 40 30" stroke-width="1.4"/>' +
    '<path d="M40 30 V36 Q40 40 36 39" stroke-width="2"/>' +
    '<circle cx="40" cy="28" r="2.5" fill="' + COUL.rouge + '" stroke-width="1.4"/>',
  poisson:
    '<path d="M6 24 Q18 10 32 18 L42 10 V38 L32 30 Q18 38 6 24Z" fill="#7fb3c9"/>' +
    '<path d="M10 25 Q20 30 30 27" stroke="' + COUL.eauClair + '" stroke-width="2"/>' +
    '<path d="M22 17 Q24 24 22 31" stroke-width="1.6"/>' +
    '<circle cx="13" cy="21" r="1.8" fill="' + COUL.trait + '"/>',
  poule:
    '<path d="M10 22 Q8 40 24 42 Q40 42 40 28 L46 20 Q38 22 34 24 Q30 12 22 14 Q16 8 12 14 Q10 18 10 22Z" fill="' + COUL.blanc + '"/>' +
    '<path d="M13 9 Q15 5 17 9 Q19 5 21 10 Q18 12 13 11Z" fill="' + COUL.rouge + '" stroke-width="1.6"/>' +
    '<path d="M10 18 L4 20 L10 22Z" fill="' + COUL.jaune + '" stroke-width="1.6"/>' +
    '<path d="M11 24 Q12 29 14 24" fill="' + COUL.rouge + '" stroke-width="1.4"/>' +
    '<circle cx="15" cy="17" r="1.6" fill="' + COUL.trait + '"/>' +
    '<path d="M20 30 Q28 36 34 28" stroke-width="2"/>' +
    '<path d="M20 42 V46 M28 42 V46" stroke="' + COUL.jaune + '" stroke-width="2.4"/>',

  /* ---------- Lieux ---------- */
  lieuEcole:
    '<path d="M4 22 L24 8 L44 22Z" fill="' + COUL.rouge + '"/>' +
    '<rect x="8" y="21" width="32" height="22" fill="#e8d9b5"/>' +
    '<rect x="20" y="30" width="8" height="13" fill="' + COUL.bois + '"/>' +
    fenetre(11, 25, 6, 6) + fenetre(31, 25, 6, 6) +
    '<circle cx="24" cy="18" r="3.5" fill="' + COUL.blanc + '" stroke-width="1.6"/><path d="M24 16 V18 H25.5" stroke-width="1.2"/>' +
    '<path d="M24 8 V2 L31 4 L24 6" fill="' + COUL.jaune + '" stroke-width="1.6"/>',
  lieuCaserne:
    '<rect x="5" y="14" width="38" height="29" fill="' + COUL.rouge + '"/>' +
    '<rect x="9" y="24" width="13" height="19" fill="' + COUL.metal + '"/><rect x="26" y="24" width="13" height="19" fill="' + COUL.metal + '"/>' +
    '<path d="M9 29 H22 M9 34 H22 M9 39 H22 M26 29 H39 M26 34 H39 M26 39 H39" stroke-width="1.4"/>' +
    '<rect x="15" y="16" width="18" height="5" fill="' + COUL.blanc + '" stroke-width="1.6"/>' +
    '<path d="M24 4 Q29 9 26 13 Q24 11 23 13 Q19 9 24 4Z" fill="' + COUL.jaune + '" stroke-width="1.6"/>',
  lieuPeniche:
    '<path d="M2 36 Q12 32 24 36 Q36 40 46 36 V46 H2Z" fill="' + COUL.eau + '"/>' +
    '<path d="M4 30 H44 L40 38 H8Z" fill="' + COUL.olive + '"/>' +
    '<rect x="22" y="20" width="16" height="10" fill="#e8d9b5"/>' + fenetre(25, 23, 4, 4) + fenetre(31, 23, 4, 4) +
    '<rect x="13" y="24" width="4" height="6" fill="' + COUL.gris + '"/>' +
    '<path d="M15 21 Q12 14 16 10 Q19 6 16 2" stroke="' + COUL.metalFonce + '" stroke-width="2.4"/>',
  lieuCamping:
    '<path d="M2 43 H46"/>' +
    '<path d="M6 42 L20 16 L34 42Z" fill="' + COUL.olive + '"/><path d="M20 16 L16 42 H24Z" fill="' + COUL.oliveFonce + '"/>' +
    '<path d="M36 42 L41 22 L46 42Z" fill="#3f6b36"/><path d="M41 42 V46" stroke="' + COUL.boisFonce + '" stroke-width="2.4"/>' +
    '<path d="M28 8 Q31 5 34 8 Q37 5 40 8" stroke-width="1.6"/>',
  lieuClinique:
    '<rect x="6" y="16" width="36" height="27" fill="' + COUL.blanc + '"/>' +
    '<rect x="20" y="31" width="8" height="12" fill="' + COUL.eauClair + '" stroke-width="1.8"/>' +
    '<ellipse cx="24" cy="23" rx="4" ry="3.5" fill="' + COUL.brun + '" stroke-width="1.4"/>' +
    '<circle cx="18.5" cy="18" r="2" fill="' + COUL.brun + '" stroke-width="1.2"/><circle cx="22" cy="15.5" r="2" fill="' + COUL.brun + '" stroke-width="1.2"/><circle cx="26" cy="15.5" r="2" fill="' + COUL.brun + '" stroke-width="1.2"/><circle cx="29.5" cy="18" r="2" fill="' + COUL.brun + '" stroke-width="1.2"/>' +
    '<path d="M4 16 H44"/>',
  lieuBunker:
    '<path d="M2 40 Q24 30 46 40 V46 H2Z" fill="' + COUL.olive + '"/>' +
    '<path d="M10 40 Q10 20 24 20 Q38 20 38 40Z" fill="' + COUL.metalFonce + '"/>' +
    '<circle cx="24" cy="32" r="7" fill="' + COUL.metal + '"/><circle cx="24" cy="32" r="2.5" fill="' + COUL.gris + '"/>' +
    '<path d="M24 25 V39 M17 32 H31" stroke-width="1.4"/>' +
    '<path d="M14 24 L18 27 M34 24 L30 27" stroke="' + COUL.jaune + '" stroke-width="2.4"/>',
  lieuEtang:
    '<path d="M3 34 Q6 22 24 22 Q44 22 45 34 Q42 44 24 44 Q5 44 3 34Z" fill="' + COUL.eau + '"/>' +
    '<path d="M12 34 Q18 31 24 34 M28 38 Q33 35 38 38" stroke="' + COUL.eauClair + '" stroke-width="2"/>' +
    '<path d="M8 24 V8 M8 12 Q4 10 5 6 M8 16 Q12 13 12 9" stroke="' + COUL.olive + '" stroke-width="2.4"/>' +
    '<path d="M40 24 V10 M40 14 Q44 12 44 8" stroke="' + COUL.olive + '" stroke-width="2.4"/>' +
    '<ellipse cx="8" cy="9" rx="2" ry="4" fill="' + COUL.brun + '" stroke-width="1.4"/>' +
    '<path d="M20 32 Q26 26 32 32 L35 29 V35 L32 33 Q26 37 20 32Z" fill="#7fb3c9" stroke-width="1.6"/>',
  lieuMaison:
    '<path d="M5 25 L24 7 L43 25Z" fill="' + COUL.rouge + '"/>' +
    '<rect x="10" y="23" width="28" height="20" fill="#e8d9b5"/>' +
    '<rect x="20" y="31" width="8" height="12" fill="' + COUL.bois + '"/>' +
    fenetre(13, 27, 6, 6) + fenetre(29, 27, 6, 6) +
    '<path d="M28 26 L36 34 M36 26 L28 34" stroke="' + COUL.boisFonce + '" stroke-width="2.2"/>',
  lieuRue:
    '<path d="M2 26 L13 16 L24 26Z" fill="' + COUL.rouge + '"/><rect x="5" y="25" width="16" height="18" fill="' + COUL.tissu + '"/>' +
    '<rect x="11" y="33" width="5" height="10" fill="' + COUL.bois + '" stroke-width="1.8"/>' +
    '<path d="M23 20 L35 9 L47 20Z" fill="' + COUL.olive + '"/><rect x="26" y="19" width="18" height="24" fill="#e8d9b5"/>' +
    fenetre(29, 23, 5, 5) + fenetre(36, 23, 5, 5) + '<rect x="32" y="33" width="6" height="10" fill="' + COUL.bois + '" stroke-width="1.8"/>' +
    '<path d="M1 43 H47"/>',
  lieuSuper:
    '<rect x="4" y="19" width="40" height="24" fill="' + COUL.blanc + '"/>' +
    '<path d="M3 13 H45 L42 21 H6Z" fill="' + COUL.rouge + '"/>' +
    '<path d="M12 13 L11 21 M20 13 L20 21 M28 13 L28 21 M36 13 L37 21" stroke="' + COUL.blanc + '" stroke-width="3"/>' +
    '<path d="M3 13 H45 L42 21 H6Z"/>' +
    fenetre(8, 26, 19, 11) + '<rect x="31" y="26" width="9" height="17" fill="' + COUL.eauClair + '"/>' +
    '<path d="M11 31 H14 L15.5 35 H21 L22.5 32" stroke-width="1.6"/>',
  lieuHopital:
    '<rect x="8" y="14" width="32" height="29" fill="' + COUL.blanc + '"/>' +
    '<rect x="17" y="3" width="14" height="14" rx="2" fill="' + COUL.rouge + '"/>' +
    '<path d="M24 6 V14 M20 10 H28" stroke="' + COUL.blanc + '" stroke-width="3"/>' +
    fenetre(12, 21, 6, 6) + fenetre(30, 21, 6, 6) + fenetre(12, 31, 6, 6) + fenetre(30, 31, 6, 6) +
    '<rect x="20" y="31" width="8" height="12" fill="' + COUL.eauClair + '"/>',
  lieuQuinc:
    '<rect x="6" y="18" width="36" height="25" fill="#e8d9b5"/>' +
    '<rect x="4" y="13" width="40" height="7" fill="' + COUL.boisFonce + '"/>' +
    '<circle cx="24" cy="10" r="7" fill="' + COUL.jaune + '"/>' +
    '<path d="M20 14 L27 7 M25.5 5.5 Q30 5 29 9.5" stroke-width="2.2"/>' +
    fenetre(10, 24, 10, 9) + '<rect x="27" y="25" width="10" height="18" fill="' + COUL.bois + '"/>',
  lieuStation:
    '<rect x="10" y="9" width="20" height="33" rx="3" fill="' + COUL.rouge + '"/>' +
    '<rect x="14" y="13" width="12" height="8" fill="' + COUL.blanc + '"/>' +
    '<rect x="8" y="41" width="24" height="4" fill="' + COUL.gris + '"/>' +
    '<path d="M30 17 Q40 17 40 27 V34" stroke-width="2.5"/>' +
    '<rect x="37" y="33" width="6" height="8" rx="1.5" fill="' + COUL.gris + '"/>' +
    '<path d="M16 29 Q20 25 24 29 Q20 33 16 29Z" fill="' + COUL.jaune + '" stroke-width="1.6"/>',
  lieuGarage:
    '<path d="M4 20 L24 9 L44 20 V43 H4Z" fill="#b0bec5"/>' +
    '<rect x="10" y="24" width="28" height="19" fill="' + COUL.metal + '"/>' +
    '<path d="M10 29 H38 M10 34 H38 M10 39 H38" stroke-width="1.6"/>' +
    '<path d="M19 16 L28 16" stroke="' + COUL.jaune + '" stroke-width="4"/>',
  lieuPolice:
    '<rect x="7" y="17" width="34" height="26" fill="#4f7fd9"/>' +
    '<path d="M4 18 L24 6 L44 18Z" fill="#3c6bbf"/>' +
    '<path d="M24 21 L26.3 26 L31.5 26.5 L27.6 30 L28.8 35.2 L24 32.5 L19.2 35.2 L20.4 30 L16.5 26.5 L21.7 26Z" fill="' + COUL.jaune + '" stroke-width="1.6"/>' +
    '<rect x="20" y="37" width="8" height="6" fill="' + COUL.eauClair + '" stroke-width="1.8"/>',
  lieuIndus:
    '<circle cx="39" cy="7" r="3.5" fill="' + COUL.metal + '" stroke-width="1.6"/><circle cx="43" cy="3.5" r="2.5" fill="' + COUL.metal + '" stroke-width="1.6"/>' +
    '<rect x="35" y="11" width="8" height="32" fill="#a94c3a"/>' +
    '<path d="M4 43 V25 L14 18 V25 L24 18 V25 L35 18 V43Z" fill="#b0bec5"/>' +
    fenetre(8, 32, 5, 5, COUL.jaune) + fenetre(17, 32, 5, 5, COUL.jaune) + fenetre(26, 32, 5, 5, COUL.jaune),
  lieuCentre:
    '<rect x="3" y="15" width="42" height="28" fill="#e8d9b5"/>' +
    '<rect x="3" y="20" width="42" height="10" fill="' + COUL.eauClair + '"/>' +
    '<path d="M10 20 V30 M17 20 V30 M24 20 V30 M31 20 V30 M38 20 V30" stroke-width="1.6"/>' +
    '<path d="M18 43 V36 Q24 31 30 36 V43" fill="' + COUL.eauClair + '"/>' +
    '<path d="M8 15 V5 M40 15 V5" stroke-width="2"/><path d="M8 5 L15 8 L8 11Z M40 5 L33 8 L40 11Z" fill="' + COUL.rouge + '" stroke-width="1.6"/>',
  lieuVillage:
    '<path d="M2 32 L9 25 L16 32Z" fill="' + COUL.rouge + '"/><rect x="4" y="31" width="10" height="12" fill="' + COUL.tissu + '"/>' +
    '<path d="M32 32 L39 25 L46 32Z" fill="' + COUL.olive + '"/><rect x="34" y="31" width="10" height="12" fill="' + COUL.tissu + '"/>' +
    '<rect x="17" y="16" width="14" height="27" fill="' + COUL.blanc + '"/>' +
    '<path d="M16 17 L24 5 L32 17Z" fill="' + COUL.rouge + '"/>' +
    '<path d="M24 1 V5 M22 2.5 H26" stroke-width="1.8"/>' +
    '<path d="M21 43 V35 Q24 32 27 35 V43" fill="' + COUL.bois + '"/><circle cx="24" cy="24" r="2.5" fill="' + COUL.jaune + '" stroke-width="1.6"/>',
  lieuEntrepot:
    '<path d="M3 43 V22 Q24 7 45 22 V43Z" fill="#b0bec5"/>' +
    '<rect x="14" y="26" width="20" height="17" fill="' + COUL.metal + '"/>' +
    '<path d="M14 31 H34 M14 36 H34" stroke-width="1.6"/>' +
    '<rect x="5" y="35" width="7" height="8" fill="' + COUL.bois + '" stroke-width="1.8"/><rect x="36" y="35" width="7" height="8" fill="' + COUL.bois + '" stroke-width="1.8"/>',
  lieuBase:
    '<path d="M22 22 V5" stroke-width="2"/><path d="M22 5 L31 8 L22 11Z" fill="' + COUL.rouge + '" stroke-width="1.6"/>' +
    '<path d="M3 41 Q3 20 24 20 Q45 20 45 41Z" fill="' + COUL.olive + '"/>' +
    '<rect x="15" y="27" width="18" height="4" rx="1" fill="' + COUL.trait + '"/>' +
    '<path d="M24 32.5 L25.3 35.5 L28.5 35.7 L26 37.8 L26.8 41 L24 39.3 L21.2 41 L22 37.8 L19.5 35.7 L22.7 35.5Z" fill="' + COUL.blanc + '" stroke-width="1.2"/>' +
    '<path d="M2 45 L6 42 L10 45 L14 42 L18 45 L22 42 L26 45 L30 42 L34 45 L38 42 L42 45 L46 42" stroke="' + COUL.metalFonce + '" stroke-width="1.8"/>',

  /* ---------- Maisons de départ ---------- */
  maisonPavillon:
    '<circle cx="39" cy="21" r="6" fill="' + COUL.olive + '"/><path d="M39 27 V36" stroke-width="2.5"/>' +
    '<path d="M3 24 L18 10 L33 24Z" fill="' + COUL.rouge + '"/>' +
    '<rect x="7" y="22" width="22" height="16" fill="#e8d9b5"/>' +
    '<rect x="15" y="28" width="6" height="10" fill="' + COUL.bois + '" stroke-width="1.8"/>' + fenetre(9, 25, 5, 5) + fenetre(23, 25, 5, 5) +
    '<path d="M2 44 H46 M5 38 V45 M11 38 V45 M17 38 V45 M23 38 V45 M29 38 V45 M35 38 V45 M41 38 V45 M2 41 H46" stroke-width="1.8"/>',
  maisonFerme:
    '<path d="M5 43 V20 L24 7 L43 20 V43Z" fill="' + COUL.rouge + '"/>' +
    '<rect x="15" y="25" width="18" height="18" fill="#a93c38"/>' +
    '<path d="M15 25 L33 43 M33 25 L15 43" stroke="' + COUL.blanc + '" stroke-width="2.4"/>' +
    '<rect x="15" y="25" width="18" height="18"/>' +
    '<circle cx="24" cy="16" r="3.5" fill="' + COUL.jaune + '" stroke-width="1.8"/>',
  maisonAppart:
    '<rect x="11" y="3" width="26" height="40" fill="#b0bec5"/>' +
    fenetre(15, 7, 6, 5, COUL.jaune) + fenetre(27, 7, 6, 5) + fenetre(15, 15, 6, 5) + fenetre(27, 15, 6, 5, COUL.jaune) +
    fenetre(15, 23, 6, 5, COUL.jaune) + fenetre(27, 23, 6, 5) +
    '<rect x="20" y="33" width="8" height="10" fill="' + COUL.bois + '" stroke-width="1.8"/>' +
    '<path d="M6 43 H42"/>',

  /* ---------- Améliorations du refuge ---------- */
  ref_barr:
    '<rect x="4" y="10" width="40" height="8" rx="1.5" fill="' + COUL.bois + '"/>' +
    '<g transform="rotate(32 24 30)"><rect x="3" y="26" width="42" height="8" rx="1.5" fill="' + COUL.bois + '"/></g>' +
    '<g transform="rotate(-32 24 30)"><rect x="3" y="26" width="42" height="8" rx="1.5" fill="' + COUL.boisFonce + '"/></g>' +
    '<circle cx="9" cy="14" r="1.2" fill="' + COUL.trait + '"/><circle cx="39" cy="14" r="1.2" fill="' + COUL.trait + '"/><circle cx="24" cy="30" r="1.6" fill="' + COUL.trait + '"/>',
  ref_eau:
    '<path d="M18 4 Q21 8 18 10 Q15 8 18 4Z M30 2 Q33 6 30 8 Q27 6 30 2Z" fill="' + COUL.eauClair + '" stroke-width="1.6"/>' +
    '<path d="M12 14 H36 L34 43 H14Z" fill="' + COUL.bois + '"/>' +
    '<ellipse cx="24" cy="14" rx="12" ry="3.5" fill="' + COUL.eau + '"/>' +
    '<path d="M12.7 23 H35.3 M13.4 34 H34.6" stroke="' + COUL.metalFonce + '" stroke-width="2.4"/>',
  ref_pot:
    '<path d="M3 43 Q24 30 45 43Z" fill="' + COUL.boisFonce + '"/>' +
    '<path d="M18 22 L30 22 L24 44Z" fill="#e07b39"/>' +
    '<path d="M21 28 H25 M22 34 H25" stroke-width="1.6"/>' +
    '<path d="M24 22 Q19 12 15 13 Q19 17 22 22 M24 22 V9 M24 22 Q29 12 33 13 Q29 17 26 22" fill="' + COUL.olive + '" stroke-width="2"/>',

  /* ---------- Pastilles et boutons ---------- */
  bouclier:
    '<path d="M24 4 L40 10 V22 Q40 36 24 44 Q8 36 8 22 V10Z" fill="' + COUL.metal + '"/>' +
    '<path d="M24 4 V44 M8 21 H40" stroke="' + COUL.metalFonce + '" stroke-width="2.4"/>' +
    '<path d="M24 4 L40 10 V22 Q40 36 24 44 Q8 36 8 22 V10Z"/>',
  loupe:
    manche(29, 29, 42, 42, COUL.boisFonce, 5) +
    '<circle cx="20" cy="20" r="13" fill="' + COUL.eauClair + '"/>' +
    '<path d="M13 16 Q15 12 19 11" stroke="' + COUL.blanc + '" stroke-width="2.2"/>',
  caisse:
    '<rect x="6" y="10" width="36" height="30" rx="2" fill="' + COUL.bois + '"/>' +
    '<path d="M6 20 H42 M6 30 H42" stroke="' + COUL.boisFonce + '" stroke-width="2"/>' +
    '<path d="M6 10 L42 40" stroke="' + COUL.boisFonce + '" stroke-width="3"/>' +
    '<rect x="6" y="10" width="36" height="30" rx="2"/>',
  marteau:
    manche(13, 43, 30, 22, COUL.bois, 4.5) +
    '<g transform="rotate(39 31 19)"><rect x="19" y="14" width="24" height="10" rx="2" fill="' + COUL.metalFonce + '"/></g>',
  lune:
    '<path d="M28 5 A19 19 0 1 0 43 33 A15 15 0 1 1 28 5Z" fill="' + COUL.jaune + '"/>' +
    '<path d="M38 8 L39 11 L42 12 L39 13 L38 16 L37 13 L34 12 L37 11Z" fill="' + COUL.jaune + '" stroke-width="1.4"/>',
  moralBon:
    '<circle cx="24" cy="24" r="18" fill="' + COUL.jaune + '"/>' +
    '<circle cx="18" cy="20" r="2" fill="' + COUL.trait + '"/><circle cx="30" cy="20" r="2" fill="' + COUL.trait + '"/>' +
    '<path d="M15 28 Q24 37 33 28"/>',
  moralMoyen:
    '<circle cx="24" cy="24" r="18" fill="' + COUL.jaune + '"/>' +
    '<circle cx="18" cy="20" r="2" fill="' + COUL.trait + '"/><circle cx="30" cy="20" r="2" fill="' + COUL.trait + '"/>' +
    '<path d="M17 31 H31"/>',
  moralBas:
    '<circle cx="24" cy="24" r="18" fill="' + COUL.jaune + '"/>' +
    '<path d="M15 17 L21 19 M33 17 L27 19" stroke-width="2"/>' +
    '<circle cx="18" cy="22" r="2" fill="' + COUL.trait + '"/><circle cx="30" cy="22" r="2" fill="' + COUL.trait + '"/>' +
    '<path d="M16 34 Q24 27 32 34"/>' +
    '<path d="M31 25 Q33 29 31 30 Q29 29 31 25Z" fill="' + COUL.eauClair + '" stroke-width="1.4"/>',

  /* ---------- Marco et les recrues ---------- */
  marco:
    visage(COUL.peau, '', '<path d="M9 22 Q10 10 24 10 Q38 10 39 22Z" fill="' + COUL.olive + '"/><path d="M8 22 H44" stroke-width="3"/>',
      '<path d="M12 29 Q13 41 24 41 Q35 41 36 29 Q30 33 24 33 Q18 33 12 29Z" fill="' + COUL.brun + '"/><path d="M21 34 Q24 36 27 34"/>'),
  sam:
    visage("#c68a5f", '', '<path d="M11 23 Q11 11 24 11 Q37 11 37 23 Q33 16 24 17 Q15 16 11 23Z" fill="' + COUL.trait + '"/>'),
  nora:
    visage("#8d5a3b", '<circle cx="11" cy="19" r="6" fill="' + COUL.trait + '"/><circle cx="37" cy="19" r="6" fill="' + COUL.trait + '"/><circle cx="16" cy="11" r="6" fill="' + COUL.trait + '"/><circle cx="32" cy="11" r="6" fill="' + COUL.trait + '"/><circle cx="24" cy="9" r="6" fill="' + COUL.trait + '"/>',
      '', '<path d="M20 32 Q24 35 28 32" stroke="' + COUL.blanc + '"/>'),
  ines:
    visage(COUL.peau, '<path d="M9 27 Q8 9 24 9 Q40 9 39 27 L40 42 H32 L31 33 H17 L16 42 H8Z" fill="' + COUL.blond + '"/>',
      '<path d="M12 23 Q13 12 24 12 Q35 12 36 23 Q28 16 18 20Z" fill="' + COUL.blond + '"/>'),
  yanis:
    visage(COUL.peau, '', '<path d="M11 22 Q12 11 24 11 Q36 11 37 22 Q31 17 24 17 Q17 17 11 22Z" fill="' + COUL.brun + '"/>',
      '<path d="M12 28 Q13 40 24 40 Q35 40 36 28 Q30 31 24 31 Q18 31 12 28Z" fill="' + COUL.brun + '"/><path d="M21 33 Q24 35 27 33" stroke="' + COUL.blanc + '"/>')
};

// Dessin complet (contour ajouté ici pour toutes les icônes)
/* ---------- Cuisine (2026-11-09) : ingrédients et plats ---------- */
function bol(contenu, couleur){ // un bol vu de côté, rempli
  return '<path d="M6 24 H42 Q41 40 24 42 Q7 40 6 24Z" fill="#d97a4a"/>' + '<ellipse cx="24" cy="24" rx="18" ry="5" fill="' + couleur + '"/>' + (contenu || "") + '<path d="M12 33 Q24 37 36 33" stroke="#f3b38a" stroke-width="1.6" fill="none"/>';
}
function vapeur(){ return '<path d="M18 16 Q15 12 18 8 M24 15 Q21 11 24 6 M30 16 Q27 12 30 8" stroke="#b9c4c9" stroke-width="1.8" fill="none"/>'; }
ICONES_SVG.epices = '<rect x="15" y="14" width="18" height="28" rx="4" fill="' + COUL.blanc + '"/><rect x="14" y="7" width="20" height="8" rx="2" fill="' + COUL.rouge + '"/>' +
  '<circle cx="19" cy="10" r="1" fill="' + COUL.trait + '"/><circle cx="24" cy="10" r="1" fill="' + COUL.trait + '"/><circle cx="29" cy="10" r="1" fill="' + COUL.trait + '"/>' +
  '<rect x="15" y="28" width="18" height="14" rx="3" fill="#c96a3a"/><path d="M18 33 h3 M25 36 h4 M19 39 h2" stroke="#7a3a1a" stroke-width="1.4"/>';
ICONES_SVG.huile = '<path d="M20 4 H28 V12 Q36 16 36 26 V42 Q36 45 33 45 H15 Q12 45 12 42 V26 Q12 16 20 12Z" fill="#c9b23a"/>' +
  '<rect x="19" y="2" width="10" height="5" rx="1.5" fill="' + COUL.oliveFonce + '"/><rect x="15" y="26" width="18" height="11" rx="2" fill="' + COUL.blanc + '"/><ellipse cx="24" cy="31.5" rx="4" ry="3" fill="' + COUL.olive + '"/>';
ICONES_SVG.farine = '<path d="M12 14 Q10 30 11 42 Q24 46 37 42 Q38 30 36 14 Q24 18 12 14Z" fill="' + COUL.tissu + '"/>' +
  '<path d="M12 14 Q15 8 18 11 Q21 6 24 10 Q27 6 30 11 Q33 8 36 14" fill="' + COUL.tissu + '"/><path d="M14 15 Q24 19 34 15" stroke="' + COUL.brun + '" stroke-width="2" fill="none"/>' +
  '<path d="M24 38 V24 M24 28 L20 25 M24 28 L28 25 M24 33 L20 30 M24 33 L28 30" stroke="' + COUL.blond + '" stroke-width="1.8" fill="none"/>';
ICONES_SVG.champignons = '<path d="M27 28 Q27 40 25 43 H34 Q32 40 32 28Z" fill="' + COUL.blanc + '"/><path d="M18 29 Q18 6 30 6 Q42 6 42 29Z" fill="#a8582e"/>' +
  '<circle cx="26" cy="16" r="2" fill="' + COUL.tissu + '"/><circle cx="34" cy="13" r="1.6" fill="' + COUL.tissu + '"/><circle cx="36" cy="21" r="1.8" fill="' + COUL.tissu + '"/>' +
  '<path d="M11 34 Q11 42 10 44 H17 Q16 42 16 34Z" fill="' + COUL.blanc + '"/><path d="M5 35 Q5 22 13.5 22 Q22 22 22 35Z" fill="#c9773f"/>';
ICONES_SVG.baies = '<path d="M24 6 Q30 4 36 8 Q30 12 24 10Z" fill="' + COUL.olive + '"/><path d="M24 9 V16" stroke-width="2"/>' +
  '<circle cx="18" cy="24" r="6" fill="#5b3a8c"/><circle cx="30" cy="24" r="6" fill="#6b4aa0"/><circle cx="24" cy="33" r="6" fill="#5b3a8c"/><circle cx="14" cy="36" r="5" fill="' + COUL.rouge + '"/><circle cx="34" cy="36" r="5" fill="' + COUL.rouge + '"/>' +
  '<circle cx="16" cy="22" r="1.4" fill="#b9a3e0" stroke="none"/><circle cx="28" cy="22" r="1.4" fill="#b9a3e0" stroke="none"/><circle cx="22" cy="31" r="1.4" fill="#b9a3e0" stroke="none"/>';
ICONES_SVG.herbes = '<path d="M24 44 V20 M24 30 Q14 26 10 14 M24 30 Q34 26 38 14 M24 22 Q18 14 20 4 M24 22 Q30 14 28 4" stroke="' + COUL.oliveFonce + '" stroke-width="2.4" fill="none"/>' +
  '<ellipse cx="11" cy="15" rx="4" ry="6" transform="rotate(-35 11 15)" fill="' + COUL.olive + '"/><ellipse cx="37" cy="15" rx="4" ry="6" transform="rotate(35 37 15)" fill="' + COUL.olive + '"/>' +
  '<ellipse cx="20" cy="6" rx="3.5" ry="5.5" transform="rotate(-15 20 6)" fill="#7fa85c"/><ellipse cx="28" cy="6" rx="3.5" ry="5.5" transform="rotate(15 28 6)" fill="#7fa85c"/>' +
  '<rect x="19" y="32" width="10" height="5" rx="1.5" fill="' + COUL.rouge + '"/>';
ICONES_SVG.soupe = vapeur() + bol('<path d="M12 24 Q16 21 20 24 T28 24 T36 24" stroke="' + COUL.blond + '" stroke-width="1.8" fill="none"/>', COUL.jaune);
ICONES_SVG.poissonHerbes = '<ellipse cx="24" cy="32" rx="21" ry="10" fill="' + COUL.blanc + '"/><ellipse cx="24" cy="31" rx="15" ry="6" fill="#e9eef0" stroke="none"/>' +
  '<path d="M10 30 Q20 21 31 28 L38 23 V35 L31 31 Q20 38 10 30Z" fill="#e0a05a"/><circle cx="15" cy="29" r="1.3" fill="' + COUL.trait + '"/>' +
  '<path d="M20 27 L22 33 M25 27 L27 33" stroke="#9a5a2a" stroke-width="1.4"/><ellipse cx="34" cy="38" rx="3" ry="1.8" fill="' + COUL.olive + '"/><ellipse cx="14" cy="38" rx="3" ry="1.8" fill="' + COUL.olive + '"/>';
ICONES_SVG.ragout = vapeur() + '<path d="M6 22 H42 V36 Q42 42 36 42 H12 Q6 42 6 36Z" fill="' + COUL.gris + '"/><rect x="2" y="24" width="5" height="4" rx="1.5" fill="' + COUL.gris + '"/><rect x="41" y="24" width="5" height="4" rx="1.5" fill="' + COUL.gris + '"/>' +
  '<ellipse cx="24" cy="22" rx="18" ry="5" fill="#8a4a24"/><circle cx="17" cy="21" r="2.6" fill="#c9773f"/><circle cx="29" cy="22" r="2.4" fill="#c9773f"/><circle cx="23" cy="20" r="1.8" fill="' + COUL.olive + '"/>';
ICONES_SVG.galettes = '<ellipse cx="24" cy="38" rx="18" ry="5" fill="#d9a441"/><ellipse cx="24" cy="31" rx="18" ry="5" fill="#e3b45a"/><ellipse cx="24" cy="24" rx="18" ry="5" fill="#ecc06a"/>' +
  '<circle cx="18" cy="23" r="1.2" fill="#a8702a" stroke="none"/><circle cx="27" cy="25" r="1.2" fill="#a8702a" stroke="none"/><circle cx="31" cy="22" r="1" fill="#a8702a" stroke="none"/>';
ICONES_SVG.rizSaute = bol('<circle cx="18" cy="23" r="1.6" fill="' + COUL.rouge + '" stroke="none"/><circle cx="27" cy="25" r="1.6" fill="' + COUL.olive + '" stroke="none"/><circle cx="31" cy="22" r="1.4" fill="' + COUL.jaune + '" stroke="none"/><circle cx="22" cy="21" r="1.2" fill="' + COUL.olive + '" stroke="none"/>', "#f6f0dc") +
  '<path d="M8 22 Q24 10 40 22" fill="#f6f0dc"/>';
ICONES_SVG.tarte = '<path d="M4 28 L8 38 Q24 44 40 38 L44 28Z" fill="#c98a3a"/><ellipse cx="24" cy="27" rx="20" ry="8" fill="#e3a85a"/><ellipse cx="24" cy="26" rx="15" ry="5.5" fill="#5b3a8c"/>' +
  '<circle cx="18" cy="25" r="2" fill="#7b5ab0" stroke="none"/><circle cx="26" cy="27" r="2" fill="' + COUL.rouge + '" stroke="none"/><circle cx="30" cy="24" r="1.8" fill="#7b5ab0" stroke="none"/><circle cx="22" cy="23" r="1.6" fill="' + COUL.rouge + '" stroke="none"/>' +
  '<path d="M12 22 L36 30 M12 30 L36 22" stroke="#e3a85a" stroke-width="2.4"/>';

/* ---------- Équipement de guerre (2026-11-10) ---------- */
ICONES_SVG.gilet = '<path d="M14 6 L20 6 Q24 12 28 6 L34 6 L42 14 L38 22 L36 20 V42 H12 V20 L10 22 L6 14Z" fill="#5b6b4a"/>' +
  '<path d="M16 22 H32 V38 H16Z" fill="#46553a"/><path d="M18 26 H30 M18 31 H30" stroke="#2f3a26" stroke-width="2"/><path d="M20 6 Q24 12 28 6" fill="none" stroke-width="2"/>';
ICONES_SVG.casque = '<path d="M7 30 Q7 10 24 10 Q41 10 41 30Z" fill="#c9a227"/><path d="M4 30 H44 Q44 35 39 35 H9 Q4 35 4 30Z" fill="#a8851c"/>' +
  '<path d="M24 11 V29" stroke="#8a6c14" stroke-width="2"/><rect x="18" y="16" width="12" height="7" rx="2" fill="' + COUL.blanc + '"/><path d="M24 17 V22 M21.5 19.5 H26.5" stroke="' + COUL.rouge + '" stroke-width="2"/>';
ICONES_SVG.bouclier = '<rect x="10" y="4" width="28" height="40" rx="6" fill="#9fb4c2"/><rect x="14" y="9" width="20" height="10" rx="2" fill="#d9e6ee"/>' +
  '<path d="M14 26 H34 M14 31 H34 M14 36 H34" stroke="#6f8796" stroke-width="2"/><path d="M24 22 V40" stroke="#6f8796" stroke-width="2"/>';

/* ---------- Bastion et camion du clan (2026-11-10) ---------- */
ICONES_SVG.bastion = '<path d="M10 44 V14 H16 V9 H21 V14 H27 V9 H32 V14 H38 V44Z" fill="#a1887f"/><path d="M20 44 V35 Q24 29 28 35 V44Z" fill="' + COUL.boisFonce + '"/>' +
  '<path d="M10 22 H38 M10 30 H19 M29 30 H38" stroke-width="2"/><path d="M24 9 V2 L32 5 L24 8" fill="' + COUL.rouge + '"/>';
ICONES_SVG.reserveClan = '<rect x="6" y="14" width="36" height="28" rx="2" fill="' + COUL.bois + '"/><path d="M6 21 H42 M6 35 H42" stroke-width="2"/><path d="M8 23 L40 33 M40 23 L8 33" stroke-width="2"/><rect x="4" y="10" width="40" height="6" rx="2" fill="' + COUL.boisFonce + '"/>';
ICONES_SVG.journalClan = '<path d="M12 8 H36 V40 H12Z" fill="#f3e3c0"/><path d="M8 8 Q8 4 12 4 H36 Q40 4 40 8 Q40 12 36 12 H12" fill="#e2c995"/><path d="M8 40 Q8 44 12 44 H36 Q40 44 40 40 Q40 36 36 36 H12" fill="#e2c995"/><path d="M17 18 H31 M17 24 H31 M17 30 H26" stroke-width="2"/>';
ICONES_SVG.remparts = '<rect x="5" y="31" width="38" height="11" fill="#a3a3a3"/><path d="M5 36.5 H43 M15 31 V36.5 M27 31 V36.5 M39 31 V36.5 M10 36.5 V42 M21 36.5 V42 M33 36.5 V42" stroke-width="2"/>' +
  '<path d="M7 31 V13 L10 7 L13 13 V31Z" fill="' + COUL.bois + '"/><path d="M14 31 V13 L17 7 L20 13 V31Z" fill="' + COUL.bois + '"/><path d="M21 31 V13 L24 7 L27 13 V31Z" fill="' + COUL.bois + '"/><path d="M28 31 V13 L31 7 L34 13 V31Z" fill="' + COUL.bois + '"/><path d="M35 31 V13 L38 7 L41 13 V31Z" fill="' + COUL.bois + '"/>';
ICONES_SVG.mine = '<path d="M7 34 V30 Q24 21 41 30 V34 Q24 42 7 34Z" fill="#6f7f57"/><path d="M7 30 Q24 38 41 30" stroke-width="2"/><rect x="20" y="19" width="8" height="6" rx="2" fill="' + COUL.metalFonce + '"/>' +
  '<path d="M24 19 V13"/><circle cx="24" cy="11" r="2.6" fill="' + COUL.rouge + '"/><path d="M30 8 L33 6 M31 12 L35 12 M17 8 L14 6" stroke="' + COUL.jaune + '" stroke-width="2"/>';
ICONES_SVG.tour = '<path d="M14 44 L19 21 M34 44 L29 21 M16 36 H32 M15.5 36 L30.5 28 M32.5 36 L17.5 28 M17.5 28 H30.5" stroke-width="2.2"/><rect x="12" y="14" width="24" height="8" fill="' + COUL.bois + '"/>' +
  '<path d="M10 14 L24 4 L38 14Z" fill="' + COUL.rouge + '"/><path d="M18 14 V22 M30 14 V22" stroke-width="1.8"/>';
ICONES_SVG.camionClan = '<path d="M4 35 V22 H26 V35Z" fill="#7d8a5a"/><path d="M26 35 V15 H36 L44 25 V35Z" fill="#8c9a66"/><path d="M29 18 H35 L40 25 H29Z" fill="#bfe3ee"/><path d="M4 26 H26" stroke-width="2"/>' +
  '<circle cx="13" cy="37" r="5" fill="#3b3b3b"/><circle cx="36" cy="37" r="5" fill="#3b3b3b"/><circle cx="13" cy="37" r="1.8" fill="' + COUL.metal + '"/><circle cx="36" cy="37" r="1.8" fill="' + COUL.metal + '"/>';
ICONES_SVG.parebuffle = '<rect x="7" y="15" width="34" height="21" rx="3" fill="' + COUL.metalFonce + '"/><path d="M13 15 V36 M19 15 V36 M24 15 V36 M29 15 V36 M35 15 V36" stroke-width="2"/>' +
  '<rect x="3" y="10" width="42" height="7" rx="2.5" fill="' + COUL.metal + '"/><rect x="3" y="34" width="42" height="6" rx="2.5" fill="' + COUL.metal + '"/>';
ICONES_SVG.blindage = '<path d="M8 7 H40 V29 Q40 40 24 45 Q8 40 8 29Z" fill="#9aa5ab"/><path d="M13 12 H35 V28 Q35 36 24 40 Q13 36 13 28Z" fill="#b8c2c7" stroke-width="2"/>' +
  '<circle cx="12" cy="11" r="1.6" fill="' + COUL.trait + '"/><circle cx="36" cy="11" r="1.6" fill="' + COUL.trait + '"/><circle cx="12" cy="30" r="1.6" fill="' + COUL.trait + '"/><circle cx="36" cy="30" r="1.6" fill="' + COUL.trait + '"/><path d="M19 20 L29 30" stroke-width="2"/>';
ICONES_SVG.tourelle = '<rect x="5" y="35" width="38" height="8" rx="2" fill="' + COUL.boisFonce + '"/><path d="M11 35 V27 Q11 16 24 16 Q37 16 37 27 V35Z" fill="#8c9a66"/>' +
  '<rect x="30" y="20" width="16" height="5" rx="2" fill="' + COUL.metalFonce + '"/><rect x="17" y="24" width="10" height="4" rx="1" fill="#2f3a26"/>';

function svgIcone(id){
  return '<svg class="ico" viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="' + COUL.trait + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">' + ICONES_SVG[id] + '</g></svg>';
}

/* ---------- Visages selon l'état du personnage ----------
   On ajoute des détails par-dessus le visage : bandage (blessé), cernes
   (épuisé), bulle avec une goutte ou une cuisse de poulet (soif / faim),
   yeux en croix et gris (mort). Seuils dans ETATS_VISAGE. */
var ETATS_VISAGE = { blesse:40, epuise:35, faimSoif:25 };
function detailsEtat(x){
  var d = "";
  if(!x.al) return '<path d="M17 23.5 L22 28.5 M22 23.5 L17 28.5 M26 23.5 L31 28.5 M31 23.5 L26 28.5" stroke-width="2.4"/>';
  if(x.hp < ETATS_VISAGE.blesse)
    d += '<g transform="rotate(-12 24 17)"><rect x="9" y="13" width="30" height="6" rx="2" fill="' + COUL.blanc + '" stroke-width="2"/><circle cx="31" cy="16" r="2" fill="' + COUL.rouge + '" stroke="none"/></g>' +
         '<rect x="30" y="29" width="7" height="4" rx="1.5" fill="' + COUL.tissu + '" stroke-width="1.6" transform="rotate(20 33.5 31)"/>';
  if(x.en < ETATS_VISAGE.epuise)
    d += '<path d="M16.5 29.5 Q19.5 31.5 22.5 29.5 M25.5 29.5 Q28.5 31.5 31.5 29.5" stroke="#7a5c9e" stroke-width="1.8"/>' +
         '<path d="M38 7 H43 L38 12 H43" stroke-width="1.6"/>';
  if(x.soif < ETATS_VISAGE.faimSoif || x.faim < ETATS_VISAGE.faimSoif){
    var soif = x.soif <= x.faim;
    d += '<circle cx="9" cy="9" r="7" fill="' + COUL.blanc + '" stroke-width="1.8"/><circle cx="14" cy="16" r="1.6" fill="' + COUL.blanc + '" stroke-width="1.2"/>' +
         (soif ? '<path d="M9 4.5 Q12.5 9 9 12 Q5.5 9 9 4.5Z" fill="' + COUL.eau + '" stroke-width="1.2"/>'
               : '<path d="M6 12 L9 9" stroke-width="2"/><circle cx="10.5" cy="7.5" r="3" fill="' + COUL.bois + '" stroke-width="1.2"/>');
  }
  return d;
}
function svgMembre(k, x){
  return '<svg class="ico' + (x.al ? "" : " ico-mort") + '" viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="' + COUL.trait + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">' + ICONES_SVG[k] + detailsEtat(x) + '</g></svg>';
}

// Rex le chien
ICONES_SVG.chien =
  '<path d="M9 14 Q4 24 9 30 Q13 28 14 20Z" fill="' + COUL.boisFonce + '"/><path d="M39 14 Q44 24 39 30 Q35 28 34 20Z" fill="' + COUL.boisFonce + '"/>' +
  '<path d="M12 18 Q12 8 24 8 Q36 8 36 18 V30 Q36 42 24 42 Q12 42 12 30Z" fill="#c08a5a"/>' +
  '<ellipse cx="24" cy="33" rx="8" ry="6" fill="' + COUL.tissu + '"/>' +
  '<ellipse cx="24" cy="29.5" rx="3" ry="2.2" fill="' + COUL.trait + '"/>' +
  '<path d="M24 31.5 V34 M21 35 Q24 37 27 35" stroke-width="1.8"/>' +
  '<circle cx="19" cy="21" r="1.8" fill="' + COUL.trait + '"/><circle cx="29" cy="21" r="1.8" fill="' + COUL.trait + '"/>' +
  '<path d="M16 40 Q24 44 32 40" stroke="' + COUL.rouge + '" stroke-width="3"/>';

/* ---------- Portrait peint + petits badges d'état ----------
   Sur un portrait, on ne dessine pas par-dessus le visage : on ajoute
   des badges dans le coin (bandage, Z, goutte ou boîte), et le portrait
   devient gris quand le personnage est mort. */
function portraitMembre(x){
  var b = [];
  if(x.al){
    if(x.hp < ETATS_VISAGE.blesse) b.push(svgIcone("bandage"));
    if(x.en < ETATS_VISAGE.epuise) b.push('<span class="zz">Z</span>');
    if(x.soif < ETATS_VISAGE.faimSoif || x.faim < ETATS_VISAGE.faimSoif) b.push(svgIcone(x.soif <= x.faim ? "bouteille" : "conserve"));
  }
  // Mort : portrait gris, cadre penché et vitre brisée par-dessus
  var brise = x.al ? '' : '<svg class="fissure" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M58 -2 L50 28 L64 44 L42 66 L54 102 M50 28 L22 36 L4 30 M64 44 L92 52 M42 66 L16 82 M64 44 L70 20" stroke="#1d282c" stroke-width="6"/>'
    + '<path d="M58 -2 L50 28 L64 44 L42 66 L54 102 M50 28 L22 36 L4 30 M64 44 L92 52 M42 66 L16 82 M64 44 L70 20" stroke="#fff" stroke-width="2.5"/></g></svg>';
  return '<span class="portrait' + (x.al ? "" : " mort") + '"><img src="' + PORTRAITS[x.r || x.nom] + '" alt="">' + brise + (b.length ? '<span class="badges">' + b.join("") + '</span>' : '') + '</span>';
}
