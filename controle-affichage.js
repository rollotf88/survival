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
  // 6) zone centrale qui déborde
  var st = document.querySelector(".stage"); if(st && st.scrollHeight > st.clientHeight + 1) pb.push("La zone centrale déborde de " + (st.scrollHeight - st.clientHeight) + " px");
  // 7) les boutons du bas ont la même largeur
  var larg = q("#app .acts .btn").filter(vis).map(function(b){ return Math.round(rect(b).width); });
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
  G.sel = [0]; render(); await att(150); res.selection = controleAffichage(); G.sel = []; render();
  // Combat avec 3 zombies (portraits peints) et 2 membres
  G.sel = [0, 1]; G.exp = { lieu:0, equipe:[0, 1], notes:[], mult:1, d:0, voiture:false }; G.sel = [];
  G.combat = { zombies:ZOMBIES.map(function(t){ return { id:t.id, nom:t.nom, icone:t.icone, pv:t.pv, pvMax:t.pv, degats:t.degats }; }), tour:1, journal:[], resume:[], fin:null };
  openCombat(); await att(100); res.combat = controleAffichage(); hide(); G.combat = null; G.exp = null;
  openInfo("def"); await att(50); res.infoDefense = controleAffichage(); openInfo("eau"); await att(50); res.infoEau = controleAffichage(); hide();
  q("[data-act=sel][data-id='1']").click(); await att(100); res.ficheOuSelection = controleAffichage(); hide(); G.sel = []; render(); await att(100);
  q("[data-act=fouille]").click(); await att(100); res.quiPart = controleAffichage(); hide();
  q("[data-act=refuge]").click(); await att(100); res.refuge = controleAffichage(); hide();
  openMenu(); await att(50); res.menu = controleAffichage(); q("[data-act=guide]").click(); await att(100); res.guide = controleAffichage(); hide();
  q(".chapcourt").click(); await att(100); res.chapitre = controleAffichage(); hide();
  Object.keys(localStorage).filter(function(k){ return k.indexOf("survival") === 0; }).forEach(function(k){ localStorage.removeItem(k); });
  var pb = {}; for(var k in res) if(res[k].length) pb[k] = res[k];
  return innerWidth + "x" + innerHeight + " : " + (Object.keys(pb).length ? JSON.stringify(pb) : "aucun problème");
}
