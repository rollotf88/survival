/* =====================================================================
   ui.js : l'affichage (écrans, fenêtres) et les clics.
   ===================================================================== */

var $ = function(i){ return document.getElementById(i); };


/* ---------- Astuces (bulle en haut de l'écran, une seule fois chacune) ---------- */
var astucesVues = {};
try{ astucesVues = JSON.parse(localStorage.getItem("survival_astuces")) || {}; }catch(e){}
function astuce(id){
  if(astucesVues.aucune || astucesVues[id] || $("astuce")) return;
  var d = document.createElement("div"); d.id = "astuce"; d.setAttribute("data-id", id); d.setAttribute("role", "status");
  d.innerHTML = '<p>' + ASTUCES[id] + '</p><div class="row"><button class="lien" data-act="astucesoff">Ne plus montrer d’astuces</button><small class="indic">ou touche n’importe où</small><button class="btn" style="flex:0 0 auto;padding:6px 16px" data-act="astuceok">OK</button></div>';
  document.body.appendChild(d);
}
function fermerAstuce(toutes){
  var d = $("astuce"); if(d){ astucesVues[d.getAttribute("data-id")] = true; d.remove(); }
  if(toutes) astucesVues.aucune = true;
  try{ localStorage.setItem("survival_astuces", JSON.stringify(astucesVues)); }catch(e){}
}
// Le premier toucher n'importe où ferme l'astuce (elle compte comme lue) ;
// l'action touchée se fait quand même. Les boutons de la bulle gardent leur rôle.
document.addEventListener("click", function(e){
  if($("astuce") && !e.target.closest("#astuce button")) fermerAstuce(false);
}, true);

function niveau(v){ return v < 35 ? "lo" : v < 70 ? "mid" : ""; }
function barre(l, v){ v = Math.max(0, Math.min(100, v)); return '<div class="b"><span>' + l + '</span><div class="bar"><i class="' + niveau(v) + '" style="width:' + v + '%"></i></div></div>'; }
function puces(n){
  var morts = n.filter(function(a){ return a[0] === "mort"; }), autres = n.filter(function(a){ return a[0] !== "mort"; });
  if(morts.length) setTimeout(function(){ son("glas"); if(typeof vibrer === "function") vibrer([200, 100, 400]); }, 150);
  return morts.map(function(a){
    return '<div class="deuil"><span class="em">' + iconeMembre({ nom:a[2], al:false, hp:0, en:0, faim:0, soif:0, icone:"💀" }) + '</span><span><b>💀 ' + a[1] + '</b><small>Repose en paix.</small></span></div>';
  }).join("") + (autres.length ? '<ul>' + autres.map(function(a){ return '<li class="' + a[0] + '">' + a[1] + '</li>'; }).join("") + '</ul>' : '');
}
function show(h){ $("sheet").innerHTML = h; $("modal").style.display = "flex"; $("sheet").scrollTop = 0; }
function hide(){ $("modal").style.display = "none"; }
var BTN_FERMER = function(t){ return '<button class="btn alt" style="width:100%" data-act="close">' + (t || "Fermer") + '</button>'; };

/* ---------- Écran de départ : le sac ---------- */
// Familles d'objets (couleur du liseré et ordre d'affichage)
var ORDRE_FAMILLES = ["eau", "nour", "soin", "arme", "lumiere", "outil", "moral"];
function famillePick(k){
  var o = OBJETS[k];
  if(o.cat === "eau") return "eau";
  if(o.cat === "nour" || o.cat === "energie") return "nour";
  if(o.cat === "soin") return "soin";
  if(o.emplacement === "arme" || o.cat === "munition") return "arme";
  if(o.lumiere || k === "pile") return "lumiere";
  if(o.emplacement === "outil" || o.emplacement === "sac") return "outil";
  return "moral";
}
var NOM_COURT = { bidon:"Eau", conserves:"Conserves", biscuits:"Biscuits", trousse:"Trousse", antibio:"Antibio", couverture:"Couverture",
  lampe:"Lampe", peluche:"Peluche", photo:"Photo", cartes:"Cartes", outils:"Outils", sacados:"Sac à dos", riz:"Riz", fusil:"Fusil",
  boiteCart:"Cartouches", pdb:"Pied-de-biche", canette:"Canette", sacoche:"Sacoche" };
// « Ce qu'il te manque » : une case par besoin, cochée dès qu'un objet du sac y répond
var BESOINS_SAC = [
  ["💧", "Eau", function(o){ return o.cat === "eau"; }],
  ["🥫", "Manger", function(o){ return o.cat === "nour"; }],
  ["🩹", "Soins", function(o){ return o.cat === "soin"; }],
  ["🛡️", "Défense", function(o){ return o.emplacement === "arme"; }],
  ["🔦", "Lumière", function(o){ return !!o.lumiere; }],
  ["🔥", "Chaleur", function(o){ return !!o.chaleur || !!o.allume; }]
];
var sautSac = false; // le sac dessiné « saute » quand on vient d'y mettre un objet
function rPick(){
  setTimeout(function(){ sautSac = false; }, 0);
  setTimeout(function(){ astuce("depart"); }, 0);
  var H = MAISONS[G.h], u = placesUtilisees(), libre = capSac() - u, cells = "", tiles = "";
  for(var k in G.pack) for(var i = 0; i < G.pack[k]; i++){
    var lab = ' data-act="rem" data-id="' + k + '" aria-label="Retirer ' + OBJETS[k].nom + '"';
    cells += '<button class="cell f"' + lab + '>' + icone(k) + '</button>';
    for(var p = 1; p < OBJETS[k].place; p++) cells += '<button class="cell f s"' + lab + '>' + icone(k) + '</button>';
  }
  for(var i = u; i < capSac(); i++) cells += '<div class="cell"></div>';
  Object.keys(H.objets).sort(function(a, b){ return ORDRE_FAMILLES.indexOf(famillePick(a)) - ORDRE_FAMILLES.indexOf(famillePick(b)); }).forEach(function(k){
    var c = G.pack[k] || 0, ok = c < H.objets[k] && libre >= OBJETS[k].place;
    tiles += '<button class="tile f-' + famillePick(k) + (ok ? "" : " off") + '" data-act="add" data-id="' + k + '" aria-label="Prendre ' + OBJETS[k].nom + ' (' + OBJETS[k].place + ' place' + (OBJETS[k].place > 1 ? "s" : "") + ')">' + (c ? '<span class="n">' + c + '</span>' : "") + (OBJETS[k].place > 1 ? '<span class="pl">' + OBJETS[k].place + ' pl.</span>' : "") + icone(k) + '<small>' + (NOM_COURT[k] || OBJETS[k].nom) + '</small></button>';
  });
  var tabs = MAISONS.map(function(x, j){ return '<button class="tab' + (j === G.h ? " on" : "") + '" data-act="house" data-id="' + j + '"' + (G.seed && j !== G.h ? " disabled" : "") + '>' + ic(ICONE_MAISON[x.nom], x.icone) + ' ' + x.nom + '<small>' + x.cap + ' places</small></button>'; }).join("");
  var tm = Math.max(0, G.tl), pc = Math.min(100, Math.round(tm / BAL.tempsDepart * 100));
  document.body.classList.toggle("urgence", tm <= 10);
  $("app").innerHTML = '<div class="row"><h1>Jour 0</h1><span class="mode">' + (G.seed ? "🏆 Partie classée" : "🎲 Partie libre") + '</span><span class="pill" id="tsec">⏱ ' + Math.ceil(tm) + ' s</span></div><div class="timer"><i id="tbar" class="' + (pc < 30 ? "lo" : "") + '" style="width:' + pc + '%"></i></div><div class="tabs">' + tabs + '</div>'
    + '<div class="pk"><div class="besoins" style="grid-area:sub" aria-label="Ce qu’il faut emporter">' + BESOINS_SAC.map(function(b){ var ok = Object.keys(G.pack).some(function(k){ return b[2](OBJETS[k]); }); return '<span class="' + (ok ? "ok" : "") + '" title="' + b[1] + '">' + b[0] + ' ' + (ok ? "✅" : "❌") + '<small>' + b[1] + '</small></span>'; }).join("") + '</div>'
    + '<div class="sacbloc" style="grid-area:bag"><img class="sacimg' + (sautSac ? " saute" : "") + '" src="images/sac-dos.webp" alt=""><div class="sacdroite"><div class="row"><b>Le sac</b><span class="pill">' + u + ' / ' + capSac() + '</span></div><div class="bag">' + cells + '</div></div></div>'
    + '<div class="stage" style="grid-area:tiles"><div class="tiles">' + tiles + '</div></div>'
    + '<div class="sub" style="grid-area:info;min-height:34px"><b>' + G.info + '</b></div>'
    + '<div class="row" style="grid-area:go"><button class="btn alt" style="flex:0 0 auto" data-act="adstart"' + (G.adS ? " disabled" : "") + '>📺 Bonus (pub)</button><button class="btn partir" data-act="start">🚪 Partir !</button></div></div>';
}

/* ---------- Écran principal : le refuge et la famille ---------- */
function rGame(){
  setTimeout(function(){
    astuce("famille"); astuce("equipement");
    if(G.day >= 2) astuce("score");
    astuce("pieces");
    if(!G.m.some(peutSortir)) astuce("dormir");
    if(mission()) astuce("mission");
  }, 0);
  var mo = G.moral > 60 ? ic("moralBon", "😀") : G.moral > 30 ? ic("moralMoyen", "😐") : ic("moralBas", "😟");
  var m = G.m.map(function(x, i){
    var on = G.sel.indexOf(i) >= 0, st = !x.al ? "💀 Mort" : on ? "✔ Part fouiller" : !peutSortir(x) ? "😴 Épuisé" : fatigue(x) ? "🥱 Fatigué" : "Au refuge";
    var aEquiper = x.al && EMPLACEMENTS.some(function(e){ return !x.eq[e[0]] && pourEmplacement(e[0]).length > 0; });
    // Sur téléphone, l'équipement porté s'affiche en petit sous les jauges (la fiche s'ouvre au toucher)
    var porte = x.al ? '<div class="porte">' + EMPLACEMENTS.map(function(e){ var o = x.eq[e[0]]; return '<span class="' + (o ? "f" : "") + '">' + (o ? icone(o.id) : "") + '</span>'; }).join("") + '</div>' : '';
    return '<div class="mc' + (on ? " on" : "") + (x.al ? "" : " dead") + '" data-act="sel" data-id="' + i + '" tabindex="0">' + (on ? '<span class="coche" aria-hidden="true">✔</span>' : '') + (aEquiper ? '<span class="pastille" title="Un objet peut être équipé">+</span>' : '') + '<div><span class="em">' + iconeMembre(x) + '</span><b>' + x.nom + '</b></div><small>' + st + '</small>'
      + barre("❤️", x.hp) + barre("⚡", x.en) + barre(ic("conserve", "🥫"), x.faim) + barre(ic("bouteille", "💧"), x.soif) + porte
      + (x.al ? '<div class="slots">' + EMPLACEMENTS.map(function(e){
          var o = x.eq[e[0]], dispo = !o && pourEmplacement(e[0]).length > 0; // case vide mais un objet attend au stock
          return '<button class="slot' + (o ? " f" : "") + (dispo ? " dispo" : "") + '" data-act="slot" data-id="' + i + ':' + e[0] + '" aria-label="' + e[2] + ' de ' + x.nom + ' : ' + (o ? OBJETS[o.id].nom : dispo ? "vide, un objet est disponible au stock" : "vide") + '"' + (dispo ? ' title="Un objet est disponible au stock"' : '') + '>' + (o ? icone(o.id) : '<span class="vide">' + e[1] + '</span>') + '</button>';
        }).join("") + ((soinsDispo() > 0 && x.hp < 100) || peutBoire(x) || peutPrendreRation(x, "eau") || peutPrendreRation(x, "nour") ? '<button class="slot heal2" data-act="soins" data-id="' + i + '" aria-label="Soigner, faire boire ou manger ' + x.nom + '">＋</button>' : "") + '</div>' : "") + '</div>';
  }).join("");
  $("app").innerHTML = '<div class="row"><div class="titre"><h1>Jour ' + G.day + '</h1><button class="chapcourt" data-act="chapitre" aria-label="Détail du chapitre">Chapitre ' + (G.chap + 1) + '</button></div><div class="chips">'
    + '<button class="chip" data-act="info" data-id="eau" aria-label="Rations d’eau : ' + rations("eau") + '">' + ic("bouteille", "💧") + ' ' + rations("eau") + '</button>'
    + '<button class="chip" data-act="info" data-id="nour" aria-label="Rations de nourriture : ' + rations("nour") + '">' + ic("conserve", "🥫") + ' ' + rations("nour") + '</button>'
    + '<button class="chip" data-act="info" data-id="soin" aria-label="Objets de soin : ' + soinsDispo() + '">' + ic("bandage", "🩹") + ' ' + soinsDispo() + '</button>'
    + '<button class="chip" data-act="info" data-id="def" aria-label="Défense de nuit : ' + defenseNuit() + '">' + ic("bouclier", "🛡️") + ' ' + defenseNuit() + '</button>'
    + '<button class="chip" data-act="info" data-id="moral" aria-label="Moral : ' + Math.round(G.moral) + '">' + mo + ' ' + Math.round(G.moral) + '</button>'
    + '<button class="chip chipson" data-act="menu" aria-label="Menu et guide">☰</button>'
    + (chien() ? '<button class="chip chipchien" data-act="chien" title="' + chien().nom + ', le chien">' + ic("chien", "🐕") + (chien().faim ? ' ⚠️' : '') + '</button>' : '')
    + '</div></div>'
    + '<div class="stage scene"><div class="grid2">' + m + '</div><p class="sub aide">Touche 1 ou 2 membres pour fouiller · cases 🗡️ 🔦 🎒 pour équiper · ⚡ = énergie.</p>'
    + '<div class="row">' + (mission() ? '<button class="btn alt' + (livraisonPossible() >= 0 ? " pret" : "") + '" style="flex:0 0 auto" data-act="mission">🎯 ' + mission().titre + ' · ' + joursMission() + ' j</button>' : '') + (marcheOuvert() ? '<button class="btn alt" style="flex:0 0 auto" data-act="marche">' + ic("marco", MARCHE.icone) + ' Marché</button>' : '') + '</div></div>'
    + '<div class="row acts"><button class="btn' + (G.sel.length ? "" : " attente") + '" data-act="fouille">' + ic("loupe", "🔍") + ' Fouiller</button><button class="btn alt" data-act="stock">' + ic("caisse", "📦") + ' Stock</button><button class="btn alt" data-act="refuge">' + ic("marteau", "🛠️") + ' Refuge</button><button class="btn' + (G.m.some(peutSortir) ? " alt" : "") + '" data-act="endday">' + ic("lune", "🌙") + ' Dormir</button></div>';
}

