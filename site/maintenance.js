/* =====================================================================
   MAINTENANCE (2026-11-15) : quand l'administration met le site en maintenance, un écran couvre le jeu
   et la page se recharge toute seule dès que c'est fini. La partie de chacun reste sur son appareil.
   Pour jouer quand même pendant une maintenance (tests de Fabien) : zombria.com/?maintenance=passer
   (une fois sur l'appareil ; ?maintenance=normal pour revenir à l'écran de maintenance).
   Chargé juste après langue.js ; rien d'autre n'en dépend.
   ===================================================================== */
(function(){
  var CLE_PASSE = "survival_maintenance_passe";
  try{
    var q = (location.search.match(/[?&]maintenance=(\w+)/) || [])[1];
    if(q === "passer") localStorage.setItem(CLE_PASSE, "1");
    if(q === "normal") localStorage.removeItem(CLE_PASSE);
  }catch(e){}
  function passe(){ try{ return localStorage.getItem(CLE_PASSE) === "1"; }catch(e){ return false; } }
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  function adresse(){ return (/(^|\.)zombria\.com$/.test(location.hostname) ? "" : "https://zombria.com") + "/api/maintenance"; }
  function t(fr){ return typeof trad === "function" ? trad(fr) : fr; }
  function afficher(d){
    var el = document.getElementById("maintenance");
    if(!d || !d.on || passe()){ if(el) el.remove(); return; }
    if(!el){ el = document.createElement("div"); el.id = "maintenance"; document.body.appendChild(el); }
    el.innerHTML = '<div class="mt-boite"><img class="mt-logo" src="images/logo.webp" alt="ZOMBRIA"><h1>' + t("Le refuge est en travaux") + '</h1>'
      + '<p>' + (d.message ? String(d.message).replace(/[<>]/g, "") : t("Nous améliorons le jeu. Revenez dans quelques minutes : votre partie est gardée sur votre appareil.")) + '</p>'
      + '<p class="mt-petit">' + t("Cette page se rechargera toute seule dès que ce sera fini.") + '</p></div>';
  }
  function verifier(){
    if(local && !/[?&]maintenance=test/.test(location.search)) return;
    fetch(adresse() + "?t=" + Date.now(), { cache:"no-store" }).then(function(r){ return r.json(); }).then(function(d){
      var avant = !!document.getElementById("maintenance");
      afficher(d);
      if(avant && !(d && d.on)) location.reload(); // la maintenance est finie : on recharge pour avoir la nouvelle version
    }).catch(function(){});
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", verifier); else verifier();
  setInterval(function(){ if(document.getElementById("maintenance")) verifier(); }, 60000); // pendant la maintenance : on revérifie chaque minute
  setInterval(verifier, 5 * 60000); // sinon, de temps en temps (une maintenance lancée pendant qu'on joue)
  // style de l'écran (ici pour que le fichier se suffise à lui-même)
  var st = document.createElement("style");
  st.textContent = "#maintenance{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 50% 35%,#4a3221,#1d1610 70%);color:#f3e6cc;font-family:Nunito,system-ui,sans-serif;text-align:center}"
    + "#maintenance .mt-boite{max-width:460px}#maintenance .mt-logo{width:130px;height:130px;object-fit:contain;filter:drop-shadow(0 6px 10px rgba(0,0,0,.5))}"
    + "#maintenance h1{font-family:Bangers,system-ui,sans-serif;font-size:34px;letter-spacing:1px;color:#ffd27a;margin:10px 0 8px}"
    + "#maintenance p{font-size:16px;line-height:1.5;margin:0 0 10px}#maintenance .mt-petit{font-size:13px;opacity:.75}";
  document.head.appendChild(st);
})();
