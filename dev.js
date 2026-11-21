/* =====================================================================
   dev.js : MODE DEV pour la revue visuelle (2026-11-16, demande de Fabien). JAMAIS publié (absent de preparer-site.py).
   S'utilise seulement sur la copie de test (localhost), qui n'envoie rien au serveur : rien n'apparaît au classement.
   Dans la console du navigateur de test :
     devPartie()         → partie « pleine » : jour 64, famille équipée, tous les objets, voiture réparée, feu, chien,
                           poules, refuge au maximum, mission, marché, zombie célèbre, trophée, tombe, avant-poste complet
     DEV_ECRANS          → la liste des écrans (nom, fonction qui l'ouvre)
     await devEcran(k)   → ouvre l'écran k (numéro ou nom) et renvoie les problèmes de controleAffichage()
     await devTout()     → passe tous les écrans et renvoie ceux qui ont un problème
   Nécessite controle-affichage.js (chargé automatiquement).
   ===================================================================== */
(function(){
  if(!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)){ console.warn("dev.js : seulement en local"); return; }
  if(typeof controleAffichage !== "function"){ var s = document.createElement("script"); s.src = "controle-affichage.js?" + Date.now(); document.head.appendChild(s); }
})();
var devAtt = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };

function devPartie(){
  if(typeof fermerAstuce === "function") fermerAstuce(true);
  try{ localStorage.setItem("survival_astuces", JSON.stringify({ off:true })); }catch(e){}
  if(typeof hide === "function") hide();
  nouvellePartie(null); G.pack = { bidon:2, conserves:2, peluche:1, radio:1, cartes:1, photo:1 }; G.famille = familleRetenue(); demarrer();
  G.day = 64; G.chap = 6; G.score = 230; G.moral = 72;
  // Tous les objets du jeu
  Object.keys(OBJETS).forEach(function(id){ var o = OBJETS[id]; ajouter(id, o.sol ? 1 : (o.place ? 4 : 3), 1); });
  ajouter("planche", 20); ajouter("clous", 10); ajouter("ferraille", 8); ajouter("chiffon", 6); ajouter("alcool", 4); ajouter("balle", 12); ajouter("cartouche", 6);
  G.reste = { eau:6, nour:5 };
  // Famille équipée, états variés (pour voir les portraits fatigué / blessé)
  var arme = function(id){ var o = G.stock.o.filter(function(x){ return x.id === id; })[0]; return o ? o.uid : null; };
  var eqs = [["hache", "lampe", "sacoche"], ["pistolet", "outils", null], ["batte", "torche", "sacados"], ["couteau", "canne", null]];
  G.m.forEach(function(x, k){ var e = eqs[k]; ["arme", "outil", "sac"].forEach(function(sl, j){ var u = e[j] && arme(e[j]); if(u != null) equiper(k, sl, u); }); });
  G.m[0].hp = 92; G.m[0].en = 80; G.m[1].hp = 35; G.m[1].en = 60; G.m[2].en = 25; G.m[3].hp = 70; G.m[3].en = 95; G.m[3].faim = 22;
  G.m.forEach(function(x){ x.xp = { zombies:40, fouilles:25, crochetages:6, travaux:18, plats:12, blessures:3 }; });
  // Refuge, animaux, voiture, feu
  G.ref = { barr:3, eau:2, pot:1 }; G.chien = { nom:"Rex", faim:0 }; ajouter("poule", 3);
  if(typeof VOITURE !== "undefined") VOITURE.pieces.forEach(function(p){ G.voiture.installees[p.id || p] = true; }); G.voiture.essence = 14;
  G.feu = true; G.braises = 2; G.cuisineJour = G.day;
  // Monde : mission, marché, zombie célèbre, trophée, tombe, lettre
  try{ G.mission = { id:MISSIONS[0].id, fin:G.day + 3, lieu:2 }; }catch(e){}
  try{ if(typeof genererMarche === "function") genererMarche(); }catch(e){}
  try{ var cel = ZOMBIES.filter(function(z){ return z.celebre; }); if(cel[0]) G.celebre = { id:cel[0].id, lieu:3, pv:40, pvMax:60, depuis:G.day - 2 }; if(cel[1]) G.trophees = [{ id:cel[1].id, nom:cel[1].nom, jour:40, par:G.m[0].nom }]; }catch(e){}
  G.dd = [{ n:"Yanis", r:"Yanis", c:"mort de soif", j:31, ic:"🧑" }];
  for(var i = 0; i < G.lieux.length; i++) if(LIEUX[i].secret) G.decouverts[i] = true;
  // Avant-poste complet
  if(typeof APS !== "undefined" && typeof AP_BAT !== "undefined"){
    APS.debloque = true; APS.plots = {}; var ids = Object.keys(AP_BAT), k = 0;
    AP.plots.forEach(function(_, i){ if(ids[k]){ APS.plots[i] = { id:ids[k], niv:[1, 3, 5, 2, 4][k % 5] }; k++; } });
    APS.acc = { eau:7, nour:4, planche:9, herbes:2, bandage:3, clous:5, ferraille:4, jerrican:1 }; APS.chantier = null;
    APS.log = [{ t:Date.now() - 3600e3 * 5, pvp:true, ok:false, par:"Snake", pertes:{ eau:2, planche:1 } }, { t:Date.now() - 3600e3 * 30, espion:true, par:"Kader", ok:true, pertes:{} }, { t:Date.now() - 3600e3 * 50, pvp:false, ok:true, force:7, def:12, pertes:{} }];
    if(typeof apSauver === "function") apSauver();
  }
  if(typeof sauver === "function") sauver();
  render();
  return "Partie dev prête : jour " + G.day + ", " + G.stock.o.length + " objets uniques, " + Object.keys(G.stock.n).length + " sortes empilables";
}