/* ---------- Choix du lieu ---------- */
function openLoc(){
  astuce("lieux");
  if(LIEUX.some(function(L, i){ return L.peche && lieuOuvert(i); })) astuce("peche");
  var h = '<h2>Où envoyer l’équipe ?</h2>';
  var team = G.sel.map(function(j){ return G.m[j]; });
  var porte = function(test){ return team.some(function(x){ return x.eq.outil && test(OBJETS[x.eq.outil.id]); }); };
  var lumiere = porte(function(o){ return o.lumiere === 2; }) ? (compter("pile") > 0 ? "🔦 lampe prête" : "⚠️ lampe sans pile") : porte(function(o){ return o.lumiere === 1; }) ? "🔥 lueur faible" : "⚠️ pas de lumière";
  var ouvre = porte(function(o){ return o.ouvre; }) ? "🔓 de quoi ouvrir" : "⚠️ porte à forcer";
  h += '<p class="sub">Équipe : ' + team.map(function(x){ return iconeMembre(x) + " " + x.nom + " ⚡" + x.en; }).join(", ") + ' · ⚔️ force ' + forceEquipe(team) + ' · 🎒 ' + placesEquipe(team) + ' places pour le butin</p>';
  var radio = possede(function(o){ return o.radio; });
  if(voitureReparee()) h += '<button class="loc toggle' + (enVoiture ? " on" : "") + '" data-act="envoiture"><b>🚗 ' + (enVoiture ? "En voiture" : "À pied") + '</b> <span class="pill">⛽ ' + G.voiture.essence + ' L</span><small>' + (enVoiture ? "Le trajet ne fatigue pas, +" + VOITURE.coffre + " places dans le coffre, mais ça consomme de l’essence et le moteur fait du bruit. Touche pour y aller à pied." : "Touche pour prendre la voiture.") + '</small></button>';
  LIEUX.forEach(function(L, i){
    if(!lieuOuvert(i)) return;
    var auto = enVoiture || L.voiture;
    var reste = resteLieu(i), d = dangerLieu(i);
    var cd = []; if(L.peche) cd.push(porte(function(o){ return o.peche; }) ? "🎣 canne prête" : "⚠️ pas de canne à pêche"); if(L.sombre) cd.push("sombre : " + lumiere); if(L.verrou) cd.push("verrouillé : " + ouvre);
    var dg = radio ? (d < 0.3 ? "📻 Danger faible" : d < 0.5 ? "📻 Danger moyen" : "📻 Danger élevé") : "Danger inconnu";
    var peut = equipePeutAller(team, i, auto);
    var pourquoi = !reste ? "" : auto && !voitureReparee() ? " · 🚗 voiture nécessaire (en panne)" : auto && !voitureOk(i) ? " · ⛽ pas assez d’essence" : !peut ? " · 😴 trop fatigués" : "";
    h += '<button class="loc"' + (reste && peut ? "" : " disabled") + ' data-act="loc" data-id="' + i + '"><b>' + vignetteLieu(L) + ' ' + L.nom + (G.mission && G.mission.lieu === i ? " 🎯" : "") + '</b> <span class="pill">' + (L.peche ? "🐟 " + G.lieux[i].poissons + (G.lieux[i].butin.length ? " · " + G.lieux[i].butin.length + " obj." : "") : reste ? reste + " objet" + (reste > 1 ? "s" : "") : "Vidé") + '</span><small>' + DISTANCES[L.distance] + ' · ⚡ −' + coutEnergie(i, auto) + (auto ? " · ⛽ −" + litres(i) + " L" : "") + pourquoi + '</small><small>' + (cd.join(" · ") || "Accès libre") + ' · ' + dg + '</small></button>';
  });
  show(h + BTN_FERMER("Annuler"));
}
// Enchaîne les étapes d'une expédition : porte -> combat -> résultat
function apresEtape(r){
  render();
  if(r.serrure){ jeuSerrure = false; msgSerrure = ""; openSerrure(); }
  else if(r.combat){ choixCombat = {}; cibleCombat = 0; openCombat(); }
  else if(r.peche){ openPeche(); }
  else { openResultat(r); finiSiMorts(); }
}

/* ---------- Crochetage (mini-jeu) ---------- */
var jeuSerrure = false, msgSerrure = "", zoneDebut = 0.4, departCurseur = 0, animSerrure = null;
function positionCurseur(){
  var t = (performance.now() - departCurseur) / 1000 * BAL.crochetage.vitesse, f = t % 1;
  return f < 0.5 ? f * 2 : 2 - f * 2; // va-et-vient entre 0 et 1
}
function nouvelleZone(){ zoneDebut = Math.random() * (1 - zoneCrochetage()); departCurseur = performance.now(); }
function openSerrure(){
  var S = G.exp.serrure, L = LIEUX[G.exp.lieu], x = crocheteur();
  var h = '<h2>🔒 Porte verrouillée</h2><p class="sub">' + iconeLieu(L) + ' ' + L.nom + ' : personne n’a d’outil pour ouvrir.</p>';
  if(S.fin){
    h += '<p class="msg ' + (S.fin === "ouvert" ? "g2" : "") + '">' + msgSerrure + '</p><button class="btn" style="width:100%" data-act="suiteporte">Entrer</button>';
    cancelAnimationFrame(animSerrure); show(h); return;
  }
  if(!jeuSerrure){
    h += '<p>' + iconeMembre(x) + ' ' + x.nom + ' peut essayer de <b>crocheter</b> la serrure (' + BAL.crochetage.goupilles + ' goupilles, ' + icone("epingle") + ' ' + compter("epingle") + ' épingle' + (compter("epingle") > 1 ? "s" : "") + '). Chaque raté casse une épingle.' + (x.trait === "agile" ? " " + x.nom + " a des doigts de fée : la zone verte est plus large." : "") + '</p>'
      + '<p class="sub">Forcer la porte fait du bruit : plus de danger et fouille moins efficace.</p>'
      + '<div class="row"><button class="btn" data-act="crocheter">🗝️ Crocheter</button><button class="btn alt" data-act="forcer">💪 Forcer</button></div>';
    show(h); return;
  }
  astuce("serrure");
  h += '<p class="sub">Appuie quand le curseur est dans la zone verte. ' + icone("epingle") + ' ' + compter("epingle") + ' épingle' + (compter("epingle") > 1 ? "s" : "") + '</p>';
  h += '<div class="goupilles">' + Array.from({ length:BAL.crochetage.goupilles }, function(_, k){ return '<span class="' + (k < S.faites ? "ok" : "") + '">' + (k < S.faites ? "🟢" : "⚪") + '</span>'; }).join("") + '</div>';
  h += '<div class="serrure"><i class="zone" style="left:' + (zoneDebut * 100) + '%;width:' + (zoneCrochetage() * 100) + '%"></i><i class="curseur" id="curseur"></i></div>';
  h += '<p class="msg">' + (msgSerrure || "&nbsp;") + '</p><button class="btn" style="width:100%" data-act="goupille">🗝️ Appuyer !</button>';
  show(h);
  cancelAnimationFrame(animSerrure);
  (function anim(){ var c = $("curseur"); if(!c) return; c.style.left = (positionCurseur() * 100) + "%"; animSerrure = requestAnimationFrame(anim); })();
}
function appuyerGoupille(){
  var p = positionCurseur(), z = zoneCrochetage();
  msgSerrure = tentativeGoupille(p >= zoneDebut && p <= zoneDebut + z);
  if(!G.exp.serrure.fin) nouvelleZone();
  render(); openSerrure();
}

/* ---------- Combat ---------- */
var retourEquip = null; // fenêtre à rouvrir après avoir équipé (« quipart »)
var choixCombat = {}, cibleCombat = 0;
function openCombat(){
  astuce("combat");
  var C = G.combat, L = LIEUX[G.exp.lieu], fini = !!C.fin;
  var debout = zombiesDebout();
  if(!C.zombies[cibleCombat] || C.zombies[cibleCombat].pv <= 0) cibleCombat = debout.length ? C.zombies.indexOf(debout[0]) : 0;
  var h = '<h2>🧟 Combat : ' + iconeLieu(L) + ' ' + L.nom + '</h2><p class="sub">Tour ' + Math.min(C.tour, 99) + (fini ? "" : " · touche un zombie pour le viser") + '</p>';
  h += '<div class="zs">' + C.zombies.map(function(z, k){
    return '<button class="z' + (z.pv ? "" : " mort") + (k === cibleCombat && z.pv && !fini ? " vise" : "") + '" data-act="cible" data-id="' + k + '"' + (z.pv && !fini ? "" : " disabled") + '><span class="em">' + iconeZombie(z) + '</span><b>' + z.nom + '</b>' + barre("❤️", Math.round(z.pv / z.pvMax * 100)) + '<small>' + z.pv + ' / ' + z.pvMax + ' PV · frappe ' + z.degats[0] + '-' + z.degats[1] + '</small></button>';
  }).join("") + '</div>';
  if(!fini){
    h += equipeCombat().map(function(x){
      var j = G.m.indexOf(x), c = (choixCombat[j] || "frapper"), a = x.eq.arme, d = a ? OBJETS[a.id].degats : BAL.combat.poings;
      return '<div class="cm"><div class="cmt"><span class="em">' + iconeMembre(x) + '</span><span class="eqt"><b>' + x.nom + '</b>' + barre("❤️", x.hp) + '<small>' + (a ? icone(a.id) + " " + OBJETS[a.id].nom + " " + a.sol + "/" + OBJETS[a.id].sol + (OBJETS[a.id].munition ? " · " + icone(OBJETS[a.id].munition) + " " + compter(OBJETS[a.id].munition) : "") : "✊ À mains nues") + ' · dégâts ' + d[0] + '-' + d[1] + (fatigue(x) ? " · 🥱" : "") + '</small></span></div>'
        + '<div class="cmb"><button class="mini' + (c === "frapper" ? " on" : "") + '" data-act="cact" data-id="' + j + ':frapper">⚔️ Frapper</button><button class="mini' + (c === "proteger" ? " on" : "") + '" data-act="cact" data-id="' + j + ':proteger">🛡️ Protéger</button></div></div>';
    }).join("");
  }
  if(C.journal.length) h += puces(C.journal);
  h += fini ? '<button class="btn" style="width:100%" data-act="cfin">Continuer</button>'
    : '<div class="row"><button class="btn" data-act="ctour">▶️ Jouer</button><button class="btn alt" style="flex:0 0 auto" data-act="cauto">🤖 Auto</button><button class="btn alt" style="flex:0 0 auto" data-act="cfuir">🏃 Fuir ' + Math.round(BAL.combat.fuite * 100) + '%</button></div>';
  show(h);
}

