/* =====================================================================
   AVANT-POSTE (2026-11-15, idée de Fabien) — tout est dans ce fichier, avantposte.css et images/avantposte/.
   À partir du jour 50, une nouvelle pièce « Avant-poste » : un terrain avec 15 emplacements où l'on construit des
   bâtiments (5 niveaux, compteurs en temps réel, un chantier à la fois, payés avec les matériaux du refuge).
   Ils produisent en temps réel (même hors du jeu) ce qu'on récupère pour le refuge ; l'avant-poste peut être attaqué
   toutes les 8 h. Il appartient au JOUEUR (localStorage survival_avantposte) : il survit à la mort de la famille.
   Pas encore : la carte et le mode pillard (ils demanderont le serveur).
   Pour le couper : AVANTPOSTE_ACTIF = false. Pour le retirer : supprimer ce fichier, avantposte.css, images/avantposte/
   et les lignes marquées « AVANT-POSTE » (index.html, sw.js, preparer-site.py).
   ===================================================================== */
var AVANTPOSTE_ACTIF = true;

var AP = {
  jour: 50,                                   // jour de partie où l'avant-poste se débloque
  durees: [10 * 60e3, 3600e3, 4 * 3600e3, 12 * 3600e3, 24 * 3600e3], // durée du chantier pour les niveaux 1 à 5
  mult: [1, 1.5, 2, 3, 4],                    // coût des niveaux 1 à 5 (× le coût de base)
  libres: 6,                                  // emplacements ouverts au départ ; +2 par niveau de palissade
  attaque: { toutes: 8 * 3600e3, chance: 0.3, base: 3, pertes: 0.35, maxRattrapage: 6 },
  pubs: 2,                                    // pubs pour accélérer un chantier, par jour réel
  echelle: 0.52,                              // taille des bâtiments sur le terrain
  // Emplacements (centre, en pixels de images/avantposte/terrain-jour.webp, 1344 × 1024 : l'image Leonardo de 1024 px
  // élargie de 160 px de chaque côté pour tenir dans une scène large, d'où le +160)
  largeur: 1344,
  plots: [[520, 255], [395, 280], [287, 350], [205, 432], [160, 530], [195, 640], [280, 722], [385, 785],
          [645, 282], [750, 348], [830, 438], [872, 535], [836, 636], [752, 712], [652, 786]].map(function(p){ return [p[0] + 160, p[1]]; })
};
// Ordre d'ouverture des emplacements (les plus proches du feu d'abord)
var AP_ORDRE = [0, 1, 8, 2, 9, 3, 10, 4, 11, 5, 12, 6, 13, 7, 14];
// Taille des images (pour les poser sans déformation)
var AP_TAILLES = {"cadenas":[110,284], "charrette-1":[232,214], "charrette-3":[280,240], "charrette-5":[324,304], "citerne-1":[243,215], "citerne-3":[246,232], "citerne-5":[239,280], "echafaudage-1":[244,302], "echafaudage-2":[249,309], "echafaudage-3":[238,323], "entrepot-1":[243,215], "entrepot-3":[245,229], "entrepot-5":[288,284], "forge-1":[240,158], "forge-3":[268,216], "forge-5":[294,280], "garage-1":[228,221], "garage-3":[268,258], "garage-5":[299,297], "infirmerie-1":[251,226], "infirmerie-3":[270,260], "infirmerie-5":[292,259], "palissade-1":[212,221], "palissade-3":[247,237], "palissade-5":[279,274], "panneau":[241,273], "pieges-1":[253,171], "pieges-3":[252,186], "pieges-5":[336,214], "planque-1":[282,165], "planque-3":[320,232], "planque-5":[341,236], "radio-1":[198,262], "radio-3":[191,327], "radio-5":[211,326], "recolte":[177,188], "scierie-1":[234,168], "scierie-3":[268,191], "scierie-5":[294,262], "serre-1":[251,221], "serre-3":[270,254], "serre-5":[290,267], "siege-1":[271,220], "siege-3":[256,241], "siege-5":[286,279], "tour-1":[149,440], "tour-3":[226,451], "tour-5":[248,470]};

// Les bâtiments. prod = par jour réel et par niveau ; def = défense ; cout = coût de base (× AP.mult)
var AP_BAT = {
  citerne:    { nom:"Citerne", ico:"💧", cout:{ planche:3, ferraille:1 }, prod:{ eau:[2, 3, 4, 6, 8] }, desc:"Recueille l’eau de pluie dans des tonneaux, puis une vraie cuve." },
  serre:      { nom:"Serre", ico:"🥫", cout:{ planche:3, chiffon:1 }, prod:{ nour:[2, 3, 4, 6, 8], herbes:[0, 0, 0.5, 1, 1] }, desc:"Légumes et champignons à l’abri ; des herbes fraîches à partir du niveau 3." },
  scierie:    { nom:"Scierie", ico:"🪵", cout:{ planche:2, clous:1 }, prod:{ planche:[1, 2, 3, 4, 6] }, desc:"Débite le bois mort des environs en planches." },
  palissade:  { nom:"Palissade", ico:"🧱", cout:{ planche:4, clous:1 }, def:[3, 5, 8, 11, 15], desc:"Protège l’avant-poste. Chaque niveau ouvre aussi 2 emplacements de plus." },
  entrepot:   { nom:"Entrepôt", ico:"📦", cout:{ planche:5, clous:2 }, cap:[20, 30, 40, 55, 70], desc:"Ce que l’avant-poste peut garder de chaque ressource avant que la production s’arrête." },
  infirmerie: { nom:"Infirmerie", ico:"🩹", cout:{ planche:3, chiffon:2 }, prod:{ bandage:[0.5, 1, 1.5, 2, 3] }, desc:"Prépare des bandages avec ce qu’on trouve." },
  forge:      { nom:"Forge", ico:"⚙️", cout:{ ferraille:3, planche:2 }, prod:{ clous:[1, 1, 2, 2, 3], ferraille:[0.5, 1, 1, 1.5, 2] }, desc:"Récupère le métal : clous et ferraille." },
  radio:      { nom:"Poste radio", ico:"📻", cout:{ ferraille:2, ruban:1 }, radio:[6, 12, 18, 24, 30], desc:"Écoute les pillards et prévient des attaques : moins de pertes." },
  tour:       { nom:"Tour de guet", ico:"🗼", cout:{ planche:5, clous:2 }, def:[2, 3, 4, 6, 8], desc:"Repère les assaillants de loin." },
  garage:     { nom:"Garage", ico:"⛽", cout:{ ferraille:3, planche:3 }, prod:{ jerrican:[0.25, 0.5, 0.75, 1, 1.5] }, desc:"Siphonne les épaves du quartier : de l’essence pour la voiture." },
  planque:    { nom:"Planque", ico:"🕳️", cout:{ planche:4, ruban:1 }, planque:[15, 25, 35, 45, 60], desc:"Une part du stock est cachée et ne peut pas être volée." },
  pieges:     { nom:"Pièges", ico:"🪤", cout:{ ferraille:2, clous:2 }, def:[2, 4, 6, 8, 10], desc:"Blessent les assaillants avant qu’ils n’atteignent la palissade." },
  charrette:  { nom:"Charrette", ico:"🛒", pillard:true, desc:"Pour ramener le butin des pillages." },
  siege:      { nom:"Atelier de siège", ico:"🪓", pillard:true, desc:"Pour enfoncer les défenses des autres avant-postes." }
};
var AP_RES = ["eau", "nour", "planche", "herbes", "bandage", "clous", "ferraille", "jerrican"];
function apIcoRes(r){ return r === "eau" ? ic("bouteille", "💧") : r === "nour" ? ic("conserve", "🥫") : icone(r); }
function apNomRes(r, n){ return r === "eau" ? tradN(n, "{n} ration d’eau", "{n} rations d’eau") : r === "nour" ? tradN(n, "{n} ration de nourriture", "{n} rations de nourriture") : nommer(r, n); }

