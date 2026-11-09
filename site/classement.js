/* =====================================================================
   classement.js : classement général en ligne (le meilleur score de
   chaque joueur, toutes parties confondues).
   Le serveur est une petite fonction Netlify (netlify/functions/classement.mjs).
   Sans connexion (ou sur une page qui bloque internet), on l'explique
   simplement et le jeu continue normalement.
   ===================================================================== */
var SITE_JEU = "https://survival-refuge.rollotf88.workers.dev";
function adresseClassement(){ return (/(netlify\.app|workers\.dev|pages\.dev)$/.test(location.hostname) ? "" : SITE_JEU) + "/api/classement"; }
var MSG_HORS_LIGNE = "Impossible de joindre le classement (pas de connexion, ou cette page bloque internet). Il marche dans le jeu installé : " + SITE_JEU.replace("https://", "");

// Identifiant de l'appareil (au hasard, pour garder un seul score par joueur) et pseudo
function idAppareil(){
  var id = null;
  try{ id = localStorage.getItem("survival_id"); }catch(e){}
  if(!id){ id = ""; for(var k = 0; k < 16; k++) id += "abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 36)); try{ localStorage.setItem("survival_id", id); }catch(e){} }
  return id;
}
function lirePseudo(){ try{ return localStorage.getItem("survival_pseudo") || ""; }catch(e){ return ""; } }
function echapper(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]; }); }
function eme(n){ return n + (n === 1 ? "er" : "e"); }

var dernierEnvoi = null; // { score, jours } de la partie qui vient de finir
function openEnvoiScore(){
  var p = lirePseudo();
  show('<h2>🏆 Classement général</h2><p>Ton score (<b>' + dernierEnvoi.score + '</b>) sera comparé à ceux de tous les joueurs. Seul ton meilleur score est gardé.</p>'
    + '<p class="sub">Choisis un pseudo (pas ton vrai nom) :</p><input id="pseudo" class="champ" maxlength="16" autocomplete="off" value="' + echapper(p) + '" placeholder="Ex. : Renard du quartier">'
    + '<p id="msgcl" class="sub"></p><div class="row"><button class="btn" data-act="envoyerscore">Envoyer</button><button class="btn alt" data-act="close">Annuler</button></div>');
  setTimeout(function(){ var c = $("pseudo"); if(c) c.focus(); }, 50);
}
function envoyerScore(){
  var pseudo = ($("pseudo").value || "").trim().slice(0, 16);
  if(!pseudo){ $("msgcl").textContent = "Il faut un pseudo."; return; }
  try{ localStorage.setItem("survival_pseudo", pseudo); }catch(e){}
  $("msgcl").textContent = "Envoi…";
  fetch(adresseClassement(), { method:"POST", headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ id:idAppareil(), pseudo:pseudo, score:dernierEnvoi.score, jours:dernierEnvoi.jours }) })
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(!d.ok){ $("msgcl").textContent = "Score refusé par le serveur."; return; }
      var place = d.rang ? "tu es " + eme(d.rang) + " sur " + d.total : "tu n’es pas encore dans les " + d.total + " premiers";
      openClassement(d.record ? "Nouveau meilleur score enregistré : " + place + " !" : "Ton meilleur score reste " + d.meilleur + " points : " + place + ".");
    })
    .catch(function(){ $("msgcl").textContent = MSG_HORS_LIGNE; });
}
// Partie classée terminée : envoi automatique (le pseudo a été choisi au départ)
function envoyerScoreAuto(){
  var el = function(){ return $("envoiauto"); };
  fetch(adresseClassement(), { method:"POST", headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ id:idAppareil(), pseudo:lirePseudo(), score:dernierEnvoi.score, jours:dernierEnvoi.jours }) })
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(!el()) return;
      if(!d.ok){ el().textContent = "Score refusé par le serveur."; return; }
      var place = d.rang ? "tu es " + eme(d.rang) + " sur " + d.total : "hors des " + d.total + " premiers";
      el().textContent = "🏆 " + (d.record ? "Score envoyé : " + place + " !" : "Ton meilleur score reste " + d.meilleur + " (" + place + ").");
    })
    .catch(function(){ if(el()) el().textContent = MSG_HORS_LIGNE; });
}
function openClassement(message){
  show('<h2>🏆 Classement général</h2>' + (message ? '<p class="g2 msg">' + message + '</p>' : '') + '<p class="sub" id="listecl">Chargement…</p>' + BTN_FERMER());
  fetch(adresseClassement() + "?id=" + idAppareil()).then(function(r){ return r.json(); }).then(function(d){
    var el = $("listecl"); if(!el) return;
    if(!d.scores || !d.scores.length){ el.textContent = "Personne n’a encore envoyé de score. Sois le premier !"; return; }
    var h = '<ol class="classement">' + d.scores.map(function(e, k){
      return '<li class="' + (e.moi ? "moi" : "") + '"><span class="rang">' + (k < 3 ? ["🥇","🥈","🥉"][k] : (k + 1) + ".") + '</span><b>' + echapper(e.pseudo) + '</b><span class="pts">⭐ ' + e.score + ' · ' + e.jours + ' j</span></li>';
    }).join("") + '</ol>';
    // Hors des 50 premiers : on montre quand même sa place
    if(d.moi && d.monRang > d.scores.length) h += '<ol class="classement"><li class="moi"><span class="rang">' + d.monRang + '.</span><b>' + echapper(d.moi.pseudo) + '</b><span class="pts">⭐ ' + d.moi.score + ' · ' + d.moi.jours + ' j</span></li></ol>';
    h += '<p class="sub">' + d.total + ' joueur' + (d.total > 1 ? "s" : "") + ' · ⭐ = meilleur score (1 point par jour et par survivant)</p>';
    el.outerHTML = h;
  }).catch(function(){ var el = $("listecl"); if(el) el.textContent = MSG_HORS_LIGNE; });
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act");
  if(a === "envoiscore") openEnvoiScore();
  else if(a === "envoyerscore") envoyerScore();
  else if(a === "classement") openClassement();
  else if(a === "stats"){ ongletStats = b.getAttribute("data-id") || ongletStats; openStats(); }
});

