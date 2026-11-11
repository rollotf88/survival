/* =====================================================================
   piece.js : la pièce peinte devient cliquable (porte, canapé, table...).
   Les zones sont données en pixels de l'image refuge-fond.webp
   (1024 × 1050) et recalées sur l'écran à chaque affichage : l'image est
   affichée en « cover », calée en haut et centrée. Les zones ne sont
   visibles que dans la partie de la pièce qu'on voit entre le chapitre
   et les cartes, donc elles ne gênent jamais les boutons.
   ===================================================================== */
var IMAGE_PIECE = { l:1024, h:1050 };
// Partie utile de l'image (de la cheminée à la porte, du haut du mur au bas de la table) : on la fait tenir dans l'espace libre
var CADRE_PIECE = { x0:150, x1:1024, y0:150, y1:690 };
// [action, x0, y0, x1, y1, icône, étiquette, hauteur de l'étiquette dans la zone (0 = haut, 1 = bas)]
// dans l'ordre d'empilement (la dernière est au-dessus). Hauteurs différentes à droite pour que
// Guide, Stock et Partir ne se chevauchent pas.
var ZONES_PIECE = [
  ["pPortraits", 328, 210, 692, 338, function(){ return ic("papa", "👪"); }, "Famille", .5],
  ["pCanape",    318, 392, 730, 575, function(){ return ic("lune", "🌙"); }, "Dormir", .45],
  ["pCheminee",  155, 355, 320, 530, function(){ return "🔥"; }, "Feu", .5],
  ["pEtagere",   714, 165, 835, 550, function(){ return "📖"; }, "Guide", .12],
  ["pPorte",     900, 205, 1022, 545, function(){ return ic("loupe", "🔍"); }, "Partir", .85],
  ["oRadio",     771, 192, 823, 234, function(){ return icone("radio"); }, "Radio", .5, function(){ return compter("radio") > 0; }],
  ["oPhoto",     247, 312, 285, 356, function(){ return icone("photo"); }, "Photo", .5, function(){ return compter("photo") > 0; }],
  ["chapitre",   365, 570, 660, 678, function(){ return "📜"; }, "Histoire", .55], // le livre ouvert sur la table basse : le chapitre et le récit (l'atelier a sa propre pièce)
  ["oCartes",    372, 578, 410, 604, function(){ return icone("cartes"); }, "Cartes", .5, function(){ return compter("cartes") > 0; }],
  ["chien",      668, 548, 858, 704, function(){ return ic("chien", "🐕"); }, "Rex", .5, function(){ return !!chien(); }]
];
// Éléments posés sur la pièce selon la partie (images Gemini détourées, 2026-11-09), mêmes coordonnées que les zones
// [image, x0, y0, x1, y1, condition]
var DECOR_PIECE = [
  ["images/planches.webp", 904, 262, 1022, 454, function(){ return G.ref && G.ref.barr >= 1; }], // barricade construite : planches sur la porte
  ["images/rex.webp",      668, 548, 858, 704, function(){ return !!chien(); }],                  // Rex adopté : couché devant le canapé
  // Objets de confort : visibles seulement si on les a (les images de pièce n'en montrent plus)
  ["images/objet-radio.webp",  771, 192, 823, 234, function(){ return compter("radio") > 0; }],
  ["images/objet-photo.webp",  247, 312, 285, 356, function(){ return compter("photo") > 0; }],
  ["images/objet-cartes.webp", 372, 578, 410, 604, function(){ return compter("cartes") > 0; }]
];
/* ---------- Les pièces de la maison, qu'on fait défiler (glisser du doigt, flèches ou points) ----------
   Chaque pièce : son image, sa taille, sa partie utile (cadre) et ses zones, en pixels de SON image. */
