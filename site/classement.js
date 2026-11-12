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
// Un pseudo interdit enregistré avant le filtre (ou par une vieille fenêtre) ne compte plus : le jeu en redemande un (2026-11-12)
function lirePseudo(){ var p = ""; try{ p = localStorage.getItem("survival_pseudo") || ""; }catch(e){} return p && typeof texteInterdit === "function" && texteInterdit(p) ? "" : p; }
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
  if(typeof texteInterdit === "function" && texteInterdit(pseudo)){ $("msgcl").textContent = MSG_NOM_INTERDIT; return; }
  try{ localStorage.setItem("survival_pseudo", pseudo); }catch(e){}
  $("msgcl").textContent = "Envoi…";
  fetch(adresseClassement(), { method:"POST", headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ id:idAppareil(), pseudo:pseudo, score:dernierEnvoi.score, jours:dernierEnvoi.jours, cadre:cadreActif(), avatar:lireAvatar() }) })
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
    body:JSON.stringify({ id:idAppareil(), pseudo:lirePseudo(), score:dernierEnvoi.score, jours:dernierEnvoi.jours, cadre:cadreActif(), avatar:lireAvatar() }) })
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(!el()) return;
      if(!d.ok){ el().textContent = "Score refusé par le serveur."; return; }
      var place = d.rang ? "tu es " + eme(d.rang) + " sur " + d.total : "hors des " + d.total + " premiers";
      el().textContent = "🏆 " + (d.record ? "Score envoyé : " + place + " !" : "Ton meilleur score reste " + d.meilleur + " (" + place + ").");
      if(d.saison) resultatLegende(d.saison, el());
    })
    .catch(function(){ if(el()) el().textContent = MSG_HORS_LIGNE; });
}
// Classement en 3 onglets (2026-11-12) : le mois (la Légende en tête), depuis toujours, le panthéon des anciennes Légendes
var ongletCl = "mois", donneesCl = null, messageCl = "";
function openClassement(message){
  if(message !== undefined) messageCl = message || "";
  var tabs = [["mois", "👑 Ce mois-ci", "La Légende"], ["toujours", "🏆 Depuis toujours", "Tous les joueurs"], ["pantheon", "🏛️ Panthéon", "Anciennes Légendes"]];
  var h = '<h2>🏆 Classement</h2>' + (messageCl ? '<p class="g2 msg">' + messageCl + '</p>' : '')
    + '<div class="tabs onglets">' + tabs.map(function(t){ return '<button class="tab' + (t[0] === ongletCl ? " on" : "") + '" data-act="clonglet" data-id="' + t[0] + '">' + t[1] + '<small>' + t[2] + '</small></button>'; }).join("") + '</div>';
  h += donneesCl ? contenuClassement(donneesCl) : '<p class="sub" id="listecl">Chargement…</p>';
  show(h + BTN_FERMER());
  if(!donneesCl) fetch(adresseClassement() + "?id=" + idAppareil()).then(function(r){ return r.json(); }).then(function(d){
    donneesCl = d; if(d.saison) noterLegende(d.saison); if($("listecl")) openClassement();
  }).catch(function(){ var el = $("listecl"); if(el) el.textContent = MSG_HORS_LIGNE; });
}
function ligneCl(e, k){ return '<li class="' + (e.moi ? "moi" : "") + (e.legende ? " leg" : "") + '"><span class="rang">' + (k < 3 ? ic("medaille" + (k + 1), ["🥇","🥈","🥉"][k]) : (k + 1) + ".") + '</span>' + avatarHtml(e.avatar, e.pseudo, "cl-av") + '<b>' + pseudoCadre(e.pseudo, e.cadre, !!e.legende) + '</b><span class="pts">⭐ ' + e.score + ' · ' + e.jours + ' j</span></li>'; }
function contenuClassement(d){
  var S = d.saison || {};
  if(ongletCl === "pantheon"){
    var P = S.pantheon || [];
    if(!P.length) return '<p class="msg">Le panthéon est encore vide : la première Légende y entrera à la fin du mois.</p>';
    return '<p class="sub">Chaque mois, la Légende entre au panthéon et la couronne est remise en jeu.</p><ol class="classement pantheon">' + P.map(function(e){
      return '<li><span class="rang">' + ic("couronne", "👑") + '</span><b>' + pseudoCadre(e.pseudo, e.cadre, false) + '<small class="pth-mois">' + moisFr(e.saison) + ' · a régné ' + e.regne + ' j</small></b><span class="pts">⭐ ' + e.score + ' · ' + e.jours + ' j</span></li>'; }).join("") + '</ol>';
  }
  var liste = ongletCl === "mois" ? S.scores || [] : d.scores || [], total = ongletCl === "mois" ? S.total || 0 : d.total || 0;
  var rang = ongletCl === "mois" ? S.monRang : d.monRang, h = "";
  if(ongletCl === "mois") h += carteLegende(S);
  if(!liste.length) return h + '<p class="msg">' + (ongletCl === "mois" ? "Personne n’a encore envoyé de score ce mois-ci : la couronne est à prendre !" : "Personne n’a encore envoyé de score. Sois le premier !") + '</p>';
  h += '<ol class="classement">' + liste.map(ligneCl).join("") + '</ol>';
  if(ongletCl === "toujours" && d.moi && d.monRang > liste.length) h += '<ol class="classement"><li class="moi"><span class="rang">' + d.monRang + '.</span><b>' + pseudoCadre(d.moi.pseudo, d.moi.cadre) + '</b><span class="pts">⭐ ' + d.moi.score + ' · ' + d.moi.jours + ' j</span></li></ol>';
  else if(ongletCl === "mois" && rang > liste.length) h += '<p class="sub">Tu es ' + eme(rang) + ' ce mois-ci.</p>';
  return h + '<p class="sub">' + total + ' joueur' + (total > 1 ? "s" : "") + (ongletCl === "mois" ? " ce mois-ci" : "") + ' · ⭐ = meilleur score d’une partie classée (1 point par jour et par survivant)</p>';
}
function carteLegende(S){
  var L = S.legende, reste = S.fin ? Math.max(0, Math.ceil((S.fin - Date.now()) / 86400000)) : 0;
  if(!L) return '<div class="lg-carte vide"><span class="lg-ico">' + ic("couronne", "👑") + '</span><span><small>La Légende de ' + moisFr(S.id, true) + '</small><b>Personne… pour l’instant</b><em>Le meilleur score du mois prend la couronne.</em></span></div>';
  return '<div class="lg-carte' + (L.moi ? " moi" : "") + '">' + medaillonLegende("images/portrait-tigre.webp", 60) + '<span><small>La Légende de ' + moisFr(S.id, true) + (L.moi ? ' · c’est toi !' : '') + '</small><b>' + pseudoCadre(L.pseudo, L.cadre, true) + '</b>'
    + '<em>⭐ ' + L.score + ' points · ' + L.jours + ' jours tenus · règne depuis ' + (L.regne ? L.regne + ' jour' + (L.regne > 1 ? "s" : "") : "aujourd’hui") + '</em></span>'
    + '<span class="lg-fin">' + (reste > 1 ? 'Fin de la saison dans ' + reste + ' jours' : 'Dernier jour de la saison !') + '</span></div>';
}
var MOIS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
function moisFr(id, court){ var p = String(id || "").split("-"); var m = MOIS_FR[(+p[1] || 1) - 1] || ""; return court ? m : m + " " + (p[0] || ""); }

document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act");
  if(a === "envoiscore") openEnvoiScore();
  else if(a === "envoyerscore") envoyerScore();
  else if(a === "classement"){ donneesCl = null; ongletCl = "mois"; openClassement(""); }
  else if(a === "clonglet"){ ongletCl = b.getAttribute("data-id"); openClassement(); }
  else if(a === "stats"){ ongletStats = b.getAttribute("data-id") || ongletStats; openStats(); }
});

/* ---------- Fenêtre « 📊 Mes stats » (menu ☰) ---------- */
var ongletStats = null;
function openStats(){
  var g = partieEnJeu();
  if(!ongletStats || (ongletStats === "partie" && !g)) ongletStats = g ? "partie" : "toutes";
  var T = function(icone, valeur, nom, cls){ return '<div class="tuile st ' + (cls || "") + '"><span class="st-ico">' + icone + '</span><b>' + valeur + '</b><small>' + nom + '</small></div>'; };
  var pl = function(n, mot){ return n > 1 ? mot + "s" : mot; };
  var h = '<button class="lien-retour" data-act="menu">← Menu</button><h2>📊 Mes stats</h2><div class="tabs onglets">'
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
    if(G.dd.length) h += '<p class="titre-butin">🕯️ Ils nous ont quittés</p><div class="st-morts2">' + G.dd.map(function(z){ var x = { nom:z.n, r:z.r, icone:z.ic || "🙂", al:false, hp:0, en:0, faim:0, soif:0 };
      return '<span class="st-mort"><span class="st-mort-p">' + iconeMembre(x) + '</span><span><b>' + echapper(z.n) + '</b><small>' + echapper(causeMort(z.r || z.n, z.c)) + ' · jour ' + z.j + '</small></span></span>'; }).join("") + '</div>';
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
  var cad = typeof cadreActif === "function" ? cadreActif() : "bois", cadN = (CADRES.filter(function(c){ return c.id === cad; })[0] || CADRES[0]).nom;
  show(h + '<button class="st-cadre" data-act="cadres">' + pseudoCadre(lirePseudo() || "Sans pseudo", cad) + '<span><b>Mon cadre</b><small>' + cadN + ' · ' + nbSucces() + ' / ' + SUCCES.length + ' succès</small></span><span class="cm-voir">›</span></button>' + BTN_FERMER());
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
  noterHistorique();
}
function adresseMonde(){ return adresseClassement().replace("/api/classement", "/api/monde"); }
// Renvoie une promesse (résolue même en cas d'échec) pour pouvoir relire les chiffres juste après
function envoyerMonde(force, fin){
  if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return Promise.resolve(); // tests sur l'ordinateur : on n'écrit pas dans les vrais chiffres
  var t = Date.now(), dernier = 0;
  try{ dernier = +localStorage.getItem("survival_monde_t") || 0; }catch(e){}
  if(!force && t - dernier < (typeof HORDE_MONDIALE !== "undefined" && HORDE_MONDIALE ? 5 : 10) * 60000) return Promise.resolve();
  try{ localStorage.setItem("survival_monde_t", t); }catch(e){}
  var s = statsJoueur(), P = partieCourante(), v = P && !fin ? P.m.filter(function(x){ return x.al; }).length : 0;
  var corps = { id:idAppareil(), pseudo:lirePseudo(), vivants:v, jour:v ? P.day : 0, zombies:s.zombies, morts:s.morts, parties:s.parties };
  if(fin) corps.fin = fin;
  if(typeof lireEvt === "function" && typeof HORDE_MONDIALE !== "undefined" && HORDE_MONDIALE) corps.evt = lireEvt();
  try{ return fetch(adresseMonde(), { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(corps) }).catch(function(){}); }catch(e){ return Promise.resolve(); }
}

