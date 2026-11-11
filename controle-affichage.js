/* =====================================================================
   controle-affichage.js : outil de vérification (pas chargé par le jeu).
   À lancer dans le navigateur de test avant chaque publication :
   controleAffichage() renvoie la liste des problèmes d'affichage de
   l'écran actuel (chevauchements, textes coupés, débordements).
   ===================================================================== */
function controleAffichage(){
  var pb = [], vw = window.innerWidth, vh = window.innerHeight;
  function vis(e){ var r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden" && +s.opacity > 0; }
  function rect(e){ return e.getBoundingClientRect(); }
  function chevauche(a, b){ return a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1; }
  function nom(e){ return (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : e.tagName.toLowerCase()) + " « " + (e.innerText || e.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 20) + " »"; }
  function groupe(liste, quoi){
    var el = liste.filter(vis);
    for(var i = 0; i < el.length; i++) for(var j = 0; j < i; j++) if(chevauche(rect(el[i]), rect(el[j]))) pb.push(quoi + " : " + nom(el[i]) + " chevauche " + nom(el[j]));
  }
  function q(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }
  // 1) pas de défilement horizontal
  if(document.documentElement.scrollWidth > vw + 1) pb.push("Défilement horizontal : page de " + document.documentElement.scrollWidth + " px pour un écran de " + vw);
  // 1 bis) une fenêtre ne doit pas défiler de côté, et la page ne doit pas recevoir de style d'un autre élément (bug « .pc » du 2026-11-10)
  q("#modal .sheet").filter(vis).forEach(function(sh){ if(sh.scrollWidth > sh.clientWidth + 2) pb.push("La fenêtre défile de côté (" + sh.scrollWidth + " px pour " + sh.clientWidth + ")"); });
  var sb = getComputedStyle(document.body); if(parseFloat(sb.borderTopWidth) > 0 || sb.whiteSpace === "nowrap") pb.push("La page a une bordure ou du texte sans retour à la ligne (style d'un autre élément ?)");
  // 2) en-tête : titre, chapitre et pastilles ne se chevauchent pas
  var entete = document.querySelector("#app > .row");
  if(entete){
    groupe([entete.querySelector(".titre") || entete.querySelector("h1")].concat(q("#app > .row:first-child .chip, #app > .row:first-child .pill, #app > .row:first-child .mode")).filter(Boolean), "En-tête");
    q("#app > .row:first-child h1").forEach(function(h){ if(h.scrollWidth > h.clientWidth + 1) pb.push("Titre coupé : " + nom(h)); });
    q(".titre").forEach(function(t){ var rt = rect(t); Array.prototype.forEach.call(t.children, function(c){ if(vis(c) && rect(c).right > rt.right + 1) pb.push("Dépasse de la colonne du titre : " + nom(c)); }); });
    q(".chapcourt").forEach(function(c){ if(vis(c) && c.scrollWidth > c.clientWidth + 1) pb.push("Ligne du chapitre coupée : " + nom(c)); });
  }
  // 3) éléments qui sortent de l'écran
  q("#app .btn, #app .chip, #app .mc, #app h1, .chapcourt").filter(vis).forEach(function(e){ var r = rect(e); if(r.left < -1 || r.right > vw + 1) pb.push("Hors de l'écran : " + nom(e)); });
  // 4) cartes, boutons, étiquettes de la pièce
  groupe(q(".mc"), "Cartes");
  groupe(q("#app .acts .btn"), "Boutons du bas");
  var etiq = q("#piece .etiq");
  if(etiq.length){ var montrees = etiq.map(function(e){ return e; }); for(var i = 0; i < montrees.length; i++) for(var j = 0; j < i; j++) if(chevauche(rect(montrees[i]), rect(montrees[j]))) pb.push("Étiquettes de la pièce : " + nom(montrees[i]) + " chevauche " + nom(montrees[j])); }
  // 5) textes coupés dans les boutons et pastilles
  q("#app .btn, #app .chip, .mc b, #sheet .btn, #sheet .loc b, #sheet .mt b").filter(vis).forEach(function(e){ if(e.scrollWidth > e.clientWidth + 2) pb.push("Texte coupé : " + nom(e)); });
  // 5 ter) boutons collés l'un au-dessus de l'autre (moins de 6 px entre eux : les boutons ont une ombre de 3 px)
  var bts = q("#sheet .btn").filter(vis).map(function(e){ return [e, rect(e)]; });
  bts.forEach(function(A){ bts.forEach(function(B){ if(A[0] === B[0]) return; var a = A[1], b = B[1], gap = b.top - a.bottom;
    if(gap >= -1 && gap < 6 && Math.min(a.right, b.right) - Math.max(a.left, b.left) > 20) pb.push("Boutons collés : " + nom(A[0]) + " / " + nom(B[0])); }); });
  // 5 bis) icônes peintes agrandies par erreur (une règle « img » d'un cadre qui les étire), images qui débordent de leur carte
  q("img.ico-img").filter(vis).forEach(function(e){ var r = rect(e), fs = parseFloat(getComputedStyle(e.parentElement).fontSize) || 16; if(r.width > Math.max(70, fs * 3.2)) pb.push("Icône géante : " + (e.alt || e.getAttribute("src").split("/").pop()) + " dans " + nom(e.parentElement)); });
  q("#sheet .carte-lieu, #sheet .op-carte").filter(vis).forEach(function(c){ var rc = rect(c); Array.prototype.forEach.call(c.querySelectorAll("img"), function(i){ var ri = rect(i); if(ri.width && (ri.right > rc.right + 2 || ri.left < rc.left - 2)) pb.push("Image qui déborde de sa carte : " + nom(c)); }); });
  // 6) zone centrale qui déborde
  var st = document.querySelector(".stage"); if(st && st.scrollHeight > st.clientHeight + 1) pb.push("La zone centrale déborde de " + (st.scrollHeight - st.clientHeight) + " px");
  // 7) les boutons du bas ont la même largeur
  var larg = q("#app .acts .btn:not(.bt-pieces)").filter(vis).map(function(b){ return Math.round(rect(b).width); });
  if(larg.length > 1 && Math.max.apply(null, larg) - Math.min.apply(null, larg) > 2) pb.push("Boutons du bas de tailles différentes : " + larg.join(", "));
  // 8) fenêtre ouverte qui dépasse de l'écran
  var sh = document.querySelector("#modal"); if(sh && sh.style.display === "flex"){ var r = rect(document.getElementById("sheet")); if(r.top < 0) pb.push("La fenêtre dépasse en haut de l'écran"); }
  // 9) le menu tient sans faire défiler
  if(sh && sh.style.display === "flex" && document.querySelector("#sheet .menugrille")){ var f = document.getElementById("sheet"); if(f.scrollHeight > f.clientHeight + 1) pb.push("Le menu défile (" + f.scrollHeight + " / " + f.clientHeight + " px)"); }
  return pb;
}

/* Parcourt les écrans principaux et renvoie les problèmes trouvés sur chacun.
   Utilisation : await toutControler() (à relancer pour chaque taille d'écran). */
async function toutControler(){
  var q = function(s){ return document.querySelector(s); }, att = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }, res = {};
  if(q("[data-act=nouvelle]")) q("[data-act=nouvelle]").click();
  if(typeof fermerAstuce === "function") fermerAstuce(true);
  nouvellePartie(graineDuJour()); G.ph = "intro"; render(); await att(150); res.intro = controleAffichage();
  G.ph = "famille"; G.famille = familleRetenue(); render(); await att(150); res.famille = controleAffichage();
  nouvellePartie(graineDuJour()); render(); await att(150); res.depart = controleAffichage();
  G.pack = { bidon:2, conserves:1, couteau:1, lampe:1 }; demarrer(); G.day = 12; G.chap = 4; G.chien = { nom:"Rex", faim:1 }; G.ref.barr = 1;
  render(); await att(300); var p = document.getElementById("piece"); if(p) p.classList.add("montrer"); res.principal = controleAffichage();
  if(typeof allerPiece === "function"){ for(var kp = 1; kp < PIECES.length; kp++){ allerPiece(kp); await att(200); res["piece_" + PIECES[kp].id] = controleAffichage(); } allerPiece(0); await att(150); }
  G.sel = [0]; render(); await att(150); res.selection = controleAffichage(); G.sel = []; render();
  // Combat avec 3 zombies (portraits peints) et 2 membres
  G.sel = [0, 1]; G.exp = { lieu:0, equipe:[0, 1], notes:[], mult:1, d:0, voiture:false }; G.sel = [];
  G.combat = { zombies:[0, 3, 4, 5, 6].map(function(k){ return ZOMBIES[k]; }).map(function(t){ return { id:t.id, nom:t.nom, icone:t.icone, pv:t.pv, pvMax:t.pv, degats:t.degats }; }), tour:1, journal:[], resume:[], fin:null };
  openCombat(); await att(100); res.combat = controleAffichage(); jouerTour({ 0:{ a:"tete", cible:0 }, 1:{ a:"pousser", cible:1 } }); openCombat(); await att(100); res.combatTour = controleAffichage(); G.combat.zombies.forEach(function(z, k){ if(k < 4) z.pv = 0; }); G.combat.zombies[4].pv = 0; G.combat.fin = "victoire"; openCombat(); await att(100); res.combatFin = controleAffichage(); hide(); G.combat = null; G.exp = null;
  openNuit([["g2", "🧟 Attaque de nuit repoussée (force 4 contre votre défense 5)."], ["", "🐕 Rex a mangé sa ration."], ["g2", "🥕 Le potager a donné 1 ration de nourriture."], ["b2", "🥶 Nuit glaciale : on dort mal."]]); await att(100); res.nuit = controleAffichage(); hide();
  G.sel = [0]; openLoc(); await att(100); res.lieux = controleAffichage(); hide(); G.sel = [];
  openResultat({ lieu:2, notes:[["g2", "🔦 Papa éclaire les lieux avec la lampe torche."]], pris:[{ id:"conserve", n:2 }, { id:"bandage", n:1 }], laisses:[], vide:false }); await att(100); res.resultat = controleAffichage(); hide();
  if(typeof openElement === "function"){ openElement("pot"); await att(80); res.potager = controleAffichage(); ajouter("poule", 2); openPoules(); await att(80); res.poulailler = controleAffichage(); hide(); }
  if(typeof openPeche === "function"){ var ie = LIEUX.findIndex(function(L){ return L.peche; }); G.exp = { lieu:ie, equipe:[0, 1], notes:[], mult:1, d:0, voiture:false, peche:{ lancers:3, faits:1, prises:1 } }; openPeche(); await att(100); res.peche = controleAffichage(); clearTimeout(minPeche); phasePeche = null; hide(); G.exp = null; }
  if(typeof openFeu === "function"){ openFeu(); await att(80); res.feu = controleAffichage(); hide(); }
  var evp = EVENEMENTS.find(function(e){ return e.titre.indexOf("pillards") >= 0; }); G.day = Math.max(G.day, 8); openEvent(evp); await att(100); res.evenement = controleAffichage(); hide(); G.ev = null; G.evIdx = null;
  if(typeof openStock === "function"){ ajouter("couteau", 1); ajouter("planche", 5); var cou = G.stock.o.filter(function(o){ return o.id === "couteau"; })[0]; filtreStock = "tout"; selStock = "o:" + cou.uid; openStock(); await att(100); res.stock = controleAffichage(); selStock = null; hide(); }
  if(typeof selRef !== "undefined"){ ajouter("chiffon", 4); selRef = "c:0"; openRef("fabriquer"); await att(100); res.fabriquer = controleAffichage(); selRef = "b:barr"; openRef("construire"); await att(100); res.construire = controleAffichage(); ["pates","epices","huile","farine"].forEach(function(k){ ajouter(k, 2); }); ajouter("planche", 4); cuisiner(0); cuisiner(3); ongletRef = "cuisine"; selRef = "k:0"; openRef(); await att(100); res.cuisine = controleAffichage(); G.m[0].faim = 30; openSoins(0); await att(80); res.soinsPlats = controleAffichage(); selRef = null; hide(); }
  if(typeof openDormir === "function"){ openDormir(); await att(80); res.dormir = controleAffichage(); hide(); } if(typeof openRencontre === "function"){ G.rencontre = { id:"barrage", noeud:"debut", equipe:[0, 1], apres:{ lieu:0, notes:[], pris:[], laisses:[], vide:false }, texte:null, lignes:[] }; openRencontre(); await att(100); res.rencontre = controleAffichage(); choisirRencontre(2); openRencontre(); await att(80); res.rencontreFin = controleAffichage(); G.rencontre = null; hide(); } if(typeof openSacrifice === "function"){ var sv = JSON.stringify(G.stock), sr = JSON.stringify(G.reste); G.stock.n = {}; G.stock.o = G.stock.o.filter(function(o){ return !OBJETS[o.id].plat; }); G.reste.nour = 0; G.m[0].faim = 5; openDormir(); await att(80); res.dormirSacrifice = controleAffichage(); openSacrifice(); await att(80); res.sacrifice = controleAffichage(); openSacrifice(1); await att(60); res.sacrificeOui = controleAffichage(); G.stock = JSON.parse(sv); G.reste = JSON.parse(sr); G.m[0].faim = 80; G.m[1].folie = 45; openMembre(1); await att(60); res.membreFolie = controleAffichage(); G.m[1].folie = 0; hide(); }
  openInfo("def"); await att(50); res.infoDefense = controleAffichage(); openInfo("eau"); await att(50); res.infoEau = controleAffichage(); openInfo("moral"); await att(50); res.infoMoral = controleAffichage(); ajouter("bandage", 2); openInfo("soin"); await att(50); res.infoSoin = controleAffichage(); if(typeof openInviter === "function"){ openInviter(); await att(60); res.inviter = controleAffichage(); var c0 = lireColis(), b0 = lireBonus(); ecrireColis(1); ecrireBonus([]); openLargage(); await att(1800); res.largage = controleAffichage(); ecrireBonus(["survie", "trousse"]); openSacBonus(); await att(60); res.sacBonus = controleAffichage(); ecrireColis(c0); ecrireBonus(b0); openSaisieCode("BL615"); await att(60); res.saisieCode = controleAffichage(); hide(); } if(typeof afficherClans === "function"){ var mb = [{ id:"moi", vrai:"a1234567", pseudo:"Fabien", jour:120, vu:Date.now(), chef:true, moi:true }]; for(var kc = 1; kc < 5; kc++) mb.push({ id:"x" + kc, vrai:"x" + kc + "234567", pseudo:"Survivant" + kc, jour:100 + kc, vu:Date.now() - kc * 86400000, chef:false, moi:false }); var lc = []; for(var kl = 0; kl < 6; kl++) lc.push({ id:"c" + kl, nom:"Clan des Survivants " + kl, blason:kl + 1, membres:kl % 6, chef:"ChefNumero" + kl, jours:400 + kl }); etatClans = { jourMin:100, clans:lc, monClan:null }; var jd = G.day; G.day = 120; afficherClans(); await att(60); res.clans = controleAffichage(); etatClans.monClan = { id:"c9", nom:"Les Loups du Nord", blason:1, membres:5, chef:"Fabien", jours:620, chefId:true, membresListe:mb }; afficherClans(); await att(60); res.monClan = controleAffichage(); openCreerClan(); await att(60); res.creerClan = controleAffichage(); etatBastion = { reserve:{ planche:40, conserve:12, bidon:3, ferraille:8, clous:6, alcool:2, trousse:1, balle:20, riz:2, chiffon:5, pates:4 }, def:{ remparts:2, mines:3, tours:1 }, couts:{ remparts:{ planche:18, ferraille:6 }, mines:{ ferraille:2, clous:2, alcool:1 }, tours:{ planche:16, clous:8 } }, max:{ remparts:5, mines:10, tours:3 }, journal:[{ t:Date.now(), qui:"Fabien", txt:"a déposé 10 planche" }, { t:Date.now() - 7200000, qui:"Survivant1", txt:"a construit : tours (niveau 1)" }], retraitsRestants:3, deposables:["bidon", "conserve", "planche", "ferraille", "clous"] }; ajouter("planche", 4); ajouter("ferraille", 2); ongletBastion = "reserve"; afficherBastion(); await att(60); res.bastionReserve = controleAffichage(); ongletBastion = "defenses"; afficherBastion(); await att(60); res.bastionDefenses = controleAffichage(); ongletBastion = "journal"; afficherBastion(); await att(60); res.bastionJournal = controleAffichage(); var cbl = []; for(var kg = 0; kg < 5; kg++) cbl.push({ id:"e" + kg, pseudo:"Adversaire" + kg, jour:110 + kg, attaquee:kg === 1 }); var asl = []; for(var ka = 0; ka < 6; ka++) asl.push({ jour:1 + (ka % 3), qui:"Survivant" + ka, cible:"Adversaire" + ka, nous:ka % 2 === 0, etoiles:ka % 4 }); etatGuerre = { complet:true, chef:true, recherche:false, bilan:{ gagnees:2, perdues:1, nulles:0 }, guerre:{ id:"w1", jour:2, fini:false, gagnant:null, finJour:Date.now() + 7200000, fin:Date.now() + 90000000, nous:{ nom:"Les Loups du Nord", blason:1, etoiles:7 }, eux:{ nom:"Le Bastion Rouge", blason:5, etoiles:5, remparts:3, mines:4 }, cibles:cbl, dejaMoi:false, assauts:asl } }; afficherGuerre(); await att(60); res.guerre = controleAffichage(); etatGuerre = { complet:true, chef:true, recherche:false, bilan:null, guerre:null, derniere:null }; afficherGuerre(); await att(60); res.guerreSans = controleAffichage(); if(typeof openCadres === "function"){ openCadres(); await att(60); res.cadres = controleAffichage(); } G.day = jd; hide(); } if(typeof openStats === "function"){ G.stats.zombies = 123; ongletStats = "partie"; openStats(); await att(60); res.statsPartie = controleAffichage(); ongletStats = "toutes"; openStats(); await att(60); res.statsToutes = controleAffichage(); openMenu(); await att(60); res.menu = controleAffichage(); var sh = document.getElementById("sheet"); if(sh.scrollHeight > sh.clientHeight + 2) res.menu = (res.menu || []).concat(["Le menu défile"]); } hide();
  q("[data-act=sel][data-id='1']").click(); await att(100); res.ficheOuSelection = controleAffichage(); hide(); G.sel = []; render(); await att(100);
  q("[data-act=fouille]").click(); await att(100); res.quiPart = controleAffichage(); hide();
  q("[data-act=refuge]").click(); await att(100); res.refuge = controleAffichage(); hide();
  ajouter("batterie", 1); ajouter("roue", 1); openRef("voiture"); await att(150); res.voiture = controleAffichage(); hide();
  openMenu(); await att(50); res.menu = controleAffichage(); q("[data-act=guide]").click(); await att(100); res.guide = controleAffichage(); hide();
  q(".chapcourt").click(); await att(100); res.chapitre = controleAffichage(); hide();
  Object.keys(localStorage).filter(function(k){ return k.indexOf("survival") === 0; }).forEach(function(k){ localStorage.removeItem(k); });
  var pb = {}; for(var k in res) if(res[k].length) pb[k] = res[k];
  return innerWidth + "x" + innerHeight + " : " + (Object.keys(pb).length ? JSON.stringify(pb) : "aucun problème");
}