var PIECES = [
  // Salon et chambre : la cheminée montre le feu allumé ou éteint (G.feu)
  { id:"salon", nom:"Salon", img:function(){ return G.feu ? "images/refuge-fond-propre.webp" : "images/refuge-fond-eteint-propre.webp"; }, l:1024, h:1050, cadre:CADRE_PIECE, zones:ZONES_PIECE, decor:DECOR_PIECE },
  // La cuisine (2026-11-09) : la cuisinière montre le feu le jour où on a cuisiné
  { id:"cuisine", nom:"Cuisine", img:function(){ return G.cuisineJour === G.day ? "images/piece-cuisine-feu.webp" : "images/piece-cuisine.webp"; }, l:1024, h:1050, cadre:{ x0:0, x1:1024, y0:150, y1:740 }, decor:[], zones:[
    ["pCuisiner",   20, 420, 290, 740, function(){ return "🍲"; }, "Cuisiner", .55],
    ["pRecettes",  290, 465, 745, 680, function(){ return "🔪"; }, "Recettes", .5],
    ["pGardeManger", 715, 225, 1022, 660, function(){ return ic("conserve", "🥫"); }, "Garde-manger", .3]
  ]},
  { id:"chambre", nom:"Chambre", img:function(){ return G.feu ? "images/piece-chambre-feu-propre.webp" : "images/piece-chambre-propre.webp"; }, l:1024, h:1050, cadre:{ x0:0, x1:1024, y0:150, y1:780 },
    decor:[ ["images/objet-peluche.webp", 405, 395, 476, 495, function(){ return compter("peluche") > 0; }] ], zones:[
    ["pCheminee",   145, 355, 320, 575, function(){ return "🔥"; }, "Feu", .5],
    ["pCanape",     320, 240, 720, 560, function(){ return ic("lune", "🌙"); }, "Dormir", .3],
    ["pConstruire", 445, 520, 635, 760, function(){ return "🕯️"; }, "Bilan du refuge", .55],
    ["oPeluche",    405, 395, 476, 495, function(){ return icone("peluche"); }, "Peluche", .5, function(){ return compter("peluche") > 0; }],
    ["pPorte",      900, 205, 1022, 545, function(){ return ic("loupe", "🔍"); }, "Partir", .85]
  ]},
  { id:"reserve", nom:"Réserve", img:"images/piece-reserve.webp", l:1024, h:1050, cadre:{ x0:0, x1:1024, y0:150, y1:770 }, decor:[], zones:[
    ["stock",       160, 260, 835, 765, function(){ return ic("caisse", "📦"); }, "Stock", .5],
    ["pConstruire", 790, 395, 1010, 810, function(){ return ic("ref_barr", "🧱"); }, "Construire", .3]
  ]},
  { id:"atelier", nom:"Atelier", img:"images/piece-atelier.webp", l:1024, h:1050, cadre:{ x0:0, x1:1024, y0:120, y1:700 }, decor:[], zones:[
    ["pReparer",    340, 210, 720, 435, function(){ return "🔧"; }, "Réparer", .5],
    ["pConstruire",   0, 340, 290, 710, function(){ return ic("ref_barr", "🧱"); }, "Construire", .4],
    ["pDemonter",   715, 225, 1022, 660, function(){ return "♻️"; }, "Démonter", .3],
    ["pTable",      290, 465, 745, 680, function(){ return ic("marteau", "🛠️"); }, "Fabriquer", .55]
  ]},
  // Le garage montre la voiture réparée dès que les 3 pièces sont installées
  { id:"garage", nom:"Garage", img:function(){ return G.voiture && voitureReparee() ? "images/piece-garage-ok.webp" : "images/piece-garage.webp"; }, l:768, h:1376, cadre:{ x0:0, x1:768, y0:250, y1:900 }, decor:[], zones:[
    ["pPorte",   200, 370, 570, 555, function(){ return ic("loupe", "🔍"); }, "Partir", .5],
    ["pVoiture", 150, 555, 590, 890, function(){ return "🚗"; }, "Voiture", .5]
  ]},
  // La cour change selon ce qui est construit : potager (légumes ou bacs vides), récupérateur (tonneau ou non), poules
  { id:"cour", nom:"Cour", img:function(){ var pot = G.ref && G.ref.pot >= 1, eau = G.ref && G.ref.eau >= 1; return "images/piece-cour" + (pot && eau ? "" : pot ? "-pot" : eau ? "-eau" : "-rien") + ".webp"; },
    l:1024, h:1050, cadre:{ x0:0, x1:1024, y0:120, y1:800 }, decor:[
      // Stèles des disparus au pied de la palissade (dessinées en code, prénom gravé)
      [function(){ return steleSrc(0); }, 598, 540, 662, 650, function(){ return G.dd && G.dd.length > 0; }],
      [function(){ return steleSrc(1); }, 662, 548, 724, 654, function(){ return G.dd && G.dd.length > 1; }],
      [function(){ return steleSrc(2); }, 724, 556, 786, 658, function(){ return G.dd && G.dd.length > 2; }],
      ["images/poules.webp", 600, 637, 810, 800, function(){ return compter("poule") > 0; }] ], zones:[
    ["pPotager",   0, 410, 410, 915, function(){ return ic("ref_pot", "🥕"); }, "Potager", .4],
    ["pRecup",   430, 440, 600, 665, function(){ return ic("ref_eau", "🪣"); }, "Récupérateur", .35],
    ["pPoules",  790, 400, 1024, 780, function(){ return ic("poule", "🐔"); }, "Poules", .3],
    ["pTombes",  600, 520, 785, 660, function(){ return "🕯️"; }, "Tombes", .1, function(){ return (G.dd && G.dd.length > 0) || !!G.lettre; }]
  ]},
  // Le bastion du clan (2026-11-10, images Gemini) : ces 3 pièces n'apparaissent que si l'on fait partie d'un clan (si)
  { id:"bastionSalle", nom:"Bastion · grande salle", img:"images/piece-bastion-salle.webp", l:1024, h:1050, cadre:{ x0:0, x1:1024, y0:150, y1:860 }, decor:[], si:function(){ return typeof dansUnClan === "function" && dansUnClan(); }, zones:[
    ["pChat",         0, 395, 235, 745, function(){ return "💬"; }, "Discuter", .5],
    ["pClan",       350, 220, 690, 460, function(){ return "🛡️"; }, "Mon clan", .5],
    ["pGuerre",     728, 225, 1010, 665, function(){ return "⚔️"; }, "La guerre", .4],
    ["pOperations", 230, 515, 805, 920, function(){ return "🎯"; }, "Opérations", .35]
  ]},
  { id:"bastionTresor", nom:"Bastion · salle du trésor", img:"images/piece-bastion-tresor.webp", l:1024, h:1050, cadre:{ x0:0, x1:1024, y0:150, y1:900 }, decor:[], si:function(){ return typeof dansUnClan === "function" && dansUnClan(); }, zones:[
    ["pReserve",  100, 205, 930, 855, function(){ return "📦"; }, "Réserve du clan", .2],
    ["pJournal",  400, 465, 650, 930, function(){ return "📜"; }, "Journal", .4]
  ]},
  { id:"bastionCour", nom:"Bastion · cour fortifiée", img:"images/piece-bastion-cour.webp", l:1024, h:1050, cadre:{ x0:0, x1:1024, y0:100, y1:860 }, decor:[], si:function(){ return typeof dansUnClan === "function" && dansUnClan(); }, zones:[
    ["pDefenses",  60,  40, 345, 810, function(){ return "🗼"; }, "Défenses", .45],
    ["pGuerre",   410, 360, 660, 590, function(){ return "⚔️"; }, "La guerre", .5],
    ["pDefenses", 380, 600, 730, 790, function(){ return "💣"; }, "Remparts et mines", .5]
  ]}
];
var pieceIdx = 0;
var BOUTON_PIECE = { cuisine:"refuge", chambre:"dormir", reserve:"stock", atelier:"refuge", garage:"fouille", cour:"refuge" };
// La barre des pièces (flèches + points) s'efface après 3 s ; elle revient au changement de pièce ou quand on touche la pièce
var minuteurNav = null, dernierePieceNav = null;
function montrerNav(force){
  var c = $("piece"); if(!c) return;
  if(!force && dernierePieceNav === pieceIdx + ":" + G.day) return; // déjà montrée pour cette pièce aujourd'hui
  dernierePieceNav = pieceIdx + ":" + G.day;
  c.classList.add("navvue"); clearTimeout(minuteurNav);
  minuteurNav = setTimeout(function(){ var c2 = $("piece"); if(c2) c2.classList.remove("navvue"); }, 3000);
}
// Une pièce peut n'exister que dans certains cas (si) : ex. le bastion seulement quand on a un clan
function pieceVisible(i){ var p = PIECES[i]; return !!p && (!p.si || p.si()); }
function allerPiece(k){
  var sens = k < pieceIdx ? -1 : 1, n = PIECES.length;
  k = (k + n) % n;
  for(var g = 0; g < n && !pieceVisible(k); g++) k = (k + sens + n) % n;
  pieceIdx = k;
  dernierJourEtiquettes = null; // on montre les étiquettes de la nouvelle pièce
  if(typeof son === "function") son("pas");
  placerPiece();
  panneauPiece();
}
/* Sur PC, le panneau de droite suit la pièce affichée (2026-11-10, « pense ergonomie ») : la chambre montre la nuit qui vient,
   la réserve le stock, l'atelier les fabrications, etc. Le salon revient au tableau de bord. On ne remplace pas une fenêtre
   importante (combat, expédition, rencontre, bilan de la nuit, événement). */