/* ---------- Panneau « En ce moment » de l'accueil ---------- */
function panneauMonde(compact){
  return '<div class="monde' + (compact ? " compact" : "") + '" id="monde"><div class="m-tete"><span class="pouls"></span><b>En ce moment</b><small id="m-etat">…</small></div>'
    + '<div class="m-grille">'
    + '<div class="m-c vie"><b data-n="m-surv">–</b><small>survivants en vie</small></div>'
    + '<div class="m-c mort"><b data-n="m-morts">–</b><small>morts</small></div>'
    + '<div class="m-c zomb"><b data-n="m-zomb">–</b><small>zombies abattus</small></div>'
    + '</div><p class="m-legende" id="m-legende" hidden></p><p class="m-fil" id="m-fil"></p></div>';
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
      if(d.legende) fil.push("👑 La Légende du mois : <b>" + echapper(d.legende.pseudo) + "</b>, " + d.legende.score + " points. Qui la détrônera ?");
      if(d.detrone) fil.unshift("👑 <b>" + echapper(d.detrone.nouveau) + "</b> a détrôné " + echapper(d.detrone.ancien) + " après " + d.detrone.regne + " jour" + (d.detrone.regne > 1 ? "s" : "") + " de règne !");
      if(d.record) fil.push("🏆 Record de tous les temps : <b>" + echapper(d.record.pseudo) + "</b>, " + d.record.score + " points en " + d.record.jours + " jours.");
      var lg = document.getElementById("m-legende");
      if(lg && d.legende){ lg.innerHTML = '<span class="ml-ico">' + ic("couronne", "👑") + '</span><span><small>La Légende du mois</small><b>' + echapper(d.legende.pseudo) + '</b></span><span class="ml-pts">⭐ ' + d.legende.score + '</span>'; lg.hidden = false; }
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
  // Raccord avec la DA (2026-11-11) : bandeau cadeau, ticket du code, deux gros boutons, deux tuiles (code d'un ami, mes bonus)
  var nb = lireBonus().length;
  show('<button class="lien-retour" data-act="menu">← Menu</button><h2>🎁 Inviter des amis</h2>'
    + '<div class="inv-hero"><span class="inv-ico">🪂</span><span><b>Un colis pour toi, un pour ton ami</b><small>Quand un ami utilise ton code, vous recevez chacun un colis largué sur le quartier, avec un bonus exclusif.</small></span></div>'
    + '<div class="moncode"><small>Ton code</small><b id="moncode">…</b></div><p class="msg" id="msgcode"></p>'
    + '<div class="row inv-row"><button class="btn btn-jeu" data-act="partagercode" disabled id="btnpartage">📤 Partager</button><button class="btn alt btn-jeu" data-act="copiercode" disabled id="btncopie">📋 Copier le lien</button></div>'
    + '<div class="inv-tuiles"><button class="inv-t" data-act="saisircode"><span class="inv-t-ico">🎟️</span><b>J’ai un code</b><small>d’un ami ou spécial</small></button>'
    + '<button class="inv-t" data-act="sacbonus"><span class="inv-t-ico">🎒</span><b>Mes bonus</b><small>' + (nb ? nb + " en réserve" : "aucun pour l’instant") + '</small></button></div>' + BTN_FERMER());
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
   CLANS (phase 1 des guerres de clans) : à partir du jour 30 (réglable par l'administration),
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
// Mon profil de clan : ce que les autres membres voient en touchant mon nom
function monProfil(){
  var s = statsJoueur(), P = typeof partieCourante === "function" ? partieCourante() : null;
  return { zombies:s.zombies, meilleur:s.meilleur, plusLongue:s.plusLongue, parties:s.parties, succes:typeof nbSucces === "function" ? nbSucces() : 0,
           etoiles:statClan("etoiles"), victoires:statClan("victoires"), depots:statClan("depots"), vivants:P && P.m ? P.m.filter(function(x){ return x.al; }).length : 0 };
}
function openProfilMembre(i){
  var c = etatClans && etatClans.monClan, m = c && c.membresListe[i]; if(!m) return;
  var p = m.profil, h = '<h2>' + (m.chef ? ic("couronne", "👑") + " " : "") + pseudoCadre(m.pseudo, m.cadre) + (m.moi ? " <small>(toi)</small>" : "") + '</h2>';
  h += '<p class="sub">' + (m.chef ? "Chef du clan « " + echapper(c.nom) + " »" : "Membre du clan « " + echapper(c.nom) + " »") + (m.rejoint ? " depuis " + quand(m.rejoint).replace(/^il y a /, "").replace("à l’instant", "peu") : "") + ' · vu ' + quand(m.vu) + '</p>';
  if(p){
    h += '<p class="titre-butin">🏠 Sa famille</p>' + tuiles([["jour de survie", m.jour || "?"], ["en vie", p.vivants + " / 4", p.vivants >= 3 ? "ok" : p.vivants >= 2 ? "moy" : "ko"], ["record", p.meilleur + " ⭐"]]);
    h += '<p class="titre-butin">⚔️ Au combat</p>' + tuiles([["zombies abattus", p.zombies], ["étoiles d’assaut", p.etoiles + " ★"], ["guerres gagnées", p.victoires]]);
    h += '<p class="titre-butin">🏅 Parcours</p>' + tuiles([["succès", p.succes + " / " + (typeof SUCCES !== "undefined" ? SUCCES.length : 25)], ["plus longue survie", p.plusLongue + " j"], ["familles", p.parties]]);
  } else h += '<p class="sub">Ce membre n’a pas encore partagé ses chiffres (ils arrivent à sa prochaine visite).</p>';
  h += '<p class="titre-butin">📦 Réserve du clan</p><p>A déposé <b>' + (m.depose || 0) + '</b> objet' + ((m.depose || 0) > 1 ? "s" : "") + ', en a pris <b>' + (m.pris || 0) + '</b>.</p>';
  h += '<div class="row"><button class="btn alt" data-act="clans">⚔️ Mon clan</button><button class="btn" data-act="close">Fermer</button></div>';
  show(h);
}
function appelClans(corps){
  corps.id = idAppareil(); corps.pseudo = lirePseudo(); corps.jour = corps.jour || jourPartie(); corps.cadre = cadreActif(); corps.avatar = lireAvatar(); corps.profil = monProfil();
  if(corps.action !== "liste" && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return Promise.resolve({ erreur:"(Test sur l’ordinateur : rien n’est envoyé au serveur.)" });
  return fetch(adresseClans(), { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(corps) }).then(function(r){ return r.json(); });
}
function openClans(msg){
  show('<h2>⚔️ Clans</h2><p class="sub">Chargement…</p>' + BTN_FERMER());
  appelClans({ action:"liste" }).then(function(d){ etatClans = d; noterTours(d.monClan ? d.monClan.tours : 0); noterClan(!!d.monClan); afficherClans(msg); })
    .catch(function(){ show('<h2>⚔️ Clans</h2><p>' + MSG_HORS_LIGNE.replace("le classement", "les clans") + '</p>' + BTN_FERMER()); });
}
function quand(t){ if(!t) return "—"; var m = Math.round((Date.now() - t) / 60000); return m < 60 ? "à l’instant" : m < 1440 ? "il y a " + Math.round(m / 60) + " h" : "il y a " + Math.round(m / 1440) + " j"; }
// Fiche d'un clan de la liste : description, membres, ligue, bilan, bouton Rejoindre
var classementClansCache = [];
function openFicheClan(i, depuisClassement){
  var d = etatClans || {}, c = depuisClassement ? classementClansCache[i] : d.clans && d.clans[i]; if(!c) return;
  var ok = jourPartie() >= (d.jourMin || 30), plein = c.membres >= 5, b = c.bilan || {};
  var h = '<div class="clan-tete">' + blason(c.blason) + '<span><b>' + echapper(c.nom) + '</b><small>Fondé ' + quand(c.cree).replace("à l’instant", "aujourd’hui") + ' · ' + c.jours + ' jours tenus à eux tous</small>' + badgeLigue(c.trophees) + '</span></div>';
  h += '<p class="clan-desc">' + (c.desc ? "« " + echapper(c.desc) + " »" : '<i>Ce clan n’a pas encore de description.</i>') + '</p>';
  h += tuiles([["joueurs", c.membres + " / 5", plein ? "ko" : "ok"], ["guerres gagnées", b.gagnees || 0], ["trophées", (c.trophees || 0) + " 🏆"]]);
  h += '<p class="titre-butin">👥 Les familles</p><div class="clan-membres">' + (c.noms || []).map(function(m){ return '<div class="clan-m"><span class="cm-nom">' + (m.chef ? ic("couronne", "👑") + " " : "") + pseudoCadre(m.pseudo, m.cadre) + '</span><small>Jour ' + (m.jour || "?") + '</small></div>'; }).join("") + '</div>';
  h += '<div class="row">' + (ok && !d.monClan && !c.moi ? '<button class="btn" data-act="clanrejoindre" data-id="' + echapper(c.id) + '"' + (plein ? " disabled" : "") + '>' + (plein ? "Complet" : "Rejoindre") + '</button>' : '') + '<button class="btn alt" data-act="' + (depuisClassement ? "classementclans" : "clans") + '">Retour</button></div>';
  show(h);
}
function openDescClan(){
  var c = etatClans && etatClans.monClan; if(!c) return;
  show('<h2>✏️ Description du clan</h2><p class="sub">Présente ton clan aux autres joueurs (200 lettres au plus) : votre façon de jouer, vos règles, quand vous êtes là…</p>'
    + '<textarea id="descClan" class="desc-clan" maxlength="200" rows="4">' + echapper(c.desc || "") + '</textarea><p class="sub" id="descReste"></p>'
    + '<div class="row"><button class="btn alt" data-act="clans">Annuler</button><button class="btn" data-act="clandescok">Enregistrer</button></div>');
  var t = document.getElementById("descClan"), r = document.getElementById("descReste"), maj = function(){ r.textContent = (200 - t.value.length) + " lettres restantes"; };
  t.addEventListener("input", maj); maj(); t.focus();
}
function afficherClans(msg){
  var d = etatClans, j = jourPartie(), ok = j >= d.jourMin, h = '<h2>⚔️ Clans</h2>' + (msg ? '<p class="g2 msg">' + msg + '</p>' : '');
  if(d.monClan){
    var c = d.monClan;
    // Raccord avec la DA (2026-11-11) : carte du clan (blason, nom, ligue, 3 tuiles), devise, 4 grandes tuiles d'action en haut,
    // familles en lignes compactes (pastille de couleur, ✕ rouge pour exclure), quitter en petit lien
    var stOp = typeof etatOpGarde === "function" && etatOpGarde() ? statutOp(etatOpGarde()) : null, nl = typeof chatNonLus !== "undefined" ? chatNonLus : 0;
    h += '<div class="mc-carte">' + blason(c.blason) + '<span class="mc-id"><b class="mc-nom">' + echapper(c.nom) + '</b><small class="mc-stats">👥 <b>' + c.membres + '</b> / 5 familles · <b>' + c.jours + '</b> jours tenus</small>' + badgeLigue(c.trophees) + '</span></div>';
    h += '<p class="mc-desc">' + (c.desc ? "« " + echapper(c.desc) + " »" : '<i>Pas encore de devise.</i>') + (c.chefId ? '<button class="mc-edit" data-act="clandesc" aria-label="Modifier la description">✏️</button>' : '') + '</p>';
    var tuileA = function(act, id, ico, titre, sous, cls, badge){ return '<button class="mc-a' + (cls ? " " + cls : "") + '" data-act="' + act + '"' + (id ? ' data-id="' + id + '"' : '') + '><span class="mc-a-ico">' + ico + (badge ? '<i class="nl-badge">' + badge + '</i>' : '') + '</span><b>' + titre + '</b><small>' + sous + '</small></button>'; };
    h += '<div class="mc-actions">'
      + tuileA("bastion", "", ic("bastion", "🏰"), "Bastion", "réserve, défenses", "")
      + tuileA("guerre", "", "⚔️", c.enGuerre ? "En guerre !" : "La guerre", c.enGuerre ? "à l’assaut" : c.recherche ? "recherche…" : "trouver un rival", c.enGuerre ? "chaud" : "")
      + tuileA("chat", "", "💬", "Discussion", nl ? nl + " nouveau" + (nl > 1 ? "x" : "") : "écrire au clan", nl ? "chaud" : "", nl)
      + tuileA("opouvrir", "immeuble", "🎯", "Opération", stOp && stOp.txt ? stOp.txt.replace(/^\S+\s/, "") : "l’immeuble", stOp && stOp.agir ? "chaud" : "")
      + '</div>';
    h += '<p class="titre-butin">👥 Les familles</p><div class="mc-membres">' + c.membresListe.map(function(m, k){
      return '<div class="mc-m' + (m.moi ? " moi" : "") + '"><button class="mc-m-b" data-act="profilmembre" data-id="' + k + '">' + avatarHtml(m.avatar, m.pseudo, "ch-av mc-av") + '<span class="mc-m-t"><b>' + (m.chef ? ic("couronne", "👑") + " " : "") + pseudoCadre(m.pseudo, m.cadre) + (m.moi ? ' <small class="mc-toi">toi</small>' : '') + '</b><small>Jour ' + (m.jour || "?") + ' · vu ' + quand(m.vu) + ' · 📦 +' + (m.depose || 0) + ' / −' + (m.pris || 0) + '</small></span><span class="cm-voir">›</span></button>'
        + (c.chefId && !m.moi ? '<button class="mc-ex" data-act="clanexclure" data-id="' + echapper(m.vrai) + '" aria-label="Exclure ' + echapper(m.pseudo) + '" title="Exclure">✕</button>' : '') + '</div>';
    }).join("") + '</div>';
    h += '<button class="btn alt btn-jeu" style="width:100%;margin:8px 0" data-act="classementclans">🏆 Classement des clans</button>'
      + '<button class="lien mc-quitter" data-act="clanquitter">🚪 Quitter le clan</button>' + BTN_FERMER();
    show(h); return;
  }
  h += '<p class="sub">' + (ok ? "Tu as tenu " + j + " jours : tu peux fonder un clan ou en rejoindre un (5 familles maximum)." : "🔒 Les clans s’ouvrent quand ta famille a tenu <b>" + d.jourMin + " jours</b> (tu en es au jour " + j + "). Voici ceux qui t’attendent :") + '</p>';
  h += d.clans.length ? '<div class="clan-liste">' + d.clans.map(function(c){
    var plein = c.membres >= 5;
    return '<div class="clan-l"><button class="cl-ouvrir" data-act="clanfiche" data-id="' + d.clans.indexOf(c) + '" title="Voir le clan">' + blason(c.blason) + '<span class="cl-info"><b>' + echapper(c.nom) + ' <span class="cm-voir">›</span></b><small>' + ic("couronne", "👑") + ' ' + echapper(c.chef) + ' · 👥 ' + c.membres + ' / 5 joueurs · ' + badgeLigue(c.trophees, true) + '</small></span></button>'
      + (ok ? '<button class="mini" data-act="clanrejoindre" data-id="' + echapper(c.id) + '"' + (plein ? " disabled" : "") + '>' + (plein ? "Complet" : "Rejoindre") + '</button>' : '') + '</div>';
  }).join("") + '</div>' : '<p>Aucun clan pour l’instant. Sois le premier à en fonder un !</p>';
  h += (ok ? '<button class="btn" style="width:100%;margin-bottom:8px" data-act="clancreer">🏴 Fonder un clan</button>' : '') + '<button class="btn alt" style="width:100%;margin-bottom:8px" data-act="classementclans">🏆 Classement des clans</button>' + BTN_FERMER();
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
    if(texteInterdit(n)){ $("msgclan").textContent = MSG_NOM_INTERDIT; return; }
    appelClans({ action:"creer", nom:n, blason:choixBlason }).then(function(d){ if(d.erreur){ openCreerClan("❌ " + d.erreur); return; } noterStatClan("fonde", 1, true); openClans("🏴 Le clan « " + n + " » est fondé ! Tu en es le chef."); }).catch(function(){ openCreerClan(MSG_HORS_LIGNE); });
  }
  else if(a === "profilmembre") openProfilMembre(+id);
  else if(a === "clanfiche") openFicheClan(+id);
  else if(a === "clanfichec") openFicheClan(+id, true);
  else if(a === "clandesc") openDescClan();
  else if(a === "clandescok" && document.getElementById("descClan") && texteInterdit(document.getElementById("descClan").value)){ var rs = document.getElementById("descReste"); if(rs){ rs.textContent = "❌ " + MSG_NOM_INTERDIT.replace("Ce nom", "Cette description").replace("Choisis-en un autre", "Change-la"); rs.style.color = "var(--bad)"; } }
  else if(a === "clandescok"){ var tx = document.getElementById("descClan"); appelClans({ action:"description", desc:tx ? tx.value : "" }).then(function(r){ if(r.erreur){ openClans("❌ " + r.erreur); return; } openClans("✏️ Description enregistrée."); }).catch(function(){ openClans("❌ " + MSG_HORS_LIGNE); }); }
  else if(a === "clanrejoindre"){
    if(!lirePseudo()){ show('<h2>⚔️ Rejoindre un clan</h2><p>Choisis d’abord ton pseudo : c’est lui que les autres membres verront.</p><div class="row"><button class="btn" data-act="saisie" data-id="p" data-retour="clans">👤 Mon pseudo</button><button class="btn alt" data-act="clans">Retour</button></div>'); return; }
    appelClans({ action:"rejoindre", clan:id }).then(function(d){ reponse(d, "✅ Bienvenue dans le clan !"); }).catch(function(){ openClans(); });
  }
  else if(a === "clanquitter"){ if(!b.classList.contains("confirme")){ b.classList.add("confirme"); b.textContent = "Vraiment quitter ?"; return; } appelClans({ action:"quitter" }).then(function(d){ reponse(d, "Tu as quitté le clan."); }); }
  else if(a === "clanexclure"){ if(!b.classList.contains("confirme")){ b.classList.add("confirme"); b.textContent = "Confirmer"; return; } appelClans({ action:"exclure", cible:id }).then(function(d){ reponse(d, "Membre exclu."); }); }
});

/* ---------- Le bastion du clan (phase 2) : réserve commune, défenses, journal ---------- */
// Bonus des tours de guet pour la défense de nuit (lu par defenseNuit dans logique.js)
var BONUS_CLAN_DEF = 0;
try{ BONUS_CLAN_DEF = +localStorage.getItem("survival_clan_tours") || 0; }catch(e){}
function noterTours(t){ BONUS_CLAN_DEF = t || 0; try{ localStorage.setItem("survival_clan_tours", BONUS_CLAN_DEF); }catch(e){} }
// Fait-on partie d'un clan ? (retenu à chaque lecture des clans : sert aux pièces du bastion dans la maison)
function dansUnClan(){ try{ return localStorage.getItem("survival_mon_clan") === "1"; }catch(e){ return false; } }
function noterClan(oui){ if(oui) noterStatClan("rejoint", 1, true); var avant = dansUnClan(); try{ localStorage.setItem("survival_mon_clan", oui ? "1" : ""); }catch(e){} if(avant !== !!oui && typeof G !== "undefined" && G && G.ph === "game" && typeof placerPiece === "function") placerPiece(); }
var DEF_BASTION = {
  remparts: { nom:"Remparts", icone:"🧱", ico:"remparts", effet:function(l){ return "Protègent le bastion pendant les guerres (niveau " + l + " / 5)."; } },
  mines:    { nom:"Mines", icone:"💣", ico:"mine", effet:function(l){ return (l ? l + " mine" + (l > 1 ? "s" : "") + " posée" + (l > 1 ? "s" : "") : "Aucune mine posée") + " : chacune blesse un assaillant pendant une guerre, puis disparaît."; } },
  armurerie:{ nom:"Armurerie", icone:"🦺", ico:"gilet", effet:function(l){ return l ? "Les défenseurs portent des gilets : pendant une guerre, chaque tir ennemi perd " + Math.round(BAL.assaut.armurerieTir * l + 0.01) + " dégâts (" + Math.round(BAL.assaut.armurerieTete * l + 0.01) + " à la tête) et chaque coup " + Math.round(BAL.assaut.armurerieCoup * l + 0.01) + "." : "Pas encore d’armurerie : les armes à feu adverses font tous leurs dégâts."; } },
  tours:    { nom:"Tours de guet", icone:"🗼", ico:"tour", effet:function(l){ return "+" + l + " de défense de nuit pour chaque famille du clan (niveau " + l + " / 3)."; } }
};
// Camion du clan (2026-11-10) : améliorations payées par la réserve, utiles à chaque assaut des membres
var CAMION_BASTION = {
  parebuffle:{ nom:"Pare-buffle", icone:"🐂", ico:"parebuffle", effet:function(l){ return l ? "Le camion enfonce l’entrée : chaque défenseur perd " + Math.round(BAL.assaut.parebuffle * l) + " PV au début de l’assaut." : "Le camion arrive sans rien pour enfoncer l’entrée."; } },
  blindage:  { nom:"Blindage", icone:"🔩", ico:"blindage", effet:function(l){ return l ? "Le camion encaisse les " + l + " première" + (l > 1 ? "s" : "") + " mine" + (l > 1 ? "s" : "") + " de chaque assaut, sans blessé." : "Les mines adverses blessent directement l’équipe."; } },
  remorque:  { nom:"Remorque artisanale", icone:"🛞", ico:"roue", effet:function(l){ return l ? "Accrochée au camion pour le raid de l’immeuble : " + BAL.immeuble.remorque + " objets de plus ramenés." : "Pour le raid de l’immeuble : sans elle, chaque volontaire ne ramène que " + BAL.immeuble.sac + " objets."; } },
  tourelle:  { nom:"Tourelle", icone:"🎯", ico:"tourelle", effet:function(l){ return l ? "À chaque tour, la tourelle tire sur le défenseur le plus faible (" + Math.round(BAL.assaut.tourelle * l) + " à " + (Math.round(BAL.assaut.tourelle * l) + 2) + " dégâts ; les gilets de l’armurerie adverse la freinent)." : "Pas de tourelle : toute l’attaque repose sur l’équipe."; } }
};
function defBastion(k){ return DEF_BASTION[k] || CAMION_BASTION[k]; }
var etatBastion = null, ongletBastion = "reserve", msgBastion = "", selDefBastion = null;
function openBastion(onglet){
  if(onglet) ongletBastion = onglet;
  show('<h2>' + ic("bastion", "🏰") + ' Le bastion</h2><p class="sub">Chargement…</p>' + BTN_FERMER());
  appelClans({ action:"bastion" }).then(function(d){ if(d.erreur){ show('<h2>' + ic("bastion", "🏰") + ' Le bastion</h2><p>❌ ' + d.erreur + '</p><button class="btn" style="width:100%" data-act="clans">⚔️ Clans</button>'); return; } etatBastion = d.bastion; noterTours(etatBastion.def.tours); afficherBastion(); })
    .catch(function(){ show('<h2>' + ic("bastion", "🏰") + ' Le bastion</h2><p>' + MSG_HORS_LIGNE.replace("le classement", "le bastion") + '</p>' + BTN_FERMER()); });
}
function afficherBastion(){
  if(etatBastion && etatBastion.raid && typeof noterEtatOp === "function") noterEtatOp(etatBastion.raid);
  var B = etatBastion, h = '<h2>' + ic("bastion", "🏰") + ' Le bastion</h2><div class="tabs onglets">'
    + [["reserve", ic("reserveClan", "📦"), "Réserve"], ["defenses", ic("bouclier", "🛡️"), "Défenses"], ["camion", ic("camionClan", "🚚"), "Camion"], ["operations", ic("cible", "🎯"), "Opérations"], ["journal", ic("journalClan", "📜"), "Journal"]].map(function(o){ return '<button class="tab' + (o[0] === ongletBastion ? " on" : "") + '" data-act="bastonglet" data-id="' + o[0] + '">' + o[1] + '<small>' + o[2] + '</small></button>'; }).join("") + '</div>';
  if(msgBastion){ h += '<p class="msg ' + (msgBastion.charAt(0) === "❌" ? "" : "g2") + '">' + msgBastion + '</p>'; msgBastion = ""; }
  var enJeu = typeof G !== "undefined" && G && G.ph === "game" && !G.cumule;
  if(ongletBastion === "reserve"){
    var ids = Object.keys(B.reserve);
    var P2 = B.part || { depose:0, pris:0 };
    h += '<p class="sub">La réserve commune du clan. Ta participation : <b>+' + P2.depose + '</b> déposés, <b>−' + P2.pris + '</b> pris. On peut prendre au plus 5 objets de plus que ce qu’on a déposé, et 5 par jour : tu peux encore en prendre <b>' + B.retraitsRestants + '</b>.</p>';
    h += ids.length ? etageres(ids.map(function(k){ return caseObjet(k, { act:enJeu && B.retraitsRestants ? "bastprendre" : "aucun", cle:k, n:B.reserve[k], badge:B.reserve[k] === 1 ? 1 : null, fixe:!(enJeu && B.retraitsRestants) }); }), 5) : '<p>La réserve est vide : déposez des vivres et des matériaux !</p>';
    if(enJeu && B.retraitsRestants && ids.length) h += '<p class="sub">Touche un objet de la réserve pour en prendre 1.</p>';
    var mes = B.deposables.filter(function(k){ return OBJETS[k] && compter(k) > 0; });
    h += '<p class="titre-butin">🎒 Déposer depuis ton stock</p>' + (!enJeu ? '<p class="sub">Pendant une partie.</p>' : mes.length ? etageres(mes.map(function(k){ return caseObjet(k, { act:"bastdeposer", cle:k, n:compter(k), badge:compter(k) === 1 ? 1 : null }); }), 5) + '<p class="sub">Touche un objet de ton stock pour en déposer 1.</p>' : '<p class="sub">Rien à déposer (vivres, soins, munitions, matériaux).</p>');
  } else if(ongletBastion === "operations"){
    h += typeof contenuOperations === "function" ? contenuOperations(B) : "";
  } else if(ongletBastion === "defenses" || ongletBastion === "camion"){
    var LISTE = ongletBastion === "camion" ? CAMION_BASTION : DEF_BASTION;
    if(ongletBastion === "camion"){
      var tot = (B.def.parebuffle || 0) + (B.def.blindage || 0) + (B.def.tourelle || 0);
      h += '<img class="camion-img" src="images/camion' + ((B.def.parebuffle && B.def.blindage && B.def.tourelle) ? "-plein" : "") + '.webp" alt="" onerror="this.remove()"><p class="sub">Le camion du clan conduit chaque équipe à l’assaut. Ses améliorations servent à tous les membres.' + (tot ? "" : " Il est encore nu : améliore-le avec la réserve.") + '</p>';
    }
    // Raccord avec la DA (2026-11-11) : une case par défense (niveau en pastille, coche verte si on peut construire), la fiche de la case choisie dessous
    var cles = Object.keys(LISTE), peut = function(k){ var c = B.couts[k]; return c && Object.keys(c).every(function(m){ return (B.reserve[m] || 0) >= c[m]; }); };
    if(cles.indexOf(selDefBastion) < 0) selDefBastion = cles.filter(peut)[0] || cles[0];
    h += '<div class="bd-zone"><div class="bd-grille">' + cles.map(function(k){ var D = LISTE[k], l = B.def[k] || 0, max = B.max[k];
      return '<button class="bd-case' + (k === selDefBastion ? " sel" : "") + (l >= max ? " max" : "") + '" data-act="bastdef" data-id="' + k + '"><span class="bd-ico">' + ic(D.ico, D.icone) + (peut(k) ? '<i class="pret">✔</i>' : '') + '</span><b>' + D.nom + '</b><span class="bd-niv">' + l + ' / ' + max + '</span></button>'; }).join("") + '</div>';
    var k0 = selDefBastion, D0 = LISTE[k0], l0 = B.def[k0] || 0, c0 = B.couts[k0], max0 = B.max[k0];
    var pips = ''; for(var q = 0; q < max0; q++) pips += '<i class="' + (q < l0 ? "on" : "") + '"></i>';
    h += '<div class="bd-fiche"><div class="bd-tete"><span class="bd-ico grand">' + ic(D0.ico, D0.icone) + '</span><span><b>' + D0.nom + '</b><span class="bd-pips">' + pips + '</span><small>' + D0.effet(l0) + '</small></span></div>';
    if(c0){
      h += '<p class="titre-butin">Niveau ' + (l0 + 1) + ' : il faut dans la réserve</p><div class="ings2">' + Object.keys(c0).map(function(m){ var a = B.reserve[m] || 0; return '<span class="ing2 ' + (a >= c0[m] ? "ok" : "ko") + '"><span class="ing2-case">' + icone(m) + '</span><b>' + a + '/' + c0[m] + '</b><small>' + (NOM_COURT[m] || OBJETS[m].nom) + '</small></span>'; }).join("") + '</div>';
      h += '<button class="loc btn-jeu bd-go" data-act="bastconstruire" data-id="' + k0 + '"' + (peut(k0) ? "" : " disabled") + '><b>🔨 Construire</b><small>' + (peut(k0) ? "Payé par la réserve du clan" : "Il manque des matériaux dans la réserve") + '</small></button>';
    } else h += '<p class="etat ok">⭐ Niveau maximum</p>';
    h += '</div></div>';
  } else {
    // Raccord avec la DA (2026-11-11) : regroupé par jour, l'emoji de la ligne sort dans un médaillon coloré (rouge = pillé / perdu, vert = repoussé / construit…), l'heure en petit
    var jourPrec = "";
    h += B.journal.length ? '<div class="bj">' + B.journal.map(function(jl){
      var txt = jl.txt.replace(/\b(\d+) (\w+)/g, function(m0, n, k){ return OBJETS[k] ? nommer(k, +n) : m0; }).replace(/: (\w+) \(/, function(m0, k){ return ": " + (defBastion(k) ? defBastion(k).nom.toLowerCase() : k) + " ("; });
      var m = txt.match(/^(\p{Extended_Pictographic}(\uFE0F|\u200D\p{Extended_Pictographic})*)\s*/u), ico = m ? m[1] : "📜"; if(m) txt = txt.slice(m[0].length);
      var cls = /pillé|tombée?|quitté|perdu|exclu|détruit/i.test(txt) ? "b2" : /repoussé|gagn|construit|déposé|rejoint|fondé|victoire/i.test(txt) ? "g2" : "";
      var jr = typeof jourChat === "function" ? jourChat(jl.t) : "", sep = jr !== jourPrec ? '<p class="ch-jour"><span>' + jr + '</span></p>' : ""; jourPrec = jr;
      return sep + '<div class="lj bj-l ' + cls + '"><span class="lj-ico">' + ico + '</span><span class="lj-txt">' + (jl.qui ? '<b>' + echapper(jl.qui) + '</b> ' : '') + echapper(txt) + '</span><small class="bj-t">' + quand(jl.t) + '</small></div>';
    }).join("") + '</div>' : '<p>Rien pour l’instant.</p>';
  }
  show('<button class="lien-retour" data-act="clans">← Mon clan</button>' + h + BTN_FERMER());
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-cle") || b.getAttribute("data-id");
  var apres = function(d, ok){ if(d.erreur) msgBastion = "❌ " + d.erreur; else { etatBastion = d.bastion; noterTours(etatBastion.def.tours); msgBastion = ok; } render(); if(typeof sauver === "function") sauver(); afficherBastion(); };
  if(a === "bastion") openBastion();
  else if(a === "bastonglet"){ ongletBastion = id; afficherBastion(); }
  else if(a === "bastdef"){ selDefBastion = id; afficherBastion(); }
  else if(a === "bastdeposer"){
    if(!G || compter(id) < 1) return;
    var o = {}; o[id] = 1;
    appelClans({ action:"deposer", objets:o }).then(function(d){ if(!d.erreur){ retirer(id, 1); noterStatClan("depots"); } apres(d, "📦 Tu as déposé " + nommer(id, 1) + " dans la réserve."); }).catch(function(){ msgBastion = "❌ " + MSG_HORS_LIGNE; afficherBastion(); });
  }
  else if(a === "bastprendre"){
    appelClans({ action:"retirer", objet:id, n:1 }).then(function(d){ if(!d.erreur) ajouter(id, 1); apres(d, "🎒 Tu as pris " + nommer(id, 1) + " dans la réserve."); }).catch(function(){ msgBastion = "❌ " + MSG_HORS_LIGNE; afficherBastion(); });
  }
  else if(a === "bastconstruire") appelClans({ action:"construire", def:id }).then(function(d){ if(!d.erreur) noterStatClan("defenses"); apres(d, "🔨 " + defBastion(id).nom + " : niveau supérieur construit !"); });
});
// Au lancement : bonus des tours de guet de mon clan (lu une fois)
(function(){ if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return; setTimeout(function(){ appelClans({ action:"liste" }).then(function(d){ noterTours(d && d.monClan ? d.monClan.tours : 0); noterClan(!!(d && d.monClan)); }).catch(function(){}); }, 4000); })();

/* ---------- Guerres de clans (phase 3) ---------- */
var etatGuerre = null;
function tempsRestant(t){ var m = Math.max(0, Math.round((t - Date.now()) / 60000)); return m >= 60 ? Math.floor(m / 60) + " h " + (m % 60) + " min" : m + " min"; }
function openGuerre(msg){
  show('<h2>⚔️ La guerre</h2><p class="sub">Chargement…</p>' + BTN_FERMER());
  appelClans({ action:"guerre" }).then(function(d){ if(d.erreur){ show('<h2>⚔️ La guerre</h2><p>❌ ' + d.erreur + '</p>' + BTN_FERMER()); return; } etatGuerre = d; afficherGuerre(msg); })
    .catch(function(){ show('<h2>⚔️ La guerre</h2><p>' + MSG_HORS_LIGNE.replace("le classement", "la guerre") + '</p>' + BTN_FERMER()); });
}
function bandeauGuerre(W){
  return '<div class="gu-tete"><span class="gu-camp">' + blason(W.nous.blason) + '<b>' + echapper(W.nous.nom) + '</b>' + (W.nous.trophees !== undefined ? badgeLigue(W.nous.trophees, true) : '') + '<span class="gu-et">' + W.nous.etoiles + ' ★</span></span><span class="gu-vs">VS</span>'
    + '<span class="gu-camp">' + blason(W.eux.blason) + '<b>' + echapper(W.eux.nom) + '</b>' + (W.eux.trophees !== undefined ? badgeLigue(W.eux.trophees, true) : '') + '<span class="gu-et">' + W.eux.etoiles + ' ★</span></span></div>';
}
function afficherGuerre(msg){
  noterEtatGuerre(etatGuerre);
  if(etatGuerre && etatGuerre.bilan && etatGuerre.bilan.gagnees) noterStatClan("victoires", etatGuerre.bilan.gagnees, true);
  var d = etatGuerre, W = d.guerre, h = '<h2>⚔️ La guerre</h2>' + (msg ? '<p class="msg ' + (msg.charAt(0) === "❌" ? "" : "g2") + '">' + msg + '</p>' : '');
  if(d.bilan) h += '<p class="sub">Bilan du clan : ' + d.bilan.gagnees + ' victoire' + (d.bilan.gagnees > 1 ? "s" : "") + ', ' + d.bilan.perdues + ' défaite' + (d.bilan.perdues > 1 ? "s" : "") + ', ' + d.bilan.nulles + ' nulle' + (d.bilan.nulles > 1 ? "s" : "") + '.</p>';
  if(!W){
    if(d.derniere) h += '<div class="carte-guerre">' + bandeauGuerre(d.derniere) + '<p class="etat ' + (d.derniere.gagnant === "nous" ? "ok" : d.derniere.gagnant ? "ko" : "") + '">' + (d.derniere.gagnant === "nous" ? "🏆 Dernière guerre gagnée !" : d.derniere.gagnant ? "Dernière guerre perdue." : "Dernière guerre : match nul.") + (d.derniere.gainTrophees ? " (" + (d.derniere.gainTrophees > 0 ? "+" : "") + d.derniere.gainTrophees + " 🏆)" : "") + '</p></div>';
    if(!d.complet) h += '<p>🔒 Il faut <b>5 familles</b> dans le clan pour partir en guerre. Les clans incomplets ne peuvent ni attaquer ni être attaqués.</p>';
    else if(d.recherche) h += '<p>🔎 Le clan cherche un adversaire de sa taille… La guerre commencera dès qu’un autre clan complet sera prêt.</p>' + (d.chef ? '<button class="btn alt" style="width:100%;margin-bottom:8px" data-act="guerreannuler">Annuler la recherche</button>' : '');
    else h += '<p>Une guerre dure <b>3 jours</b>. Chaque jour, chaque membre peut lancer <b>un assaut</b> contre une famille adverse : un combat tactique contre ses défenseurs, ses mines et ses remparts. Les étoiles décident du vainqueur, et chaque victoire rapporte une part de la réserve adverse.</p><p class="sub">🏆 Ligues : une guerre gagnée rapporte +30 trophées, perdue −20, nulle +5. Tu n’affrontes qu’un clan de ta ligue (ou de la ligue voisine si personne d’autre n’attend) : Ferraille, Bronze (100), Argent (250), Or (450), Légende (700).</p>'
      + (d.chef ? '<button class="btn" style="width:100%;margin-bottom:8px" data-act="guerrechercher">⚔️ Chercher une guerre</button>' : '<p class="sub">Seul le chef peut lancer la recherche d’un adversaire.</p>');
    show(h + '<div class="row"><button class="btn alt" data-act="clans">⚔️ Mon clan</button><button class="btn" data-act="close">Fermer</button></div>'); return;
  }
  // Raccord avec la DA (2026-11-12) : infos en pastilles, familles adverses en cartes (état ou bouton Attaquer)
  h += bandeauGuerre(W) + '<div class="gu-infos"><span class="gu-i fort">Jour ' + W.jour + ' / 3</span><span class="gu-i">⏳ ' + (W.jour < 3 ? "nouveaux assauts dans " + tempsRestant(W.finJour) : "fin dans " + tempsRestant(W.fin)) + '</span><span class="gu-i">🧱 remparts ' + W.eux.remparts + '</span><span class="gu-i">💣 ' + W.eux.mines + ' mine' + (W.eux.mines > 1 ? "s" : "") + '</span></div>';
  var enJeu = typeof G !== "undefined" && G && G.ph === "game" && !G.cumule;
  h += '<p class="titre-butin">🎯 Familles adverses</p><div class="gu-cibles">' + W.cibles.map(function(c){
    var raison = !enJeu ? "Pendant une partie" : c.attaquee ? "Attaquée aujourd’hui" : W.dejaMoi ? "Ton assaut est fait" : "";
    return '<div class="gu-c' + (c.attaquee ? " faite" : "") + '">' + avatarHtml(c.avatar, c.pseudo || "?", "gu-av") + '<span class="gu-c-t"><b>' + echapper(c.pseudo || "?") + '</b><small>Jour ' + (c.jour || "?") + '</small></span>'
      + (raison ? '<span class="gu-etat' + (c.attaquee ? " ok" : "") + '">' + (c.attaquee ? "✔ " : "") + raison + '</span>' : '<button class="btn gu-go" data-act="guerreattaquer" data-id="' + echapper(c.id) + '">⚔️ Attaquer</button>') + '</div>';
  }).join("") + '</div>';
  if(W.dejaMoi) h += '<p class="sub">✅ Tu as lancé ton assaut aujourd’hui. Reviens demain !</p>';
  if(W.assauts.length) h += '<p class="titre-butin">📜 Assauts</p><div class="fil">' + W.assauts.map(function(s){ return '<div class="lj ' + (s.nous ? "bon" : "mauvais") + '"><span class="lj-ico">' + (s.nous ? "⚔️" : "🛡️") + '</span><span class="lj-txt">Jour ' + s.jour + ' : <b>' + echapper(s.qui) + '</b> attaque ' + echapper(s.cible) + ' → ' + (s.etoiles ? "★".repeat(s.etoiles) : "repoussé") + '</span></div>'; }).join("") + '</div>';
  show(h + '<div class="row"><button class="btn alt" data-act="clans">⚔️ Mon clan</button><button class="btn" data-act="close">Fermer</button></div>');
}
// Qui part à l'assaut : les 2 membres en état de sortir avec le plus de vie et d'énergie
function equipeAssaut(){ return G.m.map(function(x, i){ return i; }).filter(function(i){ var x = G.m[i]; return x.al && !x.raid && x.en >= BAL.energieAssaut && x.hp > 25; })
  .sort(function(a, b){ return (G.m[b].hp + G.m[b].en) - (G.m[a].hp + G.m[a].en); }).slice(0, BAL.membresParExpedition); }
function openAssaut(cible){
  var eq = equipeAssaut(), c = etatGuerre.guerre.cibles.find(function(x){ return x.id === cible; }) || {}, eg = eq.length ? equipGuerrePour(eq) : {};
  var porte = eq.map(function(j){ return eg[j] ? G.m[j].nom + " : " + eg[j].map(function(o){ return OBJETS[o.id].icone; }).join(" ") : ""; }).filter(Boolean);
  if(!eq.length){ afficherGuerre("❌ Personne n’a assez d’énergie (" + BAL.energieAssaut + " ⚡) ni de vie pour partir à l’assaut. Reviens après une nuit de repos."); return; }
  show('<h2>⚔️ Assaut sur ' + echapper(c.pseudo || "?") + '</h2><p>Partent à l’assaut : <b>' + liste(eq.map(function(i){ return G.m[i].nom; })) + '</b> (−' + BAL.energieAssaut + ' ⚡ chacun). Ils affronteront les défenseurs du bastion adverse, ses mines et ses remparts.</p>'
    + '<p class="sub">' + (porte.length ? "🎽 Équipement de guerre porté : " + porte.join(" · ") : "🎽 Aucun équipement de guerre (gilet, casque, bouclier) : fabrique-le à l’atelier.") + (etatGuerre.guerre.eux.armurerie ? " · 🦺 Les défenseurs ont une armurerie niveau " + etatGuerre.guerre.eux.armurerie + " : vise la tête !" : "") + '</p>'
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
  var b = bilanAssaut(); if(ETAT_GUERRE){ ETAT_GUERRE.fait = true; try{ localStorage.setItem("survival_etat_guerre", JSON.stringify(ETAT_GUERRE)); }catch(e){} }
  appelClans({ action:"finAssaut", assaut:b.assaut, victoire:b.victoire, etoiles:b.etoiles }).then(function(d){
    finirAssaut(); var butin = []; retourPiece = typeof dansUnClan === "function" && dansUnClan() ? "bastionSalle" : "salon"; // après un assaut : retour au bastion
    if(!d.erreur && b.etoiles){ noterStatClan("etoiles", b.etoiles); if(b.etoiles >= 3) noterStatClan("assauts3"); }
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

/* =====================================================================
   FINITIONS DES CLANS (phase 4) : classement des clans, alerte quand on est attaqué,
   cadres d'avatar débloqués par les succès (affichés à côté du pseudo partout)
   ===================================================================== */
var CADRES = [
  { id:"bois",    nom:"Bois",    min:0,  desc:"Le cadre de départ" },
  { id:"bronze",  nom:"Bronze",  min:5,  desc:"5 succès débloqués" },
  { id:"argent",  nom:"Argent",  min:10, desc:"10 succès débloqués" },
  { id:"or",      nom:"Or",      min:15, desc:"15 succès débloqués" },
  { id:"legende", nom:"Mythique", min:999, desc:"Tous les succès débloqués" } // s'appelait « Légende » avant le 2026-11-12 (le nom est pris par le n°1 du mois)
];
function nbSuccesSur(){ return typeof nbSucces === "function" ? nbSucces() : 0; }
function cadreMin(c){ return c.id === "legende" ? (typeof SUCCES !== "undefined" ? SUCCES.length : 18) : c.min; }
function cadreDebloque(c){ return nbSuccesSur() >= cadreMin(c); }
function cadreActif(){ var c = ""; try{ c = localStorage.getItem("survival_cadre") || ""; }catch(e){} var C = CADRES.find(function(x){ return x.id === c; }); return C && cadreDebloque(C) ? c : "bois"; }
// Le pseudo d'un joueur dans son cadre (classement, clan, guerre)
function pseudoCadre(p, cadre, estLegende){ var L = estLegende === undefined ? !!(LEGENDE && p && p === LEGENDE.pseudo) : estLegende;
  return '<span class="pcadre cadre-' + (cadre || "bois") + (L ? ' legende-mois' : '') + '">' + (L ? '<i class="couronne-l">' + ic("couronne", "👑") + '</i>' : '') + echapper(p || "?") + '</span>'; }
function openCadres(msg){
  var a = cadreActif(), n = nbSuccesSur(), ex = typeof iconeMembre === "function" ? iconeMembre({ nom:"Papa", r:"Papa", icone:"👨", al:true, hp:100, en:100, faim:100, soif:100 }) : "👤";
  show('<h2>🖼️ Mon cadre</h2>' + (msg ? '<p class="g2 msg">' + msg + '</p>' : '') + '<p class="sub">Ton cadre entoure ton pseudo dans le classement, les clans et les guerres. Débloque les plus beaux avec les succès (' + n + ' débloqués).</p>'
    + carteCadreLegende()
    + '<div class="cadres">' + CADRES.map(function(c){ var ok = cadreDebloque(c);
      return '<button class="cadre-choix' + (c.id === a ? " on" : "") + '" data-act="choixcadre" data-id="' + c.id + '"' + (ok ? "" : " disabled") + '><span class="cadre-ex cadre-' + c.id + '">' + ex + '</span><b>' + c.nom + '</b><small>' + (ok ? (c.id === a ? "✔ Porté" : c.desc) : "🔒 " + c.desc) + '</small></button>'; }).join("") + '</div>'
    + '<p class="sub">Aperçu : ' + pseudoCadre(lirePseudo() || "Ton pseudo", a) + '</p><button class="btn alt" style="width:100%" data-act="menu">↩️ Menu</button>');
}
function openClassementClans(){
  show('<h2>🏆 Classement des clans</h2><p class="sub" id="listeclans">Chargement…</p><div class="row"><button class="btn alt" data-act="clans">⚔️ Clans</button><button class="btn" data-act="close">Fermer</button></div>');
  appelClans({ action:"classementClans" }).then(function(d){
    var el = $("listeclans"); if(!el) return;
    if(!d.clans || !d.clans.length){ el.textContent = "Aucun clan pour l’instant."; return; }
    classementClansCache = d.clans;
    el.outerHTML = '<ol class="classement clans">' + d.clans.map(function(c, k){
      return '<li class="' + (c.moi ? "moi" : "") + '"><button class="cl-ligne" data-act="clanfichec" data-id="' + k + '" title="Voir le clan"><span class="rang">' + (k < 3 ? ic("medaille" + (k + 1), ["🥇","🥈","🥉"][k]) : (k + 1) + ".") + '</span>' + blason(c.blason) + '<b>' + echapper(c.nom) + ' <span class="cm-voir">›</span></b><span class="pts">' + badgeLigue(c.trophees, true) + '</span></button></li>';
    }).join("") + '</ol><p class="sub">' + d.total + ' clan' + (d.total > 1 ? "s" : "") + ' · rangés par trophées de ligue (' + LIGUES.map(function(L, i){ return insigneLigue(i) + ' ' + L.nom; }).join(', ') + ')' + (d.monRang ? " · ton clan est " + eme(d.monRang) : "") + '</p>';
  }).catch(function(){ var el = $("listeclans"); if(el) el.textContent = MSG_HORS_LIGNE; });
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
  if(a === "cadres") openCadres();
  else if(a === "choixcadre"){ try{ localStorage.setItem("survival_cadre", id); }catch(e2){} openCadres("🖼️ Cadre « " + CADRES.find(function(c){ return c.id === id; }).nom + " » porté !"); }
  else if(a === "classementclans") openClassementClans();
});
// Au lancement : ton clan a-t-il été attaqué depuis ta dernière visite ?
(function(){
  if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  setTimeout(function(){
    appelClans({ action:"guerre" }).then(function(d){
      var W = d && d.guerre; if(!W) return;
      var vu = 0; try{ vu = +localStorage.getItem("survival_vu_assauts") || 0; }catch(e){}
      var nouveaux = W.assauts.filter(function(s){ return !s.nous && s.t > vu; });
      var max = W.assauts.reduce(function(m, s){ return Math.max(m, s.t || 0); }, vu);
      try{ localStorage.setItem("survival_vu_assauts", max); }catch(e){}
      if(!vu || !nouveaux.length || typeof fileSucces === "undefined") return;
      nouveaux.slice(0, 3).forEach(function(s){ fileSucces.push({ icone:"⚔️", titre:"Ton clan est attaqué !", nom:s.qui + " a attaqué " + s.cible + (s.etoiles ? " (" + "★".repeat(s.etoiles) + ")" : " : repoussé !") }); });
      montrerSucces();
    }).catch(function(){});
  }, 6000);
})();

/* ---------- Compteurs des clans pour les succès (gardés d'une partie à l'autre) ---------- */
function statsClanTout(){ try{ return JSON.parse(localStorage.getItem("survival_stats_clan")) || {}; }catch(e){ return {}; } }
function statClan(k){ return statsClanTout()[k] || 0; }
function noterStatClan(k, n, max){ var s = statsClanTout(); s[k] = max ? Math.max(s[k] || 0, n) : (s[k] || 0) + (n || 1); try{ localStorage.setItem("survival_stats_clan", JSON.stringify(s)); }catch(e){} if(typeof verifierSucces === "function") verifierSucces(); }

/* ---------- Ligues de guerre (2026-11-10) ---------- */
var LIGUES = [ { nom:"Ferraille", min:0, icone:"🔩" }, { nom:"Bronze", min:100, icone:"🥉" }, { nom:"Argent", min:250, icone:"🥈" }, { nom:"Or", min:450, icone:"🥇" }, { nom:"Légende", min:700, icone:"👑" } ];
function ligueDe(t){ var k = 0; LIGUES.forEach(function(L, i){ if((t || 0) >= L.min) k = i; }); return k; }
// Pastille de ligue avec l'insigne peint (images/ligues/1..5.webp, Gemini, 2026-11-10)
function insigneLigue(k){ return '<img class="ligue-ins" src="images/ligues/' + (k + 1) + '.webp" alt="' + LIGUES[k].icone + '">'; }
function badgeLigue(t, court){ var k = ligueDe(t), L = LIGUES[k]; return '<span class="ligue l' + k + '" title="Ligue ' + L.nom + '">' + insigneLigue(k) + (court ? '' : ' ' + L.nom) + ' · ' + (t || 0) + ' 🏆</span>'; }

/* ---------- Avis des joueurs : signaler un bug, proposer une idée (2026-11-10, demande de Fabien) ----------
   Menu ☰ → « 💬 Avis / bug » : le type, le message, et (si la case est cochée) quelques infos techniques pour retrouver le bug.
   Envoyé à /api/avis, lu dans l'administration (onglet 💬 Avis). Rien n'est envoyé depuis l'ordinateur de test (localhost). */
var typeAvis = "bug", msgAvis = "";
function adresseAvis(){ return adresseClassement().replace("/api/classement", "/api/avis"); }
var TYPES_AVIS = { bug:["🐞", "Un bug", "Que s’est-il passé ? Sur quel écran ? Qu’attendais-tu ?"], idee:["💡", "Une idée", "Ton idée pour améliorer le jeu…"], autre:["💬", "Autre", "Ton message…"] };
function infosTechniques(){
  var v = ""; try{ v = (typeof VERSION_JEU !== "undefined" ? VERSION_JEU : "") || ""; }catch(e){}
  return { version:v, jour:typeof G !== "undefined" && G && G.day || 0, ecran:window.innerWidth + "×" + window.innerHeight, appareil:navigator.userAgent.slice(0, 160), page:typeof G !== "undefined" && G ? G.ph + (G.combat ? "/combat" : "") : "" };
}
function openAvis(){
  var T = TYPES_AVIS[typeAvis];
  var h = '<h2>💬 Ton avis compte</h2><p class="sub">Un bug, une idée, une remarque ? Écris-nous : chaque message est lu.</p>'
    + '<div class="tabs onglets">' + Object.keys(TYPES_AVIS).map(function(k){ var t = TYPES_AVIS[k]; return '<button class="tab' + (k === typeAvis ? " on" : "") + '" data-act="avistype" data-id="' + k + '">' + t[0] + '<small>' + t[1] + '</small></button>'; }).join("") + '</div>'
    + (msgAvis ? '<p class="msg ' + (msgAvis.charAt(0) === "✅" ? "g2" : "") + '">' + msgAvis + '</p>' : '')
    + '<textarea id="texteAvis" class="desc-clan" maxlength="1000" rows="5" placeholder="' + T[2] + '"></textarea><p class="sub" id="resteAvis"></p>'
    + '<label class="avis-case"><input type="checkbox" id="infosAvis" checked> Joindre les infos techniques (jour, taille d’écran, appareil) pour nous aider à retrouver le bug</label>'
    + '<div class="row"><button class="btn alt" data-act="menu">Retour</button><button class="btn" data-act="avisenvoyer">📨 Envoyer</button></div>';
  msgAvis = "";
  show(h);
  var t = document.getElementById("texteAvis"), r = document.getElementById("resteAvis"), maj = function(){ r.textContent = (1000 - t.value.length) + " lettres restantes"; };
  t.addEventListener("input", maj); maj();
}
function envoyerAvis(){
  var tx = document.getElementById("texteAvis"), texte = tx ? tx.value.trim() : "";
  if(texte.length < 5){ msgAvis = "❌ Écris un peu plus (5 lettres au moins)."; var garde = texte; openAvis(); document.getElementById("texteAvis").value = garde; return; }
  var corps = { id:idAppareil(), pseudo:lirePseudo(), type:typeAvis, texte:texte };
  if(document.getElementById("infosAvis") && document.getElementById("infosAvis").checked) corps.infos = infosTechniques();
  if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)){ msgAvis = "✅ (Test sur l’ordinateur : rien n’est envoyé au serveur.)"; openAvis(); return; }
  fetch(adresseAvis(), { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(corps) }).then(function(r){ return r.json(); })
    .then(function(d){ msgAvis = d.erreur ? "❌ " + d.erreur : "✅ Merci ! Ton message est bien arrivé."; openAvis(); if(d.erreur) document.getElementById("texteAvis").value = texte; })
    .catch(function(){ msgAvis = "❌ " + MSG_HORS_LIGNE; openAvis(); document.getElementById("texteAvis").value = texte; });
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
  if(a === "avis"){ typeAvis = "bug"; openAvis(); }
  else if(a === "avistype"){ var garde = (document.getElementById("texteAvis") || {}).value || ""; typeAvis = id; openAvis(); document.getElementById("texteAvis").value = garde; }
  else if(a === "avisenvoyer") envoyerAvis();
});


/* ---------- La Légende du mois (2026-11-12, idée de Fabien) ----------
   Le n°1 du classement du mois (parties classées) est « la Légende » : couronne à côté de son pseudo partout, carte dédiée,
   jauge pendant la partie, paliers annoncés la nuit, écran spécial et colis pour qui la détrône, bandeau pour le détrôné.
   Le serveur (worker/index.js, clé « saison ») remet la couronne en jeu le 1er de chaque mois ; l'ancienne Légende entre au panthéon.
   localStorage : survival_legende (dernière Légende connue), survival_etais_legende (« 1 » si c'était moi). */
// Couronne dessinée (portrait couronné de la Légende : cartes de la famille, carte du classement)
var COURONNE_SVG = '<svg viewBox="0 0 64 44"><path d="M4 38 L8 10 L22 24 L32 4 L42 24 L56 10 L60 38 Z" fill="#f7c948" stroke="#5a3a00" stroke-width="3" stroke-linejoin="round"/><rect x="4" y="34" width="56" height="8" rx="2" fill="#e0a33a" stroke="#5a3a00" stroke-width="3"/><circle cx="32" cy="22" r="4" fill="#d6453a" stroke="#5a3a00" stroke-width="2"/><circle cx="16" cy="28" r="3" fill="#3a8fd6" stroke="#5a3a00" stroke-width="2"/><circle cx="48" cy="28" r="3" fill="#3a8fd6" stroke="#5a3a00" stroke-width="2"/></svg>';
function medaillonLegende(src, taille){ return '<span class="lg-med" style="--t:' + (taille || 64) + 'px"><span class="lg-lueur"></span><span class="lg-anneau"></span><img src="' + src + '" alt=""><i class="lg-cour">' + COURONNE_SVG + '</i><span class="lg-eclat e1"></span><span class="lg-eclat e2"></span></span>'; }
var LEGENDE = (function(){ try{ return JSON.parse(localStorage.getItem("survival_legende") || "null"); }catch(e){ return null; } })();
function noterLegende(S){
  var L = S && S.legende ? { pseudo:S.legende.pseudo, score:S.legende.score, jours:S.legende.jours, moi:!!S.legende.moi, saison:S.id } : null;
  var etais = false; try{ etais = localStorage.getItem("survival_etais_legende") === "1"; }catch(e){}
  // J'étais la Légende et je ne le suis plus : bandeau au lancement
  if(etais && L && !L.moi && typeof fileSucces !== "undefined"){
    fileSucces.push({ icone:"👑", titre:"Tu as été détrôné !", nom:L.pseudo + " est la nouvelle Légende avec " + L.score + " points. Reprends ta couronne !" });
    if(typeof montrerSucces === "function") montrerSucces();
  }
  try{ localStorage.setItem("survival_etais_legende", L && L.moi ? "1" : "0"); localStorage.setItem("survival_legende", JSON.stringify(L)); }catch(e){}
  LEGENDE = L;
}
function verifierLegende(){
  try{ fetch(adresseClassement() + "?id=" + idAppareil()).then(function(r){ return r.json(); }).then(function(d){ if(d && d.saison) noterLegende(d.saison); }).catch(function(){}); }catch(e){}
}
setTimeout(verifierLegende, 1500);
// Réponse du serveur après l'envoi d'un score : couronne gagnée ?
function resultatLegende(S, el){
  if(S.devient){
    ecrireColis(lireColis() + 1);
    if(el) el.innerHTML = '<span class="go-legende">' + ic("couronne", "👑") + ' Tu es la nouvelle Légende du mois !' + (S.ancien ? ' Tu as détrôné ' + echapper(S.ancien) + '.' : '') + ' Un colis t’attend.</span>';
    if(typeof son === "function") son("succes"); if(typeof vibrer === "function") vibrer([100, 60, 100, 60, 300]);
  } else if(S.legende && el) el.innerHTML += ' <span class="go-legende">' + ic("couronne", "👑") + ' Tu restes la Légende du mois.</span>';
  verifierLegende();
}
// Jauge « toi contre la Légende » (partie classée seulement : seules elles comptent)
function barreLegende(){
  if(!LEGENDE || !G || !G.seed || G.ph !== "game") return "";
  if(LEGENDE.moi) return '<div class="lg-jauge moi"><span class="lg-j-t">' + ic("couronne", "👑") + ' Tu es la Légende du mois (' + LEGENDE.score + ' points). Défends ta couronne !</span></div>';
  var p = Math.min(100, Math.round((G.score || 0) / Math.max(1, LEGENDE.score) * 100));
  return '<div class="lg-jauge"><span class="lg-j-t">' + ic("couronne", "👑") + ' Légende : <b>' + echapper(LEGENDE.pseudo) + '</b> · ' + LEGENDE.score + ' pts</span><span class="lg-j-bar"><i style="width:' + p + '%"></i></span><small>Toi : ' + (G.score || 0) + ' pts (' + p + ' %)' + (p >= 100 ? ' · tu la dépasses !' : '') + '</small></div>';
}
// Paliers annoncés dans le bilan de la nuit (une fois chacun par partie)
function paliersLegende(n){
  if(!LEGENDE || LEGENDE.moi || !G || !G.seed) return;
  var p = (G.score || 0) / Math.max(1, LEGENDE.score), deja = G.legPalier || 0;
  var P = [[1, "👑 Tu as dépassé le record de la Légende (" + LEGENDE.pseudo + ", " + LEGENDE.score + " points) ! Tiens bon : la couronne sera à toi à la fin de cette partie."],
    [0.9, "👑 Plus que " + Math.max(1, LEGENDE.score - G.score) + " points pour détrôner la Légende !"],
    [0.75, "👑 Tu as fait les trois quarts du chemin vers le record de la Légende."],
    [0.5, "👑 Tu as dépassé la moitié du record de la Légende (" + LEGENDE.score + " points)."]];
  for(var i = 0; i < P.length; i++) if(p >= P[i][0]){ if(P[i][0] > deja){ n.unshift(["g2", P[i][1]]); G.legPalier = P[i][0]; } break; }
}

/* ---------- Raja, le tigre de la Légende (2026-11-12, idée de Fabien) ----------
   La Légende du mois (et elle seule, tant qu'elle a la couronne) peut lâcher Raja une fois par partie dans un combat :
   bouton « Lâcher le tigre » (ui.js), effet dans lacherTigre (logique.js), couché au salon (piece.js). */
var HISTOIRE_TIGRE = "Quand les villes sont tombées, le zoo de la ville a été abandonné du jour au lendemain. Les gardiens ont fui, les cages sont restées fermées. "
  + "Des semaines plus tard, un survivant a entendu des rugissements derrière les grilles rouillées : un tigre, affamé, qui se jetait contre les barreaux. "
  + "Chaque nuit, il est revenu lui glisser un peu de viande, sans jamais ouvrir la cage. Au bout d’un mois, le tigre a cessé de gronder quand il approchait. "
  + "Le jour où il a ouvert la porte, le tigre ne l’a pas dévoré : il l’a suivi. On l’appelle Raja. On dit qu’il ne reste qu’auprès du plus grand survivant de son temps… "
  + "et qu’il change de maître le jour où quelqu’un fait mieux que lui.";
function tigreLegende(){ return !!(LEGENDE && LEGENDE.moi); }
function openTigre(){
  var dispo = tigreLegende() && typeof tigreUtilise === "function" && !(G && G.ph === "game" && tigreUtilise());
  show('<div class="banniere"><img src="images/tigre-zoo.webp" alt="" onerror="this.parentNode.remove()"></div><div class="tg-tete"><img src="images/portrait-tigre.webp" alt=""><span><small>Le tigre de la Légende</small><b>Raja</b><em>' + (tigreLegende() ? (dispo ? "🐅 Prêt à bondir dans cette partie" : "Il a déjà bondi dans cette partie") : "Il suit la Légende du mois") + '</em></span></div>'
    + '<p class="msg">' + HISTOIRE_TIGRE + '</p>'
    + '<p class="titre-butin">Ce qu’il fait</p><p class="sub">Une fois par partie, dans n’importe quel combat (expédition, raid de l’immeuble, zombie célèbre, assaut de guerre), le bouton « Lâcher le tigre » fait bondir Raja : tous les zombies tombent ; le Colosse et les zombies célèbres perdent ' + Math.round(BAL.tigre.boss * 100) + ' % de leur vie ; en guerre de clans, chaque défenseur perd ' + Math.round(BAL.tigre.guerre * 100) + ' % de sa vie. Détrônée, la Légende perd Raja.</p>'
    + BTN_FERMER());
}

/* ---------- Pastille de guerre sur l'écran principal (2026-11-12, idée de Fabien) ----------
   À côté de la pastille de mission : « ⚔️ Guerre : ton assaut » tant que je n'ai pas fait mon assaut du jour,
   ou « ⚔️ Lancer une guerre » pour le chef d'un clan complet qui ne cherche pas encore. État gardé dans survival_etat_guerre,
   relu au lancement puis toutes les 5 minutes (seulement si je suis dans un clan). */
var ETAT_GUERRE = (function(){ try{ return JSON.parse(localStorage.getItem("survival_etat_guerre") || "null"); }catch(e){ return null; } })();
function noterEtatGuerre(d){
  if(!d || d.erreur) return;
  var W = d.guerre && !d.guerre.fini ? d.guerre : null;
  ETAT_GUERRE = { guerre:!!W, fait:!!(W && W.dejaMoi), jour:W ? W.jour : 0, finJour:W ? W.finJour : 0, chef:!!d.chef, complet:!!d.complet, recherche:!!d.recherche, t:Date.now() };
  try{ localStorage.setItem("survival_etat_guerre", JSON.stringify(ETAT_GUERRE)); }catch(e){}
  if(typeof G !== "undefined" && G && G.ph === "game" && !document.querySelector("#modal[style*='flex']") && typeof render === "function") render();
}
function verifierGuerre(){
  if(typeof dansUnClan === "function" && !dansUnClan()){ ETAT_GUERRE = null; return; }
  if(typeof enRaid === "function" && enRaid()) return;
  try{ appelClans({ action:"guerre" }).then(noterEtatGuerre).catch(function(){}); }catch(e){}
}
setTimeout(verifierGuerre, 5000); setInterval(verifierGuerre, 300000);
function pastilleGuerre(pc){
  var E = ETAT_GUERRE; if(!E || (typeof dansUnClan === "function" && !dansUnClan())) return "";
  if(E.finJour && Date.now() > E.finJour){ E.fait = false; } // un nouveau jour de guerre a commencé : nouvel assaut possible
  var txt = null, sous = "";
  if(E.guerre && !E.fait){ txt = "⚔️ Guerre : ton assaut"; sous = "Jour " + E.jour + " sur 3 · ton clan compte sur toi"; }
  else if(!E.guerre && E.chef && E.complet && !E.recherche){ txt = "⚔️ Lancer une guerre"; sous = "Ton clan est complet : inscris-le"; }
  if(!txt) return "";
  return pc ? '<button class="loc pret-guerre" data-act="guerre"><b>' + txt + '</b><small>' + sous + '</small></button>'
    : '<button class="btn alt pret pret-guerre" style="flex:0 0 auto" data-act="guerre">' + txt + '</button>';
}

/* ---------- Mon profil (2026-11-12, idée de Fabien) ----------
   Pseudo, avatar (un portrait du jeu, gardé d'une partie à l'autre et visible dans le classement et les clans),
   cadre, chiffres de toutes les parties, historique des 20 dernières parties, comptes à lier (à venir).
   localStorage : survival_avatar, survival_historique. Un avatar envoyé par le joueur viendra plus tard (il faudra une modération). */
var AVATARS = [
  ["La famille", ["papa", "maman", "leo", "emma"]],
  ["Les recrues", ["sam", "nora", "ines", "yanis"]],
  ["Les rencontres", ["marco", "marchand", "roux", "fillette", "precheur", "mere", "chefcamp", "pillard", "blesse", "convoi", "detresse", "pere"]],
  ["Les zombies", ["rodeur", "coureur", "costaud", "rampant", "hurleur", "gonfle", "soldat"]]
];
function avatarValide(a){ return AVATARS.some(function(g){ return g[1].indexOf(a) >= 0; }); }
function lireAvatar(){ var a = ""; try{ a = localStorage.getItem("survival_avatar") || ""; }catch(e){} return avatarValide(a) ? a : ""; }
// Avatar d'un joueur : son portrait choisi, sinon la pastille ronde avec son initiale (comme dans la discussion)
function avatarHtml(a, pseudo, cls){
  if(a && avatarValide(a)) return '<span class="av-img ' + (cls || "") + '" aria-hidden="true"><img src="images/portrait-' + a + '.webp" alt=""></span>';
  if(typeof avatarChat === "function") return avatarChat(pseudo).replace('class="ch-av"', 'class="ch-av ' + (cls || "") + '"');
  return '';
}
function lireHistorique(){ try{ return JSON.parse(localStorage.getItem("survival_historique") || "[]") || []; }catch(e){ return []; } }
function noterHistorique(){
  if(!G || !G.stats) return;
  var H = lireHistorique();
  H.unshift({ t:Date.now(), score:G.score || 0, jours:Math.max(0, G.day - 1), classee:!!G.seed, morts:(G.dd || []).length, zombies:G.stats.zombies || 0 });
  try{ localStorage.setItem("survival_historique", JSON.stringify(H.slice(0, 20))); }catch(e){}
}
var ongletProfil = "profil";
function openProfil(msg){
  var p = lirePseudo(), a = lireAvatar(), J = statsJoueur(), H = lireHistorique(), cad = CADRES.find(function(c){ return c.id === cadreActif(); }) || CADRES[0];
  var h = '<button class="lien-retour" data-act="menu">← Menu</button>'
    + '<div class="pf-tete"><button class="pf-av" data-act="pfonglet" data-id="avatar" aria-label="Changer d’avatar">' + avatarHtml(a, p || "?", "pf-grand") + '<i>Changer</i></button>'
    + '<span class="pf-id"><small>Mon profil</small><b>' + (p ? pseudoCadre(p, cadreActif()) : '<em>Pas encore de pseudo</em>') + '</b>'
    + boutonPseudo(p) + '</span></div>'
    + (msg ? '<p class="msg g2 pf-msg">' + msg + '</p>' : '')
    + '<div class="tabs onglets pf-onglets">' + [["profil", "👤 Profil", "Mes chiffres"], ["avatar", "🖼️ Avatar", "Un portrait"], ["historique", "📜 Historique", H.length + " partie" + (H.length > 1 ? "s" : "")]].map(function(o){
      return '<button class="tab' + (o[0] === ongletProfil ? " on" : "") + '" data-act="pfonglet" data-id="' + o[0] + '">' + o[1] + '<small>' + o[2] + '</small></button>'; }).join("") + '</div>';
  if(ongletProfil === "avatar"){
    h += '<p class="sub">Ton avatar s’affiche dans le classement et dans ton clan. Il reste le même d’une partie à l’autre.</p>';
    h += AVATARS.map(function(g){ return '<p class="titre-butin">' + g[0] + '</p><div class="pf-grille">' + g[1].map(function(id){
      return '<button class="pf-choix' + (id === a ? " on" : "") + '" data-act="pfavatar" data-id="' + id + '" aria-label="Choisir ce portrait"><img src="images/portrait-' + id + '.webp" alt=""></button>'; }).join("") + '</div>'; }).join("");
    h += '<button class="lien pf-sans" data-act="pfavatar" data-id="">Revenir à l’initiale de mon pseudo</button>';
  } else if(ongletProfil === "historique"){
    if(!H.length) h += '<p class="msg">Ton historique se remplira à la fin de ta première famille.</p>';
    else h += '<div class="pf-histo">' + H.map(function(x){ var d = new Date(x.t);
      return '<div class="pf-h"><span class="pf-h-d">' + d.getDate() + ' ' + MOIS_FR[d.getMonth()].slice(0, 4).replace(/\.$/, "") + '.</span><span class="pf-h-t"><b>⭐ ' + x.score + ' points</b><small>' + x.jours + ' jour' + (x.jours > 1 ? "s" : "") + ' tenus · ' + x.zombies + ' zombie' + (x.zombies > 1 ? "s" : "") + ' · ' + x.morts + ' mort' + (x.morts > 1 ? "s" : "") + '</small></span><span class="pf-h-m' + (x.classee ? " cl" : "") + '">' + (x.classee ? "Classée" : "Libre") + '</span></div>'; }).join("") + '</div>';
  } else {
    h += tuiles([["familles", J.parties || 0], ["meilleur score", (J.meilleur || 0) + " ⭐", "ok"], ["plus longue survie", (J.plusLongue || 0) + " j"], ["zombies abattus", J.zombies || 0]]).replace('class="tuiles', 'class="tuiles t4 pf-tuiles');
    h += '<div class="pf-lignes"><button class="loc" data-act="cadres"><b>🖼️ Mon cadre : ' + cad.nom + '</b><small>Débloque de nouveaux cadres avec les succès</small></button>'
      + '<button class="loc" data-act="stats"><b>📊 Toutes mes stats</b><small>Poissons, planches, missions, morts…</small></button></div>';
    h += '<p class="titre-butin">🔗 Retrouver ma partie partout</p><div class="pf-comptes">'
      + ['Google', 'Apple', 'Steam'].map(function(n){ return '<button class="pf-compte" disabled>' + n + '<small>bientôt</small></button>'; }).join("") + '</div>'
      + '<p class="sub">Pour l’instant, ta partie est gardée sur cet appareil. Lier un compte permettra de la retrouver sur ton téléphone, ta tablette et ton ordinateur.</p>';
  }
  show(h + BTN_FERMER());
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act");
  if(a === "profil"){ ongletProfil = "profil"; openProfil(); }
  else if(a === "pfonglet"){ ongletProfil = b.getAttribute("data-id"); openProfil(); }
  else if(a === "pfavatar"){ var id = b.getAttribute("data-id"); try{ localStorage.setItem("survival_avatar", id); }catch(err){} ongletProfil = "avatar"; openProfil(id ? "Nouvel avatar choisi. Il apparaîtra dans le classement à ton prochain score envoyé." : "Ton avatar est revenu à l’initiale de ton pseudo."); }
});

