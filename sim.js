/* =====================================================================
   sim.js : simulation d'équilibrage. Des « robots » jouent des centaines
   de parties avec les vraies règles (data.js + logique.js) et on regarde
   combien de jours ils tiennent et de quoi ils meurent.
   Ouvrir simulation.html (double-clic) pour lancer.
   ===================================================================== */

/* La fonction graine() est dans logique.js. */

/* ---------- Outils communs aux robots ---------- */
function remplirSac(priorites){
  var H = MAISONS[G.h];
  priorites.forEach(function(k){
    if(!H.objets[k]) return;
    while((G.pack[k] || 0) < H.objets[k] && capSac() - placesUtilisees() >= OBJETS[k].place) G.pack[k] = (G.pack[k] || 0) + 1;
  });
}
function toutRanger(){ G.m.forEach(function(x, i){ EMPLACEMENTS.forEach(function(e){ desequiper(i, e[0]); }); }); }
function prendre(i, slot, test){
  var d = pourEmplacement(slot).filter(function(o){ return !test || test(OBJETS[o.id]); });
  if(d.length) equiper(i, slot, d[0].uid);
}
function disponibles(){ return G.m.map(function(x, i){ return i; }).filter(function(i){ return peutSortir(G.m[i]); }); }
// Lance une expédition ; s'il y a combat, le robot le joue jusqu'au bout
function partir(bot, i){
  var r = expedition(i), garde = 0;
  if(r.serrure){
    if(bot.crocheter()){
      var p = crocheteur().nom === "Emma" ? BAL.crochetage.chanceRobotEmma : BAL.crochetage.chanceRobot;
      while(G.exp.serrure && !G.exp.serrure.fin && garde++ < 20) tentativeGoupille(Math.random() < p);
    } else forcerPorte();
    r = suiteExpedition(); garde = 0;
  }
  if(r.combat) while(!G.combat.fin && garde++ < 50) bot.combat();
  if(r.combat) finExpedition();
}
function lieuxPossibles(){ return LIEUX.map(function(L, i){ return i; }).filter(function(i){ return lieuOuvert(i) && (G.lieux[i].butin.length || LIEUX[i].peche && G.lieux[i].poissons > BAL.peche.seuil && pourEmplacement("outil").concat(equipes()).some(function(o){ return OBJETS[o.id].peche; })); }); }