var PANNEAU_PIECE = {
  cuisine:function(){ selRef = null; openRef("cuisine"); }, chambre:function(){ openDormir(); }, reserve:function(){ selStock = null; filtreStock = "tout"; openStock(); },
  atelier:function(){ selRef = null; openRef("fabriquer"); }, garage:function(){ openRef("voiture"); }, cour:function(){ selRef = null; openRef("construire"); },
  bastionSalle:function(){ if(typeof openChat === "function") openChat(); else if(typeof openClans === "function") openClans(); }, bastionTresor:function(){ if(typeof openBastion === "function") openBastion("reserve"); },
  bastionCour:function(){ if(typeof openBastion === "function") openBastion("defenses"); }
};
function panneauPiece(){
  if(!document.body.classList.contains("pc") || !G || G.ph !== "game") return;
  if(G.exp || G.combat || G.rencontre) return;
  var m = $("modal"), ouvert = m && m.style.display !== "none";
  if(ouvert && document.querySelector("#sheet .banniere, #sheet.large")) return; // bilan de nuit, événement, combat…
  var f = PANNEAU_PIECE[PIECES[pieceIdx].id];
  if(f) f(); else if(ouvert) hide(); // salon : le tableau de bord
}
function placerDecor(dx, dy, s, boite){
  var d = $("decor"); if(!d){ d = document.createElement("div"); d.id = "decor"; document.body.appendChild(d); }
  if(s === null){ d.innerHTML = ""; return; }
  // Sur PC, les objets posés sont coupés au bord de la boîte de la scène
  if(boite){ d.style.cssText = "left:" + boite.x + "px;top:" + boite.y + "px;width:" + boite.l + "px;height:" + boite.h + "px;right:auto;bottom:auto;border-radius:12px"; dx -= boite.x; dy -= boite.y; }
  else d.style.cssText = "";
  d.innerHTML = (sceneLieu() ? [] : PIECES[pieceIdx].decor).filter(function(e){ return e[5](); }).map(function(e){
    return '<img src="' + (typeof e[0] === "function" ? e[0]() : e[0]) + '" alt="" style="left:' + (dx + e[1] * s) + 'px;top:' + (dy + e[2] * s) + 'px;width:' + ((e[3] - e[1]) * s) + 'px;height:' + ((e[4] - e[2]) * s) + 'px">';
  }).join("");
}

/* ---------- La scène suit l'action (2026-11-10, retour de Fabien « rendre ça vivant ») ----------
   Pendant une expédition (et jusqu'à la fermeture du résultat), la scène montre le lieu fouillé au lieu de la maison ;
   pendant un assaut, la cour du bastion attaqué. Pas de zones touchables ni de flèches de pièces pendant ce temps. */
