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
  ["oTrophees",  172, 296, 232, 356, function(){ return "🏆"; }, "Trophées", .2, function(){ return G.trophees && G.trophees.length > 0; }],
  ["oPhoto",     247, 312, 285, 356, function(){ return icone("photo"); }, "Photo", .5, function(){ return compter("photo") > 0; }],
  ["chapitre",   358, 648, 668, 781, function(){ return "📜"; }, "Histoire", .55], // le livre ouvert sur la table basse : le chapitre et le récit (l'atelier a sa propre pièce)
  ["oCartes",    366, 676, 406, 704, function(){ return icone("cartes"); }, "Cartes", .5, function(){ return compter("cartes") > 0; }],
  ["chien",      668, 548, 858, 704, function(){ return ic("chien", "🐕"); }, "Rex", .95, function(){ return !!chien(); }]
];
// Éléments posés sur la pièce selon la partie (images Gemini détourées, 2026-11-09), mêmes coordonnées que les zones
// [image, x0, y0, x1, y1, condition]
var DECOR_PIECE = [
  ["images/icones/trophee.webp", 176, 300, 228, 356, function(){ return G.trophees && G.trophees.length > 0; }], // trophée d'un zombie célèbre abattu, sur la cheminée
  ["images/rex.webp",      668, 548, 858, 704, function(){ return !!chien(); }],                  // Rex adopté : couché devant le canapé
  // Objets de confort : visibles seulement si on les a (les images de pièce n'en montrent plus)
  ["images/objet-radio.webp",  771, 192, 823, 234, function(){ return compter("radio") > 0; }],
  ["images/objet-photo.webp",  247, 312, 285, 356, function(){ return compter("photo") > 0; }],
  ["images/objet-cartes.webp", 366, 676, 406, 704, function(){ return compter("cartes") > 0; }]
];
/* ---------- Les pièces de la maison, qu'on fait défiler (glisser du doigt, flèches ou points) ----------
   Chaque pièce : son image, sa taille, sa partie utile (cadre) et ses zones, en pixels de SON image. */