// La liste des écrans : [nom, fonction] ; chaque fonction ouvre son écran (après devPartie)
var DEV_ECRANS = [
  ["principal", function(){ hide(); if(typeof allerPiece === "function") allerPiece(0); render(); }],
  ["pieces", function(){ openPieces(); }],
  ["menu", function(){ openMenu(); }],
  ["guide", function(){ openGuide(); }],
  ["membre", function(){ openMembre(0); }],
  ["membreBlesse", function(){ openMembre(1); }],
  ["soins", function(){ openSoins(1); }],
  ["slotArme", function(){ openSlot(0, "arme"); }],
  ["quiPart", function(){ openQuiPart(); }],
  ["lieux", function(){ G.sel = [0, 3]; openLoc(); }],
  ["stock", function(){ G.sel = []; openStock(); }],
  ["construire", function(){ openRef("construire"); }],
  ["fabriquer", function(){ openRef("fabriquer"); }],
  ["cuisine", function(){ openRef("cuisine"); }],
  ["reparer", function(){ openRef("reparer"); }],
  ["voiture", function(){ openRef("voiture"); }],
  ["bilanRefuge", function(){ openBilanRefuge(); }],
  ["dormir", function(){ openDormir(); }],
  ["infoEau", function(){ openInfo("eau"); }],
  ["infoDefense", function(){ openInfo("def"); }],
  ["infoMoral", function(){ openInfo("moral"); }],
  ["chapitre", function(){ openChapitre(); }],
  ["saison", function(){ openSaison(); }],
  ["mission", function(){ openMission(); }],
  ["marche", function(){ openMarche(); }],
  ["chien", function(){ openChien(); }],
  ["poules", function(){ openPoules(); }],
  ["feu", function(){ openFeu(); }],
  ["tombes", function(){ openTombes(); }],
  ["trophees", function(){ openTrophees(); }],
  ["stats", function(){ openStats(); }],
  ["succes", function(){ openSucces(); }],
  ["defis", function(){ openDefis(); }],
  ["profil", function(){ openProfil(); }],
  ["inviter", function(){ openInviter(); }],
  ["avis", function(){ openAvis(); }],
  ["camp", function(){ openCamp(); }],
  ["campSlot", function(){ apOuvrirSlot(0); }],
  ["combat", function(){ G.exp = { lieu:2, equipe:[0, 3], notes:[], mult:1, d:0, voiture:false };
    G.combat = { zombies:[0, 3, 4].map(function(k){ var t = ZOMBIES[k]; return { id:t.id, nom:t.nom, icone:t.icone, pv:t.pv, pvMax:t.pv, degats:t.degats }; }), tour:1, journal:[], resume:[], fin:null };
    if(typeof preparerIntentions === "function") preparerIntentions(); openCombat(); }],
  ["finCombat", function(){ if(G.combat){ G.combat.zombies.forEach(function(z){ z.pv = 0; }); G.combat.fin = "victoire"; G.combat.abattus = 3; G.combat.pv0 = G.m.map(function(x){ return x.hp; }); openCombat(); } }],
  ["resultat", function(){ G.combat = null; openResultat({ lieu:2, notes:[["g2", "🔦 La lampe éclaire les lieux."], ["", "Vous trouvez une hache et 2 planches."]], pris:[{ id:"hache", n:1 }, { id:"planche", n:2 }, { id:"conserve", n:1 }], laisses:[{ id:"ferraille", n:2 }], vide:false }); }],
  ["nuit", function(){ G.exp = null; openNuit([["g2", "🧟 Attaque de nuit repoussée (force 6 contre votre défense 9)."], ["", "🐕 Rex a mangé sa ration."], ["g2", "🥕 Le potager a donné 2 rations de nourriture."], ["b2", "🥶 Nuit glaciale : on dort mal."]]); }],
  ["evenement", function(){ openEvent(EVENEMENTS[0]); }],
  ["momentFamille", function(){ hide(); G.ev = null; openEvent(EVENEMENTS.filter(function(e){ return e.famille; })[0]); }],
  ["fermer", function(){ hide(); G.ev = null; G.evIdx = null; render(); }]
];
async function devEcran(k){
  var E = typeof k === "number" ? DEV_ECRANS[k] : DEV_ECRANS.filter(function(e){ return e[0] === k; })[0];
  if(!E) return "écran inconnu : " + k;
  try{ E[1](); }catch(e){ return E[0] + " : ERREUR " + e.message; }
  await devAtt(350);
  var pb = typeof controleAffichage === "function" ? controleAffichage() : ["controleAffichage absent"];
  var sh = document.getElementById("sheet"), def = sh && document.getElementById("modal") && getComputedStyle(document.getElementById("modal")).display !== "none" ? sh.scrollHeight - sh.clientHeight : 0;
  return E[0] + (def > 2 ? " (défile " + def + " px)" : "") + " : " + (pb.length ? pb.join(" | ") : "ok");
}
async function devTout(){
  var r = [];
  for(var k = 0; k < DEV_ECRANS.length; k++){ var t = await devEcran(k); if(!/ : ok$/.test(t)) r.push(t); }
  hide(); render();
  return innerWidth + "x" + innerHeight + " → " + (r.length ? r.join("\n") : "tout est ok");
}