/* ---------- Fenêtre « 📊 Mes stats » (menu ☰) ---------- */
var ongletStats = null;
function openStats(){
  var g = partieEnJeu();
  if(!ongletStats || (ongletStats === "partie" && !g)) ongletStats = g ? "partie" : "toutes";
  var T = function(icone, valeur, nom, cls){ return '<div class="tuile st ' + (cls || "") + '"><span class="st-ico">' + icone + '</span><b>' + valeur + '</b><small>' + nom + '</small></div>'; };
  var pl = function(n, mot){ return n > 1 ? mot + "s" : mot; };
  var h = '<h2>📊 Mes stats</h2><div class="tabs onglets">'
    + (g ? '<button class="tab' + (ongletStats === "partie" ? " on" : "") + '" data-act="stats" data-id="partie">Cette partie<small>Jour ' + G.day + '</small></button>' : '')
    + '<button class="tab' + (ongletStats === "toutes" ? " on" : "") + '" data-act="stats" data-id="toutes">Toutes tes parties<small>Depuis le début</small></button></div>';
  if(ongletStats === "partie"){
    var S = G.stats, nl = Object.keys(S.lieux || {}).length;
    h += '<div class="tuiles stats">'
      + T("📅", G.day - 1, pl(G.day - 1, "jour") + " tenu" + (G.day - 1 > 1 ? "s" : ""))
      + T("⭐", G.score, "points", "ok")
      + T("👪", vivants().length + "/" + G.m.length, "en vie", vivants().length < G.m.length ? "ko" : "ok")
      + T(ic("rodeur", "🧟"), S.zombies || 0, pl(S.zombies || 0, "zombie") + " " + pl(S.zombies || 0, "abattu"))
      + T("🗺️", nl, pl(nl, "lieu") .replace("lieus", "lieux") + " fouillé" + (nl > 1 ? "s" : ""))
      + T("🛠️", S.fabriques || 0, pl(S.fabriques || 0, "objet") + " " + pl(S.fabriques || 0, "fabriqué"))
      + T("🐟", S.poissons || 0, pl(S.poissons || 0, "poisson") + " " + pl(S.poissons || 0, "pêché"))
      + T("🪓", S.bois || 0, pl(S.bois || 0, "planche") + " " + pl(S.bois || 0, "coupée"))
      + T("🎯", S.missions || 0, pl(S.missions || 0, "mission") + " " + pl(S.missions || 0, "réussie"))
      + '</div>';
    if(G.dd.length) h += '<p class="sub st-morts">💀 ' + G.dd.map(function(z){ return '<b>' + echapper(z.n) + '</b> (jour ' + z.j + ')'; }).join(", ") + '</p>';
  } else {
    var J = statsJoueur(), moy = J.parties ? Math.round(J.jours / J.parties) : 0;
    h += '<div class="tuiles stats">'
      + T("👪", J.parties, pl(J.parties, "famille"))
      + T("🏆", J.meilleur, "meilleur score", "ok")
      + T("📅", J.plusLongue, "plus longue survie (jours)")
      + T(ic("rodeur", "🧟"), J.zombies, pl(J.zombies, "zombie") + " " + pl(J.zombies, "abattu"))
      + T("💀", J.morts, pl(J.morts, "mort"), J.morts ? "ko" : "")
      + T("⏳", J.jours, pl(J.jours, "jour") + " au total")
      + T("📊", moy, "jours par famille")
      + T("🐟", J.poissons, pl(J.poissons, "poisson") + " " + pl(J.poissons, "pêché"))
      + T("🪓", J.bois, pl(J.bois, "planche") + " " + pl(J.bois, "coupée"))
      + '</div>';
    if(!J.parties) h += '<p class="sub">Joue une première partie pour remplir tes stats.</p>';
  }
  show(h + '<button class="btn" style="width:100%" data-act="menu">↩️ Menu</button>');
}
document.addEventListener("keydown", function(e){ if(e.key === "Enter" && e.target && e.target.id === "pseudo") envoyerScore(); });

/* =====================================================================
   STATISTIQUES DU JOUEUR (toutes ses parties) et CHIFFRES DU MONDE
   - survival_stats (navigateur) : totaux des parties terminées (zombies abattus, morts, parties, jours, meilleur score)
   - /api/monde (serveur Cloudflare) : chaque appareil envoie ses totaux et le nombre de membres encore en vie ;
     l'accueil affiche le total de tous les joueurs (survivants en vie, morts, zombies abattus, dernières familles tombées).
   Envois limités (au plus un toutes les 10 minutes, sauf mort ou fin de partie) : le stockage gratuit
   de Cloudflare accepte environ 1000 écritures par jour.
   ===================================================================== */
function statsCumul(){ try{ return JSON.parse(localStorage.getItem("survival_stats")) || {}; }catch(e){ return {}; } }
function partieEnJeu(){ return typeof G !== "undefined" && G && G.ph === "game" && G.stats && !G.cumule; }
// La partie à compter : celle qu'on joue, ou celle qui attend dans la sauvegarde (écran d'accueil « Partie en cours »)
function partieCourante(){
  if(partieEnJeu()) return G;
  return typeof enCours !== "undefined" && enCours && enCours.stats && enCours.m ? enCours : null;
}
// Totaux du joueur : parties terminées + partie en cours
var STATS_CUMUL = ["poissons", "bois", "fabriques", "crochetages", "missions", "eloignes"]; // compteurs de G.stats ajoutés tels quels
function statsJoueur(){
  var c = statsCumul(), P = partieCourante(), g = !!P;
  var r = { zombies:(c.zombies || 0) + (g ? P.stats.zombies || 0 : 0), morts:(c.morts || 0) + (g ? (P.dd || []).length : 0),
           parties:(c.parties || 0) + (g ? 1 : 0), jours:(c.jours || 0) + (g ? P.day - 1 : 0), meilleur:Math.max(c.meilleur || 0, g ? P.score : 0),
           plusLongue:Math.max(c.plusLongue || 0, g ? P.day - 1 : 0) };
  STATS_CUMUL.forEach(function(k){ r[k] = (c[k] || 0) + (g ? P.stats[k] || 0 : 0); });
  return r;
}
// Fin de partie : on ajoute ses chiffres aux totaux (une seule fois)
function cumulerPartie(){
  if(!G || !G.stats || G.cumule) return;
  var c = statsCumul();
  c.zombies = (c.zombies || 0) + (G.stats.zombies || 0); c.morts = (c.morts || 0) + G.dd.length; c.parties = (c.parties || 0) + 1;
  c.jours = (c.jours || 0) + Math.max(0, G.day - 1); c.meilleur = Math.max(c.meilleur || 0, G.score);
  c.plusLongue = Math.max(c.plusLongue || 0, G.day - 1);
  STATS_CUMUL.forEach(function(k){ c[k] = (c[k] || 0) + (G.stats[k] || 0); });
  G.cumule = true;
  try{ localStorage.setItem("survival_stats", JSON.stringify(c)); }catch(e){}
}
function adresseMonde(){ return adresseClassement().replace("/api/classement", "/api/monde"); }
// Renvoie une promesse (résolue même en cas d'échec) pour pouvoir relire les chiffres juste après
function envoyerMonde(force, fin){
  if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return Promise.resolve(); // tests sur l'ordinateur : on n'écrit pas dans les vrais chiffres
  var t = Date.now(), dernier = 0;
  try{ dernier = +localStorage.getItem("survival_monde_t") || 0; }catch(e){}
  if(!force && t - dernier < 10 * 60000) return Promise.resolve();
  try{ localStorage.setItem("survival_monde_t", t); }catch(e){}
  var s = statsJoueur(), P = partieCourante(), v = P && !fin ? P.m.filter(function(x){ return x.al; }).length : 0;
  var corps = { id:idAppareil(), pseudo:lirePseudo(), vivants:v, jour:v ? P.day : 0, zombies:s.zombies, morts:s.morts, parties:s.parties };
  if(fin) corps.fin = fin;
  try{ return fetch(adresseMonde(), { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(corps) }).catch(function(){}); }catch(e){ return Promise.resolve(); }
}