function openResultat(r){
  var i = r.lieu, L = LIEUX[i], im = imageLieu(L), h = (im ? '<div class="banniere"><img src="' + im + '" alt=""></div>' : '') + '<h2>' + iconeLieu(L) + ' ' + L.nom + '</h2>' + puces(r.notes);
  h += '<p><b>' + (r.pris.length ? "Vous trouvez " + nommerListe(r.pris) + "." : "Vous rentrez les mains vides.") + '</b></p>';
  if(r.pris.length) h += '<div class="loot">' + r.pris.map(function(g){ return '<span>' + icone(g.id) + (g.n > 1 ? "×" + g.n : "") + '</span>'; }).join("") + '</div>';
  if(r.laisses.length) h += '<p class="sub">🎒 Plus de place : vous laissez sur place ' + nommerListe(r.laisses) + '. Un sac permet de rapporter plus.</p>';
  if(r.vide) h += '<p class="sub">📭 Vous avez vidé les lieux : il n’y a plus rien à trouver ici.</p>';
  show(h + '<button class="btn" style="width:100%" data-act="close">Retour au refuge</button>');
}

/* ---------- Équiper un membre ---------- */
function openSlot(i, slot){
  var x = G.m[i], e = EMPLACEMENTS.find(function(e){ return e[0] === slot; }), o = x.eq[slot];
  var h = '<h2>' + iconeMembre(x) + ' ' + x.nom + ' : ' + e[2] + '</h2>';
  h += '<p class="sub">En main : </p>' + (o ? ligneObjet(o.id, 1, o) + '<button class="loc" data-act="unequip" data-id="' + i + ':' + slot + '"><b>↩️ Ranger dans le stock</b></button>' : '<p>Rien.</p>');
  var dispo = pourEmplacement(slot);
  h += '<p class="sub">Dans le stock :</p>';
  h += dispo.length ? dispo.map(function(d){ return '<button class="loc pick" data-act="equip" data-id="' + i + ':' + slot + ':' + d.uid + '">' + ligneObjet(d.id, 1, d) + '</button>'; }).join("") : '<p>Aucun objet de ce type au refuge.</p>';
  show(h + BTN_FERMER());
}

/* ---------- Téléphone : barre de famille compacte + fiche du membre ---------- */
function modeMini(){ return window.matchMedia("(max-width: 559px)").matches; }
function openMembre(i){
  var x = G.m[i], on = G.sel.indexOf(i) >= 0, T = TRAITS[x.trait];
  var h = '<div class="rt"><span class="em" style="font-size:60px">' + iconeMembre(x) + '</span><span class="eqt"><h2>' + x.nom + '</h2><p class="sub">' + (T ? T.icone + " " + T.nom + " · <span class=\"plus\">+ " + T.plus + "</span> · <span class=\"moins\">− " + T.moins + "</span>" : "Recrue") + (x.al ? "" : " · 💀 " + accorder(roleDe(x), "mort")) + '</p></span></div>';
  if(!x.al){ show(h + BTN_FERMER()); return; }
  [["❤️","Vie",x.hp],["⚡","Énergie",x.en],[ic("conserve", "🥫"),"Faim",x.faim],[ic("bouteille", "💧"),"Soif",x.soif]].forEach(function(j){ h += '<div class="jauge">' + barre(j[0], j[2]) + '<small>' + j[1] + ' ' + j[2] + '/100</small></div>'; });
  h += '<p class="sub">Équipement (touche une case) :</p><div class="slots grands">' + EMPLACEMENTS.map(function(e){
    var o = x.eq[e[0]], dispo = !o && pourEmplacement(e[0]).length > 0;
    return '<button class="slot' + (o ? " f" : "") + (dispo ? " dispo" : "") + '" data-act="slot" data-id="' + i + ':' + e[0] + '">' + (o ? icone(o.id) : '<span class="vide">' + e[1] + '</span>') + '<small>' + (o ? OBJETS[o.id].nom : e[2]) + '</small></button>';
  }).join("") + '</div>';
  h += '<button class="loc" data-act="soins" data-id="' + i + '"><b>＋ Soigner, boire, manger</b><small>Soins, rations d’eau et de nourriture, canette</small></button>';
  h += '<button class="loc' + (on ? " choisi" : "") + '" data-act="msel" data-id="' + i + '"' + (peutSortir(x) || on ? "" : " disabled") + '><b>' + (on ? "✔ Choisi pour partir (toucher pour retirer)" : "🔍 Choisir pour partir fouiller") + '</b><small>' + (peutSortir(x) || on ? "⚡ " + x.en + " · " + (G.sel.length) + " / " + BAL.membresParExpedition + " choisi(s)" : "Trop fatigué pour sortir aujourd’hui") + '</small></button>' + offrePub();
  show(h + BTN_FERMER());
}

/* ---------- Mission en cours ---------- */
function openMission(){
  var M = mission(); if(!M){ hide(); return; }
  var j = joursMission(), h = '<h2>' + M.icone + ' ' + M.titre + '</h2><p>' + texteMission() + '</p>';
  h += '<p class="sub">⏳ ' + (j > 1 ? "Encore " + j + " jours" : "Dernier jour !") + '</p>';
  var rec = []; for(var k in M.recompense) rec.push(icone(k) + " " + nommer(k, M.recompense[k]));
  if(M.moral) rec.push("moral +" + M.moral);
  h += '<p class="sub">🎁 Récompense : ' + rec.join(", ") + '</p>';
  if(M.livrer){
    var kl = livraisonPossible();
    h += '<button class="loc" data-act="livrer"' + (kl >= 0 ? "" : " disabled") + '><b>📦 Livrer ' + M.livrer.map(function(l){ return Object.keys(l).map(function(id){ return icone(id) + " " + nommer(id, l[id]); }).join(" + "); }).join(" ou ") + '</b><small>' + (kl >= 0 ? "Vous avez ce qu’il faut." : "Il vous manque des objets : allez fouiller !") + '</small></button>';
  } else h += '<p class="sub">🗺️ Envoie une équipe à ' + iconeLieu(LIEUX[G.mission.lieu]) + ' ' + LIEUX[G.mission.lieu].nom + ' : la mission réussit si quelqu’un en revient vivant.</p>';
  show(h + BTN_FERMER());
}

/* ---------- Détail du chapitre ---------- */
function openChapitre(){
  var c = chapitreCourant(), p = c.progres ? c.progres() : null;
  var h = '<h2>📖 Chapitre ' + (G.chap + 1) + ' · ' + c.titre + '</h2><p><b>Objectif :</b> ' + c.objectif + '</p>';
  if(p) h += '<div class="jauge">' + barre("🎯", Math.round(Math.min(p[0], p[1]) / p[1] * 100)) + '<small>' + Math.min(p[0], p[1]) + ' / ' + p[1] + ' ' + p[2] + '</small></div>';
  var rec = []; for(var k in c.recompense) rec.push(icone(k) + " " + nommer(k, c.recompense[k]));
  if(c.moral) rec.push("moral +" + c.moral);
  h += '<p class="sub">🎁 Récompense : ' + (rec.length ? rec.join(", ") : "aucune") + '</p>';
  // L'histoire jusqu'ici : les récits des chapitres passés, puis celui en cours
  var passes = CHAPITRES.slice(0, Math.min(G.chap, CHAPITRES.length));
  h += '<div class="gsec histoire"><b>📜 L’histoire jusqu’ici</b>' + passes.map(function(ch){ return '<p class="fait">' + perso(ch.recit) + '</p>'; }).join("")
    + '<p class="encours">' + perso(c.recit) + '</p></div>';
  show(h + BTN_FERMER());
}

/* ---------- Soigner / donner une canette ---------- */
function openSoins(i){
  var x = G.m[i], h = '<h2>' + iconeMembre(x) + ' ' + x.nom + '</h2><p class="sub">❤️ ' + x.hp + ' PV · ⚡ ' + x.en + ' énergie</p>';
  var bs = bonusSoin(), k = x.hp < 100 ? choisirSoin(100 - x.hp - bs) : null;
  h += '<button class="loc craft" data-act="heal" data-id="' + i + '"' + (k ? "" : " disabled") + '><span class="em">' + (k ? icone(k) : "🩹") + '</span><span class="eqt"><b>Soigner</b><small>'
    + (k ? "Utilise " + nommer(k, 1) + " (+" + OBJETS[k].soin + (bs ? " +" + bs + " grâce au soigneur" : "") + " PV) · il en reste " + compter(k) : x.hp >= 100 ? "En pleine forme" : "Aucun soin au refuge") + '</small></span></button>';
  var raison = !compter("canette") ? "Aucune canette au refuge" : x.canette ? "Déjà une canette aujourd’hui" : x.en >= 100 ? "Déjà plein d’énergie" : "";
  h += '<button class="loc craft" data-act="boire" data-id="' + i + '"' + (peutBoire(x) ? "" : " disabled") + '><span class="em">' + icone("canette") + '</span><span class="eqt"><b>Boire une canette</b><small>'
    + (raison || "+" + BAL.canetteEnergie + " ⚡ et +" + BAL.canetteSoif + " de soif 💧 tout de suite, mais " + BAL.canetteContrecoup + " ⚡ de repos en moins cette nuit · il en reste " + compter("canette")) + '</small></span></button>';
  // Boire / manger une ration en plus
  [["eau", "bouteille", "Boire une ration d’eau", "soif", x.soif], ["nour", "conserve", "Manger une ration", "faim", x.faim]].forEach(function(r){
    var ok = peutPrendreRation(x, r[0]), dispo = rations(r[0]);
    h += '<button class="loc craft" data-act="ration" data-id="' + i + ':' + r[0] + '"' + (ok ? "" : " disabled") + '><span class="em">' + icone(r[1]) + '</span><span class="eqt"><b>' + r[2] + '</b><small>'
      + (!dispo ? "Plus rien au refuge" : r[4] > seuilRation(r[0]) ? "Pas besoin : " + r[3] + " " + r[4] + " / 100, la ration de la nuit suffit" : "+" + (r[0] === "eau" ? BAL.soifParJour : BAL.faimParJour) + " de " + r[3] + " (" + r[3] + " : " + r[4] + " / 100) · il en reste " + dispo) + '</small></span></button>';
  });
  h += '<p class="sub">🌙 Chaque nuit, chacun boit et mange déjà <b>1 ration</b> automatiquement, sans gaspillage (et 1 de plus si sa jauge tombe sous ' + BAL.rattrapage + '). Une ration en plus ne sert qu’en cas d’urgence, quand une jauge est basse.</p>';
  show(h + BTN_FERMER());
}