var lieuResultat = null;
function sceneLieu(){
  if(!G || G.ph !== "game") return null;
  var i = null;
  if(G.exp && G.exp.raid && typeof fondEtage === "function") return { img:fondEtage(G.exp.etage), l:1376, h:768, nom:BAL.immeuble.etages[G.exp.etage] ? BAL.immeuble.etages[G.exp.etage].nom : "L’immeuble" };
  if(G.exp) i = G.exp.guerre ? "bastion" : G.exp.lieu;
  else if(G.rencontre && G.rencontre.apres) i = G.rencontre.apres.lieu;
  else if(lieuResultat !== null) i = lieuResultat;
  if(i === null || i === undefined) return null;
  if(i === "bastion") return { img:"images/piece-bastion-cour.webp", l:1024, h:1050, nom:G.exp.nomLieu || "Bastion" };
  var L = LIEUX[i]; if(!L) return null;
  var im = imageLieu(L) || fondCombat(L);
  return { img:im, l:640, h:356, nom:L.nom };
}
// Pièce de la maison liée à chaque bouton du bas (toucher Dormir montre la chambre, etc.)
var PIECE_BOUTON = { dormir:"chambre", stock:"reserve", refuge:"atelier", fouille:"garage" };
function allerPieceId(id){ var k = PIECES.findIndex(function(p){ return p.id === id; }); if(k >= 0 && k !== pieceIdx && pieceVisible(k)){ pieceIdx = k; dernierJourEtiquettes = null; placerPiece(); } }
function placerPiece(){
  setTimeout(placerMeteo, 0);
  var cont = $("piece");
  if(!cont){ cont = document.createElement("div"); cont.id = "piece"; document.body.appendChild(cont); }
  var chap = document.querySelector(".scene"), bas = document.querySelector(".scene > .row") || document.querySelector(".scene .grid2");
  var corps = document.body.style;
  if(!G || G.ph !== "game" || !chap || !bas){ cont.innerHTML = ""; cont.style.display = "none"; corps.backgroundSize = corps.backgroundPosition = corps.backgroundImage = ""; if($("fondu")) $("fondu").style.display = "none"; if($("fondScene")) $("fondScene").style.display = "none"; placerDecor(0, 0, null); return; }
  var haut = chap.getBoundingClientRect().top + 2, fin = bas.getBoundingClientRect().top - 4;
  // Grand écran (body.pc) : le jeu tient dans un cadre centré de 1500 px au plus ; la pièce s'arrête au panneau de droite
  var pc = document.body.classList.contains("pc"), gx = 0, dxMax = window.innerWidth;
  if(pc){ var boite = Math.min(window.innerWidth, LARGEUR_BOITE_PC); gx = (window.innerWidth - boite) / 2 + 12; dxMax = gx - 12 + boite - LARGEUR_PANNEAU_PC;
    var rc = chap.getBoundingClientRect(); if(rc.width > 200){ gx = rc.left; dxMax = rc.right; } } // la scène a exactement la largeur des cartes et des boutons
  if(fin - haut < 40){ cont.innerHTML = ""; cont.style.display = "none"; corps.backgroundSize = corps.backgroundPosition = corps.backgroundImage = ""; if($("fondu")) $("fondu").style.display = "none"; placerDecor(0, 0, null); return; } // pas assez de place
  if(!pieceVisible(pieceIdx)) pieceIdx = 0; // on a quitté son clan : retour au salon
  var EXT = sceneLieu();
  var vw = dxMax - gx, P = EXT ? { id:"dehors", nom:"📍 " + EXT.nom, l:EXT.l, h:EXT.h, cadre:{ x0:0, x1:EXT.l, y0:0, y1:EXT.h }, zones:[], decor:[] } : PIECES[pieceIdx], F = P.cadre, urlImg = 'url("' + (EXT ? EXT.img : typeof P.img === "function" ? P.img() : P.img) + '")';
  document.body.classList.toggle("dehors", !!EXT);
  // Échelle : la partie utile tient en largeur ET en hauteur dans l'espace libre
  var s = Math.min(vw / (F.x1 - F.x0), (fin - haut) / (F.y1 - F.y0));
  // Sur PC, la pièce est dans une boîte encadrée qu'elle remplit toujours (quelle que soit la largeur de l'image)
  if(pc) s = Math.max(s, vw / P.l, (fin - haut) / P.h);
  var dx = gx + (vw - (F.x1 - F.x0) * s) / 2 - F.x0 * s;
  // L'image est collée en haut de l'espace libre (le plafond remplit le haut), tant que la partie utile reste visible
  var dy = Math.max(haut - F.y0 * s, Math.min(haut, fin - F.y1 * s));
  var fs = $("fondScene");
  if(pc){
    dx = Math.min(gx, Math.max(dxMax - P.l * s, dx)); dy = Math.min(haut, Math.max(fin - P.h * s, dy)); // pas de bord vide dans la boîte
    corps.backgroundImage = corps.backgroundSize = corps.backgroundPosition = "";
    if(!fs){ fs = document.createElement("div"); fs.id = "fondScene"; document.body.insertBefore(fs, document.body.firstChild); }
    document.body.classList.toggle("scene-petite", vw < 780 || fin - haut < 540); // trop petite pour y jouer le combat
    var rs = document.documentElement.style; rs.setProperty("--scene-x", gx + "px"); rs.setProperty("--scene-y", haut + "px"); rs.setProperty("--scene-w", vw + "px"); rs.setProperty("--scene-h", (fin - haut) + "px");
    fs.style.cssText = "display:block;left:" + gx + "px;top:" + haut + "px;width:" + vw + "px;height:" + (fin - haut) + "px;background-image:" + urlImg + ";background-size:" + (P.l * s) + "px auto;background-position:" + (dx - gx) + "px " + (dy - haut) + "px";
  } else {
    if(fs) fs.style.display = "none";
    corps.backgroundImage = urlImg;
    corps.backgroundSize = (P.l * s) + "px auto";
    corps.backgroundPosition = dx + "px " + dy + "px";
  }
  placerDecor(dx, dy, s, pc ? { x:gx, y:haut, l:vw, h:fin - haut } : null);
  // Fondu sur le bas de l'image pour qu'elle se mêle au plancher (au lieu de s'arrêter net)
  var f = $("fondu"); if(!f){ f = document.createElement("div"); f.id = "fondu"; document.body.appendChild(f); }
  f.style.display = pc ? "none" : "block"; f.style.top = (dy + P.h * s - 88) + "px"; f.style.left = gx + "px"; f.style.right = pc ? (window.innerWidth - dxMax) + "px" : "0";
  cont.classList.toggle("compact", s < 0.32);
  cont.style.display = "block"; cont.style.top = haut + "px"; cont.style.height = (fin - haut) + "px";
  cont.style.left = gx + "px"; cont.style.right = pc ? (window.innerWidth - dxMax) + "px" : "0";
  cont.innerHTML = P.zones.map(function(z){
    if(z[8] && !z[8]()) return "";
    var x = dx + z[1] * s - gx, y = dy + z[2] * s - haut, l = (z[3] - z[1]) * s, h = (z[4] - z[2]) * s;
    var cy = y + h / 2;
    if(cy < 0 || cy > fin - haut || x + l < 0 || x > vw) return ""; // centre hors de la partie visible
    var invite = (z[0] === "pCanape" && G.m && !G.m.some(peutSortir)) || (z[0] === "pOperations" && typeof opAttention === "function" && opAttention()); // plus personne ne peut sortir : on invite à dormir ; une opération du clan attend
    return '<button class="zone' + (invite ? " invite" : "") + '" data-act="' + z[0] + '" style="left:' + x + 'px;top:' + y + 'px;width:' + l + 'px;height:' + h + 'px" aria-label="' + z[6] + '"><span class="etiq" style="top:' + (z[7] * 100) + '%">' + z[5]() + ' ' + z[6] + '</span></button>';
  }).join("")
    // Changer de pièce : flèches de chaque côté et points en haut (on peut aussi glisser le doigt)
    + (EXT ? '<div class="navpieces dehors navvue"><span class="navnom">' + P.nom + '</span></div>' : '<div class="navpieces"><button class="navfl" data-act="piecePrec" aria-label="Pièce précédente">◀</button>'
    + PIECES.map(function(p, k){ if(!pieceVisible(k)) return ""; return '<button class="navpt' + (k === pieceIdx ? " on" : "") + '" data-act="pieceVa" data-id="' + k + '" aria-label="' + p.nom + '"><span></span></button>'; }).join("")
    + '<button class="navfl" data-act="pieceSuiv" aria-label="Pièce suivante">▶</button><span class="navnom">' + P.nom + '</span></div>')
    // Sur PC : de grandes flèches toujours visibles sur les côtés de la scène (pas de glisser à la souris)
    + (pc && !EXT ? '<button class="flpc g" data-act="piecePrec" aria-label="Pièce précédente">‹</button><button class="flpc d" data-act="pieceSuiv" aria-label="Pièce suivante">›</button>' : '');
  ajusterEtiquettes(cont, dxMax, gx);
  // Le bouton du bas qui correspond à la pièce est mis en avant (Réserve → Stock, Chambre → Dormir…)
  var lien = BOUTON_PIECE[P.id];
  document.querySelectorAll(".acts .btn").forEach(function(bt){ bt.classList.toggle("ici", bt.getAttribute("data-act") === lien); });
  montrerNav();
  // Étiquettes visibles 3 secondes au début de chaque journée, puis elles s'effacent (image plus propre)
  if(dernierJourEtiquettes !== G.day){
    dernierJourEtiquettes = G.day; cont.classList.add("montrer");
    clearTimeout(minuteurEtiquettes); minuteurEtiquettes = setTimeout(function(){ var c = $("piece"); if(c) c.classList.remove("montrer"); }, 3000);
  }
}
var dernierJourEtiquettes = null, minuteurEtiquettes = null;
// Les étiquettes restent dans l'écran et ne se chevauchent pas (on décale vers le bas celle qui gêne)
function ajusterEtiquettes(cont, vw, gauche){
  gauche = gauche || 0;
  var et = Array.prototype.slice.call(cont.querySelectorAll(".zone .etiq"));
  et.forEach(function(e){
    var r = e.getBoundingClientRect(), d = 0;
    if(r.left < gauche + 4) d = gauche + 4 - r.left; else if(r.right > vw - 4) d = vw - 4 - r.right;
    if(d) e.style.marginLeft = d + "px";
  });
  var boites = et.map(function(e){ return { e:e, r:e.getBoundingClientRect() }; }).sort(function(a, b){ return a.r.top - b.r.top; });
  for(var i = 1; i < boites.length; i++) for(var j = 0; j < i; j++){
    var a = boites[j].r, b = boites[i].r;
    if(a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom){
      var dy = a.bottom - b.top + 2, actuel = parseFloat(boites[i].e.style.marginTop) || 0;
      boites[i].e.style.marginTop = (actuel + dy) + "px";
      boites[i].r = boites[i].e.getBoundingClientRect(); b = boites[i].r;
    }
  }
}
window.addEventListener("resize", function(){ if(!G || G.ph !== "game") return; var avant = document.body.classList.contains("pc"); if(avant !== modePC()) render(); else placerPiece(); });

// « Qui part ? » quand on touche la porte sans avoir choisi de membres
function openQuiPart(){
  var h = '<h2>' + ic("loupe", "🔍") + ' Qui part fouiller ?</h2><p class="sub">Choisis 1 ou 2 membres, puis le lieu.</p>';
  G.m.forEach(function(x, i){
    if(!x.al) return;
    var ok = peutSortir(x), on = G.sel.indexOf(i) >= 0;
    // Ligne : à gauche le membre (toucher = choisir), à droite ses 3 cases d'équipement (toucher = équiper)
    h += '<div class="qprow' + (on ? " choisi" : "") + '"><button class="qpqui" data-act="qpsel" data-id="' + i + '"' + (ok ? "" : " disabled") + '><span class="em">' + iconeMembre(x) + '</span><span class="eqt"><b>' + (on ? "✔ " : "") + x.nom + '</b><small>⚡ ' + x.en + (ok ? "" : " · trop fatigué") + '</small></span></button>'
      + '<div class="qpeq">' + EMPLACEMENTS.map(function(e){
          var o = x.eq[e[0]], dispo = !o && pourEmplacement(e[0]).length > 0;
          return '<button class="slot' + (o ? " f" : "") + (dispo ? " dispo" : "") + classeUsure(o) + '" data-act="slot" data-retour="quipart" data-id="' + i + ':' + e[0] + '" aria-label="' + e[2] + ' de ' + x.nom + ' : ' + (o ? OBJETS[o.id].nom : "vide") + '">' + (o ? icone(o.id) : '<span class="vide">' + e[1] + '</span>') + '</button>';
        }).join("") + '</div></div>';
  });
  h += offrePub("quipart") + '<div class="row"><button class="btn" data-act="fouille"' + (G.sel.length ? "" : " disabled") + '>🗺️ Choisir le lieu</button><button class="btn alt" data-act="close">Annuler</button></div>';
  show(h);
}

