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