/* ---------- État (gardé sur l'appareil, pour le joueur et non pour la famille) ---------- */
var AP_CLE = "survival_avantposte";
function apLire(){
  var s = null; try{ s = JSON.parse(localStorage.getItem(AP_CLE) || "null"); }catch(e){}
  if(!s || s.v !== 1) s = { v:1, debloque:0, plots:{}, chantier:null, acc:{}, tProd:0, tAtt:0, log:[], vu:0, pubs:{ d:"", n:0 } };
  return s;
}
var APS = apLire();
// Jour d'accès réglable dans l'administration (onglet Clans) : relu au lancement, gardé sur l'appareil
try{ var apJourGarde = +localStorage.getItem("survival_ap_jour"); if(apJourGarde >= 1) AP.jour = apJourGarde; }catch(e){}
function apNoterJour(j){ j = Math.floor(+j); if(!(j >= 1)) return; AP.jour = j; try{ localStorage.setItem("survival_ap_jour", String(j)); }catch(e){} }
function apSauver(){ try{ localStorage.setItem(AP_CLE, JSON.stringify(APS)); }catch(e){} }
try{ if(/[?&]avantposte=1/.test(location.search) && !APS.debloque){ APS.debloque = Date.now(); APS.tProd = APS.tAtt = Date.now(); apSauver(); } }catch(e){}

function apNiv(id){ for(var k in APS.plots) if(APS.plots[k].id === id) return APS.plots[k].niv; return 0; }
function apStade(n){ return n >= 5 ? 5 : n >= 3 ? 3 : 1; }
function apLibres(){ return Math.min(AP.plots.length, AP.libres + 2 * apNiv("palissade")); }
function apOuvert(k){ return AP_ORDRE.indexOf(k) < apLibres(); }
function apDefense(){ var d = 0; ["palissade", "tour", "pieges"].forEach(function(b){ var n = apNiv(b); if(n) d += AP_BAT[b].def[n - 1]; }); return d; }
function apCap(){ var n = apNiv("entrepot"); return n ? AP_BAT.entrepot.cap[n - 1] : 10; }
function apNiveauTotal(){ var t = 0; for(var k in APS.plots) t += APS.plots[k].niv; return t; }
// Production par jour réel, ressource par ressource (bâtiments terminés seulement)
function apProdJour(){
  var p = {};
  for(var k in APS.plots){ var P = APS.plots[k], B = AP_BAT[P.id]; if(!P.niv || !B.prod) continue;
    for(var r in B.prod) p[r] = (p[r] || 0) + B.prod[r][P.niv - 1]; }
  return p;
}
function apVisible(){
  if(!AVANTPOSTE_ACTIF) return false;
  if(!APS.debloque && typeof G !== "undefined" && G && G.ph === "game" && !G.bacASable && G.day >= AP.jour){
    APS.debloque = APS.tProd = APS.tAtt = Date.now(); apSauver();
    if(typeof fileSucces !== "undefined") fileSucces.push({ icone:"🏕️", titre:trad("L’avant-poste est débloqué !"), nom:trad("Une nouvelle pièce t’attend : construis, récolte, défends.") });
  }
  return !!APS.debloque;
}

/* ---------- Le temps qui passe : production, chantiers, attaques ---------- */
function apProduire(t0, t1){
  if(t1 <= t0) return;
  var p = apProdJour(), cap = apCap(), j = (t1 - t0) / 86400e3;
  for(var r in p){ APS.acc[r] = Math.min(cap, (APS.acc[r] || 0) + p[r] * j); }
}
function apMaj(){
  if(!APS.debloque) return [];
  var now = Date.now(), notes = [];
  if(!APS.tProd) APS.tProd = now;
  // Chantier terminé : produire jusqu'à la fin au niveau d'avant, puis monter de niveau
  var C = APS.chantier;
  if(C && C.fin <= now){
    apProduire(APS.tProd, C.fin); APS.tProd = C.fin;
    var P = APS.plots[C.k] || (APS.plots[C.k] = { id:C.id, niv:0 });
    P.niv = C.niv; APS.chantier = null;
    notes.push({ icone:"✅", titre:trad("Chantier terminé"), nom:trad("{b} niveau {n}", { b:trad(AP_BAT[P.id].nom), n:P.niv }) });
  }
  apProduire(APS.tProd, now); APS.tProd = now;
  // Attaques : une chance toutes les 8 h depuis la dernière vérification
  if(!APS.tAtt) APS.tAtt = now;
  var A = AP.attaque, n = Math.floor((now - APS.tAtt) / A.toutes);
  if(n > 0){
    for(var i = 0; i < Math.min(n, A.maxRattrapage); i++){
      if(Math.random() >= A.chance) continue;
      var force = A.base + Math.floor(apNiveauTotal() / 2) + Math.floor(Math.random() * 4), def = apDefense();
      var L = { t:APS.tAtt + (i + 1) * A.toutes, force:force, def:def, ok:def >= force, pertes:{} };
      if(!L.ok){
        var pl = apNiv("planque"), ra = apNiv("radio");
        var frac = A.pertes * (1 - (pl ? AP_BAT.planque.planque[pl - 1] / 100 : 0)) * (1 - (ra ? AP_BAT.radio.radio[ra - 1] / 100 : 0));
        for(var r in APS.acc){ var perdu = APS.acc[r] * frac; if(perdu >= 0.5) L.pertes[r] = Math.round(perdu); APS.acc[r] -= perdu; }
      }
      APS.log.unshift(L); APS.log = APS.log.slice(0, 10);
      notes.push({ icone:"🏕️", titre:trad("Ton avant-poste a été attaqué"), nom:L.ok ? trad("Attaque repoussée (force {f} contre défense {d})", { f:force, d:def }) : trad("Les pillards ont pris une partie du stock (force {f} contre défense {d})", { f:force, d:def }) });
    }
    APS.tAtt += n * A.toutes;
  }
  apSauver();
  return notes;
}