/* ---------- Marché de quartier ---------- */
var msgMarche = "";
function openMarche(){
  var h = '<h2>' + ic("marco", MARCHE.icone) + ' Marché de quartier</h2><p class="sub">' + MARCHE.nom + ' propose quelques échanges, seulement aujourd’hui. Il repasse dans ' + MARCHE.tousLes + ' jours, tant que sa charrette n’est pas vide (' + Object.keys(G.charrette).reduce(function(t, id){ return t + G.charrette[id]; }, 0) + ' objets).</p>';
  if(msgMarche){ h += '<p class="g2 msg">' + msgMarche + '</p>'; msgMarche = ""; }
  G.marche.offres.forEach(function(o, k){
    var ok = peutEchanger(k);
    h += '<button class="loc troc" data-act="troc" data-id="' + k + '"' + (ok ? "" : " disabled") + '><span class="tr">' + icone(o.donne.id) + ' ×' + o.donne.n + '</span><span class="fl">➜</span><span class="tr">' + icone(o.recoit.id) + ' ×' + o.recoit.n + '</span><small>'
      + (o.fait ? "✅ Échange déjà fait" : "Donner " + nommer(o.donne.id, o.donne.n) + " (vous en avez " + compter(o.donne.id) + ") contre " + nommer(o.recoit.id, o.recoit.n)) + '</small></button>';
  });
  show(h + BTN_FERMER());
}

/* ---------- Fiche du chien ---------- */
var confirmerChien = false;
function openChien(){
  var c = chien(); if(!c){ hide(); return; }
  var h = '<div class="rt"><span class="em" style="font-size:52px">' + ic("chien", "🐕") + '</span><span class="eqt"><h2>' + c.nom + ', le chien</h2><p class="sub">Il a suivi la famille après qu’on l’a nourri.</p></span></div>';
  h += '<ul><li>' + ic("bouclier", "🛡️") + ' Monte la garde : <b>+' + BAL.chien.defense + ' de défense</b> la nuit.</li>'
    + '<li>' + ic("conserve", "🥫") + ' Mange <b>' + BAL.chien.rations + ' ration de nourriture</b> chaque soir, après la famille.</li>'
    + '<li>Sans manger ' + BAL.chien.nuitsSansManger + ' nuits de suite, il part chercher ailleurs.</li></ul>';
  h += '<p class="etat ' + (c.faim ? "ko" : "ok") + '">' + (c.faim ? "⚠️ Il n’a pas mangé hier soir. Ce soir, il faut une ration pour lui, sinon il part." : "✅ Il a mangé, il va bien.") + '</p>';
  if(!confirmerChien){
    h += '<button class="loc" data-act="mangerchien"' + (famine() ? "" : " disabled") + '><b>😢 Manger ' + c.nom + '</b><small>' + (famine() ? "La famille n’a plus de quoi manger ce soir. +" + BAL.chien.viande + " rations, moral " + BAL.chien.moral + ", et plus de chien de garde." : "Seulement en cas de famine : quand il ne reste plus de quoi nourrir la famille ce soir.") + '</small></button>';
  } else {
    h += '<p class="msg">Vraiment ? ' + c.nom + ' ne reviendra jamais, et toute la famille va le vivre très mal.</p><div class="row"><button class="btn" data-act="mangerchienok">Oui, il le faut</button><button class="btn alt" data-act="chien">Non</button></div>';
  }
  show(h + BTN_FERMER());
}

/* ---------- Stock partagé ---------- */
function ligneObjet(id, n, inst){
  var o = OBJETS[id], unite = o.nuit ? " nuits restantes" : o.lumiere ? " fouilles restantes" : "";
  var extra = inst && inst.sol ? barre("🔧", Math.round(inst.sol / o.sol * 100)) + '<small>' + (unite ? inst.sol + unite : 'Solidité ' + inst.sol + ' / ' + o.sol) + '</small>' : '<small>' + o.desc + '</small>';
  return '<div class="eq"><span class="em">' + icone(id) + '</span><span class="eqt"><b>' + o.nom + (n > 1 ? " ×" + n : "") + '</b>' + extra + '</span></div>';
}
function openStock(){
  var h = '<h2>' + ic("caisse", "📦") + ' Le stock du refuge</h2><p class="sub">💧 ' + rations("eau") + ' rations d’eau · 🥫 ' + rations("nour") + ' rations de nourriture'
    + (G.reste.eau || G.reste.nour ? ' (dont ' + G.reste.eau + ' eau et ' + G.reste.nour + ' nourriture déjà entamées)' : '') + '</p>';
  var vide = true;
  CATEGORIES.forEach(function(c){
    var lignes = "";
    for(var k in G.stock.n) if(OBJETS[k].cat === c[0]) lignes += ligneObjet(k, G.stock.n[k]);
    G.stock.o.filter(function(o){ return OBJETS[o.id].cat === c[0]; }).forEach(function(o){ lignes += ligneObjet(o.id, 1, o); });
    if(lignes){ vide = false; h += '<b>' + c[1] + '</b><div class="eqs">' + lignes + '</div>'; }
  });
  if(vide) h += '<p>Le stock est vide.</p>';
  show(h + BTN_FERMER());
}

/* ---------- Refuge : construire et atelier (onglets) ---------- */
var ONGLETS = [ ["construire","🔨","Construire"], ["fabriquer","🛠️","Fabriquer"], ["reparer","🔧","Réparer"], ["demonter","♻️","Démonter"], ["voiture","🚗","Voiture"] ];
var enVoiture = false, pieceChoisie = null;
// Place des emplacements sur le dessin de la voiture en panne, en % de l'image (gauche, haut)
var POS_PIECES = { batterie:[17, 50], roue:[27, 79], courroie:[7, 71] };
// Onglet Voiture : glisser une pièce du stock sur son emplacement (ou toucher la pièce puis l'emplacement)
function ongletVoiture(){
  var V = G.voiture, ok = voitureReparee(), x = artisan();
  var h = '<p class="sub">' + VOITURE.nom + ' : ' + (ok ? "✅ en état de rouler." : "en panne. Glisse chaque pièce sur son emplacement (" + BAL.energieCraft + " ⚡ au plus reposé" + (x ? "" : " : 😴 tout le monde est trop fatigué") + ").") + '</p>';
  // Dessin de la voiture (Gemini) avec les emplacements posés à leur place : batterie dans le moteur, roue sur l'essieu, courroie à l'avant
  h += '<div class="garage"><div class="voitimg"><img src="images/voiture-' + (ok ? "ok" : "panne") + '.webp" alt="' + VOITURE.nom + (ok ? " réparée" : " en panne") + '">' + (ok ? "" : VOITURE.pieces.map(function(p){
    var fait = V.installees[p], pos = POS_PIECES[p] || [50, 50];
    return '<button class="pslot' + (fait ? " fait" : "") + (pieceChoisie && !fait ? " attend" : "") + '" style="left:' + pos[0] + '%;top:' + pos[1] + '%" data-slot="' + p + '" data-act="pslot" data-id="' + p + '"' + (fait ? " disabled" : "") + ' aria-label="' + OBJETS[p].nom + (fait ? " : installée" : " : emplacement vide") + '" title="' + OBJETS[p].nom + '"><span class="em">' + (fait ? icone(p) : '<span class="vide">' + icone(p) + '</span>') + '</span></button>';
  }).join("")) + '</div>'
    + '<p class="pleg">' + VOITURE.pieces.map(function(p){ return icone(p) + ' ' + OBJETS[p].nom + (V.installees[p] ? " ✔" : ""); }).join(" · ") + '</p></div>';
  var dispo = VOITURE.pieces.filter(function(p){ return !V.installees[p] && compter(p) > 0; });
  if(!ok) h += '<p class="sub">Pièces au refuge :</p><div class="parts">' + (dispo.length ? dispo.map(function(p){ return '<button class="part' + (pieceChoisie === p ? " on" : "") + '" data-piece="' + p + '" data-act="piece" data-id="' + p + '"' + (x ? "" : " disabled") + '>' + icone(p) + '<small>' + OBJETS[p].nom + '</small></button>'; }).join("") : '<small>Aucune pour l’instant. Cherche au Garage auto et à la Zone industrielle.</small>') + '</div>';
  h += '<p class="sub">⛽ Essence : ' + V.essence + ' / ' + VOITURE.reservoir + ' L</p>' + barre("⛽", Math.round(V.essence / VOITURE.reservoir * 100));
  h += '<button class="loc" data-act="plein"' + (compter("jerrican") && V.essence < VOITURE.reservoir ? "" : " disabled") + '><b>' + icone("jerrican") + ' Faire le plein</b><small>' + compter("jerrican") + ' jerrican' + (compter("jerrican") > 1 ? "s" : "") + ' au refuge · +' + VOITURE.litresJerrican + ' L chacun</small></button>';
  return h;
}
var ongletRef = "construire", msgAtelier = "";
// Pastilles « ce qu'il faut » : nom en clair, quantité, et combien on en a
function ingredients(ing, besoin){
  var t = [];
  for(var k in ing){
    var a = compter(k), ok = a >= ing[k];
    t.push('<span class="ing ' + (ok ? "ok" : "ko") + '">' + icone(k) + ' ' + nommer(k, ing[k]).replace(/^(un|une) /, "1 ") + ' <em>' + (ok ? "✔" : "✖") + ' tu en as ' + a + '</em></span>');
  }
  if(besoin){
    var p = possede(function(o){ return o === OBJETS[besoin]; });
    t.push('<span class="ing ' + (p ? "ok" : "ko") + '">' + icone(besoin) + ' ' + OBJETS[besoin].nom + ' <em>' + (p ? "✔ tu l’as (elle n’est pas consommée)" : "✖ il en faut une au refuge") + '</em></span>');
  }
  return '<div class="ings">' + t.join("") + '</div>';
}
// Phrase d'état sous une recette : prêt, ou ce qui manque exactement
function etatTravail(ing, besoin, texteOk){
  var manque = [];
  for(var k in ing) if(compter(k) < ing[k]) manque.push({ id:k, n:ing[k] - compter(k) });
  if(besoin && !possede(function(o){ return o === OBJETS[besoin]; })) return '<p class="etat ko">🔧 Il faut ' + nommer(besoin, 1) + ' au refuge</p>';
  if(manque.length) return '<p class="etat ko">❌ Il manque ' + nommerListe(manque) + '</p>';
  var x = artisan();
  if(!x) return '<p class="etat ko">😴 Tout le monde est trop fatigué (il faut ' + BAL.energieCraft + ' ⚡)</p>';
  return '<p class="etat ok">✅ ' + (texteOk || "Prêt : touche pour le faire") + ' (' + iconeMembre(x) + ' ' + x.nom + ', −' + BAL.energieCraft + ' ⚡)</p>';
}
// Tout ce qui protège et nourrit le refuge, d'un coup d'œil (en haut de l'onglet Construire)
function bilanRefuge(){
  var L = [], ligne = function(icn, titre, detail){ L.push('<div class="bl"><span class="em">' + icn + '</span><span class="eqt"><b>' + titre + '</b><small>' + detail + '</small></span></div>'); };
  if(G.ref.barr) ligne(ic("ref_barr", "🧱"), "Barricade · niveau " + G.ref.barr, "+" + G.ref.barr * BAL.defenseBarricade + " de défense la nuit (une attaque perdue en détruit un niveau)");
  if(G.ref.eau) ligne(ic("ref_eau", "🪣"), "Récupérateur d’eau · niveau " + G.ref.eau, "+" + G.ref.eau * REFUGE.eau.parJour + " ration(s) d’eau chaque nuit");
  if(G.ref.pot) ligne(ic("ref_pot", "🥕"), "Potager · niveau " + G.ref.pot, "+" + G.ref.pot * REFUGE.pot.parJour + " ration(s) de nourriture chaque nuit");
  G.stock.o.filter(function(o){ return OBJETS[o.id].nuit; }).forEach(function(o){
    var p = OBJETS[o.id].nuit;
    ligne(icone(o.id), OBJETS[o.id].nom + " · encore " + o.sol + " nuit" + (o.sol > 1 ? "s" : ""), Math.round(p.chance * 100) + " % de chances chaque nuit : +" + p.rations + " ration(s) " + (p.cat === "eau" ? "d’eau" : "de nourriture"));
  });
  if(compter("piege")) ligne(icone("piege"), nommer("piege", compter("piege")).replace(/^(un|une) /, "1 "), "+" + BAL.piegeDef + " de défense contre la prochaine attaque de nuit (un piège par attaque)");
  var np = compter("poule"); if(np) ligne(ic("poule", "🐔"), nommer("poule", np).replace(/^une /, "1 "), "pondent ≈ " + String(Math.round(np * BAL.poules.oeuf * 10) / 10).replace(".", ",") + " ration(s) par nuit · boivent " + Math.ceil(np / BAL.poules.eauPour) + " ration(s) d’eau · +" + Math.round(np * BAL.poules.attaque * 100) + " % de risque d’attaque");
  var c = chien(); if(c) ligne(ic("chien", "🐕"), c.nom + ", le chien", "+" + BAL.chien.defense + " de défense la nuit · mange " + BAL.chien.rations + " ration chaque soir" + (c.faim ? " · ⚠️ n’a pas mangé hier" : ""));
  var nb = vivants().length, armes = 0; equipes().forEach(function(o){ armes += OBJETS[o.id].def || 0; });
  var h = '<div class="bilan"><b>Ce qui protège et nourrit le refuge</b>';
  h += L.length ? L.join("") : '<p class="sub">Rien pour l’instant. Construis un récupérateur d’eau ou un potager, ou fabrique une bâche ou un collet à l’atelier.</p>';
  h += '<p class="sub">Chaque nuit, la famille boit ' + nb + ' et mange ' + nb + (c ? " (+" + BAL.chien.rations + " pour " + c.nom + ")" : "") + ' rations. '
    + 'Défense de nuit : ' + defenseNuit() + ' (dont ' + armes + ' grâce aux armes en main).</p></div>';
  return h;
}
function openRef(onglet){
  astuce("atelier");
  if(onglet) ongletRef = onglet;
  var x = artisan();
  var h = '<h2>🏠 Le refuge</h2><div class="tabs onglets">' + ONGLETS.map(function(o){ return '<button class="tab' + (o[0] === ongletRef ? " on" : "") + '" data-act="onglet" data-id="' + o[0] + '">' + o[1] + '<small>' + o[2] + '</small></button>'; }).join("") + '</div>';
  if(msgAtelier){ h += '<p class="g2 msg">' + msgAtelier + '</p>'; msgAtelier = ""; }
  if(ongletRef === "voiture") h += ongletVoiture();
  else if(ongletRef === "construire"){
    h += bilanRefuge();
    h += '<p class="sub">' + ic("planche", "🪵") + ' ' + compter("planche") + ' planches · ' + ic("bouclier", "🛡️") + ' défense de nuit ' + defenseNuit() + '</p>';
    for(var k in REFUGE){
      var r = REFUGE[k], l = G.ref[k], c = coutAmelioration(k), mx = l >= r.max;
      var cout = {}; cout.planche = c;
      h += '<button class="loc recette" data-act="build" data-id="' + k + '"' + (mx || compter("planche") < c ? " disabled" : "") + '><div class="rt"><span class="em">' + ic("ref_" + k, r.icone) + '</span><span class="eqt"><b>' + r.nom + ' · niveau ' + l + ' / ' + r.max + '</b><small>' + r.desc + '</small></span></div>'
        + (mx ? '<p class="etat ok">⭐ Niveau maximum atteint</p>' : ingredients(cout) + (compter("planche") < c ? '<p class="etat ko">❌ Il manque ' + nommer("planche", c - compter("planche")) + '</p>' : '<p class="etat ok">✅ Prêt : touche pour construire</p>')) + '</button>';
    }
  } else {
    h += '<p class="sub">Chaque travail coûte ' + BAL.energieCraft + ' ⚡ au plus reposé' + (x ? ' (' + iconeMembre(x) + ' ' + x.nom + ' ⚡' + x.en + ')' : ' : 😴 tout le monde est trop fatigué') + '.</p>';
    if(ongletRef === "fabriquer"){
      // Ce qu'on peut fabriquer tout de suite en premier
      RECETTES.map(function(rec, i){ return { rec:rec, i:i, e:empechement(rec.ingredients, rec.besoin) }; })
        .sort(function(a, b){ return (a.e ? 1 : 0) - (b.e ? 1 : 0); })
        .forEach(function(r){
          var o = OBJETS[r.rec.id];
          h += '<button class="loc recette" data-act="craft" data-id="' + r.i + '"' + (r.e ? " disabled" : "") + '><div class="rt"><span class="em">' + icone(r.rec.id) + '</span><span class="eqt"><b>' + o.nom + '</b><small>' + o.desc + '</small></span></div>'
            + ingredients(r.rec.ingredients, r.rec.besoin) + etatTravail(r.rec.ingredients, r.rec.besoin) + '</button>';
        });
    } else if(ongletRef === "reparer"){
      var ab = armesAbimees(), e = empechement(REPARATION);
      h += '<p class="sub">Une réparation rend ' + Math.round(BAL.reparation * 100) + ' % de la solidité. Il faut :</p>' + ingredients(REPARATION) + (ab.length ? etatTravail(REPARATION, null, "Prêt : touche l’arme à réparer") : '');
      h += ab.length ? ab.map(function(o){ return '<button class="loc pick" data-act="repair" data-id="' + o.uid + '"' + (e ? " disabled" : "") + '>' + ligneObjet(o.id, 1, o) + '</button>'; }).join("") : '<p>Aucune arme abîmée.</p>';
    } else {
      var dm = demontables();
      h += '<p class="sub">Démonter un objet rangé dans le stock pour récupérer des matériaux (les objets équipés ne sont pas proposés).</p>';
      h += dm.length ? dm.map(function(o){
        var rec = []; for(var k in DEMONTAGE[o.id]) rec.push(icone(k) + " " + nommer(k, DEMONTAGE[o.id][k]));
        return '<button class="loc pick" data-act="salvage" data-id="' + o.uid + '"' + (x ? "" : " disabled") + '><div class="eq"><span class="em">' + icone(o.id) + '</span><span class="eqt"><b>' + OBJETS[o.id].nom + '</b><small>Tu récupères : ' + rec.join(", ") + '</small></span></div></button>';
      }).join("") : '<p>Rien à démonter dans le stock.</p>';
    }
  }
  show(h + BTN_FERMER());
}