document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
  if(a === "pPorte"){ if(G.sel.length) openLoc(); else openQuiPart(); }
  else if(a === "qpsel"){ var i = +id, p = G.sel.indexOf(i); if(p >= 0) G.sel.splice(p, 1); else if(G.sel.length < BAL.membresParExpedition) G.sel.push(i); render(); openQuiPart(); }
  else if(a === "pCanape") openDormir();
});
// Confirmation avant de dormir (le canapé) ; propose la pub si elle peut éviter de finir la journée trop tôt
function openDormir(){
  // Ce que la nuit va faire, avant de confirmer (mêmes médaillons que le journal)
  var v = vivants().length, be = besoinNuit("eau"), bn = besoinNuit("nour"), re = rations("eau"), rn = rations("nour");
  var couv = compter("couverture") * BAL.feu.couvrePar, froids = G.feu ? 0 : Math.max(0, v - couv);
  var A = BAL.attaqueNuit, ch = Math.round(chanceAttaqueNuit() * 100), f = forceMiniNuit();
  var L = [];
  L.push([froids ? "b2" : "g2", "😴 Chacun récupère +" + (G.feu ? BAL.reposNuit + BAL.feu.repos : BAL.reposNuit) + " ⚡" + (froids ? " (sauf " + froids + " qui " + (froids > 1 ? "auront" : "aura") + " froid : +" + BAL.reposFroid + " ⚡, −" + BAL.degatsFroid + " PV)" : "") + "."]);
  L.push([re >= be ? "" : "b2", ic("bouteille", "💧") + " La famille boira " + Math.min(be, re) + " ration" + (Math.min(be, re) > 1 ? "s" : "") + " d’eau (il en reste " + re + ")" + (re < v ? " : pas assez pour tout le monde !" : ".")]);
  L.push([rn >= bn ? "" : "b2", ic("conserve", "🥫") + " Elle mangera " + Math.min(bn, rn) + " ration" + (Math.min(bn, rn) > 1 ? "s" : "") + " (il en reste " + rn + ")" + (rn < v ? " : pas assez pour tout le monde !" : ".")]);
  if(G.feu) L.push(["g2", "🔥 Le feu brûle toute la nuit" + (G.braises > 0 ? " (la planche d’hier suffit)." : " (1 planche pour 2 nuits).")]);
  if(chien()) L.push(["", ic("chien", "🐕") + " " + chien().nom + " mange 1 ration et monte la garde."]);
  if(compter("poule")) L.push(["", ic("poule", "🐔") + " Les poules boivent " + Math.ceil(compter("poule") / BAL.poules.eauPour) + " ration(s) d’eau et pondent peut-être."]);
  L.push([defenseNuit() >= f + 2 ? "g2" : defenseNuit() >= f ? "" : "b2", "🧟 Environ " + ch + " % de risque d’attaque, force " + f + " à " + (f + 2) + " · votre défense : " + defenseNuit() + "."]);
  if(sacrificePossible()) L.push(["b2", "💀 Quelqu’un va mourir de faim, et il n’y a plus rien. Il reste une solution, la pire de toutes…"]);
  show('<h2>' + ic("lune", "🌙") + ' Aller dormir ?</h2><p class="sub">La journée se termine. Cette nuit :</p>' + puces(L)
    + (sacrificePossible() ? '<button class="loc sombre" data-act="sacrifice"><b>🕯️ Le choix impossible</b><small>Sacrifier l’un des vôtres pour que les autres survivent</small></button>' : '')
    + '<div class="row"><button class="btn" data-act="endday">🌙 Dormir</button><button class="btn alt" data-act="close">Pas encore</button></div>' + offrePub("dormir"));
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act");
  if(a === "pTable") openRef("fabriquer");
  else if(a === "pCuisiner" || a === "pRecettes"){ selRef = null; openRef("cuisine"); }
  else if(a === "pGardeManger"){ filtreStock = "vivres"; selStock = null; openStock(); }
  else if(a === "pCheminee") openFeu();
  else if(a === "pFoyer") openFoyerClan();
  else if(a === "pTombes") openTombes();
  else if(a === "recueillir"){ if(recueillir()){ msgTombes = "🕯️ La famille se recueille en silence. Le moral remonte un peu (+" + BAL.tombes.moral + ")."; render(); if(typeof sauver === "function") sauver(); } openTombes(); }
  else if(a === "pChat"){ if(typeof openChat === "function") openChat(); }
  else if(a === "versSalon"){ hide(); allerPiece(0); }
  else if(a === "feu"){ G.feu = !G.feu; if(!G.feu) G.braises = 0; if(G.feu && typeof son === "function") son("feu"); render(); openFeu(); }
  else if(a === "pSac") openStock();
  else if(a === "pReparer") openRef("reparer");
  else if(a === "pDemonter") openRef("demonter");
  else if(a === "pConstruire") openRef("construire");
  else if(a === "pVoiture") openRef("voiture");
  else if(a === "pPotager") openElement("pot");
  else if(a === "oPeluche") openObjetPiece("peluche");
  else if(a === "oRadio") openObjetPiece("radio");
  else if(a === "oCartes") openObjetPiece("cartes");
  else if(a === "oPhoto") openObjetPiece("photo");
  else if(a === "pRecup") openElement("eau");
  else if(a === "pPoules"){ if(typeof son === "function") son("poule"); openPoules(); }
  else if(a === "buildel"){ var be = b.getAttribute("data-id"); var ok = ameliorer(be); render(); openElement(be, ok ? "✅ " + REFUGE[be].nom + " amélioré : niveau " + G.ref[be] + " !" : ""); if(ok && typeof son === "function") son("construire"); }
  else if(a === "pClan"){ if(typeof openClans === "function") openClans(); }
  else if(a === "pOperations"){ if(typeof ouvrirOperation === "function") ouvrirOperation(null); }
  else if(a === "pClassClans"){ if(typeof openClassementClans === "function") openClassementClans(); }
  else if(a === "pGuerre"){ if(typeof openGuerre === "function") openGuerre(); }
  else if(a === "pReserve"){ if(typeof openBastion === "function") openBastion("reserve"); }
  else if(a === "pJournal"){ if(typeof openBastion === "function") openBastion("journal"); }
  else if(a === "pDefenses"){ if(typeof openBastion === "function") openBastion("defenses"); }
  else if(a === "piecePrec") allerPiece(pieceIdx - 1);
  else if(a === "pieceSuiv") allerPiece(pieceIdx + 1);
  else if(a === "pieceVa") allerPiece(+b.getAttribute("data-id"));
  else if(a === "pEtagere"){ guideOnglet = "regles"; guideFiche = null; openGuide(); }
  else if(a === "pPortraits"){ guideOnglet = "famille"; guideFiche = null; openGuide(); }
});

