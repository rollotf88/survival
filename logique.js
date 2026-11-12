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
  if(compter("planche") < BAL.cuisine.planches) return "Il faut " + nommer("planche", BAL.cuisine.planches) + " pour la cuisinière";
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
  ajouter(rec.id, n, 1); G.cuisineJour = G.day; G.stats.plats = (G.stats.plats || 0) + n;
  var tt = exploit(x, "plats");
  return x.nom + " cuisine " + nommer(rec.id, n) + "." + (tt ? " " + tt : "");
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
function causeMort(r, cause){ var t = accorder(r, cause || "mort"); return t.charAt(0).toUpperCase() + t.slice(1); }
function phraseMort(nom, cause, r){
  r = r || nom;
  if(!cause) return nom + " est " + accorder(r, "mort") + ".";
  if(/^(mort|tombé|parti)/.test(cause)) return nom + " est " + accorder(r, cause) + ".";
  if(/^(mordu|coupé)/.test(cause)) return nom + " est " + accorder(r, "mort") + ", " + accorder(r, cause) + ".";
  if(/^(tué|emporté|sacrifié)/.test(cause)) return nom + " a été " + accorder(r, cause) + ".";
  return nom + " est " + accorder(r, "mort") + " : " + cause + ".";
}
// Remplace Papa, Maman, Léo, Emma dans les récits par les prénoms choisis.
// t peut être une liste de versions : on prend la première qui ne nomme que des membres en vie (sinon la dernière, sans nom).
// passe = true : récit d'un chapitre déjà vécu, on garde la version d'origine (c'était vrai à ce moment-là).
function nommeVivants(t){ return (String(t).match(/Papa|Maman|Léo|Emma/g) || []).every(function(r){ var x = parRole(r); return x && x.al; }); }
function perso(t, passe){
  if(Array.isArray(t)) t = (!G || !G.m || passe) ? t[0] : (t.filter(nommeVivants)[0] || t[t.length - 1]);
  if(!G || !G.m) return t;
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
  }
}
// Usure d’une arme : perd 1 de solidité, se casse à 0
// Prévenir quand un objet porté n'a presque plus de solidité (2 utilisations ou moins)
function avertirUsure(x, o, n, unite){
  if(!o.sol || o.sol > 2) return;
  var d = OBJETS[o.id];
  n.push(["b2", "⚠️ " + (d.g === "f" ? "La " : "Le ") + minus(d.nom) + " " + de(x.nom) + " est presque " + (d.g === "f" ? "cassée" : "cassé") + " : encore " + o.sol + " " + unite + (o.sol > 1 ? "s" : "") + ". Répare-" + (d.g === "f" ? "la" : "le") + " à l’atelier ou change-" + (d.g === "f" ? "la" : "le") + "."]);
}
function userArme(x, n){
  var a = x.eq.arme; if(!a) return;
  a.sol--;
  if(a.sol <= 0){ x.eq.arme = null; n.push(["b2", "💥 " + (OBJETS[a.id].g === "f" ? "La " : "Le ") + minus(OBJETS[a.id].nom) + " " + de(x.nom) + " se brise !"]); }
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
  TITRES.forEach(function(t){ if(t.k === k && avant < t.n && x.xp[k] >= t.n){ txt = "🏅 " + x.nom + " devient « " + t.nom + " » : " + t.effet + " !"; if(n) n.push(["g2", txt]); } });
  return txt;
}
// Tombes de la cour : se recueillir une fois par jour (un peu de moral)
function peutRecueillir(){ return G.dd && G.dd.length > 0 && G.recueilJour !== G.day; }
function recueillir(){ if(!peutRecueillir()) return false; G.recueilJour = G.day; changerMoral(BAL.tombes.moral); return true; }
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
  team.forEach(function(x){ if(!x.al) return; f += 1 + (x.eq.arme ? OBJETS[x.eq.arme.id].def : 0) + (x.trait === "costaud" ? BAL.traits.costaud : 0) - (fatigue(x) ? BAL.fatigueForce : 0); });
  return Math.max(0, f);
}
function placesEquipe(team){
  var p = 0; team.forEach(function(x){ if(x.al) p += BAL.mainsParMembre + (x.eq.sac ? OBJETS[x.eq.sac.id].capacite : 0) - (x.trait === "agile" ? BAL.traits.frele : 0); }); return p;
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
        if(feu.sol){ feu.sol--; if(feu.sol <= 0){ briquet.eq.outil = null; n.push(["b2", "🕯️ La torche " + de(briquet.nom) + " s’est consumée."]); } else avertirUsure(briquet, feu, n, "fouille"); }
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
  else if(G.moral >= BAL.moralHaut) n.push(["g2", "😀 Bon moral : l’équipe fouille avec entrain (+" + BAL.moralHautFouille + " objet)."]);
  var bruyants = team.filter(function(x){ return x.trait === "fouineur"; });
  if(bruyants.length) d += BAL.traits.bruit * bruyants.length;
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
  E.notes.push(["b2", "🔒 Porte forcée à la brute, ça fait du bruit."]);
  if(E.serrure && !E.serrure.fin) E.serrure.fin = "force";
}
// reussi : le joueur a appuyé dans la zone verte ? Renvoie un message.
function tentativeGoupille(reussi){
  var S = G.exp.serrure, x = crocheteur();
  if(reussi){
    S.faites++;
    if(S.faites >= BAL.crochetage.goupilles){
      S.fin = "ouvert"; G.stats.crochetages = (G.stats.crochetages || 0) + 1; exploit(x, "crochetages", 1, G.exp.notes);
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
    apresCombatCelebre(n);
    if(C.fin === "fuite") mult *= BAL.combat.butinFuite;
  }
  // Fouille : on pioche dans la vraie liste du lieu
  var survivants = team.filter(function(x){ return x.al; });
  survivants.forEach(function(x){ exploit(x, "fouilles", 1, n); });
  var nb = survivants.length * BAL.fouilleParMembre + (survivants.some(function(x){ return x.trait === "fouineur"; }) ? BAL.traits.fouine : 0)
    - survivants.filter(function(x){ return x.trait === "optimiste"; }).length * BAL.traits.reveur
    + (G.moral >= BAL.moralHaut ? BAL.moralHautFouille : 0)
    - survivants.filter(fou).length;
  nb = Math.max(survivants.length ? 1 : 0, Math.round(nb * mult));
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
    n.push([peches ? "g2" : "b2", "🎣 " + (peches ? "Vous pêchez " + nommer("poisson", peches) + " (" + peches + " touche" + (peches > 1 ? "s" : "") + " sur " + E.peche.lancers + ")." : "Aucun poisson cette fois : ils ont tous filé.")]);
    survivants.forEach(function(x){ var c = x.eq.outil; if(!c || !OBJETS[c.id].peche) return; c.sol--; if(c.sol <= 0){ x.eq.outil = null; n.push(["b2", "🎣 La canne à pêche " + de(x.nom) + " casse."]); } else avertirUsure(x, c, n, "sortie"); });
  }
  else if(LIEUX[i].peche && estSaison("hiver") && survivants.some(function(x){ return x.eq.outil && OBJETS[x.eq.outil.id].peche; })) n.push(["b2", "❄️ L’étang est gelé : impossible de pêcher avant le printemps."]);
  else if(LIEUX[i].peche) survivants.forEach(function(x){
    var c = x.eq.outil; if(!c || !OBJETS[c.id].peche) return;
    var k = Math.min(lieu.poissons, Math.max(1, Math.round(R(BAL.peche.prises[0], BAL.peche.prises[1]) * mult)));
    lieu.poissons -= k; peches += k; G.stats.poissons = (G.stats.poissons || 0) + k; if(k && typeof noterDefi === "function") noterDefi("poissons", k);
    for(var p = 0; p < k; p++) trouves.unshift("poisson");
    n.push(["g2", "🎣 " + x.nom + " pêche " + (k ? nommer("poisson", k) : "rien") + "."]);
    c.sol--; if(c.sol <= 0){ x.eq.outil = null; n.push(["b2", "🎣 La canne à pêche " + de(x.nom) + " casse."]); }
  });
  // Forêt : chaque survivant qui a une hache en main coupe du bois (tant qu'il reste des arbres)
  if(LIEUX[i].bois){
    var bu = bucherons(survivants);
    bu.forEach(function(x){
      if(lieu.arbres <= 0) return;
      var k = Math.min(lieu.arbres, Math.max(1, Math.round(R(BAL.foret.coupe[0], BAL.foret.coupe[1]) * mult)));
      lieu.arbres -= k; G.stats.bois = (G.stats.bois || 0) + k; if(typeof noterDefi === "function") noterDefi("bois", k);
      for(var pb = 0; pb < k; pb++) trouves.unshift("planche");
      n.push(["g2", "🪓 " + x.nom + " abat un arbre : " + nommer("planche", k) + "."]);
      var h = x.eq.arme; h.sol -= BAL.foret.usure;
      if(h.sol <= 0){ x.eq.arme = null; n.push(["b2", "💥 La hache " + de(x.nom) + " se brise sur un tronc !"]); } else avertirUsure(x, h, n, "coup");
    });
    if(survivants.length && !bu.length && lieu.arbres > 0) n.push(["b2", "🪓 Sans hache en main, impossible de couper du bois."]);
    if(lieu.arbres <= 0 && bu.length) n.push(["b2", "🌲 Il ne reste plus un arbre debout dans la forêt."]);
  }
  if(LIEUX[i].peche && !peches && survivants.length && !survivants.some(function(x){ return x.eq.outil && OBJETS[x.eq.outil.id].peche; })) n.push(["b2", "🎣 Sans canne à pêche, impossible d’attraper les poissons."]);
  // Station-service : la cuve souterraine. Chaque survivant remplit un jerrican à la pompe à main (tant qu'il en reste)
  if(LIEUX[i].cuve && survivants.length){
    var nj = Math.min(survivants.length, Math.floor(cuveLieu(i) / VOITURE.litresJerrican));
    if(nj){ lieu.essence -= nj * VOITURE.litresJerrican; ajouter("jerrican", nj); n.push(["g2", "⛽ À la pompe à main, vous remplissez " + nommer("jerrican", nj) + " dans la cuve (il reste " + lieu.essence + " L)."]); }
    else n.push(["b2", "⛽ La cuve de la station est vide."]);
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
  if(reussi === null || !k){ res.notes.push(["", "🚗 Vous passez devant une voiture abandonnée sans vous arrêter."]); return res; }
  k.sol--; if(k.sol <= 0){ retirerInstance(k.uid); res.notes.push(["b2", "🧪 Le kit de siphonnage est fichu : le tuyau a cédé."]); }
  if(reussi){
    var l = R(BAL.siphon.litres[0], BAL.siphon.litres[1]), place = VOITURE.reservoir - G.voiture.essence, dans = Math.min(place, l), reste = l - dans, j = Math.floor(reste / VOITURE.litresJerrican);
    G.voiture.essence += dans; if(j) ajouter("jerrican", j);
    G.stats.siphons = (G.stats.siphons || 0) + 1;
    res.notes.push(["g2", "⛽ Vous siphonnez " + l + " L d’essence dans une voiture abandonnée" + (dans ? " (réservoir : " + G.voiture.essence + " L)" : "") + (j ? " et remplissez " + nommer("jerrican", j) : "") + (reste - j * VOITURE.litresJerrican > 0 && !dans ? " (le reste déborde)" : "") + "."]);
  } else res.notes.push(["b2", "🧟 Le tuyau gargouille, l’essence gicle… le bruit attire des zombies : vous filez les mains vides !"]);
  return res;
}
/* ---------- Rencontres en chemin ---------- */
function lancerRencontre(equipe, res){
  var B = BAL.rencontres; G.rencontresFaites = G.rencontresFaites || [];
  if(G.rencontre || G.day < B.jour || G.jourRencontre === G.day || hasard() >= B.chance) return;
  var ok = RENCONTRES.filter(function(r){ return G.day >= (r.jour || 1) && (!r.cond || r.cond()) && G.rencontresFaites.indexOf(r.id) < 0; });
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
  if(e.nour){ var pn = prendreRations("nour", e.nour); if(pn) L.push(["b2", "🥫 −" + pn + " ration" + (pn > 1 ? "s" : "") + " de nourriture."]); }
  if(e.eau){ var pe = prendreRations("eau", e.eau); if(pe) L.push(["b2", "💧 −" + pe + " ration" + (pe > 1 ? "s" : "") + " d’eau."]); }
  var moins = function(id, q){ return icone(id) + " −" + q + " " + (q > 1 ? OBJETS[id].pl : OBJETS[id].nom).toLowerCase() + "."; };
  for(var s = 0; s < (e.soins || 0); s++){ var k = retirerSoin(); if(k) L.push(["b2", moins(k, 1)]); }
  if(e.perdre) for(var p in e.perdre){ var q = Math.min(compter(p), e.perdre[p]); if(!q) continue; if(OBJETS[p].empile) retirer(p, q); else consommer(p, q); L.push(["b2", moins(p, q)]); }
  if(e.perdreConfort){ var kc = ["photo", "cartes", "peluche", "radio"].filter(function(k){ return compter(k) > 0; })[0]; if(kc){ consommer(kc, 1); L.push(["b2", moins(kc, 1)]); } }
  if(e.objets) for(var o in e.objets){ ajouter(o, e.objets[o]); recu.push(nommer(o, e.objets[o])); }
  if(recu.length) L.push(["g2", "🎁 Vous rapportez " + liste(recu) + "."]);
  if(e.chien && !chien()){ G.chien = { nom:"Rex", faim:0 }; L.push(["g2", ic("chien", "🐕") + " Rex fait désormais partie de la famille."]); }
  if(e.recruter && recruter(e.recruter[0], e.recruter[1])) L.push(["g2", "🧑 " + e.recruter[0] + " rejoint la famille."]);
  if(e.decouvrir){
    var ls = LIEUX.map(function(L2, i){ return i; }).filter(function(i){ return LIEUX[i].secret && !(G.decouverts && G.decouverts[i]); });
    if(ls.length){ G.decouverts = G.decouverts || {}; G.decouverts[ls[0]] = true; L.push(["g2", "📍 Nouveau lieu découvert : " + LIEUX[ls[0]].nom + "."]); }
  }
  if(e.energie){ eq.forEach(function(x){ x.en = Math.max(0, x.en - e.energie); }); L.push(["b2", "⚡ −" + e.energie + " d’énergie pour l’équipe."]); }
  if(e.folie) eq.forEach(function(x){ x.folie = Math.min(100, (x.folie || 0) + e.folie); });
  if(e.moral){ changerMoral(e.moral); L.push([e.moral > 0 ? "g2" : "b2", (e.moral > 0 ? "😊 Moral +" : "😟 Moral ") + e.moral + "."]); }
  if(e.pv && cible){ L.push(["b2", "🩸 " + cible.nom + " est blessé" + (FEMININS.indexOf(roleDe(cible)) >= 0 ? "e" : "") + " (−" + e.pv + " PV)."]); blesser(cible, e.pv, L, e.cause || "tué en chemin"); }
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
  var types = ZOMBIES.filter(function(z){ return G.day >= z.jour && z.id !== sauf; }), total = 0;
  types.forEach(function(z){ total += z.poids; });
  var r = hasard() * total;
  for(var k = 0; k < types.length; k++){ r -= types[k].poids; if(r < 0) return types[k]; }
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
    n.push(["b2", "💀 " + T.nom + " rôde en ville : un zombie que tout le monde craint. " + (radio ? "📻 La radio le signale près " + de(leLieu(LIEUX[G.celebre.lieu].nom)).replace(/^de le /, "du ").replace(/^de les /, "des ") + "." : "Une radio permettrait de savoir où.")]);
    return;
  }
  var L = lieuxPourCelebre(G.celebre.lieu); if(!L.length) return;
  G.celebre.lieu = L[Math.floor(alea("celebre-bouge") * L.length)];
  if(radio) n.push(["", "📻 " + typeZombie({ id:G.celebre.id }).nom + " a été vu" + (G.celebre.id === "mariee" ? "e" : "") + " près " + de(leLieu(LIEUX[G.celebre.lieu].nom)).replace(/^de le /, "du ").replace(/^de les /, "des ") + "."]);
}
// Après un combat où il était : il garde ses blessures, ou il tombe (butin, moral, trophée)
function apresCombatCelebre(n){
  var c = celebre(), C = G.combat; if(!c || !C) return;
  var z = C.zombies.find(function(x){ return x.celebre; }); if(!z) return;
  if(z.pv > 0){ c.pv = z.pv; n.push(["", "💀 " + z.nom + " s’échappe, blessé" + (c.id === "mariee" ? "e" : "") + " (" + z.pv + " / " + c.pvMax + " PV). Il rôdera ailleurs cette nuit."]); return; }
  var par = (C.tueurCelebre !== undefined && G.m[C.tueurCelebre]) ? G.m[C.tueurCelebre].nom : "la famille";
  G.trophees = (G.trophees || []).concat([{ id:c.id, nom:z.nom, jour:G.day, par:par }]);
  G.celebre = null; G.celebreProchain = G.day + BAL.celebre.entre;
  for(var k in BAL.celebre.butin) ajouter(k, BAL.celebre.butin[k]);
  changerMoral(BAL.celebre.moral);
  G.stats.celebres = (G.stats.celebres || 0) + 1;
  n.push(["g2", "🏆 " + z.nom + " est tombé" + (c.id === "mariee" ? "e" : "") + " sous les coups de " + par + " ! La nouvelle fait le tour du quartier (moral +" + BAL.celebre.moral + "). Sur sa dépouille : " + nommerListe(Object.keys(BAL.celebre.butin).map(function(k){ return { id:k, n:BAL.celebre.butin[k] }; })) + ". Son trophée trône au salon."]);
}
function creerCombat(){
  var C = BAL.combat, nb = 1;
  for(var k = 0; k < C.maxEnPlus; k++) if(hasard() < Math.min(0.6, G.day * C.zombieEnPlus + (hordeMondiale() ? BAL.horde.zombieEnPlus : 0))) nb++;
  var zs = [];
  for(var k = 0; k < nb; k++) zs.push(nouveauZombie(tirerZombie()));
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
  G.exp = { guerre:true, assaut:p.assaut, nomLieu:"le bastion « " + p.clan + " »", cible:p.cible, lieu:0, equipe:equipe.slice(), notes:[], mult:1, d:0, voiture:false };
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
  equipe.forEach(function(j){ var g = G.exp.equipGuerre[j]; if(g) J.push(["g2", g.map(function(o){ return OBJETS[o.id].icone; }).join(" ") + " " + G.m[j].nom + " porte : " + liste(g.map(function(o){ return OBJETS[o.id].nom.toLowerCase(); })) + "."]); });
  var cam = p.camion || {}; G.exp.camion = { parebuffle:cam.parebuffle || 0, blindage:cam.blindage || 0, tourelle:cam.tourelle || 0 };
  var absorbe = Math.min(p.mines || 0, G.exp.camion.blindage);
  if(absorbe) J.push(["g2", "🚚 Le blindage du camion encaisse " + absorbe + " mine" + (absorbe > 1 ? "s" : "") + " sans dégâts."]);
  for(var m = absorbe; m < (p.mines || 0); m++){ var eq = equipeCombat(); if(!eq.length) break; var x = eq[R(0, eq.length - 1)], dg = R(A.mineDegats[0], A.mineDegats[1]); if(porteGuerre(x, "casque")) dg = Math.ceil(dg / 2); J.push(["b2", "💣 Une mine explose sous " + x.nom + " (−" + dg + " PV)" + (porteGuerre(x, "casque") ? ", son casque l’a protégé" : "") + " !"]); blesser(x, dg, J, "tué par une mine devant " + G.exp.nomLieu); }
  if(p.armurerie) J.push(["", "🦺 Les défenseurs portent des gilets (armurerie niveau " + p.armurerie + ") : chaque tir perd " + Math.round(BAL.assaut.armurerieTir * Math.min(3, p.armurerie) + 0.01) + " dégâts, chaque coup " + Math.round(BAL.assaut.armurerieCoup * Math.min(3, p.armurerie) + 0.01) + "."]);
  if(p.remparts) J.push(["", "🧱 Les remparts (niveau " + p.remparts + ") rendent les défenseurs plus coriaces."]);
  if(G.exp.camion.parebuffle){ var choc = Math.round(BAL.assaut.parebuffle * G.exp.camion.parebuffle); zs.forEach(function(z){ z.pv = Math.max(1, z.pv - choc); }); J.push(["g2", "🚚 Le camion enfonce l’entrée avec son pare-buffle : chaque défenseur perd " + choc + " PV !"]); }
  if(G.exp.camion.tourelle) J.push(["g2", "🚚 La tourelle du camion tirera à chaque tour (niveau " + G.exp.camion.tourelle + ")."]);
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
function equipeCombat(){ return G.exp.equipe.map(function(j){ return G.m[j]; }).filter(function(x){ return x.al; }); }
// Ce que chaque zombie debout va faire ce tour-ci : { t:"mord" | "hurle", c: index du membre visé }
function preparerIntentions(){
  var C = G.combat, eq = equipeCombat(); if(!eq.length) return;
  zombiesDebout().forEach(function(z){
    var T = typeZombie(z), x = eq[R(0, eq.length - 1)];
    z.int = { t:T.hurle && C.tour % 2 === 0 ? "hurle" : "mord", c:G.m.indexOf(x) };
  });
}
// Dégâts maximum qu'un zombie peut faire à un membre ce tour (pour le robot et l'affichage)
function menaceZombie(z){ var T = typeZombie(z); return z.int && z.int.t === "hurle" ? 0 : z.degats[1] * (T.coups || 1); }
// Renvoie { dg, comment, tir } ; une arme à feu use une munition du stock
function degatsMembre(x){
  var C = BAL.combat, a = x.eq.arme, d = a ? OBJETS[a.id].degats : C.poings, comment = a ? "avec " + nommer(a.id, 1) : "à mains nues", tir = false;
  var mu = a && OBJETS[a.id].munition;
  if(mu){
    if(compter(mu) > 0){ retirer(mu, 1); tir = true; comment = "tire " + (OBJETS[a.id].g === "f" ? "à la " : "au ") + minus(OBJETS[a.id].nom); }
    else { d = C.crosse; comment = "n’a plus " + (mu === "balle" ? "de balles" : "de cartouches") + ", frappe avec la crosse"; }
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
    J.push(["b2", "🔊 Le bruit du tir attire un " + minus(t.nom) + " !"]);
  }
}
// Peut-on lancer un cocktail Molotov ? (un cocktail au stock, fabriqué à l'atelier, et un briquet dans la famille pour l'allumer)
function peutCocktail(){ return compter("cocktail") > 0 && possede(function(o){ return o.allume; }); }
// Un zombie tombe : le Gonflé explose et blesse toute l'équipe
function zombieTombe(z, protege, J){
  G.combat.abattus = (G.combat.abattus || 0) + 1; if(!(G.exp && G.exp.guerre)) G.stats.zombies = (G.stats.zombies || 0) + 1; // compté pour les stats du joueur (pas les défenseurs d'un bastion)
  var T = typeZombie(z); if(!T.explose) return;
  J.push(["b2", "💥 " + z.nom + " explose en tombant !"]);
  equipeCombat().forEach(function(x){
    var dg = R(T.explose[0], T.explose[1]); if(protege[G.m.indexOf(x)]) dg = Math.round(dg * BAL.combat.protection); if(G.exp.guerre && porteGuerre(x, "casque")) dg = Math.ceil(dg / 2);
    J.push(["b2", "🤢 " + x.nom + " est éclaboussé" + (estFeminin(x) ? "e" : "") + " (−" + dg + " PV)."]);
    blesser(x, dg, J, "tué par l’explosion d’un gonflé (" + nomLieuCombat() + ")");
  });
}
function estFeminin(x){ return typeof FEMININS !== "undefined" && FEMININS.indexOf(roleDe(x)) >= 0; }
// Un zombie agit (mordre ou hurler) ; protege = { indexMembre: true }
function actionZombie(z, protege, J){
  var C = BAL.combat, T = typeZombie(z), lieu = nomLieuCombat();
  if(z.int && z.int.t === "hurle"){
    if(zombiesDebout().length < C.maxZombies){ var t = tirerZombie("hurleur"); G.combat.zombies.push(nouveauZombie(t)); J.push(["b2", "📢 " + z.nom + " hurle : un " + minus(t.nom) + " accourt !"]); }
    else J.push(["", "📢 " + z.nom + " hurle dans le vide."]);
    return;
  }
  var eq = equipeCombat(); if(!eq.length) return;
  var x = z.int && G.m[z.int.c] && eq.indexOf(G.m[z.int.c]) >= 0 ? G.m[z.int.c] : eq[R(0, eq.length - 1)];
  for(var k = 0; k < (T.coups || 1) && x.al; k++){
    var dg = R(z.degats[0], z.degats[1]);
    if(protege[G.m.indexOf(x)]) dg = Math.max(1, Math.round(dg * (T.lourd ? C.ecrase : G.exp.guerre && porteGuerre(x, "bouclier") ? BAL.assaut.bouclier : C.protection)));
    if(G.exp.guerre && porteGuerre(x, "gilet")) dg = Math.max(1, dg - BAL.assaut.gilet);
    if(aTitre(x, "durACuire")) dg = Math.max(1, dg - 1);
    if(!G.exp.guerre && G.day <= BAL.debutDoux.jours) dg = Math.max(1, Math.round(dg * BAL.debutDoux.degats)); // début de partie plus doux
    J.push(["b2", iconeZombie(z) + " " + z.nom + " frappe " + x.nom + " (−" + dg + " PV)."]);
    blesser(x, dg, J, (z.celebre ? "tué par " + minus(z.nom) : "tué par un " + minus(z.nom)) + " (" + lieu + ")");
  }
}
// Les zombies debout attaquent (fuite ratée : tout le monde, sans intention de hurler)
function attaqueZombies(protege, J){
  zombiesDebout().forEach(function(z){ if(z.int && z.int.t === "hurle") z.int.t = "mord"; actionZombie(z, protege, J); });
}
// Raja, le tigre de la Légende du mois (2026-11-12) : une fois par partie (la partie temporaire du raid compte avec la vraie)
function maisonTigre(){ return typeof G_MAISON !== "undefined" && G_MAISON ? G_MAISON : G; }
function tigreUtilise(){ return !!(G.tigreUtilise || maisonTigre().tigreUtilise); }
function lacherTigre(){
  var C = G.combat, J = [], guerre = G.exp && G.exp.guerre && !G.exp.raid; if(!C || C.fin) return [];
  G.tigreUtilise = true; maisonTigre().tigreUtilise = true;
  J.push(["g2", "🐅 Raja surgit en rugissant et bondit sur " + (guerre ? "les défenseurs" : "les zombies") + " !"]);
  zombiesDebout().forEach(function(z){
    var d;
    if(guerre || z.celebre || z.id === "colosse"){
      d = Math.ceil(z.pv * (guerre ? BAL.tigre.guerre : BAL.tigre.boss)); z.pv = Math.max(1, z.pv - d);
      J.push(["g2", "🐅 Raja lacère " + z.nom + " (−" + d + ")."]);
    } else { z.pv = 0; J.push(["g2", "🐅 Raja terrasse " + z.nom + " !"]); zombieTombe(z, {}, J); }
  });
  C.journal = J; verifierFin(J);
  if(G.exp && G.exp.raid && typeof noterTourRaid === "function") noterTourRaid(J);
  return J;
}
function verifierFin(J){
  var C = G.combat;
  if(!equipeCombat().length){ C.fin = "defaite"; C.resume.push(["b2", "💀 Personne n’est revenu de " + nomLieuCombat() + "."]); }
  else if(!zombiesDebout().length){ C.fin = "victoire"; C.resume.push(["g2", (G.exp && G.exp.raid ? "🏢 Étage nettoyé en " : G.exp && G.exp.guerre ? "⚔️ Assaut gagné en " : "🧟 Combat gagné en ") + C.tour + " tour" + (C.tour > 1 ? "s" : "") + " !"]); }
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
    J.push([dt ? "g2" : "", "🚚 La tourelle tire sur " + zt.nom + (dt ? " : −" + dt + (zt.pv ? "" : ", à terre !") : " : la balle ricoche sur son gilet.")]);
    if(!zt.pv) zombieTombe(zt, protege, J);
  }
  // 2. L'équipe agit
  equipeCombat().forEach(function(x){
    var j = G.m.indexOf(x), c = choix[j] || { a:"frapper" };
    var debout = zombiesDebout(); if(!debout.length) return;
    var z = C.zombies[c.cible] && C.zombies[c.cible].pv > 0 ? C.zombies[c.cible] : debout[0], T = typeZombie(z);
    if(c.a === "proteger"){ J.push(["", "🛡️ " + x.nom + " se protège."]); return; }
    if(c.a === "soigner"){
      var bl = equipeCombat().filter(function(y){ return y.hp < 100; }).sort(function(a, b){ return a.hp - b.hp; })[0];
      var k = bl && soigner(G.m.indexOf(bl));
      if(k){ J.push(["g2", "🩹 " + x.nom + " soigne " + (bl === x ? "ses blessures" : bl.nom) + " avec " + nommer(k, 1) + " (" + bl.hp + " PV)."]); return; }
      c = { a:"frapper", cible:c.cible };
    }
    if(c.a === "cocktail" && peutCocktail()){
      retirer("cocktail", 1);
      J.push(["g2", "🔥 " + x.nom + " lance un cocktail Molotov !"]);
      debout.forEach(function(zz){ var d = R(B.cocktail[0], B.cocktail[1]); zz.pv = Math.max(0, zz.pv - d); J.push(["g2", "🔥 " + zz.nom + " brûle : −" + d + (zz.pv ? "" : ", à terre !")]); if(!zz.pv){ zombieTombe(zz, protege, J); if(!(G.exp && G.exp.guerre && !G.exp.raid)) exploit(x, "zombies", 1, J); } });
      return;
    }
    if(c.a === "pousser"){
      if(hasard() >= (T.lourd ? B.pousserLourd : B.pousser)){ J.push(["b2", "✋ " + x.nom + " pousse " + z.nom + "… qui ne recule pas !"]); return; }
      sonne[C.zombies.indexOf(z)] = true; J.push(["g2", "✋ " + x.nom + " repousse " + z.nom + " : il perd son tour."]); return;
    }
    var r = degatsMembre(x), dg = r.dg;
    if(c.a === "tete"){
      var ch = B.tete + (r.tir && x.trait === "tireur" ? B.teteTireur : 0);
      if(hasard() < ch){ dg = dg * B.teteMult; if(z.armurerie && r.tir) dg = Math.max(1, dg - Math.round(BAL.assaut.armurerieTete * z.armurerie + 0.01)); z.pv = Math.max(0, z.pv - dg); J.push(["g2", "🎯 " + x.nom + (r.tir ? " " + r.comment : "") + " : coup à la tête ! " + z.nom + " −" + dg + (z.pv ? "" : ", à terre !")]); }
      else { J.push(["b2", "🎯 " + x.nom + (r.tir ? " " + r.comment : "") + " vise la tête… et rate " + z.nom + "."]); dg = 0; }
    } else {
      var arm = (T.armure || 0) + (z.armurerie ? Math.round((r.tir ? BAL.assaut.armurerieTir : BAL.assaut.armurerieCoup) * z.armurerie + 0.01) : 0);
      if(arm) dg = Math.max(1, dg - arm);
      z.pv = Math.max(0, z.pv - dg);
      J.push(["g2", (r.tir ? "🔫 " + x.nom + " " : "⚔️ " + x.nom + " frappe ") + r.comment + " : " + z.nom + " −" + dg + (arm ? " (gilet)" : "") + (z.pv ? "" : ", à terre !")]);
    }
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
  // Cible : le Hurleur qui va hurler, sinon le plus faible
  var vise = zs.filter(function(z){ return z.int && z.int.t === "hurle"; })[0] || zs.slice().sort(function(a, b){ return a.pv - b.pv; })[0];
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
    C.fin = "fuite"; J.push(["", "🏃 L’équipe prend la fuite !"]);
    C.resume.push(["b2", G.exp && G.exp.raid ? "🏃 Retraite par l’escalier : l’équipe quitte l’immeuble avec ce qu’elle a déjà trouvé." : G.exp && G.exp.guerre ? "🏃 Vous battez en retraite : l’assaut est un échec." : "🏃 Fuite devant les zombies : on rapporte moins de butin."]);
  } else {
    J.push(["b2", G.exp && G.exp.guerre && !G.exp.raid ? "🏃 La retraite échoue, les défenseurs vous rattrapent !" : "🏃 La fuite échoue, les zombies vous rattrapent !"]);
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
function finJour(){
  var n = [];
  G.score += vivants().length;
  if(vivants().length && typeof noterDefi === "function") noterDefi("nuits", 1);
  // Chaleur : le feu de cheminée (1 planche par nuit, il faut un briquet) réchauffe tout le monde ;
  // sinon une couverture tient chaud 2 personnes, les autres ont froid
  var feu = false;
  if(G.feu){
    if(G.braises > 0){ G.braises--; feu = true; n.push(["g2", "🔥 Le feu de cheminée a brûlé toute la nuit (la planche d’hier a suffi)."]); }
    else if(compter("planche") >= BAL.feu.planches && possede(function(o){ return o.allume; })){
      retirer("planche", BAL.feu.planches); feu = true; G.braises = estSaison("hiver") && BAL.saisons.feuHiver ? 0 : BAL.feu.nuitsParPlanche - 1; // une planche brûle plusieurs nuits (une seule en hiver)
      n.push(["g2", "🔥 Le feu de cheminée a brûlé toute la nuit (−" + BAL.feu.planches + " planche" + (BAL.feu.planches > 1 ? "s" : "") + (BAL.feu.nuitsParPlanche > 1 ? ", elle durera " + BAL.feu.nuitsParPlanche + " nuits" : "") + ")."]);
    } else { G.feu = false; n.push(["b2", "🔥 Le feu s’est éteint : " + (possede(function(o){ return o.allume; }) ? "plus de planches à brûler." : "plus de briquet pour le rallumer.")]); }
  }
  var auChaud = feu ? 99 : compter("couverture") * (estSaison("hiver") && BAL.saisons.couvHiver ? 1 : BAL.feu.couvrePar), froids = [], diner = [];
  vivants().forEach(function(x, kx){
    var chaud = kx < auChaud; if(!chaud) froids.push(x.nom);
    x.faim -= BAL.faimParJour + (x.trait === "costaud" ? BAL.traits.costaudFaim : 0) + (estSaison("hiver") ? BAL.saisons.faimHiver : 0);
    x.soif -= BAL.soifParJour + (x.trait === "endurant" ? BAL.traits.endurantSoif : 0) + (estSaison("ete") ? BAL.saisons.soifEte : 0);
    var repos = (chaud ? BAL.reposNuit + (feu ? BAL.feu.repos : 0) : BAL.reposFroid) - (x.canette ? BAL.canetteContrecoup : 0);
    if(x.canette) n.push(["", "🥴 " + x.nom + " dort mal après sa canette (+" + repos + " ⚡ seulement)."]);
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
  if(froids.length) n.push(["b2", "🥶 Nuit glaciale pour " + liste(froids) + " : pas de feu ni assez de couvertures (+" + BAL.reposFroid + " ⚡ au lieu de +" + BAL.reposNuit + ", −" + BAL.degatsFroid + " PV)."]);
  if(feu) changerMoral(BAL.feu.moral);

  var A = BAL.attaqueNuit;
  if(alea("attaque") < chanceAttaqueNuit()){
    var s = forceMiniNuit() + aleaR("force", 0, 2), df = defenseNuit();
    if(hordeMondiale()) n.push(["b2", "🌍 La grande horde rôde : les zombies sont plus nombreux cette nuit."]);
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
  // Le dîner : les plats mangés, puis ceux qui se gâtent
  if(diner.length){ var g = {}; diner.forEach(function(id){ g[id] = (g[id] || 0) + 1; }); n.push(["g2", "🍲 Au dîner : " + liste(Object.keys(g).map(function(id){ return nommer(id, g[id]); })) + "."]); }
  var gates = {}; platsDispo().forEach(function(o){ o.sol--; if(o.sol <= 0){ retirerInstance(o.uid); gates[o.id] = (gates[o.id] || 0) + 1; } });
  if(Object.keys(gates).length) n.push(["b2", "🤢 Gâté" + (Object.keys(gates).length > 1 || gates[Object.keys(gates)[0]] > 1 ? "s" : "") + " : " + liste(Object.keys(gates).map(function(id){ return nommer(id, gates[id]); })) + ", à jeter."]);
  // Le potager donne parfois des herbes fraîches
  for(var hp = 0; hp < (estSaison("hiver") ? 0 : G.ref.pot); hp++) if(hasard() < BAL.cuisine.herbesPotager){ ajouter("herbes", 1); n.push(["g2", icone("herbes") + " Des herbes fraîches ont poussé au potager."]); break; }
  var pe = G.ref.eau * REFUGE.eau.parJour, pn = G.ref.pot * REFUGE.pot.parJour;
  // Saisons : pluie d'automne, sécheresse d'été, potager endormi l'hiver et généreux au printemps
  if(estSaison("automne") && G.ref.eau) pe += 1;
  if(estSaison("ete")) pe = Math.max(0, pe - G.ref.eau * BAL.saisons.recupEte);
  if(estSaison("hiver")) pn = 0;
  if(estSaison("printemps")) pn *= 2;
  G.reste.eau += pe; G.reste.nour += pn;
  if(pe) n.push(["g2", ic("ref_eau", "🪣") + " Le récupérateur a recueilli " + pe + " ration" + (pe > 1 ? "s" : "") + " d’eau."]);
  if(pn) n.push(["g2", ic("ref_pot", "🥕") + " Le potager a donné " + pn + " ration" + (pn > 1 ? "s" : "") + " de nourriture."]);
  if(G.porteOuverte){ n.push(["b2", "🚪 La porte est restée ouverte toute la nuit (défense −" + BAL.porteOuverte.defense + "). Au matin, quelqu’un la referme enfin."]); G.porteOuverte = false; }
  nuitFolie(n);
  nuitMonde(n);
  var moral = 0;
  G.stock.o.concat(equipes()).forEach(function(o){ moral += OBJETS[o.id].moral || 0; });
  changerMoral(-BAL.moralPerteNuit + BAL.moralBonusObjet * moral + BAL.traits.optimiste * vivants().filter(function(x){ return x.trait === "optimiste"; }).length);
  if(estSaison("printemps")) changerMoral(1);
  G.day++; G.ads = 0; G.sel = []; G.nTirage = 0;
  if((G.day - 1) % BAL.saisons.duree === 0){ var Sn = saison(); n.push(["", Sn.ico + " " + Sn.annonce]); }
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
  if(typeof BONUS_CLAN_DEF !== "undefined") d += BONUS_CLAN_DEF; // tours de guet du bastion de son clan (classement.js)
  if(G.porteOuverte) d = Math.max(0, d - BAL.porteOuverte.defense); // la porte est restée ouverte
  return d;
}

/* ---------- Chapitres ---------- */
// Chapitre en cours (après la liste : « Tenir bon » de 10 en 10 jours, sans fin)
function chapitreCourant(){
  if(G.chap < CHAPITRES.length) return CHAPITRES[G.chap];
  if(!G.cibleTenir) G.cibleTenir = Math.ceil((G.day + 1) / TENIR_TOUS_LES) * TENIR_TOUS_LES;
  return { titre:"Tenir bon", objectif:"Survivre jusqu’au jour " + G.cibleTenir,
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
      n.push(["b2", "🏴 Des pillards ont fouillé " + leLieu(LIEUX[c].nom) + " cette nuit : il n’y reste plus que " + l.butin.length + " objet" + (l.butin.length > 1 ? "s" : "") + "."]);
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
      n.push(["g2", (radio ? "📻 La radio parle d’une cache abandonnée par des pillards " : "🏴 Des pillards en fuite ont abandonné une cache ") + (function(d){ return d.indexOf("le ") === 0 ? "au " + d.slice(3) : "à " + d; })(leLieu(LIEUX[ci].nom)) + " : " + nbc + " objets à prendre" + (K.danger ? ", mais ils rôdent encore autour quelques jours." : ".")]);
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
var FEMININS_LIEUX = ["Maison voisine", "Rue des pavillons", "Quincaillerie", "Station-service", "Zone industrielle", "Base militaire", "Caserne des pompiers", "Péniche du canal", "Clinique vétérinaire", "Forêt"];
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
  G.dd.push({ n:x.nom, r:roleDe(x), c:(FEMININS.indexOf(roleDe(x)) >= 0 ? "sacrifiée" : "sacrifié") + " pour que les autres survivent", j:G.day, ic:x.icone });
  rendreAuStock([x]);
  G.reste.nour += S.viande; changerMoral(S.moral);
  vivants().forEach(function(y){ y.folie = Math.min(100, (y.folie || 0) + R(S.folie[0], S.folie[1])); });
  G.stats.sacrifices = (G.stats.sacrifices || 0) + 1;
  return "Personne ne parlera jamais de cette nuit. Au matin, " + x.nom + " n’est plus là, et la famille a de quoi manger (+" + S.viande + " rations)… mais plus personne n’ose croiser le regard des autres. Moral " + S.moral + ".";
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
      n.push(["mort", x.nom + " a perdu la raison. Une nuit, " + (FEMININS.indexOf(roleDe(x)) >= 0 ? "elle" : "il") + " est sorti" + (FEMININS.indexOf(roleDe(x)) >= 0 ? "e" : "") + " sans un mot et n’est jamais revenu" + (FEMININS.indexOf(roleDe(x)) >= 0 ? "e" : "") + ".", roleDe(x)]);
      G.dd.push({ n:x.nom, r:roleDe(x), c:cause, j:G.day, ic:x.icone }); rendreAuStock([x]);
      return;
    }
    if(hasard() < x.folie / F.diviseur) acteFou(x, n);
  });
}
function acteFou(x, n){
  var autres = vivants().filter(function(y){ return y !== x; }), t = R(0, 4);
  if(t === 0 && autres.length){
    var y = autres[R(0, autres.length - 1)], dg = R(15, 30);
    n.push(["b2", "🌀 Pris de folie, " + x.nom + " frappe violemment " + y.nom + " (−" + dg + " PV)."]);
    blesser(y, dg, n, "tué par " + x.nom + (FEMININS.indexOf(roleDe(x)) >= 0 ? ", devenue folle" : ", devenu fou"));
  } else if(t === 1){
    vivants().forEach(function(y){ y.en = Math.max(0, y.en - 15); });
    n.push(["b2", "🌀 " + x.nom + " a hurlé toute la nuit : personne n’a dormi (−15 ⚡ chacun)."]);
  } else if(t === 2){
    var d2 = R(10, 25);
    var fx = FEMININS.indexOf(roleDe(x)) >= 0 ? "e" : "";
    n.push(["b2", "🌀 " + x.nom + " est sorti" + fx + " en pleine nuit… et revient au petit matin, couvert" + fx + " de griffures (−" + d2 + " PV)."]);
    blesser(x, d2, n, "mort dehors, seul dans la nuit");
  } else if(t === 3){
    var v = vivants(), z = v[R(0, v.length - 1)], d3 = R(10, 25), abime = G.ref.barr > 0;
    if(abime) G.ref.barr--;
    G.porteOuverte = true; // elle reste ouverte tant qu'on ne la referme pas (salon)
    n.push(["b2", "🌀 " + x.nom + " a laissé la porte grande ouverte : des zombies sont entrés ! " + z.nom + " est blessé" + (FEMININS.indexOf(roleDe(z)) >= 0 ? "e" : "") + " (−" + d3 + " PV)" + (abime ? ", la barricade est abîmée" : "") + "."]);
    blesser(z, d3, n, "tué pendant l’attaque de nuit");
  } else {
    var pr = prendreRations("nour", R(2, 4));
    n.push(["b2", "🌀 " + x.nom + " a mangé en cachette une partie des réserves" + (pr ? " (−" + pr + " rations)" : "") + "."]);
  }
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
  if(besoin && !possede(function(o){ return o === OBJETS[besoin]; })) return "Il faut " + nommer(besoin, 1);
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
  return x.nom + " fabrique " + nommer(rec.id, 1) + "." + (tt ? " " + tt : "");
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
  return x.nom + " répare " + nommer(o.id, 1) + " (solidité " + o.sol + " / " + max + ")." + (tt ? " " + tt : "");
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
  return x.nom + " démonte " + nommer(o.id, 1) + " et récupère " + nommerListe(recup) + "." + (tt ? " " + tt : "");
}

nouvellePartie();