/* ---------- Nuit, événements, mort ---------- */
function openNuit(n){
  // Bandeau : le refuge assiégé s'il y a eu une attaque cette nuit, sinon l'aube calme (griffures sur les planches)
  var attaque = n.some(function(l){ return String(l[1]).indexOf("Attaque de nuit") >= 0; });
  show('<div class="banniere"><img src="images/' + (attaque ? "nuit" : "aube") + '.webp" alt=""></div><h2>Fin du jour ' + (G.day - 1) + '</h2><p class="sub">⭐ +' + vivants().length + ' (un point par survivant) · Score : ' + G.score + '</p>' + puces(n) + '<button class="btn" style="width:100%" data-act="morning">Jour ' + G.day + '</button>');
}
function openEvent(ev){
  G.ev = ev; G.evIdx = EVENEMENTS.indexOf(ev);
  var h = '<h2>' + G.ev.titre + '</h2><p>' + texteEvenement(G.ev) + '</p>';
  G.ev.choix.forEach(function(c, i){ h += '<button class="loc" data-act="ev" data-id="' + i + '"><b>' + c[0] + '</b></button>'; });
  show(h);
}
function finiSiMorts(){ if(!vivants().length){ over(); return true; } return false; }
function over(){
  effacerSauvegarde();
  var d = G.day - 1, nouveau = G.score > RECORD, jour = "";
  if(nouveau){ RECORD = G.score; try{ localStorage.setItem("survival_record", RECORD); }catch(e){} }
  var auto = false;
  if(G.seed){
    var cle = "survival_jour_" + G.seed, meilleur = 0;
    try{ meilleur = +localStorage.getItem(cle) || 0; if(G.score > meilleur){ localStorage.setItem(cle, G.score); } }catch(e){}
    // Partie classée : le score part tout seul au classement général si on a un pseudo
    if(typeof openEnvoiScore === "function"){
      dernierEnvoi = { score:G.score, jours:d };
      if(lirePseudo()){ auto = true; jour += '<p class="go-sous" id="envoiauto">🏆 Envoi au classement…</p><button class="btn" style="width:100%;margin-bottom:8px" data-act="classement">🏆 Voir le classement</button>'; }
      else jour += '<button class="btn" style="width:100%;margin-bottom:8px" data-act="envoiscore">🏆 Envoyer au classement</button>';
    }
    jour += '<button class="btn alt" style="width:100%;margin-bottom:8px" data-act="partage">📋 Copier mon résultat pour le partager</button>';
  } else jour += '<p class="go-sous">🎲 Partie libre : pas de classement.</p>';
  var lv = G.ref.barr + G.ref.eau + G.ref.pot;
  ecranGameOver(d, nouveau, jour, lv);
  if(auto) envoyerScoreAuto();
}
// Écran de fin plein écran : les disparus en gris, le score en grand
function ecranGameOver(d, nouveau, jour, lv){
  hide(); son("glas");
  if(typeof verifierSucces === "function"){ verifierSucces(); vibrer([300, 150, 300, 150, 600]); }
  var e = $("gameover"); if(!e){ e = document.createElement("div"); e.id = "gameover"; document.body.appendChild(e); }
  e.innerHTML = '<div class="go-boite"><div class="go-gauche"><h1 class="go-titre">GAME OVER</h1><p class="go-sous">Votre famille n’est plus.</p>'
    + '<div class="go-morts">' + G.dd.map(function(z){ return '<div class="go-mort"><span class="em">' + iconeMembre({ nom:z.n, r:z.r, al:false, hp:0, en:0, faim:0, soif:0, icone:z.ic || "💀" }) + '</span><b>' + z.n + '</b><small>' + accorder(z.r || z.n, z.c) + '<br>jour ' + z.j + '</small></div>'; }).join("") + '</div></div>'
    + '<div class="go-droite"><p class="go-jours">Vous avez tenu <b>' + d + ' jour' + (d > 1 ? "s" : "") + '</b></p>'
    + '<p class="go-score">⭐ ' + G.score + '</p><p class="go-sous">' + (nouveau ? "🏆 Nouveau record !" : "Record : " + RECORD + " points") + ' · 🔨 refuge niveau ' + lv + '</p>'
    + jour + '<button class="btn" style="width:100%" data-act="again">Nouvelle famille</button></div></div>';
  e.style.display = "flex";
}

// Texte à coller dans un message pour comparer avec ses amis (en attendant un vrai classement en ligne)
function copierResultat(bouton){
  var txt = "SURVIVAL – Partie classée du " + dateGraine(G.seed) + " : ma famille a tenu " + (G.day - 1) + " jours, ⭐ " + G.score + " points. Tu fais mieux ?";
  var ok = function(){ bouton.textContent = "✅ Copié ! Colle-le dans un message."; };
  try{ navigator.clipboard.writeText(txt).then(ok, function(){ bouton.textContent = txt; }); }
  catch(e){ bouton.textContent = txt; }
}

/* ---------- Fausse pub récompensée ----------
   Comme sur un jeu mobile : elle n'a pas de bouton fixe, elle est proposée
   seulement quand elle aide (plus personne n'a assez d'énergie pour sortir). */
function pubUtile(){ return G.ph === "game" && G.ads < BAL.pubsParJour && vivants().length && !G.m.some(peutSortir) && vivants().some(function(x){ return x.en + BAL.energiePub >= coutMin(); }); }
function offrePub(retour){
  if(!pubUtile()) return "";
  return '<button class="loc offrepub" data-act="ad" data-id="' + (retour || "") + '"><b>📺 Second souffle : +' + BAL.energiePub + ' ⚡ pour toute la famille</b><small>Regarder une courte pub · encore ' + (BAL.pubsParJour - G.ads) + ' aujourd’hui</small></button>';
}
/* ---------- Fausse pub récompensée ---------- */
var AD = null;
function openAd(kind){
  AD = { k:kind, s:5 };
  var tm = setInterval(function(){
    AD.s--; var b = $("adb"), t = $("adt");
    if(t) t.textContent = AD.s > 0 ? "Pub en cours… " + AD.s + " s" : "Récompense prête !";
    if(AD.s <= 0){ clearInterval(tm); if(b) b.disabled = false; }
  }, 1000);
  show('<h2>📺 Publicité (simulation)</h2><p class="sub">Ici s’affichera plus tard une vraie pub récompensée.</p><p id="adt"><b>Pub en cours… 5 s</b></p><button class="btn" id="adb" style="width:100%" disabled data-act="adok">Récupérer la récompense</button>');
}

