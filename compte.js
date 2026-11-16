/* =====================================================================
   COMPTES JOUEURS (2026-11-16) : se connecter avec Google pour retrouver sa partie sur un autre appareil.
   Serveur : worker/compte.mjs (/api/compte). Chargé après classement.js.
   - Connexion : bouton Google (Google Identity Services) dans Mon profil → jeton Google → le serveur le vérifie et
     renvoie une session (« survival_compte » : jeton, idJoueur, nom). L'identifiant de joueur du compte remplace celui
     de l'appareil (classement, clans, avant-poste suivent le joueur, pas l'appareil).
   - Sauvegarde : toutes les clés « survival_… » du navigateur (sauf celles propres à l'appareil), envoyées au plus toutes
     les 60 s quand elles ont changé, et quand la page passe en arrière-plan.
   - Plusieurs appareils restent connectés (2026-11-16) : au lancement et au retour sur la page, le jeu demande au serveur
     la date de la dernière sauvegarde ; si un autre appareil a joué depuis et que la partie d'ici n'a pas bougé, elle est
     reprise toute seule (bandeau « Partie reprise depuis ton téléphone ») ; si les deux ont joué, le joueur choisit.
   ===================================================================== */
var GOOGLE_CLIENT_ID = "570011998343-473gla1lkci91v7oamt8lc45edt8hr3h.apps.googleusercontent.com"; // identifiant client Google (Google Cloud → Identifiants), public ; vide = bouton « bientôt »
var CLE_COMPTE = "survival_compte";
var CLES_LOCALES = ["survival_compte", "survival_appareil", "survival_compte_hashp", "survival_compte_repris", "survival_id", "survival_monde_cache", "survival_ap_envoi", "survival_maintenance_passe", "survival_transfere", "survival_compte_hash"];
function lireCompteLocal(){ try{ return JSON.parse(localStorage.getItem(CLE_COMPTE) || "null"); }catch(e){ return null; } }
function ecrireCompteLocal(c){ try{ if(c) localStorage.setItem(CLE_COMPTE, JSON.stringify(c)); else localStorage.removeItem(CLE_COMPTE); }catch(e){} }
function compteConnecte(){ var c = lireCompteLocal(); return !!(c && c.jeton); }
function adresseCompte(){ return (/(^|\.)zombria\.com$/.test(location.hostname) ? "" : (typeof SITE_JEU !== "undefined" ? SITE_JEU : "https://zombria.com")) + "/api/compte"; }
function appelCompte(corps){
  return fetch(adresseCompte(), { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(corps), keepalive:!!corps.keepalive })
    .then(function(r){ return r.json(); });
}
// Les données à garder sur le compte : toutes les clés « survival_… » sauf celles propres à l'appareil
function donneesLocales(){
  var d = {};
  try{ for(var i = 0; i < localStorage.length; i++){ var k = localStorage.key(i); if(k && k.indexOf("survival_") === 0 && CLES_LOCALES.indexOf(k) < 0) d[k] = localStorage.getItem(k); } }catch(e){}
  return d;
}
// Identifiant de CET appareil (survival_id devient celui du compte une fois connecté, le même partout)
function idPoste(){
  var id = null; try{ id = localStorage.getItem("survival_appareil"); }catch(e){}
  if(!id){ id = ""; for(var k = 0; k < 16; k++) id += "abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 36)); try{ localStorage.setItem("survival_appareil", id); }catch(e){} }
  return id;
}
function nomPoste(){ var u = navigator.userAgent || ""; return /iPad|Tablet/i.test(u) ? "tablette" : /Mobi|Android|iPhone/i.test(u) ? "téléphone" : "ordinateur"; }
function nomPosteAffiche(n){ return n === "tablette" ? trad("ta tablette") : n === "téléphone" ? trad("ton téléphone") : n === "ordinateur" ? trad("ton ordinateur") : trad("un autre appareil"); }
function empreintePartie(){ var p = ""; try{ p = localStorage.getItem("survival_partie") || ""; }catch(e){} return empreinte(p); }
function noterPartieSynchro(){ try{ localStorage.setItem("survival_compte_hashp", empreintePartie()); }catch(e){} }
function partieInchangee(){ var h = null; try{ h = localStorage.getItem("survival_compte_hashp"); }catch(e){} return h === empreintePartie(); }
function empreinte(s){ var h = 0; for(var i = 0; i < s.length; i++){ h = (h * 31 + s.charCodeAt(i)) | 0; } return String(h); }
function jourLocal(){ try{ var p = JSON.parse(localStorage.getItem("survival_partie") || "null"); return p && p.G ? p.G.day || 0 : (p && p.day) || 0; }catch(e){ return 0; } }

/* ---------- Envoi de la sauvegarde ---------- */
var compteEnvoiT = 0, compteSessionPerdue = false;
function envoyerSauvegarde(force, keepalive, ecraser){
  var c = lireCompteLocal(); if(!c || !c.jeton || compteSessionPerdue || c.enAttente) return Promise.resolve(null); // enAttente : le joueur n'a pas encore choisi quelle partie garder
  if(typeof G !== "undefined" && G && G.bacASable) return Promise.resolve(null); // pas pendant le raid de l'immeuble
  var d = donneesLocales(), brut = JSON.stringify(d), h = empreinte(brut), avant = null;
  try{ avant = localStorage.getItem("survival_compte_hash"); }catch(e){}
  if(!force && h === avant) return Promise.resolve(null);
  if(!force && Date.now() - compteEnvoiT < 60000) return Promise.resolve(null);
  compteEnvoiT = Date.now();
  return appelCompte({ action:"sauver", jeton:c.jeton, donnees:d, jour:jourLocal(), base:c.derniere || 0, force:!!ecraser, nomAppareil:nomPoste(), keepalive:keepalive }).then(function(r){
    if(r && r.session === false){ sessionPerdue(); return r; }
    if(r && r.conflit){ conflitCompte(r.save); return r; }
    if(r && r.ok){ try{ localStorage.setItem("survival_compte_hash", h); }catch(e){} noterPartieSynchro(); c.derniere = r.t; ecrireCompteLocal(c); }
    return r;
  }).catch(function(){ return null; });
}
function sessionPerdue(){
  if(compteSessionPerdue) return; compteSessionPerdue = true;
  if(typeof fileSucces !== "undefined") fileSucces.push({ icone:"🔗", titre:trad("Tu as été déconnecté de ton compte"), nom:trad("Cette partie n’est plus enregistrée sur ton compte. Reconnecte-toi dans Mon profil.") }); if(typeof montrerSucces === "function") montrerSucces();
}
/* ---------- Une partie plus récente sur un autre appareil ? ---------- */
var compteVerifT = 0;
function verifierCompte(){
  var c = lireCompteLocal(); if(!c || !c.jeton || c.enAttente || compteSessionPerdue) return;
  if(typeof G !== "undefined" && G && G.bacASable) return;
  if(Date.now() - compteVerifT < 15000) return; compteVerifT = Date.now();
  appelCompte({ action:"etat", jeton:c.jeton }).then(function(r){
    if(!r) return; if(r.session === false){ sessionPerdue(); return; }
    if(!r.t || r.t === c.derniere || r.appareil === r.moi || r.t < (c.derniere || 0)) return;
    if(partieInchangee()) reprendrePartieCompte(r); // rien n'a été joué ici depuis : on prend la partie la plus récente
    else conflitCompte(r);                          // les deux appareils ont joué : le joueur choisit
  }).catch(function(){});
}
function conflitCompte(S){
  var c = lireCompteLocal(); if(!c || !S) return;
  c.enAttente = true; ecrireCompteLocal(c);
  var jl = jourLocal();
  show('<div class="cpt"><h2>🔗 ' + trad("Ta partie a avancé sur un autre appareil") + '</h2><p class="msg">' + trad("Tu as aussi joué ici depuis. Laquelle veux-tu garder ? L’autre sera remplacée.") + '</p>'
    + '<div class="cpt-choix"><button class="loc" data-act="cptReprendre"><b>☁️ ' + trad("Celle de {app}", { app:nomPosteAffiche(S.nomAppareil) }) + '</b><small>' + (S.jour ? trad("Jour {n}", { n:S.jour }) + " · " : "") + trad("enregistrée {t}", { t:compteQuand(S.t) }) + '</small></button>'
    + '<button class="loc" data-act="cptGarder"><b>📱 ' + trad("Celle de cet appareil") + '</b><small>' + (jl ? trad("Jour {n}", { n:jl }) + " · " : "") + trad("elle remplacera celle du compte") + '</small></button></div></div>');
}
setTimeout(verifierCompte, 2500);
document.addEventListener("visibilitychange", function(){ try{ if(document.visibilityState === "visible") verifierCompte(); }catch(e){} });
// Après une reprise automatique : bandeau « Partie reprise depuis ton téléphone »
setTimeout(function(){
  var r = null; try{ r = JSON.parse(localStorage.getItem("survival_compte_repris") || "null"); localStorage.removeItem("survival_compte_repris"); }catch(e){}
  if(r && typeof fileSucces !== "undefined") fileSucces.push({ icone:"☁️", titre:trad("Partie reprise depuis {app}", { app:nomPosteAffiche(r.app) }), nom:r.jour ? trad("Tu continues au jour {n}.", { n:r.jour }) : "" }); if(r && typeof montrerSucces === "function") montrerSucces();
}, 3000);
setInterval(function(){ try{ if(compteConnecte()) envoyerSauvegarde(false); }catch(e){} }, 20000);
document.addEventListener("visibilitychange", function(){ try{ if(document.visibilityState === "hidden" && compteConnecte()){ compteEnvoiT = 0; envoyerSauvegarde(false, true); } }catch(e){} });

/* ---------- Connexion ---------- */
function apresConnexionGoogle(rep){
  appelCompte({ action:"connexion", credential:rep && rep.credential, id:idPoste(), nomAppareil:nomPoste() }).then(function(r){
    if(!r || r.erreur){ compteMsg("❌ " + trad((r && r.erreur) || "Connexion impossible pour l’instant.")); return; }
    compteSessionPerdue = false;
    var c = { jeton:r.jeton, idJoueur:r.idJoueur, nom:r.nom || "", depuis:Date.now() };
    var S = r.sauvegarde, jl = jourLocal(), aPartie = false; try{ aPartie = !!localStorage.getItem("survival_partie"); }catch(e){}
    if(S && S.t){
      // une partie est déjà sur le compte : laquelle garder ? (rien n'est envoyé avant le choix)
      c.enAttente = true; ecrireCompteLocal(c);
      show('<div class="cpt"><h2>🔗 ' + trad("Une partie est enregistrée sur ton compte") + '</h2>'
        + '<div class="cpt-choix"><button class="loc" data-act="cptReprendre"><b>☁️ ' + trad("Reprendre la partie du compte") + '</b><small>' + (S.jour ? trad("Jour {n}", { n:S.jour }) + " · " : "") + trad("enregistrée {t}", { t:compteQuand(S.t) }) + '</small></button>'
        + (aPartie ? '<button class="loc" data-act="cptGarder"><b>📱 ' + trad("Garder la partie de cet appareil") + '</b><small>' + (jl ? trad("Jour {n}", { n:jl }) + " · " : "") + trad("elle remplacera celle du compte") + '</small></button>' : '') + '</div></div>');
      return;
    }
    ecrireCompteLocal(c); try{ localStorage.setItem("survival_id", r.idJoueur); }catch(e){}
    envoyerSauvegarde(true).then(function(){ compteMsg("✅ " + trad("Connecté : ta partie est maintenant enregistrée sur ton compte.")); if(typeof openProfil === "function") openProfil(); });
  }).catch(function(){ compteMsg("❌ " + trad("Connexion impossible pour l’instant.")); });
}
function compteQuand(t){ var m = Math.round((Date.now() - t) / 60000); return m < 1 ? trad("à l’instant") : m < 60 ? trad("il y a {n} min", { n:m }) : m < 1440 ? trad("il y a {n} h", { n:Math.round(m / 60) }) : trad("il y a {n} j", { n:Math.round(m / 1440) }); }
var compteMessage = "";
function compteMsg(t){ compteMessage = t; if(typeof openProfil === "function") openProfil(); }
function reprendrePartieCompte(auto){
  var c = lireCompteLocal(); if(!c) return;
  appelCompte({ action:"charger", jeton:c.jeton }).then(function(r){
    if(!r || r.erreur || !r.donnees){ compteMsg("❌ " + trad((r && r.erreur) || "Connexion impossible pour l’instant.")); return; }
    window.pasDeSauvegarde = true; // sinon la partie encore ouverte s'enregistre par-dessus en quittant la page
    try{
      // on remplace les données du jeu par celles du compte (sauf ce qui est propre à cet appareil)
      var garder = {}; CLES_LOCALES.forEach(function(k){ var v = localStorage.getItem(k); if(v != null) garder[k] = v; });
      var aEffacer = []; for(var i = 0; i < localStorage.length; i++){ var k = localStorage.key(i); if(k && k.indexOf("survival_") === 0 && CLES_LOCALES.indexOf(k) < 0) aEffacer.push(k); }
      aEffacer.forEach(function(k){ localStorage.removeItem(k); });
      for(var k2 in r.donnees) localStorage.setItem(k2, r.donnees[k2]);
      localStorage.setItem("survival_id", r.idJoueur || c.idJoueur);
      delete c.enAttente; c.derniere = r.t; ecrireCompteLocal(c);
      localStorage.setItem("survival_compte_hash", empreinte(JSON.stringify(donneesLocales())));
      noterPartieSynchro();
      if(auto) localStorage.setItem("survival_compte_repris", JSON.stringify({ app:r.nomAppareil || auto.nomAppareil || "", jour:r.jour || 0 }));
    }catch(e){}
    location.reload();
  }).catch(function(){ compteMsg("❌ " + trad("Connexion impossible pour l’instant.")); });
}
function garderPartieAppareil(){
  var c = lireCompteLocal(); if(!c) return;
  delete c.enAttente; ecrireCompteLocal(c);
  try{ localStorage.setItem("survival_id", c.idJoueur); }catch(e){}
  envoyerSauvegarde(true, false, true).then(function(){ compteMsg("✅ " + trad("Connecté : ta partie est maintenant enregistrée sur ton compte.")); });
}
function deconnecterCompte(){
  var c = lireCompteLocal(); if(c && c.jeton) appelCompte({ action:"deconnexion", jeton:c.jeton }).catch(function(){});
  ecrireCompteLocal(null); compteMsg("👋 " + trad("Déconnecté. Ta partie reste sur cet appareil."));
}
function supprimerCompte(){
  var c = lireCompteLocal(); if(!c) return;
  appelCompte({ action:"supprimer", jeton:c.jeton }).then(function(){ ecrireCompteLocal(null); compteMsg("🗑️ " + trad("Ton compte et sa sauvegarde ont été supprimés du serveur. Ta partie reste sur cet appareil.")); })
    .catch(function(){ compteMsg("❌ " + trad("Connexion impossible pour l’instant.")); });
}

/* ---------- Bloc « Retrouver ma partie partout » de Mon profil ---------- */
function blocCompte(){
  var c = lireCompteLocal(), h = '<p class="titre-butin">🔗 ' + trad("Retrouver ma partie partout") + '</p>';
  if(compteMessage){ h += '<p class="msg">' + compteMessage + '</p>'; compteMessage = ""; }
  if(c && c.jeton && c.enAttente){ // connexion faite, mais le choix de la partie n'est pas encore fait
    return h + '<p class="msg">' + trad("Choisis quelle partie garder : celle de ton compte ou celle de cet appareil.") + '</p><div class="cpt-choix"><button class="loc" data-act="cptReprendre"><b>☁️ ' + trad("Reprendre la partie du compte") + '</b></button><button class="loc" data-act="cptGarder"><b>📱 ' + trad("Garder la partie de cet appareil") + '</b></button></div>';
  }
  if(c && c.jeton && !compteSessionPerdue){
    h += '<div class="cpt-ok"><span class="cpt-g">G</span><span><b>' + trad("Connecté avec Google") + (c.nom ? " · " + echapCompte(c.nom) : "") + '</b><small>' + (c.derniere ? trad("Partie enregistrée {t}", { t:compteQuand(c.derniere) }) : trad("Enregistrement en cours…")) + '</small></span></div>'
      + '<div class="cpt-bts"><button class="btn alt" data-act="cptDeco">' + trad("Se déconnecter") + '</button><button class="btn alt cpt-suppr" data-act="cptSuppr">' + trad("Supprimer mon compte") + '</button></div>';
    return h;
  }
  if(compteSessionPerdue) h += '<p class="msg b2">' + trad("Tu as été déconnecté de ton compte. Reconnecte-toi pour enregistrer ta partie.") + '</p>';
  if(!GOOGLE_CLIENT_ID){
    return h + '<div class="pf-comptes">' + ['Google', 'Apple', 'Steam'].map(function(n){ return '<button class="pf-compte" disabled>' + n + '<small>' + trad("bientôt") + '</small></button>'; }).join("") + '</div>'
      + '<p class="sub">' + trad("Pour l’instant, ta partie est gardée sur cet appareil. Lier un compte permettra de la retrouver sur ton téléphone, ta tablette et ton ordinateur.") + '</p>';
  }
  return h + '<div id="gsiBouton" class="cpt-gsi"></div><p class="sub">' + trad("Connecte-toi pour retrouver ta partie sur ton téléphone, ta tablette et ton ordinateur. Le jeu garde seulement un numéro Google et ton prénom, jamais ton adresse e-mail.") + '</p>';
}
function echapCompte(t){ return String(t).replace(/[&<>"]/g, function(x){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[x]; }); }
var gsiCharge = null;
function chargerGSI(){
  if(gsiCharge) return gsiCharge;
  gsiCharge = new Promise(function(ok, ko){ var s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client"; s.async = true; s.onload = ok; s.onerror = ko; document.head.appendChild(s); });
  return gsiCharge;
}
function poserBoutonGoogle(){
  var el = document.getElementById("gsiBouton"); if(!el || !GOOGLE_CLIENT_ID) return;
  chargerGSI().then(function(){
    if(!window.google || !google.accounts || !google.accounts.id) return;
    google.accounts.id.initialize({ client_id:GOOGLE_CLIENT_ID, callback:apresConnexionGoogle, ux_mode:"popup" });
    google.accounts.id.renderButton(el, { theme:"outline", size:el.dataset.taille || "large", text:el.dataset.taille ? "signin" : "signin_with", shape:"pill", locale:typeof LANGUE !== "undefined" ? LANGUE : "fr" });
  }).catch(function(){ el.innerHTML = '<p class="sub">' + trad("Connexion Google indisponible pour l’instant.") + '</p>'; });
}
// Le bloc est posé par openProfil (classement.js) ; le bouton Google est dessiné juste après
new MutationObserver(function(){ var el = document.getElementById("gsiBouton"); if(el && !el.dataset.pose){ el.dataset.pose = "1"; poserBoutonGoogle(); } }).observe(document.body, { childList:true, subtree:true });
document.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest("[data-act]"); if(!b) return;
  var a = b.getAttribute("data-act");
  if(a === "cptReprendre"){ reprendrePartieCompte(); return; }
  if(a === "cptGarder"){ garderPartieAppareil(); return; }
  if(a === "cptDeco"){ deconnecterCompte(); return; }
  if(a === "cptSuppr"){ if(b.dataset.ok){ supprimerCompte(); } else { b.dataset.ok = "1"; b.textContent = trad("Confirmer la suppression"); } return; }
});
if(typeof TRADUCTIONS !== "undefined"){ TRADUCTIONS.en = TRADUCTIONS.en || {}; Object.assign(TRADUCTIONS.en, {
  "Retrouver ma partie partout":"Find my game everywhere", "Choisis quelle partie garder : celle de ton compte ou celle de cet appareil.":"Choose which game to keep: your account’s or this device’s.", "Connecté avec Google":"Signed in with Google", "Partie enregistrée {t}":"Game saved {t}", "Enregistrement en cours…":"Saving…",
  "Se déconnecter":"Sign out", "Supprimer mon compte":"Delete my account", "Confirmer la suppression":"Confirm deletion",
  "Ton compte est ouvert sur un autre appareil. Reconnecte-toi pour reprendre ici.":"Your account is open on another device. Sign in again to continue here.",
  "Ton compte est ouvert sur un autre appareil":"Your account is open on another device", "Cette partie n’est plus enregistrée sur ton compte. Reconnecte-toi dans Mon profil pour la reprendre ici.":"This game is no longer saved to your account. Sign in again in My profile to continue here.",
  "Connecte-toi pour retrouver ta partie sur ton téléphone, ta tablette et ton ordinateur. Le jeu garde seulement un numéro Google et ton prénom, jamais ton adresse e-mail.":"Sign in to find your game on your phone, tablet and computer. The game only keeps a Google number and your first name, never your email address.",
  "Une partie est enregistrée sur ton compte":"A game is saved to your account", "Reprendre la partie du compte":"Continue the account’s game", "enregistrée {t}":"saved {t}",
  "Garder la partie de cet appareil":"Keep this device’s game", "elle remplacera celle du compte":"it will replace the account’s game", "Jour {n}":"Day {n}",
  "Connecté : ta partie est maintenant enregistrée sur ton compte.":"Signed in: your game is now saved to your account.", "Connexion impossible pour l’instant.":"Can’t sign in right now.",
  "Déconnecté. Ta partie reste sur cet appareil.":"Signed out. Your game stays on this device.", "Ton compte et sa sauvegarde ont été supprimés du serveur. Ta partie reste sur cet appareil.":"Your account and its save have been deleted from the server. Your game stays on this device.",
  "Connexion Google indisponible pour l’instant.":"Google sign-in unavailable right now.", "à l’instant":"just now", "il y a {n} min":"{n} min ago", "il y a {n} h":"{n} h ago", "il y a {n} j":"{n} d ago",
  "La connexion Google n’est pas encore configurée sur le serveur.":"Google sign-in is not configured on the server yet.", "Connexion Google refusée.":"Google sign-in refused.",
  "Session terminée : tu as été déconnecté de ton compte.":"Session ended: you were signed out of your account.",
  "Tu as été déconnecté de ton compte":"You were signed out of your account", "Cette partie n’est plus enregistrée sur ton compte. Reconnecte-toi dans Mon profil.":"This game is no longer saved to your account. Sign in again in My profile.",
  "Tu as été déconnecté de ton compte. Reconnecte-toi pour enregistrer ta partie.":"You were signed out of your account. Sign in again to save your game.",
  "Ta partie a avancé sur un autre appareil":"Your game moved on on another device", "Tu as aussi joué ici depuis. Laquelle veux-tu garder ? L’autre sera remplacée.":"You also played here since. Which one do you want to keep? The other will be replaced.",
  "Celle de {app}":"The one from {app}", "Celle de cet appareil":"This device’s", "Partie reprise depuis {app}":"Game picked up from {app}", "Tu continues au jour {n}.":"You continue on day {n}.",
  "partie synchronisée":"game synced", "Joue sur tous tes appareils":"Play on all your devices", "Ta partie te suit du téléphone à l’ordinateur":"Your game follows you from phone to computer",
  "ta tablette":"your tablet", "ton téléphone":"your phone", "ton ordinateur":"your computer", "un autre appareil":"another device"
}); }
