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
  if(typeof noterEvt === "function") noterEvt(k, n);
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
function openDefis(){ show('<h2>🎯 Défis</h2>' + contenuDefis(false) + contenuEvt() + '<div class="row"><button class="btn alt" data-act="menu">☰ Menu</button><button class="btn" data-act="close">Fermer</button></div>'); }
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  if(b.getAttribute("data-act") === "defis") openDefis();
});

/* ---------- Événement mondial : la grande horde du week-end (2026-11-11, idée validée par Fabien) ----------
   Vendredi 17 h → lundi 5 h (UTC, comme le serveur). Pendant la horde, HORDE_MONDIALE = true : les règles rendent
   les nuits et les combats plus durs (BAL.horde). Les zombies abattus pendant la horde comptent pour l'objectif commun
   (localStorage « survival_evt » = {id, z}, envoyé avec les chiffres du monde) ; objectif atteint = un colis pour chaque participant. */
var HORDE_MONDIALE = false, etatEvtServeur = null;
function idHorde(t){
  var d = new Date(t || Date.now()), j = d.getUTCDay(), h = d.getUTCHours();
  var dedans = (j === 5 && h >= 17) || j === 6 || j === 0 || (j === 1 && h < 5); if(!dedans) return "";
  var v = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - ((j + 2) % 7)));
  return "horde-" + v.toISOString().slice(0, 10);
}
// Fin de la horde en cours, ou début de la prochaine
function bornesHorde(){
  var n = new Date(), id = idHorde(n.getTime());
  if(id){ var v = new Date(id.slice(6) + "T17:00:00Z"); return { actif:true, fin:new Date(v.getTime() + (2 * 24 + 12) * 3600e3) }; }
  var d = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), 17)); while(d.getUTCDay() !== 5 || d <= n) d = new Date(d.getTime() + 24 * 3600e3);
  return { actif:false, debut:d };
}
function dureeAvant(t){ var mn = Math.max(0, Math.round((t - Date.now()) / 60000)), j = Math.floor(mn / 1440); return j >= 1 ? j + " j " + Math.floor(mn % 1440 / 60) + " h" : Math.floor(mn / 60) + " h " + String(mn % 60).padStart(2, "0"); }
function lireEvt(){ var id = idHorde(); var e; try{ e = JSON.parse(localStorage.getItem("survival_evt")) || {}; }catch(x){ e = {}; } if(e.id !== id) e = { id:id, z:0 }; return e; }
function majHorde(){
  var avant = HORDE_MONDIALE; HORDE_MONDIALE = !!idHorde();
  if(HORDE_MONDIALE && !avant && typeof fileSucces !== "undefined"){
    var cle = "survival_evt_vu"; var vu = ""; try{ vu = localStorage.getItem(cle) || ""; }catch(x){}
    if(vu !== idHorde()){ try{ localStorage.setItem(cle, idHorde()); }catch(x){} setTimeout(function(){ fileSucces.push({ icone:"🌍", titre:"La grande horde est là !", nom:"Tout le week-end : nuits et combats plus durs. Chaque zombie abattu compte pour l’objectif de tous les joueurs." }); if(typeof montrerSucces === "function") montrerSucces(); }, 5000); }
  }
}
majHorde(); setInterval(majHorde, 60000);
// Un zombie abattu pendant la horde (appelé par noterDefi)
function noterEvt(k, n){ if(k !== "zombies" || !HORDE_MONDIALE) return; var e = lireEvt(); e.z += n || 1; try{ localStorage.setItem("survival_evt", JSON.stringify(e)); }catch(x){} }
// Chiffres du serveur (lus avec ceux du monde) : objectif atteint → un colis, une seule fois par horde
function verifierEvt(d){
  if(!d || !d.evt) return; etatEvtServeur = d.evt;
  var e = lireEvt(); if(d.evt.id !== e.id || !(e.z > 0) || d.evt.total < d.evt.objectif) return;
  var cle = "survival_evt_recompense", deja = ""; try{ deja = localStorage.getItem(cle) || ""; }catch(x){}
  if(deja === d.evt.id) return;
  try{ localStorage.setItem(cle, d.evt.id); }catch(x){}
  gagnerColisDefi();
  if(typeof fileSucces !== "undefined"){ fileSucces.push({ icone:"🌍", titre:"Objectif mondial atteint !", nom:"Les survivants ont abattu " + d.evt.total + " zombies : un colis t’attend (menu ☰ → Inviter)." }); if(typeof montrerSucces === "function") montrerSucces(); }
}
function lireEvtServeur(){
  if(typeof adresseMonde !== "function" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || !HORDE_MONDIALE) return;
  fetch(adresseMonde()).then(function(r){ return r.json(); }).then(verifierEvt).catch(function(){});
}
setTimeout(lireEvtServeur, 9000); setInterval(lireEvtServeur, 5 * 60000);
function contenuEvt(){
  var B = bornesHorde(), e = lireEvt(), S = etatEvtServeur && etatEvtServeur.id === e.id ? etatEvtServeur : null;
  if(!B.actif) return '<p class="titre-butin">🌍 Événement mondial</p><div class="evt"><b>Grande horde du week-end</b><small>Prochaine horde dans ' + dureeAvant(B.debut.getTime()) + ' (vendredi soir → lundi matin).</small></div>';
  var h = '<p class="titre-butin">🌍 La grande horde · encore ' + dureeAvant(B.fin.getTime()) + '</p><div class="evt actif"><small>Nuits et combats plus durs pour tout le monde. Objectif commun : abattre des zombies.</small>';
  if(S) h += '<span class="tp-bar"><i style="width:' + Math.round(Math.min(1, S.total / S.objectif) * 100) + '%"></i></span><small><b>' + S.total + ' / ' + S.objectif + '</b> zombies abattus par ' + S.participants + ' survivant' + (S.participants > 1 ? "s" : "") + (S.total >= S.objectif ? " · ✅ objectif atteint !" : "") + '</small>';
  h += '<small>Ta part : <b>' + e.z + '</b> zombie' + (e.z > 1 ? "s" : "") + '. Objectif atteint = un colis pour chaque participant.</small></div>';
  return h;
}