/* ---------- Compte à rebours du départ ---------- */
function tick(){
  if(G.ph !== "pick" || $("modal").style.display === "flex" || $("astuce")) return; // pause pendant une astuce
  G.tl -= 0.25;
  var tm = Math.max(0, G.tl), pc = Math.min(100, Math.round(tm / BAL.tempsDepart * 100)), s = $("tsec"), b = $("tbar");
  if(s) s.textContent = "⏱ " + Math.ceil(tm) + " s";
  if(b){ b.style.width = pc + "%"; b.className = pc < 30 ? "lo" : ""; }
  // 10 dernières secondes : tout clignote, ça cogne à la porte, le téléphone vibre
  document.body.classList.toggle("urgence", tm <= 10 && tm > 0);
  var sec = Math.ceil(tm);
  if(tm <= 10 && tm > 0 && sec !== derniereSeconde){ derniereSeconde = sec; if(sec % 2 === 0) son("porte"); if(typeof vibrer === "function") vibrer(sec <= 3 ? 120 : 40); }
  if(G.tl <= 0){ demarrer(); render(); show('<h2>Trop tard !</h2><p>Les zombies enfoncent la porte. Vous fuyez avec ce qu’il y a dans le sac.</p>' + BTN_FERMER("Courir")); }
}
var derniereSeconde = null;
setInterval(tick, 250);

function render(){
  if(G.ph !== "pick") document.body.classList.remove("urgence");
  document.body.classList.toggle("fond", G.ph === "game" || G.ph === "accueil" || G.ph === "intro" || G.ph === "famille" || G.ph === "pick"); // fond peint
  document.body.classList.toggle("maison", G.ph === "intro" || G.ph === "famille" || G.ph === "pick"); // avant la fuite : l'entrée de la maison
  if(typeof placerPiece === "function") setTimeout(placerPiece, 0); // zones cliquables de la pièce (piece.js)
  if(G.ph === "accueil") return; if(G.ph === "intro"){ rIntro(); return; } if(G.ph === "famille"){ rFamille(); return; } if(G.ph === "pick") rPick(); else { verifierChapitre(); rGame(); if(typeof verifierSucces === "function") verifierSucces(); } }
// Ferme la fenêtre, ou montre d'abord un chapitre terminé
function fermer(){
  var A = G.annonces && G.annonces.shift();
  if(!A || !vivants().length){ hide(); return; }
  show('<h2>📖 Chapitre ' + A.num + ' terminé</h2><p><b>' + A.titre + '</b></p><p>' + perso(A.texte) + '</p><p class="g2 msg">🎁 ' + [A.recompense, A.moral ? "Moral +" + A.moral : ""].filter(Boolean).join(" · ") + '</p><p class="histoire"><i>' + perso(chapitreCourant().recit) + '</i></p><p class="sub">Prochain : ' + chapitreCourant().titre + ' — ' + chapitreCourant().objectif + '</p>' + BTN_FERMER("Continuer"));
}

/* ---------- Glisser-déposer des pièces de voiture ----------
   Fonctionne à la souris et au doigt (événements « pointer »). */
function poserPiece(piece, slot){
  pieceChoisie = null; setTimeout(sauver, 0);
  if(piece !== slot) msgAtelier = "❌ " + (OBJETS[piece].g === "f" ? "La " : "Le ") + minus(OBJETS[piece].nom) + " ne va pas là.";
  else { msgAtelier = installerPiece(piece) || "Impossible pour l’instant."; son("piece"); }
  render(); openRef();
}
var glisse = null, finGlisse = 0; // le clic qui suit juste un glisser est ignoré
document.addEventListener("pointerdown", function(e){
  var p = e.target.closest(".part"); if(!p || p.disabled) return;
  glisse = { id:p.getAttribute("data-piece"), x:e.clientX, y:e.clientY, fantome:null, src:p };
});
document.addEventListener("pointermove", function(e){
  if(!glisse) return;
  if(!glisse.fantome){
    if(Math.abs(e.clientX - glisse.x) + Math.abs(e.clientY - glisse.y) < 8) return;
    var f = glisse.src.cloneNode(true); f.className = "part fantome"; document.body.appendChild(f); glisse.fantome = f;
  }
  glisse.fantome.style.left = (e.clientX - 32) + "px"; glisse.fantome.style.top = (e.clientY - 32) + "px";
  document.querySelectorAll(".pslot.survol").forEach(function(s){ s.classList.remove("survol"); });
  var sous = document.elementFromPoint(e.clientX, e.clientY), s = sous && sous.closest("[data-slot]");
  if(s && !s.disabled) s.classList.add("survol");
});
document.addEventListener("pointerup", function(e){
  if(!glisse) return;
  var g = glisse; glisse = null;
  if(!g.fantome) return; // simple toucher : géré par le clic
  g.fantome.remove(); finGlisse = Date.now();
  var sous = document.elementFromPoint(e.clientX, e.clientY), s = sous && sous.closest("[data-slot]");
  if(s && !s.disabled) poserPiece(g.id, s.getAttribute("data-slot"));
  else openRef();
});
document.addEventListener("click", function(e){ if(Date.now() - finGlisse < 300){ finGlisse = 0; e.stopPropagation(); e.preventDefault(); } }, true);

