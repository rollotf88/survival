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
  // Armes : la plus forte d'abord (sinon l'ordre du stock décide)
  if(slot === "arme") d.sort(function(a, b){ var f = function(o){ var g = OBJETS[o.id].degats; return g ? g[0] + g[1] : 0; }; return f(b) - f(a); });
  if(d.length) equiper(i, slot, d[0].uid);
}
function disponibles(){ return G.m.map(function(x, i){ return i; }).filter(function(i){ return peutSortir(G.m[i]); }); }
// Lance une expédition ; s'il y a combat, le robot le joue jusqu'au bout
function partir(bot, i){
  var r = expedition(i), garde = 0;
  if(r.serrure){
    if(bot.crocheter()){
      var p = crocheteur().trait === "agile" ? BAL.crochetage.chanceRobotAgile : BAL.crochetage.chanceRobot;
      while(G.exp.serrure && !G.exp.serrure.fin && garde++ < 20) tentativeGoupille(Math.random() < p);
    } else forcerPorte();
    r = suiteExpedition(); garde = 0;
  }
  if(r.combat) while(!G.combat.fin && garde++ < 50) bot.combat();
  if(r.combat) r = avantFouille();
  // Mini-jeu de pêche : le robot réussit un lancer sur deux à trois
  if(r.peche){ while(G.exp.peche.faits < G.exp.peche.lancers) lancerPeche(Math.random() < BAL.peche.chanceRobot); finExpedition(); }
  // Rencontre en chemin : le robot prend le premier choix possible (le prudent), ou le meilleur s'il est « audacieux »
  var gr = 0;
  if(G.siphon) finirSiphon(hasard() < BAL.siphon.chanceRobot);
  while(G.rencontre && gr++ < 6){
    if(!G.rencontre.noeud && G.rencontre.texte){ finirRencontre(); break; }
    var cs = choixRencontre().filter(function(o){ return o.ok; });
    if(!cs.length){ finirRencontre(); break; }
    choisirRencontre((bot.audace && cs.length > 1 ? cs[1] : cs[0]).k);
  }
}
function lieuxPossibles(){ return LIEUX.map(function(L, i){ return i; }).filter(function(i){ return lieuOuvert(i) && (G.lieux[i].butin.length || LIEUX[i].peche && G.lieux[i].poissons > BAL.peche.seuil && pourEmplacement("outil").concat(equipes()).some(function(o){ return OBJETS[o.id].peche; }) || LIEUX[i].bois && MALIN.foret !== false && G.lieux[i].arbres > 0 && aHache() && compter("planche") < 6); }); }
function aHache(){ return pourEmplacement("arme").concat(equipes()).some(function(o){ return OBJETS[o.id].coupe; }); }