// Glisser le doigt (ou la souris) de gauche à droite sur l'écran principal pour changer de pièce
var departGlisse = null;
document.addEventListener("pointerdown", function(e){
  if(!G || G.ph !== "game" || $("modal").style.display === "flex" || $("astuce")) { departGlisse = null; return; }
  if(document.body.classList.contains("pc") && e.pointerType === "mouse"){ departGlisse = null; return; } // sur PC, on change de pièce avec les flèches
  departGlisse = { x:e.clientX, y:e.clientY, t:Date.now() };
  if(!e.target.closest(".acts, .mc, .sheet")) montrerNav(true); // toucher la pièce fait réapparaître la barre
});
document.addEventListener("pointerup", function(e){
  var d = departGlisse; departGlisse = null;
  if(!d || !G || G.ph !== "game" || $("modal").style.display === "flex") return;
  var dx = e.clientX - d.x, dy = e.clientY - d.y;
  if(Math.abs(dx) > 60 && Math.abs(dx) > 1.6 * Math.abs(dy) && Date.now() - d.t < 900){
    finGlisse = Date.now(); // le clic qui suit est ignoré (ui.js)
    allerPiece(pieceIdx + (dx < 0 ? 1 : -1));
  }
});
document.addEventListener("pointercancel", function(){ departGlisse = null; });

/* ---------- Fenêtres des éléments de la cour (potager, récupérateur, poulailler) ---------- */
// Un élément du refuge : où il en est, ce qu'il rapporte, et le bouton pour l'améliorer
function openElement(k, message){
  var r = REFUGE[k], l = G.ref[k], c = coutAmelioration(k), mx = l >= r.max, pl = compter("planche");
  var quoi = k === "eau" ? "ration d’eau" : k === "pot" ? "ration de nourriture" : "";
  var h = '<div class="rt"><span class="em" style="font-size:52px">' + ic("ref_" + k, r.icone) + '</span><span class="eqt"><h2>' + r.nom + '</h2><p class="sub">Niveau ' + l + ' / ' + r.max + '</p></span></div>';
  if(message) h += '<p class="g2 msg">' + message + '</p>';
  if(k === "barr") h += '<p>' + (l ? "La barricade ajoute <b>+" + l * BAL.defenseBarricade + " de défense</b> la nuit." : "Pas encore de barricade : la porte ne tiendra pas longtemps.") + ' Une attaque perdue en détruit un niveau.</p>';
  else h += '<p>' + (l ? "Rapporte <b>" + l * r.parJour + " " + quoi + (l * r.parJour > 1 ? "s" : "") + "</b> chaque nuit." : k === "pot" ? "Les bacs sont vides : il faut des planches pour les préparer et semer." : "Pas encore de tonneau sous la gouttière : l’eau de pluie est perdue.") + '</p>';
  if(mx) h += '<p class="etat ok">⭐ Niveau maximum atteint</p>';
  else {
    h += '<p class="sub">' + (l ? "Niveau suivant : " : "Construire : ") + (k === "barr" ? "+" + BAL.defenseBarricade + " de défense" : "+" + r.parJour + " " + quoi + " par nuit") + ' · coût ' + ic("planche", "🪵") + ' ' + c + ' planches (tu en as ' + pl + ')</p>';
    h += '<button class="btn" style="width:100%;margin-bottom:8px" data-act="buildel" data-id="' + k + '"' + (pl < c ? " disabled" : "") + '>' + (pl < c ? "❌ Il manque " + nommer("planche", c - pl) : "🔨 " + (l ? "Améliorer" : "Construire") + " (" + c + " planches)") + '</button>';
  }
  show(h + BTN_FERMER());
}
// Le poulailler : combien de poules, ce qu'elles donnent, ce qu'elles coûtent
function openPoules(){
  var n = compter("poule"), P = BAL.poules;
  var h = '<div class="rt"><span class="em" style="font-size:52px">' + ic("poule", "🐔") + '</span><span class="eqt"><h2>Le poulailler</h2><p class="sub">' + (n ? n + " poule" + (n > 1 ? "s" : "") : "Vide") + '</p></span></div>';
  if(!n) h += '<p>Pas encore de poule. On en trouve au <b>Village voisin</b>, chez <b>Marco</b> le brocanteur, et parfois une poule égarée arrive le matin.</p>';
  else {
    var eau = Math.ceil(n / P.eauPour), oeufs = Math.round(n * P.oeuf * 10) / 10;
    h += '<ul><li>🥚 Environ <b>' + String(oeufs).replace(".", ",") + ' œuf' + (oeufs > 1 ? "s" : "") + '</b> par nuit (1 ration de nourriture chacun, ' + Math.round(P.oeuf * 100) + ' % de chances par poule).</li>'
      + '<li>' + ic("bouteille", "💧") + ' Elles boivent <b>' + eau + ' ration' + (eau > 1 ? "s" : "") + ' d’eau</b> par nuit, après la famille. Sans eau, l’une d’elles meurt.</li>'
      + '<li>🧟 Leurs caquètements attirent les zombies : <b>+' + Math.round(n * P.attaque * 100) + ' %</b> de risque d’attaque la nuit.</li></ul>';
  }
  show(h + BTN_FERMER());
}

/* ---------- Mini-jeu de pêche (à l'étang, avec une canne) ----------
   Le bouchon flotte ; au bout d'un moment au hasard il s'enfonce pendant BAL.peche.fenetre secondes :
   il faut toucher « Ferrer ! » à ce moment-là. Trop tôt, le poisson fuit ; trop tard, il se décroche.
   Chaque touche réussie = 1 poisson (logique.js : lancerPeche). */
