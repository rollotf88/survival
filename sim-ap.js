/* =====================================================================
   SIMULATION DE L'AVANT-POSTE (2026-11-15, pas publié) : à charger après sim.js dans le navigateur de test.
   L'avant-poste vit en temps RÉEL (chantiers de 10 min à 24 h, production par jour réel) : on suppose que le joueur
   fait JPR jours de jeu par jour réel (≈ 15 pour un joueur qui joue une heure par jour, ≈ 5 pour un joueur tranquille).
   Les chiffres viennent de avantposte.js (copiés ici, car la simulation ne charge pas ce fichier).
   simAP(MALIN, 300, 15) → résultats du robot avec l'avant-poste, à comparer avec simuler(MALIN, 300, 200).
   ===================================================================== */
var SIMAP = {
  jour: 50, libres: 6, mult: [1, 1.5, 2, 3, 4], heures: [10 / 60, 1, 4, 12, 24],
  attaque: { toutes: 8, chance: 0.3, base: 3, pertes: 0.35 },
  bat: {
    citerne:{ cout:{ planche:3, ferraille:1 }, prod:{ eau:[2, 3, 4, 6, 8] } },
    serre:{ cout:{ planche:3, chiffon:1 }, prod:{ nour:[2, 3, 4, 6, 8] } },
    scierie:{ cout:{ planche:2, clous:1 }, prod:{ planche:[1, 2, 3, 4, 6] } },
    palissade:{ cout:{ planche:4, clous:1 }, def:[3, 5, 8, 11, 15] },
    entrepot:{ cout:{ planche:5, clous:2 }, cap:[20, 30, 40, 55, 70] },
    infirmerie:{ cout:{ planche:3, chiffon:2 }, prod:{ bandage:[0.5, 1, 1.5, 2, 3] } },
    forge:{ cout:{ ferraille:3, planche:2 }, prod:{ clous:[1, 1, 2, 2, 3], ferraille:[0.5, 1, 1, 1.5, 2] } },
    tour:{ cout:{ planche:5, clous:2 }, def:[2, 3, 4, 6, 8] },
    pieges:{ cout:{ ferraille:2, clous:2 }, def:[2, 4, 6, 8, 10] }
  },
  // Ce que le robot construit, dans l'ordre (bâtiment, niveau visé)
  plan: [["citerne",1],["serre",1],["scierie",1],["citerne",2],["serre",2],["palissade",1],["forge",1],["entrepot",1],["citerne",3],["serre",3],["scierie",2],
         ["infirmerie",1],["palissade",2],["citerne",4],["serre",4],["entrepot",2],["tour",1],["pieges",1],["citerne",5],["serre",5],["scierie",3],["palissade",3],["entrepot",3]]
};
function apSimInit(){ G.apSim = { niv:{}, chantier:null, acc:{}, h:0, attH:0, recolte:{} }; }
function apSimNiv(b){ return G.apSim.niv[b] || 0; }
function apSimDef(){ var d = 0; ["palissade", "tour", "pieges"].forEach(function(b){ var n = apSimNiv(b); if(n) d += SIMAP.bat[b].def[n - 1]; }); return d; }
function apSimCap(){ var n = apSimNiv("entrepot"); return n ? SIMAP.bat.entrepot.cap[n - 1] : 10; }
function apSimTotal(){ var t = 0; for(var b in G.apSim.niv) t += G.apSim.niv[b]; return t; }
// Une journée de jeu = 24 / JPR heures réelles
function apSimJour(jpr, reserve){
  if(G.day < SIMAP.jour) return;
  if(!G.apSim) apSimInit();
  var A = G.apSim, h = 24 / jpr;
  // chantier
  if(A.chantier){ A.chantier.reste -= h; if(A.chantier.reste <= 0){ A.niv[A.chantier.b] = A.chantier.n; A.chantier = null; } }
  // production (plafonnée par l'entrepôt)
  for(var b in A.niv){ var B = SIMAP.bat[b]; if(!B.prod) continue;
    for(var r in B.prod){ A.acc[r] = Math.min(apSimCap(), (A.acc[r] || 0) + B.prod[r][A.niv[b] - 1] * h / 24); } }
  // attaques toutes les 8 h réelles
  A.attH += h;
  while(A.attH >= SIMAP.attaque.toutes){ A.attH -= SIMAP.attaque.toutes;
    if(Math.random() < SIMAP.attaque.chance){ var force = SIMAP.attaque.base + Math.floor(apSimTotal() / 2) + Math.floor(Math.random() * 4);
      if(apSimDef() < force) for(var r2 in A.acc) A.acc[r2] *= 1 - SIMAP.attaque.pertes; } }
  // récolte chaque jour (comme un joueur qui passe par l'avant-poste)
  for(var r3 in A.acc){ var v = Math.floor(A.acc[r3]); if(v < 1) continue; A.acc[r3] -= v; A.recolte[r3] = (A.recolte[r3] || 0) + v;
    if(r3 === "eau" || r3 === "nour") G.reste[r3] += v; else ajouter(r3, v); }
  // nouveau chantier : le prochain du plan si on a les matériaux (en gardant de quoi faire le feu et réparer la barricade)
  if(!A.chantier){
    var places = SIMAP.libres + 2 * apSimNiv("palissade"), bats = Object.keys(A.niv).length;
    for(var i = 0; i < SIMAP.plan.length; i++){ var b2 = SIMAP.plan[i][0], n = SIMAP.plan[i][1];
      if(apSimNiv(b2) >= n) continue;
      if(apSimNiv(b2) !== n - 1) break;
      if(!apSimNiv(b2) && bats >= places) break;
      var c = SIMAP.bat[b2].cout, ok = true, cout = {};
      for(var k in c){ cout[k] = Math.ceil(c[k] * SIMAP.mult[n - 1]); if(compter(k) - cout[k] < (k === "planche" ? reserve : 0)) ok = false; }
      if(ok){ for(var k2 in cout) consommer(k2, cout[k2]); A.chantier = { b:b2, n:n, reste:SIMAP.heures[n - 1] }; }
      break;
    }
  }
}
function robotAP(bot, jpr, reserve){
  return Object.assign({}, bot, { nom: bot.nom + " + avant-poste (" + jpr + " j/jour réel)", soir: function(){ bot.soir(); apSimJour(jpr, reserve == null ? 6 : reserve); } });
}
function simAP(bot, n, jpr){ return simuler(robotAP(bot, jpr), n, 300); }