/* ---------- Panneau « En ce moment » de l'accueil ---------- */
function panneauMonde(compact){
  return '<div class="monde' + (compact ? " compact" : "") + '" id="monde"><div class="m-tete"><span class="pouls"></span><b>En ce moment</b><small id="m-etat">…</small></div>'
    + '<div class="m-grille">'
    + '<div class="m-c vie"><b data-n="m-surv">–</b><small>survivants en vie</small></div>'
    + '<div class="m-c mort"><b data-n="m-morts">–</b><small>morts</small></div>'
    + '<div class="m-c zomb"><b data-n="m-zomb">–</b><small>zombies abattus</small></div>'
    + '</div><p class="m-fil" id="m-fil"></p></div>';
}
var minuteurFil = null;
function remplirMonde(){
  var el = document.getElementById("monde"); if(!el) return;
  var moi = statsJoueur();
  var poser = function(d){
    if(!document.getElementById("monde")) return;
    var P = partieCourante();
    var vals = d ? { "m-surv":d.survivants, "m-morts":d.morts, "m-zomb":d.zombies } : { "m-surv":P ? P.m.filter(function(x){ return x.al; }).length : 0, "m-morts":moi.morts, "m-zomb":moi.zombies };
    el.querySelectorAll("[data-n]").forEach(function(b){ compterJusque(b, vals[b.getAttribute("data-n")] || 0); });
    document.getElementById("m-etat").textContent = d ? (d.familles ? d.familles + " famille" + (d.familles > 1 ? "s tiennent" : " tient") + " bon" : "aucune famille en vie") : "tes chiffres (hors ligne)";
    if(!d) el.classList.add("horsligne");
    // Le fil : des nouvelles du monde qui défilent
    var fil = [];
    if(d){
      fil.push("🧍 Chaque membre en vie compte : une famille de 4 en vie, c’est 4 survivants.");
      if(d.doyen) fil.push("🕯️ La famille de <b>" + echapper(d.doyen.pseudo || "quelqu’un") + "</b> tient depuis " + d.doyen.jour + " jours.");
      (d.tombes || []).slice(0, 3).forEach(function(t){ fil.push("💀 La famille de <b>" + echapper(t.n || "quelqu’un") + "</b> est tombée au jour " + t.j + "."); });
      if(d.record) fil.push("🏆 Record : <b>" + echapper(d.record.pseudo) + "</b>, " + d.record.score + " points en " + d.record.jours + " jours.");
      if(d.joueurs) fil.push("👥 " + d.joueurs + " joueur" + (d.joueurs > 1 ? "s ont" : " a") + " déjà tenté leur chance.");
    }
    if(moi.zombies || moi.parties) fil.push("👤 Toi : " + moi.zombies + " zombie" + (moi.zombies > 1 ? "s" : "") + " abattu" + (moi.zombies > 1 ? "s" : "") + ", " + moi.parties + " famille" + (moi.parties > 1 ? "s" : "") + (moi.meilleur ? ", record " + moi.meilleur + " points." : "."));
    if(!fil.length) fil.push("Sois le premier à défendre ta famille !");
    var k = 0, p = document.getElementById("m-fil");
    var montrer = function(){ if(!document.getElementById("m-fil")){ clearInterval(minuteurFil); return; } p.classList.remove("on"); setTimeout(function(){ p.innerHTML = fil[k % fil.length]; p.classList.add("on"); k++; }, 250); };
    clearInterval(minuteurFil); montrer(); if(fil.length > 1) minuteurFil = setInterval(montrer, 4000);
  };
  try{
    fetch(adresseMonde()).then(function(r){ return r.json(); }).then(function(d){ poser(d && d.survivants !== undefined ? d : null); }).catch(function(){ poser(null); });
  }catch(e){ poser(null); }
}
// Le chiffre monte de 0 à sa valeur (compteur animé)
function compterJusque(b, n){
  var t0 = null, duree = 900;
  if(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches){ b.textContent = n.toLocaleString("fr-FR"); return; }
  var pas = function(t){ if(!t0) t0 = t; var f = Math.min(1, (t - t0) / duree); b.textContent = Math.round(n * (1 - Math.pow(1 - f, 3))).toLocaleString("fr-FR"); if(f < 1) requestAnimationFrame(pas); };
  requestAnimationFrame(pas);
}
// Remplace l'emplacement prévu par l'accueil (ou l'histoire) par le panneau, puis va chercher les chiffres
function poserMonde(){
  var pl = document.querySelector(".monde-place"); if(!pl) return;
  pl.outerHTML = panneauMonde(pl.getAttribute("data-compact") === "1");
  var dejaEnvoye = false; try{ dejaEnvoye = !!localStorage.getItem("survival_monde_t"); }catch(e){}
  envoyerMonde(!dejaEnvoye).then(remplirMonde, remplirMonde);
}
poserMonde(); // l'accueil a pu s'afficher avant le chargement de ce fichier

/* ---------- Le choix impossible (contenu sensible) ---------- */
function lireSensible(){ try{ return localStorage.getItem("survival_sensible") !== "0"; }catch(e){ return true; } }
CONTENUS_SENSIBLES = lireSensible();
function openSacrifice(choix, confirme){
  if(!sacrificePossible()){ show('<h2>🕯️ Le choix impossible</h2><p>Ce n’est plus nécessaire.</p>' + BTN_FERMER()); return; }
  var h = '<div class="sacrifice"><h2>🕯️ Le choix impossible</h2>';
  if(choix === undefined){
    h += '<p>Il n’y a plus rien à manger. Demain, quelqu’un mourra de faim. Dans le silence, une idée terrible fait son chemin…</p>'
      + '<p class="sub">Si tu choisis quelqu’un, la famille aura de quoi tenir quelques jours (+' + BAL.sacrifice.viande + ' rations). Mais le moral s’effondrera, et la <b>folie</b> s’installera chez les survivants : elle grandira chaque nuit et les poussera à des actes terribles.</p>'
      + '<div class="sacr-liste">' + vivants().map(function(x){ var i = G.m.indexOf(x); return '<button class="sacr-m" data-act="sacrchoix" data-id="' + i + '"><span class="cmp">' + iconeMembre(x) + '</span><b>' + x.nom + '</b><small>❤️ ' + x.hp + ' · faim ' + x.faim + '</small></button>'; }).join("") + '</div>'
      + '<button class="btn" style="width:100%" data-act="close">Non. Jamais.</button>';
  } else {
    var x = G.m[choix];
    h += '<p>' + x.nom + '… Vraiment ? Il n’y aura pas de retour en arrière, et personne n’oubliera.</p>'
      + '<div class="row"><button class="btn alt" data-act="sacrok" data-id="' + choix + '">Oui, il le faut</button><button class="btn" data-act="close">Non</button></div>';
  }
  show(h + '</div>');
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
  if(a === "sacrifice") openSacrifice();
  else if(a === "sacrchoix") openSacrifice(+id);
  else if(a === "sacrok"){
    var t = sacrifier(+id); render();
    show('<div class="sacrifice"><h2>La nuit la plus longue</h2><p>' + (t || "Ce n’est plus possible.") + '</p>' + BTN_FERMER("Continuer") + '</div>');
    if(typeof sauver === "function") sauver();
  }
  else if(a === "menusensible"){ CONTENUS_SENSIBLES = !CONTENUS_SENSIBLES; try{ localStorage.setItem("survival_sensible", CONTENUS_SENSIBLES ? "1" : "0"); }catch(e2){} openMenu(); }
});

/* =====================================================================
   PARRAINAGE : mon code, utiliser un code, le largage (mini-jeu) et le sac de bonus
   - survival_bonus : bonus gardés (3 au maximum), un seul utilisable par partie (G.bonusUtilise)
   - survival_colis : colis gagnés pas encore ouverts
   ===================================================================== */