/* ---------- Avant le départ : l'histoire, puis la famille (noms, traits, pseudo, mode) ---------- */
function rIntro(){
  $("app").innerHTML = '<div class="panneau intro"><div class="tetejeu"><img class="logo" src="images/logo.webp" alt=""><div><h1 class="titrejeu">SURVIVAL</h1><p class="sub">Le dernier refuge</p></div></div>'
    + '<p>Personne n’a compris ce qui se passait. En une semaine, les villes se sont tues : les morts se relèvent, et ils ont faim.</p>'
    + '<p>Ta famille a tenu bon dans votre maison… jusqu’à ce soir. <b>Ils sont à la porte.</b> Tu as une minute pour remplir le sac avant de fuir vers le refuge : une vieille maison au bout de la rue, avec une cheminée et des murs solides.</p>'
    + '<p>Là-bas, il faudra fouiller le quartier, barricader, soigner les tiens. Personne ne viendra vous sauver. Le seul but : <b>tenir le plus longtemps possible, tous ensemble.</b></p>'
    + '<button class="btn" style="width:100%" data-act="intro">Continuer</button></div>';
}
// Noms et traits de la dernière famille (gardés dans le navigateur)
function familleRetenue(){
  var f = null; try{ f = JSON.parse(localStorage.getItem("survival_famille")); }catch(e){}
  return FAMILLE.map(function(m, k){ var c = f && f[k] || {}; return { nom:c.nom || m.nom, trait:TRAITS[c.trait] ? c.trait : m.trait }; });
}
function texteTrait(t){ var T = TRAITS[t]; return '<span class="plus">+ ' + T.plus + '</span><span class="moins">− ' + T.moins + '</span>'; }
function rFamille(){
  var F = G.famille || (G.famille = familleRetenue()), ps = lirePseudo();
  $("app").innerHTML = '<div class="panneau famille"><div class="famtete"><h1>Ta famille</h1>'
    + '<button class="pseudobtn' + (ps ? "" : " vide") + '" data-act="saisie" data-id="p"><small>Ton pseudo</small><b>' + (ps ? "👤 " + echapper(ps) : "👤 Choisir") + ' <span class="crayon">✏️</span></b></button></div>'
    + '<div class="fam">' + FAMILLE.map(function(m, k){
        var T = TRAITS[F[k].trait];
        return '<div class="fm"><span class="em">' + iconeMembre({ nom:m.nom, r:m.nom, icone:m.icone, al:true, hp:100, en:100, faim:100, soif:100 }) + '</span><div class="fmc">'
          + '<button class="fmnom" data-act="saisie" data-id="' + k + '" aria-label="Changer le prénom de ' + echapper(F[k].nom) + '">' + echapper(F[k].nom) + ' <span class="crayon">✏️</span></button>'
          + '<div class="fmtrait"><button class="fleche" data-act="trait" data-id="' + k + ':-1" aria-label="Trait précédent">◀</button>'
          + '<span class="tnom">' + T.icone + ' ' + T.nom + '</span>'
          + '<button class="fleche" data-act="trait" data-id="' + k + ':1" aria-label="Trait suivant">▶</button></div>'
          + '<small>' + texteTrait(F[k].trait) + '</small></div></div>';
      }).join("") + '</div>'
    + '<div class="tabs modes"><button class="tab' + (G.seed ? " on" : "") + '" data-act="modefam" data-id="classee">🏆 Partie classée<small>La même pour tous aujourd’hui</small></button>'
    + '<button class="tab' + (G.seed ? "" : " on") + '" data-act="modefam" data-id="libre">🎲 Partie libre<small>Au hasard, sans classement</small></button></div>'
    + '<p class="msg" id="msgfam"></p><button class="btn" style="width:100%" data-act="famok">Préparer le sac ⏱</button></div>';
}
// Fenêtre pour taper un prénom (k = 0 à 3) ou le pseudo (k = "p")
function openSaisie(k){
  var p = k === "p", v = p ? lirePseudo() : G.famille[+k].nom;
  show('<h2>✏️ ' + (p ? "Ton pseudo" : "Prénom de " + FAMILLE[+k].nom) + '</h2><p class="sub">' + (p ? "Il s’affichera dans le classement (pas ton vrai nom). 16 lettres au plus." : "10 lettres au plus.") + '</p>'
    + '<input id="saisie" class="champ grand" maxlength="' + (p ? 16 : 10) + '" autocomplete="off" value="' + echapper(v) + '">'
    + '<p class="msg" id="msgsaisie"></p><div class="row"><button class="btn" data-act="saisieok" data-id="' + k + '">OK</button><button class="btn alt" data-act="close">Annuler</button></div>');
  setTimeout(function(){ var c = $("saisie"); if(c){ c.focus(); c.select(); } }, 50);
}
function validerSaisie(k){
  var v = ($("saisie").value || "").replace(/[<>&"]/g, "").trim();
  if(k === "p"){ try{ localStorage.setItem("survival_pseudo", v.slice(0, 16)); }catch(e){} hide(); render(); return; }
  k = +k; v = v.slice(0, 10) || FAMILLE[k].nom;
  if(G.famille.some(function(f, j){ return j !== k && f.nom.toLowerCase() === v.toLowerCase(); })){ $("msgsaisie").textContent = "Un autre membre s’appelle déjà « " + v + " »."; return; }
  G.famille[k].nom = v; hide(); render();
}
function changerTrait(k, sens){
  var ids = Object.keys(TRAITS), i = ids.indexOf(G.famille[k].trait);
  G.famille[k].trait = ids[(i + sens + ids.length) % ids.length];
}
// Nettoie les prénoms ; refuse deux prénoms identiques
function validerFamille(){
  var F = G.famille, vus = {};
  for(var k = 0; k < F.length; k++){
    F[k].nom = String(F[k].nom || "").replace(/[<>&"]/g, "").trim().slice(0, 10) || FAMILLE[k].nom;
    var cle = F[k].nom.toLowerCase();
    if(vus[cle]){ $("msgfam").textContent = "Deux membres s’appellent « " + F[k].nom + " » : choisis des prénoms différents."; return false; }
    vus[cle] = true;
  }
  try{ localStorage.setItem("survival_famille", JSON.stringify(F)); }catch(e){}
  return true;
}
document.addEventListener("keydown", function(e){ if(e.key === "Enter" && e.target && e.target.id === "saisie"){ var b = document.querySelector("[data-act=saisieok]"); if(b) b.click(); } });

/* ---------- Pastilles du haut : ce qu'elles veulent dire ---------- */
function openInfo(id){
  var h = "";
  if(id === "eau" || id === "nour"){
    var eau = id === "eau", r = rations(id), b = besoinNuit(id), nuits = b ? Math.floor(r / Math.max(1, vivants().length)) : 0;
    h = '<h2>' + ic(eau ? "bouteille" : "conserve", eau ? "💧" : "🥫") + ' ' + (eau ? "Rations d’eau" : "Rations de nourriture") + ' : ' + r + '</h2>'
      + '<p>Chaque nuit, chaque membre ' + (eau ? "boit" : "mange") + ' <b>1 ration</b> tout seul. Si sa jauge ' + (eau ? "de soif" : "de faim") + ' est basse (sous ' + BAL.rattrapage + '), il en prend une de plus quand il en reste assez pour les autres.</p>'
      + '<p class="g2 msg">🌙 Cette nuit : <b>' + Math.min(b, r) + ' ration' + (Math.min(b, r) > 1 ? "s" : "") + '</b> · réserve pour environ <b>' + nuits + ' nuit' + (nuits > 1 ? "s" : "") + '</b></p>'
      + (r < vivants().length ? '<p class="msg">⚠️ Pas assez pour tout le monde ce soir : ' + (eau ? "la soif" : "la faim") + ' va faire des dégâts.</p>' : '')
      + '<p class="sub">Une ration de plus dans la journée (bouton ＋ d’un membre) ne sert qu’en urgence, quand une jauge est basse. ' + (eau ? "Le récupérateur d’eau, la bâche et la pluie remplissent la réserve." : "Le potager, la pêche, les poules et le collet remplissent la réserve.") + '</p>';
  } else if(id === "soin"){
    var l = []; for(var k in G.stock.n) if(OBJETS[k].soin) l.push(icone(k) + " " + nommer(k, G.stock.n[k]) + " (+" + OBJETS[k].soin + " PV)");
    h = '<h2>' + ic("bandage", "🩹") + ' Objets de soin : ' + soinsDispo() + '</h2><p>' + (l.length ? l.join("<br>") : "Aucun soin au refuge.") + '</p>'
      + '<p class="sub">Pour soigner quelqu’un, touche le ＋ de sa carte. Le meilleur soin adapté est choisi tout seul.' + (bonusSoin() ? " Grâce au soigneur, chaque soin rend " + bonusSoin() + " PV de plus." : "") + ' La nuit, un membre bien nourri regagne ' + BAL.regenPV + ' PV.</p>';
  } else if(id === "def"){
    var p = [];
    if(G.ref.barr) p.push(ic("ref_barr", "🧱") + " Barricade niveau " + G.ref.barr + " : +" + G.ref.barr * BAL.defenseBarricade);
    equipes().forEach(function(o){ if(OBJETS[o.id].def) p.push(icone(o.id) + " " + OBJETS[o.id].nom + " en main : +" + OBJETS[o.id].def); });
    if(compter("piege") > 0) p.push(icone("piege") + " Piège à zombies : +" + BAL.piegeDef + " (un seul usage)");
    if(chien()) p.push(ic("chien", "🐕") + " " + chien().nom + " monte la garde : +" + BAL.chien.defense);
    var A = BAL.attaqueNuit, ch = Math.round(Math.min(A.max, A.base + G.day * A.parJour + compter("poule") * BAL.poules.attaque) * 100), f = 1 + Math.floor(G.day / A.joursParForce);
    h = '<h2>' + ic("bouclier", "🛡️") + ' Défense de nuit : ' + defenseNuit() + '</h2><p>' + (p.length ? p.join("<br>") : "Rien pour l’instant : construis la barricade et garde des armes au refuge.") + '</p>'
      + '<p class="msg">🧟 Cette nuit : environ <b>' + ch + ' %</b> de risque d’attaque, d’une force de <b>' + f + ' à ' + (f + 2) + '</b>. Si votre défense est plus faible, ils blessent quelqu’un, volent de la nourriture et abîment la barricade.</p>';
  } else if(id === "moral"){
    h = '<h2>😀 Moral : ' + Math.round(G.moral) + ' / 100</h2><p>C’est l’envie de tenir de la famille. Il baisse un peu chaque nuit (−' + BAL.moralPerteNuit + ') et beaucoup quand quelqu’un meurt.</p>'
      + '<p>' + (G.moral < BAL.moralBas ? '<span class="moins">⚠️ Sous ' + BAL.moralBas + ', l’équipe fouille moins bien.</span>' : 'Sous ' + BAL.moralBas + ', l’équipe fouillerait moins bien.') + '</p>'
      + '<p class="sub">Pour le remonter : les objets de confort (peluche, photo, cartes…) au refuge, les bons choix le matin, les chapitres réussis, un chien' + (vivants().some(function(x){ return x.trait === "optimiste"; }) ? ", et votre optimiste" : "") + '.</p>';
  }
  show(h + BTN_FERMER());
}

/* ---------- Clics ---------- */
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-id"), i = +id;
  if(a === "add"){ var c = G.pack[id] || 0; if(c < MAISONS[G.h].objets[id] && capSac() - placesUtilisees() >= OBJETS[id].place){ G.pack[id] = c + 1; sautSac = true; } G.info = icone(id) + " " + OBJETS[id].nom + " : " + OBJETS[id].desc; }
  else if(a === "rem"){ G.pack[id]--; if(!G.pack[id]) delete G.pack[id]; }
  else if(a === "intro"){ G.ph = "famille"; }
  else if(a === "modefam"){ var fam = G.famille; modeJour = id === "classee"; try{ localStorage.setItem("survival_mode", modeJour ? "jour" : "libre"); }catch(e){} nouvellePartie(modeJour ? graineDuJour() : null); G.famille = fam; G.ph = "famille"; }
  else if(a === "famok"){ if(!validerFamille()) return; G.ph = "pick"; if(G.seed) G.info = "🏆 Partie classée : même maison, mêmes lieux et mêmes nuits pour tous les joueurs aujourd’hui. Ton score ira au classement."; }
  else if(a === "info"){ openInfo(id); return; }
  else if(a === "saisie"){ openSaisie(id); return; }
  else if(a === "saisieok"){ validerSaisie(id); return; }
  else if(a === "trait"){ var qt = id.split(":"); changerTrait(+qt[0], +qt[1]); }
  else if(a === "house"){ if(G.seed) return; if(i !== G.h){ G.h = i; G.pack = {}; G.info = "Tu as changé de maison : le sac est vidé."; } }
  else if(a === "start") demarrer();
  else if(a === "sel" && modeMini()){ openMembre(i); return; }
  else if(a === "msel"){ var xm = G.m[i]; if(peutSortir(xm)){ var pm = G.sel.indexOf(i); if(pm >= 0) G.sel.splice(pm, 1); else if(G.sel.length < BAL.membresParExpedition) G.sel.push(i); } render(); openMembre(i); return; }
  else if(a === "sel"){ var x = G.m[i]; if(peutSortir(x)){ var p = G.sel.indexOf(i); if(p >= 0) G.sel.splice(p, 1); else if(G.sel.length < BAL.membresParExpedition) G.sel.push(i); } }
  else if(a === "soins"){ openSoins(i); return; }
  else if(a === "heal"){ soigner(i); hide(); }
  else if(a === "boire"){ boire(i); hide(); }
  else if(a === "ration"){ var qr = id.split(":"); prendreRation(+qr[0], qr[1]); openSoins(+qr[0]); render(); return; }
  else if(a === "slot"){ retourEquip = b.getAttribute("data-retour"); var q = id.split(":"); openSlot(+q[0], q[1]); return; }
  else if(a === "equip"){ var q = id.split(":"); equiper(+q[0], q[1], +q[2]);
    if(retourEquip === "quipart" && typeof openQuiPart === "function"){ render(); openQuiPart(); return; }
    if(modeMini()){ render(); openMembre(+q[0]); return; } hide(); }
  else if(a === "unequip"){ var q = id.split(":"); desequiper(+q[0], q[1]); openSlot(+q[0], q[1]); render(); return; }
  else if(a === "fouille"){ if(!G.sel.length && typeof openQuiPart === "function"){ openQuiPart(); return; } openLoc(); return; }
  else if(a === "loc"){ apresEtape(expedition(i, enVoiture)); return; }
  else if(a === "crocheter"){ jeuSerrure = true; nouvelleZone(); openSerrure(); return; }
  else if(a === "forcer"){ forcerPorte(); apresEtape(suiteExpedition()); return; }
  else if(a === "goupille"){ appuyerGoupille(); return; }
  else if(a === "suiteporte"){ apresEtape(suiteExpedition()); return; }
  else if(a === "cible"){ cibleCombat = i; openCombat(); return; }
  else if(a === "cact"){ var q = id.split(":"); choixCombat[+q[0]] = q[1]; openCombat(); return; }
  else if(a === "ctour"){
    var ch = {}; equipeCombat().forEach(function(x){ var j = G.m.indexOf(x); ch[j] = { a:choixCombat[j] || "frapper", cible:cibleCombat }; });
    jouerTour(ch); render(); openCombat(); return;
  }
  else if(a === "cfuir"){ fuir(); render(); openCombat(); return; }
  else if(a === "cauto"){
    // Joue tous les tours ; garde le journal complet pour qu'on voie ce qui s'est passé
    var tout = [], g = 0;
    while(!G.combat.fin && g++ < 50) tout = tout.concat(tourAuto());
    G.combat.journal = tout; render(); openCombat(); return;
  }
  else if(a === "cfin"){ apresEtape(avantFouille()); return; }
  else if(a === "son"){ basculerSon(); return; }
  else if(a === "stock"){ openStock(); return; }
  else if(a === "chapitre"){ openChapitre(); return; }
  else if(a === "mission"){ openMission(); return; }
  else if(a === "livrer"){ var lm = livrerMission(); render(); if(lm) show('<h2>🎯 Mission réussie</h2><p>' + lm + '</p>' + BTN_FERMER()); return; }
  else if(a === "chien"){ confirmerChien = false; openChien(); return; }
  else if(a === "mangerchien"){ confirmerChien = true; openChien(); return; }
  else if(a === "mangerchienok"){ confirmerChien = false; var mc = mangerChien(); render(); show('<h2>Un soir de famine</h2><p>' + (mc || "Ce n’est plus possible.") + '</p>' + BTN_FERMER("Continuer")); return; }
  else if(a === "marche"){ openMarche(); return; }
  else if(a === "troc"){ msgMarche = echanger(i) || ""; render(); openMarche(); return; }
  else if(a === "refuge"){ openRef(); return; }
  else if(a === "endday"){ var n = finJour(); render(); openNuit(n);
    if(typeof vibrer === "function" && n.some(function(x){ return x[0] === "b2" && x[1].indexOf("🧟 Attaque de nuit (") === 0; })) vibrer([150, 80, 150]); // attaque perdue
    finiSiMorts(); return; }
  else if(a === "close"){ fermer(); return; }
  else if(a === "astuceok" || a === "astucesoff"){
    fermerAstuce(a === "astucesoff");
    if(G.ph === "pick" || G.ph === "game"){ if($("modal").style.display !== "flex") render(); } // montre l'astuce suivante
    return;
  }
  else if(a === "adstart"){ if(!G.adS){ G.adS = true; openAd("start"); } return; }
  else if(a === "ad"){ if(G.ads < BAL.pubsParJour){ openAd("exp"); AD.retour = id; } return; }
  else if(a === "adok"){
    if(AD.k === "start") show('<h2>Choisis ta récompense</h2><button class="loc" data-act="adr" data-id="cap"><b>🎒 +1 place dans le sac</b></button><button class="loc" data-act="adr" data-id="time"><b>⏱ +20 secondes</b></button>');
    else { G.ads++; vivants().forEach(function(x){ x.en = Math.min(100, x.en + BAL.energiePub); }); hide(); render(); if(AD.retour === "quipart" && typeof openQuiPart === "function") openQuiPart(); }
    return;
  }
  else if(a === "adr"){ if(id === "cap") G.cb++; else G.tl += 20; hide(); render(); return; }
  else if(a === "build"){ ameliorer(id); render(); openRef(); return; }
  else if(a === "onglet"){ pieceChoisie = null; openRef(id); return; }
  else if(a === "piece"){ pieceChoisie = pieceChoisie === id ? null : id; openRef(); return; }
  else if(a === "pslot"){ if(pieceChoisie) poserPiece(pieceChoisie, id); return; }
  else if(a === "plein"){ msgAtelier = fairePlein() || ""; render(); openRef(); return; }
  else if(a === "envoiture"){ enVoiture = !enVoiture; openLoc(); return; }
  else if(a === "craft"){ msgAtelier = fabriquer(i) || ""; render(); openRef(); return; }
  else if(a === "repair"){ msgAtelier = reparer(i) || ""; render(); openRef(); return; }
  else if(a === "salvage"){ msgAtelier = demonter(i) || ""; render(); openRef(); return; }
  else if(a === "morning"){ var ev = evenementDuMatin(); if(ev) openEvent(ev); else fermer(); return; }
  else if(a === "ev"){ var rs = G.ev.choix[i][1](); G.ev = null; G.evIdx = null; render(); show('<h2>Résultat</h2><p>' + rs + '</p>' + BTN_FERMER("Continuer")); finiSiMorts(); return; }
  else if(a === "again"){ var go = $("gameover"); if(go) go.style.display = "none"; nouvelleFamille(); return; }
  else if(a === "continuer"){ reprendre(enCours); enCours = null; return; }
  else if(a === "nouvelle"){ enCours = null; nouvelleFamille(); return; }
  else if(a === "partage"){ copierResultat(b); return; }
  render();
});

try{ RECORD = +localStorage.getItem("survival_record") || 0; }catch(e){}

/* ---------- Sauvegarde automatique ----------
   Après chaque action, la partie est enregistrée dans le navigateur. Si la
   page se ferme (ou si le téléphone la met en veille), on reprend au même
   endroit. Changer VERSION_SAUVEGARDE si la forme des données change : les
   anciennes sauvegardes seront alors ignorées au lieu de planter. */
var VERSION_SAUVEGARDE = 1, CLE_SAUVEGARDE = "survival_partie";
function sauver(){
  if(!G || G.ph !== "game" || !vivants().length) return;
  try{
    // G.ev contient des fonctions : on garde seulement son numéro (G.evIdx)
    localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify({ v:VERSION_SAUVEGARDE, G:G }, function(k, v){ return k === "ev" ? undefined : v; }));
  }catch(e){}
}
function effacerSauvegarde(){ try{ localStorage.removeItem(CLE_SAUVEGARDE); }catch(e){} }
function lireSauvegarde(){
  try{
    var d = JSON.parse(localStorage.getItem(CLE_SAUVEGARDE));
    if(!d || d.v !== VERSION_SAUVEGARDE || !d.G || d.G.ph !== "game") return null;
    return migrerPartie(d.G);
  }catch(e){ return null; }
}
// Reprend une partie : rouvre la fenêtre où l'on était (porte, combat, événement)
function reprendre(g){
  G = g; G.ev = G.evIdx != null ? EVENEMENTS[G.evIdx] : null;
  hide(); render();
  if(G.exp && G.exp.serrure && !G.exp.serrure.fin){ jeuSerrure = false; msgSerrure = ""; openSerrure(); }
  else if(G.exp && G.exp.serrure && !G.combat && G.exp.serrure.fin){ msgSerrure = ""; openSerrure(); }
  else if(G.combat){ choixCombat = {}; cibleCombat = 0; openCombat(); }
  else if(G.exp){ if(G.exp.peche && G.exp.peche.faits < G.exp.peche.lancers) openPeche(); else apresEtape(G.exp.peche ? finExpedition() : avantFouille()); }
  else if(G.ev) openEvent(G.ev);
  else fermer(); // montre les chapitres terminés en attente, sinon rien
}
// Après chaque clic (le gestionnaire principal a déjà fait son travail)
document.addEventListener("click", function(){ setTimeout(sauver, 0); });
document.addEventListener("visibilitychange", function(){ if(document.hidden) sauver(); });
window.addEventListener("pagehide", sauver);

// Mode retenu : Partie du jour par défaut
var modeJour = true;
try{ modeJour = localStorage.getItem("survival_mode") !== "libre"; }catch(e){}
function nouvelleFamille(){
  effacerSauvegarde(); hide();
  modeJour = true; // une nouvelle famille commence toujours en partie classée (on peut choisir « libre » sur l'écran de la famille)
  nouvellePartie(graineDuJour());
  G.ph = "intro"; G.famille = familleRetenue();
  render();
}
var enCours = lireSauvegarde();
if(enCours){
  // Écran d'accueil : continuer ou recommencer
  nouvellePartie(null); G.ph = "accueil";
  document.body.classList.add("fond");
  $("app").innerHTML = '<div class="accueil"><img class="logo grand" src="images/logo.webp" alt=""><h1>SURVIVAL</h1><p class="sub">Le dernier refuge</p></div>';
  show('<h2>Partie en cours</h2><p>' + (enCours.seed ? "🏆 Partie classée du " + dateGraine(enCours.seed) : "🎲 Partie libre") + ' · <b>Jour ' + enCours.day + '</b> · ⭐ ' + enCours.score + ' · '
    + enCours.m.filter(function(x){ return x.al; }).map(function(x){ return iconeMembre(x); }).join(" ") + '</p>'
    + '<button class="btn" style="width:100%;margin-bottom:8px" data-act="continuer">▶️ Continuer</button>'
    + '<button class="btn alt" style="width:100%;margin-bottom:8px" data-act="guide">📖 Guide du survivant</button>'
    + '<button class="btn alt" style="width:100%" data-act="nouvelle">🆕 Nouvelle famille (la partie en cours sera perdue)</button>');
} else nouvelleFamille();

/* =====================================================================
   SONS : petits bruitages joués après chaque action.
   Fichiers dans sons/ (licences dans sons/LICENCES.txt). Le coup de feu
   est fabriqué par le navigateur (pas de fichier). On peut couper le son
   avec le bouton 🔊 en haut de l'écran (réglage gardé dans le navigateur).
   ===================================================================== */
var SONS = {
  clic:["sons/clic.wav", .35], depart:["sons/depart.ogg", .7], pas:[["sons/pas1.ogg","sons/pas2.ogg","sons/pas3.ogg"], .6],
  butin:["sons/butin.ogg", .7], atelier:["sons/atelier.ogg", .7], construire:["sons/construire.ogg", .8],
  coup:["sons/coup.ogg", .7], goupille:["sons/goupille.ogg", .8], casse:["sons/casse.wav", .8], porte:["sons/porte.ogg", .7],
  nuit:["sons/nuit.ogg", .6], soin:["sons/soin.ogg", .7], troc:["sons/troc.ogg", .7], piece:["sons/piece.ogg", .8],
  zombie:[["sons/zombie1.wav","sons/zombie2.wav","sons/zombie3.wav"], .6]
};
// (fonction « hoistée » : utilisable même avant cette ligne, au premier affichage)
function sonEstActif(){ try{ return localStorage.getItem("survival_son") !== "non"; }catch(e){ return true; } }
var sonActif = sonEstActif();
var lectureOgg = !!new Audio().canPlayType('audio/ogg; codecs="vorbis"'); // certains iPhone ne lisent pas l'OGG
function son(nom, delai){
  if(nom === "glas"){ sonGlas(); return; }
  if(!sonActif || !SONS[nom]) return;
  if(delai){ setTimeout(function(){ son(nom); }, delai); return; }
  var f = SONS[nom][0]; if(Array.isArray(f)) f = f[Math.floor(Math.random() * f.length)];
  if(/\.ogg$/.test(f) && !lectureOgg) return;
  try{ var a = new Audio(f); a.volume = SONS[nom][1]; var p = a.play(); if(p && p.catch) p.catch(function(){}); }catch(e){}
}
/* ---------- Musique d'ambiance (« EmptyCity » par yd, CC0) ----------
   Réglage séparé des bruitages. Elle démarre au premier toucher (les navigateurs
   interdisent le son avant) et se met en pause quand le jeu passe en arrière-plan. */
var musique = null;
function musiqueActive(){ try{ return localStorage.getItem("survival_musique") !== "non"; }catch(e){ return true; } }
function lancerMusique(){
  if(!musiqueActive() || !lectureOgg || document.hidden) return;
  if(!musique){ musique = new Audio("sons/musique-emptycity.ogg"); musique.loop = true; musique.volume = 0.22; }
  if(musique.paused){ var p = musique.play(); if(p && p.catch) p.catch(function(){}); }
}
function arreterMusique(){ if(musique && !musique.paused) musique.pause(); }
function basculerMusique(){ var on = !musiqueActive(); try{ localStorage.setItem("survival_musique", on ? "oui" : "non"); }catch(e){} if(on) lancerMusique(); else arreterMusique(); }
document.addEventListener("pointerdown", lancerMusique);
document.addEventListener("visibilitychange", function(){ if(document.hidden) arreterMusique(); else if(musique) lancerMusique(); });

// Glas : une note grave qui s'éteint lentement (quand un membre meurt), synthétisée
function sonGlas(){
  if(!sonActif) return;
  try{
    ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)();
    var c = ctxAudio, t = c.currentTime;
    [110, 220, 331].forEach(function(f, k){
      var o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25 / (k + 1), t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 2.6);
    });
  }catch(e){}
}
// Coup de feu synthétisé : un souffle de bruit qui s'éteint vite + un « boum » grave
var ctxAudio = null;
function sonTir(){
  if(!sonActif) return;
  try{
    ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)();
    var c = ctxAudio, t = c.currentTime, n = Math.floor(c.sampleRate * 0.3), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for(var k = 0; k < n; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / n, 4);
    var src = c.createBufferSource(); src.buffer = buf;
    var filtre = c.createBiquadFilter(); filtre.type = "lowpass"; filtre.frequency.value = 2200;
    var g = c.createGain(); g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    src.connect(filtre); filtre.connect(g); g.connect(c.destination); src.start(t);
    var o = c.createOscillator(), g2 = c.createGain(); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    g2.gain.setValueAtTime(0.8, t); g2.gain.exponentialRampToValueAtTime(0.01, t + 0.18); o.connect(g2); g2.connect(c.destination); o.start(t); o.stop(t + 0.2);
  }catch(e){}
}
// Après chaque clic (le jeu a déjà réagi), on choisit le bruitage
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act");
  setTimeout(function(){
    var J = G && G.combat && G.combat.journal ? G.combat.journal.map(function(l){ return l[1]; }).join(" ") : "";
    var feuille = $("modal").style.display === "flex" ? $("sheet").innerText : "";
    if(a === "start") son("depart");
    else if(a === "loc"){ son("pas"); if(G.combat) son("zombie", 350); else if(G.exp && G.exp.serrure) son("porte", 250); else if(feuille.indexOf("Vous trouvez") >= 0) son("butin", 300); }
    else if(a === "ctour" || a === "cauto" || a === "cfuir"){
      if(J.indexOf("🔫") >= 0) sonTir(); else if(J.indexOf("⚔️") >= 0) son("coup");
      if(/frappe .* \(−/.test(J)){ son("zombie", 220); if(typeof vibrer === "function") vibrer(70); } // un zombie touche un membre
    }
    else if(a === "cfin" || a === "forcer" || a === "suiteporte"){ if(a === "forcer") son("construire"); if(feuille.indexOf("Vous trouvez") >= 0) son("butin", a === "forcer" ? 250 : 0); else if(G.combat) son("zombie", 200); }
    else if(a === "goupille"){ if(/^Clic/.test(msgSerrure)) son(G.exp && G.exp.serrure && G.exp.serrure.fin === "ouvert" ? "porte" : "goupille"); else son("casse"); }
    else if(a === "craft" || a === "repair" || a === "salvage") son("atelier");
    else if(a === "build") son("construire");
    else if(a === "plein") son("piece");
    else if(a === "pslot") return; // le son est joué par poserPiece
    else if(a === "endday") son("nuit");
    else if(a === "heal" || a === "boire" || a === "ration") son("soin");
    else if(a === "troc" || a === "marche") son("troc");
    else son("clic");
  }, 0);
});
function basculerSon(){
  sonActif = !sonActif;
  try{ localStorage.setItem("survival_son", sonActif ? "oui" : "non"); }catch(e){}
  render();
}