/* ---------- La pièce « Avant-poste » (ajoutée à PIECES de piece.js) ---------- */
function apNuit(){ var h = new Date().getHours(); return h >= 20 || h < 7; }
function apRect(nom, x, y, ech){
  var t = AP_TAILLES[nom], w = t[0] * (ech || AP.echelle), h = t[1] * (ech || AP.echelle), y1 = y + 48;
  return [Math.round(x - w / 2), Math.round(y1 - h), Math.round(x + w / 2), Math.round(y1)];
}
function apDecor(){
  var D = [];
  // Repère invisible sur toute l'image : sert à placer les compteurs des chantiers
  D.push(["data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221%22%20height%3D%221%22%20id%3D%22apref%22%2F%3E", 0, 0, AP.largeur, 1024, function(){ return true; }]);
  var ordre = AP.plots.map(function(p, k){ return k; }).sort(function(a, b){ return AP.plots[a][1] - AP.plots[b][1]; });
  ordre.forEach(function(k){
    var x = AP.plots[k][0], y = AP.plots[k][1];
    var r = apRect("panneau", x, y, .36); D.push(["images/avantposte/panneau.webp", r[0], r[1], r[2], r[3], function(){ return apOuvert(k) && !APS.plots[k] && !(APS.chantier && APS.chantier.k === k); }]);
    r = apRect("cadenas", x, y, .3); D.push(["images/avantposte/cadenas.webp", r[0], r[1], r[2], r[3], function(){ return !apOuvert(k); }]);
    Object.keys(AP_BAT).forEach(function(b){ if(AP_BAT[b].pillard) return;
      [1, 3, 5].forEach(function(s){ var rr = apRect(b + "-" + s, x, y);
        D.push(["images/avantposte/" + b + "-" + s + ".webp", rr[0], rr[1], rr[2], rr[3], function(){ var P = APS.plots[k]; return !!P && P.id === b && P.niv > 0 && apStade(P.niv) === s; }]); }); });
    r = apRect("echafaudage-1", x, y, .5); D.push(["images/avantposte/echafaudage-1.webp", r[0], r[1], r[2], r[3], function(){ var C = APS.chantier, P = APS.plots[k]; return !!C && C.k === k && (!P || !P.niv); }]);
    r = apRect("echafaudage-3", x + 10, y - 10, .38); D.push(["images/avantposte/echafaudage-3.webp", r[0], r[1], r[2], r[3], function(){ var C = APS.chantier, P = APS.plots[k]; return !!C && C.k === k && !!P && P.niv > 0; }]);
  });
  var rc = apRect("recolte", 760, 560, .4);
  D.push(["images/avantposte/recolte.webp", rc[0], rc[1], rc[2], rc[3], function(){ for(var r in APS.acc) if(APS.acc[r] >= 1) return true; return false; }]);
  return D;
}
function apZones(){
  var Z = [["apCamp", 590, 430, 770, 610, function(){ return "🔥"; }, trad("Le camp"), .5], ["apCarte", 640, 150, 740, 225, function(){ return "🗺️"; }, trad("La carte"), .5]];
  AP.plots.forEach(function(p, k){
    var P = APS.plots[k], lab = !apOuvert(k) ? "🔒" : P && P.niv ? trad(AP_BAT[P.id].nom) + " " + P.niv : APS.chantier && APS.chantier.k === k ? trad("Chantier") : trad("Construire");
    Z.push(["apSlot" + k, p[0] - 78, p[1] - 70, p[0] + 78, p[1] + 58, function(){ return ""; }, lab, .5]);
  });
  return Z;
}
var AP_PIECE = null;
if(AVANTPOSTE_ACTIF && typeof PIECES !== "undefined"){
  AP_PIECE = { id:"avantposte", nom:"Avant-poste", img:function(){ return apNuit() ? "images/avantposte/terrain-nuit.webp" : "images/avantposte/terrain-jour.webp"; },
    l:AP.largeur, h:1024, cadre:{ x0:220, x1:1124, y0:150, y1:880 }, decor:apDecor(), zones:apZones(), si:apVisible };
  PIECES.push(AP_PIECE);
  if(typeof PANNEAU_PIECE !== "undefined") PANNEAU_PIECE.avantposte = function(){ openCamp(); }; // sur PC, le panneau de droite montre le camp
}
function apIci(){ return typeof PIECES !== "undefined" && typeof pieceIdx !== "undefined" && PIECES[pieceIdx] && PIECES[pieceIdx].id === "avantposte"; }
// Après chaque placement de la pièce : étiquettes à jour et compteurs des chantiers posés sur la scène
if(AP_PIECE && typeof placerPiece === "function"){
  var apPlacerOrigine = placerPiece;
  placerPiece = function(){
    if(apIci()){ apMaj(); AP_PIECE.zones = apZones(); }
    var r = apPlacerOrigine.apply(this, arguments);
    try{ apCompteurs(); }catch(e){}
    return r;
  };
}
function apFmt(ms){
  var s = Math.max(0, Math.ceil(ms / 1000));
  if(s >= 3600){ var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h + " h " + (m < 10 ? "0" : "") + m; }
  if(s >= 60) return Math.floor(s / 60) + " min " + (s % 60 < 10 ? "0" : "") + (s % 60);
  return s + " s";
}
function apCompteurs(){
  var d = document.getElementById("decor"); if(!d) return;
  d.querySelectorAll(".ap-chip").forEach(function(e){ e.remove(); });
  if(!apIci() || !APS.chantier || (typeof sceneLieu === "function" && sceneLieu())) return;
  var ref = d.querySelector('img[src*="apref"]'); if(!ref) return;
  var s = ref.offsetWidth / AP.largeur, C = APS.chantier, p = AP.plots[C.k];
  var el = document.createElement("div"); el.className = "ap-chip"; el.setAttribute("data-k", C.k);
  el.style.left = (ref.offsetLeft + p[0] * s) + "px"; el.style.top = (ref.offsetTop + (p[1] - 70) * s) + "px";
  el.innerHTML = "🔨 <b>" + apFmt(C.fin - Date.now()) + "</b>";
  d.appendChild(el);
}
// Chaque seconde : le compteur ; chaque 20 s (ou à la fin d'un chantier) : tout recalculer
var apDerniereMaj = 0;
setInterval(function(){
  try{
    if(!AVANTPOSTE_ACTIF || !APS.debloque) return;
    var chip = document.querySelector("#decor .ap-chip b");
    if(chip && APS.chantier) chip.textContent = apFmt(APS.chantier.fin - Date.now());
    var fini = APS.chantier && APS.chantier.fin <= Date.now();
    if(fini || Date.now() - apDerniereMaj > 20000){
      apDerniereMaj = Date.now();
      var notes = apMaj();
      if(notes.length){
        if(typeof fileSucces !== "undefined") notes.forEach(function(n){ fileSucces.push(n); });
        if(apIci() && typeof placerPiece === "function") placerPiece();
        if(notes.some(function(n){ return n.icone === "✅"; })) apEnvoyer(true);
        if(apFenetre) apRouvrir();
      }
    }
    if(apFenetre === "slot" && apSlotK != null){ var t = document.getElementById("apReste"); if(t && APS.chantier) t.textContent = apFmt(APS.chantier.fin - Date.now()); }
  }catch(e){}
}, 1000);

/* ---------- Fenêtres ---------- */
var apFenetre = null, apSlotK = null, apChoix = null, apMsg = "";
function apRouvrir(){ var m = document.getElementById("modal"); if(!m || m.style.display === "none"){ apFenetre = null; return; } if(apFenetre === "camp") openCamp(); else if(apFenetre === "slot") apOuvrirSlot(apSlotK); }
function apEnJeu(){ return typeof G !== "undefined" && G && G.ph === "game" && !G.bacASable; }
function apCout(id, niv){ var c = {}, B = AP_BAT[id]; for(var k in B.cout) c[k] = Math.ceil(B.cout[k] * AP.mult[niv - 1]); return c; }
function apManque(c){ var m = []; for(var k in c) if(compter(k) < c[k]) m.push({ id:k, n:c[k] - compter(k) }); return m; }
function apParJour(q){
  if(!(q > 0)) return "—";
  var inv = 1 / q;
  if(q < 1 && Math.abs(inv - Math.round(inv)) < 0.05) return trad("+1 tous les {n} jours", { n:Math.round(inv) });
  var n = String(Math.round(q * 100) / 100); if(typeof LANGUE === "undefined" || LANGUE === "fr") n = n.replace(".", ",");
  return trad("+{n} par jour", { n:n });
}
function apEffet(id, n){
  var B = AP_BAT[id];
  if(!n) return trad("Pas encore construit");
  if(B.prod) return Object.keys(B.prod).filter(function(r){ return B.prod[r][n - 1] > 0; }).map(function(r){ return apIcoRes(r) + " " + apParJour(B.prod[r][n - 1]); }).join(" · ");
  if(B.def) return "🛡️ " + trad("Défense +{n}", { n:B.def[n - 1] });
  if(B.cap) return "📦 " + trad("Stock : {n} par ressource", { n:B.cap[n - 1] });
  if(B.radio) return "📻 " + trad("Pertes −{n} % lors d’une attaque", { n:B.radio[n - 1] });
  if(B.planque) return "🕳️ " + trad("{n} % du stock à l’abri", { n:B.planque[n - 1] });
  return "";
}
function apImg(id, n){ return '<img class="ap-img" src="images/avantposte/' + id + "-" + apStade(n || 1) + '.webp" alt="">'; }