var phasePeche = null, minPeche = null, msgPeche = "";
function openPeche(){
  var P = G.exp && G.exp.peche; if(!P) return;
  clearTimeout(minPeche);
  var fini = P.faits >= P.lancers, reste = G.lieux[G.exp.lieu].poissons;
  var h = '<h2>' + ic("canne", "🎣") + ' Pêche à l’étang</h2>'
    + '<p class="sub">' + (fini ? "Pêche terminée" : "Lancer " + (P.faits + 1) + " / " + P.lancers) + ' · 🐟 ' + P.prises + ' prise' + (P.prises > 1 ? "s" : "") + ' · ' + reste + ' poisson' + (reste > 1 ? "s" : "") + ' dans l’étang</p>'
    + '<div class="etangjeu"><span class="fil"></span><span class="bouchon" id="bouchon"></span></div>'
    + '<p class="msg" id="msgpeche">' + (msgPeche || "Attends que le bouchon s’enfonce, puis touche vite « Ferrer » !") + '</p>'
    + (fini ? '<button class="btn" style="width:100%" data-act="pechefin">Rentrer avec la pêche</button>' : '<button class="btn" style="width:100%" data-act="ferrer">🎣 Ferrer !</button>');
  msgPeche = "";
  show(h);
  if(!fini) lancerBouchon();
}
function lancerBouchon(){
  phasePeche = "attente";
  minPeche = setTimeout(function(){
    var b = $("bouchon"); if(!b) return;
    phasePeche = "touche"; b.className = "bouchon touche";
    if(typeof vibrer === "function") vibrer(40);
    minPeche = setTimeout(function(){ finLancer(false, "Trop tard : le poisson s’est décroché."); }, BAL.peche.fenetre * 1000);
  }, 1200 + Math.random() * 2600); // le moment de la touche : au hasard (adresse du joueur, comme le crochetage)
}
function finLancer(ok, msg){
  if(phasePeche !== "attente" && phasePeche !== "touche") return;
  clearTimeout(minPeche); phasePeche = "resultat";
  lancerPeche(ok); msgPeche = msg; setTimeout(sauver, 0);
  var b = $("bouchon"); if(b) b.className = "bouchon " + (ok ? "prise" : "rate");
  var m = $("msgpeche"); if(m) m.textContent = msg;
  if(ok && typeof son === "function") son("moulinet");
  setTimeout(function(){ if($("modal").style.display === "flex" && G.exp && G.exp.peche) openPeche(); }, 950);
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act");
  if(a === "ferrer"){
    if(phasePeche === "attente") finLancer(false, "Trop tôt ! Le poisson a eu peur.");
    else if(phasePeche === "touche") finLancer(true, "Ferré ! Un beau poisson. 🐟");
  }
  else if(a === "pechefin"){ clearTimeout(minPeche); phasePeche = null; msgPeche = ""; apresEtape(finExpedition()); }
});

/* ---------- Le feu de cheminée (salon ou chambre) ---------- */
function openFeu(){
  var br = possede(function(o){ return o.allume; }), pl = compter("planche"), on = !!G.feu, v = vivants().length;
  var couv = compter("couverture"), couverts = Math.min(v, couv * BAL.feu.couvrePar);
  var h = '<div class="rt"><span class="em" style="font-size:52px">🔥</span><span class="eqt"><h2>Le feu de cheminée</h2><p class="sub">' + (on ? "Allumé" : "Éteint") + '</p></span></div>';
  h += on ? '<p>Il réchauffe toute la famille la nuit : <b>+' + BAL.feu.repos + ' ⚡</b> de repos et <b>moral +' + BAL.feu.moral + '</b>. Il brûle <b>' + nommer("planche", BAL.feu.planches) + '</b> chaque nuit.</p>'
    : '<p>Sans feu, seules les couvertures tiennent chaud : <b>' + couv + ' couverture' + (couv > 1 ? "s" : "") + '</b> pour ' + couverts + ' personne' + (couverts > 1 ? "s" : "") + ' sur ' + v + '.' + (couverts < v ? ' <span class="moins">Les autres auront froid (' + BAL.reposFroid + ' ⚡ au lieu de ' + BAL.reposNuit + ', −' + BAL.degatsFroid + ' PV).</span>' : '') + '</p>';
  h += '<p class="sub">' + ic("planche", "🪵") + ' ' + pl + ' planche' + (pl > 1 ? "s" : "") + ' au refuge' + (on ? ' : de quoi tenir ' + Math.floor(pl / BAL.feu.planches) + ' nuit' + (pl / BAL.feu.planches >= 2 ? "s" : "") : '') + ' · elles servent aussi à construire et à fabriquer.</p>';
  if(on) h += '<button class="btn alt" style="width:100%;margin-bottom:8px" data-act="feu">Éteindre le feu (garder les planches)</button>';
  else h += '<button class="btn" style="width:100%;margin-bottom:8px" data-act="feu"' + (br && pl >= BAL.feu.planches ? "" : " disabled") + '>' + (!br ? "❌ Il faut un briquet pour l’allumer" : pl < BAL.feu.planches ? "❌ Plus de planches à brûler" : "🔥 Allumer le feu") + '</button>';
  show(h + BTN_FERMER());
}

/* ---------- Fermer une fenêtre en la faisant glisser vers le bas (comme sur mobile) ----------
   Seulement les fenêtres qui ont un bouton Fermer / Annuler (pas les combats, événements…),
   et seulement quand la fenêtre est tout en haut de son défilement. */
var tireFeuille = null;
function debutTire(x, y, cible){
  var sh = $("sheet");
  if($("modal").style.display !== "flex" || !cible.closest("#sheet") || sh.scrollTop > 0) return;
  if(cible.closest("input, select, textarea, .part, .serrure, .etangjeu")) return;
  if(!sh.querySelector('[data-act="close"]')) return;
  tireFeuille = { x:x, y:y, dy:0 };
}
function suiteTire(x, y){
  if(!tireFeuille) return;
  var dy = y - tireFeuille.y, dx = x - tireFeuille.x, sh = $("sheet");
  if(dy < 0 || Math.abs(dx) > Math.abs(dy) * 1.5){ sh.style.transform = ""; tireFeuille.dy = 0; return; }
  tireFeuille.dy = dy; sh.style.transition = "none"; sh.style.transform = "translateY(" + dy + "px)";
}
function finTire(){
  if(!tireFeuille) return;
  var dy = tireFeuille.dy, sh = $("sheet"); tireFeuille = null;
  sh.style.transition = "transform .2s"; sh.style.transform = "";
  if(dy > 90){ finGlisse = Date.now(); fermer(); }
}
document.addEventListener("touchstart", function(e){ var t = e.touches[0]; if(e.touches.length === 1) debutTire(t.clientX, t.clientY, e.target); }, { passive:true });
document.addEventListener("touchmove", function(e){ var t = e.touches[0]; suiteTire(t.clientX, t.clientY); }, { passive:true });
document.addEventListener("touchend", finTire);
document.addEventListener("touchcancel", function(){ if(tireFeuille){ $("sheet").style.transform = ""; tireFeuille = null; } });
// À la souris (PC) aussi
document.addEventListener("pointerdown", function(e){ if(e.pointerType === "mouse") debutTire(e.clientX, e.clientY, e.target); });
document.addEventListener("pointermove", function(e){ if(e.pointerType === "mouse") suiteTire(e.clientX, e.clientY); });
document.addEventListener("pointerup", function(e){ if(e.pointerType === "mouse") finTire(); });

