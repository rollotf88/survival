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
  ["pCheminee",  155, 355, 320, 530, function(){ return ic("ref_barr", "🧱"); }, "Refuge", .5],
  ["pEtagere",   714, 165, 835, 550, function(){ return "📖"; }, "Guide", .12],
  ["pPorte",     900, 205, 1022, 545, function(){ return ic("loupe", "🔍"); }, "Partir", .85],
  ["pTable",     365, 570, 660, 678, function(){ return ic("marteau", "🛠️"); }, "Atelier", .55],
  ["chien",      668, 548, 858, 704, function(){ return ic("chien", "🐕"); }, "Rex", .5, function(){ return !!chien(); }]
];
// Éléments posés sur la pièce selon la partie (images Gemini détourées, 2026-11-09), mêmes coordonnées que les zones
// [image, x0, y0, x1, y1, condition]
var DECOR_PIECE = [
  ["images/planches.webp", 904, 262, 1022, 454, function(){ return G.ref && G.ref.barr >= 1; }], // barricade construite : planches sur la porte
  ["images/rex.webp",      668, 548, 858, 704, function(){ return !!chien(); }]                   // Rex adopté : couché devant le canapé
];
/* ---------- Les pièces de la maison, qu'on fait défiler (glisser du doigt, flèches ou points) ----------
   Chaque pièce : son image, sa taille, sa partie utile (cadre) et ses zones, en pixels de SON image. */
var PIECES = [
  { id:"salon", nom:"Salon", img:"images/refuge-fond.webp", l:1024, h:1050, cadre:CADRE_PIECE, zones:ZONES_PIECE, decor:DECOR_PIECE },
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
  { id:"cour", nom:"Cour", img:"images/piece-cour.webp", l:1024, h:1050, cadre:{ x0:0, x1:1024, y0:120, y1:800 }, decor:[], zones:[
    ["pConstruire",   0, 410, 410, 915, function(){ return ic("ref_pot", "🥕"); }, "Potager", .4],
    ["pConstruire", 430, 440, 600, 665, function(){ return ic("ref_eau", "🪣"); }, "Récupérateur", .35],
    ["stock",       790, 400, 1024, 780, function(){ return ic("poule", "🐔"); }, "Poules", .3]
  ]}
];
var pieceIdx = 0;
function allerPiece(k){
  pieceIdx = (k + PIECES.length) % PIECES.length;
  dernierJourEtiquettes = null; // on montre les étiquettes de la nouvelle pièce
  if(typeof son === "function") son("pas");
  placerPiece();
}
function placerDecor(dx, dy, s){
  var d = $("decor"); if(!d){ d = document.createElement("div"); d.id = "decor"; document.body.appendChild(d); }
  if(s === null){ d.innerHTML = ""; return; }
  d.innerHTML = PIECES[pieceIdx].decor.filter(function(e){ return e[5](); }).map(function(e){
    return '<img src="' + e[0] + '" alt="" style="left:' + (dx + e[1] * s) + 'px;top:' + (dy + e[2] * s) + 'px;width:' + ((e[3] - e[1]) * s) + 'px;height:' + ((e[4] - e[2]) * s) + 'px">';
  }).join("");
}