/* ---------- Robot « malin » : joue raisonnablement ---------- */
var MALIN = {
  nom: "Malin",
  canettes: true,
  sac: ["bidon","riz","conserves","lampe","pile","hache","batte","couteau","pdb","outils","sacados","sacoche","couverture","trousse","antibio","biscuits","briquet","radio","peluche","photo","cartes"],
  matin: function(){
    G.m.forEach(function(x, i){ if(x.al && x.hp < 60) soigner(i); });
    ["eau","pot","barr"].forEach(function(k){ ameliorer(k); });
    if(G.ref.eau && G.ref.pot) ameliorer("barr");
  },
  expeditions: function(){
    for(var tour = 0; tour < 8; tour++){
      // Les plus en forme partent (énergie puis santé)
      var dispo = disponibles().filter(function(i){ return G.m[i].hp > 40; })
        .sort(function(a, b){ return G.m[b].en - G.m[a].en || G.m[b].hp - G.m[a].hp; }).slice(0, BAL.membresParExpedition);
      // Plus personne ne peut sortir : une canette pour celui à qui il manque peu
      if(!dispo.length && lieuxPossibles().length && MALIN.canettes){
        var b = G.m.map(function(x, i){ return i; }).filter(function(i){ var x = G.m[i]; return peutBoire(x) && x.hp > 40 && x.en + BAL.canetteEnergie >= coutMin(); })
          .sort(function(a, b){ return G.m[b].en - G.m[a].en; })[0];
        if(b !== undefined){ boire(b); tour--; continue; }
      }
      var team = dispo.map(function(i){ return G.m[i]; });
      var ls = lieuxPossibles().filter(function(i){ return equipePeutAller(team, i); });
      if(!dispo.length || !ls.length) return;
      // Équiper : l'équipe d'abord (lampe, outil pour ouvrir, armes, sacs), le reste pour la nuit
      toutRanger();
      var lampe = pourEmplacement("outil").some(function(o){ return OBJETS[o.id].lumiere === 2; }) && compter("pile") > 0;
      var ouvrir = pourEmplacement("outil").some(function(o){ return OBJETS[o.id].ouvre; });
      var score = function(i){
        var L = LIEUX[i], s = Math.min(resteLieu(i) - (L.peche ? BAL.peche.seuil : 0), 10) / (1 + 2 * dangerLieu(i)) / coutEnergie(i, LIEUX[i].voiture);
        if(L.sombre && !lampe) s *= 0.5; if(L.verrou && !(ouvrir && dispo.length > (L.sombre ? 1 : 0))) s *= 0.5;
        return s;
      };
      var cible = ls.sort(function(a, b){ return score(b) - score(a); })[0], L = LIEUX[cible];
      dispo.forEach(function(i, n){
        prendre(i, "arme"); prendre(i, "sac");
        if(L.sombre && n === 0) prendre(i, "outil", function(o){ return o.lumiere; });
        if(L.verrou && !G.m[i].eq.outil) prendre(i, "outil", function(o){ return o.ouvre; });
        if(L.peche) prendre(i, "outil", function(o){ return o.peche; });
      });
      G.m.forEach(function(x, i){ if(x.al) prendre(i, "arme"); });
      G.sel = dispo;
      partir(MALIN, cible);
      if(!vivants().length) return;
    }
  },
  soir: function(){
    var R_ = function(id){ return RECETTES.findIndex(function(r){ return r.id === id; }); };
    // Marché : prend l'eau ou la nourriture si on en manque, et les pièces de voiture / l'essence
    if(marcheOuvert()) G.marche.offres.forEach(function(o, k){
      var d = OBJETS[o.recoit.id], utile = (d.cat === "eau" && rations("eau") < 12) || (d.cat === "nour" && rations("nour") < 12) || d.piece && !G.voiture.installees[o.recoit.id] || o.recoit.id === "jerrican";
      var donneVital = OBJETS[o.donne.id].cat === "eau" || OBJETS[o.donne.id].cat === "nour";
      if(utile && !donneVital) echanger(k);
    });
    VOITURE.pieces.forEach(function(p){ installerPiece(p); });
    while(voitureReparee() && G.voiture.essence <= VOITURE.reservoir - VOITURE.litresJerrican && fairePlein());
    var essais = 0;
    while(artisan() && essais++ < 20){
      var abime = armesAbimees().filter(function(o){ return o.sol < OBJETS[o.id].sol / 2; })[0];
      if(abime && reparer(abime.uid)) continue;
      var sansArme = vivants().some(function(x){ return !x.eq.arme; }) && !pourEmplacement("arme").length;
      if(sansArme && (fabriquer(R_("gourdin")) || fabriquer(R_("lance")))) continue;
      if(fabriquer(R_("bache")) || fabriquer(R_("collet"))) continue;
      if(MALIN.peche !== false && !possede(function(o){ return o.peche; }) && fabriquer(R_("canne"))) continue;
      if(compter("piege") < 2 && fabriquer(R_("piege"))) continue;
      if(soinsDispo() < 4 && (fabriquer(R_("trousse")) || fabriquer(R_("bandage")))) continue;
      var lumiere = possede(function(o){ return o.lumiere; });
      if(!lumiere && fabriquer(R_("torche"))) continue;
      break;
    }
  },
  combat: function(){ tourAuto(); },
  crocheter: function(){ return compter("epingle") >= 2; },
  evenement: function(ev){
    var t = ev.titre, nb = vivants().length;
    if(t.indexOf("blessé") >= 0) return soinsDispo() > 2 ? 0 : 1;
    if(t.indexOf("marchand") >= 0) return rations("nour") > 6 + 4 * nb && soinsDispo() < 3 ? 0 : 1;
    if(t.indexOf("Emma") >= 0) return rations("nour") > 10 ? 0 : 1;
    if(t.indexOf("Voisins") >= 0) return rations("eau") > 12 ? 0 : 1;
    if(t.indexOf("poule") >= 0) return MALIN.poules !== false && rations("eau") > 12 ? 1 : 2;
    return 0;
  }
};