var BONUS = {
  renfort: { nom:"Survivant de renfort", icone:"🧑", desc:"Un nouveau membre rejoint la famille (si quelqu’un est mort)",
    possible:function(){ return vivants().length < FAMILLE.length; },
    appliquer:function(){ var noms = [["Nora", "👩"], ["Sam", "🧑"], ["Inès", "👩"], ["Yanis", "🧑"]].filter(function(r){ return !G.m.some(function(x){ return x.al && x.nom === r[0]; }); }); var r = noms[0] || ["Alex", "🧑"]; recruter(r[0], r[1]); return r[0] + " rejoint la famille !"; } },
  survie:  { nom:"Caisse de survie", icone:"📦", desc:"8 rations d’eau et 8 de nourriture",
    possible:function(){ return true; }, appliquer:function(){ ajouter("bidon", 1); ajouter("conserves", 1); return "Un bidon d’eau et un lot de conserves au stock."; } },
  trousse: { nom:"Trousse militaire", icone:"💊", desc:"2 trousses de soins et 1 antibiotique",
    possible:function(){ return true; }, appliquer:function(){ ajouter("trousse", 2); ajouter("antibio", 1); return "2 trousses de soins et un antibiotique au stock."; } },
  armes:   { nom:"Caisse d’armes", icone:"🔫", desc:"Un fusil de chasse et une boîte de cartouches",
    possible:function(){ return true; }, appliquer:function(){ ajouter("fusil", 1, 1); ajouter("boiteCart", 1); return "Un fusil de chasse et des cartouches au stock."; } },
  mecano:  { nom:"Kit du mécano", icone:"🔧", desc:"Une pièce de voiture manquante et un jerrican",
    possible:function(){ return true; },
    appliquer:function(){ var p = VOITURE.pieces.filter(function(k){ return !G.voiture.installees[k] && !compter(k); })[0]; if(p) ajouter(p, 1); ajouter("jerrican", 1); return (p ? nommer(p, 1).replace(/^./, function(c){ return c.toUpperCase(); }) + " et un" : "Un") + " jerrican au stock."; } }
};
var MAX_BONUS = 3;
function lireBonus(){ try{ return JSON.parse(localStorage.getItem("survival_bonus")) || []; }catch(e){ return []; } }
function ecrireBonus(b){ try{ localStorage.setItem("survival_bonus", JSON.stringify(b)); }catch(e){} }
function lireColis(){ try{ return +localStorage.getItem("survival_colis") || 0; }catch(e){ return 0; } }
function ecrireColis(n){ try{ localStorage.setItem("survival_colis", Math.max(0, n)); }catch(e){} }
function adresseParrainage(){ return adresseClassement().replace("/api/classement", "/api/parrainage"); }
function appelParrainage(corps){
  return fetch(adresseParrainage(), { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(corps) }).then(function(r){ return r.json(); });
}
// Le menu : « 🎁 Inviter » et « 🎒 Bonus »
function openInviter(){
  var lien = SITE_JEU + "/?code=";
  show('<h2>🎁 Inviter des amis</h2><p>Partage ton code : quand un ami l’utilise, <b>vous recevez chacun un colis</b> de ravitaillement largué sur le quartier, avec un bonus exclusif.</p>'
    + '<div class="moncode"><small>Ton code</small><b id="moncode">…</b></div><p class="msg" id="msgcode"></p>'
    + '<div class="row"><button class="btn" data-act="partagercode" disabled id="btnpartage">📤 Partager</button><button class="btn alt" data-act="copiercode" disabled id="btncopie">📋 Copier le lien</button></div>'
    + '<button class="loc" data-act="saisircode"><b>🎟️ J’ai un code d’invitation</b><small>Un seul code d’ami par appareil (et les codes spéciaux)</small></button>'
    + '<button class="btn alt" style="width:100%" data-act="menu">↩️ Menu</button>');
  var code = null; try{ code = localStorage.getItem("survival_code"); }catch(e){}
  var poser = function(c, n){ code = c; var e = $("moncode"); if(!e) return; e.textContent = c; $("btnpartage").disabled = false; $("btncopie").disabled = false; $("btnpartage").setAttribute("data-id", c); $("btncopie").setAttribute("data-id", c); if(n) $("msgcode").textContent = "👥 Déjà utilisé par " + n + " ami" + (n > 1 ? "s" : "") + " !"; };
  if(code) poser(code);
  if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)){ if(!code) $("msgcode").textContent = "(Test sur l’ordinateur : pas de code créé.)"; return; }
  appelParrainage({ action:"moncode", id:idAppareil() }).then(function(d){ if(d.code){ try{ localStorage.setItem("survival_code", d.code); }catch(e){} poser(d.code, d.n); } })
    .catch(function(){ if(!code){ var m = $("msgcode"); if(m) m.textContent = MSG_HORS_LIGNE; } });
}
function texteInvitation(c){ return "Je survis à l’apocalypse dans SURVIVAL – Le dernier refuge 🧟 Rejoins-moi avec mon code " + c + " : on reçoit chacun un colis de ravitaillement ! " + SITE_JEU + "/?code=" + c; }
function openSaisieCode(pre){
  show('<h2>🎟️ Code d’invitation</h2><p class="sub">Tape le code d’un ami (ou un code spécial).</p>'
    + '<input id="champcode" class="champ grand" maxlength="12" autocomplete="off" autocapitalize="characters" value="' + echapper(pre || "") + '" placeholder="Ex. BL615">'
    + '<p class="msg" id="msgcode"></p><div class="row"><button class="btn" data-act="validercode">Valider</button><button class="btn alt" data-act="close">Annuler</button></div>');
  setTimeout(function(){ var c = $("champcode"); if(c) c.focus(); }, 50);
}
function validerCode(){
  var c = ($("champcode").value || "").trim(), m = $("msgcode");
  if(!c){ m.textContent = "Tape un code."; return; }
  m.textContent = "Vérification…";
  appelParrainage({ action:"utiliser", id:idAppareil(), code:c, pseudo:lirePseudo() }).then(function(d){
    if(d.ok){ ecrireColis(lireColis() + (d.colis || 1)); try{ localStorage.removeItem("survival_code_attente"); }catch(e){} openLargage(d.special ? "Code spécial accepté !" : "Code accepté ! Ton ami reçoit aussi un colis."); }
    else m.textContent = "❌ " + (d.erreur || "Code refusé.");
  }).catch(function(){ m.textContent = MSG_HORS_LIGNE; });
}
/* ---------- Le largage : 3 caisses tombent en parachute, on en ouvre une ---------- */
function openLargage(titre){
  var n = lireColis();
  if(!n){ openSacBonus(); return; }
  if(lireBonus().length >= MAX_BONUS){ show('<h2>🪂 Colis en attente : ' + n + '</h2><p>Ton sac de bonus est plein (' + MAX_BONUS + ' au maximum). Utilise un bonus pendant une partie, puis reviens ouvrir ton colis.</p><button class="btn" style="width:100%" data-act="sacbonus">🎒 Voir mes bonus</button>' + BTN_FERMER()); return; }
  show('<div class="largage"><h2>🪂 ' + (titre || "Ravitaillement largué !") + '</h2><p class="sub">Un avion survole le quartier et largue trois caisses. Tu n’as le temps d’en récupérer qu’une. Laquelle ?' + (n > 1 ? " (" + n + " colis)" : "") + '</p>'
    + '<div class="caisses">' + [0, 1, 2].map(function(k){ return '<button class="caisse c' + k + '" data-act="caisse" data-id="' + k + '" aria-label="Caisse ' + (k + 1) + '"><span class="para">🪂</span><span class="boite">📦</span></button>'; }).join("") + '</div></div>');
}
function ouvrirCaisse(k){
  var ids = Object.keys(BONUS), id = ids[Math.floor(Math.random() * ids.length)], B = BONUS[id];
  var b = lireBonus(); b.push(id); ecrireBonus(b); ecrireColis(lireColis() - 1);
  document.querySelectorAll(".caisse").forEach(function(c, j){ c.disabled = true; if(j !== k) c.classList.add("perdue"); else c.classList.add("ouverte"); });
  setTimeout(function(){
    show('<div class="largage"><h2>📦 ' + B.icone + ' ' + B.nom + ' !</h2><p>' + B.desc + '.</p><p class="sub">Il rejoint ton sac de bonus (' + lireBonus().length + ' / ' + MAX_BONUS + '). Tu pourras l’utiliser <b>une fois par partie</b>, au moment de ton choix ; s’il ne sert pas, il reste pour la partie suivante.</p>'
      + (lireColis() ? '<button class="btn" style="width:100%;margin-bottom:8px" data-act="largage">🪂 Ouvrir le colis suivant (' + lireColis() + ')</button>' : '')
      + '<button class="btn alt" style="width:100%" data-act="sacbonus">🎒 Mes bonus</button></div>');
    if(typeof son === "function") son("butin");
  }, 650);
}
function openSacBonus(msg){
  var b = lireBonus(), enJeu = typeof G !== "undefined" && G && G.ph === "game" && !G.cumule;
  var h = '<h2>🎒 Mes bonus · ' + b.length + ' / ' + MAX_BONUS + '</h2>' + (msg ? '<p class="g2 msg">' + msg + '</p>' : '')
    + '<p class="sub">Un seul bonus par partie' + (enJeu && G.bonusUtilise ? " : tu as déjà utilisé le tien pour cette partie." : ".") + ' Gagne des colis en invitant des amis.</p>';
  h += b.length ? b.map(function(id, k){
    var B = BONUS[id]; if(!B) return "";
    var raison = !enJeu ? "Pendant une partie" : G.bonusUtilise ? "Déjà un bonus cette partie" : !B.possible() ? "Pas utile pour l’instant" : "";
    return '<button class="loc craft" data-act="utiliserbonus" data-id="' + k + '"' + (raison ? " disabled" : "") + '><span class="em">' + B.icone + '</span><span class="eqt"><b>' + B.nom + '</b><small>' + (raison ? "❌ " + raison + " · " : "") + B.desc + '</small></span></button>';
  }).join("") : '<p>Aucun bonus pour l’instant.</p>';
  if(lireColis()) h += '<button class="btn" style="width:100%;margin-bottom:8px" data-act="largage">🪂 Ouvrir mon colis (' + lireColis() + ')</button>';
  show(h + '<div class="row"><button class="btn alt" data-act="inviter">🎁 Inviter</button><button class="btn alt" data-act="menu">↩️ Menu</button></div>');
}
function utiliserBonus(k){
  var b = lireBonus(), id = b[k], B = BONUS[id];
  if(!B || !G || G.ph !== "game" || G.bonusUtilise || !B.possible()) return;
  var t = B.appliquer(); G.bonusUtilise = id; b.splice(k, 1); ecrireBonus(b);
  render(); if(typeof sauver === "function") sauver();
  openSacBonus(B.icone + " " + t);
}
// Au lancement : un code reçu par lien (?code=) et les nouvelles de mes filleuls
(function(){
  var m = /[?&]code=([A-Za-z0-9-]{3,12})/.exec(location.search);
  if(m){ try{ localStorage.setItem("survival_code_attente", m[1].toUpperCase()); }catch(e){} try{ history.replaceState(null, "", location.pathname); }catch(e){} }
  if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  setTimeout(function(){
    appelParrainage({ action:"nouvelles", id:idAppareil() }).then(function(d){
      if(!d || !d.filleuls || !d.filleuls.length) return;
      ecrireColis(lireColis() + d.filleuls.length);
      var c = ""; try{ c = localStorage.getItem("survival_code") || ""; }catch(e){}
      if(typeof fileSucces !== "undefined"){ d.filleuls.forEach(function(p){ fileSucces.push({ icone:"🎉", titre:"Parrainage", nom:"Ton code " + c + " a été utilisé par " + p + " ! Un colis t’attend (menu ☰)" }); }); montrerSucces(); }
    }).catch(function(){});
  }, 2500);
})();
function codeEnAttente(){ try{ return localStorage.getItem("survival_code_attente") || ""; }catch(e){ return ""; } }
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
  if(a === "inviter") openInviter();
  else if(a === "saisircode") openSaisieCode(codeEnAttente());
  else if(a === "validercode") validerCode();
  else if(a === "largage") openLargage();
  else if(a === "caisse") ouvrirCaisse(+id);
  else if(a === "sacbonus") openSacBonus();
  else if(a === "utiliserbonus") utiliserBonus(+id);
  else if(a === "partagercode"){ var t = texteInvitation(id); if(navigator.share) navigator.share({ title:"SURVIVAL – Le dernier refuge", text:t }).catch(function(){}); else { try{ navigator.clipboard.writeText(t); $("msgcode").textContent = "✅ Message copié : colle-le à tes amis."; }catch(e2){} } }
  else if(a === "copiercode"){ try{ navigator.clipboard.writeText(SITE_JEU + "/?code=" + id); $("msgcode").textContent = "✅ Lien copié !"; }catch(e3){ $("msgcode").textContent = SITE_JEU + "/?code=" + id; } }
});
document.addEventListener("keydown", function(e){ if(e.key === "Enter" && e.target && e.target.id === "champcode") validerCode(); });