// Le cadre de la Légende dans « Mon cadre » (2026-11-12, idée de Fabien) : en tête, pour donner envie de le gagner ; il ne se choisit pas, il se gagne
function carteCadreLegende(){
  var L = LEGENDE, moi = !!(L && L.moi), av = lireAvatar() || "papa";
  return '<div class="cadre-leg' + (moi ? " porte" : "") + '">' + medaillonLegende("images/portrait-" + av + ".webp", 58)
    + '<span class="cl-t"><small>Le cadre le plus rare</small><b>' + pseudoCadre(lirePseudo() || "Ton pseudo", cadreActif(), true) + '</b>'
    + '<em>' + (moi ? "✔ Tu le portes : tu es la Légende du mois. Raja te suit." : "🔒 Réservé à la Légende du mois" + (L ? " (aujourd’hui " + echapper(L.pseudo) + ", " + L.score + " points)" : "") + ". Fais le meilleur score du mois en partie classée pour le porter, avec Raja en prime.") + '</em></span></div>';
}

// Changer de pseudo (2026-11-12, remarque de Fabien : en guerre de clans on ne saurait plus qui est qui) :
// une fois tous les 30 jours et jamais pendant une guerre ; le premier choix est libre. Le serveur applique la même règle aux clans.
var PSEUDO_DELAI_J = 30;
function datePseudo(){ try{ return +localStorage.getItem("survival_pseudo_t") || 0; }catch(e){ return 0; } }
function raisonPseudoBloque(){
  if(!lirePseudo()) return "";
  if(ETAT_GUERRE && ETAT_GUERRE.guerre && typeof dansUnClan === "function" && dansUnClan()) return "Pas pendant une guerre de clans";
  var reste = Math.ceil((datePseudo() + PSEUDO_DELAI_J * 86400000 - Date.now()) / 86400000);
  return reste > 0 ? "Prochain changement dans " + reste + " jour" + (reste > 1 ? "s" : "") : "";
}
function boutonPseudo(p){
  var r = raisonPseudoBloque();
  return '<button class="btn alt pf-mini" data-act="saisie" data-id="p" data-retour="profil"' + (r ? " disabled" : "") + '>✏️ ' + (p ? "Changer de pseudo" : "Choisir un pseudo") + '</button>'
    + '<small class="pf-regle">' + (r ? r + " · " : "") + (p ? "un changement tous les " + PSEUDO_DELAI_J + " jours, jamais en guerre" : "") + '</small>';
}
