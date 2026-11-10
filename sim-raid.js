/* sim-raid.js : banc d'essai du raid de l'immeuble (pas chargé par le jeu ni publié).
   Dans la console du navigateur (jeu ouvert) : charger ce fichier puis simRaid(EQUIPES_RAID.bien, 200).
   Le robot joue le raid avec le bouton Auto, soigne entre les étages et monte tant que l'équipe tient debout. */
function simRaid(cfg, N){
  var stubs = { render:window.render, openCombat:window.openCombat, show:window.show, envoyerRaid:window.envoyerRaid, sauver:window.sauver }, capt = null;
  window.render = function(){}; window.openCombat = function(){}; window.show = function(){}; window.sauver = function(){}; window.envoyerRaid = function(r){ capt = r; };
  if(!G || G.ph !== "game"){ nouvellePartie(null); demarrer(); G.ph = "game"; G.day = 40; }
  var st = { sommet:0, etages:[0, 0, 0, 0, 0, 0], morts:0, avecMort:0, objets:0, fuite:0, defaite:0 }, vrai = G;
  for(var n = 0; n < N; n++){
    capt = null;
    var vols = cfg.map(function(c, i){ return { id:"v" + i, membre:{ nom:"V" + i, r:["Papa", "Maman", "Léo", "Emma", "Sam"][i], hp:c.hp, en:c.en, trait:c.trait || "", eq:{ arme:c.arme ? { id:c.arme, sol:30, uid:i + 1 } : undefined } },
      kit:{ n:Object.assign({}, c.kit || {}), o:(c.gear || []).map(function(g, k){ return { id:g, sol:5, uid:100 + i * 5 + k }; }) } }; });
    demarrerRaid({ volontaires:vols, remorque:1 });
    var garde = 0;
    while(G.bacASable && garde++ < 40){
      var t = 0; while(!G.combat.fin && t++ < 80) tourAuto();
      if(!G.combat.fin) G.combat.fin = "defaite";
      finEtageRaid();
      if(!G.bacASable) break;
      var s = 0; while(s++ < 10 && soinsDispo() > 0 && G.m.some(function(x){ return x.al && x.hp < 55; })) soignerRaid();
      var viv = G.m.filter(function(x){ return x.al; });
      var ch = viv.length >= 2 ? chancesEtage(G.exp.etage, 20) : { sansPerte:0 };
      if(ch.sansPerte >= (window.SEUIL_MONTER || 50)) monterEtage(); else finirRaid("redescendu");
    }
    if(G !== vrai) G = vrai;
    var r = capt || { etages:0, issue:"?", volontaires:{}, butin:{} };
    st.etages[r.etages]++; if(r.issue === "sommet") st.sommet++; if(r.issue === "fuite") st.fuite++; if(r.issue === "defaite") st.defaite++;
    var m = Object.keys(r.volontaires).filter(function(k){ return !r.volontaires[k].al; }).length; st.morts += m; if(m) st.avecMort++;
    st.objets += totalButin(r.butin);
  }
  Object.assign(window, stubs); try{ localStorage.removeItem("survival_raid_attente"); }catch(e){}
  return { sommet:Math.round(st.sommet / N * 100) + "%", etagesMoy:(st.etages.reduce(function(t, v, i){ return t + v * i; }, 0) / N).toFixed(1),
    repartition:st.etages.map(function(v){ return Math.round(v / N * 100) + "%"; }).join(" "), mortsParRaid:(st.morts / N).toFixed(2), raidsAvecMort:Math.round(st.avecMort / N * 100) + "%",
    objets:Math.round(st.objets / N), fuite:Math.round(st.fuite / N * 100) + "%", defaite:Math.round(st.defaite / N * 100) + "%" };
}
var EQUIPES_RAID = {
  bien:[{ arme:"fusil", hp:95, en:90, kit:{ cartouche:15, trousse:2, bandage:2 }, gear:["gilet", "casque", "bouclier"] }, { arme:"fusil", hp:95, en:90, kit:{ cartouche:15, trousse:2, bandage:2 }, gear:["gilet", "casque", "bouclier"] },
        { arme:"pistolet", hp:95, en:90, kit:{ balle:15, trousse:2, bandage:2 }, gear:["gilet", "casque", "bouclier"] }, { arme:"pistolet", hp:95, en:90, kit:{ balle:15, trousse:2, bandage:2 }, gear:["gilet", "casque", "bouclier"] }],
  moyenne:[{ arme:"machette", hp:85, en:70, kit:{ trousse:1 } }, { arme:"hache", hp:85, en:70, kit:{ trousse:1 } }, { arme:"batte", hp:85, en:70, kit:{ trousse:1 } }, { arme:"barrefer", hp:85, en:70, kit:{ trousse:1 } }],
  faible:[{ arme:"couteau", hp:70, en:60 }, { arme:"batte", hp:70, en:60 }, { arme:"couteau", hp:70, en:60 }, { hp:70, en:60 }]
};
