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
function dateGraine(seed){ if(anglais()){ var m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return m[Math.floor(seed / 100) % 100 - 1] + " " + (seed % 100) + ", " + Math.floor(seed / 10000); } var mois = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."]; return (seed % 100) + " " + mois[Math.floor(seed / 100) % 100 - 1] + " " + Math.floor(seed / 10000); }

// seed : graine de la Partie du jour, ou rien pour une partie libre
function nouvellePartie(seed){
  G = { ph:"pick", seed:seed || null, day:0, pack:{}, tl:BAL.tempsDepart, cb:0, adS:false,
        info:"Touche un objet pour le prendre, touche le sac pour le retirer." };
  G.h = seed ? aleaR("maison", 0, MAISONS.length - 1) : R(0, MAISONS.length - 1);
}

/* ---------- Noms pour les messages ---------- */
// « de Papa », « d’Emma »
function anglais(){ return typeof LANGUE !== "undefined" && LANGUE === "en"; }
function de(nom){ return /^[aeiouyéèh]/i.test(nom) ? "d’" + nom : "de " + nom; }
function minus(s){ return s.charAt(0).toLowerCase() + s.slice(1); }
// nommer("hache",1) -> "une hache" ; nommer("planche",3) -> "3 planches"
function nommer(id, n){
  var o = OBJETS[id];
  if(anglais() && n <= 1 && typeof UN_EN !== "undefined" && UN_EN[id]) return UN_EN[id];
  if(anglais()){ var nm = /^Emma/.test(o.nom) ? o.nom : minus(o.nom); return n > 1 ? n + " " + minus(o.pl) : (/^Emma/.test(o.nom) ? "" : /^[aeiou]/i.test(nm) ? "an " : "a ") + nm; } // « an axe », « 2 planks »
  return n > 1 ? n + " " + minus(o.pl) : (o.g === "f" ? "une " : "un ") + minus(o.nom);
}
// ["une hache","2 planches","un couteau"] -> "une hache, 2 planches et un couteau"
function liste(t){ return t.length < 2 ? t.join("") : t.slice(0, -1).join(", ") + (anglais() ? " and " : " et ") + t[t.length - 1]; }
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
  G.m = FAMILLE.map(function(f, k){
    var c = (G.famille && G.famille[k]) || {};
    return { icone:f.icone, nom:c.nom || f.nom, r:f.nom, trait:TRAITS[c.trait] ? c.trait : f.trait, al:true, hp:100, en:100,
             faim:Math.min(100, 50 + Math.round(nour / 2)), soif:Math.min(100, 50 + Math.round(eau / 2)),
             eq:{ arme:null, outil:null, sac:null } };
  });
  // Chaque lieu reçoit sa vraie liste d'objets, mélangée
  G.lieux = LIEUX.map(function(L){
    var b = []; for(var id in L.butin) for(var i = 0; i < L.butin[id]; i++) b.push(id);
    melanger(b, G.seed ? graine(hacher(G.seed + "|lieu|" + L.nom)) : null); return etatLieu(L, b);
  });
  equiperDepart();
}
// État de départ d'un lieu : sa liste d'objets, + les poissons (étang) ou les arbres (forêt)
function etatLieu(L, b){ var l = { butin:b }; if(L.peche) l.poissons = BAL.peche.poissons; if(L.bois) l.arbres = BAL.foret.arbres; if(L.cuve) l.essence = BAL.station.litres; return l; }
// Litres encore dans la cuve de la station (les anciennes parties n'avaient pas de cuve : elle est pleine)
function cuveLieu(i){ var l = G.lieux[i]; if(!LIEUX[i].cuve) return 0; if(l.essence === undefined) l.essence = BAL.station.litres; return l.essence; }
// Anciennes sauvegardes (avant l'étang) : on insère l'étang à sa place dans la liste des lieux
// Prénom laissé par défaut = il suit la langue du jeu (« Mom » redevient « Maman » en français) ; un prénom choisi ne change pas (2026-11-16)
var PRENOMS_DEFAUT = { "Papa":["Papa", "Dad"], "Maman":["Maman", "Mom"] };
function prenomsSelonLangue(g){
  var conv = function(o){ var r = o && o.r, L = r && PRENOMS_DEFAUT[r]; if(L && L.indexOf(o.n != null ? o.n : o.nom) >= 0){ var v = typeof prenomDefaut === "function" ? prenomDefaut(r) : r; if(o.n != null) o.n = v; else o.nom = v; } };
  (g.m || []).forEach(conv); (g.dd || []).forEach(conv);
}
function migrerPartie(g){
  prenomsSelonLangue(g);
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
    g.lieux.push(etatLieu(L, melanger(b2, graine(hacher(L.nom)))));
  }
  if(!g.decouverts) g.decouverts = {};
  // Avant les traits : chaque membre garde son atout d'origine
  (g.m || []).forEach(function(x){
    if(x.r) return;
    var f = FAMILLE.filter(function(f){ return f.nom === x.nom; })[0];
    x.r = x.nom; x.trait = f ? f.trait : null;
  });
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
// Bonus de soin : un Soigneur en vie dans la famille
function bonusSoin(){ return vivants().some(function(x){ return x.trait === "soigneur"; }) ? BAL.traits.soin : 0; }
// k (facultatif) : le soin choisi par le joueur ; sinon le plus adapté
function soigner(i, k){
  var x = G.m[i]; if(!x.al || x.hp >= 100) return null;
  var bonus = bonusSoin();
  if(!(k && OBJETS[k] && OBJETS[k].soin && compter(k) > 0)) k = choisirSoin(100 - x.hp - bonus);
  if(!k) return null;
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
// Une ration rend 30 : au-dessus de 70, une partie serait perdue, donc on ne propose pas
function seuilRation(cat){ return 100 - (cat === "eau" ? BAL.soifParJour : BAL.faimParJour); }
function peutPrendreRation(x, cat){ var j = cat === "eau" ? x.soif : x.faim; return x.al && j <= seuilRation(cat) && rations(cat) > 0; }
// Rations que la famille prendra cette nuit (1 chacun + rattrapage si la jauge est basse)
function besoinNuit(cat){
  var v = vivants(), b = v.length, reste = rations(cat) - v.length;
  if(cat === "nour"){ var pl = Math.min(platsDispo().length, v.filter(function(x){ return x.faim - BAL.faimParJour + 45 <= 110; }).length); b -= pl; reste += pl; } // ceux qui mangent un plat ne prennent pas de ration
  v.forEach(function(x){
    var perte = cat === "eau" ? BAL.soifParJour + (x.trait === "endurant" ? BAL.traits.endurantSoif : 0) : BAL.faimParJour + (x.trait === "costaud" ? BAL.traits.costaudFaim : 0);
    var j = (cat === "eau" ? x.soif : x.faim) - perte + (cat === "eau" ? BAL.soifParJour : BAL.faimParJour);
    if(j < BAL.rattrapage && (reste > 0 || j <= BAL.critique && rations(cat) > b)){ b++; reste--; }
  });
  return b;
}
/* ---------- Cuisine ---------- */
function platsDispo(){ return G.stock.o.filter(function(o){ return OBJETS[o.id].plat; }); }
function aIngredient(k, n){ return k === "eau" ? rations("eau") >= n : compter(k) >= n; }
// Pourquoi on ne peut pas cuisiner cette recette (null = c'est possible)
function empechementCuisine(r){
  var rec = RECETTES_CUISINE[r], manque = [];
  for(var k in rec.ingredients) if(!aIngredient(k, rec.ingredients[k])) manque.push(k);
  if(manque.length) return "Il manque des ingrédients";
  if(compter("planche") < BAL.cuisine.planches) return trad("Il faut {o} pour la cuisinière", { o:nommer("planche", BAL.cuisine.planches) });
  if(!artisan()) return "Tout le monde est trop fatigué";
  return null;
}
function portionsRecette(r){ return RECETTES_CUISINE[r].portions + (vivants().some(function(x){ return x.trait === "cuisinier"; }) ? BAL.traits.cuisinier : 0) + (vivants().some(function(x){ return aTitre(x, "chef"); }) ? 1 : 0); }
function cuisiner(r){
  if(empechementCuisine(r)) return null;
  var rec = RECETTES_CUISINE[r], x = artisan(), n = portionsRecette(r);
  x.en -= coutTravail(x);
  for(var k in rec.ingredients){ if(k === "eau") prendreRations("eau", rec.ingredients[k]); else consommer(k, rec.ingredients[k]); }
  retirer("planche", BAL.cuisine.planches);
  ajouter(rec.id, n, 1); G.cuisineJour = G.day; G.cuisinierR = x.r || x.nom; // qui a vraiment cuisiné : c'est lui qu'on voit aux fourneaux (2026-11-14) G.stats.plats = (G.stats.plats || 0) + n;
  var tt = exploit(x, "plats");
  return trad("{x} cuisine {o}.", { x:x.nom, o:nommer(rec.id, n) }) + (tt ? " " + tt : "");
}
// Un membre mange un plat (celui qui se gâtera le plus tôt, ou le plat choisi) ; renvoie son id
function mangerPlat(x, id){
  var ps = platsDispo().filter(function(o){ return !id || o.id === id; }).sort(function(a, b){ return a.sol - b.sol; });
  if(!ps.length) return null;
  var o = ps[0], P = OBJETS[o.id].plat; retirerInstance(o.uid);
  x.faim = Math.min(100, x.faim + P.faim);
  if(P.pv) x.hp = Math.min(100, x.hp + P.pv);
  if(P.en) x.en = Math.min(100, x.en + P.en);
  if(P.moral) changerMoral(P.moral);
  return o.id;
}
// La nuit : on mange un plat s'il ne gaspille presque rien, ou s'il va se gâter de toute façon
function platUtile(x){
  var ps = platsDispo().sort(function(a, b){ return a.sol - b.sol; }); if(!ps.length) return false;
  return ps[0].sol <= 1 || x.faim + OBJETS[ps[0].id].plat.faim <= 110;
}
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
var FEMININS = ["Maman", "Emma", "Nora", "Inès"];
// Rôle d'origine (le nom peut avoir été changé au départ) : sert au portrait et aux accords
function roleDe(x){ return x.r || x.nom; }
// « Papa est mort de soif », « Emma a été tuée par un coureur (Supermarché) » ; r = rôle (féminin ou non)
// Accord au féminin du participe qui commence la cause (« mort de soif » → « morte de soif », « tué par » → « tuée par »…)
var PARTICIPES_MORT = /^(mort|tué|mordu|tombé|emporté|coupé|sacrifié|parti|blessé)(?![a-zé])/;
function accorder(r, texte){
  texte = String(texte || "");
  if(FEMININS.indexOf(r) < 0) return texte;
  return texte.replace(PARTICIPES_MORT, "$1e").replace(/, seul\b/, ", seule"); // « devenu fou » parle du meurtrier : on n’y touche pas
}
// Cause seule, accordée et avec une majuscule, pour une légende sous un prénom : « Morte de soif », « Tuée par un coureur »
function causeMort(r, cause){ if(anglais() && typeof causeAnglaise === "function"){ var ce = causeAnglaise(cause || "mort").replace(/^was /, ""); return ce.charAt(0).toUpperCase() + ce.slice(1); }
  var t = accorder(r, cause || "mort"); return t.charAt(0).toUpperCase() + t.slice(1); }
function phraseMort(nom, cause, r){
  r = r || nom;
  if(anglais() && typeof causeAnglaise === "function") return nom + " " + causeAnglaise(cause || "mort") + ".";
  if(!cause) return nom + " est " + accorder(r, "mort") + ".";
  if(/^(mort|tombé|parti)/.test(cause)) return nom + " est " + accorder(r, cause) + ".";
  if(/^(mordu|coupé)/.test(cause)) return nom + " est " + accorder(r, "mort") + ", " + accorder(r, cause) + ".";
  if(/^(tué|emporté|sacrifié)/.test(cause)) return nom + " a été " + accorder(r, cause) + ".";
  return nom + " est " + accorder(r, "mort") + " : " + cause + ".";
}
// Remplace Papa, Maman, Léo, Emma dans les récits par les prénoms choisis.
// t peut être une liste de versions : on prend la première qui ne nomme que des membres en vie (sinon la dernière, sans nom).
// passe = true : récit d'un chapitre déjà vécu, on garde la version d'origine (c'était vrai à ce moment-là).
var ROLES_EN = { "Dad":"Papa", "Mom":"Maman", "Léo":"Léo", "Emma":"Emma" };
function nommeVivants(t){ return (String(t).match(anglais() ? /Dad|Mom|Léo|Emma/g : /Papa|Maman|Léo|Emma/g) || []).every(function(r){ var x = parRole(ROLES_EN[r] && anglais() ? ROLES_EN[r] : r); return x && x.al; }); }
function perso(t, passe){
  if(typeof tradVersions === "function") t = tradVersions(t); // récit traduit (lang-en.js) avant de choisir la version
  if(Array.isArray(t)) t = (!G || !G.m || passe) ? t[0] : (t.filter(nommeVivants)[0] || t[t.length - 1]);
  if(!G || !G.m) return t;
  if(anglais()) return String(t).replace(/\b(Dad|Mom|Léo|Emma)\b/g, function(m){ var x = parRole(ROLES_EN[m]); return x ? x.nom : m; });
  // « d’Emma » devient « de Lina » si le prénom choisi commence par une consonne
  return String(t).replace(/(\b[dD](?:’|'|e ))?(Papa|Maman|Léo|Emma)/g, function(m, d, r){ var x = parRole(r), nom = x ? x.nom : r; if(!d) return nom; var v = de(nom); return d.charAt(0) === "D" ? v.charAt(0).toUpperCase() + v.slice(1) : v; });
}
function blesser(x, d, n, cause){
  if(!x || !x.al) return;
  var avantPV = x.hp;
  x.hp -= d;
  if(x.hp > 0 && x.hp <= BAL.exploits.seuilBlessure && avantPV > BAL.exploits.seuilBlessure) exploit(x, "blessures", 1, n);
  if(x.hp <= 0){
    x.hp = 0; x.al = false; changerMoral(-25);
    // Annonce mise en avant dans les textes (classe « mort », avec le nom pour afficher son portrait)
    n.push(["mort", phraseMort(x.nom, cause, roleDe(x)), roleDe(x)]);
    G.dd.push({ n:x.nom, r:roleDe(x), c:cause || "cause inconnue", j:G.day, ic:x.icone });
    rendreAuStock([x]); // son équipement reste à la famille
    derniereParole(x, n); deuilPour(x, n);
  }
}
// Usure d’une arme : perd 1 de solidité, se casse à 0
// Prévenir quand un objet porté n'a presque plus de solidité (2 utilisations ou moins)
function avertirUsure(x, o, n, unite){
  if(!o.sol || o.sol > 2) return;
  var d = OBJETS[o.id];
  n.push(["b2", "⚠️ " + (anglais() ? x.nom + "’s " + minus(d.nom) + " is almost broken: " + o.sol + " " + ({ coup:"hit", fouille:"search", sortie:"trip" }[unite] || unite) + (o.sol > 1 ? "s" : "") + " left. Repair it in the workshop or swap it." : (d.g === "f" ? "La " : "Le ") + minus(d.nom) + " " + de(x.nom) + " est presque " + (d.g === "f" ? "cassée" : "cassé") + " : encore " + o.sol + " " + unite + (o.sol > 1 ? "s" : "") + ". Répare-" + (d.g === "f" ? "la" : "le") + " à l’atelier ou change-" + (d.g === "f" ? "la" : "le") + ".")]);
}
function userArme(x, n){
  var a = x.eq.arme; if(!a) return;
  a.sol--;
  if(a.sol <= 0){ x.eq.arme = null; n.push(["b2", "💥 " + (anglais() ? x.nom + "’s " + minus(OBJETS[a.id].nom) + " breaks!" : (OBJETS[a.id].g === "f" ? "La " : "Le ") + minus(OBJETS[a.id].nom) + " " + de(x.nom) + " se brise !")]); }
  else avertirUsure(x, a, n, "coup");
}

/* ---------- Expédition (fouille d'un lieu) ---------- */
function dangerLieu(i){ return LIEUX[i].danger + Math.min(BAL.dangerMaxAjoute, G.day * BAL.dangerParJour) + (G.hordeJour === G.day ? 0.2 : 0) + (G.lieux && G.lieux[i] && G.lieux[i].cache >= G.day ? BAL.caches.danger : 0); }
// Ce qui reste à prendre dans un lieu (à l'étang : les objets + les poissons)
function resteLieu(i){ var l = G.lieux[i]; return l.butin.length + (LIEUX[i].peche ? (l.poissons || 0) : 0) + (LIEUX[i].bois ? (l.arbres || 0) : 0) + Math.floor(cuveLieu(i) / VOITURE.litresJerrican); }
function bucherons(team){ return team.filter(function(x){ return x.al && x.eq.arme && OBJETS[x.eq.arme.id].coupe; }); }
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
function remiseEnergie(x){ return (x.trait === "endurant" ? BAL.traits.endurant : 0) + (aTitre(x, "eclaireur") ? BAL.exploits.eclaireur : 0); }
/* ---------- Expérience : compteurs et titres (TITRES dans data.js) ---------- */
function aTitre(x, id){ var t = TITRES.find(function(t){ return t.id === id; }); return !!(x && t && x.xp && (x.xp[t.k] || 0) >= t.n); }
function titresDe(x){ return TITRES.filter(function(t){ return aTitre(x, t.id); }); }
// Ajoute à un compteur ; renvoie l'annonce si un titre vient d'être gagné (et la pousse dans n si on le donne)
function exploit(x, k, nb, n){
  if(!x || !x.al) return "";
  x.xp = x.xp || {}; var avant = x.xp[k] || 0; x.xp[k] = avant + (nb || 1);
  if(typeof noterDefi === "function") noterDefi(k, nb || 1); // défis du jour / de la semaine (defis.js)
  var txt = "";
  TITRES.forEach(function(t){ if(t.k === k && avant < t.n && x.xp[k] >= t.n){ txt = "🏅 " + trad("{nom} devient « {titre} » : {effet} !", { nom:x.nom, titre:t.nom, effet:t.effet }); if(n) n.push(["g2", txt]); } });
  return txt;
}
// Tombes de la cour : se recueillir une fois par jour (un peu de moral)
function peutRecueillir(){ return G.dd && G.dd.length > 0 && G.recueilJour !== G.day; }
function recueillir(){ if(!peutRecueillir()) return false; G.recueilJour = G.day; changerMoral(BAL.tombes.moral);
  vivants().forEach(function(y){ if(y.deuil) y.deuil.fin -= BAL.famille.recueillirDeuil; }); return true; }
// Grande horde du week-end (événement mondial, defis.js pose HORDE_MONDIALE) : jamais dans une partie temporaire de raid
function hordeMondiale(){ return typeof HORDE_MONDIALE !== "undefined" && !!HORDE_MONDIALE && !(G && G.bacASable); }
function chanceAttaqueNuit(){ var A = BAL.attaqueNuit; return (G.porteOuverte ? BAL.porteOuverte.attaque : 0) + Math.min(A.max + (hordeMondiale() ? 0.1 : 0), A.base + G.day * A.parJour + compter("poule") * BAL.poules.attaque + (hordeMondiale() ? BAL.horde.risque : 0)); }
function forceMiniNuit(){ return 1 + Math.floor(G.day / BAL.attaqueNuit.joursParForce) + (hordeMondiale() ? BAL.horde.force : 0); }
// Saison du jour de jeu (SAISONS, data.js)
function saison(d){ return SAISONS[Math.floor(((d || G.day) - 1) / BAL.saisons.duree) % SAISONS.length]; }
function estSaison(id){ return !!(G && G.day && saison().id === id); }
function coutTravail(x){ return BAL.energieCraft - (aTitre(x, "bricoleur") ? BAL.exploits.bricoleur : 0); }
function coutPour(x, i, voiture){ return Math.max(0, coutEnergie(i, voiture) - remiseEnergie(x)); }
function peutSortir(x){ return x.al && !x.raid && x.en >= coutMin() - remiseEnergie(x); } // x.raid : volontaire parti au bastion pour le raid de l'immeuble
function equipePeutAller(team, i, voiture){
  voiture = voiture || LIEUX[i].voiture;
  if(voiture && !voitureOk(i)) return false;
  return team.length > 0 && team.every(function(x){ return x.al && x.en >= coutPour(x, i, voiture); });
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
  return trad("{x} installe {o}.", { x:x.nom, o:nommer(id, 1) }) + (voitureReparee() ? " 🚗 " + trad("Le moteur tousse… et démarre ! La voiture roule.") : "");
}
function fairePlein(){
  if(compter("jerrican") < 1 || G.voiture.essence >= VOITURE.reservoir) return null;
  retirer("jerrican", 1);
  var avant = G.voiture.essence;
  G.voiture.essence = Math.min(VOITURE.reservoir, avant + VOITURE.litresJerrican);
  return trad("Plein fait : ⛽ {n} L", { n:G.voiture.essence }) + (avant + VOITURE.litresJerrican > VOITURE.reservoir ? " " + trad("(le surplus a débordé)") : "") + ".";
}
function forceEquipe(team){
  var f = 0;
  team.forEach(function(x){ if(!x.al) return; f += 1 + (x.eq.arme ? OBJETS[x.eq.arme.id].def : 0) + (x.trait === "costaud" ? BAL.traits.costaud : 0) - (fatigue(x) ? BAL.fatigueForce : 0); });
  return Math.max(0, f);
}
function placesEquipe(team){
  var p = 0; team.forEach(function(x){ if(x.al) p += BAL.mainsParMembre + (x.eq.sac ? OBJETS[x.eq.sac.id].capacite : 0) - (x.trait === "agile" ? BAL.traits.frele : 0); }); return p;
}

function expedition(i, voiture){
  var L = LIEUX[i], lieu = G.lieux[i], n = [], mult = 1, d = dangerLieu(i);
  var team = G.sel.map(function(j){ return G.m[j]; });
  compterBinomes(team);
  var kit = function(test){ for(var t = 0; t < team.length; t++){ var o = team[t].eq.outil; if(o && test(OBJETS[o.id])) return team[t]; } return null; };

  if(L.sombre){
    var lampe = kit(function(o){ return o.lumiere === 2; }), briquet = kit(function(o){ return o.lumiere === 1; });
    if(lampe && compter("pile") > 0){ retirer("pile", 1); n.push(["g2", "🔦 " + trad("{nom} éclaire les lieux avec la lampe torche (1 pile utilisée).", { nom:lampe.nom })]); }
    else {
      if(lampe) n.push(["b2", "🔦 " + trad("La lampe torche n’a plus de piles.")]);
      if(briquet){
        var feu = briquet.eq.outil;
        mult *= BAL.lueur.fouille; d += BAL.lueur.danger; n.push(["", "🔥 " + (anglais() ? briquet.nom + "’s " + minus(OBJETS[feu.id].nom) + " gives off a faint glow." : (OBJETS[feu.id].g === "f" ? "La " : "Le ") + minus(OBJETS[feu.id].nom) + " " + de(briquet.nom) + " donne une lueur faible.")]);
        if(feu.sol){ feu.sol--; if(feu.sol <= 0){ briquet.eq.outil = null; n.push(["b2", "🕯️ " + (anglais() ? briquet.nom + "’s torch has burned out." : "La torche " + de(briquet.nom) + " s’est consumée.")]); } else avertirUsure(briquet, feu, n, "fouille"); }
      }
      else { mult *= BAL.noir.fouille; d += BAL.noir.danger; n.push(["b2", "🌑 " + trad("Fouille à tâtons dans le noir.")]); }
    }
  }
  if(L.verrou){
    var ouvreur = kit(function(o){ return o.ouvre; });
    var serrure = false;
    if(ouvreur) n.push(["g2", "🔓 " + trad("{nom} ouvre la porte avec {outil}.", { nom:ouvreur.nom, outil:nommer(ouvreur.eq.outil.id, 1) })]);
    else if(compter("epingle") > 0) serrure = true; // le joueur choisira : crocheter ou forcer
    else { mult *= BAL.force.fouille; d += BAL.force.danger; n.push(["b2", "🔒 " + trad("Porte forcée à la brute, ça fait du bruit.")]); }
  }
  if(G.moral < BAL.moralBas){ mult *= BAL.moralBasFouille; n.push(["b2", "😟 " + trad("Moral bas : l’équipe fouille mal.")]); }
  else if(G.moral >= BAL.moralHaut) n.push(["g2", "😀 " + trad("Bon moral : l’équipe fouille avec entrain (+{n} objet).", { n:BAL.moralHautFouille })]);
  var bruyants = team.filter(function(x){ return x.trait === "fouineur"; });
  if(bruyants.length) d += BAL.traits.bruit * bruyants.length;
  var fatigues = team.filter(fatigue);
  if(fatigues.length){ mult *= BAL.fatigueFouille; n.push(["b2", "🥱 " + trad(fatigues.length > 1 ? "{noms} sont fatigués : fouille et combat moins efficaces." : "{noms} est fatigué : fouille et combat moins efficaces.", { noms:liste(fatigues.map(function(x){ return x.nom; })) })]); }

  // Rencontre ? Alors combat au tour par tour avant la fouille
  voiture = !!(voiture || L.voiture) && voitureOk(i);
  if(voiture){
    G.voiture.essence -= litres(i); d += VOITURE.bruit;
    n.unshift(["", "🚗 " + trad("Trajet en voiture (⛽ −{l} L, reste {r} L) : le moteur fait du bruit.", { l:litres(i), r:G.voiture.essence })]);
  }
  G.exp = { lieu:i, equipe:G.sel.slice(), notes:n, mult:mult, d:d, voiture:voiture };
  G.sel = [];
  if(serrure){ G.exp.serrure = { faites:0, cassees:0, fin:null }; return { serrure:true }; }
  return suiteExpedition();
}
// Après la porte : rencontre éventuelle (combat), sinon fouille directe
function suiteExpedition(){
  if(celebreIci(G.exp.lieu) || hasard() < G.exp.d){ creerCombat(); return { combat:true }; }
  return avantFouille();
}
// Avant la fouille : à l'étang, s'il reste des poissons et qu'un survivant a une canne, on pêche (mini-jeu)
function pecheursEquipe(){ return G.exp.equipe.map(function(j){ return G.m[j]; }).filter(function(x){ return x.al && x.eq.outil && OBJETS[x.eq.outil.id].peche; }); }
function avantFouille(){
  var E = G.exp;
  if(LIEUX[E.lieu].peche && !E.peche && G.lieux[E.lieu].poissons > 0 && !estSaison("hiver")){
    var p = pecheursEquipe();
    if(p.length){ E.peche = { lancers:BAL.peche.lancers * p.length, faits:0, prises:0 }; return { peche:true }; }
  }
  return finExpedition();
}
// Un lancer du mini-jeu : reussi = le joueur a ferré pendant que le bouchon était enfoncé
function lancerPeche(reussi){
  var P = G.exp.peche; if(!P || P.faits >= P.lancers) return false;
  P.faits++;
  if(reussi && P.prises < G.lieux[G.exp.lieu].poissons) P.prises++;
  return true;
}

/* ---------- Crochetage ----------
   Mini-jeu : un curseur va et vient, il faut appuyer quand il est dans la
   zone verte, une fois par goupille. Chaque raté casse une épingle. */
function crocheteur(){
  var eq = G.exp.equipe.map(function(j){ return G.m[j]; });
  return eq.filter(function(x){ return x.trait === "agile" || aTitre(x, "passepartout"); })[0] || eq[0];
}
function zoneCrochetage(){ var x = crocheteur(); return x.trait === "agile" || aTitre(x, "passepartout") ? BAL.crochetage.zoneAgile : BAL.crochetage.zone; }
function forcerPorte(){
  var E = G.exp; E.mult *= BAL.force.fouille; E.d += BAL.force.danger;
  E.notes.push(["b2", "🔒 " + trad("Porte forcée à la brute, ça fait du bruit.")]);
  if(E.serrure && !E.serrure.fin) E.serrure.fin = "force";
}
// reussi : le joueur a appuyé dans la zone verte ? Renvoie un message.
function tentativeGoupille(reussi){
  var S = G.exp.serrure, x = crocheteur();
  if(reussi){
    S.faites++;
    if(S.faites >= BAL.crochetage.goupilles){
      S.fin = "ouvert"; G.stats.crochetages = (G.stats.crochetages || 0) + 1; exploit(x, "crochetages", 1, G.exp.notes);
      G.exp.notes.push(["g2", "🗝️ " + (S.cassees ? trad("{nom} crochète la serrure en silence ({epingles} cassée(s)).", { nom:x.nom, epingles:nommer("epingle", S.cassees) }) : trad("{nom} crochète la serrure en silence.", { nom:x.nom }))]);
      return "Clic ! La porte s’ouvre.";
    }
    return trad("Clic ! Goupille {n} en place.", { n:S.faites });
  }
  retirer("epingle", 1); S.cassees++;
  if(compter("epingle") < 1){ S.fin = "echec"; forcerPorte(); return "Crac ! Plus d’épingles : il faut forcer la porte."; }
  return trad("Crac ! L’épingle casse (il en reste {n}).", { n:compter("epingle") });
}


// Fouille et retour (après un éventuel combat)
function finExpedition(){
  var E = G.exp, i = E.lieu, lieu = G.lieux[i], n = E.notes, mult = E.mult;
  var team = E.equipe.map(function(j){ return G.m[j]; });
  var C = G.combat;
  if(C){
    n = n.concat(C.resume);
    apresCombatCelebre(n);
    if(C.fin === "fuite") mult *= BAL.combat.butinFuite;
  }
  var vole = butinVole(C);
  // Fouille : on pioche dans la vraie liste du lieu
  var survivants = team.filter(function(x){ return x.al; });
  survivants.forEach(function(x){ exploit(x, "fouilles", 1, n); });
  var nb = survivants.length * BAL.fouilleParMembre + (survivants.some(function(x){ return x.trait === "fouineur"; }) ? BAL.traits.fouine : 0)
    - survivants.filter(function(x){ return x.trait === "optimiste"; }).length * BAL.traits.reveur
    + (G.moral >= BAL.moralHaut ? BAL.moralHautFouille : 0)
    - survivants.filter(fou).length;
  nb = Math.max(survivants.length ? 1 : 0, Math.round(nb * mult));
  if(vole && survivants.length){ nb = Math.max(0, nb - vole); n.push(["b2", "🎒 " + tradN(vole, "Les Pilleurs sont partis avec 1 objet de votre butin.", "Les Pilleurs sont partis avec {n} objets de votre butin.")]); }
  // On pioche nb objets ; les ingrédients de cuisine croisés en chemin viennent en plus (ils ne prennent pas la place d'une trouvaille)
  var trouves = [], kb = 0, pris0 = 0;
  while(kb < lieu.butin.length && pris0 < nb){ if(OBJETS[lieu.butin[kb]].cat !== "ingredient") pris0++; kb++; }
  if(survivants.length) trouves = lieu.butin.splice(0, kb);
  // Pêche : chaque survivant qui a une canne attrape des poissons (tant qu'il en reste)
  var peches = 0;
  if(LIEUX[i].peche && E.peche){
    // Résultat du mini-jeu : les poissons ferrés, partagés entre les pêcheurs ; chaque canne s'use
    peches = Math.min(lieu.poissons, E.peche.prises);
    lieu.poissons -= peches; G.stats.poissons = (G.stats.poissons || 0) + peches; if(peches && typeof noterDefi === "function") noterDefi("poissons", peches);
    for(var pp = 0; pp < peches; pp++) trouves.unshift("poisson");
    n.push([peches ? "g2" : "b2", "🎣 " + (peches ? trad("Vous pêchez {poissons} ({n} touche(s) sur {l}).", { poissons:nommer("poisson", peches), n:peches, l:E.peche.lancers }) : trad("Aucun poisson cette fois : ils ont tous filé."))]);
    survivants.forEach(function(x){ var c = x.eq.outil; if(!c || !OBJETS[c.id].peche) return; c.sol--; if(c.sol <= 0){ x.eq.outil = null; n.push(["b2", "🎣 " + (anglais() ? x.nom + "’s fishing rod breaks." : "La canne à pêche " + de(x.nom) + " casse.")]); } else avertirUsure(x, c, n, "sortie"); });
  }
  else if(LIEUX[i].peche && estSaison("hiver") && survivants.some(function(x){ return x.eq.outil && OBJETS[x.eq.outil.id].peche; })) n.push(["b2", "❄️ " + trad("L’étang est gelé : impossible de pêcher avant le printemps.")]);
  else if(LIEUX[i].peche) survivants.forEach(function(x){
    var c = x.eq.outil; if(!c || !OBJETS[c.id].peche) return;
    var k = Math.min(lieu.poissons, Math.max(1, Math.round(R(BAL.peche.prises[0], BAL.peche.prises[1]) * mult)));
    lieu.poissons -= k; peches += k; G.stats.poissons = (G.stats.poissons || 0) + k; if(k && typeof noterDefi === "function") noterDefi("poissons", k);
    for(var p = 0; p < k; p++) trouves.unshift("poisson");
    n.push(["g2", "🎣 " + trad("{nom} pêche {poissons}.", { nom:x.nom, poissons:k ? nommer("poisson", k) : trad("rien") })]);
    c.sol--; if(c.sol <= 0){ x.eq.outil = null; n.push(["b2", "🎣 " + (anglais() ? x.nom + "’s fishing rod breaks." : "La canne à pêche " + de(x.nom) + " casse.")]); }
  });
  // Forêt : chaque survivant qui a une hache en main coupe du bois (tant qu'il reste des arbres)
  if(LIEUX[i].bois){
    var bu = bucherons(survivants);
    bu.forEach(function(x){
      if(lieu.arbres <= 0) return;
      var k = Math.min(lieu.arbres, Math.max(1, Math.round(R(BAL.foret.coupe[0], BAL.foret.coupe[1]) * mult)));
      lieu.arbres -= k; G.stats.bois = (G.stats.bois || 0) + k; if(typeof noterDefi === "function") noterDefi("bois", k);
      for(var pb = 0; pb < k; pb++) trouves.unshift("planche");
      n.push(["g2", "🪓 " + trad("{nom} abat un arbre : {planches}.", { nom:x.nom, planches:nommer("planche", k) })]);
      var h = x.eq.arme; h.sol -= BAL.foret.usure;
      if(h.sol <= 0){ x.eq.arme = null; n.push(["b2", "💥 " + (anglais() ? x.nom + "’s axe breaks on a trunk!" : "La hache " + de(x.nom) + " se brise sur un tronc !")]); } else avertirUsure(x, h, n, "coup");
    });
    if(survivants.length && !bu.length && lieu.arbres > 0) n.push(["b2", "🪓 " + trad("Sans hache en main, impossible de couper du bois.")]);
    if(lieu.arbres <= 0 && bu.length) n.push(["b2", "🌲 " + trad("Il ne reste plus un arbre debout dans la forêt.")]);
  }
  if(LIEUX[i].peche && !peches && survivants.length && !survivants.some(function(x){ return x.eq.outil && OBJETS[x.eq.outil.id].peche; })) n.push(["b2", "🎣 " + trad("Sans canne à pêche, impossible d’attraper les poissons.")]);
  // Station-service : la cuve souterraine. Chaque survivant remplit un jerrican à la pompe à main (tant qu'il en reste)
  if(LIEUX[i].cuve && survivants.length){
    var nj = Math.min(survivants.length, Math.floor(cuveLieu(i) / VOITURE.litresJerrican));
    if(nj){ lieu.essence -= nj * VOITURE.litresJerrican; ajouter("jerrican", nj); n.push(["g2", "⛽ " + trad("À la pompe à main, vous remplissez {j} dans la cuve (il reste {n} L).", { j:nommer("jerrican", nj), n:lieu.essence })]); }
    else n.push(["b2", "⛽ " + trad("La cuve de la station est vide.")]);
  }

  // Transport : bras + sacs ; ce qui ne rentre pas reste sur place
  var places = placesEquipe(survivants) + (E.voiture && survivants.length ? VOITURE.coffre : 0);
  var pris = [], laisses = [];
  trouves.sort(function(a, b){ return (OBJETS[a].cat === "ingredient" ? 1 : 0) - (OBJETS[b].cat === "ingredient" ? 1 : 0); }); // les ingrédients en dernier dans les sacs
  trouves.forEach(function(id){ if(OBJETS[id].place <= places){ places -= OBJETS[id].place; pris.push(id); } else laisses.push(id); });
  // Les poissons qu'on ne peut pas porter sont relâchés dans l'étang
  lieu.butin = laisses.filter(function(id){ return id !== "poisson"; }).concat(lieu.butin);
  if(LIEUX[i].peche) lieu.poissons += laisses.filter(function(id){ return id === "poisson"; }).length;
  pris.forEach(function(id){ ajouter(id, 1); });

  team.forEach(function(x){ x.en = Math.max(0, x.en - coutPour(x, i, E.voiture)); });
  G.exp = null; G.combat = null;
  if(survivants.length){ G.stats.lieux[i] = true; if(LIEUX[i].voiture) G.stats.eloignes++; }
  if(survivants.length && G.mission && G.mission.lieu === i){ var mr = reussirMission(); if(mr) n.push(["g2", mr]); }
  var res = { lieu:i, notes:n, pris:grouper(pris), laisses:grouper(laisses), vide:resteLieu(i) === 0 };
  if(survivants.length) lancerRencontre(E.equipe, res);
  if(survivants.length) lancerSiphon(E.equipe, res);
  return res;
}
/* ---------- Siphonner une voiture abandonnée (2026-11-11, idée de Fabien) ----------
   Sur le chemin du retour, de temps en temps, une voiture abandonnée : avec un kit de siphonnage au refuge,
   l'équipe peut tenter de siphonner son réservoir (mini-jeu : réussi = 4 à 12 L, raté = les zombies arrivent, on file). */
function kitSiphon(){ return G.stock.o.find(function(o){ return o.id === "siphon"; }) || null; }
function lancerSiphon(equipe, res){
  var B = BAL.siphon;
  if(G.rencontre || G.siphon || !kitSiphon() || G.day < B.jour || G.jourSiphon === G.day || hasard() >= B.chance) return;
  G.siphon = { equipe:equipe.slice(), apres:res }; G.jourSiphon = G.day; res.siphon = true;
}
// reussi : true / false (mini-jeu), null = on ne s'arrête pas
function finirSiphon(reussi){
  var S = G.siphon; if(!S) return null;
  var res = S.apres, k = kitSiphon(); G.siphon = null;
  if(reussi === null || !k){ res.notes.push(["", "🚗 " + trad("Vous passez devant une voiture abandonnée sans vous arrêter.")]); return res; }
  k.sol--; if(k.sol <= 0){ retirerInstance(k.uid); res.notes.push(["b2", "🧪 " + trad("Le kit de siphonnage est fichu : le tuyau a cédé.")]); }
  if(reussi){
    var l = R(BAL.siphon.litres[0], BAL.siphon.litres[1]), place = VOITURE.reservoir - G.voiture.essence, dans = Math.min(place, l), reste = l - dans, j = Math.floor(reste / VOITURE.litresJerrican);
    G.voiture.essence += dans; if(j) ajouter("jerrican", j);
    G.stats.siphons = (G.stats.siphons || 0) + 1;
    res.notes.push(["g2", "⛽ " + trad("Vous siphonnez {n} L d’essence dans une voiture abandonnée", { n:l }) + (dans ? trad(" (réservoir : {n} L)", { n:G.voiture.essence }) : "") + (j ? trad(" et remplissez {j}", { j:nommer("jerrican", j) }) : "") + (reste - j * VOITURE.litresJerrican > 0 && !dans ? trad(" (le reste déborde)") : "") + "."]);
  } else res.notes.push(["b2", "🧟 " + trad("Le tuyau gargouille, l’essence gicle… le bruit attire des zombies : vous filez les mains vides !")]);
  return res;
}
/* ---------- Rencontres en chemin ---------- */
function lancerRencontre(equipe, res){
  var B = BAL.rencontres; G.rencontresFaites = G.rencontresFaites || [];
  if(G.rencontre || G.day < B.jour || G.jourRencontre === G.day) return;
  var nomLieu = res && LIEUX[res.lieu] ? (LIEUX[res.lieu].cle || LIEUX[res.lieu].nom) : ""; // nom français (identifiant) même quand le jeu est traduit
  var ok = RENCONTRES.filter(function(r){ return G.day >= (r.jour || 1) && (!r.cond || r.cond()) && G.rencontresFaites.indexOf(r.id) < 0 && (!r.lieu || r.lieu === nomLieu); });
  var ici = ok.filter(function(r){ return r.lieu; }); // une rencontre propre à ce lieu passe avant les autres
  if(hasard() >= (ici.length ? B.lieuChance : G.day >= B.tard ? B.chanceTard : B.chance)) return;
  if(ici.length) ok = ici;
  if(!ok.length) return;
  var r = ok[R(0, ok.length - 1)];
  G.rencontre = { id:r.id, noeud:"debut", equipe:equipe.slice(), apres:res, texte:null, lignes:[] };
  G.jourRencontre = G.day; G.rencontresFaites.push(r.id); res.rencontre = true;
}
function rencontreCourante(){ return G.rencontre ? RENCONTRES.find(function(r){ return r.id === G.rencontre.id; }) : null; }
function equipeRencontre(){ return (G.rencontre.equipe || []).map(function(j){ return G.m[j]; }).filter(function(x){ return x && x.al; }); }
// Chance d'un choix (avec le bonus du trait si un membre de l'équipe l'a)
function chanceChoix(c){ return Math.min(0.95, c.chance + (c.trait && equipeRencontre().some(function(x){ return x.trait === c.trait; }) ? BAL.rencontres.bonusTrait : 0)); }
function appliquerEffets(e, L){
  if(!e) return;
  var eq = equipeRencontre(), cible = eq.length ? eq[R(0, eq.length - 1)] : vivants()[0], recu = [];
  if(e.nour){ var pn = prendreRations("nour", e.nour); if(pn) L.push(["b2", "🥫 " + tradN(pn, "−1 ration de nourriture.", "−{n} rations de nourriture.")]); }
  if(e.eau){ var pe = prendreRations("eau", e.eau); if(pe) L.push(["b2", "💧 " + tradN(pe, "−1 ration d’eau.", "−{n} rations d’eau.")]); }
  var moins = function(id, q){ return icone(id) + " −" + q + " " + (q > 1 ? OBJETS[id].pl : OBJETS[id].nom).toLowerCase() + "."; };
  for(var s = 0; s < (e.soins || 0); s++){ var k = retirerSoin(); if(k) L.push(["b2", moins(k, 1)]); }
  if(e.perdre) for(var p in e.perdre){ var q = Math.min(compter(p), e.perdre[p]); if(!q) continue; if(OBJETS[p].empile) retirer(p, q); else consommer(p, q); L.push(["b2", moins(p, q)]); }
  if(e.perdreConfort){ var kc = ["photo", "cartes", "peluche", "radio"].filter(function(k){ return compter(k) > 0; })[0]; if(kc){ consommer(kc, 1); L.push(["b2", moins(kc, 1)]); } }
  if(e.objets) for(var o in e.objets){ ajouter(o, e.objets[o]); recu.push(nommer(o, e.objets[o])); }
  if(recu.length) L.push(["g2", "🎁 " + trad("Vous rapportez {objets}.", { objets:liste(recu) })]);
  if(e.chien && !chien()){ G.chien = { nom:"Rex", faim:0 }; L.push(["g2", ic("chien", "🐕") + " " + trad("Rex fait désormais partie de la famille.")]); }
  if(e.recruter && recruter(e.recruter[0], e.recruter[1])) L.push(["g2", "🧑 " + trad("{nom} rejoint la famille.", { nom:e.recruter[0] })]);
  if(e.decouvrir){
    var ls = LIEUX.map(function(L2, i){ return i; }).filter(function(i){ return LIEUX[i].secret && !(G.decouverts && G.decouverts[i]); });
    if(ls.length){ G.decouverts = G.decouverts || {}; G.decouverts[ls[0]] = true; L.push(["g2", "📍 " + trad("Nouveau lieu découvert : {lieu}.", { lieu:LIEUX[ls[0]].nom })]); }
  }
  if(e.soigne){ eq.forEach(function(x){ x.hp = Math.min(100, x.hp + e.soigne); }); L.push(["g2", "🩹 " + trad("L’équipe est soignée (+{n} PV chacun).", { n:e.soigne })]); }
  if(e.essence && G.voiture){ var place = VOITURE.reservoir - G.voiture.essence, dans = Math.min(place, e.essence), nj = Math.floor((e.essence - dans) / VOITURE.litresJerrican); G.voiture.essence += dans; if(nj) ajouter("jerrican", nj); L.push(["g2", "⛽ " + trad("+{n} L d’essence", { n:e.essence }) + (dans ? trad(" (réservoir : {n} L)", { n:G.voiture.essence }) : "") + (nj ? trad(", {j} remplis", { j:nommer("jerrican", nj) }) : "") + "."]); }
  if(e.energie){ eq.forEach(function(x){ x.en = Math.max(0, x.en - e.energie); }); L.push(["b2", "⚡ " + trad("−{n} d’énergie pour l’équipe.", { n:e.energie })]); }
  if(e.folie) eq.forEach(function(x){ x.folie = Math.min(100, (x.folie || 0) + e.folie); });
  if(e.moral){ changerMoral(e.moral); L.push([e.moral > 0 ? "g2" : "b2", (e.moral > 0 ? "😊 " + trad("Moral +{n}.", { n:e.moral }) : "😟 " + trad("Moral {n}.", { n:e.moral }))]); }
  if(e.pv && cible){ L.push(["b2", "🩸 " + trad(FEMININS.indexOf(roleDe(cible)) >= 0 ? "{nom} est blessée (−{n} PV)." : "{nom} est blessé (−{n} PV).", { nom:cible.nom, n:e.pv })]); blesser(cible, e.pv, L, e.cause || "tué en chemin"); }
}
// Les choix proposés au nœud en cours (avec la raison s'ils sont impossibles)
function choixRencontre(){
  var R0 = rencontreCourante(); if(!R0 || !G.rencontre.noeud) return [];
  return R0.noeuds[G.rencontre.noeud].choix.map(function(c, k){ return { c:c, k:k, ok:!c.cond || c.cond() }; });
}
function choisirRencontre(k){
  var ch = choixRencontre()[k]; if(!ch || !ch.ok) return null;
  var c = ch.c, res = c, L = [];
  if(c.chance !== undefined) res = hasard() < chanceChoix(c) ? c.reussite : c.echec;
  appliquerEffets(res.effets || c.effets, L);
  G.rencontre.texte = res.texte || c.texte; G.rencontre.lignes = L;
  G.rencontre.reussi = c.chance === undefined ? null : res === c.reussite;
  G.rencontre.noeud = c.suite || null;
  return G.rencontre;
}
// Fin de la rencontre : on rend le résultat de la fouille (pour l'afficher)
function finirRencontre(){ var r = G.rencontre && G.rencontre.apres; if(r) r.notes = r.notes.concat((G.rencontre.lignes || []).filter(function(l){ return l[0] === "mort"; })); G.rencontre = null; return r; }

/* ---------- Combat au tour par tour ----------
   Au début de chaque tour, chaque zombie annonce ce qu'il va faire (son « intention » : qui il va mordre,
   ou hurler). Chaque membre choisit : frapper, viser la tête, pousser, se protéger, soigner ou lancer un
   cocktail incendiaire (ou toute l'équipe tente de fuir). Puis les zombies encore debout agissent.
   Spécialités (ZOMBIES dans data.js) : coups (frappe plusieurs fois), lourd (dur à pousser, écrase la protection),
   premier (frappe avant l'équipe), hurle (appelle un zombie un tour sur deux), explose (à sa mort), armure. */
function tirerZombie(sauf){
  var guerre = G.exp && G.exp.guerre, L = G.exp && !guerre && LIEUX[G.exp.lieu], plus = (L && L.zombies) || {};
  var types = ZOMBIES.filter(function(z){ return G.day >= z.jour && z.id !== sauf && !z.attente && !(guerre && z.horsGuerre); }), total = 0;
  var poids = function(z){ return z.poids + (plus[z.id] || 0); };
  types.forEach(function(z){ total += poids(z); });
  var r = hasard() * total;
  for(var k = 0; k < types.length; k++){ r -= poids(types[k]); if(r < 0) return types[k]; }
  return types[0];
}
function nouveauZombie(t){ return { id:t.id, nom:t.nom, icone:t.icone, pv:t.pv, pvMax:t.pv, degats:t.degats }; }
/* ---------- Zombie célèbre (2026-11-11, idée validée par Fabien) ----------
   G.celebre = { id, lieu, pv, pvMax, depuis } ; G.trophees = [{ id, nom, jour, par }] ; G.celebreProchain = jour du prochain */
function celebre(){ return G.celebre && LIEUX[G.celebre.lieu] ? G.celebre : null; }
function celebreIci(i){ var c = celebre(); return !!(c && c.lieu === i); }
function lieuxPourCelebre(sauf){ return LIEUX.map(function(L, i){ return i; }).filter(function(i){ return lieuOuvert(i) && i !== sauf && !LIEUX[i].voiture; }); }
// Chaque nuit : il apparaît (au jour voulu) ou change de lieu ; la radio dit où il a été vu
function nuitCelebre(n){
  var jour = G.day + 1, radio = possede(function(o){ return o.radio; });
  if(!G.celebre){
    if(jour < (G.celebreProchain || BAL.celebre.jour)) return;
    var types = ZOMBIES.filter(function(z){ return z.celebre && !(G.trophees || []).some(function(t){ return t.id === z.id; }); });
    if(!types.length) return;
    var T = types[Math.floor(alea("celebre") * types.length)], L0 = lieuxPourCelebre(-1); if(!L0.length) return;
    G.celebre = { id:T.id, lieu:L0[Math.floor(alea("celebre-lieu") * L0.length)], pv:T.pv, pvMax:T.pv, depuis:jour };
    n.push(["b2", "💀 " + trad("{z} rôde en ville : un zombie que tout le monde craint.", { z:T.nom }) + " " + (radio ? (anglais() ? "📻 The radio reports it near " + leLieu(LIEUX[G.celebre.lieu].nom) + "." : "📻 La radio le signale près " + de(leLieu(LIEUX[G.celebre.lieu].nom)).replace(/^de le /, "du ").replace(/^de les /, "des ") + ".") : trad("Une radio permettrait de savoir où."))]);
    return;
  }
  var L = lieuxPourCelebre(G.celebre.lieu); if(!L.length) return;
  G.celebre.lieu = L[Math.floor(alea("celebre-bouge") * L.length)];
  if(radio) n.push(["", "📻 " + (anglais() ? typeZombie({ id:G.celebre.id }).nom + " was seen near " + leLieu(LIEUX[G.celebre.lieu].nom) + "." : typeZombie({ id:G.celebre.id }).nom + " a été vu" + (G.celebre.id === "mariee" ? "e" : "") + " près " + de(leLieu(LIEUX[G.celebre.lieu].nom)).replace(/^de le /, "du ").replace(/^de les /, "des ") + ".")]);
}
// Après un combat où il était : il garde ses blessures, ou il tombe (butin, moral, trophée)
function apresCombatCelebre(n){
  var c = celebre(), C = G.combat; if(!c || !C) return;
  var z = C.zombies.find(function(x){ return x.celebre; }); if(!z) return;
  if(z.pv > 0){ c.pv = z.pv; n.push(["", "💀 " + trad(c.id === "mariee" ? "{z} s’échappe, blessée ({pv} / {max} PV). Elle rôdera ailleurs cette nuit." : "{z} s’échappe, blessé ({pv} / {max} PV). Il rôdera ailleurs cette nuit.", { z:z.nom, pv:z.pv, max:c.pvMax })]); return; }
  var par = (C.tueurCelebre !== undefined && G.m[C.tueurCelebre]) ? G.m[C.tueurCelebre].nom : "la famille";
  G.trophees = (G.trophees || []).concat([{ id:c.id, nom:z.nom, jour:G.day, par:par }]);
  G.celebre = null; G.celebreProchain = G.day + BAL.celebre.entre;
  for(var k in BAL.celebre.butin) ajouter(k, BAL.celebre.butin[k]);
  changerMoral(BAL.celebre.moral);
  G.stats.celebres = (G.stats.celebres || 0) + 1;
  n.push(["g2", "🏆 " + trad(c.id === "mariee" ? "{z} est tombée sous les coups de {par} ! La nouvelle fait le tour du quartier (moral +{m}). Sur sa dépouille : {butin}. Son trophée trône au salon." : "{z} est tombé sous les coups de {par} ! La nouvelle fait le tour du quartier (moral +{m}). Sur sa dépouille : {butin}. Son trophée trône au salon.", { z:z.nom, par:par, m:BAL.celebre.moral, butin:nommerListe(Object.keys(BAL.celebre.butin).map(function(k){ return { id:k, n:BAL.celebre.butin[k] }; })) })]);
}
function creerCombat(){
  var C = BAL.combat, nb = 1;
  for(var k = 0; k < C.maxEnPlus; k++) if(hasard() < Math.min(0.6, G.day * C.zombieEnPlus + (hordeMondiale() ? BAL.horde.zombieEnPlus : 0))) nb++;
  var zs = [];
  for(var k = 0; k < nb; k++) zs.push(nouveauZombie(tirerZombie()));
  // Zoo : parfois un gorille entre les enclos
  var Lz = G.exp && !G.exp.guerre && LIEUX[G.exp.lieu], Tg = ZOMBIES.find(function(t){ return t.id === "gorille"; });
  if(Lz && Lz.gorille && Tg && !Tg.attente && hasard() < Lz.gorille) zs[0] = nouveauZombie(Tg);
  var cel = G.exp && !G.exp.guerre && celebreIci(G.exp.lieu) ? celebre() : null;
  if(cel){ var Tc = ZOMBIES.find(function(t){ return t.id === cel.id; }), zc = nouveauZombie(Tc); zc.pv = cel.pv; zc.pvMax = cel.pvMax; zc.celebre = true; zs.unshift(zc); if(zs.length > 3) zs.length = 3; }
  var pv0 = {}; equipeCombat().forEach(function(x){ pv0[G.m.indexOf(x)] = x.hp; }); // pour le bilan du combat
  G.combat = { zombies:zs, tour:1, journal:cel ? [["b2", "💀 " + Tc.nom + " est là ! " + (cel.pv < cel.pvMax ? "Il porte encore les blessures de votre dernière rencontre." : "Le zombie le plus craint du quartier vous barre la route.")]] : [], resume:[], fin:null, pv0:pv0, abattus:0 };
  preparerIntentions();
  return G.combat;
}
// Nom du lieu du combat (une expédition, ou l'assaut d'un bastion adverse pendant une guerre de clans)
function nomLieuCombat(){ return G.exp.nomLieu || LIEUX[G.exp.lieu].nom; }
/* ---------- Assaut d'un bastion adverse (guerre de clans) ----------
   p = { assaut, clan, cible, jourCible, remparts, mines } (donné par le serveur) ; equipe = index des membres qui partent.
   Défenseurs : 2 + remparts / 2 (au plus 4), plus coriaces avec les remparts et l'ancienneté de la famille adverse.
   Les mines blessent l'équipe avant le combat. */
// Qui porte quoi pendant un assaut : chaque membre de l'équipe prend un objet de chaque sorte s'il y en a au stock
function equipGuerrePour(equipe){
  var r = {};
  ["gilet", "casque", "bouclier"].forEach(function(id){
    var dispo = G.stock.o.filter(function(o){ return o.id === id; });
    equipe.forEach(function(j, k){ if(dispo[k]) (r[j] = r[j] || []).push({ id:id, uid:dispo[k].uid }); });
  });
  return r;
}
function porteGuerre(x, id){ var g = G.exp && G.exp.equipGuerre && G.exp.equipGuerre[G.m.indexOf(x)]; return !!(g && g.some(function(o){ return o.id === id; })); }
function creerAssaut(p, equipe){
  G.exp = { guerre:true, assaut:p.assaut, nomLieu:trad("le bastion « {clan} »", { clan:p.clan }), cible:p.cible, lieu:0, equipe:equipe.slice(), notes:[], mult:1, d:0, voiture:false };
  var T = ZOMBIES.find(function(t){ return t.id === "defenseur"; }), n = BAL.assaut.defenseurs[Math.min(5, p.remparts || 0)];
  var A = BAL.assaut, force = Math.max(0, Math.min(A.forceMax, Math.floor(((p.jourCible || BAL.jourClans) - BAL.jourClans) / A.joursParForce))), zs = [];
  for(var k = 0; k < n; k++){
    var z = nouveauZombie(T); z.nom = (k ? "Garde " + (k + 1) : p.cible).slice(0, 12);
    var rp = p.remparts || 0, bonus = Math.floor(A.degatsForce * force);
    z.pv = z.pvMax = Math.round(A.pv + A.pvRempart * rp + A.pvForce * force); z.degats = [A.degats[0] + bonus, A.degats[1] + bonus + Math.floor(A.degatsRempart * rp)];
    if(p.armurerie) z.armurerie = Math.min(3, p.armurerie); // armurerie du bastion adverse : défenseurs en gilet (surtout contre les tirs)
    zs.push(z);
  }
  var pv0 = {}; equipeCombat().forEach(function(x){ pv0[G.m.indexOf(x)] = x.hp; });
  G.combat = { zombies:zs, tour:1, journal:[], resume:[], fin:null, pv0:pv0, abattus:0 };
  var J = [];
  G.exp.equipGuerre = equipGuerrePour(equipe);
  equipe.forEach(function(j){ var g = G.exp.equipGuerre[j]; if(g) J.push(["g2", g.map(function(o){ return OBJETS[o.id].icone; }).join(" ") + " " + trad("{nom} porte : {objets}.", { nom:G.m[j].nom, objets:liste(g.map(function(o){ return OBJETS[o.id].nom.toLowerCase(); })) })]); });
  var cam = p.camion || {}; G.exp.camion = { parebuffle:cam.parebuffle || 0, blindage:cam.blindage || 0, tourelle:cam.tourelle || 0 };
  var absorbe = Math.min(p.mines || 0, G.exp.camion.blindage);
  if(absorbe) J.push(["g2", "🚚 " + tradN(absorbe, "Le blindage du camion encaisse 1 mine sans dégâts.", "Le blindage du camion encaisse {n} mines sans dégâts.")]);
  for(var m = absorbe; m < (p.mines || 0); m++){ var eq = equipeCombat(); if(!eq.length) break; var x = eq[R(0, eq.length - 1)], dg = R(A.mineDegats[0], A.mineDegats[1]); if(porteGuerre(x, "casque")) dg = Math.ceil(dg / 2); J.push(["b2", "💣 " + trad(porteGuerre(x, "casque") ? "Une mine explose sous {nom} (−{n} PV), son casque l’a protégé !" : "Une mine explose sous {nom} (−{n} PV) !", { nom:x.nom, n:dg })]); blesser(x, dg, J, "tué par une mine devant " + G.exp.nomLieu); }
  if(p.armurerie) J.push(["", "🦺 " + trad("Les défenseurs portent des gilets (armurerie niveau {n}) : chaque tir perd {t} dégâts, chaque coup {c}.", { n:p.armurerie, t:Math.round(BAL.assaut.armurerieTir * Math.min(3, p.armurerie) + 0.01), c:Math.round(BAL.assaut.armurerieCoup * Math.min(3, p.armurerie) + 0.01) })]);
  if(p.remparts) J.push(["", "🧱 " + trad("Les remparts (niveau {n}) rendent les défenseurs plus coriaces.", { n:p.remparts })]);
  if(G.exp.camion.parebuffle){ var choc = Math.round(BAL.assaut.parebuffle * G.exp.camion.parebuffle); zs.forEach(function(z){ z.pv = Math.max(1, z.pv - choc); }); J.push(["g2", "🚚 " + trad("Le camion enfonce l’entrée avec son pare-buffle : chaque défenseur perd {n} PV !", { n:choc })]); }
  if(G.exp.camion.tourelle) J.push(["g2", "🚚 " + trad("La tourelle du camion tirera à chaque tour (niveau {n}).", { n:G.exp.camion.tourelle })]);
  G.combat.journal = J; G.combat.resume = J.filter(function(l){ return l[0] === "mort"; });
  if(!equipeCombat().length){ G.combat.fin = "defaite"; G.combat.resume.push(["b2", "💀 L’équipe n’a même pas atteint " + G.exp.nomLieu + "."]); }
  else preparerIntentions();
  return G.combat;
}
// Fin de l'assaut : étoiles (1 victoire, +1 personne n'est mort, +1 gagné en 3 tours ou moins) et énergie dépensée
function bilanAssaut(){
  var C = G.combat, E = G.exp, team = E.equipe.map(function(j){ return G.m[j]; });
  var victoire = C.fin === "victoire", morts = team.filter(function(x){ return !x.al; }).length;
  var etoiles = victoire ? 1 + (morts ? 0 : 1) + (C.tour - 1 <= 3 ? 1 : 0) : 0;
  team.forEach(function(x){ if(x.al) x.en = Math.max(0, x.en - BAL.energieAssaut); });
  // L'équipement de guerre porté s'use d'un cran
  var uses = [];
  for(var j in (E.equipGuerre || {})) E.equipGuerre[j].forEach(function(o){ var inst = G.stock.o.find(function(i){ return i.uid === o.uid; }); if(!inst) return; inst.sol--; if(inst.sol <= 0){ retirerInstance(inst.uid); uses.push(["b2", OBJETS[o.id].icone + " " + OBJETS[o.id].nom + " est hors d’usage."]); } });
  return { victoire:victoire, etoiles:etoiles, assaut:E.assaut, nom:E.nomLieu, resume:C.resume.concat(uses) };
}
function finirAssaut(){ G.exp = null; G.combat = null; }
function zombiesDebout(){ return G.combat.zombies.filter(function(z){ return z.pv > 0; }); }
// Objets que les Pilleurs emportent (ceux qui se sont enfuis, ou encore debout quand l'équipe part)
function butinVole(C){ var n = 0; (C ? C.zombies : []).forEach(function(z){ if(z.vol && (z.pv > 0 || z.fui)) n += z.vol; }); return n; }
function equipeCombat(){ return G.exp.equipe.map(function(j){ return G.m[j]; }).filter(function(x){ return x.al; }); }
// Ce que chaque zombie debout va faire ce tour-ci : { t:"mord" | "hurle", c: index du membre visé }
function preparerIntentions(){
  var C = G.combat, eq = equipeCombat(); if(!eq.length) return;
  zombiesDebout().forEach(function(z){
    var T = typeZombie(z), x = eq[R(0, eq.length - 1)];
    z.int = { t:T.hurle && C.tour % 2 === 0 ? "hurle" : T.vole ? (z.vol ? "fuit" : "vole") : T.pond ? (C.tour % 2 === 0 && (z.ponte || 0) < T.pond ? "pond" : "attend") : "mord", c:G.m.indexOf(x) };
    if(T.deuxCibles && eq.length > 1){ var y = eq.filter(function(m){ return m !== x; }); z.int.c2 = G.m.indexOf(y[R(0, y.length - 1)]); }
  });
}
// Ce que la bulle et le panneau disent de l'intention d'un zombie (null = mordre, géré par l'affichage)
function texteIntention(z){
  var t = z.int && z.int.t;
  return t === "hurle" ? { bulle:"📢 Va hurler", phrase:"📢 va hurler pour appeler du renfort" }
    : t === "vole" ? { bulle:"🎒 Va voler", phrase:"🎒 va arracher " + typeZombie(z).vole + " objets de votre butin" }
    : t === "fuit" ? { bulle:"🏃 Va s’enfuir", phrase:"🏃 va s’enfuir avec ce qu’il a volé : abattez-le vite !" }
    : t === "pond" ? { bulle:"🪺 Va pondre", phrase:"🪺 un Rampant va sortir de son ventre" }
    : t === "attend" ? { bulle:"💤 Gonfle", phrase:"💤 gonfle doucement (un Rampant sortira au tour suivant)" } : null;
}
// Dégâts maximum qu'un zombie peut faire à un membre ce tour (pour le robot et l'affichage)
function menaceZombie(z){ var T = typeZombie(z); return z.int && z.int.t !== "mord" ? 0 : z.degats[1] * (T.coups || 1); }
// Renvoie { dg, comment, tir } ; une arme à feu use une munition du stock
function degatsMembre(x){
  var C = BAL.combat, a = x.eq.arme, d = a ? OBJETS[a.id].degats : C.poings, comment = a ? trad("avec {arme}", { arme:nommer(a.id, 1) }) : trad("à mains nues"), tir = false;
  var mu = a && OBJETS[a.id].munition;
  if(mu){
    if(compter(mu) > 0){ retirer(mu, 1); tir = true; comment = anglais() ? "fires the " + minus(OBJETS[a.id].nom) : "tire " + (OBJETS[a.id].g === "f" ? "à la " : "au ") + minus(OBJETS[a.id].nom); }
    else { d = C.crosse; comment = trad(mu === "balle" ? "n’a plus de balles, frappe avec la crosse" : "n’a plus de cartouches, frappe avec la crosse"); }
  }
  var T = BAL.traits, bonus = (x.trait === "costaud" && !tir ? T.costaud : 0) - (x.trait === "soigneur" ? T.pacifiste : 0) - (x.trait === "cuisinier" ? T.maladroit : 0)
    + (x.trait === "tireur" && tir ? T.tireur : 0) + (aTitre(x, "veteran") ? 1 : 0) + (aTitre(x, "tueur") ? 1 : 0);
  return { dg:Math.max(1, R(d[0], d[1]) + bonus - (fatigue(x) ? C.malusFatigue : 0)), comment:comment, tir:tir };
}
function bruit(J, x){
  if(G.exp && G.exp.guerre) return; // assaut de bastion : les défenseurs sont déjà tous là
  var C = BAL.combat;
  if(hasard() < C.bruitTir + (x && x.trait === "tireur" ? BAL.traits.nerveux : 0) && zombiesDebout().length < C.maxZombies){
    var t = tirerZombie(); G.combat.zombies.push(nouveauZombie(t));
    J.push(["b2", "🔊 " + trad("Le bruit du tir attire un {z} !", { z:minus(t.nom) })]);
  }
}
// Peut-on lancer un cocktail Molotov ? (un cocktail au stock, fabriqué à l'atelier, et un briquet dans la famille pour l'allumer)
function peutCocktail(){ return compter("cocktail") > 0 && possede(function(o){ return o.allume; }); }
// Un zombie tombe : le Gonflé explose et blesse toute l'équipe
function zombieTombe(z, protege, J){
  G.combat.abattus = (G.combat.abattus || 0) + 1; if(!(G.exp && G.exp.guerre)) G.stats.zombies = (G.stats.zombies || 0) + 1; // compté pour les stats du joueur (pas les défenseurs d'un bastion)
  var T = typeZombie(z); if(!T.explose) return;
  J.push(["b2", "💥 " + trad("{z} explose en tombant !", { z:z.nom })]);
  equipeCombat().forEach(function(x){
    var dg = R(T.explose[0], T.explose[1]); if(protege[G.m.indexOf(x)]) dg = Math.round(dg * BAL.combat.protection); if(G.exp.guerre && porteGuerre(x, "casque")) dg = Math.ceil(dg / 2);
    J.push(["b2", "🤢 " + trad(estFeminin(x) ? "{nom} est éclaboussée (−{n} PV)." : "{nom} est éclaboussé (−{n} PV).", { nom:x.nom, n:dg })]);
    blesser(x, dg, J, "tué par l’explosion d’un gonflé (" + nomLieuCombat() + ")");
  });
}
function estFeminin(x){ return typeof FEMININS !== "undefined" && FEMININS.indexOf(roleDe(x)) >= 0; }
// Un zombie agit (mordre ou hurler) ; protege = { indexMembre: true }
function actionZombie(z, protege, J){
  var C = BAL.combat, T = typeZombie(z), lieu = nomLieuCombat();
  if(z.int && z.int.t === "hurle"){
    if(zombiesDebout().length < C.maxZombies){ var t = tirerZombie("hurleur"); G.combat.zombies.push(nouveauZombie(t)); J.push(["b2", "📢 " + trad("{z} hurle : un {t} accourt !", { z:z.nom, t:minus(t.nom) })]); }
    else J.push(["", "📢 " + trad("{z} hurle dans le vide.", { z:z.nom })]);
    return;
  }
  // Pilleur : il vole, puis s'enfuit ; Couveuse : elle pond un Rampant un tour sur deux
  if(z.int && z.int.t === "vole"){ z.vol = T.vole; J.push(["b2", "🎒 " + trad("{z} fouille vos sacs et y fourre {n} objets du butin !", { z:z.nom, n:T.vole })]); return; }
  if(z.int && z.int.t === "fuit"){ z.fui = true; z.pv = 0; J.push(["b2", "🏃 " + trad("{z} s’enfuit avec {n} objets de votre butin !", { z:z.nom, n:z.vol })]); return; }
  if(z.int && z.int.t === "pond"){
    if(zombiesDebout().length < C.maxZombies){ var tr = ZOMBIES.find(function(t){ return t.id === "rampant"; }); G.combat.zombies.push(nouveauZombie(tr)); z.ponte = (z.ponte || 0) + 1; J.push(["b2", "🪺 " + trad("Un Rampant s’extirpe du ventre de {z} !", { z:z.nom })]); }
    else J.push(["", "🪺 " + trad("{z} se tord, mais rien ne sort.", { z:z.nom })]);
    return;
  }
  if(z.int && z.int.t === "attend"){ J.push(["", "💤 " + trad("{z} gonfle et palpite.", { z:z.nom })]); return; }
  var eq = equipeCombat(); if(!eq.length) return;
  var x = z.int && G.m[z.int.c] && eq.indexOf(G.m[z.int.c]) >= 0 ? G.m[z.int.c] : eq[R(0, eq.length - 1)];
  var cibles = [x]; if(T.deuxCibles && z.int && G.m[z.int.c2] && eq.indexOf(G.m[z.int.c2]) >= 0 && G.m[z.int.c2] !== x) cibles.push(G.m[z.int.c2]);
  cibles.forEach(function(x){
  for(var k = 0; k < (T.coups || 1) && x.al; k++){
    var dg = R(z.degats[0], z.degats[1]);
    if(protege[G.m.indexOf(x)]) dg = Math.max(1, Math.round(dg * (T.lourd ? C.ecrase : G.exp.guerre && porteGuerre(x, "bouclier") ? BAL.assaut.bouclier : C.protection)));
    if(G.exp.guerre && porteGuerre(x, "gilet")) dg = Math.max(1, dg - BAL.assaut.gilet);
    if(aTitre(x, "durACuire")) dg = Math.max(1, dg - 1);
    if(binomeDans(x, eq)) dg = Math.max(1, dg - BAL.famille.binome.degats); // les binômes se couvrent
    if(!G.exp.guerre && G.day <= BAL.debutDoux.jours) dg = Math.max(1, Math.round(dg * BAL.debutDoux.degats)); // début de partie plus doux
    J.push(["b2", iconeZombie(z) + " " + trad("{z} frappe {nom} (−{n} PV).", { z:z.nom, nom:x.nom, n:dg })]);
    blesser(x, dg, J, (z.celebre ? "tué par " + minus(z.nom) : "tué par un " + minus(z.nom)) + " (" + lieu + ")");
  }
  });
}
// Les zombies debout attaquent (fuite ratée : tout le monde, sans intention de hurler)
function attaqueZombies(protege, J){
  zombiesDebout().forEach(function(z){ if(z.int && (z.int.t === "hurle" || z.int.t === "pond" || z.int.t === "attend")) z.int.t = typeZombie(z).pond ? "attend" : "mord"; actionZombie(z, protege, J); });
}
// Raja, le tigre de la Légende du mois (2026-11-12) : une fois par partie (la partie temporaire du raid compte avec la vraie)
function maisonTigre(){ return typeof G_MAISON !== "undefined" && G_MAISON ? G_MAISON : G; }
function tigreUtilise(){ return !!(G.tigreUtilise || maisonTigre().tigreUtilise); }
function lacherTigre(){
  var C = G.combat, J = [], guerre = G.exp && G.exp.guerre && !G.exp.raid; if(!C || C.fin) return [];
  G.tigreUtilise = true; maisonTigre().tigreUtilise = true;
  J.push(["g2", "🐅 " + trad(guerre ? "Raja surgit en rugissant et bondit sur les défenseurs !" : "Raja surgit en rugissant et bondit sur les zombies !")]);
  zombiesDebout().forEach(function(z){
    var d;
    if(guerre || z.celebre || z.id === "colosse"){
      d = Math.ceil(z.pv * (guerre ? BAL.tigre.guerre : BAL.tigre.boss)); z.pv = Math.max(1, z.pv - d);
      J.push(["g2", "🐅 " + trad("Raja lacère {z} (−{n}).", { z:z.nom, n:d })]);
    } else { z.pv = 0; J.push(["g2", "🐅 " + trad("Raja terrasse {z} !", { z:z.nom })]); zombieTombe(z, {}, J); }
  });
  C.journal = J; verifierFin(J);
  if(G.exp && G.exp.raid && typeof noterTourRaid === "function") noterTourRaid(J);
  return J;
}
function verifierFin(J){
  var C = G.combat;
  if(!equipeCombat().length){ C.fin = "defaite"; C.resume.push(["b2", "💀 Personne n’est revenu de " + nomLieuCombat() + "."]); }
  else if(!zombiesDebout().length){ C.fin = "victoire"; C.resume.push(["g2", (G.exp && G.exp.raid ? "🏢 " + tradN(C.tour, "Étage nettoyé en {n} tour !", "Étage nettoyé en {n} tours !") : G.exp && G.exp.guerre ? "⚔️ " + tradN(C.tour, "Assaut gagné en {n} tour !", "Assaut gagné en {n} tours !") : "🧟 " + tradN(C.tour, "Combat gagné en {n} tour !", "Combat gagné en {n} tours !"))]); }
  C.tour++;
  if(!C.fin) preparerIntentions();
}
// choix = { indexMembre: { a:"frapper"|"tete"|"pousser"|"proteger"|"soigner"|"cocktail", cible:k } }
function jouerTour(choix){
  var C = G.combat, B = BAL.combat, J = [], protege = {}, sonne = {};
  if(zombiesDebout().some(function(z){ return !z.int; })) preparerIntentions(); // ancienne sauvegarde
  equipeCombat().forEach(function(x){ var j = G.m.indexOf(x); if((choix[j] || {}).a === "proteger") protege[j] = true; });
  // 1. Les Rampants frappent avant tout le monde
  zombiesDebout().forEach(function(z){ if(typeZombie(z).premier) actionZombie(z, protege, J); });
  // 1 bis. La tourelle du camion (assauts de guerre) tire sur le défenseur le plus faible ; les gilets de l'armurerie la freinent
  var tl = G.exp && G.exp.guerre && G.exp.camion ? G.exp.camion.tourelle : 0;
  if(tl && zombiesDebout().length){
    var zt = zombiesDebout().sort(function(a, b){ return a.pv - b.pv; })[0], dt = Math.max(0, Math.round(BAL.assaut.tourelle * tl) + R(0, 2) - Math.round(BAL.assaut.armurerieTir * (zt.armurerie || 0) + 0.01));
    zt.pv = Math.max(0, zt.pv - dt);
    J.push([dt ? "g2" : "", "🚚 " + (dt ? trad("La tourelle tire sur {z} : −{n}", { z:zt.nom, n:dt }) + (zt.pv ? "" : trad(", à terre !")) : trad("La tourelle tire sur {z} : la balle ricoche sur son gilet.", { z:zt.nom }))]);
    if(!zt.pv) zombieTombe(zt, protege, J);
  }
  // 2. L'équipe agit
  equipeCombat().forEach(function(x){
    var j = G.m.indexOf(x), c = choix[j] || { a:"frapper" };
    var debout = zombiesDebout(); if(!debout.length) return;
    var z = C.zombies[c.cible] && C.zombies[c.cible].pv > 0 ? C.zombies[c.cible] : debout[0], T = typeZombie(z);
    if(c.a === "proteger"){ J.push(["", "🛡️ " + trad("{nom} se protège.", { nom:x.nom })]); return; }
    if(c.a === "soigner"){
      var bl = equipeCombat().filter(function(y){ return y.hp < 100; }).sort(function(a, b){ return a.hp - b.hp; })[0];
      var k = bl && soigner(G.m.indexOf(bl));
      if(k){ J.push(["g2", "🩹 " + trad(bl === x ? "{nom} soigne ses blessures avec {soin} ({n} PV)." : "{nom} soigne {autre} avec {soin} ({n} PV).", { nom:x.nom, autre:bl.nom, soin:nommer(k, 1), n:bl.hp })]); return; }
      c = { a:"frapper", cible:c.cible };
    }
    if(c.a === "cocktail" && peutCocktail()){
      retirer("cocktail", 1);
      J.push(["g2", "🔥 " + trad("{nom} lance un cocktail Molotov !", { nom:x.nom })]);
      debout.forEach(function(zz){ var Tz = typeZombie(zz), d = Tz.ignifuge ? 0 : R(B.cocktail[0], B.cocktail[1]) * (Tz.pond ? 2 : 1); if(!d){ J.push(["b2", "🔥 " + trad("{z} ne craint pas le feu.", { z:zz.nom })]); return; } zz.pv = Math.max(0, zz.pv - d); J.push(["g2", "🔥 " + trad("{z} brûle : −{n}", { z:zz.nom, n:d }) + (zz.pv ? "" : trad(", à terre !"))]); if(!zz.pv){ zombieTombe(zz, protege, J); if(!(G.exp && G.exp.guerre && !G.exp.raid)) exploit(x, "zombies", 1, J); } });
      return;
    }
    if(c.a === "pousser"){
      if(hasard() >= (T.lourd ? B.pousserLourd : B.pousser)){ J.push(["b2", "✋ " + trad("{nom} pousse {z}… qui ne recule pas !", { nom:x.nom, z:z.nom })]); return; }
      sonne[C.zombies.indexOf(z)] = true; J.push(["g2", "✋ " + trad("{nom} repousse {z} : il perd son tour.", { nom:x.nom, z:z.nom })]); return;
    }
    var r = degatsMembre(x), dg = r.dg;
    if(c.a === "tete"){
      var ch = B.tete + (r.tir && x.trait === "tireur" ? B.teteTireur : 0);
      if(hasard() < ch){ dg = dg * B.teteMult; if(z.armurerie && r.tir) dg = Math.max(1, dg - Math.round(BAL.assaut.armurerieTete * z.armurerie + 0.01)); z.pv = Math.max(0, z.pv - dg); J.push(["g2", "🎯 " + x.nom + (r.tir ? " " + r.comment : "") + trad(" : coup à la tête ! {z} −{n}", { z:z.nom, n:dg }) + (z.pv ? "" : trad(", à terre !"))]); }
      else { J.push(["b2", "🎯 " + x.nom + (r.tir ? " " + r.comment : "") + trad(" vise la tête… et rate {z}.", { z:z.nom })]); dg = 0; }
    } else {
      var arm = (T.armure || 0) + (z.armurerie ? Math.round((r.tir ? BAL.assaut.armurerieTir : BAL.assaut.armurerieCoup) * z.armurerie + 0.01) : 0);
      if(arm) dg = Math.max(1, dg - arm);
      z.pv = Math.max(0, z.pv - dg);
      J.push(["g2", (r.tir ? "🔫 " + x.nom + " " : "⚔️ " + trad("{nom} frappe", { nom:x.nom }) + " ") + r.comment + " : " + z.nom + " −" + dg + (arm ? trad(" (gilet)") : "") + (z.pv ? "" : trad(", à terre !"))]);
    }
    if(dg && T.brule && !r.tir){ J.push(["b2", "🔥 " + trad("{nom} se brûle en le frappant (−{n} PV).", { nom:x.nom, n:T.brule })]); blesser(x, T.brule, J, "tué par un brûlé (" + nomLieuCombat() + ")"); }
    if(dg && !z.pv && z.vol){ J.push(["g2", "🎒 " + trad("Vous récupérez les {n} objets que {z} vous avait volés.", { n:z.vol, z:z.nom })]); z.vol = 0; }
    if(dg && !z.pv){ zombieTombe(z, protege, J); if(z.celebre) C.tueurCelebre = j; if(!(G.exp && G.exp.guerre && !G.exp.raid)) exploit(x, "zombies", 1, J); }
    userArme(x, J);
    if(r.tir) bruit(J, x);
  });
  // 3. Les zombies encore debout agissent (sauf les Rampants, déjà passés, et ceux qu'on a repoussés)
  zombiesDebout().forEach(function(z){ if(!typeZombie(z).premier && !sonne[C.zombies.indexOf(z)]) actionZombie(z, protege, J); });
  C.journal = J; C.resume = C.resume.concat(J.filter(function(l){ return l[0] === "mort" || l[0] === "b2" && l[1].indexOf("💀") >= 0 || l[1].indexOf("💥") >= 0; }));
  verifierFin(J);
  if(G.exp && G.exp.raid && typeof noterTourRaid === "function") noterTourRaid(J); // replay du raid de l'immeuble
  return J;
}
// Combat automatique « raisonnable » (bouton 🤖 Auto, et robot Malin)
function tourAuto(){
  var zs = zombiesDebout(), eq = equipeCombat(), B = BAL.combat;
  if(zs.some(function(z){ return !z.int; })) preparerIntentions();
  var menace = function(x){ var m = 0; zs.forEach(function(z){ if(z.int && G.m[z.int.c] === x) m += menaceZombie(z) * (typeZombie(z).lourd ? 1 : 1); }); return m; };
  var pire = 0; zs.forEach(function(z){ pire += menaceZombie(z); });
  if(!(G.exp && G.exp.raid) && eq.some(function(x){ return x.hp <= pire; }) && zs.length > 1 && !(zs.length >= 3 && peutCocktail())) return fuir(); // raid : le bouton Auto ne fuit pas tout seul (le chef décide)
  // Cible : le Hurleur qui va hurler, le Pilleur qui va filer, la Couveuse, sinon le plus faible
  var vise = zs.filter(function(z){ return z.int && (z.int.t === "hurle" || z.int.t === "fuit"); })[0] || zs.filter(function(z){ return typeZombie(z).pond || z.int && z.int.t === "vole"; })[0] || zs.slice().sort(function(a, b){ return a.pv - b.pv; })[0];
  var cible = G.combat.zombies.indexOf(vise), ch = {}, soin = false, feu = false;
  eq.forEach(function(x){
    var j = G.m.indexOf(x), m = menace(x);
    var blesse = eq.filter(function(y){ return y.hp < 35; })[0];
    if(blesse && !soin && soinsDispo() > 0){ soin = true; ch[j] = { a:"soigner" }; return; }
    if(zs.length >= 3 && !feu && peutCocktail()){ feu = true; ch[j] = { a:"cocktail" }; return; }
    if(x.hp <= m && eq.length > 1){
      var dangereux = zs.filter(function(z){ return z.int && G.m[z.int.c] === x && !typeZombie(z).lourd; })[0];
      ch[j] = dangereux ? { a:"pousser", cible:G.combat.zombies.indexOf(dangereux) } : { a:"proteger" }; return;
    }
    ch[j] = { a:typeZombie(vise).armure || (vise.armurerie || 0) >= 2 ? "tete" : "frapper", cible:cible };
  });
  return jouerTour(ch);
}
function fuir(){
  var C = G.combat, J = [];
  if(hasard() < BAL.combat.fuite){
    C.fin = "fuite"; J.push(["", "🏃 " + trad("L’équipe prend la fuite !")]);
    C.resume.push(["b2", G.exp && G.exp.raid ? "🏃 Retraite par l’escalier : l’équipe quitte l’immeuble avec ce qu’elle a déjà trouvé." : G.exp && G.exp.guerre ? "🏃 Vous battez en retraite : l’assaut est un échec." : "🏃 Fuite devant les zombies : on rapporte moins de butin."]);
  } else {
    J.push(["b2", "🏃 " + trad(G.exp && G.exp.guerre && !G.exp.raid ? "La retraite échoue, les défenseurs vous rattrapent !" : "La fuite échoue, les zombies vous rattrapent !")]);
    attaqueZombies({}, J);
    C.resume = C.resume.concat(J.filter(function(l){ return l[0] === "mort" || l[1].indexOf("💀") >= 0; }));
    if(!equipeCombat().length) verifierFin(J); else { C.tour++; preparerIntentions(); }
  }
  C.journal = J;
  if(G.exp && G.exp.raid && typeof noterTourRaid === "function") noterTourRaid(J);
  return J;
}

/* ---------- Fin du jour (la nuit) ---------- */
/* Score = jours-personnes : chaque jour terminé rapporte 1 point par membre
   encore en vie. Garder toute la famille en vie rapporte donc plus. */
/* ---------- La famille : deuil et envies (2026-11-21) ---------- */
function enDeuil(x){ return !!(x && x.deuil && G.day < x.deuil.fin); }
// À la mort de x : ceux qui tenaient à lui sont en deuil ; le plus proche perd un peu plus de moral
function deuilPour(x, n){
  var r = roleDe(x), D = BAL.famille.deuil;
  vivants().forEach(function(y){
    var B = BAL.famille.binome, bin = binomeDe(y) === r;
    if(bin){ changerMoral(B.moral); if(n) n.push(["b2", "🤝 " + trad("{nom} a perdu son binôme.", { nom:y.nom })]); }
    var L = LIENS[roleDe(y)] || [], k = L.indexOf(r); if(k < 0 && !bin) return;
    y.deuil = { nom:x.nom, r:r, fin:G.day + D.jours + (bin ? B.jours : 0), proche:k === 0 };
    if(k === 0){ changerMoral(D.moralProche); if(n) n.push(["b2", "🖤 " + trad(FEMININS.indexOf(roleDe(y)) >= 0 ? "{nom} est effondrée : {mort} était tout pour elle." : "{nom} est effondré : {mort} était tout pour lui.", { nom:y.nom, mort:x.nom })]); }
  });
}
function envieDe(x){ return x && x.envie && ENVIES[x.envie] ? ENVIES[x.envie] : null; }
// Chaque nuit : une envie exaucée rapporte du moral ; sinon, de temps en temps, une nouvelle envie
function nuitFamille(n){
  vivants().forEach(function(x){
    if(x.deuil && G.day >= x.deuil.fin){ n.push(["g2", "🕊️ " + trad("{nom} se remet doucement de la mort de {mort}.", { nom:x.nom, mort:x.deuil.nom })]); delete x.deuil; }
    var E = envieDe(x);
    if(E && E.ok(x)){
      changerMoral(BAL.famille.envies.moral); n.push(["g2", "💛 " + trad(E.joie, { nom:x.nom })]);
      x.enviesFaites = (x.enviesFaites || []).concat([x.envie]); delete x.envie; x.envieT = G.day + BAL.famille.envies.pause; return;
    }
    if(!x.envie && (x.envieT || 0) <= G.day && hasard() < BAL.famille.envies.chance){
      var faites = x.enviesFaites || [], pool = (ENVIES_ROLE[roleDe(x)] || ENVIES_ROLE.autres).filter(function(id){ return faites.indexOf(id) < 0 && !ENVIES[id].ok(x); });
      if(!pool.length) pool = Object.keys(ENVIES).filter(function(id){ return faites.indexOf(id) < 0 && !ENVIES[id].ok(x); });
      if(pool.length) x.envie = pool[aleaR("envie-" + roleDe(x), 0, pool.length - 1)];
    }
  });
}
function finJour(){
  var n = [];
  nuitFamille(n);
  G.score += vivants().length;
  if(vivants().length && typeof noterDefi === "function") noterDefi("nuits", 1);
  // Chaleur : le feu de cheminée (1 planche par nuit, il faut un briquet) réchauffe tout le monde ;
  // sinon une couverture tient chaud 2 personnes, les autres ont froid
  var feu = false;
  if(G.feu){
    if(G.braises > 0){ G.braises--; feu = true; n.push(["g2", "🔥 " + trad("Le feu de cheminée a brûlé toute la nuit (la planche d’hier a suffi).")]); }
    else if(compter("planche") >= BAL.feu.planches && possede(function(o){ return o.allume; })){
      retirer("planche", BAL.feu.planches); feu = true; G.braises = estSaison("hiver") && BAL.saisons.feuHiver ? 0 : BAL.feu.nuitsParPlanche - 1; // une planche brûle plusieurs nuits (une seule en hiver)
      n.push(["g2", "🔥 " + (BAL.feu.nuitsParPlanche > 1 ? trad("Le feu de cheminée a brûlé toute la nuit (−{p} planche(s), elle durera {n} nuits).", { p:BAL.feu.planches, n:BAL.feu.nuitsParPlanche }) : trad("Le feu de cheminée a brûlé toute la nuit (−{p} planche(s)).", { p:BAL.feu.planches }))]);
    } else { G.feu = false; n.push(["b2", "🔥 " + trad(possede(function(o){ return o.allume; }) ? "Le feu s’est éteint : plus de planches à brûler." : "Le feu s’est éteint : plus de briquet pour le rallumer.")]); }
  }
  var auChaud = feu ? 99 : compter("couverture") * (estSaison("hiver") && BAL.saisons.couvHiver ? 1 : BAL.feu.couvrePar), froids = [], diner = [];
  vivants().forEach(function(x, kx){
    var chaud = kx < auChaud; if(!chaud) froids.push(x.nom);
    x.faim -= BAL.faimParJour + (x.trait === "costaud" ? BAL.traits.costaudFaim : 0) + (estSaison("hiver") ? BAL.saisons.faimHiver : 0);
    x.soif -= BAL.soifParJour + (x.trait === "endurant" ? BAL.traits.endurantSoif : 0) + (estSaison("ete") ? BAL.saisons.soifEte : 0);
    var repos = (chaud ? BAL.reposNuit + (feu ? BAL.feu.repos : 0) : BAL.reposFroid) - (x.canette ? BAL.canetteContrecoup : 0) - (enDeuil(x) ? BAL.famille.deuil.repos : 0);
    if(x.canette) n.push(["", "🥴 " + trad("{nom} dort mal après sa canette (+{n} ⚡ seulement).", { nom:x.nom, n:repos })]);
    x.en = Math.min(100, x.en + repos); x.canette = false;
    var plat = platUtile(x) ? mangerPlat(x) : null;
    if(plat) diner.push(plat); else if(prendreRations("nour", 1)) x.faim += BAL.faimParJour; else n.push(["b2", x.nom + " n’a rien à manger."]);
    if(prendreRations("eau", 1))  x.soif += BAL.soifParJour; else n.push(["b2", x.nom + " n’a rien à boire."]);
    x.faim = Math.max(0, Math.min(100, x.faim)); x.soif = Math.max(0, Math.min(100, x.soif));
    // Rattrapage : une ration de plus si la jauge est basse et qu'il en reste assez pour les autres
    // (avant le 2026-11-09, une jauge tombée à 0 ne remontait plus jamais : mort de soif avec de l'eau au stock)
    // Une jauge en danger (≤ 10) passe avant les autres : la ration de rattrapage est donnée même s'il en reste peu
    if(x.soif < BAL.rattrapage && (rations("eau") > vivants().length || x.soif <= BAL.critique && rations("eau") > 0) && prendreRations("eau", 1)) x.soif = Math.min(100, x.soif + BAL.soifParJour);
    if(x.faim < BAL.rattrapage && (rations("nour") > vivants().length || x.faim <= BAL.critique && rations("nour") > 0) && prendreRations("nour", 1)) x.faim = Math.min(100, x.faim + BAL.faimParJour);
    if(x.faim <= 0 || x.soif <= 0) blesser(x, BAL.degatsFaimSoif, n, x.soif <= 0 ? "mort de soif" : "mort de faim");
    else if(x.hp < 100) x.hp = Math.min(100, x.hp + BAL.regenPV);
    if(!chaud) blesser(x, BAL.degatsFroid, n, "mort de froid");
  });
  // Le chien mange après la famille ; sans manger trop longtemps, il s'en va
  var c = chien();
  if(c){
    G.stats.nuitsChien = (G.stats.nuitsChien || 0) + 1;
    if(prendreRations("nour", BAL.chien.rations)) c.faim = 0;
    else {
      c.faim++;
      if(c.faim >= BAL.chien.nuitsSansManger){ G.chien = null; n.push(["b2", ic("chien", "🐕") + " " + trad("{nom} est parti chercher à manger ailleurs. La défense de nuit baisse.", { nom:c.nom })]); }
      else n.push(["b2", ic("chien", "🐕") + " " + trad("{nom} n’a rien eu à manger ce soir ({n} nuit sur {max} avant qu’il parte).", { nom:c.nom, n:c.faim, max:BAL.chien.nuitsSansManger })]);
    }
  }
  // Les poules boivent après la famille, puis pondent ; sans eau, l'une d'elles meurt
  var np = compter("poule");
  if(np){
    var soif = Math.ceil(np / BAL.poules.eauPour);
    if(prendreRations("eau", soif)){
      var oeufs = 0; for(var q = 0; q < np; q++) if(hasard() < BAL.poules.oeuf) oeufs++;
      G.reste.nour += oeufs;
      n.push([oeufs ? "g2" : "", ic("poule", "🐔") + " " + trad(np > 1 ? "Les poules ont bu {n} ration(s) d’eau" : "La poule a bu {n} ration(s) d’eau", { n:soif }) + (oeufs ? trad(" et pondu {n} œuf(s) (+{n} ration(s)).", { n:oeufs }) : trad(", pas d’œuf cette nuit."))]);
    } else {
      retirer("poule", 1); G.reste.nour += BAL.poules.viande;
      n.push(["b2", ic("poule", "🐔") + " " + trad("Plus d’eau pour les poules : l’une d’elles est morte. Vous la mangerez (+{n} rations).", { n:BAL.poules.viande })]);
    }
  }
  // L'étang : les poissons se reproduisent lentement, s'il en reste assez
  G.lieux.forEach(function(l, k){
    if(LIEUX[k].peche && l.poissons >= BAL.peche.seuil && l.poissons < BAL.peche.poissons && G.day % BAL.peche.nuitsParNaissance === 0) l.poissons++;
  });
  if(froids.length) n.push(["b2", "🥶 " + trad("Nuit glaciale pour {noms} : pas de feu ni assez de couvertures (+{r} ⚡ au lieu de +{n}, −{d} PV).", { noms:liste(froids), r:BAL.reposFroid, n:BAL.reposNuit, d:BAL.degatsFroid })]);
  if(feu) changerMoral(BAL.feu.moral);

  var A = BAL.attaqueNuit;
  if(alea("attaque") < chanceAttaqueNuit()){
    var s = forceMiniNuit() + aleaR("force", 0, 2), df = defenseNuit();
    if(hordeMondiale()) n.push(["b2", "🌍 " + trad("La grande horde rôde : les zombies sont plus nombreux cette nuit.")]);
    if(compter("piege") > 0){ retirer("piege", 1); n.push(["", "🪤 " + trad("Un piège à zombies a servi (+{n} de défense), il est cassé.", { n:BAL.piegeDef })]); }
    if(df >= s){
      n.push(["g2", "🧟 " + trad("Attaque de nuit repoussée (force {s} contre votre défense {d}).", { s:s, d:df })]);
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
      n.push(["b2", "🧟 " + (perdus.length ? trad("Attaque de nuit (force {s} contre votre défense {d}) : ils saccagent {objets}.", { s:s, d:df, objets:nommerListe(grouper(perdus)) }) : trad("Attaque de nuit (force {s} contre votre défense {d}).", { s:s, d:df }))]);
      if(A.casseBarricade && G.ref.barr > 0){ G.ref.barr--; n.push(["b2", "🧱 " + trad("Ils arrachent une partie de la barricade (niveau {n}).", { n:G.ref.barr })]); }
    }
  }
  // Installations fabriquées (bâche, collet) : produisent puis s'usent
  G.stock.o.slice().forEach(function(o){
    var p = OBJETS[o.id].nuit; if(!p) return;
    if(hasard() < p.chance){ G.reste[p.cat] += p.rations; n.push(["g2", icone(o.id) + " " + trad(p.cat === "eau" ? "La bâche a recueilli de l’eau de pluie (+{n} ration(s))." : "Un collet a attrapé du gibier (+{n} ration(s)).", { n:p.rations })]); }
    o.sol--;
    if(o.sol <= 0){ retirerInstance(o.uid); n.push(["b2", icone(o.id) + " " + (anglais() ? "The " + minus(OBJETS[o.id].nom) + " is worn out and needs remaking." : (OBJETS[o.id].g === "f" ? "La " : "Le ") + minus(OBJETS[o.id].nom) + " est usé" + (OBJETS[o.id].g === "f" ? "e" : "") + ", à refaire.")]); }
  });
  // Le dîner : les plats mangés, puis ceux qui se gâtent
  if(diner.length){ var g = {}; diner.forEach(function(id){ g[id] = (g[id] || 0) + 1; }); n.push(["g2", "🍲 " + trad("Au dîner : {plats}.", { plats:liste(Object.keys(g).map(function(id){ return nommer(id, g[id]); })) })]); }
  var gates = {}; platsDispo().forEach(function(o){ o.sol--; if(o.sol <= 0){ retirerInstance(o.uid); gates[o.id] = (gates[o.id] || 0) + 1; } });
  if(Object.keys(gates).length) n.push(["b2", "🤢 " + trad("Gâté(s) : {plats}, à jeter.", { plats:liste(Object.keys(gates).map(function(id){ return nommer(id, gates[id]); })) })]);
  // Le potager donne parfois des herbes fraîches
  for(var hp = 0; hp < (estSaison("hiver") ? 0 : G.ref.pot); hp++) if(hasard() < BAL.cuisine.herbesPotager){ ajouter("herbes", 1); n.push(["g2", icone("herbes") + " " + trad("Des herbes fraîches ont poussé au potager.")]); break; }
  var pe = G.ref.eau * REFUGE.eau.parJour, pn = G.ref.pot * REFUGE.pot.parJour;
  // Saisons : pluie d'automne, sécheresse d'été, potager endormi l'hiver et généreux au printemps
  if(estSaison("automne") && G.ref.eau) pe += 1;
  if(estSaison("ete")) pe = Math.max(0, pe - G.ref.eau * BAL.saisons.recupEte);
  if(estSaison("hiver")) pn = 0;
  if(estSaison("printemps")) pn *= 2;
  G.reste.eau += pe; G.reste.nour += pn;
  if(pe) n.push(["g2", ic("ref_eau", "🪣") + " " + tradN(pe, "Le récupérateur a recueilli 1 ration d’eau.", "Le récupérateur a recueilli {n} rations d’eau.")]);
  if(pn) n.push(["g2", ic("ref_pot", "🥕") + " " + tradN(pn, "Le potager a donné 1 ration de nourriture.", "Le potager a donné {n} rations de nourriture.")]);
  if(G.porteOuverte){ n.push(["b2", "🚪 " + trad("La porte est restée ouverte toute la nuit (défense −{n}). Au matin, quelqu’un la referme enfin.", { n:BAL.porteOuverte.defense })]); G.porteOuverte = false; }
  nuitFolie(n);
  nuitMonde(n);
  var moral = 0;
  G.stock.o.concat(equipes()).forEach(function(o){ moral += OBJETS[o.id].moral || 0; });
  changerMoral(-BAL.moralPerteNuit + BAL.moralBonusObjet * moral + BAL.traits.optimiste * vivants().filter(function(x){ return x.trait === "optimiste"; }).length);
  if(estSaison("printemps")) changerMoral(1);
  G.day++; G.ads = 0; G.sel = []; G.nTirage = 0;
  if((G.day - 1) % BAL.saisons.duree === 0){ var Sn = saison(); n.push(["", Sn.ico + " " + Sn.annonce]); }
  if(G.day % MARCHE.tousLes === 0 && Object.keys(G.charrette).some(function(id){ return G.charrette[id] > 0; })){ genererMarche(); n.push(["g2", ic("marco", MARCHE.icone) + " " + trad("{nom} s’installe au coin de la rue aujourd’hui : allez voir le marché !", { nom:MARCHE.nom })]); }
  if(!n.length) n.push(["g2", trad("Nuit calme.")]);
  return n;
}
// La nuit, chacun se défend avec l'arme qu'il a en main + la barricade
function defenseNuit(){
  var d = G.ref.barr * BAL.defenseBarricade;
  equipes().forEach(function(o){ d += OBJETS[o.id].def || 0; });
  if(compter("piege") > 0) d += BAL.piegeDef;
  if(chien()) d += BAL.chien.defense; // le chien monte la garde
  if(typeof BONUS_CLAN_DEF !== "undefined") d += BONUS_CLAN_DEF; // tours de guet du bastion de son clan (classement.js)
  if(G.porteOuverte) d = Math.max(0, d - BAL.porteOuverte.defense); // la porte est restée ouverte
  return d;
}

/* ---------- Chapitres ---------- */
// Chapitre en cours (après la liste : « Tenir bon » de 10 en 10 jours, sans fin)
function chapitreCourant(){
  if(G.chap < CHAPITRES.length) return CHAPITRES[G.chap];
  if(!G.cibleTenir) G.cibleTenir = Math.ceil((G.day + 1) / TENIR_TOUS_LES) * TENIR_TOUS_LES;
  return { titre:"Tenir bon", objectif:trad("Survivre jusqu’au jour {n}", { n:G.cibleTenir }),
           test:function(){ return G.day >= G.cibleTenir; }, progres:function(){ return [G.day, G.cibleTenir, "jours"]; }, recompense:{}, moral:10, // pas d'objets : ils reviendraient sans fin
           texte:vivants().length > 1 ? "Encore debout. Chaque jour arraché compte. La famille reprend courage." : "Encore debout. Chaque jour arraché compte, même sans les autres.",
           recit:(function(L){ return L[(Math.round(G.cibleTenir / TENIR_TOUS_LES) - 1) % L.length]; })(vivants().length > 1 ? RECITS_TENIR : RECITS_SEUL) };
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
  nuitCelebre(n);
  var P = BAL.pillards, jour = G.day + 1; // le jour qui commence
  // Pillards : ils emportent une partie d'un lieu ouvert qu'il reste à fouiller
  if(jour >= P.jour && alea("pillards") < P.chance){
    var cibles = LIEUX.map(function(L, i){ return i; }).filter(function(i){ return lieuOuvert(i) && G.lieux[i].butin.length >= P.minimum; });
    if(cibles.length){
      var c = cibles[Math.floor(alea("pillards-lieu") * cibles.length)], l = G.lieux[c];
      var nb = Math.max(1, Math.round(l.butin.length * (P.part[0] + alea("pillards-part") * (P.part[1] - P.part[0]))));
      l.butin.splice(0, nb);
      n.push(["b2", "🏴 " + trad("Des pillards ont fouillé {lieu} cette nuit : il n’y reste plus que {n} objet(s).", { lieu:leLieu(LIEUX[c].nom), n:l.butin.length })]);
    }
  }
  // Caches de pillards : un lieu presque vide se remplit un peu (plus dangereux quelques jours)
  var K = BAL.caches;
  if(jour >= K.jour && alea("cache") < K.chance){
    var vides = LIEUX.map(function(L, i){ return i; }).filter(function(i){ return lieuOuvert(i) && G.lieux[i].butin.length < K.seuil; });
    if(vides.length){
      var ci = vides[Math.floor(alea("cache-lieu") * vides.length)], lc = G.lieux[ci], ids = Object.keys(K.butin), poids = 0;
      ids.forEach(function(k){ poids += K.butin[k]; });
      var nbc = K.taille[0] + Math.floor(alea("cache-taille") * (K.taille[1] - K.taille[0] + 1));
      for(var q = 0; q < nbc; q++){ var t = alea("cache-objet-" + q) * poids, pris = ids[0]; for(var u = 0; u < ids.length; u++){ t -= K.butin[ids[u]]; if(t < 0){ pris = ids[u]; break; } } lc.butin.push(pris); }
      lc.cache = jour + K.jours - 1;
      G.stats.caches = (G.stats.caches || 0) + 1;
      var radio = possede(function(o){ return o.radio; });
      n.push(["g2", anglais() ? (radio ? "📻 The radio mentions a stash abandoned by raiders at " : "🏴 Fleeing raiders have abandoned a stash at ") + leLieu(LIEUX[ci].nom) + ": " + nbc + " items to take" + (K.danger ? ", but they’re still prowling nearby for a few days." : ".") : (radio ? "📻 La radio parle d’une cache abandonnée par des pillards " : "🏴 Des pillards en fuite ont abandonné une cache ") + (function(d){ return d.indexOf("le ") === 0 ? "au " + d.slice(3) : "à " + d; })(leLieu(LIEUX[ci].nom)) + " : " + nbc + " objets à prendre" + (K.danger ? ", mais ils rôdent encore autour quelques jours." : ".")]);
    }
  }
  // Lieux secrets découverts
  LIEUX.forEach(function(L, i){
    if(L.secret && !G.decouverts[i] && jour >= jourDecouverte(i)){
      G.decouverts[i] = jour;
      n.push(["g2", "🗺️ " + trad("Nouveau lieu découvert :") + " " + iconeLieu(L) + " " + L.nom + ". " + L.indice]);
    }
  });
  // Mission : fin du délai, ou nouvelle mission
  var M = mission();
  if(M && jour > G.mission.fin){
    changerMoral(M.moralEchec || 0);
    n.push(["b2", M.icone + " " + trad("Mission ratée :") + " " + trad(M.titre) + ". " + trad(M.echec) + (M.moralEchec ? " " + trad("Moral {n}.", { n:M.moralEchec }) : "")]);
    G.mission = null;
  } else if(!M && jour >= BAL.missions.jour && alea("mission") < BAL.missions.chance){
    var m = MISSIONS[Math.floor(alea("mission-quoi") * MISSIONS.length)], lieu = null;
    if(m.aller){
      var possibles = LIEUX.map(function(L, i){ return i; }).filter(function(i){ return lieuOuvert(i) && !LIEUX[i].voiture && resteLieu(i) > 0; });
      if(!possibles.length) return;
      lieu = possibles[Math.floor(alea("mission-lieu") * possibles.length)];
    }
    G.mission = { id:m.id, fin:jour + m.delai - 1, lieu:lieu };
    n.push(["g2", m.icone + " " + trad("Nouvelle mission : {titre} ({n} jours).", { titre:trad(m.titre), n:m.delai }) + " " + texteMission()]);
  }
}
// « le Garage auto », « l’Hôpital », « la Zone industrielle »
var FEMININS_LIEUX = ["Prison", "Centrale électrique", "Maison voisine", "Rue des pavillons", "Quincaillerie", "Station-service", "Zone industrielle", "Base militaire", "Caserne des pompiers", "Péniche du canal", "Clinique vétérinaire", "Forêt"];
function leLieu(nom){ if(typeof LANGUE !== "undefined" && LANGUE === "en") return "the " + nom; return /^[AEIOUYÉÈH]/.test(nom) ? "l’" + nom : (FEMININS_LIEUX.indexOf(nom) >= 0 ? "la " : "le ") + nom; }
function mission(){ return G.mission ? MISSIONS.filter(function(m){ return m.id === G.mission.id; })[0] : null; }
function texteMission(){ var M = mission(); return M ? trad(M.texte).replace("LIEU", G.mission.lieu != null ? LIEUX[G.mission.lieu].nom : "") : ""; }
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
  return M.icone + " " + trad("Mission réussie :") + " " + trad(M.titre) + ". " + trad(M.merci) + " (+" + nommerListe(rec) + (M.moral ? ", " + trad("moral +{n}", { n:M.moral }) : "") + ")";
}

/* ---------- Le chien ---------- */
function chien(){
  if(G.chien === true) G.chien = { nom:"Rex", faim:0 }; // anciennes sauvegardes
  return G.chien || null;
}
/* ---------- Le dernier recours et la folie (contenu sensible) ----------
   Quand la famille meurt de faim et qu'il n'y a plus rien, on peut proposer l'impensable. Rien n'est montré :
   seulement un choix et ses conséquences. La folie qui suit annonce la fin. CONTENUS_SENSIBLES est réglé par ui.js. */
var CONTENUS_SENSIBLES = true;
function sacrificePossible(){
  return CONTENUS_SENSIBLES && vivants().length >= 2 && famine() && !platsDispo().length && vivants().some(function(x){ return x.faim <= BAL.sacrifice.faimMax; });
}
function sacrifier(i){
  var x = G.m[i], S = BAL.sacrifice; if(!x || !x.al || !sacrificePossible()) return null;
  x.hp = 0; x.al = false;
  G.dd.push({ n:x.nom, r:roleDe(x), c:(FEMININS.indexOf(roleDe(x)) >= 0 ? "sacrifiée" : "sacrifié") + " pour que les autres survivent", j:G.day, ic:x.icone }); deuilPour(x, null);
  rendreAuStock([x]);
  G.reste.nour += S.viande; changerMoral(S.moral);
  vivants().forEach(function(y){ y.folie = Math.min(100, (y.folie || 0) + R(S.folie[0], S.folie[1])); });
  G.stats.sacrifices = (G.stats.sacrifices || 0) + 1;
  return trad("Personne ne parlera jamais de cette nuit. Au matin, {x} n’est plus là, et la famille a de quoi manger (+{n} rations)… mais plus personne n’ose croiser le regard des autres. Moral {m}.", { x:x.nom, n:S.viande, m:S.moral });
}
function fou(x){ return x.al && (x.folie || 0) >= BAL.folie.seuil; }
// Chaque nuit : la folie monte (ou baisse un peu si le moral tient), et pousse parfois à un acte fou
function nuitFolie(n){
  var F = BAL.folie;
  vivants().forEach(function(x){
    if(!x.al || !x.folie) return;
    x.folie = Math.max(0, Math.min(100, x.folie + (G.moral >= F.moralCalme ? F.calme : F.hausse)));
    if(!fou(x)) return;
    changerMoral(-F.moralParFou);
    if(x.folie >= 100){
      // Il a perdu la raison : il part dans la nuit et ne revient pas
      x.hp = 0; x.al = false; changerMoral(-25);
      var cause = FEMININS.indexOf(roleDe(x)) >= 0 ? "partie dans la nuit, folle à lier" : "parti dans la nuit, fou à lier";
      n.push(["mort", trad(FEMININS.indexOf(roleDe(x)) >= 0 ? "{nom} a perdu la raison. Une nuit, elle est sortie sans un mot et n’est jamais revenue." : "{nom} a perdu la raison. Une nuit, il est sorti sans un mot et n’est jamais revenu.", { nom:x.nom }), roleDe(x)]);
      G.dd.push({ n:x.nom, r:roleDe(x), c:cause, j:G.day, ic:x.icone }); rendreAuStock([x]); deuilPour(x, n);
      return;
    }
    if(hasard() < x.folie / F.diviseur) acteFou(x, n);
  });
}
function acteFou(x, n){
  var autres = vivants().filter(function(y){ return y !== x; }), t = R(0, 4);
  if(t === 0 && autres.length){
    var y = autres[R(0, autres.length - 1)], dg = R(15, 30);
    n.push(["b2", "🌀 " + trad("Pris de folie, {nom} frappe violemment {autre} (−{n} PV).", { nom:x.nom, autre:y.nom, n:dg })]);
    blesser(y, dg, n, "tué par " + x.nom + (FEMININS.indexOf(roleDe(x)) >= 0 ? ", devenue folle" : ", devenu fou"));
  } else if(t === 1){
    vivants().forEach(function(y){ y.en = Math.max(0, y.en - 15); });
    n.push(["b2", "🌀 " + trad("{nom} a hurlé toute la nuit : personne n’a dormi (−15 ⚡ chacun).", { nom:x.nom })]);
  } else if(t === 2){
    var d2 = R(10, 25);
    var fx = FEMININS.indexOf(roleDe(x)) >= 0 ? "e" : "";
    n.push(["b2", "🌀 " + trad(fx ? "{nom} est sortie en pleine nuit… et revient au petit matin, couverte de griffures (−{n} PV)." : "{nom} est sorti en pleine nuit… et revient au petit matin, couvert de griffures (−{n} PV).", { nom:x.nom, n:d2 })]);
    blesser(x, d2, n, "mort dehors, seul dans la nuit");
  } else if(t === 3){
    var v = vivants(), z = v[R(0, v.length - 1)], d3 = R(10, 25), abime = G.ref.barr > 0;
    if(abime) G.ref.barr--;
    G.porteOuverte = true; // elle reste ouverte tant qu'on ne la referme pas (salon)
    n.push(["b2", "🌀 " + trad("{nom} a laissé la porte grande ouverte : des zombies sont entrés !", { nom:x.nom }) + " " + trad(FEMININS.indexOf(roleDe(z)) >= 0 ? "{autre} est blessée (−{n} PV)" : "{autre} est blessé (−{n} PV)", { autre:z.nom, n:d3 }) + (abime ? trad(", la barricade est abîmée") : "") + "."]);
    blesser(z, d3, n, "tué pendant l’attaque de nuit");
  } else {
    var pr = prendreRations("nour", R(2, 4));
    n.push(["b2", "🌀 " + (pr ? trad("{nom} a mangé en cachette une partie des réserves (−{n} rations).", { nom:x.nom, n:pr }) : trad("{nom} a mangé en cachette une partie des réserves.", { nom:x.nom }))]);
  }
}
// Famine : il ne reste pas de quoi nourrir la famille ce soir
function famine(){ return rations("nour") < vivants().length; }
function mangerChien(){
  var c = chien(); if(!c || !famine()) return null;
  G.reste.nour += BAL.chien.viande; changerMoral(BAL.chien.moral); G.chien = null;
  return trad("Personne ne parle pendant le repas. Vous avez {n} rations de plus, mais {c} ne montera plus jamais la garde. Moral {m}.", { n:BAL.chien.viande, c:c.nom, m:BAL.chien.moral });
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
  return trad("Échange fait : vous donnez {a} et recevez {b}.", { a:nommer(o.donne.id, o.donne.n), b:nommer(o.recoit.id, o.recoit.n) });
}

/* ---------- Événement du matin (même pour tous en Partie du jour) ---------- */
function evenementDuMatin(){
  if(alea("matin") >= 0.6) return null;
  var dispo = EVENEMENTS.filter(function(e){ return !e.si || e.si(); });
  // 2026-11-14 : moins de répétitions. Un événement vu il y a moins de BAL.evenements.pause jours est mis de côté (s'il en reste d'autres)
  G.evVus = G.evVus || {};
  var frais = dispo.filter(function(e){ var d = G.evVus[EVENEMENTS.indexOf(e)]; return d === undefined || G.day - d >= BAL.evenements.pause; });
  if(frais.length) dispo = frais;
  var ev = dispo[aleaR("evenement", 0, dispo.length - 1)];
  G.evVus[EVENEMENTS.indexOf(ev)] = G.day;
  G.evCible = null; G.evIcone = null;
  if(ev.prep) ev.prep();
  return ev;
}
function texteEvenement(ev){ return typeof ev.texte === "function" ? ev.texte() : trad(ev.texte); }
function membre(nom){ return G.m.filter(function(x){ return x.nom === nom; })[0]; }
// Membre par rôle d'origine (Papa, Maman, Léo, Emma), même renommé
function parRole(r){ return G.m.filter(function(x){ return x.r === r; })[0]; }
// Une recrue prend la place d'un membre disparu (famille de 4 au maximum)
function recruter(nom, ic){
  if(vivants().length >= FAMILLE.length) return false;
  var mort = G.m.filter(function(x){ return !x.al; })[0];
  var ids = Object.keys(TRAITS);
  var r = { icone:ic, nom:nom, r:nom, trait:ids[aleaR("trait", 0, ids.length - 1)], al:true, hp:70, en:50, faim:50, soif:50, eq:{ arme:null, outil:null, sac:null } };
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
  if(besoin && !possede(function(o){ return o === OBJETS[besoin]; })) return trad("Il faut {o}", { o:nommer(besoin, 1) });
  if(!aLesIngredients(ing)) return "Il manque des matériaux";
  if(!artisan()) return "Tout le monde est trop fatigué";
  return null;
}
function fabriquer(r){
  var rec = RECETTES[r]; if(empechement(rec.ingredients, rec.besoin)) return null;
  var x = artisan(); x.en -= coutTravail(x);
  for(var k in rec.ingredients) consommer(k, rec.ingredients[k]);
  ajouter(rec.id, 1, 1); G.stats.fabriques++;
  var tt = exploit(x, "travaux");
  return trad("{x} fabrique {o}.", { x:x.nom, o:nommer(rec.id, 1) }) + (tt ? " " + tt : "");
}
// Toutes les armes de la famille (stock + en main) qui sont abîmées
function armesAbimees(){
  return G.stock.o.concat(equipes()).filter(function(o){ return OBJETS[o.id].emplacement === "arme" && o.sol < OBJETS[o.id].sol; });
}
function trouverInstance(uid){ return G.stock.o.concat(equipes()).find(function(o){ return o.uid === uid; }); }
function reparer(uid){
  var o = trouverInstance(uid); if(!o || empechement(REPARATION)) return null;
  var x = artisan(); x.en -= coutTravail(x);
  for(var k in REPARATION) consommer(k, REPARATION[k]);
  var max = OBJETS[o.id].sol; o.sol = Math.min(max, o.sol + Math.round(max * BAL.reparation));
  var tt = exploit(x, "travaux");
  return trad("{x} répare {o} (solidité {a} / {b}).", { x:x.nom, o:nommer(o.id, 1), a:o.sol, b:max }) + (tt ? " " + tt : "");
}
// Seuls les objets rangés dans le stock peuvent être démontés
function demontables(){ return G.stock.o.filter(function(o){ return DEMONTAGE[o.id]; }); }
function demonter(uid){
  var o = G.stock.o.find(function(o){ return o.uid === uid; });
  if(!o || !DEMONTAGE[o.id] || !artisan()) return null;
  var x = artisan(); x.en -= coutTravail(x);
  retirerInstance(uid);
  var p = DEMONTAGE[o.id], recup = [];
  for(var k in p){ ajouter(k, p[k], 1); recup.push({ id:k, n:p[k] }); }
  var tt = exploit(x, "travaux");
  return trad("{x} démonte {o} et récupère {r}.", { x:x.nom, o:nommer(o.id, 1), r:nommerListe(recup) }) + (tt ? " " + tt : "");
}

nouvellePartie();