/* =====================================================================
   CLANS (phase 1 des guerres de clans) : à partir du jour 100 (réglable par l'administration),
   créer un clan, en rejoindre un (5 familles max), le quitter ; le chef peut exclure.
   Le bastion et les guerres viendront ensuite.
   ===================================================================== */
// Blasons peints (Gemini, 2026-11-09) : images/blasons/1..12.webp, dans cet ordre (l'emoji sert de secours)
var BLASONS = ["🐺", "🦅", "🐻", "🦂", "🔥", "💀", "⚔️", "🛡️", "🌲", "🏴", "⚙️", "🐍"];
var NOMS_BLASONS = ["Loup", "Aigle", "Ours", "Scorpion", "Flamme", "Crâne", "Épées", "Bouclier", "Sapin", "Drapeau noir", "Engrenage", "Serpent"];
function imgBlason(n){ n = Math.max(1, Math.min(12, n || 1)); return '<img src="images/blasons/' + n + '.webp" alt="' + NOMS_BLASONS[n - 1] + '">'; }
function blason(n){ return '<span class="blason">' + imgBlason(n) + '</span>'; }
function adresseClans(){ return adresseClassement().replace("/api/classement", "/api/clans"); }
var etatClans = null, choixBlason = 1;
function jourPartie(){ return typeof G !== "undefined" && G && G.ph === "game" && !G.cumule ? G.day : (typeof enCours !== "undefined" && enCours ? enCours.day : 0); }
function appelClans(corps){
  corps.id = idAppareil(); corps.pseudo = lirePseudo(); corps.jour = jourPartie();
  if(corps.action !== "liste" && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return Promise.resolve({ erreur:"(Test sur l’ordinateur : rien n’est envoyé au serveur.)" });
  return fetch(adresseClans(), { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(corps) }).then(function(r){ return r.json(); });
}
function openClans(msg){
  show('<h2>⚔️ Clans</h2><p class="sub">Chargement…</p>' + BTN_FERMER());
  appelClans({ action:"liste" }).then(function(d){ etatClans = d; noterTours(d.monClan ? d.monClan.tours : 0); afficherClans(msg); })
    .catch(function(){ show('<h2>⚔️ Clans</h2><p>' + MSG_HORS_LIGNE.replace("le classement", "les clans") + '</p>' + BTN_FERMER()); });
}
function quand(t){ if(!t) return "—"; var m = Math.round((Date.now() - t) / 60000); return m < 60 ? "à l’instant" : m < 1440 ? "il y a " + Math.round(m / 60) + " h" : "il y a " + Math.round(m / 1440) + " j"; }
function afficherClans(msg){
  var d = etatClans, j = jourPartie(), ok = j >= d.jourMin, h = '<h2>⚔️ Clans</h2>' + (msg ? '<p class="g2 msg">' + msg + '</p>' : '');
  if(d.monClan){
    var c = d.monClan;
    h += '<div class="clan-tete">' + blason(c.blason) + '<span><b>' + echapper(c.nom) + '</b><small>' + c.membres + ' / 5 familles · ' + c.jours + ' jours tenus à eux tous</small></span></div>';
    h += '<div class="clan-membres">' + c.membresListe.map(function(m){
      return '<div class="clan-m' + (m.moi ? " moi" : "") + '"><span class="cm-nom">' + (m.chef ? "👑 " : "") + echapper(m.pseudo || "?") + (m.moi ? " (toi)" : "") + '</span><small>Jour ' + (m.jour || "?") + ' · vu ' + quand(m.vu) + '</small>'
        + (c.chefId && !m.moi ? '<button class="mini" data-act="clanexclure" data-id="' + echapper(m.vrai) + '">Exclure</button>' : '') + '</div>';
    }).join("") + '</div>';
    h += '<div class="row" style="margin-bottom:8px"><button class="btn" data-act="bastion">🏰 Bastion</button><button class="btn' + (c.enGuerre ? "" : " alt") + '" data-act="guerre">⚔️ ' + (c.enGuerre ? "En guerre !" : c.recherche ? "Recherche…" : "La guerre") + '</button></div>'
      + '<div class="row"><button class="btn alt" data-act="clanquitter">Quitter le clan</button><button class="btn" data-act="close">Fermer</button></div>';
    show(h); return;
  }
  h += '<p class="sub">' + (ok ? "Tu as tenu " + j + " jours : tu peux fonder un clan ou en rejoindre un (5 familles maximum)." : "🔒 Les clans s’ouvrent quand ta famille a tenu <b>" + d.jourMin + " jours</b> (tu en es au jour " + j + "). Voici ceux qui t’attendent :") + '</p>';
  h += d.clans.length ? '<div class="clan-liste">' + d.clans.map(function(c){
    var plein = c.membres >= 5;
    return '<div class="clan-l">' + blason(c.blason) + '<span class="cl-info"><b>' + echapper(c.nom) + '</b><small>👑 ' + echapper(c.chef) + ' · ' + c.membres + ' / 5 · ' + c.jours + ' j</small></span>'
      + (ok ? '<button class="mini" data-act="clanrejoindre" data-id="' + echapper(c.id) + '"' + (plein ? " disabled" : "") + '>' + (plein ? "Complet" : "Rejoindre") + '</button>' : '') + '</div>';
  }).join("") + '</div>' : '<p>Aucun clan pour l’instant. Sois le premier à en fonder un !</p>';
  h += (ok ? '<button class="btn" style="width:100%;margin-bottom:8px" data-act="clancreer">🏴 Fonder un clan</button>' : '') + BTN_FERMER();
  show(h);
}
function openCreerClan(err){
  if(!lirePseudo()){ show('<h2>🏴 Fonder un clan</h2><p>Choisis d’abord ton pseudo (il apparaîtra dans le clan).</p><div class="row"><button class="btn" data-act="saisie" data-id="p" data-retour="clan">👤 Mon pseudo</button><button class="btn alt" data-act="clans">Retour</button></div>'); return; }
  show('<h2>🏴 Fonder un clan</h2><p class="sub">Tu en seras le chef. Les autres familles qui ont tenu assez longtemps pourront te rejoindre.</p>'
    + '<input id="nomclan" class="champ grand" maxlength="20" autocomplete="off" placeholder="Nom du clan">'
    + '<p class="sub" style="margin:8px 0 4px">Blason :</p><div class="blasons">' + BLASONS.map(function(b, k){ return '<button class="bl' + (choixBlason === k + 1 ? " on" : "") + '" data-act="clanblason" data-id="' + (k + 1) + '" aria-label="' + NOMS_BLASONS[k] + '">' + imgBlason(k + 1) + '</button>'; }).join("") + '</div>'
    + '<p class="msg" id="msgclan">' + (err || "") + '</p><div class="row"><button class="btn" data-act="clancreerok">Fonder le clan</button><button class="btn alt" data-act="clans">Retour</button></div>');
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
  var reponse = function(d, ok){ if(d.erreur){ openClans("❌ " + d.erreur); return; } openClans(ok); };
  if(a === "clans") openClans();
  else if(a === "clancreer") openCreerClan();
  else if(a === "clanblason"){ var nom = ($("nomclan") || {}).value || ""; choixBlason = +id; openCreerClan(); $("nomclan").value = nom; }
  else if(a === "clancreerok"){
    var n = ($("nomclan").value || "").trim(); if(n.length < 3){ $("msgclan").textContent = "Le nom doit faire au moins 3 lettres."; return; }
    appelClans({ action:"creer", nom:n, blason:choixBlason }).then(function(d){ if(d.erreur){ openCreerClan("❌ " + d.erreur); return; } openClans("🏴 Le clan « " + n + " » est fondé ! Tu en es le chef."); }).catch(function(){ openCreerClan(MSG_HORS_LIGNE); });
  }
  else if(a === "clanrejoindre") appelClans({ action:"rejoindre", clan:id }).then(function(d){ reponse(d, "✅ Bienvenue dans le clan !"); }).catch(function(){ openClans(); });
  else if(a === "clanquitter"){ if(!b.classList.contains("confirme")){ b.classList.add("confirme"); b.textContent = "Vraiment quitter ?"; return; } appelClans({ action:"quitter" }).then(function(d){ reponse(d, "Tu as quitté le clan."); }); }
  else if(a === "clanexclure"){ if(!b.classList.contains("confirme")){ b.classList.add("confirme"); b.textContent = "Confirmer"; return; } appelClans({ action:"exclure", cible:id }).then(function(d){ reponse(d, "Membre exclu."); }); }
});