function openCamp(){
  apMaj(); apFenetre = "camp";
  var cap = apCap(), p = apProdJour(), h = '<div class="ap"><h2>🏕️ ' + trad("L’avant-poste") + '</h2>';
  h += '<div class="tuiles t3"><span class="tuile"><b>' + apDefense() + '</b><small>' + trad("défense") + '</small></span><span class="tuile"><b>' + apNiveauTotal() + '</b><small>' + trad("niveaux construits") + '</small></span><span class="tuile"><b>' + apLibres() + ' / ' + AP.plots.length + '</b><small>' + trad("emplacements") + '</small></span></div>';
  if(apMsg){ h += '<p class="msg g2">' + apMsg + '</p>'; apMsg = ""; }
  h += '<button class="loc ap-carte-b" data-act="apCarte"><b>🗺️ ' + trad("Voir la carte") + '</b><small>' + trad("Les avant-postes des autres survivants et les camps de pillards") + '</small></button>';
  // Le stock à récolter
  var res = AP_RES.filter(function(r){ return p[r] || (APS.acc[r] || 0) >= 1; });
  h += '<p class="titre-butin">📦 ' + trad("À récolter") + ' <small>(' + trad("{n} au plus par ressource", { n:cap }) + ')</small></p>';
  if(!res.length) h += '<p class="msg">' + trad("Rien pour l’instant : construis une citerne, une serre ou une scierie pour produire.") + '</p>';
  else {
    h += '<div class="ap-stock">' + res.map(function(r){ var v = Math.floor(APS.acc[r] || 0);
      return '<span class="ap-res' + (v >= cap ? " plein" : "") + '"><span class="ap-res-i">' + apIcoRes(r) + '</span><b>' + v + '</b><small>' + (p[r] ? apParJour(p[r]) : "") + '</small></span>'; }).join("") + '</div>';
    var peut = res.some(function(r){ return (APS.acc[r] || 0) >= 1; });
    h += '<button class="btn" style="width:100%" data-act="apRecolter"' + (peut && apEnJeu() ? "" : " disabled") + '>' + (apEnJeu() ? (peut ? "🧺 " + trad("Récolter pour le refuge") : trad("Rien à récolter")) : trad("Pendant une partie seulement")) + '</button>';
    if(res.some(function(r){ return (APS.acc[r] || 0) >= cap; })) h += '<p class="ap-note">⚠️ ' + trad("Une ressource est pleine : sa production est arrêtée. Récolte ou agrandis l’entrepôt.") + '</p>';
  }
  // Le chantier
  if(APS.chantier){ var C = APS.chantier;
    h += '<p class="titre-butin">🔨 ' + trad("Chantier") + '</p><button class="loc" data-act="apSlot' + C.k + '"><b>' + trad("{b} niveau {n}", { b:trad(AP_BAT[C.id].nom), n:C.niv }) + '</b><small>' + trad("Fini dans {t}", { t:apFmt(C.fin - Date.now()) }) + '</small></button>'; }
  // Les attaques
  h += '<p class="titre-butin">⚔️ ' + trad("Attaques") + '</p>';
  h += APS.log.length ? '<div class="ap-log">' + APS.log.slice(0, 5).map(function(L){
    var pertes = Object.keys(L.pertes).map(function(r){ return apNomRes(r, L.pertes[r]); }).join(", ");
    return '<div class="lj ' + (L.ok ? "bon" : "mauvais") + '"><span class="lj-ico">' + (L.ok ? "🛡️" : "🔥") + '</span><span class="lj-txt">' + apQuand(L.t) + ' · <b>' + (L.ok ? trad("repoussée") : trad("perdue")) + '</b> · ' + trad("force {f} contre défense {d}", { f:L.force, d:L.def }) + (pertes ? ' · −' + pertes : '') + '</span></div>'; }).join("") + '</div>'
    : '<p class="ap-note">' + trad("Aucune attaque pour l’instant. Toutes les 8 h, des zombies ou des pillards peuvent venir : palissade, tour et pièges le défendent.") + '</p>';
  h += '<p class="ap-note">' + trad("L’avant-poste t’appartient : il produit même quand tu ne joues pas et survit à la mort de ta famille. La carte et le mode pillard arriveront bientôt.") + '</p>';
  show(h + '</div>' + BTN_FERMER());
}
function apQuand(t){ var m = Math.round((Date.now() - t) / 60000); return m < 60 ? trad("il y a {n} min", { n:Math.max(1, m) }) : m < 1440 ? trad("il y a {n} h", { n:Math.round(m / 60) }) : trad("il y a {n} j", { n:Math.round(m / 1440) }); }

function apOuvrirSlot(k){
  apMaj(); apFenetre = "slot"; apSlotK = k;
  var P = APS.plots[k], C = APS.chantier, h = '<div class="ap">';
  if(apMsg){ h += '<p class="msg g2">' + apMsg + '</p>'; apMsg = ""; }
  if(!apOuvert(k)){
    var besoin = Math.ceil((AP_ORDRE.indexOf(k) + 1 - AP.libres) / 2);
    show(h + '<h2>🔒 ' + trad("Emplacement verrouillé") + '</h2><p class="msg">' + trad("Monte la palissade au niveau {n} pour ouvrir cet emplacement.", { n:besoin }) + '</p></div>' + BTN_FERMER());
    return;
  }
  if(C && C.k === k && (!P || !P.niv)){
    show(h + '<h2>🔨 ' + trad("{b} en construction", { b:trad(AP_BAT[C.id].nom) }) + '</h2>' + apImg(C.id, 1) + apBlocChantier() + '</div>' + BTN_FERMER());
    return;
  }
  if(!P){ // emplacement libre : choisir un bâtiment
    var dispo = Object.keys(AP_BAT).filter(function(b){ return !apNiv(b) && !(C && C.id === b); });
    if(!apChoix || dispo.indexOf(apChoix) < 0) apChoix = dispo.filter(function(b){ return !AP_BAT[b].pillard; })[0] || null;
    h += '<h2>🏗️ ' + trad("Emplacement libre") + '</h2><div class="ap-choix">' + dispo.map(function(b){ var B = AP_BAT[b];
      return '<button class="ap-c' + (b === apChoix ? " sel" : "") + (B.pillard ? " bientot" : "") + '" data-act="apChoisir" data-id="' + b + '"' + (B.pillard ? " disabled" : "") + '><img src="images/avantposte/' + b + '-1.webp" alt=""><b>' + trad(B.nom) + '</b>' + (B.pillard ? '<small>' + trad("bientôt (mode pillard)") + '</small>' : '') + '</button>'; }).join("") + '</div>';
    if(apChoix) h += apFiche(apChoix, 0, k);
    show(h + '</div>' + BTN_FERMER());
    return;
  }
  // bâtiment construit
  var B = AP_BAT[P.id];
  h += '<div class="ap-tete">' + apImg(P.id, P.niv) + '<div><h2>' + B.ico + ' ' + trad(B.nom) + '</h2><span class="ap-niv">' + trad("Niveau {n} / 5", { n:P.niv }) + '</span><p class="ap-desc">' + trad(B.desc) + '</p><p class="ap-eff">' + apEffet(P.id, P.niv) + '</p></div></div>';
  if(C && C.k === k) h += apBlocChantier();
  else if(P.niv < 5) h += apFiche(P.id, P.niv, k);
  else h += '<p class="msg g2">⭐ ' + trad("Niveau maximum atteint") + '</p>';
  show(h + '</div>' + BTN_FERMER());
}
// Ce que coûte et apporte le prochain niveau, avec le bouton
function apFiche(id, niv, k){
  var B = AP_BAT[id], n = niv + 1, c = apCout(id, n), m = apManque(c), C = APS.chantier;
  var h = niv ? '' : '<div class="ap-tete">' + apImg(id, 1) + '<div><h3>' + B.ico + ' ' + trad(B.nom) + '</h3><p class="ap-desc">' + trad(B.desc) + '</p></div></div>';
  h += '<p class="titre-butin">' + (niv ? trad("Niveau {n}", { n:n }) : trad("Niveau 1")) + ' · ⏱ ' + apFmt(AP.durees[n - 1]) + '</p><p class="ap-eff">' + apEffet(id, n) + '</p>';
  var raison = !apEnJeu() ? trad("Pendant une partie seulement") : C ? trad("Un seul chantier à la fois") : m.length ? trad("Il manque {l}", { l:nommerListe(m) }) : "";
  h += '<div class="rf-action">' + ingredients(c) + '<button class="btn" data-act="apConstruire" data-id="' + k + ':' + id + '"' + (raison ? " disabled" : "") + '>' + (raison ? "❌ " + raison : (niv ? "⬆️ " + trad("Améliorer") : "🔨 " + trad("Construire"))) + '</button></div>';
  return h;
}
function apBlocChantier(){
  var C = APS.chantier, tot = C.fin - C.debut, pc = Math.min(100, Math.round((Date.now() - C.debut) / tot * 100));
  var d = new Date().toDateString(), n = APS.pubs.d === d ? APS.pubs.n : 0;
  return '<p class="titre-butin">🔨 ' + trad("Chantier : niveau {n}", { n:C.niv }) + '</p><div class="ap-barre"><i style="width:' + pc + '%"></i></div><p class="ap-reste">⏱ <b id="apReste">' + apFmt(C.fin - Date.now()) + '</b></p>'
    + '<button class="loc offrepub" data-act="apPub"' + (n >= AP.pubs ? " disabled" : "") + '><b>📺 ' + trad("Accélérer le chantier") + '</b><small>' + (n >= AP.pubs ? trad("Plus de pub aujourd’hui") : trad("Une courte pub divise le temps restant par deux · encore {n} aujourd’hui", { n:AP.pubs - n })) + '</small></button>';
}