var PIECES = [
  // Salon et chambre : la cheminée montre le feu allumé ou éteint (G.feu)
  { id:"salon", nom:"Salon", img:"images/refuge-fond-sans-table.webp", l:1024, h:1050, cadre:CADRE_PIECE, zones:ZONES_PIECE, decor:DECOR_PIECE },
  // La cuisine (2026-11-09) : la cuisinière montre le feu le jour où on a cuisiné
  { id:"cuisine", nom:"Cuisine", img:"images/piece-cuisine.webp", l:1024, h:1050, cadre:{ x0:0, x1:1024, y0:150, y1:740 }, decor:[], zones:[
    ["pCuisiner",   20, 420, 290, 740, function(){ return "🍲"; }, "Cuisiner", .55],
    ["pRecettes",  290, 465, 745, 680, function(){ return "🔪"; }, "Recettes", .5],
    ["pGardeManger", 715, 225, 1022, 660, function(){ return ic("conserve", "🥫"); }, "Garde-manger", .3]
  ]},
  { id:"chambre", nom:"Chambre", img:"images/piece-chambre-propre.webp", l:1024, h:1050, cadre:{ x0:0, x1:1024, y0:150, y1:780 },
    decor:[ ["images/objet-peluche.webp", 405, 395, 476, 495, function(){ return compter("peluche") > 0 && !auLit("Léo"); }] ], zones:[
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
  // Le bastion du clan (2026-11-10, images Gemini) : ces 3 pièces n'apparaissent que si l'on fait partie d'un clan (si). L'été, la grande salle a la cheminée éteinte (2026-11-11). Panneau des opérations (Gemini, 2026-11-11) accroché au mur, au-dessus de la niche à bûches
  { id:"bastionSalle", nom:"Bastion · grande salle", img:function(){ return typeof estSaison === "function" && estSaison("ete") ? "images/piece-bastion-salle-ete.webp" : "images/piece-bastion-salle.webp"; }, l:1024, h:1050, cadre:{ x0:0, x1:1024, y0:150, y1:860 }, decor:[["images/panneau-ops.webp", 206, 162, 346, 301, function(){ return true; }]], si:function(){ return typeof dansUnClan === "function" && dansUnClan(); }, zones:[
    ["pChat",         0, 395, 235, 745, function(){ return "💬"; }, "Discuter", .5],
    ["pClan",       350, 220, 690, 460, function(){ return "🛡️"; }, "Mon clan", .5],
    ["pGuerre",     728, 225, 1010, 665, function(){ return "⚔️"; }, "La guerre", .4],
    ["pRivaux",     230, 515, 805, 920, function(){ return "🗺️"; }, "Clans rivaux", .35], // la carte sur la table : le classement des clans
    ["pOperations", 206, 162, 346, 301, function(){ return "🎯"; }, "Opérations", .5]   // le panneau d'affichage : les opérations du clan
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
  if(PIECES[pieceIdx] && PIECES[pieceIdx].id === "bastionSalle" && typeof marquerOpVue === "function") marquerOpVue(); /* être dans la grande salle = l'opération est vue */
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
    return '<button class="zone' + (invite ? " invite" : "") + '" data-act="' + z[0] + '" style="left:' + x + 'px;top:' + y + 'px;width:' + l + 'px;height:' + h + 'px" aria-label="' + z[6] + '"><span class="etiq" style="top:' + (z[7] * 100) + '%' + (z[0] === "chien" && G.m && !G.m.some(peutSortir) ? ';display:none' : '') + '">' + z[6] + '</span></button>'; // texte seul (retour de Fabien : les icônes à côté des étiquettes chargeaient l'image)
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
  // Raccord avec la DA (2026-11-11) : portrait encadré (doré + coche quand il part), prénom en Bangers, état en pastille,
  // barres de vie et d'énergie, cases d'équipement à droite ; compteur de l'équipe dans le titre, bouton qui nomme l'équipe
  var max = BAL.membresParExpedition, noms = G.sel.map(function(k){ return G.m[k].nom; });
  var h = '<h2>' + ic("loupe", "🔍") + ' Qui part fouiller ?</h2><div class="qp-tete"><span class="qp-n">Équipe ' + G.sel.length + ' / ' + max + '</span><small>Touche un survivant pour le choisir, une case pour l’équiper.</small></div>';
  G.m.forEach(function(x, i){
    if(!x.al) return;
    var ok = peutSortir(x), on = G.sel.indexOf(i) >= 0, fem = estFeminin(x);
    var st = x.raid ? ["", "🏢 Au bastion"] : on ? ["ok", "✔ Part"] : !ok ? ["ko", "😴 Épuisé" + (fem ? "e" : "")] : fatigue(x) ? ["moy", "🥱 Fatigué" + (fem ? "e" : "")] : ["", "Disponible"];
    h += '<div class="qprow' + (on ? " choisi" : "") + (ok ? "" : " hors") + '"><button class="qpqui" data-act="qpsel" data-id="' + i + '"' + (ok ? "" : " disabled") + '><span class="qp-por">' + iconeMembre(x) + (on ? '<i class="qp-coche">✔</i>' : '') + '</span>'
      + '<span class="qp-t"><b>' + x.nom + '</b><span class="qp-st ' + st[0] + '">' + st[1] + '</span>'
      + '<span class="qp-barres">' + barre("❤️", x.hp) + barre("⚡", x.en) + '</span></span></button>'
      + '<div class="qpeq">' + EMPLACEMENTS.map(function(e){
          var o = x.eq[e[0]], dispo = !o && pourEmplacement(e[0]).length > 0;
          return '<button class="slot' + (o ? " f" : "") + (dispo ? " dispo" : "") + classeUsure(o) + '" data-act="slot" data-retour="quipart" data-id="' + i + ':' + e[0] + '" aria-label="' + e[2] + ' de ' + x.nom + ' : ' + (o ? OBJETS[o.id].nom : "vide") + '">' + (o ? icone(o.id) : '<span class="vide">' + e[1] + '</span>') + '</button>';
        }).join("") + '</div></div>';
  });
  h += offrePub("quipart") + '<div class="row"><button class="btn btn-jeu" data-act="fouille"' + (G.sel.length ? "" : " disabled") + '>🗺️ ' + (G.sel.length ? "Choisir le lieu" : "Choisis d’abord") + (noms.length ? '<small class="qp-noms">' + noms.join(" + ") + '</small>' : '') + '</button><button class="btn alt" data-act="close">Annuler</button></div>';
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
  // Raccord avec la DA (2026-11-11) : 4 tuiles (énergie, eau, repas, risque), puis seulement les lignes utiles
  var rep = G.feu ? BAL.reposNuit + BAL.feu.repos : BAL.reposNuit, d = defenseNuit();
  var h = tuiles([["énergie", "+" + rep, froids ? "moy" : "ok"], ["eau · reste " + re, "−" + Math.min(be, re), re >= be ? "" : "ko"], ["repas · reste " + rn, "−" + Math.min(bn, rn), rn >= bn ? "" : "ko"], ["risque d’attaque", ch + " %", d >= f + 2 ? "ok" : d >= f ? "moy" : "ko"]]).replace('class="tuiles"', 'class="tuiles t4"');
  var L = [];
  if(froids) L.push(["b2", "🥶 " + froids + (froids > 1 ? " auront" : " aura") + " froid sans feu ni couverture : +" + BAL.reposFroid + " ⚡ seulement, −" + BAL.degatsFroid + " PV."]);
  if(re < v) L.push(["b2", ic("bouteille", "💧") + " Pas assez d’eau pour tout le monde !"]);
  if(rn < v) L.push(["b2", ic("conserve", "🥫") + " Pas assez à manger pour tout le monde !"]);
  if(G.feu) L.push(["g2", "🔥 Le feu brûle toute la nuit" + (G.braises > 0 ? " (la planche d’hier suffit)." : " (1 planche pour 2 nuits).")]);
  if(chien()) L.push(["", ic("chien", "🐕") + " " + chien().nom + " mange 1 ration et monte la garde."]);
  if(compter("poule")) L.push(["", ic("poule", "🐔") + " Les poules boivent " + Math.ceil(compter("poule") / BAL.poules.eauPour) + " ration" + (Math.ceil(compter("poule") / BAL.poules.eauPour) > 1 ? "s" : "") + " d’eau et pondent peut-être."]);
  L.push([d >= f + 2 ? "g2" : d >= f ? "" : "b2", "🧟 Si les zombies viennent : force " + f + " à " + (f + 2) + ", votre défense " + d + (d >= f + 2 ? " : vous tiendrez." : d >= f ? " : ce sera juste." : " : la barricade risque de céder.")]);
  if(sacrificePossible()) L.push(["b2", "💀 Quelqu’un va mourir de faim, et il n’y a plus rien. Il reste une solution, la pire de toutes…"]);
  show('<h2>' + ic("lune", "🌙") + ' Aller dormir ?</h2>' + h + '<p class="titre-butin">🌙 Cette nuit</p>' + puces(L)
    + (sacrificePossible() ? '<button class="loc sombre" data-act="sacrifice"><b>🕯️ Le choix impossible</b><small>Sacrifier l’un des vôtres pour que les autres survivent</small></button>' : '')
    + '<div class="row"><button class="btn btn-jeu" data-act="endday">🌙 Dormir</button><button class="btn alt" data-act="close">Pas encore</button></div>' + offrePub("dormir"));
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
  else if(a === "oTrophees") openTrophees();
  else if(a === "pFenetre") openElement("barr");
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
  else if(a === "pRivaux"){ if(typeof openClassementClans === "function") openClassementClans(); }
  else if(a === "pOperations"){ if(typeof ouvrirOperation === "function") ouvrirOperation(null); }
  else if(a === "pClassClans"){ if(typeof openClassementClans === "function") openClassementClans(); }
  else if(a === "pGuerre"){ if(typeof openGuerre === "function") openGuerre(); }
  else if(a === "pReserve"){ if(typeof openBastion === "function") openBastion("reserve"); }
  else if(a === "pJournal"){ if(typeof openBastion === "function") openBastion("journal"); }
  else if(a === "pDefenses"){ if(typeof openBastion === "function") openBastion("defenses"); }
  else if(a === "piecePrec") allerPiece(pieceIdx - 1);
  else if(a === "pieceSuiv") allerPiece(pieceIdx + 1);
  else if(a === "pieceVa") allerPiece(+b.getAttribute("data-id"));
  else if(a === "pEtagere"){ guideOnglet = "regles"; guideVue = null; openGuide(); }
  else if(a === "pPortraits"){ guideOnglet = "famille"; guideVue = null; openGuide(); }
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
    return '<div class="tombe">' + iconeMembre(x) + '<span class="cl-info"><b>' + echapper(d.n) + '</b><small>' + echapper(causeMort(d.r || d.n, d.c)) + '</small><small>Jour ' + d.j + '</small></span></div>';
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

/* ---------- Trophées des zombies célèbres (sur la cheminée du salon) ---------- */
function openTrophees(){
  var T = G.trophees || [], c = celebre();
  var h = '<h2>🏆 Les trophées</h2><p class="sub">Sur la cheminée, les souvenirs des zombies célèbres que la famille a abattus.</p>';
  h += T.length ? '<div class="tombes">' + T.map(function(t){ var Z = ZOMBIES.find(function(z){ return z.id === t.id; }) || { id:t.id };
    return '<div class="tombe">' + iconeZombie(Z) + '<span class="cl-info"><b>' + t.nom + '</b><small>Abattu' + (t.id === "mariee" ? "e" : "") + ' par ' + t.par + '</small><small>Jour ' + t.jour + '</small></span></div>'; }).join("") + '</div>' : '<p>Aucun trophée pour l’instant.</p>';
  if(c){ var Z2 = ZOMBIES.find(function(z){ return z.id === c.id; }); h += '<p class="titre-butin">💀 Encore en liberté</p><p>' + Z2.nom + ' (' + c.pv + ' / ' + c.pvMax + ' PV) rôde en ville' + (possede(function(o){ return o.radio; }) ? ", près " + de(leLieu(LIEUX[c.lieu].nom)).replace(/^de le /, "du ").replace(/^de les /, "des ") + "." : ". Une radio dirait où.") + '</p>'; }
  show(h + BTN_FERMER());
}

/* ---------- Accès rapide aux pièces (2026-11-11, idée de Fabien) ----------
   Bouton maison à droite de « Dormir » : une vignette par pièce visible (découpée dans sa propre image),
   la pièce actuelle encadrée, une pastille quand il s'y passe quelque chose. Un toucher = on y va. */
function imagePiece(P){ return typeof P.img === "function" ? P.img() : P.img; }
function pastillePiece(P){
  if(P.id === "chambre" && G.m && !G.m.some(peutSortir)) return "Dormir";
  if(P.id === "bastionSalle" && typeof opNouveau === "function" && opNouveau()) return "Opération";
  return "";
}
function alertePieces(){ return PIECES.some(function(P, k){ return k !== pieceIdx && pieceVisible(k) && pastillePiece(P); }); }
function openPieces(){
  var h = '<h2>' + ic("maisonPavillon", "🏠") + ' Les pièces</h2><div class="pz-grille">';
  PIECES.forEach(function(P, k){
    if(!pieceVisible(k)) return;
    var F = P.cadre, cx = ((F.x0 + F.x1) / 2) / P.l * 100, cy = ((F.y0 + F.y1) / 2) / P.h * 100, pa = pastillePiece(P);
    h += '<button class="pz-v' + (k === pieceIdx ? " ici" : "") + '" data-act="pieceVa2" data-id="' + k + '">'
      + '<span class="pz-img" style="background-image:url(\'' + imagePiece(P) + '\');background-position:' + cx.toFixed(1) + '% ' + cy.toFixed(1) + '%"></span>'
      + (pa ? '<span class="pz-pastille">' + pa + '</span>' : '')
      + '<span class="pz-nom">' + P.nom.replace(/^Bastion · /, "Bastion : ") + (k === pieceIdx ? ' <small>(ici)</small>' : '') + '</span></button>';
  });
  show(h + '</div>' + BTN_FERMER());
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act");
  if(a === "pieces"){ openPieces(); }
  else if(a === "pieceVa2"){ var k = +b.getAttribute("data-id"); hide(); if(k !== pieceIdx) allerPiece(k); }
});

/* ---------- Barricades aux fenêtres (2026-11-11, idée de Fabien ; retouches Gemini découpées par Claude) ----------
   Les planches ne vont plus sur la porte (on ne les enlève pas à chaque sortie) : chaque fenêtre change avec le
   niveau de barricade (1, 2, 3). La cuisine et la chambre étaient déjà barricadées sur l'image d'origine : leur
   niveau 0 est une vitre propre. Toucher une fenêtre ouvre la fiche de la barricade. Images : images/barricades/. */
var BARRICADES = { salon:[[0, 158, 198, 612]], cuisine:[[348, 172, 682, 462]], chambre:[[0, 172, 178, 452]],
  reserve:[[640, 55, 842, 232], [858, 55, 1024, 312]], atelier:[[8, 172, 178, 432]] };
var BARRICADE_NIV0 = { cuisine:1, chambre:1 };
// zone touchable de chaque fenêtre (plus petite que la découpe, pour ne pas gêner les autres zones)
var FENETRES = { salon:[0, 185, 110, 420], cuisine:[370, 200, 650, 440], chambre:[0, 185, 150, 435], reserve:[650, 120, 1010, 300], atelier:[25, 190, 160, 335] };
function niveauBarr(){ return Math.min(3, (G && G.ref && G.ref.barr) || 0); }
(function(){
  Object.keys(BARRICADES).forEach(function(id){
    var P = PIECES.find(function(p){ return p.id === id; }); if(!P) return;
    var liste = id === "salon" ? DECOR_PIECE : (P.decor = P.decor || []), plus = [];
    for(var niv = BARRICADE_NIV0[id] ? 0 : 1; niv <= 3; niv++) BARRICADES[id].forEach(function(r, k){
      var n = niv; plus.push(["images/barricades/" + id + "-" + n + (BARRICADES[id].length > 1 ? "-" + (k + 1) : "") + ".webp", r[0], r[1], r[2], r[3], function(){ return niveauBarr() === n; }]);
    });
    Array.prototype.unshift.apply(liste, plus); // sous les autres décors (trophée, objets de confort)
    var f = FENETRES[id];
    (id === "salon" ? ZONES_PIECE : P.zones).unshift(["pFenetre", f[0], f[1], f[2], f[3], function(){ return ic("ref_barr", "🧱"); }, "Barricade", .5]);
  });
})();

/* ---------- Le feu en morceau collé (2026-11-11) ----------
   Chaque pièce n'a plus qu'une image de base (feu éteint) ; quand le feu brûle (G.feu, ou la cuisinière le jour où
   l'on a cuisiné), on pose par-dessus la cheminée allumée et sa lueur, découpées dans l'ancienne image « allumée ».
   Prépare les personnages dans les pièces : chaque variante est un petit morceau, elles se combinent toutes seules. */
var FEUX_PIECE = {
  salon:   { img:"images/feux/salon.webp",   z:[192, 312, 312, 540], si:function(){ return !!G.feu; } },
  chambre: { img:"images/feux/chambre.webp", z:[138, 318, 346, 584], si:function(){ return !!G.feu; } },
  cuisine: { img:"images/feux/cuisine.webp", z:[108, 276, 440, 836], si:function(){ return G.cuisineJour === G.day; } }
};
(function(){
  Object.keys(FEUX_PIECE).forEach(function(id){
    var P = PIECES.find(function(p){ return p.id === id; }); if(!P) return;
    var F = FEUX_PIECE[id], liste = id === "salon" ? DECOR_PIECE : (P.decor = P.decor || []);
    // juste après les fenêtres (le feu de la chambre déborde un peu sur le coin de la fenêtre), sous les autres décors
    var apres = 0; liste.forEach(function(d, k){ if(typeof d[0] === "string" && d[0].indexOf("images/barricades/") === 0) apres = k + 1; });
    liste.splice(apres, 0, [F.img, F.z[0], F.z[1], F.z[2], F.z[3], F.si]);
  });
})();

/* ---------- La famille dans la chambre (2026-11-11, idée de Fabien ; premier essai) ----------
   Un membre trop fatigué pour sortir se repose dans SON lit (Papa : matelas de gauche, Maman : de droite,
   Léo : lit du bas, Emma : lit du haut). Chaque lit occupé est un morceau découpé dans une retouche Gemini de la
   chambre, posé au-dessus du feu et des fenêtres ; ils se combinent. Les recrues n'ont pas encore leur image. */
// Recrues (2026-11-12, image Gemini) : Sam lit du haut, Nora lit du bas, Yanis matelas de gauche, Inès matelas de droite.
// Un lit appartient d'abord au membre de la famille d'origine ; une recrue n'y dort que si ce membre n'est plus là.
var LITS_CHAMBRE = { haut:[330, 250, 722, 352, "emma"], bas:[338, 432, 722, 562, "leo"], gauche:[98, 495, 452, 790, "papa"], droite:[628, 495, 992, 790, "maman"] }; // ordre de pose : du fond vers le devant
var LIT_DE = { "Emma":"haut", "Léo":"bas", "Papa":"gauche", "Maman":"droite", "Sam":"haut", "Nora":"bas", "Yanis":"gauche", "Inès":"droite" };
var DORMEUR_IMG = { "Emma":"emma", "Léo":"leo", "Papa":"papa", "Maman":"maman", "Sam":"sam", "Nora":"nora", "Yanis":"yanis", "Inès":"ines" };
var ZONE_DORMEUR = { "Sam":[330, 212, 722, 352] }; // Sam : un peu plus haut, sinon ses cheveux étaient coupés
var FAMILLE_ORIGINE = ["Papa", "Maman", "Léo", "Emma"];
function enSortie(x){ var i = G.m.indexOf(x); return !!(G.exp && G.exp.equipe && G.exp.equipe.indexOf(i) >= 0); }
function roleDormeur(y){ return y.r || y.nom; }
function auLit(r){ var x = G && G.m && G.m.find(function(y){ return roleDormeur(y) === r; }); return !!(x && x.al && !x.raid && !enSortie(x) && !peutSortir(x)); }
// Qui dort dans ce lit ? le propriétaire d'origine s'il est en vie ; sinon la recrue qui y a sa place
function dormeurLit(lit){
  if(!G || !G.m) return null;
  var pro = FAMILLE_ORIGINE.filter(function(r){ return LIT_DE[r] === lit; })[0];
  var proVivant = G.m.some(function(y){ return roleDormeur(y) === pro && y.al; });
  if(proVivant) return auLit(pro) ? pro : null;
  var rec = G.m.filter(function(y){ return y.al && LIT_DE[roleDormeur(y)] === lit && roleDormeur(y) !== pro; }).map(roleDormeur)[0];
  return rec && auLit(rec) ? rec : null;
}
(function(){
  var P = PIECES.find(function(p){ return p.id === "chambre"; }); if(!P) return;
  P.decor = P.decor || [];
  var apres = 0; P.decor.forEach(function(d, k){ if(typeof d[0] === "string" && (d[0].indexOf("images/barricades/") === 0 || d[0].indexOf("images/feux/") === 0)) apres = k + 1; });
  // lit vide (couverture pliée, drap bien à plat) ou lit occupé par la bonne personne
  var lits = [];
  Object.keys(LITS_CHAMBRE).forEach(function(lit){ var L = LITS_CHAMBRE[lit];
    lits.push(["images/personnages/chambre-vide-" + L[4] + ".webp", L[0], L[1], L[2], L[3], function(){ return !dormeurLit(lit); }]);
    Object.keys(LIT_DE).filter(function(r){ return LIT_DE[r] === lit; }).forEach(function(r){ var Z = ZONE_DORMEUR[r] || L;
      lits.push(["images/personnages/chambre-" + DORMEUR_IMG[r] + ".webp", Z[0], Z[1], Z[2], Z[3], function(){ return dormeurLit(lit) === r; }]); });
  });
  Array.prototype.splice.apply(P.decor, [apres, 0].concat(lits));
})();

/* ---------- La famille sur le canapé du salon (2026-11-12, image Gemini) ----------
   Un membre de la famille d'origine au refuge, ni épuisé (il serait au lit), ni choisi pour partir, s'assoit à SA place
   (de gauche à droite : Papa, Léo, Emma, Maman). Chaque place est découpée à la silhouette, sans toucher aux coussins. */
// Version 2 (2026-11-12) : deux images Gemini avec deux personnes espacées, silhouettes recalées chacune sur sa place ;
// ordre de pose Léo, Papa, Emma, Maman (Papa devant le bras de Léo), puis la table basse et ses objets reposés devant eux
// Salon sans table basse (2026-11-12, idée de Fabien) : la table est un décor reposé 95 px plus en avant et 5 % plus grande,
// par-dessus les personnes, pour que leurs pieds restent visibles. Papa dans le fauteuil (bottes visibles), Léo et Maman
// sur le canapé (image Gemini dessinée sur le salon sans table, sans décalage). Emma (3e place) : image ChatGPT
// (salon redessiné), découpée le long de son contour et mise à l'échelle (255 px de haut).
var PLACES_CANAPE = { "Papa":[120, 352, 362, 717, "fauteuil-papa"], "Léo":[366, 343, 488, 628, "canape-leo"], "Emma":[490, 375, 579, 630, "canape-emma"], "Maman":[578, 342, 705, 631, "canape-maman"],
  // Recrues (2026-11-12, image ChatGPT découpée au contour) : à la place du membre qu'elles remplacent, comme pour les lits
  "Yanis":[74, 372, 348, 732, "fauteuil-yanis"], "Nora":[386, 348, 469, 628, "canape-nora"],
  "Sam":[482, 360, 586, 630, "canape-sam"], "Inès":[599, 348, 684, 631, "canape-ines"] };
var TABLE_SALON = ["images/personnages/table-basse-avant.webp", 348, 606, 671, 786, function(){ return true; }];
// Le cuisinier du jour (2026-11-12, image ChatGPT) : le jour où l'on a cuisiné, Maman est aux fourneaux dans la cuisine
// (et donc pas sur le canapé). Les autres membres auront leur image plus tard (CUISINIERS).
var CUISINIERS = { "Maman":[149, 177, 410, 882, "cuisine-maman"] };
function cuisinierDuJour(){
  if(!G || !G.m || G.cuisineJour !== G.day) return null;
  for(var r in CUISINIERS) if(auSalon(r, true)) return r;
  return null;
}
(function(){
  var P = PIECES.find(function(p){ return p.id === "cuisine"; }); if(!P) return;
  P.decor = P.decor || [];
  Object.keys(CUISINIERS).forEach(function(r){ var L = CUISINIERS[r];
    P.decor.push(["images/personnages/" + L[4] + ".webp", L[0], L[1], L[2], L[3], function(){ return cuisinierDuJour() === r; }]); });
})();
function auSalon(r, sansCuisine){
  if(!G || !G.m) return false;
  if(!sansCuisine && cuisinierDuJour() === r) return false; // aux fourneaux
  var i = G.m.findIndex(function(y){ return roleDormeur(y) === r; }), x = G.m[i];
  if(FAMILLE_ORIGINE.indexOf(r) < 0){ // une recrue ne prend la place que si son propriétaire n'est plus là
    var pro = FAMILLE_ORIGINE.filter(function(f){ return LIT_DE[f] === LIT_DE[r]; })[0];
    if(G.m.some(function(y){ return roleDormeur(y) === pro && y.al; })) return false;
  }
  return !!(x && x.al && !x.raid && !enSortie(x) && peutSortir(x) && G.sel.indexOf(i) < 0);
}
(function(){
  var P = PIECES.find(function(p){ return p.id === "salon"; }); if(!P) return;
  P.decor = P.decor || [];
  var apres = 0; P.decor.forEach(function(d, k){ if(typeof d[0] === "string" && (d[0].indexOf("images/barricades/") === 0 || d[0].indexOf("images/feux/") === 0)) apres = k + 1; });
  var places = Object.keys(PLACES_CANAPE).map(function(r){ var L = PLACES_CANAPE[r];
    return ["images/personnages/" + L[4] + ".webp", L[0], L[1], L[2], L[3], function(){ return auSalon(r); }]; });
  
  Array.prototype.splice.apply(P.decor, [apres, 0].concat(places, [TABLE_SALON]));
})();

/* ---------- Mini-jeu du siphonnage (2026-11-11) ----------
   La jauge d'aspiration monte et descend dans le tuyau : il faut appuyer quand elle est dans la zone verte.
   Un seul essai : réussi = l'essence coule (volume au hasard), raté = ça gicle, les zombies arrivent. */
var siphonDebut = 0, siphonPeriode = 1300, siphonZone = null;
function openSiphon(){
  var S = G.siphon; if(!S){ hide(); return; }
  var k = kitSiphon();
  var h = '<div class="banniere"><img src="images/siphon.webp" alt=""></div><h2>🚗 Une voiture abandonnée</h2>'
    + '<p>Sur le chemin du retour, une vieille voiture est garée de travers, portières ouvertes. Le bouchon du réservoir est encore là… il reste peut-être de l’essence.</p>'
    + (k ? '<p class="sub">' + icone("siphon") + ' Kit de siphonnage : encore ' + k.sol + ' utilisation' + (k.sol > 1 ? "s" : "") + '. Il faut aspirer au bon moment : trop tôt ou trop tard, ça gicle et le bruit attire les zombies.</p>' : '')
    + '<div class="row"><button class="btn" data-act="siphonGo">' + icone("siphon") + ' Siphonner</button><button class="btn alt" data-act="siphonNon">Continuer la route</button></div>';
  show(h);
  if(typeof poserDansScene === "function" && document.body.classList.contains("pc") && G.siphon.apres) poserDansScene("images/siphon.webp");
}
function jeuSiphon(){
  var w = BAL.siphon.fenetre, z0 = 0.18 + Math.random() * (0.64 - w); siphonZone = [z0, z0 + w];
  siphonPeriode = 1100 + Math.random() * 500; siphonDebut = performance.now();
  show('<div class="banniere"><img src="images/siphon.webp" alt=""></div><h2>⛽ Siphonnage</h2><p class="sub">Appuie sur « Aspirer » quand le niveau est dans la zone verte.</p>'
    + '<div class="siph"><div class="siph-tube"><span class="siph-zone" style="left:' + (z0 * 100) + '%;width:' + (w * 100) + '%"></span><span class="siph-niv" id="siphNiv"></span></div></div>'
    + '<button class="btn" style="width:100%" data-act="siphonAspire">💨 Aspirer !</button>');
  if(typeof poserDansScene === "function" && document.body.classList.contains("pc")) poserDansScene("images/siphon.webp"); // la scène de la voiture reste derrière (image ChatGPT, 2026-11-12)
  (function anime(){ var n = $("siphNiv"); if(!n) return; n.style.left = (positionSiphon() * 100) + "%"; requestAnimationFrame(anime); })();
}
function positionSiphon(){ var t = ((performance.now() - siphonDebut) % siphonPeriode) / siphonPeriode; return t < 0.5 ? t * 2 : 2 - t * 2; } // va-et-vient
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act");
  if(a === "siphonGo") jeuSiphon();
  else if(a === "siphonNon"){ var r = finirSiphon(null); render(); if(r){ openResultat(r); finiSiMorts(); } }
  else if(a === "siphonAspire"){
    var p = positionSiphon(), ok = siphonZone && p >= siphonZone[0] && p <= siphonZone[1];
    if(typeof son === "function") son(ok ? "soin" : "rate");
    if(!ok && typeof vibrer === "function") vibrer(120);
    var r2 = finirSiphon(ok); render(); if(r2){ openResultat(r2); finiSiMorts(); }
  }
});