/* ---------- Le bastion du clan (phase 2) : réserve commune, défenses, journal ---------- */
// Bonus des tours de guet pour la défense de nuit (lu par defenseNuit dans logique.js)
var BONUS_CLAN_DEF = 0;
try{ BONUS_CLAN_DEF = +localStorage.getItem("survival_clan_tours") || 0; }catch(e){}
function noterTours(t){ BONUS_CLAN_DEF = t || 0; try{ localStorage.setItem("survival_clan_tours", BONUS_CLAN_DEF); }catch(e){} }
var DEF_BASTION = {
  remparts: { nom:"Remparts", icone:"🧱", effet:function(l){ return "Protègent le bastion pendant les guerres (niveau " + l + " / 5)."; } },
  mines:    { nom:"Mines", icone:"💣", effet:function(l){ return (l ? l + " mine" + (l > 1 ? "s" : "") + " posée" + (l > 1 ? "s" : "") : "Aucune mine posée") + " : chacune blesse un assaillant pendant une guerre, puis disparaît."; } },
  tours:    { nom:"Tours de guet", icone:"🗼", effet:function(l){ return "+" + l + " de défense de nuit pour chaque famille du clan (niveau " + l + " / 3)."; } }
};
var etatBastion = null, ongletBastion = "reserve", msgBastion = "";
function openBastion(onglet){
  if(onglet) ongletBastion = onglet;
  show('<h2>🏰 Le bastion</h2><p class="sub">Chargement…</p>' + BTN_FERMER());
  appelClans({ action:"bastion" }).then(function(d){ if(d.erreur){ show('<h2>🏰 Le bastion</h2><p>❌ ' + d.erreur + '</p><button class="btn" style="width:100%" data-act="clans">⚔️ Clans</button>'); return; } etatBastion = d.bastion; noterTours(etatBastion.def.tours); afficherBastion(); })
    .catch(function(){ show('<h2>🏰 Le bastion</h2><p>' + MSG_HORS_LIGNE.replace("le classement", "le bastion") + '</p>' + BTN_FERMER()); });
}
function afficherBastion(){
  var B = etatBastion, h = '<h2>🏰 Le bastion</h2><div class="tabs onglets">'
    + [["reserve", "📦", "Réserve"], ["defenses", "🛡️", "Défenses"], ["journal", "📜", "Journal"]].map(function(o){ return '<button class="tab' + (o[0] === ongletBastion ? " on" : "") + '" data-act="bastonglet" data-id="' + o[0] + '">' + o[1] + '<small>' + o[2] + '</small></button>'; }).join("") + '</div>';
  if(msgBastion){ h += '<p class="msg ' + (msgBastion.charAt(0) === "❌" ? "" : "g2") + '">' + msgBastion + '</p>'; msgBastion = ""; }
  var enJeu = typeof G !== "undefined" && G && G.ph === "game" && !G.cumule;
  if(ongletBastion === "reserve"){
    var ids = Object.keys(B.reserve);
    h += '<p class="sub">La réserve commune du clan. Tu peux y prendre <b>' + B.retraitsRestants + ' objet' + (B.retraitsRestants > 1 ? "s" : "") + '</b> encore aujourd’hui.</p>';
    h += ids.length ? etageres(ids.map(function(k){ return caseObjet(k, { act:enJeu && B.retraitsRestants ? "bastprendre" : "aucun", cle:k, n:B.reserve[k], fixe:!(enJeu && B.retraitsRestants) }); }), 5) : '<p>La réserve est vide : déposez des vivres et des matériaux !</p>';
    if(enJeu && B.retraitsRestants && ids.length) h += '<p class="sub">Touche un objet de la réserve pour en prendre 1.</p>';
    var mes = B.deposables.filter(function(k){ return OBJETS[k] && compter(k) > 0; });
    h += '<p class="titre-butin">🎒 Déposer depuis ton stock</p>' + (!enJeu ? '<p class="sub">Pendant une partie.</p>' : mes.length ? etageres(mes.map(function(k){ return caseObjet(k, { act:"bastdeposer", cle:k, n:compter(k) }); }), 5) + '<p class="sub">Touche un objet de ton stock pour en déposer 1.</p>' : '<p class="sub">Rien à déposer (vivres, soins, munitions, matériaux).</p>');
  } else if(ongletBastion === "defenses"){
    h += Object.keys(DEF_BASTION).map(function(k){
      var D = DEF_BASTION[k], l = B.def[k] || 0, c = B.couts[k];
      var manque = c ? Object.keys(c).filter(function(m){ return !((B.reserve[m] || 0) >= c[m]); }) : [];
      var ing = c ? '<div class="ings2">' + Object.keys(c).map(function(m){ var a = B.reserve[m] || 0; return '<span class="ing2 ' + (a >= c[m] ? "ok" : "ko") + '"><span class="ing2-case">' + icone(m) + '</span><b>' + a + '/' + c[m] + '</b><small>' + (NOM_COURT[m] || OBJETS[m].nom) + '</small></span>'; }).join("") + '</div>' : '';
      return '<div class="bast-def"><div class="invfiche"><span class="em">' + D.icone + '</span><span class="eqt"><b>' + D.nom + ' · ' + l + ' / ' + B.max[k] + '</b><small>' + D.effet(l) + '</small></span></div>'
        + (c ? ing + '<button class="btn" style="width:100%" data-act="bastconstruire" data-id="' + k + '"' + (manque.length ? " disabled" : "") + '>' + (manque.length ? "❌ Il manque des matériaux dans la réserve" : "🔨 Construire avec la réserve") + '</button>' : '<p class="etat ok">⭐ Niveau maximum</p>') + '</div>';
    }).join("");
  } else {
    h += B.journal.length ? '<div class="fil">' + B.journal.map(function(j){ return '<div class="lj"><span class="lj-ico">📜</span><span class="lj-txt"><b>' + echapper(j.qui) + '</b> ' + echapper(j.txt.replace(/\b(\d+) (\w+)/g, function(m0, n, k){ return OBJETS[k] ? nommer(k, +n) : m0; }).replace(/: (\w+) \(/, function(m0, k){ return ": " + (DEF_BASTION[k] ? DEF_BASTION[k].nom.toLowerCase() : k) + " ("; })) + ' <small>' + quand(j.t) + '</small></span></div>'; }).join("") + '</div>' : '<p>Rien pour l’instant.</p>';
  }
  show(h + '<div class="row"><button class="btn alt" data-act="clans">⚔️ Mon clan</button><button class="btn" data-act="close">Fermer</button></div>');
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-cle") || b.getAttribute("data-id");
  var apres = function(d, ok){ if(d.erreur) msgBastion = "❌ " + d.erreur; else { etatBastion = d.bastion; noterTours(etatBastion.def.tours); msgBastion = ok; } render(); if(typeof sauver === "function") sauver(); afficherBastion(); };
  if(a === "bastion") openBastion();
  else if(a === "bastonglet"){ ongletBastion = id; afficherBastion(); }
  else if(a === "bastdeposer"){
    if(!G || compter(id) < 1) return;
    var o = {}; o[id] = 1;
    appelClans({ action:"deposer", objets:o }).then(function(d){ if(!d.erreur) retirer(id, 1); apres(d, "📦 Tu as déposé " + nommer(id, 1) + " dans la réserve."); }).catch(function(){ msgBastion = "❌ " + MSG_HORS_LIGNE; afficherBastion(); });
  }
  else if(a === "bastprendre"){
    appelClans({ action:"retirer", objet:id, n:1 }).then(function(d){ if(!d.erreur) ajouter(id, 1); apres(d, "🎒 Tu as pris " + nommer(id, 1) + " dans la réserve."); }).catch(function(){ msgBastion = "❌ " + MSG_HORS_LIGNE; afficherBastion(); });
  }
  else if(a === "bastconstruire") appelClans({ action:"construire", def:id }).then(function(d){ apres(d, "🔨 " + DEF_BASTION[id].nom + " : niveau supérieur construit !"); });
});
// Au lancement : bonus des tours de guet de mon clan (lu une fois)
(function(){ if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return; setTimeout(function(){ appelClans({ action:"liste" }).then(function(d){ noterTours(d && d.monClan ? d.monClan.tours : 0); }).catch(function(){}); }, 4000); })();