/* ---------- Actions ---------- */
function apConstruire(k, id){
  if(!apEnJeu() || APS.chantier || !apOuvert(k)) return;
  var P = APS.plots[k]; if(P && P.id !== id) return;
  var n = (P ? P.niv : 0) + 1; if(n > 5) return;
  var c = apCout(id, n); if(apManque(c).length) return;
  for(var r in c) consommer(r, c[r]);
  if(!P) APS.plots[k] = { id:id, niv:0 };
  APS.chantier = { k:k, id:id, niv:n, debut:Date.now(), fin:Date.now() + AP.durees[n - 1] };
  apSauver(); if(typeof son === "function") son("planches");
  apMsg = "🔨 " + trad("Le chantier commence : {b} niveau {n}.", { b:trad(AP_BAT[id].nom), n:n });
}
function apRecolter(){
  if(!apEnJeu()) return;
  apMaj(); var pris = [];
  AP_RES.forEach(function(r){ var v = Math.floor(APS.acc[r] || 0); if(v < 1) return;
    APS.acc[r] -= v;
    if(r === "eau" || r === "nour") G.reste[r] = (G.reste[r] || 0) + v; else ajouter(r, v);
    pris.push(apNomRes(r, v)); });
  apSauver();
  apMsg = pris.length ? "🧺 " + trad("Rapporté au refuge : {l}.", { l:pris.join(", ") }) : "";
}
function apPub(){
  var d = new Date().toDateString(); if(APS.pubs.d !== d) APS.pubs = { d:d, n:0 };
  if(APS.pubs.n >= AP.pubs || !APS.chantier) return;
  var s = 5;
  show('<h2>📺 ' + trad("Publicité (simulation)") + '</h2><p class="sub">' + trad("Ici s’affichera plus tard une vraie pub récompensée.") + '</p><p id="apPubT"><b>' + trad("Pub en cours… {n} s", { n:s }) + '</b></p><button class="btn" id="apPubB" style="width:100%" disabled data-act="apPubOk">' + trad("Récupérer la récompense") + '</button>');
  var tm = setInterval(function(){ s--; var t = document.getElementById("apPubT"), b = document.getElementById("apPubB");
    if(t) t.innerHTML = "<b>" + (s > 0 ? trad("Pub en cours… {n} s", { n:s }) : trad("Récompense prête !")) + "</b>";
    if(s <= 0){ clearInterval(tm); if(b) b.disabled = false; } }, 1000);
}
document.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
  if(!/^ap[A-Z]/.test(a)) return;
  var m = /^apSlot(\d+)$/.exec(a);
  if(m){ apChoix = null; apOuvrirSlot(+m[1]); return; }
  if(a === "apCamp"){ openCamp(); return; }
  if(a === "apChoisir"){ apChoix = id; apOuvrirSlot(apSlotK); return; }
  if(a === "apConstruire"){ var q = id.split(":"); apConstruire(+q[0], q[1]); if(typeof placerPiece === "function") placerPiece(); apOuvrirSlot(+q[0]); if(typeof render === "function") render(); return; }
  if(a === "apRecolter"){ apRecolter(); if(typeof placerPiece === "function") placerPiece(); if(typeof render === "function") render(); openCamp(); return; }
  if(a === "apPub"){ apPub(); return; }
  if(a === "apPubOk"){ var C = APS.chantier; if(C){ var reste = C.fin - Date.now(); C.fin = Date.now() + Math.floor(reste / 2); APS.pubs.n++; apSauver(); apMsg = "📺 " + trad("Chantier accéléré !"); }
    apDerniereMaj = 0; apOuvrirSlot(apSlotK); if(typeof placerPiece === "function") placerPiece(); return; }
});

/* ---------- La carte des avant-postes (version 1 : on voit les autres, pas encore de pillage) ----------
   Secteurs de 512 px posés en spirale autour du centre-ville (secteur 0). Emplacements : AP_SECTEURS.
   À GARDER IDENTIQUE à worker/avantposte.mjs : AP_SECTEURS et apTypeSecteur(). */
var AP_SECTEURS = {
  quartier: [[369, 25], [86, 49], [220, 74], [434, 159], [193, 187], [29, 195], [328, 198], [456, 236], [73, 296], [170, 339], [321, 344], [37, 425], [467, 471], [295, 473]],
  foret: [[232, 73], [66, 100], [417, 107], [118, 156], [457, 197], [245, 232], [79, 266], [388, 305], [100, 378], [449, 402], [390, 449]],
  industrie: [[40, 69], [441, 78], [283, 91], [196, 223], [305, 291], [205, 421], [136, 478], [43, 287], [117, 367], [309, 473], [443, 467]],
  riviere: [[193, 43], [41, 125], [321, 151], [404, 181], [112, 189], [457, 276], [186, 311], [227, 365], [267, 459]],
  autoroute: [[348, 203], [434, 255], [225, 423], [302, 455], [172, 37], [448, 51], [421, 155], [45, 288], [128, 361], [75, 428]],
  centre: [[166, 36], [411, 51], [98, 102], [403, 171], [477, 279], [27, 299], [124, 325], [202, 431], [34, 444], [326, 469]]
};
var AP_TYPES = ["quartier", "foret", "industrie", "riviere", "autoroute"];
function apTypeSecteur(s){ return s === 0 ? "centre" : AP_TYPES[(s * 3 + 1) % AP_TYPES.length]; }
// Position (colonne, ligne) du secteur s sur la spirale
function apSpirale(s){
  var x = 0, y = 0, dx = 1, dy = 0, pas = 1, fait = 0, tour = 0;
  for(var i = 0; i < s; i++){
    x += dx; y += dy; fait++;
    if(fait === pas){ fait = 0; var t = dx; dx = -dy; dy = t; tour++; if(tour % 2 === 0) pas++; }
  }
  return [x, y];
}
function apAnneau(s){ var p = apSpirale(s); return Math.max(Math.abs(p[0]), Math.abs(p[1])); }
function apAdresse(){ return typeof adresseClassement === "function" ? adresseClassement().replace("/api/classement", "/api/avantposte") : "/api/avantposte"; }
function apLocal(){ return /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && !window.apServeurTest; }
function apAppel(corps){
  corps.id = typeof idAppareil === "function" ? idAppareil() : "";
  if(window.apServeurTest) return window.apServeurTest(corps);
  if(apLocal()) return Promise.resolve({ erreur:trad("(Test sur l’ordinateur : rien n’est envoyé au serveur.)") });
  return fetch(apAdresse(), { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(corps) }).then(function(r){ return r.json(); });
}
// Envoi de l'état de son avant-poste (au plus toutes les 10 min, sauf si forcé)
function apEnvoyer(force){
  if(!APS.debloque) return Promise.resolve(null);
  var t = 0; try{ t = +localStorage.getItem("survival_ap_envoi") || 0; }catch(e){}
  if(!force && Date.now() - t < 600000) return Promise.resolve(null);
  try{ localStorage.setItem("survival_ap_envoi", String(Date.now())); }catch(e){}
  var bats = {}; for(var k in APS.plots) if(APS.plots[k].niv) bats[APS.plots[k].id] = APS.plots[k].niv;
  return apAppel({ action:"maj", pseudo:typeof lirePseudo === "function" ? lirePseudo() : "", avatar:typeof lireAvatar === "function" ? lireAvatar() : "",
    niv:apNiveauTotal(), def:apDefense(), bats:bats, jour:typeof G !== "undefined" && G ? G.day : 0 }).catch(function(){ return null; });
}

