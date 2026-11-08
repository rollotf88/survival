/* =====================================================================
   classement.js : classement en ligne de la Partie du jour.
   Le serveur est une petite fonction Netlify (netlify/functions/classement.mjs).
   Sans connexion (ou sur une page qui bloque internet), on l'explique
   simplement et le jeu continue normalement.
   ===================================================================== */
var SITE_JEU = "https://unique-moxie-1ab990.netlify.app";
function adresseClassement(){ return (/netlify\.app$/.test(location.hostname) ? "" : SITE_JEU) + "/api/classement"; }

// Identifiant de l'appareil (au hasard, pour garder un seul score par joueur) et pseudo
function idAppareil(){
  var id = null;
  try{ id = localStorage.getItem("survival_id"); }catch(e){}
  if(!id){ id = ""; for(var k = 0; k < 16; k++) id += "abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 36)); try{ localStorage.setItem("survival_id", id); }catch(e){} }
  return id;
}
function lirePseudo(){ try{ return localStorage.getItem("survival_pseudo") || ""; }catch(e){ return ""; } }
function echapper(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]; }); }

var dernierEnvoi = null; // { seed, score, jours } de la partie qui vient de finir
function openEnvoiScore(){
  var p = lirePseudo();
  show('<h2>🏆 Classement du jour</h2><p>Ton score (<b>' + dernierEnvoi.score + '</b>) sera visible par tous les joueurs de la Partie du ' + dateGraine(dernierEnvoi.seed) + '.</p>'
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
    body:JSON.stringify({ jour:dernierEnvoi.seed, id:idAppareil(), pseudo:pseudo, score:dernierEnvoi.score, jours:dernierEnvoi.jours }) })
    .then(function(r){ return r.json(); })
    .then(function(d){ if(d.ok) openClassement(dernierEnvoi.seed, "Score envoyé : tu es " + d.rang + (d.rang === 1 ? "er" : "e") + " sur " + d.total + " !"); else $("msgcl").textContent = "Score refusé par le serveur."; })
    .catch(function(){ $("msgcl").textContent = "Impossible de joindre le classement (pas de connexion, ou cette page bloque internet). Essaie depuis le jeu installé : " + SITE_JEU.replace("https://", ""); });
}
function openClassement(seed, message){
  seed = seed || graineDuJour();
  show('<h2>🏆 Classement du ' + dateGraine(seed) + '</h2>' + (message ? '<p class="g2 msg">' + message + '</p>' : '') + '<p class="sub" id="listecl">Chargement…</p>' + BTN_FERMER());
  var moi = idAppareil();
  fetch(adresseClassement() + "?jour=" + seed + "&id=" + moi).then(function(r){ return r.json(); }).then(function(d){
    var el = $("listecl"); if(!el) return;
    if(!d.scores || !d.scores.length){ el.textContent = "Personne n’a encore envoyé de score aujourd’hui. Sois le premier !"; return; }
    el.outerHTML = '<ol class="classement">' + d.scores.map(function(e, k){
      return '<li class="' + (e.moi ? "moi" : "") + '"><span class="rang">' + (k < 3 ? ["🥇","🥈","🥉"][k] : (k + 1) + ".") + '</span><b>' + echapper(e.pseudo) + '</b><span class="pts">⭐ ' + e.score + ' · ' + e.jours + ' j</span></li>';
    }).join("") + '</ol>';
  }).catch(function(){ var el = $("listecl"); if(el) el.textContent = "Impossible de charger le classement (pas de connexion, ou cette page bloque internet). Il marche dans le jeu installé : " + SITE_JEU.replace("https://", ""); });
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act");
  if(a === "envoiscore") openEnvoiScore();
  else if(a === "envoyerscore") envoyerScore();
  else if(a === "classement") openClassement(G && G.seed ? G.seed : graineDuJour());
});
document.addEventListener("keydown", function(e){ if(e.key === "Enter" && e.target && e.target.id === "pseudo") envoyerScore(); });