// Pièces qu'on fait défiler : la barre (flèches + points) ne doit cacher aucune étiquette, chaque pièce doit avoir des zones visibles
async function verifNav(){
  var att = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }, pb = [];
  if(typeof fermerAstuce === "function") fermerAstuce(true); hide();
  nouvellePartie(null); G.pack = { bidon:1, peluche:1, radio:1, cartes:1, photo:1 }; demarrer(); G.chien = { nom:"Rex", faim:0 }; G.ref.barr = 1; render(); await att(200);
  for(var k = 0; k < PIECES.length; k++){
    allerPiece(k); await att(150); document.getElementById("piece").classList.add("montrer");
    var n = document.querySelector("#piece .navpieces"); if(!n){ pb.push(PIECES[k].id + " : pas de barre"); continue; }
    var a = n.getBoundingClientRect();
    if(a.left < 0 || a.right > innerWidth) pb.push(PIECES[k].id + " : barre hors de l'écran");
    document.querySelectorAll("#piece .zone .etiq").forEach(function(e){ var b = e.getBoundingClientRect(); if(a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) pb.push(PIECES[k].id + " : " + e.textContent.trim()); });
    if(!document.querySelectorAll("#piece .zone").length) pb.push(PIECES[k].id + " : aucune zone visible");
  }
  allerPiece(0);
  Object.keys(localStorage).filter(function(k){ return k.indexOf("survival") === 0; }).forEach(function(k){ localStorage.removeItem(k); });
  return innerWidth + "x" + innerHeight + " pièces : " + (pb.length ? JSON.stringify(pb) : "aucun problème");
}
