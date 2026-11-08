/* =====================================================================
   logique.js : les règles du jeu (stock, fouilles, combats, nuits).
   Aucun affichage ici : les fonctions modifient l'état G et renvoient
   des messages. (On pourra donc simuler des centaines de parties.)
   Un message = [classe, texte] avec classe "g2" (bon), "b2" (mauvais) ou "".
   ===================================================================== */

var R = function(a, b){ return a + Math.floor(hasard() * (b - a + 1)); };
var G;          // l'état de la partie en cours
var RECORD = 0; // meilleur score (jours-personnes)

/* ---------- Hasard à graine ----------
   En « Partie du jour », tout le monde a la même graine (la date) : même maison
   de départ, mêmes objets dans le même ordre dans les lieux, mêmes attaques de
   nuit et mêmes événements du matin. Seuls les combats dépendent des choix.
   C'est ce qui rend le classement du jour équitable. */
function graine(s){
  return function(){ s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function hacher(txt){ var h = 2166136261; for(var i = 0; i < txt.length; i++){ h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
// Tirage fixé par la graine, le jour et une étiquette (sinon vrai hasard)
function alea(tag){ return G.seed ? graine(hacher(G.seed + "|" + G.day + "|" + tag))() : Math.random(); }
// Tous les autres tirages du jeu (combats, butin, blessures...). En Partie du jour,
// ils suivent aussi la graine, dans l'ordre : mêmes choix = mêmes résultats.
function hasard(){
  if(G && G.seed && G.ph === "game"){ G.nTirage = (G.nTirage || 0) + 1; return alea("t" + G.nTirage); }
  return Math.random();
}
function aleaR(tag, a, b){ return a + Math.floor(alea(tag) * (b - a + 1)); }
function graineDuJour(d){ d = d || new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
function dateGraine(seed){ var mois = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."]; return (seed % 100) + " " + mois[Math.floor(seed / 100) % 100 - 1] + " " + Math.floor(seed / 10000); }

// seed : graine de la Partie du jour, ou rien pour une partie libre
function nouvellePartie(seed){
  G = { ph:"pick", seed:seed || null, day:0, pack:{}, tl:BAL.tempsDepart, cb:0, adS:false,
        info:"Touche un objet pour le prendre, touche le sac pour le retirer." };
  G.h = seed ? aleaR("maison", 0, MAISONS.length - 1) : R(0, MAISONS.length - 1);
}

/* ---------- Noms pour les messages ---------- */
// « de Papa », « d’Emma »
function de(nom){ return /^[aeiouyéèh]/i.test(nom) ? "d’" + nom : "de " + nom; }
function minus(s){ return s.charAt(0).toLowerCase() + s.slice(1); }
// nommer("hache",1) -> "une hache" ; nommer("planche",3) -> "3 planches"
function nommer(id, n){
  var o = OBJETS[id];
  return n > 1 ? n + " " + minus(o.pl) : (o.g === "f" ? "une " : "un ") + minus(o.nom);
}
// ["une hache","2 planches","un couteau"] -> "une hache, 2 planches et un couteau"
function liste(t){ return t.length < 2 ? t.join("") : t.slice(0, -1).join(", ") + " et " + t[t.length - 1]; }
// [{id,n}] -> texte
function nommerListe(groupes){ return liste(groupes.map(function(g){ return nommer(g.id, g.n); })); }
function grouper(ids){
  var g = [], idx = {};
  ids.forEach(function(id){ if(idx[id] === undefined){ idx[id] = g.length; g.push({ id:id, n:0 }); } g[idx[id]].n++; });
  return g;
}

/* ---------- Départ : le sac ---------- */
function capSac(){ return MAISONS[G.h].cap + G.cb; }
function placesUtilisees(){ var u = 0; for(var k in G.pack) u += OBJETS[k].place * G.pack[k]; return u; }

function demarrer(){
  var pack = G.pack;
  G.ph = "game"; G.day = 1; G.score = 0; G.sel = []; G.ads = 0; G.dd = []; G.ref = { barr:0, eau:0, pot:0 };
  G.uid = 0; G.stock = { n:{}, o:[] }; G.reste = { eau:0, nour:0 };
  G.voiture = { installees:{}, essence:0 };
  G.stats = { lieux:{}, fabriques:0, eloignes:0 }; G.decouverts = {}; G.mission = null; G.charrette = JSON.parse(JSON.stringify(MARCHE.stock)); G.chap = 0; G.annonces = [];
  for(var k in pack) ajouter(k, pack[k], 1);
  var moral = 0; for(var k in pack) moral += (OBJETS[k].moral || 0) * pack[k];
  G.moral = Math.min(100, BAL.moralDepart + BAL.moralParObjet * moral);
  var eau = rations("eau"), nour = rations("nour");
  G.m = FAMILLE.map(function(f){
    return { icone:f.icone, nom:f.nom, al:true, hp:100, en:100,
             faim:Math.min(100, 50 + Math.round(nour / 2)), soif:Math.min(100, 50 + Math.round(eau / 2)),
             eq:{ arme:null, outil:null, sac:null } };
  });
  // Chaque lieu reçoit sa vraie liste d'objets, mélangée
  G.lieux = LIEUX.map(function(L){
    var b = []; for(var id in L.butin) for(var i = 0; i < L.butin[id]; i++) b.push(id);
    melanger(b, G.seed ? graine(hacher(G.seed + "|lieu|" + L.nom)) : null); return L.peche ? { butin:b, poissons:BAL.peche.poissons } : { butin:b };
  });
  equiperDepart();
}
// Anciennes sauvegardes (avant l'étang) : on insère l'étang à sa place dans la liste des lieux
function migrerPartie(g){
  var ie = LIEUX.findIndex(function(L){ return L.peche; });
  if(g.lieux && g.lieux.length === LIEUX_AVANT_ETANG){
    var b = []; for(var id in LIEUX[ie].butin) for(var k = 0; k < LIEUX[ie].butin[id]; k++) b.push(id);
    g.lieux.splice(ie, 0, { butin:melanger(b, graine(hacher("etang"))), poissons:BAL.peche.poissons });
    var st = {}; for(var c in g.stats.lieux) st[+c >= ie ? +c + 1 : c] = true; g.stats.lieux = st;
    if(g.exp && g.exp.lieu >= ie) g.exp.lieu++;
  }
  // Lieux ajoutés à la fin de la liste (lieux secrets) : on les crée
  while(g.lieux && g.lieux.length < LIEUX.length){
    var L = LIEUX[g.lieux.length], b2 = [];
    for(var id2 in L.butin) for(var k2 = 0; k2 < L.butin[id2]; k2++) b2.push(id2);
    g.lieux.push(L.peche ? { butin:melanger(b2, graine(hacher(L.nom))), poissons:BAL.peche.poissons } : { butin:melanger(b2, graine(hacher(L.nom))) });
  }
  if(!g.decouverts) g.decouverts = {};
  return g;
}
function melanger(t, rng){ rng = rng || hasard; for(var i = t.length - 1; i > 0; i--){ var j = Math.floor(rng() * (i + 1)), x = t[i]; t[i] = t[j]; t[j] = x; } return t; }

/* ---------- Stock partagé du refuge ----------
   G.stock.n = { id: quantité } pour les objets empilables (eau, nourriture...)
   G.stock.o = [ {uid, id, sol} ] pour les objets uniques (une hache reste une hache)
   G.reste   = rations déjà entamées (un sac de riz ouvert...) */
function creer(id, usure){
  var d = OBJETS[id];
  return { uid:++G.uid, id:id, sol:d.sol ? Math.max(1, Math.round(d.sol * usure)) : null };
}
function ajouter(id, n, usure){
  var c = OBJETS[id].contient; // une boîte de munitions est ouverte et rangée à l'unité
  if(c){ for(var k in c) ajouter(k, c[k] * n); return; }
  if(OBJETS[id].empile){ G.stock.n[id] = (G.stock.n[id] || 0) + n; return; }
  for(var i = 0; i < n; i++)
    G.stock.o.push(creer(id, usure || R(BAL.usureButin[0], BAL.usureButin[1]) / 100));
}
function compter(id){
  if(OBJETS[id].empile) return G.stock.n[id] || 0;
  return G.stock.o.filter(function(o){ return o.id === id; }).length;
}
function retirer(id, n){ G.stock.n[id] -= n; if(G.stock.n[id] <= 0) delete G.stock.n[id]; }
// Possédé par la famille : dans le stock ou équipé par un membre vivant
function equipes(){
  var t = [];
  G.m.forEach(function(x){ if(x.al) for(var s in x.eq) if(x.eq[s]) t.push(x.eq[s]); });
  return t;
}
function possede(test){
  for(var k in G.stock.n) if(test(OBJETS[k])) return true;
  return G.stock.o.concat(equipes()).some(function(o){ return test(OBJETS[o.id]); });
}

/* ---------- Rations (eau / nourriture) ---------- */
function rations(cat){
  var t = G.reste[cat];
  for(var k in G.stock.n) if(OBJETS[k].cat === cat) t += OBJETS[k].rations * G.stock.n[k];
  return t;
}
// Prend des rations : entame d'abord les restes, puis ouvre le plus petit paquet
function prendreRations(cat, besoin){
  var pris = 0;
  while(pris < besoin){
    if(G.reste[cat] > 0){ var p = Math.min(G.reste[cat], besoin - pris); G.reste[cat] -= p; pris += p; continue; }
    var best = null;
    for(var k in G.stock.n) if(OBJETS[k].cat === cat && (!best || OBJETS[k].rations < OBJETS[best].rations)) best = k;
    if(!best) break;
    retirer(best, 1); G.reste[cat] += OBJETS[best].rations;
  }
  return pris;
}

/* ---------- Soins ---------- */
function soinsDispo(){ var t = 0; for(var k in G.stock.n) if(OBJETS[k].cat === "soin") t += G.stock.n[k]; return t; }
// Choisit le soin le plus adapté : le plus petit qui suffit, sinon le plus gros
function choisirSoin(manque){
  var ok = null, gros = null;
  for(var k in G.stock.n){
    var s = OBJETS[k].soin; if(!s) continue;
    if(s >= manque && (!ok || s < OBJETS[ok].soin)) ok = k;
    if(!gros || s > OBJETS[gros].soin) gros = k;
  }
  return ok || gros;
}
function retirerSoin(){ var k = choisirSoin(0); if(k) retirer(k, 1); return k; }
function soigner(i){
  var x = G.m[i]; if(!x.al || x.hp >= 100) return null;
  var bonus = x.nom === "Maman" ? BAL.soinBonusMaman : 0;
  var k = choisirSoin(100 - x.hp - bonus); if(!k) return null;
  retirer(k, 1); x.hp = Math.min(100, x.hp + OBJETS[k].soin + bonus);
  return k;
}

/* ---------- Équipement individuel ----------
   Chaque membre a 3 emplacements : x.eq.arme, x.eq.outil, x.eq.sac.
   On équipe depuis le stock ; l'ancien objet retourne au stock.
   Seul ce que l'équipe porte compte pendant une expédition. */
var EMPLACEMENTS = [ ["arme","🗡️","Arme"], ["outil","🔦","Outil / éclairage"], ["sac","🎒","Sac"] ];
function equiper(i, slot, uid){
  var x = G.m[i]; if(!x.al) return false;
  var o = G.stock.o.find(function(o){ return o.uid === uid; });
  if(!o || OBJETS[o.id].emplacement !== slot) return false;
  retirerInstance(uid);
  if(x.eq[slot]) G.stock.o.push(x.eq[slot]);
  x.eq[slot] = o; return true;
}
function desequiper(i, slot){
  var x = G.m[i]; if(x.eq[slot]){ G.stock.o.push(x.eq[slot]); x.eq[slot] = null; }
}
// Objets du stock qui vont dans cet emplacement (meilleurs d'abord)
function pourEmplacement(slot){
  return G.stock.o.filter(function(o){ return OBJETS[o.id].emplacement === slot; })
    .sort(function(a, b){ var A = OBJETS[a.id], B = OBJETS[b.id];
      return (B.def || B.capacite || B.lumiere || 0) - (A.def || A.capacite || A.lumiere || 0) || (b.sol || 0) - (a.sol || 0); });
}
function retirerInstance(uid){
  var i = G.stock.o.findIndex(function(o){ return o.uid === uid; });
  return i >= 0 ? G.stock.o.splice(i, 1)[0] : null;
}
function meilleur(test, score){
  var b = null;
  G.stock.o.forEach(function(o){ var d = OBJETS[o.id]; if(test(d) && (!b || score(o) > score(b))) b = o; });
  return b ? retirerInstance(b.uid) : null;
}
// Au départ seulement : on répartit le matériel du sac pour gagner du temps
// (le joueur peut tout changer ensuite)
function equiperDepart(){
  var outilsVoulus = [function(d){ return d.lumiere === 2; }, function(d){ return d.ouvre; }, function(d){ return d.lumiere; }];
  G.m.forEach(function(x){
    x.eq.arme = meilleur(function(d){ return d.emplacement === "arme"; }, function(o){ return OBJETS[o.id].def * 100 + o.sol; });
    x.eq.sac  = meilleur(function(d){ return d.emplacement === "sac"; },  function(o){ return OBJETS[o.id].capacite; });
    while(!x.eq.outil && outilsVoulus.length) x.eq.outil = meilleur(outilsVoulus.shift(), function(){ return 0; });
  });
}
function rendreAuStock(team){
  team.forEach(function(x){ for(var s in x.eq){ if(x.eq[s]) G.stock.o.push(x.eq[s]); x.eq[s] = null; } });
}

/* ---------- Canette énergisante ---------- */
// Boire ou manger une ration quand on veut (bouton ＋ de la carte)
function peutPrendreRation(x, cat){ var j = cat === "eau" ? x.soif : x.faim; return x.al && j < 100 && rations(cat) > 0; }
function prendreRation(i, cat){
  var x = G.m[i]; if(!peutPrendreRation(x, cat)) return false;
  prendreRations(cat, 1);
  if(cat === "eau") x.soif = Math.min(100, x.soif + BAL.soifParJour); else x.faim = Math.min(100, x.faim + BAL.faimParJour);
  return true;
}
function peutBoire(x){ return x.al && !x.canette && x.en < 100 && compter("canette") > 0; }
function boire(i){
  var x = G.m[i]; if(!peutBoire(x)) return false;
  retirer("canette", 1); x.en = Math.min(100, x.en + BAL.canetteEnergie); x.soif = Math.min(100, x.soif + (BAL.canetteSoif || 0)); x.canette = true;
  return true;
}

/* ---------- Santé, moral ---------- */
function vivants(){ return G.m.filter(function(x){ return x.al; }); }
function changerMoral(d){ G.moral = Math.max(0, Math.min(100, G.moral + d)); }
function blesser(x, d, n, cause){
  if(!x || !x.al) return;
  x.hp -= d;
  if(x.hp <= 0){
    x.hp = 0; x.al = false; changerMoral(-25);
    n.push(["b2", "💀 " + x.nom + " est mort" + (cause ? " : " + cause : "") + "."]);
    G.dd.push({ n:x.nom, c:cause || "cause inconnue", j:G.day });
    rendreAuStock([x]); // son équipement reste à la famille
  }
}
// Usure d’une arme : perd 1 de solidité, se casse à 0
function userArme(x, n){
  var a = x.eq.arme; if(!a) return;
  a.sol--;
  if(a.sol <= 0){ x.eq.arme = null; n.push(["b2", "💥 " + (OBJETS[a.id].g === "f" ? "La " : "Le ") + minus(OBJETS[a.id].nom) + " " + de(x.nom) + " se brise !"]); }
}

/* ---------- Expédition (fouille d'un lieu) ---------- */
function dangerLieu(i){ return LIEUX[i].danger + Math.min(BAL.dangerMaxAjoute, G.day * BAL.dangerParJour) + (G.hordeJour === G.day ? 0.2 : 0); }
// Ce qui reste à prendre dans un lieu (à l'étang : les objets + les poissons)
function resteLieu(i){ var l = G.lieux[i]; return l.butin.length + (LIEUX[i].peche ? (l.poissons || 0) : 0); }
function lieuOuvert(i){ return (!LIEUX[i].jour || G.day >= LIEUX[i].jour) && (!LIEUX[i].secret || !!(G.decouverts && G.decouverts[i])); }
// Jour où un lieu secret est découvert (plus tôt avec une radio)
function jourDecouverte(i){ return LIEUX[i].secret - (possede(function(o){ return o.radio; }) ? BAL.avanceRadio : 0); }

/* ---------- Énergie ---------- */
// En voiture, le trajet ne fatigue pas : on ne paie que la fouille
function coutEnergie(i, voiture){ return BAL.energieBase + (voiture || LIEUX[i].voiture ? 0 : BAL.energieParDistance * LIEUX[i].distance); }
function coutMin(){
  var m = 999;
  LIEUX.forEach(function(L, i){
    if(!lieuOuvert(i) || !G.lieux[i].butin.length) return;
    if(!L.voiture) m = Math.min(m, coutEnergie(i, false));
    if(voitureOk(i)) m = Math.min(m, coutEnergie(i, true));
  });
  return m;
}
function fatigue(x){ return x.en < BAL.fatigueSeuil; }
// Peut encore sortir aujourd'hui (au moins vers le lieu le plus proche)
function peutSortir(x){ return x.al && x.en >= coutMin(); }
function equipePeutAller(team, i, voiture){
  voiture = voiture || LIEUX[i].voiture;
  if(voiture && !voitureOk(i)) return false;
  return team.length > 0 && team.every(function(x){ return x.al && x.en >= coutEnergie(i, voiture); });
}

/* ---------- Voiture ---------- */
function voitureReparee(){ return VOITURE.pieces.every(function(p){ return G.voiture.installees[p]; }); }
function litres(i){ return VOITURE.litresParDistance * LIEUX[i].distance; }
function voitureOk(i){ return voitureReparee() && G.voiture.essence >= litres(i); }
// Installer une pièce (glisser-déposer dans l'onglet Voiture) : coûte de l'énergie comme l'atelier
function installerPiece(id){
  if(VOITURE.pieces.indexOf(id) < 0 || G.voiture.installees[id] || compter(id) < 1) return null;
  var x = artisan(); if(!x) return null;
  x.en -= BAL.energieCraft; retirer(id, 1); G.voiture.installees[id] = true;
  return x.nom + " installe " + nommer(id, 1) + (voitureReparee() ? ". 🚗 Le moteur tousse… et démarre ! La voiture roule." : ".");
}
function fairePlein(){
  if(compter("jerrican") < 1 || G.voiture.essence >= VOITURE.reservoir) return null;
  retirer("jerrican", 1);
  var avant = G.voiture.essence;
  G.voiture.essence = Math.min(VOITURE.reservoir, avant + VOITURE.litresJerrican);
  return "Plein fait : ⛽ " + G.voiture.essence + " L" + (avant + VOITURE.litresJerrican > VOITURE.reservoir ? " (le surplus a débordé)" : "") + ".";
}
function forceEquipe(team){
  var f = 0;
  team.forEach(function(x){ if(!x.al) return; f += 1 + (x.eq.arme ? OBJETS[x.eq.arme.id].def : 0) + (x.nom === "Papa" ? BAL.combatBonusPapa : 0) - (fatigue(x) ? BAL.fatigueForce : 0); });
  return Math.max(0, f);
}
function placesEquipe(team){
  var p = 0; team.forEach(function(x){ if(x.al) p += BAL.mainsParMembre + (x.eq.sac ? OBJETS[x.eq.sac.id].capacite : 0); }); return p;
}

function expedition(i, voiture){
  var L = LIEUX[i], lieu = G.lieux[i], n = [], mult = 1, d = dangerLieu(i);
  var team = G.sel.map(function(j){ return G.m[j]; });
  var kit = function(test){ for(var t = 0; t < team.length; t++){ var o = team[t].eq.outil; if(o && test(OBJETS[o.id])) return team[t]; } return null; };

  if(L.sombre){
    var lampe = kit(function(o){ return o.lumiere === 2; }), briquet = kit(function(o){ return o.lumiere === 1; });
    if(lampe && compter("pile") > 0){ retirer("pile", 1); n.push(["g2", "🔦 " + lampe.nom + " éclaire les lieux avec la lampe torche (1 pile utilisée)."]); }
    else {
      if(lampe) n.push(["b2", "🔦 La lampe torche n’a plus de piles."]);
      if(briquet){
        var feu = briquet.eq.outil;
        mult *= BAL.lueur.fouille; d += BAL.lueur.danger; n.push(["", "🔥 " + (OBJETS[feu.id].g === "f" ? "La " : "Le ") + minus(OBJETS[feu.id].nom) + " " + de(briquet.nom) + " donne une lueur faible."]);
        if(feu.sol){ feu.sol--; if(feu.sol <= 0){ briquet.eq.outil = null; n.push(["b2", "🕯️ La torche " + de(briquet.nom) + " s’est consumée."]); } }
      }
      else { mult *= BAL.noir.fouille; d += BAL.noir.danger; n.push(["b2", "🌑 Fouille à tâtons dans le noir."]); }
    }
  }
  if(L.verrou){
    var ouvreur = kit(function(o){ return o.ouvre; });
    var serrure = false;
    if(ouvreur) n.push(["g2", "🔓 " + ouvreur.nom + " ouvre la porte avec " + nommer(ouvreur.eq.outil.id, 1) + "."]);
    else if(compter("epingle") > 0) serrure = true; // le joueur choisira : crocheter ou forcer
    else { mult *= BAL.force.fouille; d += BAL.force.danger; n.push(["b2", "🔒 Porte forcée à la brute, ça fait du bruit."]); }
  }
  if(G.moral < BAL.moralBas){ mult *= BAL.moralBasFouille; n.push(["b2", "😟 Moral bas : l’équipe fouille mal."]); }
  var fatigues = team.filter(fatigue);
  if(fatigues.length){ mult *= BAL.fatigueFouille; n.push(["b2", "🥱 " + liste(fatigues.map(function(x){ return x.nom; })) + (fatigues.length > 1 ? " sont fatigués" : " est fatigué") + " : fouille et combat moins efficaces."]); }

  // Rencontre ? Alors combat au tour par tour avant la fouille
  voiture = !!(voiture || L.voiture) && voitureOk(i);
  if(voiture){
    G.voiture.essence -= litres(i); d += VOITURE.bruit;
    n.unshift(["", "🚗 Trajet en voiture (⛽ −" + litres(i) + " L, reste " + G.voiture.essence + " L) : le moteur fait du bruit."]);
  }
  G.exp = { lieu:i, equipe:G.sel.slice(), notes:n, mult:mult, d:d, voiture:voiture };
  G.sel = [];
  if(serrure){ G.exp.serrure = { faites:0, cassees:0, fin:null }; return { serrure:true }; }
  return suiteExpedition();
}
// Après la porte : rencontre éventuelle (combat), sinon fouille directe
function suiteExpedition(){
  if(hasard() < G.exp.d){ G.combat = creerCombat(); return { combat:true }; }
  return finExpedition();
}

/* ---------- Crochetage ----------
   Mini-jeu : un curseur va et vient, il faut appuyer quand il est dans la
   zone verte, une fois par goupille. Chaque raté casse une épingle. */
function crocheteur(){
  var eq = G.exp.equipe.map(function(j){ return G.m[j]; });
  return eq.filter(function(x){ return x.nom === "Emma"; })[0] || eq[0];
}
function zoneCrochetage(){ return crocheteur().nom === "Emma" ? BAL.crochetage.zoneEmma : BAL.crochetage.zone; }
function forcerPorte(){
  var E = G.exp; E.mult *= BAL.force.fouille; E.d += BAL.force.danger;
  E.notes.push(["b2", "🔒 Porte forcée à la brute, ça fait du bruit."]);
  if(E.serrure && !E.serrure.fin) E.serrure.fin = "force";
}
// reussi : le joueur a appuyé dans la zone verte ? Renvoie un message.
function tentativeGoupille(reussi){
  var S = G.exp.serrure, x = crocheteur();
  if(reussi){
    S.faites++;
    if(S.faites >= BAL.crochetage.goupilles){
      S.fin = "ouvert";
      G.exp.notes.push(["g2", "🗝️ " + x.nom + " crochète la serrure en silence" + (S.cassees ? " (" + nommer("epingle", S.cassees) + " cassée" + (S.cassees > 1 ? "s" : "") + ")" : "") + "."]);
      return "Clic ! La porte s’ouvre.";
    }
    return "Clic ! Goupille " + S.faites + " en place.";
  }
  retirer("epingle", 1); S.cassees++;
  if(compter("epingle") < 1){ S.fin = "echec"; forcerPorte(); return "Crac ! Plus d’épingles : il faut forcer la porte."; }
  return "Crac ! L’épingle casse (il en reste " + compter("epingle") + ").";
}


// Fouille et retour (après un éventuel combat)
function finExpedition(){
  var E = G.exp, i = E.lieu, lieu = G.lieux[i], n = E.notes, mult = E.mult;
  var team = E.equipe.map(function(j){ return G.m[j]; });
  var C = G.combat;
  if(C){
    n = n.concat(C.resume);
    if(C.fin === "fuite") mult *= BAL.combat.butinFuite;
  }
  // Fouille : on pioche dans la vraie liste du lieu
  var survivants = team.filter(function(x){ return x.al; });
  var nb = survivants.length * BAL.fouilleParMembre + (survivants.some(function(x){ return x.nom === "Léo"; }) ? BAL.bonusLeo : 0);
  nb = Math.min(lieu.butin.length, Math.max(survivants.length ? 1 : 0, Math.round(nb * mult)));
  var trouves = lieu.butin.splice(0, nb);
  // Pêche : chaque survivant qui a une canne attrape des poissons (tant qu'il en reste)
  var peches = 0;
  if(LIEUX[i].peche) survivants.forEach(function(x){
    var c = x.eq.outil; if(!c || !OBJETS[c.id].peche) return;
    var k = Math.min(lieu.poissons, Math.max(1, Math.round(R(BAL.peche.prises[0], BAL.peche.prises[1]) * mult)));
    lieu.poissons -= k; peches += k;
    for(var p = 0; p < k; p++) trouves.unshift("poisson");
    n.push(["g2", "🎣 " + x.nom + " pêche " + (k ? nommer("poisson", k) : "rien") + "."]);
    c.sol--; if(c.sol <= 0){ x.eq.outil = null; n.push(["b2", "🎣 La canne à pêche " + de(x.nom) + " casse."]); }
  });
  if(LIEUX[i].peche && !peches && survivants.length && !survivants.some(function(x){ return x.eq.outil && OBJETS[x.eq.outil.id].peche; })) n.push(["b2", "🎣 Sans canne à pêche, impossible d’attraper les poissons."]);

  // Transport : bras + sacs ; ce qui ne rentre pas reste sur place
  var places = placesEquipe(survivants) + (E.voiture && survivants.length ? VOITURE.coffre : 0);
  var pris = [], laisses = [];
  trouves.forEach(function(id){ if(OBJETS[id].place <= places){ places -= OBJETS[id].place; pris.push(id); } else laisses.push(id); });
  // Les poissons qu'on ne peut pas porter sont relâchés dans l'étang
  lieu.butin = laisses.filter(function(id){ return id !== "poisson"; }).concat(lieu.butin);
  if(LIEUX[i].peche) lieu.poissons += laisses.filter(function(id){ return id === "poisson"; }).length;
  pris.forEach(function(id){ ajouter(id, 1); });

  var cout = coutEnergie(i, E.voiture);
  team.forEach(function(x){ x.en = Math.max(0, x.en - cout); });
  G.exp = null; G.combat = null;
  if(survivants.length){ G.stats.lieux[i] = true; if(LIEUX[i].voiture) G.stats.eloignes++; }
  if(survivants.length && G.mission && G.mission.lieu === i){ var mr = reussirMission(); if(mr) n.push(["g2", mr]); }
  return { lieu:i, notes:n, pris:grouper(pris), laisses:grouper(laisses), vide:resteLieu(i) === 0 };
}

/* ---------- Combat au tour par tour ----------
   Chaque tour : chaque membre frappe un zombie ou se protège (ou toute
   l'équipe tente de fuir), puis chaque zombie encore debout attaque. */
function tirerZombie(){
  var types = ZOMBIES.filter(function(z){ return G.day >= z.jour; }), total = 0;
  types.forEach(function(z){ total += z.poids; });
  var r = hasard() * total;
  for(var k = 0; k < types.length; k++){ r -= types[k].poids; if(r < 0) return types[k]; }
  return types[0];
}
function creerCombat(){
  var C = BAL.combat, nb = 1;
  for(var k = 0; k < C.maxEnPlus; k++) if(hasard() < Math.min(0.6, G.day * C.zombieEnPlus)) nb++;
  var zs = [];
  for(var k = 0; k < nb; k++){ var t = tirerZombie(); zs.push({ id:t.id, nom:t.nom, icone:t.icone, pv:t.pv, pvMax:t.pv, degats:t.degats }); }
  return { zombies:zs, tour:1, journal:[], resume:[], fin:null };
}
function zombiesDebout(){ return G.combat.zombies.filter(function(z){ return z.pv > 0; }); }
function equipeCombat(){ return G.exp.equipe.map(function(j){ return G.m[j]; }).filter(function(x){ return x.al; }); }
// Renvoie { dg, comment, tir } ; une arme à feu use une munition du stock
function degatsMembre(x){
  var C = BAL.combat, a = x.eq.arme, d = a ? OBJETS[a.id].degats : C.poings, comment = a ? "avec " + nommer(a.id, 1) : "à mains nues", tir = false;
  var mu = a && OBJETS[a.id].munition;
  if(mu){
    if(compter(mu) > 0){ retirer(mu, 1); tir = true; comment = "tire " + (OBJETS[a.id].g === "f" ? "à la " : "au ") + minus(OBJETS[a.id].nom); }
    else { d = C.crosse; comment = "n’a plus " + (mu === "balle" ? "de balles" : "de cartouches") + ", frappe avec la crosse"; }
  }
  return { dg:Math.max(1, R(d[0], d[1]) + (x.nom === "Papa" && !tir ? C.bonusPapa : 0) - (fatigue(x) ? C.malusFatigue : 0)), comment:comment, tir:tir };
}
function bruit(J){
  var C = BAL.combat;
  if(hasard() < C.bruitTir && zombiesDebout().length < C.maxZombies){
    var t = tirerZombie(); G.combat.zombies.push({ id:t.id, nom:t.nom, icone:t.icone, pv:t.pv, pvMax:t.pv, degats:t.degats });
    J.push(["b2", "🔊 Le bruit du tir attire un " + minus(t.nom) + " !"]);
  }
}
// Les zombies debout attaquent ; protege = { nomDuMembre: true }
function attaqueZombies(protege, J){
  var lieu = LIEUX[G.exp.lieu].nom;
  zombiesDebout().forEach(function(z){
    var cibles = equipeCombat(); if(!cibles.length) return;
    var x = cibles[R(0, cibles.length - 1)], dg = R(z.degats[0], z.degats[1]);
    if(protege[x.nom]) dg = Math.round(dg * BAL.combat.protection);
    J.push(["b2", iconeZombie(z) + " " + z.nom + " frappe " + x.nom + " (−" + dg + " PV)."]);
    blesser(x, dg, J, "tué par un " + minus(z.nom) + " (" + lieu + ")");
  });
}
function verifierFin(J){
  var C = G.combat;
  if(!equipeCombat().length){ C.fin = "defaite"; C.resume.push(["b2", "💀 Personne n’est revenu de " + LIEUX[G.exp.lieu].nom + "."]); }
  else if(!zombiesDebout().length){ C.fin = "victoire"; C.resume.push(["g2", "🧟 Combat gagné en " + C.tour + " tour" + (C.tour > 1 ? "s" : "") + " !"]); }
  C.tour++;
}
// choix = { indexMembre: { a:"frapper", cible:k } ou { a:"proteger" } }
function jouerTour(choix){
  var C = G.combat, J = [], protege = {};
  equipeCombat().forEach(function(x){
    var j = G.m.indexOf(x), c = choix[j] || { a:"frapper" };
    if(c.a === "proteger"){ protege[x.nom] = true; J.push(["", "🛡️ " + x.nom + " se protège."]); return; }
    var debout = zombiesDebout(); if(!debout.length) return;
    var z = C.zombies[c.cible] && C.zombies[c.cible].pv > 0 ? C.zombies[c.cible] : debout[0];
    var r = degatsMembre(x);
    z.pv = Math.max(0, z.pv - r.dg);
    J.push(["g2", (r.tir ? "🔫 " + x.nom + " " : "⚔️ " + x.nom + " frappe ") + r.comment + " : " + z.nom + " −" + r.dg + (z.pv ? "" : ", à terre !")]);
    userArme(x, J);
    if(r.tir) bruit(J);
  });
  attaqueZombies(protege, J);
  C.journal = J; C.resume = C.resume.concat(J.filter(function(l){ return l[0] === "b2" && l[1].indexOf("💀") >= 0 || l[1].indexOf("💥") >= 0; }));
  verifierFin(J);
  return J;
}
// Combat automatique « raisonnable » (bouton 🤖 Auto, et robot Malin) :
// tout le monde frappe le zombie le plus faible ; un blessé grave se protège ;
// on fuit si un membre risque de mourir au prochain tour face à plusieurs zombies
function tourAuto(){
  var zs = zombiesDebout(), eq = equipeCombat();
  var pire = 0; zs.forEach(function(z){ pire += z.degats[1]; });
  if(eq.some(function(x){ return x.hp <= pire; }) && zs.length > 1) return fuir();
  var cible = G.combat.zombies.indexOf(zs.slice().sort(function(a, b){ return a.pv - b.pv; })[0]);
  var ch = {};
  eq.forEach(function(x){ ch[G.m.indexOf(x)] = (x.hp <= zs[0].degats[1] && eq.length > 1) ? { a:"proteger" } : { a:"frapper", cible:cible }; });
  return jouerTour(ch);
}
function fuir(){
  var C = G.combat, J = [];
  if(hasard() < BAL.combat.fuite){
    C.fin = "fuite"; J.push(["", "🏃 L’équipe prend la fuite !"]);
    C.resume.push(["b2", "🏃 Fuite devant les zombies : on rapporte moins de butin."]);
  } else {
    J.push(["b2", "🏃 La fuite échoue, les zombies vous rattrapent !"]);
    attaqueZombies({}, J);
    C.resume = C.resume.concat(J.filter(function(l){ return l[1].indexOf("💀") >= 0; }));
    if(!equipeCombat().length) verifierFin(J); else C.tour++;
  }
  C.journal = J;
  return J;
}

/* ---------- Fin du jour (la nuit) ---------- */
/* Score = jours-personnes : chaque jour terminé rapporte 1 point par membre
   encore en vie. Garder toute la famille en vie rapporte donc plus. */
function finJour(){
  var n = [];
  G.score += vivants().length;
  var chaud = possede(function(o){ return o.chaleur; });
  vivants().forEach(function(x){
    x.faim -= BAL.faimParJour; x.soif -= BAL.soifParJour;
    var repos = (chaud ? BAL.reposNuit : BAL.reposFroid) - (x.canette ? BAL.canetteContrecoup : 0);
    if(x.canette) n.push(["", "🥴 " + x.nom + " dort mal après sa canette (+" + repos + " ⚡ seulement)."]);
    x.en = Math.min(100, x.en + repos); x.canette = false;
    if(prendreRations("nour", 1)) x.faim += BAL.faimParJour; else n.push(["b2", x.nom + " n’a rien à manger."]);
    if(prendreRations("eau", 1))  x.soif += BAL.soifParJour; else n.push(["b2", x.nom + " n’a rien à boire."]);
    x.faim = Math.max(0, Math.min(100, x.faim)); x.soif = Math.max(0, Math.min(100, x.soif));
    // Rattrapage : une ration de plus si la jauge est basse et qu'il en reste assez pour les autres
    if(x.soif > 0 && x.soif < BAL.rattrapage && rations("eau") > vivants().length && prendreRations("eau", 1)) x.soif = Math.min(100, x.soif + BAL.soifParJour);
    if(x.faim > 0 && x.faim < BAL.rattrapage && rations("nour") > vivants().length && prendreRations("nour", 1)) x.faim = Math.min(100, x.faim + BAL.faimParJour);
    if(x.faim <= 0 || x.soif <= 0) blesser(x, BAL.degatsFaimSoif, n, x.soif <= 0 ? "mort de soif" : "mort de faim");
    else if(x.hp < 100) x.hp = Math.min(100, x.hp + BAL.regenPV);
    if(!chaud) blesser(x, BAL.degatsFroid, n, "mort de froid");
  });
  // Le chien mange après la famille ; sans manger trop longtemps, il s'en va
  var c = chien();
  if(c){
    if(prendreRations("nour", BAL.chien.rations)) c.faim = 0;
    else {
      c.faim++;
      if(c.faim >= BAL.chien.nuitsSansManger){ G.chien = null; n.push(["b2", ic("chien", "🐕") + " " + c.nom + " est parti chercher à manger ailleurs. La défense de nuit baisse."]); }
      else n.push(["b2", ic("chien", "🐕") + " " + c.nom + " n’a rien eu à manger ce soir (" + c.faim + " nuit sur " + BAL.chien.nuitsSansManger + " avant qu’il parte)."]);
    }
  }
  // Les poules boivent après la famille, puis pondent ; sans eau, l'une d'elles meurt
  var np = compter("poule");
  if(np){
    var soif = Math.ceil(np / BAL.poules.eauPour);
    if(prendreRations("eau", soif)){
      var oeufs = 0; for(var q = 0; q < np; q++) if(hasard() < BAL.poules.oeuf) oeufs++;
      G.reste.nour += oeufs;
      n.push([oeufs ? "g2" : "", ic("poule", "🐔") + " " + (np > 1 ? "Les poules ont bu " : "La poule a bu ") + soif + " ration" + (soif > 1 ? "s" : "") + " d’eau" + (oeufs ? " et pondu " + oeufs + " œuf" + (oeufs > 1 ? "s" : "") + " (+" + oeufs + " ration" + (oeufs > 1 ? "s" : "") + ")." : ", pas d’œuf cette nuit.")]);
    } else {
      retirer("poule", 1); G.reste.nour += BAL.poules.viande;
      n.push(["b2", ic("poule", "🐔") + " Plus d’eau pour les poules : l’une d’elles est morte. Vous la mangerez (+" + BAL.poules.viande + " rations)."]);
    }
  }
  // L'étang : les poissons se reproduisent lentement, s'il en reste assez
  G.lieux.forEach(function(l, k){
    if(LIEUX[k].peche && l.poissons >= BAL.peche.seuil && l.poissons < BAL.peche.poissons && G.day % BAL.peche.nuitsParNaissance === 0) l.poissons++;
  });
  if(!chaud) n.push(["b2", "🥶 Nuit glaciale : ni couverture ni briquet. On dort mal (+" + BAL.reposFroid + " ⚡ au lieu de +" + BAL.reposNuit + ")."]);

  var A = BAL.attaqueNuit;
  if(alea("attaque") < Math.min(A.max, A.base + G.day * A.parJour + compter("poule") * BAL.poules.attaque)){
    var s = 1 + Math.floor(G.day / A.joursParForce) + aleaR("force", 0, 2), df = defenseNuit();
    if(compter("piege") > 0){ retirer("piege", 1); n.push(["", "🪤 Un piège à zombies a servi (+" + BAL.piegeDef + " de défense), il est cassé."]); }
    if(df >= s){
      n.push(["g2", "🧟 Attaque de nuit repoussée (force " + s + " contre votre défense " + df + ")."]);
      var armes = vivants().filter(function(x){ return x.eq.arme; });
      if(armes.length) userArme(armes[R(0, armes.length - 1)], n);
    } else {
      var perdus = [];
      for(var k = R(1, 3); k > 0; k--){
        var tas = Object.keys(G.stock.n).filter(function(id){ return OBJETS[id].cat === "nour"; });
        if(!tas.length) break;
        var id = tas[R(0, tas.length - 1)]; retirer(id, 1); perdus.push(id);
      }
      var v = vivants(); if(v.length) blesser(v[R(0, v.length - 1)], R(15, 35), n, "tué pendant l’attaque de nuit");
      n.push(["b2", "🧟 Attaque de nuit (force " + s + " contre votre défense " + df + ")" + (perdus.length ? " : ils saccagent " + nommerListe(grouper(perdus)) + "." : ".")]);
      if(A.casseBarricade && G.ref.barr > 0){ G.ref.barr--; n.push(["b2", "🧱 Ils arrachent une partie de la barricade (niveau " + G.ref.barr + ")."]); }
    }
  }
  // Installations fabriquées (bâche, collet) : produisent puis s'usent
  G.stock.o.slice().forEach(function(o){
    var p = OBJETS[o.id].nuit; if(!p) return;
    if(hasard() < p.chance){ G.reste[p.cat] += p.rations; n.push(["g2", icone(o.id) + " " + (p.cat === "eau" ? "La bâche a recueilli de l’eau de pluie" : "Un collet a attrapé du gibier") + " (+" + p.rations + " ration" + (p.rations > 1 ? "s" : "") + ")."]); }
    o.sol--;
    if(o.sol <= 0){ retirerInstance(o.uid); n.push(["b2", icone(o.id) + " " + (OBJETS[o.id].g === "f" ? "La " : "Le ") + minus(OBJETS[o.id].nom) + " est usé" + (OBJETS[o.id].g === "f" ? "e" : "") + ", à refaire."]); }
  });
  var pe = G.ref.eau * REFUGE.eau.parJour, pn = G.ref.pot * REFUGE.pot.parJour;
  G.reste.eau += pe; G.reste.nour += pn;
  if(pe) n.push(["g2", ic("ref_eau", "🪣") + " Le récupérateur a recueilli " + pe + " ration" + (pe > 1 ? "s" : "") + " d’eau."]);
  if(pn) n.push(["g2", ic("ref_pot", "🥕") + " Le potager a donné " + pn + " ration" + (pn > 1 ? "s" : "") + " de nourriture."]);
  nuitMonde(n);
  var moral = 0;
  G.stock.o.concat(equipes()).forEach(function(o){ moral += OBJETS[o.id].moral || 0; });
  changerMoral(-BAL.moralPerteNuit + BAL.moralBonusObjet * moral);
  G.day++; G.ads = 0; G.sel = []; G.nTirage = 0;
  if(G.day % MARCHE.tousLes === 0 && Object.keys(G.charrette).some(function(id){ return G.charrette[id] > 0; })){ genererMarche(); n.push(["g2", ic("marco", MARCHE.icone) + " " + MARCHE.nom + " s’installe au coin de la rue aujourd’hui : allez voir le marché !"]); }
  if(!n.length) n.push(["g2", "Nuit calme."]);
  return n;
}
// La nuit, chacun se défend avec l'arme qu'il a en main + la barricade
function defenseNuit(){
  var d = G.ref.barr * BAL.defenseBarricade;
  equipes().forEach(function(o){ d += OBJETS[o.id].def || 0; });
  if(compter("piege") > 0) d += BAL.piegeDef;
  if(chien()) d += BAL.chien.defense; // le chien monte la garde
  return d;
}

/* ---------- Chapitres ---------- */
// Chapitre en cours (après la liste : « Tenir bon » de 10 en 10 jours, sans fin)
function chapitreCourant(){
  if(G.chap < CHAPITRES.length) return CHAPITRES[G.chap];
  if(!G.cibleTenir) G.cibleTenir = Math.ceil((G.day + 1) / TENIR_TOUS_LES) * TENIR_TOUS_LES;
  return { titre:"Tenir bon", objectif:"Survivre jusqu’au jour " + G.cibleTenir,
           test:function(){ return G.day >= G.cibleTenir; }, progres:function(){ return [G.day, G.cibleTenir, "jours"]; }, recompense:{}, moral:10, // pas d'objets : ils reviendraient sans fin
           texte:"Encore debout. Chaque jour arraché compte. La famille reprend courage.",
           recit:RECITS_TENIR[(Math.round(G.cibleTenir / TENIR_TOUS_LES) - 1) % RECITS_TENIR.length] };
}
// Vérifie l'objectif ; si atteint, donne la récompense et ajoute une annonce
function verifierChapitre(){
  if(!G.m || !vivants().length) return;
  var c = chapitreCourant();
  if(!c.test()) return;
  var rec = [];
  for(var k in c.recompense){ ajouter(k, c.recompense[k], 1); rec.push({ id:k, n:c.recompense[k] }); }
  changerMoral(c.moral || 0);
  G.annonces.push({ num:G.chap + 1, titre:c.titre, texte:c.texte, recompense:rec.length ? nommerListe(rec) : "", moral:c.moral });
  G.chap++; G.cibleTenir = 0;
  verifierChapitre(); // plusieurs chapitres d'un coup si besoin
}

/* ---------- Le monde bouge la nuit : pillards, découvertes, missions ---------- */
function nuitMonde(n){
  var P = BAL.pillards, jour = G.day + 1; // le jour qui commence
  // Pillards : ils emportent une partie d'un lieu ouvert qu'il reste à fouiller
  if(jour >= P.jour && alea("pillards") < P.chance){
    var cibles = LIEUX.map(function(L, i){ return i; }).filter(function(i){ return lieuOuvert(i) && G.lieux[i].butin.length >= P.minimum; });
    if(cibles.length){
      var c = cibles[Math.floor(alea("pillards-lieu") * cibles.length)], l = G.lieux[c];
      var nb = Math.max(1, Math.round(l.butin.length * (P.part[0] + alea("pillards-part") * (P.part[1] - P.part[0]))));
      l.butin.splice(0, nb);
      n.push(["b2", "🏴 Des pillards ont fouillé " + leLieu(LIEUX[c].nom) + " cette nuit : il n’y reste plus que " + l.butin.length + " objet" + (l.butin.length > 1 ? "s" : "") + "."]);
    }
  }
  // Lieux secrets découverts
  LIEUX.forEach(function(L, i){
    if(L.secret && !G.decouverts[i] && jour >= jourDecouverte(i)){
      G.decouverts[i] = jour;
      n.push(["g2", "🗺️ Nouveau lieu découvert : " + iconeLieu(L) + " " + L.nom + ". " + L.indice]);
    }
  });
  // Mission : fin du délai, ou nouvelle mission
  var M = mission();
  if(M && jour > G.mission.fin){
    changerMoral(M.moralEchec || 0);
    n.push(["b2", M.icone + " Mission ratée : " + M.titre + ". " + M.echec + (M.moralEchec ? " Moral " + M.moralEchec + "." : "")]);
    G.mission = null;
  } else if(!M && jour >= BAL.missions.jour && alea("mission") < BAL.missions.chance){
    var m = MISSIONS[Math.floor(alea("mission-quoi") * MISSIONS.length)], lieu = null;
    if(m.aller){
      var possibles = LIEUX.map(function(L, i){ return i; }).filter(function(i){ return lieuOuvert(i) && !LIEUX[i].voiture && resteLieu(i) > 0; });
      if(!possibles.length) return;
      lieu = possibles[Math.floor(alea("mission-lieu") * possibles.length)];
    }
    G.mission = { id:m.id, fin:jour + m.delai - 1, lieu:lieu };
    n.push(["g2", m.icone + " Nouvelle mission : " + m.titre + " (" + m.delai + " jours). " + texteMission()]);
  }
}
// « le Garage auto », « l’Hôpital », « la Zone industrielle »
var FEMININS_LIEUX = ["Maison voisine", "Rue des pavillons", "Quincaillerie", "Station-service", "Zone industrielle", "Base militaire", "Caserne des pompiers", "Péniche du canal", "Clinique vétérinaire"];
function leLieu(nom){ return /^[AEIOUYÉÈH]/.test(nom) ? "l’" + nom : (FEMININS_LIEUX.indexOf(nom) >= 0 ? "la " : "le ") + nom; }
function mission(){ return G.mission ? MISSIONS.filter(function(m){ return m.id === G.mission.id; })[0] : null; }
function texteMission(){ var M = mission(); return M ? M.texte.replace("LIEU", G.mission.lieu != null ? LIEUX[G.mission.lieu].nom : "") : ""; }
function joursMission(){ return G.mission ? G.mission.fin - G.day + 1 : 0; }
// Quelle livraison est possible maintenant (index dans M.livrer), ou -1
function livraisonPossible(){
  var M = mission(); if(!M || !M.livrer) return -1;
  for(var k = 0; k < M.livrer.length; k++){ var ok = true; for(var id in M.livrer[k]) if(compter(id) < M.livrer[k][id]) ok = false; if(ok) return k; }
  return -1;
}
function livrerMission(){
  var k = livraisonPossible(); if(k < 0) return null;
  var M = mission(); for(var id in M.livrer[k]) retirer(id, M.livrer[k][id]);
  return reussirMission();
}
function reussirMission(){
  var M = mission(); if(!M) return null;
  var rec = []; for(var k in M.recompense){ ajouter(k, M.recompense[k], 1); rec.push({ id:k, n:M.recompense[k] }); }
  changerMoral(M.moral || 0); G.mission = null; G.stats.missions = (G.stats.missions || 0) + 1;
  return M.icone + " Mission réussie : " + M.titre + ". " + M.merci + " (+" + nommerListe(rec) + (M.moral ? ", moral +" + M.moral : "") + ")";
}

/* ---------- Le chien ---------- */
function chien(){
  if(G.chien === true) G.chien = { nom:"Rex", faim:0 }; // anciennes sauvegardes
  return G.chien || null;
}
// Famine : il ne reste pas de quoi nourrir la famille ce soir
function famine(){ return rations("nour") < vivants().length; }
function mangerChien(){
  var c = chien(); if(!c || !famine()) return null;
  G.reste.nour += BAL.chien.viande; changerMoral(BAL.chien.moral); G.chien = null;
  return "Personne ne parle pendant le repas. Vous avez " + BAL.chien.viande + " rations de plus, mais " + c.nom + " ne montera plus jamais la garde. Moral " + BAL.chien.moral + ".";
}

/* ---------- Marché de quartier ---------- */
// Offres du jour : il demande un objet empilable que vous avez, il donne un objet de son catalogue
function genererMarche(){
  var offres = [], dejaDemande = {};
  var vous = Object.keys(G.stock.n).filter(function(k){ return VALEURS[k] && G.stock.n[k] > 0; });
  for(var k = 0; k < 12 && offres.length < MARCHE.offres && vous.length; k++){
    var donne = vous[Math.floor(alea("marche-donne" + k) * vous.length)];
    var cat = Object.keys(G.charrette).filter(function(id){ return G.charrette[id] > 0; });
    if(!cat.length) break;
    var recoit = cat[Math.floor(alea("marche-recoit" + k) * cat.length)];
    if(dejaDemande[donne] || recoit === donne) continue;
    // Quantités : il ne demande jamais plus que ce que vous avez
    var nr = Math.min(G.charrette[recoit], 1 + Math.floor(alea("marche-n" + k) * 3)), nd;
    for(; nr >= 1; nr--){ nd = Math.ceil(VALEURS[recoit] * nr / MARCHE.marge / VALEURS[donne]); if(nd <= G.stock.n[donne]) break; }
    if(nr < 1) continue;
    dejaDemande[donne] = true;
    offres.push({ donne:{ id:donne, n:nd }, recoit:{ id:recoit, n:nr }, fait:false });
  }
  G.marche = { jour:G.day, offres:offres };
}
function marcheOuvert(){ return G.marche && G.marche.jour === G.day && G.marche.offres.length > 0; }
function peutEchanger(k){ var o = G.marche.offres[k]; return o && !o.fait && compter(o.donne.id) >= o.donne.n; }
function echanger(k){
  if(!marcheOuvert() || !peutEchanger(k)) return null;
  var o = G.marche.offres[k];
  if((G.charrette[o.recoit.id] || 0) < o.recoit.n) return null;
  retirer(o.donne.id, o.donne.n); ajouter(o.recoit.id, o.recoit.n, 1); o.fait = true;
  G.charrette[o.recoit.id] -= o.recoit.n;
  return "Échange fait : vous donnez " + nommer(o.donne.id, o.donne.n) + " et recevez " + nommer(o.recoit.id, o.recoit.n) + ".";
}

/* ---------- Événement du matin (même pour tous en Partie du jour) ---------- */
function evenementDuMatin(){
  if(alea("matin") >= 0.6) return null;
  var dispo = EVENEMENTS.filter(function(e){ return !e.si || e.si(); });
  var ev = dispo[aleaR("evenement", 0, dispo.length - 1)];
  G.evCible = null; G.evIcone = null;
  if(ev.prep) ev.prep();
  return ev;
}
function texteEvenement(ev){ return typeof ev.texte === "function" ? ev.texte() : ev.texte; }
function membre(nom){ return G.m.filter(function(x){ return x.nom === nom; })[0]; }
// Une recrue prend la place d'un membre disparu (famille de 4 au maximum)
function recruter(nom, ic){
  if(vivants().length >= FAMILLE.length) return false;
  var mort = G.m.filter(function(x){ return !x.al; })[0];
  var r = { icone:ic, nom:nom, al:true, hp:70, en:50, faim:50, soif:50, eq:{ arme:null, outil:null, sac:null } };
  if(mort) G.m[G.m.indexOf(mort)] = r; else G.m.push(r);
  return true;
}
// L'incendie abîme la barricade ou brûle des planches
function incendie(){
  if(G.ref.barr > 0){ G.ref.barr--; return "🔥 Le feu lèche le refuge : la barricade perd un niveau (niveau " + G.ref.barr + ")."; }
  var p = Math.min(4, compter("planche")); if(p) retirer("planche", p);
  return "🔥 Le feu atteint la réserve : " + (p ? p + " planches brûlent." : "heureusement, il n’y avait rien à brûler.");
}

/* ---------- Refuge ---------- */
function coutAmelioration(k){ return REFUGE[k].cout + REFUGE[k].coutParNiveau * G.ref[k]; }
function ameliorer(k){
  var c = coutAmelioration(k);
  if(G.ref[k] >= REFUGE[k].max || compter("planche") < c) return false;
  retirer("planche", c); G.ref[k]++; return true;
}

/* ---------- Atelier : fabriquer, réparer, démonter ---------- */
// Le membre le plus reposé fait le travail (il faut au moins BAL.energieCraft)
function artisan(){
  var b = null;
  vivants().forEach(function(x){ if(x.en >= BAL.energieCraft && (!b || x.en > b.en)) b = x; });
  return b;
}
function aLesIngredients(ing){ for(var k in ing) if(compter(k) < ing[k]) return false; return true; }
// Retire n objets (empilables, ou uniques en prenant les plus abîmés d'abord)
function consommer(id, n){
  if(OBJETS[id].empile){ retirer(id, n); return; }
  for(var i = 0; i < n; i++){
    var t = G.stock.o.filter(function(o){ return o.id === id; }).sort(function(a, b){ return (a.sol || 0) - (b.sol || 0); });
    retirerInstance(t[0].uid);
  }
}
// Renvoie null si c'est possible, sinon la raison
function empechement(ing, besoin){
  if(besoin && !possede(function(o){ return o === OBJETS[besoin]; })) return "Il faut " + nommer(besoin, 1);
  if(!aLesIngredients(ing)) return "Il manque des matériaux";
  if(!artisan()) return "Tout le monde est trop fatigué";
  return null;
}
function fabriquer(r){
  var rec = RECETTES[r]; if(empechement(rec.ingredients, rec.besoin)) return null;
  var x = artisan(); x.en -= BAL.energieCraft;
  for(var k in rec.ingredients) consommer(k, rec.ingredients[k]);
  ajouter(rec.id, 1, 1); G.stats.fabriques++;
  return x.nom + " fabrique " + nommer(rec.id, 1) + ".";
}
// Toutes les armes de la famille (stock + en main) qui sont abîmées
function armesAbimees(){
  return G.stock.o.concat(equipes()).filter(function(o){ return OBJETS[o.id].emplacement === "arme" && o.sol < OBJETS[o.id].sol; });
}
function trouverInstance(uid){ return G.stock.o.concat(equipes()).find(function(o){ return o.uid === uid; }); }
function reparer(uid){
  var o = trouverInstance(uid); if(!o || empechement(REPARATION)) return null;
  var x = artisan(); x.en -= BAL.energieCraft;
  for(var k in REPARATION) consommer(k, REPARATION[k]);
  var max = OBJETS[o.id].sol; o.sol = Math.min(max, o.sol + Math.round(max * BAL.reparation));
  return x.nom + " répare " + nommer(o.id, 1) + " (solidité " + o.sol + " / " + max + ").";
}
// Seuls les objets rangés dans le stock peuvent être démontés
function demontables(){ return G.stock.o.filter(function(o){ return DEMONTAGE[o.id]; }); }
function demonter(uid){
  var o = G.stock.o.find(function(o){ return o.uid === uid; });
  if(!o || !DEMONTAGE[o.id] || !artisan()) return null;
  var x = artisan(); x.en -= BAL.energieCraft;
  retirerInstance(uid);
  var p = DEMONTAGE[o.id], recup = [];
  for(var k in p){ ajouter(k, p[k], 1); recup.push({ id:k, n:p[k] }); }
  return x.nom + " démonte " + nommer(o.id, 1) + " et récupère " + nommerListe(recup) + ".";
}

nouvellePartie();