var apCarteVue = { x:0, y:0, z:0.6 }, apCarteData = null, apCarteSel = null;
var AP_TAILLE_SECTEUR = 512, AP_TAILLE_REPERE = 92;
function openCarte(){
  if(typeof hide === "function") hide();
  var el = document.getElementById("apCarte");
  if(!el){ el = document.createElement("div"); el.id = "apCarte"; document.body.appendChild(el); apBrancherCarte(el); }
  el.innerHTML = '<div class="apc-haut"><b>🗺️ ' + trad("La carte") + '</b><span class="apc-leg"><span><img src="images/avantposte/reperes/moi.webp" alt="">' + trad("Toi") + '</span><span><img src="images/avantposte/reperes/protege.webp" alt="">' + trad("Protégé") + '</span><span><img src="images/avantposte/reperes/pnj.webp" alt="">' + trad("Pillards") + '</span><span><img src="images/avantposte/reperes/ruine.webp" alt="">' + trad("Ruine") + '</span></span><button class="apc-x" data-act="apCarteFermer" aria-label="' + trad("Fermer") + '">✕</button></div>'
    + '<div class="apc-vue"><div class="apc-monde"></div></div><div class="apc-msg">' + trad("Chargement de la carte…") + '</div><div class="apc-fiche"></div>';
  el.style.display = "flex"; apCarteSel = null;
  apEnvoyer(true).then(function(d){ return d && !d.erreur ? d : apAppel({ action:"carte" }); }).then(function(d){
    apCarteData = d && !d.erreur ? d : null;
    if(apCarteData && apCarteData.jour) apNoterJour(apCarteData.jour);
    var msg = el.querySelector(".apc-msg");
    if(msg) msg.textContent = apCarteData ? "" : (d && d.erreur ? d.erreur + " " : "") + trad("Hors ligne : seule ta base est affichée.");
    if(msg && !msg.textContent) msg.style.display = "none";
    apDessinerCarte(true);
  }).catch(function(){ apCarteData = null; apDessinerCarte(true); var msg = el.querySelector(".apc-msg"); if(msg) msg.textContent = trad("Hors ligne : seule ta base est affichée."); });
}
function apReperes(){
  var D = apCarteData, nS = D ? D.secteurs : 2, L = [];
  for(var s = 0; s < nS; s++){
    var A = AP_SECTEURS[apTypeSecteur(s)], ring = apAnneau(s);
    for(var p = 0; p < A.length; p++) if(s === 0 || p === 0) L.push({ s:s, p:p, pnj:true, niv:4 + 6 * ring + (s === 0 ? 6 : 0) + (p % 3), def:3 + 3 * ring + (s === 0 ? 4 : 0) + (p % 2) });
  }
  if(D) D.postes.forEach(function(P){ L.push(P); });
  else L.push({ s:1, p:1, moi:true, pseudo:typeof lirePseudo === "function" ? lirePseudo() : "", niv:apNiveauTotal(), def:apDefense(), bats:(function(){ var b = {}; for(var k in APS.plots) if(APS.plots[k].niv) b[APS.plots[k].id] = APS.plots[k].niv; return b; })() });
  return { nS:nS, L:L };
}
function apDessinerCarte(centrer){
  var el = document.getElementById("apCarte"); if(!el) return;
  var monde = el.querySelector(".apc-monde"), R = apReperes(), h = "";
  for(var s = 0; s < R.nS; s++){ var q = apSpirale(s);
    h += '<img class="apc-sect" src="images/avantposte/secteurs/' + apTypeSecteur(s) + '.webp" alt="" style="left:' + (q[0] * AP_TAILLE_SECTEUR) + 'px;top:' + (q[1] * AP_TAILLE_SECTEUR) + 'px" draggable="false">'; }
  R.L.forEach(function(P, i){
    var q = apSpirale(P.s), pos = AP_SECTEURS[apTypeSecteur(P.s)][P.p]; if(!pos) return;
    var img = P.moi ? "moi" : P.pnj ? "pnj" : P.ruine ? "ruine" : "protege";
    var x = q[0] * AP_TAILLE_SECTEUR + pos[0], y = q[1] * AP_TAILLE_SECTEUR + pos[1];
    h += '<button class="apc-m' + (P.moi ? " moi" : "") + '" data-act="apRepere" data-id="' + i + '" style="left:' + x + 'px;top:' + y + 'px;width:' + AP_TAILLE_REPERE + 'px"><img src="images/avantposte/reperes/' + img + '.webp" alt="" draggable="false">'
      + (P.pnj ? '' : '<span class="apc-nom">' + apEchap(P.pseudo || trad("Sans pseudo")) + '</span>') + '</button>';
    if(P.moi) R.moi = [x, y];
  });
  monde.innerHTML = h; apCarteData && (apCarteData._L = R.L); if(!apCarteData) apCarteHors = R.L;
  if(centrer){ var vue = el.querySelector(".apc-vue"), w = vue.clientWidth, hh = vue.clientHeight, c = R.moi || [AP_TAILLE_SECTEUR / 2, AP_TAILLE_SECTEUR / 2];
    apCarteVue.z = Math.max(0.35, Math.min(1, w / 900)); apCarteVue.x = w / 2 - c[0] * apCarteVue.z; apCarteVue.y = hh / 2 - c[1] * apCarteVue.z; }
  apAppliquerVue();
}
var apCarteHors = null;
function apEchap(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]; }); }
function apAppliquerVue(){ var m = document.querySelector("#apCarte .apc-monde"); if(m) m.style.transform = "translate(" + apCarteVue.x + "px," + apCarteVue.y + "px) scale(" + apCarteVue.z + ")"; }
function apZoom(f, cx, cy){
  var z = Math.max(0.25, Math.min(1.6, apCarteVue.z * f)); f = z / apCarteVue.z;
  apCarteVue.x = cx - (cx - apCarteVue.x) * f; apCarteVue.y = cy - (cy - apCarteVue.y) * f; apCarteVue.z = z; apAppliquerVue();
}
// Glisser (souris ou doigt), pincer pour zoomer, molette sur PC
var apGlisse = null, apDoigts = {};
function apBrancherCarte(el){
  el.addEventListener("pointerdown", function(e){
    var vue = e.target.closest(".apc-vue"); if(!vue) return;
    apDoigts[e.pointerId] = { x:e.clientX, y:e.clientY };
    apGlisse = { x:e.clientX, y:e.clientY, vx:apCarteVue.x, vy:apCarteVue.y, bouge:0 };
    try{ vue.setPointerCapture(e.pointerId); }catch(er){}
  });
  el.addEventListener("pointermove", function(e){
    if(!apDoigts[e.pointerId]) return;
    var ids = Object.keys(apDoigts);
    if(ids.length >= 2){
      var a = apDoigts[ids[0]], b = apDoigts[ids[1]], d0 = Math.hypot(a.x - b.x, a.y - b.y);
      apDoigts[e.pointerId] = { x:e.clientX, y:e.clientY };
      a = apDoigts[ids[0]]; b = apDoigts[ids[1]];
      var d1 = Math.hypot(a.x - b.x, a.y - b.y), r = el.querySelector(".apc-vue").getBoundingClientRect();
      if(d0 > 0) apZoom(d1 / d0, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      if(apGlisse) apGlisse.bouge = 99; return;
    }
    apDoigts[e.pointerId] = { x:e.clientX, y:e.clientY };
    if(!apGlisse) return;
    var dx = e.clientX - apGlisse.x, dy = e.clientY - apGlisse.y;
    apGlisse.bouge = Math.max(apGlisse.bouge, Math.abs(dx) + Math.abs(dy));
    apCarteVue.x = apGlisse.vx + dx; apCarteVue.y = apGlisse.vy + dy; apAppliquerVue();
  });
  var fin = function(e){ delete apDoigts[e.pointerId]; if(!Object.keys(apDoigts).length){ apDernierGlisse = apGlisse ? apGlisse.bouge : 0; apGlisse = null; } };
  el.addEventListener("pointerup", fin); el.addEventListener("pointercancel", fin);
  el.addEventListener("wheel", function(e){ if(!e.target.closest(".apc-vue")) return; e.preventDefault(); var r = el.querySelector(".apc-vue").getBoundingClientRect(); apZoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top); }, { passive:false });
}
var apDernierGlisse = 0;
function apFicheRepere(i){
  var L = apCarteData ? apCarteData._L : apCarteHors, P = L && L[i]; if(!P) return;
  var el = document.querySelector("#apCarte .apc-fiche"); if(!el) return;
  var h = '<button class="apc-fx" data-act="apFicheFermer" aria-label="' + trad("Fermer") + '">✕</button>';
  if(P.pnj){
    h += '<div class="apc-ft"><img class="apc-fi" src="images/avantposte/reperes/pnj.webp" alt=""><div><b>' + trad("Camp de pillards") + '</b><small>' + trad("Niveau {n} · défense {d}", { n:P.niv, d:P.def }) + '</small></div></div>'
      + '<p class="apc-fp">' + (P.s === 0 ? trad("Le centre-ville est tenu par les bandes les plus dangereuses.") : trad("Une bande de pillards s’est installée ici.")) + ' ' + trad("Tu pourras l’attaquer avec le mode pillard, bientôt.") + '</p>';
  } else {
    var av = typeof avatarHtml === "function" ? avatarHtml(P.avatar, P.pseudo || "?", "apc-av") : "";
    h += '<div class="apc-ft">' + av + '<div><b>' + apEchap(P.pseudo || trad("Sans pseudo")) + (P.moi ? ' <span class="apc-toi">' + trad("toi") + '</span>' : '') + '</b><small>' + trad("Niveau {n} · défense {d}", { n:P.niv || 0, d:P.def || 0 }) + '</small></div></div>';
    var b = P.bats || {}, ks = Object.keys(b);
    h += ks.length ? '<div class="apc-bats">' + ks.map(function(k){ return '<span title="' + trad(AP_BAT[k] ? AP_BAT[k].nom : k) + '"><img src="images/avantposte/' + k + '-' + apStade(b[k]) + '.webp" alt=""><i>' + b[k] + '</i></span>'; }).join("") + '</div>' : '<p class="apc-fp">' + trad("Rien de construit pour l’instant.") + '</p>';
    h += '<p class="apc-fp">' + (P.moi ? trad("Ton avant-poste. Il est protégé : personne ne peut le piller.") : P.ruine ? trad("Abandonné depuis {n} jours : c’est une ruine.", { n:P.absent || 30 }) : trad("Avant-poste protégé : il ne peut pas être pillé.")) + '</p>';
  }
  el.innerHTML = h; el.classList.add("on");
}
document.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest("[data-act]"); if(!b) return;
  var a = b.getAttribute("data-act");
  if(a === "apCarte"){ openCarte(); return; }
  if(a === "apCarteFermer"){ var el = document.getElementById("apCarte"); if(el) el.style.display = "none"; return; }
  if(a === "apFicheFermer"){ var f = document.querySelector("#apCarte .apc-fiche"); if(f) f.classList.remove("on"); return; }
  if(a === "apRepere"){ if(apDernierGlisse > 6){ apDernierGlisse = 0; return; } apFicheRepere(+b.getAttribute("data-id")); return; }
});
// Au lancement : relire le jour d'accès (réglage de l'administration)
setTimeout(function(){ try{ if(AVANTPOSTE_ACTIF && !apLocal()) apAppel({ action:"reglage" }).then(function(d){ if(d && d.jour){ apNoterJour(d.jour); if(typeof render === "function" && typeof G !== "undefined" && G && G.ph === "game") render(); } }).catch(function(){}); }catch(e){} }, 2500);
// Envoi régulier de son avant-poste (au lancement, puis au plus toutes les 10 min quand il change)
setTimeout(function(){ try{ if(AVANTPOSTE_ACTIF && APS.debloque) apEnvoyer(false); }catch(e){} }, 5000);