/* ---------- Guerres de clans (phase 3) ---------- */
var etatGuerre = null;
function tempsRestant(t){ var m = Math.max(0, Math.round((t - Date.now()) / 60000)); return m >= 60 ? Math.floor(m / 60) + " h " + (m % 60) + " min" : m + " min"; }
function openGuerre(msg){
  show('<h2>⚔️ La guerre</h2><p class="sub">Chargement…</p>' + BTN_FERMER());
  appelClans({ action:"guerre" }).then(function(d){ if(d.erreur){ show('<h2>⚔️ La guerre</h2><p>❌ ' + d.erreur + '</p>' + BTN_FERMER()); return; } etatGuerre = d; afficherGuerre(msg); })
    .catch(function(){ show('<h2>⚔️ La guerre</h2><p>' + MSG_HORS_LIGNE.replace("le classement", "la guerre") + '</p>' + BTN_FERMER()); });
}
function bandeauGuerre(W){
  return '<div class="gu-tete"><span class="gu-camp">' + blason(W.nous.blason) + '<b>' + echapper(W.nous.nom) + '</b><span class="gu-et">' + W.nous.etoiles + ' ★</span></span><span class="gu-vs">VS</span>'
    + '<span class="gu-camp">' + blason(W.eux.blason) + '<b>' + echapper(W.eux.nom) + '</b><span class="gu-et">' + W.eux.etoiles + ' ★</span></span></div>';
}
function afficherGuerre(msg){
  var d = etatGuerre, W = d.guerre, h = '<h2>⚔️ La guerre</h2>' + (msg ? '<p class="msg ' + (msg.charAt(0) === "❌" ? "" : "g2") + '">' + msg + '</p>' : '');
  if(d.bilan) h += '<p class="sub">Bilan du clan : ' + d.bilan.gagnees + ' victoire' + (d.bilan.gagnees > 1 ? "s" : "") + ', ' + d.bilan.perdues + ' défaite' + (d.bilan.perdues > 1 ? "s" : "") + ', ' + d.bilan.nulles + ' nulle' + (d.bilan.nulles > 1 ? "s" : "") + '.</p>';
  if(!W){
    if(d.derniere) h += '<div class="carte-guerre">' + bandeauGuerre(d.derniere) + '<p class="etat ' + (d.derniere.gagnant === "nous" ? "ok" : d.derniere.gagnant ? "ko" : "") + '">' + (d.derniere.gagnant === "nous" ? "🏆 Dernière guerre gagnée !" : d.derniere.gagnant ? "Dernière guerre perdue." : "Dernière guerre : match nul.") + '</p></div>';
    if(!d.complet) h += '<p>🔒 Il faut <b>5 familles</b> dans le clan pour partir en guerre. Les clans incomplets ne peuvent ni attaquer ni être attaqués.</p>';
    else if(d.recherche) h += '<p>🔎 Le clan cherche un adversaire de sa taille… La guerre commencera dès qu’un autre clan complet sera prêt.</p>' + (d.chef ? '<button class="btn alt" style="width:100%;margin-bottom:8px" data-act="guerreannuler">Annuler la recherche</button>' : '');
    else h += '<p>Une guerre dure <b>3 jours</b>. Chaque jour, chaque membre peut lancer <b>un assaut</b> contre une famille adverse : un combat tactique contre ses défenseurs, ses mines et ses remparts. Les étoiles décident du vainqueur, et chaque victoire rapporte une part de la réserve adverse.</p>'
      + (d.chef ? '<button class="btn" style="width:100%;margin-bottom:8px" data-act="guerrechercher">⚔️ Chercher une guerre</button>' : '<p class="sub">Seul le chef peut lancer la recherche d’un adversaire.</p>');
    show(h + '<div class="row"><button class="btn alt" data-act="clans">⚔️ Mon clan</button><button class="btn" data-act="close">Fermer</button></div>'); return;
  }
  h += bandeauGuerre(W) + '<p class="sub">Jour ' + W.jour + ' / 3 · ' + (W.jour < 3 ? "nouveaux assauts dans " + tempsRestant(W.finJour) : "fin de la guerre dans " + tempsRestant(W.fin)) + ' · 🧱 remparts ' + W.eux.remparts + ' · 💣 ' + W.eux.mines + ' mine' + (W.eux.mines > 1 ? "s" : "") + '</p>';
  var enJeu = typeof G !== "undefined" && G && G.ph === "game" && !G.cumule;
  h += '<p class="titre-butin">🎯 Familles adverses</p><div class="clan-liste">' + W.cibles.map(function(c){
    var raison = !enJeu ? "Pendant une partie" : W.dejaMoi ? "Ton assaut est fait" : c.attaquee ? "Déjà attaquée" : "";
    return '<div class="clan-l"><span class="cl-info"><b>' + echapper(c.pseudo || "?") + '</b><small>Jour ' + (c.jour || "?") + (c.attaquee ? " · attaquée aujourd’hui" : "") + '</small></span><button class="mini" data-act="guerreattaquer" data-id="' + echapper(c.id) + '"' + (raison ? " disabled title=\"" + raison + "\"" : "") + '>' + (raison && raison !== "Pendant une partie" ? "✔" : "⚔️ Attaquer") + '</button></div>';
  }).join("") + '</div>';
  if(W.dejaMoi) h += '<p class="sub">✅ Tu as lancé ton assaut aujourd’hui. Reviens demain !</p>';
  if(W.assauts.length) h += '<p class="titre-butin">📜 Assauts</p><div class="fil">' + W.assauts.map(function(s){ return '<div class="lj ' + (s.nous ? "bon" : "mauvais") + '"><span class="lj-ico">' + (s.nous ? "⚔️" : "🛡️") + '</span><span class="lj-txt">Jour ' + s.jour + ' : <b>' + echapper(s.qui) + '</b> attaque ' + echapper(s.cible) + ' → ' + (s.etoiles ? "★".repeat(s.etoiles) : "repoussé") + '</span></div>'; }).join("") + '</div>';
  show(h + '<div class="row"><button class="btn alt" data-act="clans">⚔️ Mon clan</button><button class="btn" data-act="close">Fermer</button></div>');
}
// Qui part à l'assaut : les 2 membres en état de sortir avec le plus de vie et d'énergie
function equipeAssaut(){ return G.m.map(function(x, i){ return i; }).filter(function(i){ var x = G.m[i]; return x.al && x.en >= BAL.energieAssaut && x.hp > 25; })
  .sort(function(a, b){ return (G.m[b].hp + G.m[b].en) - (G.m[a].hp + G.m[a].en); }).slice(0, BAL.membresParExpedition); }
