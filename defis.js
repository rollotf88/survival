/* =====================================================================
   defis.js : défis du jour et de la semaine (2026-11-11, idée validée par Fabien)
   Chaque jour (vrai jour), 3 défis tirés de la même façon pour tous les joueurs (date) ; chaque semaine, un grand défi.
   Ils avancent dans n'importe quelle partie (les règles appellent noterDefi : zombies, fouilles, plats, poissons,
   planches, crochetages, travaux, nuits). Récompense : les 3 défis du jour = 1 colis ; le défi de la semaine = 1 colis
   (les colis du parrainage : un largage avec un bonus au choix du hasard, utilisable dans une partie).
   Gardé dans localStorage « survival_defis ». Chargé après succes.js. La simulation ne le charge pas.
   ===================================================================== */
var DEFIS_JOUR = [
  { id:"zombies", k:"zombies", n:8,  txt:"Abats 8 zombies", ico:"🧟" },
  { id:"fouilles", k:"fouilles", n:4, txt:"Fouille 4 lieux", ico:"🔍" },
  { id:"plats", k:"plats", n:2, txt:"Cuisine 2 plats", ico:"🍲" },
  { id:"poissons", k:"poissons", n:3, txt:"Pêche 3 poissons", ico:"🎣" },
  { id:"bois", k:"bois", n:4, txt:"Coupe 4 planches en forêt", ico:"🪓" },
  { id:"crochetage", k:"crochetages", n:1, txt:"Crochète une serrure", ico:"🗝️" },
  { id:"travaux", k:"travaux", n:3, txt:"Fais 3 travaux à l’atelier", ico:"🔨" },
  { id:"nuits", k:"nuits", n:3, txt:"Tiens 3 nuits", ico:"🌙" },
  { id:"zombies15", k:"zombies", n:15, txt:"Abats 15 zombies", ico:"⚔️" }
];
var DEFIS_SEMAINE = [
  { id:"s-zombies", k:"zombies", n:60, txt:"Abats 60 zombies cette semaine", ico:"💀" },
  { id:"s-nuits", k:"nuits", n:20, txt:"Tiens 20 nuits cette semaine", ico:"🌙" },
  { id:"s-fouilles", k:"fouilles", n:30, txt:"Fouille 30 lieux cette semaine", ico:"🗺️" },
  { id:"s-travaux", k:"travaux", n:15, txt:"Fais 15 travaux à l’atelier cette semaine", ico:"🔨" }
];
function cleJour(d){ d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
// Semaine : le lundi de la semaine
function cleSemaine(d){ d = new Date(d || new Date()); var j = (d.getDay() + 6) % 7; d.setDate(d.getDate() - j); return cleJour(d); }
function hacheDefi(t){ var h = 2166136261; for(var i = 0; i < t.length; i++){ h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
// Les 3 défis du jour : tirés par la date (les mêmes pour tout le monde), sans doublon de compteur
function defisDuJour(){
  var j = cleJour(), liste = DEFIS_JOUR.slice(), choisis = [], ks = {}, k = 0;
  while(choisis.length < 3 && k < 50){ var i = hacheDefi(j + "|" + k++) % liste.length, D = liste[i]; if(!ks[D.k]){ ks[D.k] = true; choisis.push(D); } liste.splice(i, 1); if(!liste.length) break; }
  return choisis;
}
function defiSemaine(){ return DEFIS_SEMAINE[hacheDefi(cleSemaine()) % DEFIS_SEMAINE.length]; }
function lireDefis(){
  var d; try{ d = JSON.parse(localStorage.getItem("survival_defis")) || {}; }catch(e){ d = {}; }
  if(d.jour !== cleJour()){ d.jour = cleJour(); d.prog = {}; d.faits = {}; d.colisJour = false; }
  if(d.semaine !== cleSemaine()){ d.semaine = cleSemaine(); d.progS = {}; d.faitS = false; }
  d.prog = d.prog || {}; d.faits = d.faits || {}; d.progS = d.progS || {};
  return d;
}
function ecrireDefis(d){ try{ localStorage.setItem("survival_defis", JSON.stringify(d)); }catch(e){} }
// Appelé par les règles (logique.js) : un compteur avance
function noterDefi(k, n){
  if(typeof G === "undefined" || !G || G.bacASable) return; // pas pendant un raid de clan simulé / partie temporaire
  var d = lireDefis(), bandeaux = [];
  d.prog[k] = (d.prog[k] || 0) + (n || 1); d.progS[k] = (d.progS[k] || 0) + (n || 1);
  defisDuJour().forEach(function(D){ if(!d.faits[D.id] && (d.prog[D.k] || 0) >= D.n){ d.faits[D.id] = true; bandeaux.push({ icone:"🎯", titre:"Défi réussi !", nom:D.txt }); } });
  if(!d.colisJour && defisDuJour().every(function(D){ return d.faits[D.id]; })){ d.colisJour = true; gagnerColisDefi(); bandeaux.push({ icone:"🪂", titre:"Les 3 défis du jour !", nom:"Un colis t’attend (menu ☰ → Inviter)." }); }
  var S = defiSemaine();
  if(!d.faitS && (d.progS[S.k] || 0) >= S.n){ d.faitS = true; gagnerColisDefi(); bandeaux.push({ icone:"🏆", titre:"Défi de la semaine réussi !", nom:S.txt + " : un colis t’attend." }); }
  ecrireDefis(d);
  if(bandeaux.length && typeof fileSucces !== "undefined"){ bandeaux.forEach(function(b){ fileSucces.push(b); }); if(typeof montrerSucces === "function") montrerSucces(); }
}
function gagnerColisDefi(){ if(typeof lireColis === "function") ecrireColis(lireColis() + 1); }
function tempsAvantDemain(){ var n = new Date(), m = new Date(n); m.setHours(24, 0, 0, 0); var mn = Math.round((m - n) / 60000); return Math.floor(mn / 60) + " h " + String(mn % 60).padStart(2, "0"); }
function ligneDefi(D, v, fait){
  var p = Math.min(1, v / D.n);
  return '<div class="defi' + (fait ? " fait" : "") + '"><span class="defi-ico">' + (fait ? "✅" : D.ico) + '</span><span class="defi-txt"><b>' + D.txt + '</b><span class="tp-bar"><i style="width:' + Math.round(p * 100) + '%"></i></span></span><small>' + Math.min(v, D.n) + ' / ' + D.n + '</small></div>';
}
function contenuDefis(court){
  var d = lireDefis(), J = defisDuJour(), S = defiSemaine(), nf = J.filter(function(D){ return d.faits[D.id]; }).length;
  var h = '<p class="titre-butin">🎯 Défis du jour · ' + nf + ' / 3</p>' + J.map(function(D){ return ligneDefi(D, d.prog[D.k] || 0, d.faits[D.id]); }).join("");
  h += '<p class="sub">' + (d.colisJour ? "🪂 Colis du jour gagné !" : "Les 3 réussis = 1 colis. ") + (court ? "" : " Nouveaux défis dans " + tempsAvantDemain() + ".") + '</p>';
  h += '<p class="titre-butin">🏆 Défi de la semaine</p>' + ligneDefi(S, d.progS[S.k] || 0, d.faitS);
  if(!court) h += '<p class="sub">' + (d.faitS ? "🪂 Colis de la semaine gagné !" : "Réussi = 1 colis.") + ' Les défis avancent dans toutes tes parties, et sont les mêmes pour tous les joueurs.</p>';
  return h;
}
function openDefis(){ show('<h2>🎯 Défis</h2>' + contenuDefis(false) + '<div class="row"><button class="btn alt" data-act="menu">☰ Menu</button><button class="btn" data-act="close">Fermer</button></div>'); }
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  if(b.getAttribute("data-act") === "defis") openDefis();
});
