/* =====================================================================
   transfert.js : reprise des sauvegardes de l'ancien site (2026-11-14, déménagement vers zombria.com)
   L'ancien site Cloudflare (survival-refuge…workers.dev) emballe tout ce que le navigateur y gardait
   (clés localStorage « survival… » : partie, record, succès, pseudo, avatar, identifiant, clan…) et ouvre
   https://zombria.com/#transfert=<données>. Le « # » ne part jamais au serveur : les données restent dans le navigateur.
   Règles : ce qui vient de l'ancien site remplace ce qui est ici, SAUF une partie en cours déjà commencée ici
   (survival_partie) et le record (on garde le plus grand). Chargé EN PREMIER (avant data.js), avant toute lecture.
   ===================================================================== */
(function(){
  var h = location.hash || "";
  if(h.indexOf("#transfert=") !== 0) return;
  var n = 0;
  try{
    var donnees = JSON.parse(decodeURIComponent(h.slice("#transfert=".length)));
    Object.keys(donnees || {}).forEach(function(k){
      if(k.indexOf("survival") !== 0 || typeof donnees[k] !== "string") return;
      var ici = localStorage.getItem(k);
      if(k === "survival_partie" && ici) return; // une partie commencée ici n'est pas écrasée
      if(k === "survival_record" && ici && +ici >= +donnees[k]) return; // on garde le meilleur record
      localStorage.setItem(k, donnees[k]); n++;
    });
    localStorage.setItem("survival_transfert_recu", String(Date.now()));
  }catch(e){}
  // On efface les données de l'adresse (elles ne doivent pas rester dans l'historique ni être partagées par erreur)
  try{ history.replaceState(null, "", location.pathname + location.search); }catch(e){ location.hash = ""; }
  window.TRANSFERT_RECU = n;
})();