function openAssaut(cible){
  var eq = equipeAssaut(), c = etatGuerre.guerre.cibles.find(function(x){ return x.id === cible; }) || {};
  if(!eq.length){ afficherGuerre("❌ Personne n’a assez d’énergie (" + BAL.energieAssaut + " ⚡) ni de vie pour partir à l’assaut. Reviens après une nuit de repos."); return; }
  show('<h2>⚔️ Assaut sur ' + echapper(c.pseudo || "?") + '</h2><p>Partent à l’assaut : <b>' + liste(eq.map(function(i){ return G.m[i].nom; })) + '</b> (−' + BAL.energieAssaut + ' ⚡ chacun). Ils affronteront les défenseurs du bastion adverse, ses mines et ses remparts.</p>'
    + '<p class="sub">⚠️ Les blessures et les morts sont réelles. Tu peux fuir pendant le combat, mais sans étoile.</p>'
    + '<div class="row"><button class="btn" data-act="guerrego" data-id="' + echapper(cible) + '">⚔️ À l’assaut !</button><button class="btn alt" data-act="guerre">Retour</button></div>');
}
function lancerAssaut(cible){
  var eq = equipeAssaut(); if(!eq.length) return;
  appelClans({ action:"debutAssaut", cible:cible }).then(function(d){
    if(d.erreur){ openGuerre("❌ " + d.erreur); return; }
    creerAssaut(d, eq); render(); if(typeof sauver === "function") sauver();
    choixCombat = {}; cibleCombat = 0; dernierPV = null; openCombat();
  }).catch(function(){ openGuerre("❌ " + MSG_HORS_LIGNE); });
}
function terminerAssaut(){
  var b = bilanAssaut();
  appelClans({ action:"finAssaut", assaut:b.assaut, victoire:b.victoire, etoiles:b.etoiles }).then(function(d){
    finirAssaut(); var butin = [];
    if(!d.erreur) (d.butin || []).forEach(function(p){ if(OBJETS[p[0]]){ ajouter(p[0], p[1]); butin.push(nommer(p[0], p[1])); } });
    render(); if(typeof sauver === "function") sauver();
    show('<h2>' + (b.victoire ? "⭐ Assaut réussi !" : "🛡️ Assaut repoussé") + '</h2><p class="gu-etoiles">' + (b.etoiles ? "★".repeat(b.etoiles) + "☆".repeat(3 - b.etoiles) : "☆☆☆") + '</p>'
      + (b.resume.length ? puces(b.resume) : '') + (butin.length ? '<p>🎒 Butin pris dans la réserve adverse : <b>' + liste(butin) + '</b>.</p>' : b.victoire ? '<p class="sub">La réserve adverse était vide.</p>' : '')
      + (d.erreur ? '<p class="msg">❌ ' + d.erreur + '</p>' : '')
      + '<div class="row"><button class="btn" data-act="guerre">⚔️ La guerre</button><button class="btn alt" data-act="close">Fermer</button></div>');
    finiSiMorts();
  }).catch(function(){ finirAssaut(); render(); show('<h2>⚔️ Assaut</h2><p>' + MSG_HORS_LIGNE + '</p>' + BTN_FERMER()); });
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
  if(a === "guerre") openGuerre();
  else if(a === "guerrechercher") appelClans({ action:"chercherGuerre" }).then(function(d){ openGuerre(d.erreur ? "❌ " + d.erreur : d.debut ? "⚔️ Un adversaire a été trouvé : la guerre commence !" : "🔎 Recherche lancée. La guerre commencera dès qu’un autre clan complet sera prêt."); });
  else if(a === "guerreannuler") appelClans({ action:"annulerRecherche" }).then(function(d){ openGuerre(d.erreur ? "❌ " + d.erreur : "Recherche annulée."); });
  else if(a === "guerreattaquer") openAssaut(id);
  else if(a === "guerrego") lancerAssaut(id);
});