function placerPiece(){
  var cont = $("piece");
  if(!cont){ cont = document.createElement("div"); cont.id = "piece"; document.body.appendChild(cont); }
  var chap = document.querySelector(".scene"), bas = document.querySelector(".scene > .row") || document.querySelector(".scene .grid2");
  var corps = document.body.style;
  if(!G || G.ph !== "game" || !chap || !bas){ cont.innerHTML = ""; cont.style.display = "none"; corps.backgroundSize = corps.backgroundPosition = corps.backgroundImage = ""; if($("fondu")) $("fondu").style.display = "none"; placerDecor(0, 0, null); return; }
  var haut = chap.getBoundingClientRect().top + 2, fin = bas.getBoundingClientRect().top - 4;
  if(fin - haut < 40){ cont.innerHTML = ""; cont.style.display = "none"; corps.backgroundSize = corps.backgroundPosition = corps.backgroundImage = ""; if($("fondu")) $("fondu").style.display = "none"; placerDecor(0, 0, null); return; } // pas assez de place
  var vw = window.innerWidth, P = PIECES[pieceIdx], F = P.cadre;
  corps.backgroundImage = 'url("' + (typeof P.img === "function" ? P.img() : P.img) + '")';
  // Échelle : la partie utile tient en largeur ET en hauteur dans l'espace libre
  var s = Math.min(vw / (F.x1 - F.x0), (fin - haut) / (F.y1 - F.y0));
  var dx = (vw - (F.x1 - F.x0) * s) / 2 - F.x0 * s;
  // L'image est collée en haut de l'espace libre (le plafond remplit le haut), tant que la partie utile reste visible
  var dy = Math.max(haut - F.y0 * s, Math.min(haut, fin - F.y1 * s));
  corps.backgroundSize = (P.l * s) + "px auto";
  corps.backgroundPosition = dx + "px " + dy + "px";
  placerDecor(dx, dy, s);
  // Fondu sur le bas de l'image pour qu'elle se mêle au plancher (au lieu de s'arrêter net)
  var f = $("fondu"); if(!f){ f = document.createElement("div"); f.id = "fondu"; document.body.appendChild(f); }
  f.style.display = "block"; f.style.top = (dy + P.h * s - 88) + "px";
  cont.classList.toggle("compact", s < 0.32);
  cont.style.display = "block"; cont.style.top = haut + "px"; cont.style.height = (fin - haut) + "px";
  cont.innerHTML = P.zones.map(function(z){
    if(z[8] && !z[8]()) return "";
    var x = dx + z[1] * s, y = dy + z[2] * s - haut, l = (z[3] - z[1]) * s, h = (z[4] - z[2]) * s;
    var cy = y + h / 2;
    if(cy < 0 || cy > fin - haut || x + l < 0 || x > vw) return ""; // centre hors de la partie visible
    var invite = z[0] === "pCanape" && !G.m.some(peutSortir); // plus personne ne peut sortir : on invite à dormir
    return '<button class="zone' + (invite ? " invite" : "") + '" data-act="' + z[0] + '" style="left:' + x + 'px;top:' + y + 'px;width:' + l + 'px;height:' + h + 'px" aria-label="' + z[6] + '"><span class="etiq" style="top:' + (z[7] * 100) + '%">' + z[5]() + ' ' + z[6] + '</span></button>';
  }).join("")
    // Changer de pièce : flèches de chaque côté et points en haut (on peut aussi glisser le doigt)
    + '<div class="navpieces"><button class="navfl" data-act="piecePrec" aria-label="Pièce précédente">◀</button>'
    + PIECES.map(function(p, k){ return '<button class="navpt' + (k === pieceIdx ? " on" : "") + '" data-act="pieceVa" data-id="' + k + '" aria-label="' + p.nom + '"><span></span></button>'; }).join("")
    + '<button class="navfl" data-act="pieceSuiv" aria-label="Pièce suivante">▶</button><span class="navnom">' + P.nom + '</span></div>';
  ajusterEtiquettes(cont, vw);
  // Étiquettes visibles 3 secondes au début de chaque journée, puis elles s'effacent (image plus propre)
  if(dernierJourEtiquettes !== G.day){
    dernierJourEtiquettes = G.day; cont.classList.add("montrer");
    clearTimeout(minuteurEtiquettes); minuteurEtiquettes = setTimeout(function(){ var c = $("piece"); if(c) c.classList.remove("montrer"); }, 3000);
  }
}
var dernierJourEtiquettes = null, minuteurEtiquettes = null;
// Les étiquettes restent dans l'écran et ne se chevauchent pas (on décale vers le bas celle qui gêne)
function ajusterEtiquettes(cont, vw){
  var et = Array.prototype.slice.call(cont.querySelectorAll(".zone .etiq"));
  et.forEach(function(e){
    var r = e.getBoundingClientRect(), d = 0;
    if(r.left < 4) d = 4 - r.left; else if(r.right > vw - 4) d = vw - 4 - r.right;
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
window.addEventListener("resize", function(){ if(G && G.ph === "game") placerPiece(); });

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
          return '<button class="slot' + (o ? " f" : "") + (dispo ? " dispo" : "") + '" data-act="slot" data-retour="quipart" data-id="' + i + ':' + e[0] + '" aria-label="' + e[2] + ' de ' + x.nom + ' : ' + (o ? OBJETS[o.id].nom : "vide") + '">' + (o ? icone(o.id) : '<span class="vide">' + e[1] + '</span>') + '</button>';
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
  show('<h2>' + ic("lune", "🌙") + ' Aller dormir ?</h2><p>La journée se termine : chacun mange, boit et se repose. Des zombies peuvent attaquer pendant la nuit.</p><div class="row"><button class="btn" data-act="endday">Dormir</button><button class="btn alt" data-act="close">Pas encore</button></div>' + offrePub("dormir"));
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act");
  if(a === "pTable") openRef("fabriquer");
  else if(a === "pCheminee") openRef("construire");
  else if(a === "pSac") openStock();
  else if(a === "pReparer") openRef("reparer");
  else if(a === "pDemonter") openRef("demonter");
  else if(a === "pConstruire") openRef("construire");
  else if(a === "pVoiture") openRef("voiture");
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
  departGlisse = { x:e.clientX, y:e.clientY, t:Date.now() };
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