/* ---------- Objets de confort posés dans les pièces : ce qu'ils apportent ---------- */
var TEXTES_OBJETS_PIECE = {
  peluche: ["La peluche d’Emma. Elle la serre fort chaque soir : tout le monde dort un peu mieux en la voyant.",
            "La peluche d’Emma. On l’a gardée près du lit, en souvenir d’elle : elle donne du courage à tout le monde."],
  photo: "La photo de famille d’avant. Elle rappelle pour qui on se bat.",
  cartes: "Un vieux jeu de cartes. Une partie le soir, et on oublie un moment les grattements dehors.",
  radio: "La radio grésille. Elle capte parfois des messages : on sait mieux où sont les dangers."
};
function openObjetPiece(id){
  var o = OBJETS[id], n = compter(id), m = (o.moral || 0) * BAL.moralBonusObjet * n;
  var h = '<div class="rt"><span class="em" style="font-size:52px">' + icone(id) + '</span><span class="eqt"><h2>' + o.nom + '</h2><p class="sub">' + (n > 1 ? n + " au refuge" : "Au refuge") + '</p></span></div>';
  h += '<p>' + perso(TEXTES_OBJETS_PIECE[id] || o.desc) + '</p><ul>';
  if(m) h += '<li>😀 <b>Moral +' + m + '</b> chaque nuit, tant qu’' + (o.g === "f" ? "elle" : "il") + ' est au refuge (le moral baisse de ' + BAL.moralPerteNuit + ' par nuit sinon).</li><li>À ' + BAL.moralHaut + ' de moral ou plus, l’équipe trouve 1 objet de plus en fouille ; sous ' + BAL.moralBas + ', elle fouille mal.</li>';
  if(o.radio) h += '<li>📻 Montre le danger de chaque lieu dans la liste « Où envoyer l’équipe ? ».</li><li>🗺️ Fait découvrir les lieux secrets ' + BAL.avanceRadio + ' jours plus tôt, et capte parfois des messages le matin.</li>';
  h += '</ul>';
  show(h + BTN_FERMER());
}

// Sur PC : les flèches du clavier ← → changent aussi de pièce (quand aucune fenêtre ne demande de saisie)
document.addEventListener("keydown", function(e){
  if(!G || G.ph !== "game" || !document.body.classList.contains("pc")) return;
  if(/INPUT|TEXTAREA/.test((e.target || {}).tagName || "") || document.querySelector("#sheet.large")) return;
  if(e.key === "ArrowLeft") allerPiece(pieceIdx - 1); else if(e.key === "ArrowRight") allerPiece(pieceIdx + 1);
});

// Le foyer de la grande salle du bastion : entretenu par le clan, il brûle toujours (ce n'est pas le feu de la maison)
function openFoyerClan(){
  show('<h2>🔥 Le foyer du bastion</h2><p>Le clan l’entretient jour et nuit : il ne s’éteint jamais. C’est ici que les familles se retrouvent pour les veillées et pour préparer les guerres.</p>'
    + '<p class="sub">Il ne chauffe pas ta maison : ton propre feu s’allume dans la cheminée du salon ou de la chambre (' + (G.feu ? "il est allumé" : "il est éteint") + ').</p>'
    + '<div class="row"><button class="btn alt" data-act="versSalon">🏠 Aller au salon</button><button class="btn" data-act="close">Fermer</button></div>');
}

/* ---------- Tombes des disparus (2026-11-11, idée validée par Fabien) ----------
   Une stèle par membre mort au pied de la palissade de la cour (les 3 premiers), la fenêtre les liste tous.
   Se recueillir : une fois par jour, un peu de moral (BAL.tombes). */
var msgTombes = "";
function steleSrc(k){
  var d = G.dd && G.dd[k], nom = d ? String(d.n).slice(0, 7).replace(/[<>&"]/g, "") : "";
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 86">'
    + '<path d="M7 82 V30 Q7 5 27 5 Q47 5 47 30 V82 Z" fill="#a19d93" stroke="#3b2a1e" stroke-width="3"/>'
    + '<path d="M12 80 V31 Q12 11 27 11" fill="none" stroke="#c4c0b6" stroke-width="3" stroke-linecap="round" opacity=".7"/>'
    + '<path d="M27 17 V39 M19 25 H35" stroke="#5d584f" stroke-width="4" stroke-linecap="round"/>'
    + '<text x="27" y="56" text-anchor="middle" font-family="Georgia,serif" font-size="9" font-weight="bold" fill="#3f3a33">' + nom + '</text>'
    + '<path d="M2 84 Q10 74 18 81 Q27 72 36 81 Q44 74 52 84 Z" fill="#6f8f3a" stroke="#3b2a1e" stroke-width="2"/>'
    + '</svg>';
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function openTombes(){
  var dd = G.dd || [];
  var h = '<h2>🕯️ Les tombes</h2><p class="sub">Au fond de la cour, contre la palissade, la famille a enterré ses disparus.</p>';
  if(msgTombes){ h += '<p class="msg g2">' + msgTombes + '</p>'; msgTombes = ""; }
  if(G.lettre) h += '<p class="titre-butin">📜 La lettre de la famille d’avant</p>' + htmlLettre(G.lettre);
  h += dd.length ? '<div class="tombes">' + dd.map(function(d){
    var x = { nom:d.n, r:d.r, icone:d.ic || "🙂", al:false, hp:0, en:0, faim:0, soif:0 };
    return '<div class="tombe">' + iconeMembre(x) + '<span class="cl-info"><b>' + echapper(d.n) + '</b><small>' + echapper(d.c || "disparu") + '</small><small>Jour ' + d.j + '</small></span></div>';
  }).join("") + '</div>' : '<p>Personne n’est mort. Pourvu que ça dure.</p>';
  if(dd.length) h += '<button class="btn" style="width:100%;margin-top:8px" data-act="recueillir"' + (peutRecueillir() ? "" : " disabled") + '>'
    + (peutRecueillir() ? "🕯️ Se recueillir (+" + BAL.tombes.moral + " moral)" : "🕯️ Déjà fait aujourd’hui") + '</button>';
  show(h + BTN_FERMER());
}

/* ---------- Météo des saisons (2026-11-11, idée de Fabien) ----------
   Neige l'hiver, pluie l'automne, seulement par-dessus les images d'extérieur : la cour, la cour du bastion,
   les lieux (expéditions, combats dehors) ; jamais dans la maison ni dans l'immeuble du raid. Tout en CSS (.meteo). */
var PIECES_DEHORS = { cour:1, bastionCour:1 };
function placerMeteo(){
  var m = $("meteo"); if(!m){ m = document.createElement("div"); m.id = "meteo"; m.className = "meteo"; document.body.appendChild(m); }
  var cont = $("piece"), type = G && G.ph === "game" && G.day ? saison().meteo : null;
  var dehors = !!sceneLieu() ? !(G.exp && G.exp.raid) : !!PIECES_DEHORS[PIECES[pieceIdx] && PIECES[pieceIdx].id];
  document.body.classList.toggle("meteo-neige", type === "neige" && !!G.exp && !G.exp.raid);
  document.body.classList.toggle("meteo-pluie", type === "pluie" && !!G.exp && !G.exp.raid);
  if(!type || !dehors || !cont || cont.style.display === "none"){ m.style.display = "none"; return; }
  m.className = "meteo " + type; m.style.display = "block";
  m.style.top = cont.style.top; m.style.height = cont.style.height; m.style.left = cont.style.left; m.style.right = cont.style.right;
}