/* ---------- Guide du survivant : une règle de plus (thème « Progresser ») ---------- */
if(AVANTPOSTE_ACTIF && typeof reglesGuide === "function"){
  var apReglesOrigine = reglesGuide;
  reglesGuide = function(){
    var R = apReglesOrigine.apply(this, arguments);
    R.push(["L’avant-poste", "🏕️", "À partir du jour " + AP.jour + ", une nouvelle pièce s’ouvre : l’avant-poste. Sur ses 15 emplacements (" + AP.libres + " au départ, 2 de plus par niveau de palissade), tu construis des bâtiments avec les matériaux du refuge : citerne, serre, scierie, palissade, entrepôt, infirmerie, forge, poste radio, tour de guet, garage, planque et pièges. Chacun a 5 niveaux ; un chantier dure de 10 minutes à 24 heures en temps réel, un seul à la fois (une pub peut diviser le temps restant par deux, " + AP.pubs + " fois par jour). Les bâtiments produisent même quand tu ne joues pas : touche le feu de camp pour tout rapporter au refuge. Toutes les 8 heures, des zombies ou des pillards peuvent attaquer : palissade, tour et pièges le défendent, la planque et la radio limitent les pertes. L’avant-poste t’appartient : il survit à la mort de ta famille."]);
    return R;
  };
  if(typeof THEMES_GUIDE !== "undefined") THEMES_GUIDE.forEach(function(T){ if(T[0] === "Progresser") T[2].push("L’avant-poste"); });
}