/* ---------- Robot « naïf » : joue au hasard ---------- */
var NAIF = {
  nom: "Naïf",
  sac: null, // au hasard
  matin: function(){ for(var k in REFUGE) if(Math.random() < 0.5) ameliorer(k); },
  expeditions: function(){
    for(var tour = R(1, 4); tour > 0; tour--){
      var dispo = disponibles(); if(!dispo.length) return;
      G.sel = melanger(dispo).slice(0, R(1, BAL.membresParExpedition));
      var team = G.sel.map(function(j){ return G.m[j]; });
      var ls = lieuxPossibles().filter(function(i){ return equipePeutAller(team, i); });
      if(!ls.length){ G.sel = []; return; }
      partir(NAIF, ls[R(0, ls.length - 1)]);
      if(!vivants().length) return;
    }
  },
  soir: function(){ if(marcheOuvert()) G.marche.offres.forEach(function(o, k){ if(Math.random() < 0.3) echanger(k); }); VOITURE.pieces.forEach(function(p){ if(Math.random() < 0.3) installerPiece(p); }); if(Math.random() < 0.3) fairePlein(); RECETTES.forEach(function(r, i){ if(Math.random() < 0.3) fabriquer(i); }); G.m.forEach(function(x, i){ if(Math.random() < 0.2) boire(i); }); },
  combat: function(){
    if(Math.random() < 0.15){ fuir(); return; }
    var ch = {}, zs = G.combat.zombies;
    equipeCombat().forEach(function(x){ ch[G.m.indexOf(x)] = Math.random() < 0.2 ? { a:"proteger" } : { a:"frapper", cible:R(0, zs.length - 1) }; });
    jouerTour(ch);
  },
  crocheter: function(){ return Math.random() < 0.5; },
  evenement: function(ev){ return R(0, ev.choix.length - 1); }
};

/* ---------- Une partie complète ---------- */
function jouer(bot, seed, maxJours){
  Math.random = graine(seed);
  nouvellePartie();
  remplirSac(bot.sac || melanger(Object.keys(MAISONS[G.h].objets)));
  demarrer();
  var stats = { jourToutVide:null, joursPersonnes:0 };
  while(vivants().length && G.day <= maxJours){
    bot.matin();
    if(!vivants().length) break;
    var avant = G.lieux.filter(function(l){ return !l.butin.length; }).length;
    bot.expeditions();
    if(!vivants().length) break;
    if(stats.jourToutVide === null && LIEUX.every(function(L, i){ return lieuOuvert(i) && !G.lieux[i].butin.length; })) stats.jourToutVide = G.day;
    bot.soir();
    verifierChapitre(); G.annonces = [];
    finJour();
    var ev = vivants().length && evenementDuMatin();
    if(ev) ev.choix[bot.evenement(ev)][1]();
  }
  stats.jours = G.day - 1;
  stats.joursPersonnes = G.score;
  stats.jourPremiereMort = G.dd.length ? G.dd[0].j : null;
  stats.causes = G.dd.map(function(d){ return d.c; });
  stats.survivant = vivants().length > 0;
  return stats;
}

/* ---------- Plusieurs parties + résumé ---------- */
function centile(t, p){ return t[Math.min(t.length - 1, Math.floor(p * t.length))]; }
function simuler(bot, n, maxJours){
  var jours = [], causes = {}, toutVide = [], survivants = 0, morts1 = [], jp = [];
  var vraiHasard = Math.random;
  for(var s = 1; s <= n; s++){
    var r = jouer(bot, s * 7919, maxJours);
    jours.push(r.jours); jp.push(r.joursPersonnes); if(r.survivant) survivants++;
    r.causes.forEach(function(c){ causes[c] = (causes[c] || 0) + 1; });
    if(r.jourToutVide !== null) toutVide.push(r.jourToutVide);
    if(r.jourPremiereMort !== null) morts1.push(r.jourPremiereMort);
  }
  Math.random = vraiHasard;
  jours.sort(function(a, b){ return a - b; });
  var moy = jours.reduce(function(a, b){ return a + b; }, 0) / n;
  return { bot:bot.nom, parties:n, min:jours[0], p10:centile(jours, .1), mediane:centile(jours, .5), p90:centile(jours, .9), max:jours[n - 1],
           moyenne:Math.round(moy * 10) / 10, encoreEnVie:survivants, causes:causes,
           joursPersonnes: centile(jp.sort(function(a, b){ return a - b; }), .5), scoreP10: centile(jp, .1), scoreP90: centile(jp, .9), scoreMax: jp[n - 1],
           jourPremiereMort: morts1.length ? centile(morts1.sort(function(a, b){ return a - b; }), .5) : "jamais",
           jourToutVide: toutVide.length ? centile(toutVide.sort(function(a, b){ return a - b; }), .5) : "jamais" };
}
