/* =====================================================================
   succes.js : les succès (trophées) et les vibrations du téléphone.
   Les succès débloqués sont gardés dans le navigateur (survival_succes),
   d'une partie à l'autre. Chargé après classement.js.
   ===================================================================== */
function lieuNomme(nom){ return LIEUX.findIndex(function(L){ return L.nom === nom; }); }
// test : fonction qui dit si le succès est obtenu dans la partie en cours (G)
var SUCCES = [
  { id:"nuit1",      icone:"🌙", nom:"Première nuit",          desc:"Survivre à la première nuit",                    test:function(){ return G.day >= 2; } },
  { id:"semaine",    icone:"📅", nom:"Une semaine",            desc:"Tenir 7 jours",                                  test:function(){ return G.day > 7; } },
  { id:"mois",       icone:"🗓️", nom:"Un mois de survie",      desc:"Tenir 30 jours",                                 test:function(){ return G.day > 30; } },
  { id:"cent",       icone:"💯", nom:"Centenaire",             desc:"Tenir 100 jours",                                test:function(){ return G.day > 100; } },
  { id:"famille20",  icone:"👨‍👩‍👧‍👦", nom:"Tous ensemble",       desc:"Toute la famille en vie au jour 20",           test:function(){ return G.day >= 20 && vivants().length === 4 && !G.dd.length; } },
  { id:"score300",   icone:"⭐", nom:"300 points",             desc:"Atteindre un score de 300",                      test:function(){ return G.score >= 300; } },
  { id:"forteresse", icone:"🧱", nom:"Forteresse",             desc:"Barricade au niveau maximum",                    test:function(){ return G.ref.barr >= REFUGE.barr.max; } },
  { id:"autonomes",  icone:"🥕", nom:"Autonomes",              desc:"Potager et récupérateur d’eau au maximum",       test:function(){ return G.ref.pot >= REFUGE.pot.max && G.ref.eau >= REFUGE.eau.max; } },
  { id:"artisan",    icone:"🛠️", nom:"Mains d’or",             desc:"Fabriquer 10 objets à l’atelier",                test:function(){ return G.stats.fabriques >= 10; } },
  { id:"voiture",    icone:"🚗", nom:"Ça roule !",             desc:"Réparer la voiture",                             test:function(){ return voitureReparee(); } },
  { id:"crochet",    icone:"🗝️", nom:"Doigts de fée",          desc:"Crocheter une serrure",                          test:function(){ return (G.stats.crochetages || 0) >= 1; } },
  { id:"pecheur",    icone:"🎣", nom:"Pêcheur",                desc:"Pêcher 10 poissons",                             test:function(){ return (G.stats.poissons || 0) >= 10; } },
  { id:"fermier",    icone:"🐔", nom:"Basse-cour",             desc:"Avoir 3 poules en même temps",                   test:function(){ return compter("poule") >= 3; } },
  { id:"rex",        icone:"🐕", nom:"Meilleur ami",           desc:"Garder Rex 10 nuits",                            test:function(){ return (G.stats.nuitsChien || 0) >= 10; } },
  { id:"missions",   icone:"🎯", nom:"Héros du quartier",      desc:"Réussir 5 missions",                             test:function(){ return (G.stats.missions || 0) >= 5; } },
  { id:"explorateur",icone:"🗺️", nom:"Explorateur",            desc:"Découvrir tous les lieux secrets",               test:function(){ return LIEUX.every(function(L, i){ return !L.secret || (G.decouverts && G.decouverts[i]); }); } },
  { id:"bunker",     icone:"🛢️", nom:"Le trésor du bunker",    desc:"Revenir vivant du Bunker du survivaliste",       test:function(){ return !!G.stats.lieux[lieuNomme("Bunker du survivaliste")]; } },
  { id:"base",       icone:"🪖", nom:"Commando",               desc:"Revenir vivant de la Base militaire",            test:function(){ return !!G.stats.lieux[lieuNomme("Base militaire")]; } }
];

function lireSucces(){ try{ return JSON.parse(localStorage.getItem("survival_succes")) || {}; }catch(e){ return {}; } }
var succesObtenus = lireSucces(), fileSucces = [];
// Appelé à chaque affichage : débloque ce qui vient d'être atteint et l'annonce
function verifierSucces(){
  if(!G || G.ph !== "game" || !G.stats) return;
  var nouveaux = SUCCES.filter(function(s){ try{ return !succesObtenus[s.id] && s.test(); }catch(e){ return false; } });
  if(!nouveaux.length) return;
  var d = new Date(), jour = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  nouveaux.forEach(function(s){ succesObtenus[s.id] = jour; fileSucces.push(s); });
  try{ localStorage.setItem("survival_succes", JSON.stringify(succesObtenus)); }catch(e){}
  montrerSucces();
}
// Bandeau en haut de l'écran, un succès après l'autre
var minuteurSucces = null;
function montrerSucces(){
  var b = $("bandeauSucces");
  if(b && b.classList.contains("on")) return; // le suivant viendra après
  var s = fileSucces.shift(); if(!s) return;
  if(!b){ b = document.createElement("div"); b.id = "bandeauSucces"; b.setAttribute("role", "status"); document.body.appendChild(b); }
  b.innerHTML = '<span class="em">' + s.icone + '</span><span><small>🏅 Succès débloqué</small><b>' + s.nom + '</b></span>';
  b.classList.add("on"); son("construire"); vibrer([60, 40, 60]);
  clearTimeout(minuteurSucces);
  minuteurSucces = setTimeout(function(){ b.classList.remove("on"); setTimeout(montrerSucces, 400); }, 3200);
}
function nbSucces(){ return SUCCES.filter(function(s){ return succesObtenus[s.id]; }).length; }
function openSucces(){
  var h = '<h2>🏅 Succès · ' + nbSucces() + ' / ' + SUCCES.length + '</h2><p class="sub">Ils restent débloqués d’une partie à l’autre.</p><div class="succes">';
  h += SUCCES.map(function(s){
    var ok = succesObtenus[s.id];
    return '<div class="sc' + (ok ? " ok" : "") + '"><span class="em">' + (ok ? s.icone : "🔒") + '</span><span><b>' + s.nom + '</b><small>' + s.desc + '</small></span></div>';
  }).join("") + '</div>';
  show(h + BTN_FERMER());
}

/* ---------- Vibrations (Android ; l'iPhone ne sait pas faire vibrer une page web) ---------- */
function vibrationsActives(){ try{ return localStorage.getItem("survival_vibre") !== "non"; }catch(e){ return true; } }
function vibrer(motif){ if(vibrationsActives() && navigator.vibrate){ try{ navigator.vibrate(motif); }catch(e){} } }
function basculerVibrations(){ var on = !vibrationsActives(); try{ localStorage.setItem("survival_vibre", on ? "oui" : "non"); }catch(e){} if(on) vibrer(80); }

document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act");
  if(a === "succes") openSucces();
  else if(a === "menuvibre"){ basculerVibrations(); openMenu(); }
});