/* ---------- Traduction anglaise de ce fichier ---------- */
if(typeof TRADUCTIONS !== "undefined"){
  TRADUCTIONS.en = TRADUCTIONS.en || {};
  Object.assign(TRADUCTIONS.en, {
    "Citerne":"Cistern", "Serre":"Greenhouse", "Scierie":"Sawmill", "Palissade":"Palisade", "Entrepôt":"Storehouse", "Infirmerie":"Infirmary", "Forge":"Forge", "Poste radio":"Radio post", "Tour de guet":"Watchtower", "Garage":"Garage", "Planque":"Hideout", "Pièges":"Traps", "Charrette":"Cart", "Atelier de siège":"Siege workshop",
    "Recueille l’eau de pluie dans des tonneaux, puis une vraie cuve.":"Collects rainwater in barrels, then in a real tank.",
    "Légumes et champignons à l’abri ; des herbes fraîches à partir du niveau 3.":"Vegetables and mushrooms under cover; fresh herbs from level 3.",
    "Débite le bois mort des environs en planches.":"Cuts the dead wood around into planks.",
    "Protège l’avant-poste. Chaque niveau ouvre aussi 2 emplacements de plus.":"Protects the outpost. Each level also opens 2 more plots.",
    "Ce que l’avant-poste peut garder de chaque ressource avant que la production s’arrête.":"How much of each resource the outpost can hold before production stops.",
    "Prépare des bandages avec ce qu’on trouve.":"Makes bandages from whatever is found.",
    "Récupère le métal : clous et ferraille.":"Salvages metal: nails and scrap.",
    "Écoute les pillards et prévient des attaques : moins de pertes.":"Listens to the raiders and warns of attacks: fewer losses.",
    "Repère les assaillants de loin.":"Spots attackers from afar.",
    "Siphonne les épaves du quartier : de l’essence pour la voiture.":"Siphons the neighborhood’s wrecks: fuel for the car.",
    "Une part du stock est cachée et ne peut pas être volée.":"Part of the stock is hidden and can’t be stolen.",
    "Blessent les assaillants avant qu’ils n’atteignent la palissade.":"Wound attackers before they reach the palisade.",
    "Pour ramener le butin des pillages.":"To bring back loot from raids.", "Pour enfoncer les défenses des autres avant-postes.":"To break through other outposts’ defenses.",
    "{n} ration d’eau":"{n} water ration", "{n} rations d’eau":"{n} water rations", "{n} ration de nourriture":"{n} food ration", "{n} rations de nourriture":"{n} food rations",
    "L’avant-poste est débloqué !":"The outpost is unlocked!", "Une nouvelle pièce t’attend : construis, récolte, défends.":"A new room awaits you: build, harvest, defend.",
    "Chantier terminé":"Construction finished", "{b} niveau {n}":"{b} level {n}", "Ton avant-poste a été attaqué":"Your outpost was attacked",
    "Attaque repoussée (force {f} contre défense {d})":"Attack repelled (strength {f} vs defense {d})",
    "Les pillards ont pris une partie du stock (force {f} contre défense {d})":"Raiders took part of the stock (strength {f} vs defense {d})",
    "Le camp":"The camp", "Chantier":"Construction", "Construire":"Build", "Pas encore construit":"Not built yet",
    "+{n} par jour":"+{n} per day", "+1 tous les {n} jours":"+1 every {n} days", "Défense +{n}":"Defense +{n}", "Stock : {n} par ressource":"Stock: {n} per resource",
    "Pertes −{n} % lors d’une attaque":"Losses −{n}% during an attack", "{n} % du stock à l’abri":"{n}% of the stock hidden",
    "L’avant-poste":"The outpost", "défense":"defense", "niveaux construits":"levels built", "emplacements":"plots",
    "À récolter":"To harvest", "{n} au plus par ressource":"{n} max per resource",
    "Rien pour l’instant : construis une citerne, une serre ou une scierie pour produire.":"Nothing yet: build a cistern, a greenhouse or a sawmill to produce.",
    "Récolter pour le refuge":"Harvest for the refuge", "Rien à récolter":"Nothing to harvest", "Pendant une partie seulement":"During a game only",
    "Une ressource est pleine : sa production est arrêtée. Récolte ou agrandis l’entrepôt.":"A resource is full: its production has stopped. Harvest or upgrade the storehouse.",
    "Fini dans {t}":"Done in {t}", "force {f} contre défense {d}":"strength {f} vs defense {d}", "Attaques":"Attacks", "repoussée":"repelled", "perdue":"lost",
    "Aucune attaque pour l’instant. Toutes les 8 h, des zombies ou des pillards peuvent venir : palissade, tour et pièges le défendent.":"No attacks yet. Every 8 h, zombies or raiders may come: palisade, tower and traps defend it.",
    "L’avant-poste t’appartient : il produit même quand tu ne joues pas et survit à la mort de ta famille. La carte et le mode pillard arriveront bientôt.":"The outpost is yours: it produces even when you’re not playing and survives your family’s death. The map and raider mode are coming soon.",
    "il y a {n} min":"{n} min ago", "il y a {n} h":"{n} h ago", "il y a {n} j":"{n} d ago",
    "Emplacement verrouillé":"Locked plot", "Monte la palissade au niveau {n} pour ouvrir cet emplacement.":"Raise the palisade to level {n} to open this plot.",
    "{b} en construction":"{b} under construction", "Emplacement libre":"Free plot", "bientôt (mode pillard)":"coming soon (raider mode)",
    "Niveau {n} / 5":"Level {n} / 5", "Niveau maximum atteint":"Maximum level reached", "Niveau {n}":"Level {n}", "Niveau 1":"Level 1",
    "Un seul chantier à la fois":"One construction at a time", "Il manque {l}":"Missing {l}", "Améliorer":"Upgrade",
    "Chantier : niveau {n}":"Construction: level {n}", "Accélérer le chantier":"Speed up construction", "Plus de pub aujourd’hui":"No more ads today",
    "Une courte pub divise le temps restant par deux · encore {n} aujourd’hui":"A short ad halves the remaining time · {n} left today",
    "Le chantier commence : {b} niveau {n}.":"Construction starts: {b} level {n}.", "Rapporté au refuge : {l}.":"Brought back to the refuge: {l}.",
    "Publicité (simulation)":"Ad (simulation)", "Ici s’affichera plus tard une vraie pub récompensée.":"A real rewarded ad will show here later.",
    "Pub en cours… {n} s":"Ad playing… {n} s", "La carte":"The map", "Toi":"You", "Protégé":"Protected", "Pillards":"Raiders", "Ruine":"Ruin", "Fermer":"Close", "Chargement de la carte…":"Loading the map…", "Hors ligne : seule ta base est affichée.":"Offline: only your base is shown.", "(Test sur l’ordinateur : rien n’est envoyé au serveur.)":"(Testing on the computer: nothing is sent to the server.)", "Sans pseudo":"No username", "Camp de pillards":"Raider camp", "Niveau {n} · défense {d}":"Level {n} · defense {d}", "Le centre-ville est tenu par les bandes les plus dangereuses.":"The city center is held by the most dangerous gangs.", "Une bande de pillards s’est installée ici.":"A raider gang has settled here.", "Tu pourras l’attaquer avec le mode pillard, bientôt.":"You’ll be able to attack it with raider mode, soon.", "toi":"you", "Rien de construit pour l’instant.":"Nothing built yet.", "Ton avant-poste. Il est protégé : personne ne peut le piller.":"Your outpost. It’s protected: nobody can loot it.", "Abandonné depuis {n} jours : c’est une ruine.":"Abandoned for {n} days: it’s a ruin.", "Avant-poste protégé : il ne peut pas être pillé.":"Protected outpost: it can’t be looted.", "Voir la carte":"See the map", "Les avant-postes des autres survivants et les camps de pillards":"Other survivors’ outposts and raider camps", "Récompense prête !":"Reward ready!", "Récupérer la récompense":"Collect the reward", "Chantier accéléré !":"Construction sped up!"
  });
  if(typeof TRAD_ECRAN !== "undefined") Object.assign(TRAD_ECRAN, { "Avant-poste":"Outpost", "L’avant-poste":"The outpost" });
}
if(typeof REGLES_EN !== "undefined") REGLES_EN["L’avant-poste"] = "From day {#}, a new room opens: the outpost. On its {#} plots ({#} at the start, {#} more per palisade level), you build with materials from the refuge: cistern, greenhouse, sawmill, palisade, storehouse, infirmary, forge, radio post, watchtower, garage, hideout and traps. Each has {#} levels; a construction takes from {#} minutes to {#} hours in real time, one at a time (an ad can halve the remaining time, {#} times a day). Buildings produce even when you’re not playing: tap the campfire to bring everything back to the refuge. Every {#} hours, zombies or raiders may attack: palisade, tower and traps defend it, the hideout and the radio limit losses. The outpost is yours: it survives your family’s death.";