/* ---------- Robot « malin » : joue raisonnablement ---------- */
var MALIN = {
  nom: "Malin",
  canettes: true,
  reserveBois: 3,
  sac: ["bidon","riz","conserves","lampe","pile","hache","batte","couteau","pdb","outils","sacados","sacoche","couverture","trousse","antibio","biscuits","briquet","radio","peluche","photo","cartes"],
  matin: function(){
    G.m.forEach(function(x, i){ if(x.al && x.hp < 60) soigner(i); });
    ["eau","pot","barr"].forEach(function(k){ ameliorer(k); });
    if(G.ref.eau && G.ref.pot) ameliorer("barr");
    // Feu : allumé s'il reste assez de planches et un briquet (sinon les couvertures)
    if(MALIN.feu !== false) G.feu = compter("planche") >= MALIN.reserveBois && possede(function(o){ return o.allume; });
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
        var L = LIEUX[i], s = Math.min(resteLieu(i) - (L.peche ? BAL.peche.seuil : 0) - (L.bois && (!aHache() || MALIN.foret === false || compter("planche") >= 6) ? G.lieux[i].arbres : 0), 10) / (1 + 2 * dangerLieu(i)) / coutEnergie(i, LIEUX[i].voiture);
        if(G.mission && G.mission.lieu === i) s *= 3; // mission de secours
        if(L.sombre && !lampe) s *= 0.5; if(L.verrou && !(ouvrir && dispo.length > (L.sombre ? 1 : 0))) s *= 0.5;
        return s;
      };
      var cible = ls.sort(function(a, b){ return score(b) - score(a); })[0], L = LIEUX[cible];
      dispo.forEach(function(i, n){
        prendre(i, "arme"); prendre(i, "sac");
        if(L.sombre && n === 0) prendre(i, "outil", function(o){ return o.lumiere; });
        if(L.verrou && !G.m[i].eq.outil) prendre(i, "outil", function(o){ return o.ouvre; });
        if(L.peche) prendre(i, "outil", function(o){ return o.peche; });
        if(L.bois && n === 0 && MALIN.foret !== false){ if(!(G.m[i].eq.arme && OBJETS[G.m[i].eq.arme.id].coupe)){ desequiper(i, "arme"); prendre(i, "arme", function(o){ return o.coupe; }); if(!G.m[i].eq.arme) prendre(i, "arme"); } }
      });
      G.m.forEach(function(x, i){ if(x.al && !x.eq.arme) prendre(i, "arme"); });
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
    // Mission à livrer : on livre si ça ne vide pas nos soins
    if(MALIN.missions !== false && livraisonPossible() >= 0 && (mission().id !== "medicament" || soinsDispo() > 2)) livrerMission();
    VOITURE.pieces.forEach(function(p){ installerPiece(p); });
    while(voitureReparee() && G.voiture.essence <= VOITURE.reservoir - VOITURE.litresJerrican && fairePlein());
    // Dernier recours (seulement si MALIN.sacrifice) : le plus faible est sacrifié
    if(MALIN.sacrifice && sacrificePossible()){ var fv = vivants().sort(function(a, b){ return a.hp - b.hp; })[0]; sacrifier(G.m.indexOf(fv)); }
    // Cuisine : tant qu'il y a moins de 2 plats par personne et assez de planches pour le feu de cheminée
    if(MALIN.cuisine !== false){
      var gc = 0;
      while(gc++ < 6 && platsDispo().length < vivants().length * 2 && compter("planche") > MALIN.reserveBois + 2){
        var fait = false;
        for(var rc = 0; rc < RECETTES_CUISINE.length && !fait; rc++){
          var rcp = RECETTES_CUISINE[rc];
          if(rcp.ingredients.eau && rations("eau") < vivants().length * 4) continue; // l'eau d'abord pour boire
          if(rcp.id === "rizSaute" && platsDispo().length > 0) continue;
          fait = !!cuisiner(rc);
        }
        if(!fait) break;
      }
    }
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
      if(compter("cocktail") < 2 && fabriquer(R_("cocktail"))) continue; // cocktails Molotov (2026-11-12) : le robot en garde 2 d'avance
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
    if(t.indexOf("Cauchemars") >= 0) return rations("nour") > 10 ? 0 : 1;
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

/* ---------- Robot « moyen » (2026-11-10) : joue comme Malin, mais se trompe une fois sur quatre (il joue alors comme Naïf) ----------
   Sert à estimer un vrai joueur. MOYEN.erreur règle la part d'erreurs (0,25 par défaut). */
function choixMoyen(){ return Math.random() < MOYEN.erreur ? NAIF : MALIN; }
var MOYEN = {
  nom: "Moyen", erreur: 0.25,
  get sac(){ var t = MALIN.sac.slice(); for(var k = 0; k < 4; k++){ var i = R(0, t.length - 1), j = R(0, t.length - 1), x = t[i]; t[i] = t[j]; t[j] = x; } return t; }, // sac un peu moins bien ordonné
  matin: function(){ choixMoyen().matin(); },
  expeditions: function(){ choixMoyen().expeditions(); },
  soir: function(){ choixMoyen().soir(); },
  combat: function(){ (Math.random() < MOYEN.erreur / 2 ? NAIF : MALIN).combat(); }, // le bouton Auto la plupart du temps
  crocheter: function(){ return choixMoyen().crocheter(); },
  evenement: function(ev){ return choixMoyen().evenement(ev); }
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
