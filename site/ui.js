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

// Case d'équipement : repère rouge quand l'objet porté est presque cassé (un quart de solidité ou moins)
function classeUsure(o){ return o && o.sol && OBJETS[o.id].sol && o.sol / OBJETS[o.id].sol <= 0.25 ? " use" : ""; }
function niveau(v){ return v < 35 ? "lo" : v < 70 ? "mid" : ""; }
function barre(l, v){ v = Math.max(0, Math.min(100, v)); return '<div class="b"><span>' + l + '</span><div class="bar"><i class="' + niveau(v) + '" style="width:' + v + '%"></i></div></div>'; }
// Une ligne de récit façon jeu : l'icône du début dans un médaillon rond (vert = bon, rouge = mauvais), le texte à côté
function ligneJournal(a){
  var t = String(a[1]), ico = "", m;
  if(t.indexOf("<svg") === 0){ var f = t.indexOf("</svg>") + 6; ico = t.slice(0, f); t = t.slice(f); }
  else if(t.indexOf('<span class="portrait') === 0){ var f2 = t.indexOf("</span></span>"); f2 = f2 >= 0 ? f2 + 14 : t.indexOf("</span>") + 7; ico = t.slice(0, f2); t = t.slice(f2); }
  else if((m = t.match(/^(\p{Extended_Pictographic}(\uFE0F|\u200D\p{Extended_Pictographic})*)\s*/u))){ ico = m[1]; t = t.slice(m[0].length); }
  if(!ico) ico = a[0] === "g2" ? "✔" : a[0] === "b2" ? "!" : "•";
  return '<div class="lj ' + (a[0] || "") + '"><span class="lj-ico">' + ico + '</span><span class="lj-txt">' + t.replace(/^\s+/, "") + '</span></div>';
}
function puces(n){
  var morts = n.filter(function(a){ return a[0] === "mort"; }), autres = n.filter(function(a){ return a[0] !== "mort"; });
  if(morts.length) setTimeout(function(){ son("glas"); if(typeof vibrer === "function") vibrer([200, 100, 400]); }, 150);
  return morts.map(function(a){
    return '<div class="deuil"><span class="em">' + iconeMembre({ nom:a[2], al:false, hp:0, en:0, faim:0, soif:0, icone:"💀" }) + '</span><span><b>💀 ' + a[1] + '</b><small>Repose en paix.</small></span></div>';
  }).join("") + (autres.length ? '<div class="fil">' + autres.map(ligneJournal).join("") + '</div>' : '');
}
function show(h){ var l = $("locuteur"); if(l) l.remove(); $("sheet").classList.remove("parle", "large"); $("sheet").innerHTML = h; $("modal").style.display = "flex"; $("sheet").scrollTop = 0; }
/* ---------- Le personnage qui parle (comme dans les MMO) ----------
   Un médaillon avec son portrait, qui dépasse du haut de la fenêtre à gauche, et son nom à côté.
   À appeler juste après show(). portrait : du HTML (portrait de membre) ou le nom d'un fichier images/portrait-<nom>.webp */
var PNJ = { marchand:"Le marchand", roux:"Mme Roux", blesse:"Survivant blessé", pillard:"Chef des pillards", marco:"Marco" };
function parle(nom, portrait){
  var sh = $("sheet"); if(!sh) return;
  var img = portrait.charAt(0) === "<" ? portrait : '<img src="images/portrait-' + portrait + '.webp" alt="" onerror="var l=document.getElementById(\'locuteur\'); if(l) l.remove(); var s=document.getElementById(\'sheet\'); if(s) s.classList.remove(\'parle\');">';
  var l = document.createElement("div"); l.id = "locuteur"; l.setAttribute("aria-hidden", "true");
  l.innerHTML = '<span class="loc-portrait">' + img + '</span><span class="loc-nom">' + nom + '</span>';
  $("modal").appendChild(l); sh.classList.add("parle");
  var place = function(){ var r = sh.getBoundingClientRect(); l.style.left = (r.left + 12) + "px"; l.style.top = Math.max(4, r.top - 46) + "px"; };
  place(); requestAnimationFrame(place);
}
// Qui parle dans un événement du matin (null = personne en particulier)
function locuteurEvenement(ev){
  var m = function(x){ return x ? [x.nom, iconeMembre(x)] : null; };
  switch(ev.titre){
    case "🧔 Un marchand louche": return [PNJ.marchand, "marchand"];
    case "🚪 Un survivant blessé": return [PNJ.blesse, "blesse"];
    case "🏴 Des pillards": return [PNJ.pillard, "pillard"];
    case "👵 La vieille voisine": return [PNJ.roux, "roux"];
    case "🚪 On frappe à la porte": return G.evCible ? [G.evCible, iconeMembre({ nom:G.evCible, icone:G.evIcone, al:true, hp:100, en:100, faim:100, soif:100 })] : null;
    case "🤒 La fièvre": return m(membre(G.evCible));
    case "🧸 Cauchemars": return m(parRole("Emma"));
    case "🍽️ Dispute à table": return m(parRole("Maman"));
    case "🐕 Un chien errant": return ["Le chien", '<img src="images/rex.webp" alt="" class="loc-rex">'];
  }
  return null;
}
function hide(){ $("modal").style.display = "none"; if(typeof lieuResultat !== "undefined" && lieuResultat !== null){ lieuResultat = null; if(typeof placerPiece === "function") placerPiece(); } if(typeof panneauPieceApresFermeture === "function") panneauPieceApresFermeture(); }
var BTN_FERMER = function(t){ return '<button class="btn alt" style="width:100%" data-act="close">' + (t || "Fermer") + '</button>'; };

/* ---------- Écran de départ : le sac ---------- */
// Familles d'objets (couleur du liseré et ordre d'affichage)
var ORDRE_FAMILLES = ["eau", "nour", "soin", "arme", "lumiere", "outil", "moral"];
function famillePick(k){
  var o = OBJETS[k];
  if(o.cat === "eau") return "eau";
  if(o.cat === "nour" || o.cat === "energie" || o.cat === "plat" || o.cat === "ingredient") return "nour";
  if(o.cat === "soin") return "soin";
  if(o.emplacement === "arme" || o.cat === "munition") return "arme";
  if(o.lumiere || k === "pile") return "lumiere";
  if(o.emplacement === "outil" || o.emplacement === "sac") return "outil";
  return "moral";
}
var NOM_COURT = { epices:"Épices", huile:"Huile", farine:"Farine", champignons:"Champignons", baies:"Baies", herbes:"Herbes", soupe:"Soupe", poissonHerbes:"Poisson", ragout:"Ragoût", galettes:"Galettes", rizSaute:"Riz sauté", tarte:"Tarte", eau:"Eau", clous:"Clous", ruban:"Adhésif", chiffon:"Chiffon", ferraille:"Ferraille", alcool:"Alcool", epingle:"Épingles", jerrican:"Jerrican", bouteille:"Eau", conserve:"Conserve", batterie:"Batterie", courroie:"Courroie", bidon:"Eau", conserves:"Conserves", biscuits:"Biscuits", trousse:"Trousse", antibio:"Antibio", couverture:"Couverture",
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
    + '<div class="pk"><p class="sub" style="grid-area:sub">Ils arrivent ! Choisis ce que la famille emporte avant la fin du compte à rebours.</p>'
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
    var on = G.sel.indexOf(i) >= 0, st = !x.al ? "💀 Mort" : on ? "✔ Part fouiller" : fou(x) ? "🌀 Folie " + x.folie : !peutSortir(x) ? "😴 Épuisé" : fatigue(x) ? "🥱 Fatigué" : "Au refuge";
    var aEquiper = x.al && EMPLACEMENTS.some(function(e){ return !x.eq[e[0]] && pourEmplacement(e[0]).length > 0; });
    // Sur téléphone, l'équipement porté s'affiche en petit sous les jauges (la fiche s'ouvre au toucher)
    var porte = x.al ? '<div class="porte">' + EMPLACEMENTS.map(function(e){ var o = x.eq[e[0]]; return '<span class="' + (o ? "f" : "") + classeUsure(o) + '">' + (o ? icone(o.id) : "") + '</span>'; }).join("") + '</div>' : '';
    return '<div class="mc' + (on ? " on" : "") + (x.al ? "" : " dead") + '" data-act="sel" data-id="' + i + '" tabindex="0">' + (on ? '<span class="coche" aria-hidden="true">✔</span>' : '') + (aEquiper ? '<span class="pastille" title="Un objet peut être équipé">+</span>' : '') + '<div><span class="em">' + iconeMembre(x) + '</span><b>' + x.nom + '</b></div><small>' + st + '</small>'
      + barre("❤️", x.hp) + barre("⚡", x.en) + barre(ic("conserve", "🥫"), x.faim) + barre(ic("bouteille", "💧"), x.soif) + porte
      + (x.al ? '<div class="slots">' + EMPLACEMENTS.map(function(e){
          var o = x.eq[e[0]], dispo = !o && pourEmplacement(e[0]).length > 0; // case vide mais un objet attend au stock
          return '<button class="slot' + (o ? " f" : "") + (dispo ? " dispo" : "") + classeUsure(o) + '" data-act="slot" data-id="' + i + ':' + e[0] + '" aria-label="' + e[2] + ' de ' + x.nom + ' : ' + (o ? OBJETS[o.id].nom : dispo ? "vide, un objet est disponible au stock" : "vide") + '"' + (dispo ? ' title="Un objet est disponible au stock"' : '') + '>' + (o ? icone(o.id) : '<span class="vide">' + e[1] + '</span>') + '</button>';
        }).join("") + ((soinsDispo() > 0 && x.hp < 100) || peutBoire(x) || peutPrendreRation(x, "eau") || peutPrendreRation(x, "nour") ? '<button class="slot heal2" data-act="soins" data-id="' + i + '" aria-label="Soigner, faire boire ou manger ' + x.nom + '">＋</button>' : "") + '</div>' : "") + '</div>';
  }).join("");
  $("app").innerHTML = '<div class="row"><img class="hd-logo" src="images/logo.webp" alt="SURVIVAL – Le dernier refuge"><div class="titre"><h1>Jour ' + G.day + '</h1><button class="chapcourt" data-act="chapitre" aria-label="Détail du chapitre">Chapitre ' + (G.chap + 1) + '</button></div><div class="chips">'
    + '<button class="chip" data-act="info" data-id="eau" aria-label="Rations d’eau : ' + rations("eau") + '">' + ic("bouteille", "💧") + ' ' + rations("eau") + '<small class="chip-lbl">eau</small></button>'
    + '<button class="chip" data-act="info" data-id="nour" aria-label="Rations de nourriture : ' + rations("nour") + '">' + ic("conserve", "🥫") + ' ' + rations("nour") + '<small class="chip-lbl">repas</small></button>'
    + '<button class="chip" data-act="info" data-id="soin" aria-label="Objets de soin : ' + soinsDispo() + '">' + ic("bandage", "🩹") + ' ' + soinsDispo() + '<small class="chip-lbl">soins</small></button>'
    + '<button class="chip" data-act="info" data-id="def" aria-label="Défense de nuit : ' + defenseNuit() + '">' + ic("bouclier", "🛡️") + ' ' + defenseNuit() + '<small class="chip-lbl">défense</small></button>'
    + '<button class="chip" data-act="info" data-id="moral" aria-label="Moral : ' + Math.round(G.moral) + '">' + mo + ' ' + Math.round(G.moral) + '<small class="chip-lbl">moral</small></button>'
    + '<button class="chip chipson" data-act="menu" aria-label="Menu et guide">☰<small class="chip-lbl">menu</small></button>'
    + (chien() ? '<button class="chip chipchien" data-act="chien" title="' + chien().nom + ', le chien">' + ic("chien", "🐕") + (chien().faim ? ' ⚠️' : '') + '</button>' : '')
    + '</div><div class="hd-score" title="Score : chaque jour terminé rapporte 1 point par membre en vie"><span class="hs-ico">⭐</span><b>' + (G.score || 0) + '</b><small>score<br>record ' + Math.max(RECORD, G.score || 0) + '</small></div></div>'
    + '<div class="stage scene"><div class="grid2">' + m + '</div><p class="sub aide">Touche 1 ou 2 membres pour fouiller · cases 🗡️ 🔦 🎒 pour équiper · ⚡ = énergie.</p>'
    + '<div class="row">' + (mission() ? '<button class="btn alt' + (livraisonPossible() >= 0 ? " pret" : "") + '" style="flex:0 0 auto" data-act="mission">🎯 ' + mission().titre + ' · ' + joursMission() + ' j</button>' : '') + (marcheOuvert() ? '<button class="btn alt" style="flex:0 0 auto" data-act="marche">' + ic("marco", MARCHE.icone) + ' Marché</button>' : '') + '</div></div>'
    + '<div class="row acts"><button class="btn' + (G.sel.length ? "" : " attente") + '" data-act="fouille">' + ic("loupe", "🔍") + ' Fouiller</button><button class="btn alt" data-act="stock">' + ic("caisse", "📦") + ' Stock</button><button class="btn alt" data-act="refuge">' + ic("marteau", "🛠️") + ' Refuge</button><button class="btn' + (G.m.some(peutSortir) ? " alt" : "") + '" data-act="dormir">' + ic("lune", "🌙") + ' Dormir</button></div>';
  tableauPC();
}

/* ---------- Choix du lieu ---------- */
function openLoc(){
  astuce("lieux");
  if(LIEUX.some(function(L, i){ return L.peche && lieuOuvert(i); })) astuce("peche");
  if(LIEUX.some(function(L, i){ return L.bois && lieuOuvert(i); })) astuce("foret");
  var h = '<h2>Où envoyer l’équipe ?</h2>';
  var team = G.sel.map(function(j){ return G.m[j]; });
  // Aide aux débutants : prévenir qu'un membre très blessé risque sa vie en cas de combat
  var bles = team.filter(function(x){ return x.hp < 35; });
  if(bles.length) h += '<p class="msg">⚠️ ' + liste(bles.map(function(x){ return x.nom + " (" + x.hp + " ❤️)"; })) + (bles.length > 1 ? " sont gravement blessés" : " est gravement blessé" + (estFeminin(bles[0]) ? "e" : "")) + " : un combat pourrait " + (bles.length > 1 ? "leur" : "lui") + " coûter la vie. Mieux vaut " + (bles.length > 1 ? "les" : estFeminin(bles[0]) ? "la" : "le") + " soigner avant (bouton ＋).</p>";
  var porte = function(test){ return team.some(function(x){ return x.eq.outil && test(OBJETS[x.eq.outil.id]); }); };
  var lumiere = porte(function(o){ return o.lumiere === 2; }) ? (compter("pile") > 0 ? "🔦 lampe prête" : "⚠️ lampe sans pile") : porte(function(o){ return o.lumiere === 1; }) ? "🔥 lueur faible" : "⚠️ pas de lumière";
  var ouvre = porte(function(o){ return o.ouvre; }) ? "🔓 de quoi ouvrir" : "⚠️ porte à forcer";
  h += '<p class="sub">Équipe : ' + team.map(function(x){ return iconeMembre(x) + " " + x.nom + " ⚡" + x.en; }).join(", ") + ' · ⚔️ force ' + forceEquipe(team) + ' · 🎒 ' + placesEquipe(team) + ' places pour le butin</p>';
  var radio = possede(function(o){ return o.radio; });
  if(voitureReparee()) h += '<button class="loc toggle' + (enVoiture ? " on" : "") + '" data-act="envoiture"><b>🚗 ' + (enVoiture ? "En voiture" : "À pied") + '</b> <span class="pill">⛽ ' + G.voiture.essence + ' L</span><small>' + (enVoiture ? "Le trajet ne fatigue pas, +" + VOITURE.coffre + " places dans le coffre, mais ça consomme de l’essence et le moteur fait du bruit. Touche pour y aller à pied." : "Touche pour prendre la voiture.") + '</small></button>';
  // Une carte illustrée par lieu, 2 par ligne : image, ce qu'il reste, danger, énergie, et les conditions en petites icônes
  var cartes = [];
  LIEUX.forEach(function(L, i){
    if(!lieuOuvert(i)) return;
    var auto = enVoiture || L.voiture;
    var reste = resteLieu(i), d = dangerLieu(i), peut = equipePeutAller(team, i, auto), ok = reste && peut;
    var icones = [];
    if(L.sombre) icones.push(porte(function(o){ return o.lumiere === 2; }) ? (compter("pile") > 0 ? ["🔦", "ok", "Sombre : lampe prête"] : ["🔦", "ko", "Sombre : lampe sans pile"]) : porte(function(o){ return o.lumiere === 1; }) ? ["🔥", "moy", "Sombre : lueur faible"] : ["🌑", "ko", "Sombre : pas de lumière"]);
    if(L.verrou) icones.push(porte(function(o){ return o.ouvre; }) ? ["🔓", "ok", "Verrouillé : de quoi ouvrir"] : ["🔒", "ko", "Verrouillé : porte à forcer"]);
    if(L.peche) icones.push(porte(function(o){ return o.peche; }) ? ["🎣", "ok", "Canne à pêche prête"] : ["🎣", "ko", "Pas de canne à pêche"]);
    if(L.bois) icones.push(bucherons(team).length ? ["🪓", "ok", "Hache prête"] : ["🪓", "ko", "Pas de hache"]);
    if(auto) icones.push(["🚗", voitureOk(i) ? "ok" : "ko", "En voiture : ⛽ −" + litres(i) + " L"]);
    var dg = radio ? (d < 0.3 ? ["faible", "ok"] : d < 0.5 ? ["moyen", "moy"] : ["élevé", "ko"]) : ["?", ""];
    var pourquoi = !reste ? "Vidé" : auto && !voitureReparee() ? "Voiture en panne" : auto && !voitureOk(i) ? "Pas assez d’essence" : !peut ? "Trop fatigués" : "";
    var im = imageLieu(L);
    cartes.push({ ok:!!ok, vide:!reste, html:'<button class="carte-lieu' + (ok ? "" : " off") + (G.mission && G.mission.lieu === i ? " mission" : "") + '" data-act="loc" data-id="' + i + '"' + (ok ? "" : " disabled") + ' aria-label="' + L.nom + (pourquoi ? " : " + pourquoi : "") + '">'
      + '<span class="cl-img">' + (im ? '<img src="' + im + '" alt="">' : '<span class="cl-ico">' + iconeLieu(L) + '</span>')
      + '<span class="cl-reste">' + (L.peche ? "🐟 " + G.lieux[i].poissons : L.bois ? "🌲 " + G.lieux[i].arbres : reste ? reste + " obj." : "Vidé") + '</span>'
      + (G.mission && G.mission.lieu === i ? '<span class="cl-mission">🎯</span>' : '')
      + (pourquoi && reste ? '<span class="cl-pourquoi">' + pourquoi + '</span>' : '') + '</span>'
      + '<span class="cl-nom">' + L.nom + '</span>'
      + '<span class="cl-infos"><span>⚡−' + coutEnergie(i, auto) + '</span><span class="dg ' + dg[1] + '" title="Danger">' + (radio ? "📻 " : "⚠️ ") + dg[0] + '</span></span>'
      + (icones.length ? '<span class="cl-conds">' + icones.map(function(c){ return '<span class="' + c[1] + '" title="' + c[2] + '">' + c[0] + '</span>'; }).join("") + '</span>' : '')
      + '</button>' });
  });
  // Les lieux possibles d'abord, puis ceux impossibles pour l'instant, puis les lieux vidés
  cartes.sort(function(a, b){ return (a.ok ? 0 : a.vide ? 2 : 1) - (b.ok ? 0 : b.vide ? 2 : 1); });
  h += '<div class="lieux">' + cartes.map(function(c){ return c.html; }).join("") + '</div>';
  if(!radio) h += '<p class="sub">⚠️ Sans radio, le danger des lieux est inconnu.</p>';
  show(h + BTN_FERMER("Annuler"));
}
// Enchaîne les étapes d'une expédition : porte -> combat -> résultat
function apresEtape(r){
  render();
  if(r.serrure){ jeuSerrure = false; msgSerrure = ""; openSerrure(); }
  else if(r.combat){ choixCombat = {}; cibleCombat = 0; openCombat(); }
  else if(r.peche){ openPeche(); }
  else if(G.rencontre){ openRencontre(); }
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
var dernierPV = null; // PV au tour précédent : sert à animer qui vient d'être touché
var combatVu = null; // le combat déjà affiché (pour ne jouer l'arrivée des zombies qu'une fois)
function openCombat(){
  astuce("combat");
  var C = G.combat, L = G.exp.guerre ? { nom:G.exp.nomLieu.replace(/^le /, "").replace(/^./, function(c){ return c.toUpperCase(); }) } : LIEUX[G.exp.lieu], fini = !!C.fin;
  if(dernierPV && dernierPV.c !== C) dernierPV = null; // nouveau combat
  var arrivee = combatVu !== C && C.tour === 1 && !fini; combatVu = C; // première vue du combat : les zombies arrivent du fond
  if(!fini && zombiesDebout().some(function(z){ return !z.int; })) preparerIntentions(); // ancienne sauvegarde
  var debout = zombiesDebout();
  if(!C.zombies[cibleCombat] || C.zombies[cibleCombat].pv <= 0) cibleCombat = debout.length ? C.zombies.indexOf(debout[0]) : 0;
  var touche = false;
  // La scène : le décor du lieu, les zombies debout dessus, la bulle de ce que chacun va faire
  var zs = C.zombies.map(function(z, k){
    var T = typeZombie(z), avant = dernierPV && dernierPV.z[k] !== undefined ? dernierPV.z[k] : z.pv, perte = avant - z.pv;
    var bulle = "";
    if(z.pv && !fini && z.int){
      var cib = G.m[z.int.c];
      bulle = z.int.t === "hurle" ? '<span class="zint hurle">📢 Va hurler</span>'
        : '<span class="zint">' + (T.premier ? "⚡" : "🦷") + (T.coups ? "×" + T.coups : "") + " " + (cib ? cib.nom : "?") + '<small>' + z.degats[0] + "-" + z.degats[1] + '</small></span>';
    }
    var sp = spriteZombie(z);
    return '<button class="zc' + (sp ? " sprite z-" + z.id : "") + (z.pv ? "" : " mort") + (k === cibleCombat && z.pv && !fini ? " vise" : "") + (perte > 0 ? " coup" : "") + '" data-act="cible" data-id="' + k + '"' + (z.pv && !fini ? "" : " disabled") + ' aria-label="' + z.nom + ', ' + z.pv + ' PV">'
      + bulle + (sp ? '<span class="zs"><img src="' + sp + '" alt=""></span>' : '<span class="zp">' + iconeZombie(z) + '</span>')
      + '<span class="zn">' + z.nom + (T.armure ? " 🦺" : "") + '</span>'
      + '<span class="zpv"><i style="width:' + Math.round(z.pv / z.pvMax * 100) + '%"></i></span>'
      + (perte > 0 ? '<span class="flot">−' + perte + '</span>' : '') + '</button>';
  }).join("");
  var vz = C.zombies[cibleCombat], tv = vz && typeZombie(vz);
  var h = '<h2 class="ctitre">🧟 ' + L.nom + ' <small>· Tour ' + Math.min(C.tour, 99) + '</small></h2><div class="combat' + (fini ? " fini" : "") + '"><div class="cgauche">'
    + '<div class="arene" style="background-image:url(\'' + (G.exp && G.exp.guerre ? "images/piece-bastion-cour.webp" : fondCombat(L)) + '\')"><div class="zrang n' + C.zombies.length + (arrivee ? " arrivee" : "") + '">' + zs + '</div>'
    + (fini ? '<div class="tampon ' + C.fin + '">' + ({ victoire:"Victoire !", fuite:"En fuite !", defaite:"Défaite…" })[C.fin] + '</div>' : '') + '</div>'
    + (!fini && vz && vz.pv ? '<p class="zinfo">🎯 <b>' + vz.nom + '</b> ' + vz.pv + '/' + vz.pvMax + ' PV · ' + tv.desc + '</p>' : '')
    + (C.journal.length ? '<div class="journal" id="journal">' + puces(C.journal) + '</div>' : '') + '</div><div class="cdroite">';
  if(!fini){
    var soinOk = soinsDispo() > 0 && equipeCombat().some(function(y){ return y.hp < 100; }), feuOk = peutCocktail();
    h += equipeCombat().map(function(x){
      var j = G.m.indexOf(x), c = choixCombat[j] || "frapper", a = x.eq.arme, d = a ? OBJETS[a.id].degats : BAL.combat.poings;
      var avant = dernierPV ? dernierPV.m[j] : x.hp, perte = avant - x.hp; if(perte > 0) touche = true;
      var tete = Math.round((BAL.combat.tete + (x.trait === "tireur" && a && OBJETS[a.id].munition ? BAL.combat.teteTireur : 0)) * 100);
      var acts = [["frapper", "⚔️", "Frapper"], ["tete", "🎯", "Tête " + tete + "%"], ["pousser", "✋", "Pousser " + Math.round(((vz && typeZombie(vz).lourd) ? BAL.combat.pousserLourd : BAL.combat.pousser) * 100) + "%"], ["proteger", "🛡️", "Protéger"]];
      if(soinOk) acts.push(["soigner", "🩹", "Soigner"]);
      if(feuOk) acts.push(["cocktail", "🔥", "Cocktail"]);
      if(acts.every(function(t){ return t[0] !== c; })) c = choixCombat[j] = "frapper";
      return '<div class="cmc' + (perte > 0 ? " blesse" : "") + '"><div class="cmh"><span class="cmp">' + iconeMembre(x) + '</span><span class="cmi"><b>' + x.nom + '</b>' + barre("❤️", x.hp)
        + '<small>' + (a ? icone(a.id) + " " + OBJETS[a.id].nom + " " + a.sol + "/" + OBJETS[a.id].sol + (OBJETS[a.id].munition ? " · " + icone(OBJETS[a.id].munition) + " " + compter(OBJETS[a.id].munition) : "") : "✊ Mains nues") + ' · ' + d[0] + '-' + d[1] + (fatigue(x) ? " · 🥱" : "") + '</small></span>'
        + (perte > 0 ? '<span class="flot">−' + perte + '</span>' : '') + '</div>'
        + '<div class="acts">' + acts.map(function(t){ return '<button class="act' + (c === t[0] ? " on" : "") + '" data-act="cact" data-id="' + j + ':' + t[0] + '"><span>' + t[1] + '</span><small>' + t[2] + '</small></button>'; }).join("") + '</div></div>';
    }).join("");
  }
  if(fini){
    // Bilan : tours, zombies abattus, vie perdue, puis l'état de chacun (vie, arme)
    var perdu = 0; for(var jj in (C.pv0 || {})) perdu += Math.max(0, C.pv0[jj] - (G.m[jj].al ? G.m[jj].hp : 0));
    var ab = C.abattus !== undefined ? C.abattus : C.zombies.filter(function(z){ return !z.pv; }).length, nt = Math.max(1, C.tour - 1);
    h += tuiles([["tour" + (nt > 1 ? "s" : ""), nt, ""], ["abattu" + (ab > 1 ? "s" : ""), "🧟 " + ab, ab ? "ok" : ""], ["vie perdue", perdu ? "−" + perdu : "0", perdu >= 30 ? "ko" : perdu ? "moy" : "ok"]]);
    h += G.exp.equipe.map(function(j){
      var x = G.m[j], a = x.eq.arme;
      return '<div class="bilan-m' + (x.al ? "" : " mort") + '"><span class="cmp">' + iconeMembre(x) + '</span><span class="cmi"><b>' + x.nom + (x.al ? "" : " · " + accorder(roleDe(x), "mort")) + '</b>' + (x.al ? barre("❤️", x.hp) : "")
        + '<small>' + (a ? icone(a.id) + " " + OBJETS[a.id].nom + " " + a.sol + "/" + OBJETS[a.id].sol : x.al ? "✊ Plus d’arme" : "") + '</small></span></div>';
    }).join("");
  }
  h += fini ? '<button class="btn" style="width:100%" data-act="cfin">' + (G.exp.guerre ? (C.fin === "victoire" ? "⭐ Voir le butin" : "Continuer") : C.fin === "victoire" ? "🔍 Fouiller les lieux" : C.fin === "fuite" ? "🏃 Continuer la fouille" : "Continuer") + '</button>'
    : '<div class="row"><button class="btn" data-act="ctour">▶️ Jouer</button><button class="btn alt" style="flex:0 0 auto" data-act="cauto">🤖 Auto</button><button class="btn alt" style="flex:0 0 auto" data-act="cfuir">🏃 ' + Math.round(BAL.combat.fuite * 100) + '%</button></div>';
  show(h + '</div></div>'); $("sheet").classList.add("large"); // le combat prend toute la largeur
  if(fini) equipeCombat().forEach(function(x){ var j = G.m.indexOf(x); if(dernierPV && dernierPV.m[j] > x.hp) touche = true; });
  // L'écran tremble quand quelqu'un de la famille est touché
  if(touche && !matchMedia("(prefers-reduced-motion: reduce)").matches){ var sh = $("sheet"); sh.classList.remove("secoue"); void sh.offsetWidth; sh.classList.add("secoue"); setTimeout(function(){ sh.classList.remove("secoue"); }, 450); }
  dernierPV = { c:C, z:C.zombies.map(function(z){ return z.pv; }), m:G.m.map(function(x){ return x.hp; }) };
  var jn = $("journal"); if(jn) jn.scrollTop = jn.scrollHeight;
}

/* ---------- Rencontre en chemin : dialogue à choix ---------- */
function openRencontre(){
  var R0 = rencontreCourante(); if(!R0){ G.rencontre = null; hide(); return; }
  var Rc = G.rencontre, N = Rc.noeud ? R0.noeuds[Rc.noeud] : null;
  var h = '<div class="rencontre"><p class="r-lieu">En chemin…</p><h2>' + R0.titre + '</h2>';
  if(Rc.texte) h += '<p class="r-res' + (Rc.reussi === true ? " ok" : Rc.reussi === false ? " ko" : "") + '">' + (Rc.reussi === true ? "🎲 Réussi ! " : Rc.reussi === false ? "🎲 Raté… " : "") + perso(Rc.texte) + '</p>' + (Rc.lignes.length ? puces(Rc.lignes) : '');
  if(N){
    h += '<p class="r-texte">' + perso(N.texte) + '</p>';
    h += choixRencontre().map(function(o){
      var c = o.c, info = c.chance !== undefined ? "🎲 " + Math.round(chanceChoix(c) * 100) + " % de chances" + (c.trait ? " (" + TRAITS[c.trait].icone + " " + TRAITS[c.trait].nom + " : +" + Math.round(BAL.rencontres.bonusTrait * 100) + " %)" : "") : "";
      return '<button class="loc r-choix" data-act="rchoix" data-id="' + o.k + '"' + (o.ok ? "" : " disabled") + '><b>' + c.t + '</b>' + (info || !o.ok ? '<small>' + (o.ok ? info : "❌ " + c.sans) + '</small>' : '') + '</button>';
    }).join("");
  } else h += '<button class="btn" style="width:100%" data-act="rfin">Continuer</button>';
  show(h + '</div>');
  if(R0.portrait !== "" && Rc.noeud) parle(R0.nom, R0.portrait);
}
function openResultat(r){
  if(typeof lieuResultat !== "undefined"){ lieuResultat = r.lieu; if(typeof placerPiece === "function") placerPiece(); }
  var i = r.lieu, L = LIEUX[i], im = imageLieu(L), h = (im ? '<div class="banniere"><img src="' + im + '" alt=""></div>' : '') + '<h2>' + iconeLieu(L) + ' ' + L.nom + '</h2>' + puces(r.notes);
  if(r.pris.length){
    h += '<p class="titre-butin">🎒 Butin rapporté</p>' + etageres(r.pris.map(function(g){ return caseObjet(g.id, { act:"aucun", cle:g.id, n:g.n, fixe:true }); }), 5)
      + '<p class="sub butin-noms">' + nommerListe(r.pris).replace(/^./, function(c){ return c.toUpperCase(); }) + '.</p>';
  } else h += '<p><b>Vous rentrez les mains vides.</b></p>';
  if(r.laisses.length) h += '<div class="laisses"><span class="sub">Laissé sur place (plus de place) :</span>' + r.laisses.map(function(g){ return '<span class="mini-case">' + icone(g.id) + (g.n > 1 ? '<b>' + g.n + '</b>' : '') + '</span>'; }).join("") + '</div><p class="sub">Un sac permet de rapporter plus.</p>';
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
  if(x.folie) h += '<div class="jauge folie">' + barre("🌀", x.folie) + '<small>Folie ' + x.folie + '/100 · ' + (fou(x) ? "fouille moins bien, peut faire des choses terribles la nuit ; à 100, il part pour toujours" : "encore maître de lui") + '</small></div>';
  h += '<p class="sub">Équipement (touche une case) :</p><div class="slots grands">' + EMPLACEMENTS.map(function(e){
    var o = x.eq[e[0]], dispo = !o && pourEmplacement(e[0]).length > 0;
    return '<button class="slot' + (o ? " f" : "") + (dispo ? " dispo" : "") + classeUsure(o) + '" data-act="slot" data-id="' + i + ':' + e[0] + '">' + (o ? icone(o.id) : '<span class="vide">' + e[1] + '</span>') + '<small>' + (o ? OBJETS[o.id].nom : e[2]) + '</small></button>';
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
  var gp = {}; platsDispo().forEach(function(o){ gp[o.id] = (gp[o.id] || 0) + 1; });
  Object.keys(gp).forEach(function(pid){
    var P = OBJETS[pid].plat, ok = x.al && x.faim <= 100 - P.faim / 2;
    h += '<button class="loc craft" data-act="plat" data-id="' + i + ':' + pid + '"' + (ok ? "" : " disabled") + '><span class="em">' + icone(pid) + '</span><span class="eqt"><b>Manger : ' + OBJETS[pid].nom + '</b><small>'
      + (ok ? OBJETS[pid].desc.replace(/ \(se gard.*\)$/, "") + " · il en reste " + gp[pid] : "Pas faim (faim " + x.faim + " / 100) : la nuit, chacun mange un plat s’il y en a") + '</small></span></button>';
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
  parle("Marco", "marco");
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
/* ---------- Cases et étagères (stock, refuge) ----------
   caseObjet : une case dessinée (icône, quantité, usure, liseré de famille) ;
   etageres : range les cases par 5 sur des planches en bois, avec des cases vides jusqu'à « mini ». */
function caseObjet(id, opt){
  opt = opt || {};
  return '<button class="islot f-' + (id ? famillePick(id) : "outil") + (opt.sel ? " sel" : "") + (opt.terne ? " terne" : "") + (opt.fixe ? " fixe" : "") + '" data-act="' + opt.act + '" data-id="' + opt.cle + '" aria-label="' + (opt.nom || OBJETS[id].nom) + (opt.n > 1 ? " ×" + opt.n : "") + '">' + (opt.icone || icone(id))
    + (opt.n > 1 ? '<span class="nb">' + opt.n + '</span>' : '')
    + (opt.badge ? '<span class="nb">' + opt.badge + '</span>' : '')
    + (opt.pret ? '<span class="pret" aria-hidden="true">✔</span>' : '')
    + (opt.usure != null ? '<span class="usure"><i class="' + niveau(opt.usure) + '" style="width:' + opt.usure + '%"></i></span>' : '') + '</button>';
}
function etageres(cases, mini){
  var n = Math.max(mini || 0, Math.ceil(cases.length / 5) * 5), h = '<div class="etageres">';
  for(var k = 0; k < n; k += 5){
    h += '<div class="rangee">';
    for(var j = k; j < k + 5; j++) h += cases[j] || '<span class="islot vide"></span>';
    h += '</div>';
  }
  return h + '</div>';
}

/* Stock en cases, façon jeu mobile : onglets par famille, une case par objet (quantité, usure),
   et la fiche de l'objet touché en dessous (avec « Équiper sur… » pour les armes, outils et sacs). */
var FAMILLES_STOCK = [
  ["tout", "📦", "Tout", null],
  ["vivres", "🥫", "Vivres", ["eau", "nour", "energie", "plat", "ingredient"]],
  ["soins", "🩹", "Soins", ["soin"]],
  ["combat", "🗡️", "Combat", ["arme", "munition", "defense", "guerre"]],
  ["outils", "🔦", "Outils", ["outil", "sac", "voiture", "installation"]],
  ["materiaux", "🪵", "Matériaux", ["materiau"]],
  ["divers", "🧸", "Divers", ["confort", "animal"]]
];
var filtreStock = "tout", selStock = null, msgStock = "";
function casesStock(){
  var t = [];
  for(var k in G.stock.n) if(G.stock.n[k] > 0) t.push({ cle:"n:" + k, id:k, n:G.stock.n[k] });
  G.stock.o.forEach(function(o){ t.push({ cle:"o:" + o.uid, id:o.id, n:1, inst:o }); });
  var ordre = CATEGORIES.map(function(c){ return c[0]; });
  return t.sort(function(a, b){ return ordre.indexOf(OBJETS[a.id].cat) - ordre.indexOf(OBJETS[b.id].cat) || (OBJETS[a.id].nom < OBJETS[b.id].nom ? -1 : 1); });
}
function openStock(){
  var tout = casesStock(), F = FAMILLES_STOCK.filter(function(f){ return f[0] === filtreStock; })[0] || FAMILLES_STOCK[0];
  var vis = tout.filter(function(c){ return !F[3] || F[3].indexOf(OBJETS[c.id].cat) >= 0; });
  if(selStock && !tout.some(function(c){ return c.cle === selStock; })) selStock = null;
  var h = '<h2>' + ic("caisse", "📦") + ' Le stock du refuge</h2>'
    + '<p class="sub">' + ic("bouteille", "💧") + ' ' + rations("eau") + ' · ' + ic("conserve", "🥫") + ' ' + rations("nour") + ' rations · ' + tout.length + ' case' + (tout.length > 1 ? "s" : "") + '</p>';
  if(msgStock){ h += '<p class="g2 msg">' + msgStock + '</p>'; msgStock = ""; }
  h += '<div class="invtabs">' + FAMILLES_STOCK.map(function(f){
    var nb = f[3] ? tout.filter(function(c){ return f[3].indexOf(OBJETS[c.id].cat) >= 0; }).length : tout.length;
    return '<button class="invtab' + (f[0] === filtreStock ? " on" : "") + '" data-act="invf" data-id="' + f[0] + '"' + (nb || f[0] === "tout" ? "" : " disabled") + '>' + f[1] + '<small>' + f[2] + '</small></button>';
  }).join("") + '</div>';
  // La grille : les objets, puis des cases vides pour garder un vrai « sac de jeu »
  h += etageres(vis.map(function(c){
    var o = OBJETS[c.id], us = c.inst && c.inst.sol ? Math.round(c.inst.sol / o.sol * 100) : null;
    return caseObjet(c.id, { act:"invsel", cle:c.cle, sel:c.cle === selStock, n:c.n, usure:us });
  }), 15);
  // Fiche de l'objet touché
  var sel = tout.filter(function(c){ return c.cle === selStock; })[0];
  if(sel){
    var o = OBJETS[sel.id], d = sel.inst;
    h += '<div class="invfiche"><span class="em">' + icone(sel.id) + '</span><span class="eqt"><b>' + o.nom + (sel.n > 1 ? " ×" + sel.n : "") + '</b><small>' + o.desc + '</small>'
      + (d && d.sol ? barre("🔧", Math.round(d.sol / o.sol * 100)) + '<small>' + (o.nuit ? d.sol + " nuits restantes" : o.lumiere ? d.sol + " fouilles restantes" : "Solidité " + d.sol + " / " + o.sol) + '</small>' : '') + '</span></div>';
    if(o.emplacement && d){
      h += '<p class="sub">Équiper sur :</p><div class="invequip">' + G.m.map(function(x, i){
        if(!x.al) return "";
        var porte = x.eq[o.emplacement];
        return '<button class="loc" data-act="invequip" data-id="' + i + ':' + o.emplacement + ':' + d.uid + '"><span class="em">' + iconeMembre(x) + '</span><b>' + x.nom + '</b><small>' + (porte ? "remplace : " + OBJETS[porte.id].nom : "case vide") + '</small></button>';
      }).join("") + '</div>';
    }
  } else if(!tout.length) h += '<p>Le stock est vide.</p>';
  else h += '<p class="sub">Touche une case pour voir l’objet.</p>';
  show(h + BTN_FERMER());
  if(sel){ var fi = document.querySelector(".invfiche"); if(fi) fi.scrollIntoView({ block:"nearest" }); }
}

/* ---------- Refuge : construire et atelier (onglets) ---------- */
var ONGLETS = [ ["construire","🔨","Construire"], ["fabriquer","🛠️","Fabriquer"], ["cuisine","🍲","Cuisine"], ["reparer","🔧","Réparer"], ["demonter","♻️","Démonter"], ["voiture","🚗","Voiture"] ];
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
  // Petites cases en bois : l'objet, et « tu en as / il en faut » en vert ou en rouge
  var t = [];
  for(var k in ing){
    var a = compter(k), ok = a >= ing[k];
    t.push('<span class="ing2 ' + (ok ? "ok" : "ko") + '" title="' + OBJETS[k].nom + '"><span class="ing2-case">' + icone(k) + '</span><b>' + a + '/' + ing[k] + '</b><small>' + (NOM_COURT[k] || OBJETS[k].nom) + '</small></span>');
  }
  if(besoin){
    var p = possede(function(o){ return o === OBJETS[besoin]; });
    t.push('<span class="ing2 outil ' + (p ? "ok" : "ko") + '" title="' + OBJETS[besoin].nom + ' (pas consommé)"><span class="ing2-case">' + icone(besoin) + '</span><b>' + (p ? "✔" : "✖") + '</b><small>' + (NOM_COURT[besoin] || OBJETS[besoin].nom) + ' (outil)</small></span>');
  }
  return '<div class="ings2">' + t.join("") + '</div>';
}
// Bouton d'un travail d'atelier : le verbe, et dessous qui s'y colle (mini-portrait, −10 ⚡) ;
// grisé avec la raison s'il manque quelque chose ou si tout le monde est trop fatigué
// Cuisine : ingrédients (l'eau compte en rations) + la planche pour la cuisinière
function ingredientsCuisine(ing){
  var t = [], tout = {}; for(var k in ing) tout[k] = ing[k]; tout.planche = BAL.cuisine.planches;
  for(var k2 in tout){
    var eau = k2 === "eau", a = eau ? rations("eau") : compter(k2), ok = a >= tout[k2], ico = eau ? icone("bouteille") : icone(k2);
    t.push('<span class="ing2 ' + (ok ? "ok" : "ko") + '" title="' + (eau ? "Rations d’eau" : OBJETS[k2].nom) + '"><span class="ing2-case">' + ico + '</span><b>' + a + '/' + tout[k2] + '</b><small>' + (eau ? "Eau" : NOM_COURT[k2] || OBJETS[k2].nom) + '</small></span>');
  }
  return '<div class="ings2">' + t.join("") + '</div>';
}
function boutonCuisine(r){
  var e = empechementCuisine(r), x = artisan();
  return '<button class="btn travail" data-act="cuire" data-id="' + r + '"' + (e ? " disabled" : "") + '>'
    + (e ? '<span>❌ ' + e + '</span>' : '<span>🍲 Cuisiner</span><small class="qui"><span class="mini">' + iconeMembre(x) + '</span>' + x.nom + ' · −' + BAL.energieCraft + ' ⚡</small>') + '</button>';
}
function boutonTravail(texte, act, id, ing, besoin){
  var manque = []; for(var k in ing || {}) if(compter(k) < ing[k]) manque.push({ id:k, n:ing[k] - compter(k) });
  var x = artisan(), raison = besoin && !possede(function(o){ return o === OBJETS[besoin]; }) ? "Il faut " + nommer(besoin, 1)
    : manque.length ? "Il manque " + nommerListe(manque) : !x ? "Tout le monde est trop fatigué" : "";
  return '<button class="btn travail" data-act="' + act + '" data-id="' + id + '"' + (raison ? " disabled" : "") + '>'
    + (raison ? '<span>❌ ' + raison + '</span>' : '<span>' + texte + '</span><small class="qui"><span class="mini">' + iconeMembre(x) + '</span>' + x.nom + ' · −' + BAL.energieCraft + ' ⚡</small>') + '</button>';
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
var selRef = null, bilanOuvert = false;
// Une ligne courte au lieu du grand bilan (le bilan complet s'ouvre à la demande)
function resumeRefuge(){
  var pe = G.ref.eau * REFUGE.eau.parJour, pn = G.ref.pot * REFUGE.pot.parJour;
  return '<p class="resume"><span>' + ic("bouclier", "🛡️") + ' ' + defenseNuit() + '</span><span>' + ic("bouteille", "💧") + ' +' + pe + '/nuit</span><span>' + ic("conserve", "🥫") + ' +' + pn + '/nuit</span><span>' + ic("planche", "🪵") + ' ' + compter("planche") + '</span>'
    + '<button class="lien" data-act="bilanref">' + (bilanOuvert ? "Masquer le bilan" : "Bilan détaillé") + '</button></p>' + (bilanOuvert ? bilanRefuge() : "");
}
function openRef(onglet){
  astuce("atelier");
  if(onglet && onglet !== ongletRef){ ongletRef = onglet; selRef = null; }
  var x = artisan();
  var h = '<h2>🏠 Le refuge</h2><div class="tabs onglets">' + ONGLETS.map(function(o){ return '<button class="tab' + (o[0] === ongletRef ? " on" : "") + '" data-act="onglet" data-id="' + o[0] + '">' + o[1] + '<small>' + o[2] + '</small></button>'; }).join("") + '</div>';
  if(msgAtelier){ h += '<p class="g2 msg">' + msgAtelier + '</p>'; msgAtelier = ""; }
  var fiche = "";
  if(ongletRef === "voiture") h += ongletVoiture();
  else if(ongletRef === "construire"){
    h += resumeRefuge();
    h += etageres(Object.keys(REFUGE).map(function(k){
      var r = REFUGE[k], l = G.ref[k], mx = l >= r.max, peut = !mx && compter("planche") >= coutAmelioration(k);
      if(selRef === "b:" + k){
        var cout = { planche:coutAmelioration(k) };
        fiche = '<div class="invfiche"><span class="em">' + ic("ref_" + k, r.icone) + '</span><span class="eqt"><b>' + r.nom + ' · niveau ' + l + ' / ' + r.max + '</b><small>' + r.desc + '</small></span></div>'
          + (mx ? '<p class="etat ok">⭐ Niveau maximum atteint</p>' : ingredients(cout) + '<button class="btn" style="width:100%;margin-bottom:8px" data-act="build" data-id="' + k + '"' + (peut ? "" : " disabled") + '>' + (peut ? "🔨 " + (l ? "Améliorer" : "Construire") : "❌ Il manque " + nommer("planche", coutAmelioration(k) - compter("planche"))) + '</button>');
      }
      return caseObjet(null, { act:"refsel", cle:"b:" + k, sel:selRef === "b:" + k, icone:ic("ref_" + k, r.icone), nom:r.nom, badge:l + "/" + r.max, pret:peut, terne:mx });
    }), 5);
  } else {
    if(ongletRef === "fabriquer"){
      // Ce qu'on peut fabriquer tout de suite en premier, marqué d'une coche
      h += etageres(RECETTES.map(function(rec, i){ return { rec:rec, i:i, e:empechement(rec.ingredients, rec.besoin) }; })
        .sort(function(a, b){ return (a.e ? 1 : 0) - (b.e ? 1 : 0); })
        .map(function(r){
          if(selRef === "c:" + r.i){
            var o = OBJETS[r.rec.id];
            fiche = '<div class="invfiche"><span class="em">' + icone(r.rec.id) + '</span><span class="eqt"><b>' + o.nom + '</b><small>' + o.desc + '</small></span></div>'
              + ingredients(r.rec.ingredients, r.rec.besoin) + boutonTravail("🛠️ Fabriquer", "craft", r.i, r.rec.ingredients, r.rec.besoin);
          }
          return caseObjet(r.rec.id, { act:"refsel", cle:"c:" + r.i, sel:selRef === "c:" + r.i, pret:!r.e, terne:!!r.e });
        }), 10);
    } else if(ongletRef === "cuisine"){
      astuce("cuisine");
      var pd = platsDispo(), gp = {}; pd.forEach(function(o){ gp[o.id] = (gp[o.id] || 0) + 1; });
      h += '<p class="sub">🔥 Cuisinière à bois : ' + nommer("planche", BAL.cuisine.planches) + ' par plat (il en reste ' + compter("planche") + ') · ' + (pd.length ? "🍲 Prêts : " + liste(Object.keys(gp).map(function(id){ return nommer(id, gp[id]); })) : "aucun plat prêt") + '</p>';
      h += etageres(RECETTES_CUISINE.map(function(rec, i){ return { rec:rec, i:i, e:empechementCuisine(i) }; })
        .sort(function(a, b){ return (a.e ? 1 : 0) - (b.e ? 1 : 0); })
        .map(function(r){
          if(selRef === "k:" + r.i){
            var o = OBJETS[r.rec.id], np = portionsRecette(r.i);
            fiche = '<div class="invfiche"><span class="em">' + icone(r.rec.id) + '</span><span class="eqt"><b>' + o.nom + ' · ' + np + ' portions</b><small>Chaque portion : ' + o.desc + '</small></span></div>'
              + ingredientsCuisine(r.rec.ingredients) + boutonCuisine(r.i);
          }
          return caseObjet(r.rec.id, { act:"refsel", cle:"k:" + r.i, sel:selRef === "k:" + r.i, pret:!r.e, terne:!!r.e, n:gp[r.rec.id] || null });
        }), 6);
    } else if(ongletRef === "reparer"){
      var ab = armesAbimees(), e = empechement(REPARATION);
      h += ab.length ? etageres(ab.map(function(o){
        if(selRef === "r:" + o.uid) fiche = ligneObjet(o.id, 1, o) + '<p class="sub">Une réparation rend ' + Math.round(BAL.reparation * 100) + ' % de la solidité. Il faut :</p>' + ingredients(REPARATION) + boutonTravail("🔧 Réparer", "repair", o.uid, REPARATION);
        return caseObjet(o.id, { act:"refsel", cle:"r:" + o.uid, sel:selRef === "r:" + o.uid, usure:Math.round(o.sol / OBJETS[o.id].sol * 100), pret:!e });
      }), 5) : '<p>Aucune arme abîmée.</p>';
    } else {
      var dm = demontables();
      h += dm.length ? etageres(dm.map(function(o){
        if(selRef === "d:" + o.uid){
          var rec = []; for(var k in DEMONTAGE[o.id]) rec.push(icone(k) + " " + nommer(k, DEMONTAGE[o.id][k]));
          fiche = '<div class="invfiche"><span class="em">' + icone(o.id) + '</span><span class="eqt"><b>' + OBJETS[o.id].nom + '</b><small>Tu récupères : ' + rec.join(", ") + '</small></span></div>'
            + boutonTravail("♻️ Démonter", "salvage", o.uid);
        }
        return caseObjet(o.id, { act:"refsel", cle:"d:" + o.uid, sel:selRef === "d:" + o.uid, usure:o.sol ? Math.round(o.sol / OBJETS[o.id].sol * 100) : null });
      }), 5) : '<p>Rien à démonter dans le stock (les objets équipés ne sont pas proposés).</p>';
    }
  }
  if(ongletRef !== "voiture") h += fiche || '<p class="sub">Touche une case pour voir le détail.</p>';
  show(h + BTN_FERMER());
  if(fiche){ var fi = document.querySelector("#sheet .invfiche, #sheet .ings2"); if(fi) fi.scrollIntoView({ block:"nearest" }); }
}

/* ---------- Nuit, événements, mort ---------- */
function openNuit(n){
  // Bandeau : le refuge assiégé s'il y a eu une attaque cette nuit, sinon l'aube calme (griffures sur les planches)
  var attaque = n.some(function(l){ return String(l[1]).indexOf("Attaque de nuit") >= 0; });
  show('<div class="banniere"><img src="images/' + (attaque ? "nuit" : "aube") + '.webp" alt=""></div><h2>Fin du jour ' + (G.day - 1) + '</h2><p class="sub">⭐ +' + vivants().length + ' (un point par survivant) · Score : ' + G.score + '</p>' + puces(n) + '<button class="btn" style="width:100%" data-act="morning">Jour ' + G.day + '</button>');
}
function openEvent(ev){
  G.ev = ev; G.evIdx = EVENEMENTS.indexOf(ev);
  var im = IMAGES_EVENEMENTS[G.ev.titre];
  var h = (im ? '<div class="banniere"><img src="images/evenements/' + im + '.webp" alt=""></div>' : '') + '<h2>' + G.ev.titre + '</h2><p>' + texteEvenement(G.ev) + '</p>';
  G.ev.choix.forEach(function(c, i){ h += '<button class="loc" data-act="ev" data-id="' + i + '"><b>' + c[0] + '</b></button>'; });
  show(h);
  var qui = locuteurEvenement(G.ev); if(qui) parle(qui[0], qui[1]);
}
function finiSiMorts(){ if(!vivants().length){ over(); return true; } return false; }
function over(){
  effacerSauvegarde();
  if(typeof cumulerPartie === "function"){ cumulerPartie(); envoyerMonde(true, { jour:G.day - 1, score:G.score }); }
  // La famille est tombée : elle quitte son clan (le clan passe à 4/5, une ligne dans son journal)
  if(typeof dansUnClan === "function" && dansUnClan()){ appelClans({ action:"quitter", raison:"mort", jour:G.day - 1 }).then(function(){ noterClan(false); noterTours(0); }).catch(function(){}); }
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
  if(G.tl <= 0){ demarrer(); if(typeof envoyerMonde === "function") envoyerMonde(true); render(); show('<h2>Trop tard !</h2><p>Les zombies enfoncent la porte. Vous fuyez avec ce qu’il y a dans le sac.</p>' + BTN_FERMER("Courir")); }
}
var derniereSeconde = null;
setInterval(tick, 250);

/* ---------- Grand écran (PC) : famille à gauche, pièce au centre, panneau à droite ----------
   Le panneau de droite montre un tableau de bord (chapitre, refuge, stock, mission) ; les fenêtres s'y ouvrent
   à la place, sans cacher la pièce. Le combat garde sa grande fenêtre au milieu. */
var LARGEUR_PANNEAU_PC = 464; // 440 de panneau + les marges (même valeur que dans style.css)
var LARGEUR_BOITE_PC = 1500;  // sur très grand écran, le jeu reste dans un cadre centré de 1500 px (style.css aussi)
function modePC(){ return !!(window.matchMedia && matchMedia("(min-width: 1100px) and (min-height: 620px)").matches) && G && G.ph === "game"; }
function tableauPC(){
  var t = $("tableauPC");
  if(!document.body.classList.contains("pc")){ if(t) t.remove(); return; }
  if(!t){ t = document.createElement("aside"); t.id = "tableauPC"; document.body.appendChild(t); }
  var ch = chapitreCourant(), h = '<h2>📜 Jour ' + G.day + '</h2>';
  if(ch) h += '<div class="tb-bloc"><b>' + ch.titre + '</b><small>' + ch.objectif + '</small></div>';
  if(mission()) h += '<button class="loc" data-act="mission"><b>🎯 ' + mission().titre + '</b><small>Encore ' + joursMission() + ' jour' + (joursMission() > 1 ? "s" : "") + (livraisonPossible() >= 0 ? " · tu peux livrer !" : "") + '</small></button>';
  h += '<p class="titre-butin">🏠 Le refuge</p>' + resumeRefuge();
  var ids = Object.keys(G.stock.n).sort(function(a, b){ return G.stock.n[b] - G.stock.n[a]; }).slice(0, 10);
  var uniq = {}; G.stock.o.forEach(function(o){ uniq[o.id] = (uniq[o.id] || 0) + 1; });
  var cases = ids.map(function(k){ return caseObjet(k, { act:"stock", cle:k, n:G.stock.n[k], fixe:true }); })
    .concat(Object.keys(uniq).slice(0, Math.max(0, 15 - ids.length)).map(function(k){ return caseObjet(k, { act:"stock", cle:k, n:uniq[k], fixe:true }); }));
  h += '<p class="titre-butin">📦 Le stock</p>' + (cases.length ? etageres(cases, 5) : '<p class="sub">Le stock est vide.</p>')
    + '<div class="row"><button class="btn alt" data-act="stock">📦 Tout le stock</button><button class="btn alt" data-act="refuge">🛠️ Refuge</button></div>'
    + (G.derniereNuit && G.derniereNuit.length ? '<p class="titre-butin">🌙 La nuit dernière</p>' + puces(G.derniereNuit) : '')
    + '<p class="sub tb-aide">Les fenêtres s’ouvrent ici, à droite : la pièce reste visible.</p>';
  t.innerHTML = h;
}
function render(){
  document.body.classList.toggle("pc", modePC());
  if(!modePC() && $("tableauPC")) $("tableauPC").remove();
  if(G.ph !== "pick") document.body.classList.remove("urgence");
  if(G.ph !== "accueil") document.body.classList.remove("accueil-ouvert");
  document.body.classList.toggle("fond", G.ph === "game" || G.ph === "accueil" || G.ph === "intro" || G.ph === "famille" || G.ph === "pick"); // fond peint
  document.body.classList.toggle("maison", G.ph === "intro" || G.ph === "famille" || G.ph === "pick"); // avant la fuite : l'entrée de la maison
  if(typeof placerPiece === "function") setTimeout(placerPiece, 0); // zones cliquables de la pièce (piece.js)
  if(G.ph === "accueil") return; if(G.ph === "intro"){ rIntro(); return; } if(G.ph === "famille"){ rFamille(); return; } if(G.ph === "pick") rPick(); else { verifierChapitre(); rGame(); if(typeof verifierSucces === "function") verifierSucces(); } }
// Ferme la fenêtre, ou montre d'abord un chapitre terminé
function fermer(){
  var A = G.annonces && G.annonces.shift();
  if(!A || !vivants().length){ hide(); return; }
  show('<h2>📖 Chapitre ' + A.num + ' terminé</h2><p><b>' + A.titre + '</b></p><p>' + perso(A.texte) + '</p><p class="g2 msg">🎁 ' + [A.recompense, A.moral ? "Moral +" + A.moral : ""].filter(Boolean).join(" · ") + '</p><p class="histoire"><i>' + perso(chapitreCourant().recit) + '</i></p><p class="sub">Prochain : ' + chapitreCourant().titre + ' — ' + chapitreCourant().objectif + '</p>' + BTN_FERMER("Continuer"));
  var conteur = vivants()[0]; if(conteur) parle(conteur.nom, iconeMembre(conteur));
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
/* ---------- Vitrine : ce qui attend le joueur (cartes illustrées qui défilent toutes seules) ---------- */
var VITRINE = [
  ["images/piece-cuisine-feu.webp", "🏚️ Ton refuge, pièce par pièce", "Salon, cuisine, chambre, atelier, garage, cour… barricade, cultive, cuisine au feu de bois."],
  ["images/lieux/super.webp", "🗺️ Plus de 20 lieux à fouiller", "Chaque objet trouvé ne revient jamais. Des lieux secrets se découvrent avec le temps."],
  ["images/portrait-hurleur.webp", "⚔️ Des combats tactiques", "Vise la tête, pousse, soigne, lance un cocktail… Des zombies variés, chacun son piège."],
  ["images/portrait-fillette.webp", "🗣️ Des rencontres et des choix", "Aider, mentir, voler ou fuir : chaque décision peut sauver ou condamner les tiens."],
  ["images/portrait-papa.webp", "👪 Ta famille, tes règles", "Renomme-les, choisis leurs traits : costaud, soigneur, cuisinier… La mort est définitive."],
  ["images/combat/foret.webp", "🌲 Forêt, étang, potager, poules", "Coupe du bois, pêche, élève des poules : rien n’est infini, tout s’épuise."],
  ["images/voiture-ok.webp", "🚗 Répare la vieille voiture", "Trouve batterie, roue et courroie pour atteindre les zones lointaines, riches et dangereuses."],
  ["images/piece-bastion-salle.webp", "🏰 Clans et guerres", "Après 30 jours, rejoins un clan de 5 familles : bastion commun, réserve, défenses, et guerres de 3 jours contre d’autres clans."],
  ["images/nuit.webp", "🌙 Des nuits d’angoisse", "Les zombies attaquent, le froid mord, la folie guette. Tiendras-tu jusqu’au matin ?"],
  ["images/logo.webp", "🏆 Classement et parties du jour", "La même partie pour tous chaque jour, des succès, et un code pour inviter tes amis."]
];
var minuteurVitrine = null;
function vitrine(){
  return '<div class="vitrine" id="vitrine" aria-label="Ce qui t’attend">' + VITRINE.map(function(v, k){
      return '<div class="vt' + (k ? "" : " on") + '"><span class="vt-img"><img src="' + v[0] + '" alt="" loading="lazy"></span><span class="vt-txt"><b>' + v[1] + '</b><small>' + v[2] + '</small></span></div>';
    }).join("")
    + '<button class="vt-fl g" data-act="vitrineprec" aria-label="Carte précédente">‹</button><button class="vt-fl d" data-act="vitrinesuiv" aria-label="Carte suivante">›</button>'
    + '<div class="vt-points">' + VITRINE.map(function(v, k){ return '<button class="vt-pt' + (k ? "" : " on") + '" data-act="vitrine" data-id="' + k + '" aria-label="Voir : ' + v[1].replace(/^\S+ /, "") + '"></button>'; }).join("") + '</div></div>';
}
function montrerVitrine(k){
  var v = document.getElementById("vitrine"); if(!v){ clearInterval(minuteurVitrine); return; }
  var cartes = v.querySelectorAll(".vt"), pts = v.querySelectorAll(".vt-pt");
  if(k === undefined){ k = 0; cartes.forEach(function(c, j){ if(c.classList.contains("on")) k = (j + 1) % cartes.length; }); }
  cartes.forEach(function(c, j){ c.classList.toggle("on", j === k); }); pts.forEach(function(p, j){ p.classList.toggle("on", j === k); });
}
// Défilement tout seul, lent (9 s) ; dès que le joueur touche la vitrine, elle attend 25 s avant de repartir
function lancerVitrine(pause){
  clearInterval(minuteurVitrine); clearTimeout(lancerVitrine.t);
  var v = document.getElementById("vitrine"); if(!v) return;
  if(!v.dataset.glisse){ v.dataset.glisse = "1"; brancherGlisseVitrine(v); }
  if(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  lancerVitrine.t = setTimeout(function(){ minuteurVitrine = setInterval(function(){ montrerVitrine(); }, 9000); }, pause ? 25000 : 0);
}
function decalerVitrine(d){
  var v = document.getElementById("vitrine"); if(!v) return;
  var cartes = v.querySelectorAll(".vt"), k = 0; cartes.forEach(function(c, j){ if(c.classList.contains("on")) k = j; });
  montrerVitrine((k + d + cartes.length) % cartes.length); lancerVitrine(true);
}
// Glisser au doigt (ou à la souris) vers la gauche / la droite
function brancherGlisseVitrine(v){
  var x0 = null, y0 = 0;
  v.addEventListener("pointerdown", function(e){ if(e.target.closest("button")) return; x0 = e.clientX; y0 = e.clientY; });
  v.addEventListener("pointerup", function(e){ if(x0 === null) return; var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null; if(Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) decalerVitrine(dx < 0 ? 1 : -1); });
  v.addEventListener("pointercancel", function(){ x0 = null; });
}
// Flèches du clavier sur PC (seulement quand la vitrine est affichée et qu'aucun champ n'est en cours de saisie)
document.addEventListener("keydown", function(e){
  if(!document.getElementById("vitrine") || /INPUT|TEXTAREA/.test((e.target || {}).tagName || "")) return;
  if(e.key === "ArrowRight") decalerVitrine(1); else if(e.key === "ArrowLeft") decalerVitrine(-1);
});
function rIntro(){
  $("app").innerHTML = '<div class="panneau intro"><div class="tetejeu"><img class="logo" src="images/logo.webp" alt=""><div><h1 class="titrejeu">SURVIVAL</h1><p class="sub">Le dernier refuge</p></div></div>'
    + '<div class="intro-recit"><p>Personne n’a compris ce qui se passait. En une semaine, les villes se sont tues : les morts se relèvent, et ils ont faim.</p>'
    + '<p>Ta famille a tenu bon dans votre maison… jusqu’à ce soir. <b>Ils sont à la porte.</b> Tu as une minute pour remplir le sac avant de fuir vers le refuge : une vieille maison au bout de la rue, avec une cheminée et des murs solides.</p>'
    + '<p>Là-bas, il faudra fouiller le quartier, barricader, soigner les tiens. Personne ne viendra vous sauver. Le seul but : <b>tenir le plus longtemps possible, tous ensemble.</b></p></div>'
    + '<div class="intro-cote">' + vitrine()
    + '<div class="monde-place" data-compact="1"></div></div>'
    + '<button class="btn" style="width:100%" data-act="intro">Continuer</button></div>';
  lancerVitrine();
  if(typeof poserMonde === "function") poserMonde();
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
    + (typeof openSaisieCode === "function" ? '<button class="lien-code" data-act="saisircode">🎟️ ' + (codeEnAttente() ? "Code d’invitation reçu : " + echapper(codeEnAttente()) + " (toucher pour valider)" : "J’ai un code d’invitation") + '</button>' : '')
    + '<p class="msg" id="msgfam"></p><button class="btn" style="width:100%" data-act="famok">Préparer le sac ⏱</button></div>';
}
// Fenêtre pour taper un prénom (k = 0 à 3) ou le pseudo (k = "p")
var apresPseudo = null; // fenêtre à rouvrir après avoir choisi son pseudo
function openSaisie(k){
  var p = k === "p", v = p ? lirePseudo() : G.famille[+k].nom;
  show('<h2>✏️ ' + (p ? "Ton pseudo" : "Prénom de " + FAMILLE[+k].nom) + '</h2><p class="sub">' + (p ? "Il s’affichera dans le classement (pas ton vrai nom). 16 lettres au plus." : "10 lettres au plus.") + '</p>'
    + '<input id="saisie" class="champ grand" maxlength="' + (p ? 16 : 10) + '" autocomplete="off" value="' + echapper(v) + '">'
    + '<p class="msg" id="msgsaisie"></p><div class="row"><button class="btn" data-act="saisieok" data-id="' + k + '">OK</button><button class="btn alt" data-act="close">Annuler</button></div>');
  setTimeout(function(){ var c = $("saisie"); if(c){ c.focus(); c.select(); } }, 50);
}
function validerSaisie(k){
  var v = ($("saisie").value || "").replace(/[<>&"]/g, "").trim();
  if(k === "p"){
    try{ localStorage.setItem("survival_pseudo", v.slice(0, 16)); }catch(e){}
    // Pseudo demandé par une autre fenêtre (ex. fonder un clan) : on y revient au lieu de tout fermer
    var retour = apresPseudo; apresPseudo = null;
    if(retour === "clan" && typeof openCreerClan === "function"){ render(); openCreerClan(); return; }
    if(retour === "clans" && typeof openClans === "function"){ render(); openClans("👤 Pseudo enregistré : tu peux rejoindre un clan."); return; }
    hide(); render(); return;
  }
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
/* ---------- Pastilles du haut : fenêtres façon jeu (en-tête, tuiles, détail en journal) ---------- */
function teteInfo(icone, titre, valeur, cls){ return '<div class="infotete ' + (cls || "") + '"><span class="it-ico">' + icone + '</span><span class="it-txt"><small>' + titre + '</small><b>' + valeur + '</b></span></div>'; }
function tuiles(t){ return '<div class="tuiles">' + t.map(function(x){ return '<div class="tuile ' + (x[2] || "") + '"><b>' + x[1] + '</b><small>' + x[0] + '</small></div>'; }).join("") + '</div>'; }
function openInfo(id){
  var h = "", v = vivants().length, L = [];
  if(id === "eau" || id === "nour"){
    var eau = id === "eau", r = rations(id), b = Math.min(besoinNuit(id), r), nuits = v ? Math.floor(r / v) : 0;
    var prod = eau ? G.ref.eau * REFUGE.eau.parJour : G.ref.pot * REFUGE.pot.parJour;
    h = teteInfo(ic(eau ? "bouteille" : "conserve", eau ? "💧" : "🥫"), eau ? "Rations d’eau" : "Rations de nourriture", r, r < v ? "ko" : "")
      + tuiles([["cette nuit", "−" + b, r < v ? "ko" : ""], ["gagné / nuit", "+" + prod, prod ? "ok" : ""], ["réserve", "≈ " + nuits + " nuit" + (nuits > 1 ? "s" : ""), nuits < 2 ? "ko" : nuits < 4 ? "moy" : "ok"]]);
    if(r < v) L.push(["b2", "⚠️ Pas assez pour tout le monde ce soir : " + (eau ? "la soif" : "la faim") + " va faire des dégâts."]);
    L.push(["", "🌙 Chaque nuit, chacun " + (eau ? "boit" : "mange") + " 1 ration, et 1 de plus si sa jauge tombe sous " + BAL.rattrapage + "."]);
    if(prod) L.push(["g2", ic(eau ? "ref_eau" : "ref_pot", eau ? "🪣" : "🥕") + " " + (eau ? "Le récupérateur" : "Le potager") + " rapporte " + prod + " ration" + (prod > 1 ? "s" : "") + " par nuit."]);
    else L.push(["", (eau ? "🪣 Construis un récupérateur d’eau, fabrique une bâche, ou profite de la pluie." : "🥕 Construis un potager, pêche à l’étang, élève des poules ou pose des collets.")]);
    L.push(["", "➕ Une ration de plus dans la journée (bouton ＋ d’un membre) ne sert qu’en urgence."]);
    h += puces(L);
  } else if(id === "soin"){
    var cs = []; for(var k in G.stock.n) if(OBJETS[k].soin) cs.push(caseObjet(k, { act:"aucun", cle:k, n:G.stock.n[k], fixe:true }));
    var blesses = vivants().filter(function(x){ return x.hp < 100; }).length;
    h = teteInfo(ic("bandage", "🩹"), "Objets de soin", soinsDispo(), soinsDispo() ? "" : "ko")
      + tuiles([["blessés", blesses, blesses ? "ko" : "ok"], ["bonus soigneur", bonusSoin() ? "+" + bonusSoin() + " PV" : "—", bonusSoin() ? "ok" : ""], ["repos / nuit", "+" + BAL.regenPV + " PV", ""]])
      + (cs.length ? etageres(cs, 5) : '');
    L.push(["", "➕ Pour soigner quelqu’un, touche le ＋ de sa carte : le soin le mieux adapté est choisi tout seul."]);
    if(!cs.length) L.push(["b2", "🩹 Aucun soin au refuge : cherche à l’hôpital, au supermarché, ou fabrique des bandages à l’atelier."]);
    h += puces(L);
  } else if(id === "def"){
    var A = BAL.attaqueNuit, ch = Math.round(Math.min(A.max, A.base + G.day * A.parJour + compter("poule") * BAL.poules.attaque) * 100), f = 1 + Math.floor(G.day / A.joursParForce), d = defenseNuit();
    var etat = d >= f + 2 ? "ok" : d >= f ? "moy" : "ko";
    h = teteInfo(ic("bouclier", "🛡️"), "Défense de nuit", d, etat)
      + tuiles([["risque cette nuit", ch + " %", ch >= 50 ? "ko" : ch >= 30 ? "moy" : "ok"], ["force attendue", f + " à " + (f + 2), ""], ["verdict", d >= f + 2 ? "Solide" : d >= f ? "Juste" : "Trop faible", etat]]);
    if(G.ref.barr) L.push(["g2", ic("ref_barr", "🧱") + " Barricade niveau " + G.ref.barr + " : +" + G.ref.barr * BAL.defenseBarricade]);
    equipes().forEach(function(o){ if(OBJETS[o.id].def) L.push(["g2", icone(o.id) + " " + OBJETS[o.id].nom + " en main : +" + OBJETS[o.id].def]); });
    if(compter("piege") > 0) L.push(["g2", icone("piege") + " Piège à zombies : +" + BAL.piegeDef + " (un seul usage)"]);
    if(chien()) L.push(["g2", ic("chien", "🐕") + " " + chien().nom + " monte la garde : +" + BAL.chien.defense]);
    if(typeof BONUS_CLAN_DEF !== "undefined" && BONUS_CLAN_DEF) L.push(["g2", "🗼 Tours de guet du bastion de ton clan : +" + BONUS_CLAN_DEF]);
    if(!L.length) L.push(["b2", "🧱 Rien pour l’instant : construis la barricade et garde des armes en main."]);
    L.push(["b2", "🧟 Attaque perdue : un blessé, de la nourriture volée et un niveau de barricade détruit."]);
    h += puces(L);
  } else if(id === "moral"){
    var visage = G.moral > 60 ? ic("moralBon", "😀") : G.moral > 30 ? ic("moralMoyen", "😐") : ic("moralBas", "😟"); // le même visage que la pastille du haut
    var mo = 0; G.stock.o.concat(equipes()).forEach(function(o){ mo += OBJETS[o.id].moral || 0; }); for(var kk in G.stock.n) mo += (OBJETS[kk].moral || 0) * G.stock.n[kk];
    var gain = BAL.moralBonusObjet * mo + (G.feu ? BAL.feu.moral : 0) + BAL.traits.optimiste * vivants().filter(function(x){ return x.trait === "optimiste"; }).length;
    var net = gain - BAL.moralPerteNuit, m = Math.round(G.moral);
    h = teteInfo(visage, "Moral de la famille", m + " / 100", m < BAL.moralBas ? "ko" : m >= BAL.moralHaut ? "ok" : "")
      + '<div class="jmoral"><span class="z-bas" style="width:' + BAL.moralBas + '%"></span><span class="z-mid" style="width:' + (BAL.moralHaut - BAL.moralBas) + '%"></span><span class="z-haut" style="width:' + (100 - BAL.moralHaut) + '%"></span><i style="left:' + m + '%"></i></div>'
      + '<div class="jmoral-leg"><span>fouille moins bien</span><span>normal</span><span>+1 objet</span></div>'
      + tuiles([["perte / nuit", "−" + BAL.moralPerteNuit, "ko"], ["gain / nuit", "+" + gain, gain ? "ok" : ""], ["bilan / nuit", (net >= 0 ? "+" + net : "−" + (-net)), net >= 0 ? "ok" : "ko"]]);
    L.push(["", "🧸 Les objets de confort au refuge (peluche, photo, cartes…) remontent le moral chaque nuit."]);
    L.push(["", "🔥 Un feu de cheminée, les bons choix du matin, les chapitres et les missions réussis aussi."]);
    L.push(["b2", "💀 Une mort fait chuter le moral de 25."]);
    h += puces(L);
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
  else if(a === "saisie"){ apresPseudo = b.getAttribute("data-retour") || null; openSaisie(id); return; }
  else if(a === "saisieok"){ validerSaisie(id); return; }
  else if(a === "trait"){ var qt = id.split(":"); changerTrait(+qt[0], +qt[1]); }
  else if(a === "house"){ if(G.seed) return; if(i !== G.h){ G.h = i; G.pack = {}; G.info = "Tu as changé de maison : le sac est vidé."; } }
  else if(a === "start"){ demarrer(); if(typeof envoyerMonde === "function") envoyerMonde(true); }
  else if(a === "sel" && modeMini()){ openMembre(i); return; }
  else if(a === "msel"){ var xm = G.m[i]; if(peutSortir(xm)){ var pm = G.sel.indexOf(i); if(pm >= 0) G.sel.splice(pm, 1); else if(G.sel.length < BAL.membresParExpedition) G.sel.push(i); } render(); openMembre(i); return; }
  else if(a === "sel"){ var x = G.m[i]; if(peutSortir(x)){ var p = G.sel.indexOf(i); if(p >= 0) G.sel.splice(p, 1); else if(G.sel.length < BAL.membresParExpedition) G.sel.push(i); } }
  else if(a === "soins"){ openSoins(i); return; }
  else if(a === "heal"){ soigner(i); hide(); }
  else if(a === "boire"){ boire(i); hide(); }
  else if(a === "rchoix"){ choisirRencontre(i); render(); openRencontre(); return; }
  else if(a === "rfin"){ var rf = finirRencontre(); render(); if(rf){ openResultat(rf); finiSiMorts(); } else hide(); return; }
  else if(a === "vitrine"){ montrerVitrine(i); lancerVitrine(true); return; }
  else if(a === "vitrineprec" || a === "vitrinesuiv"){ decalerVitrine(a === "vitrinesuiv" ? 1 : -1); return; }
  else if(a === "cuire"){ var mc = cuisiner(i); if(mc) msgAtelier = mc; openRef("cuisine"); render(); return; }
  else if(a === "plat"){ var qp = id.split(":"); var xp = G.m[+qp[0]]; mangerPlat(xp, qp[1]); openSoins(+qp[0]); render(); return; }
  else if(a === "ration"){ var qr = id.split(":"); prendreRation(+qr[0], qr[1]); openSoins(+qr[0]); render(); return; }
  else if(a === "slot"){ retourEquip = b.getAttribute("data-retour"); var q = id.split(":"); openSlot(+q[0], q[1]); return; }
  else if(a === "equip"){ var q = id.split(":"); equiper(+q[0], q[1], +q[2]);
    if(retourEquip === "quipart" && typeof openQuiPart === "function"){ render(); openQuiPart(); return; }
    if(modeMini()){ render(); openMembre(+q[0]); return; } hide(); }
  else if(a === "unequip"){ var q = id.split(":"); desequiper(+q[0], q[1]); openSlot(+q[0], q[1]); render(); return; }
  else if(a === "fouille"){ if(typeof allerPieceId === "function") allerPieceId("garage"); if(!G.sel.length && typeof openQuiPart === "function"){ openQuiPart(); return; } openLoc(); return; }
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
  else if(a === "cfin"){ if(G.exp && G.exp.guerre && typeof terminerAssaut === "function"){ terminerAssaut(); return; } apresEtape(avantFouille()); return; }
  else if(a === "son"){ basculerSon(); return; }
  else if(a === "stock"){ if(typeof allerPieceId === "function") allerPieceId("reserve"); selStock = null; openStock(); return; }
  else if(a === "invf"){ filtreStock = id; openStock(); return; }
  else if(a === "invsel"){ son("bois"); selStock = selStock === id ? null : id; openStock(); return; }
  else if(a === "invequip"){ var qe = id.split(":"); if(equiper(+qe[0], qe[1], +qe[2])) msgStock = "✅ " + G.m[+qe[0]].nom + " porte maintenant " + nommer(G.m[+qe[0]].eq[qe[1]].id, 1) + "."; selStock = null; render(); openStock(); return; }
  else if(a === "chapitre"){ openChapitre(); return; }
  else if(a === "mission"){ openMission(); return; }
  else if(a === "livrer"){ var lm = livrerMission(); render(); if(lm) show('<h2>🎯 Mission réussie</h2><p>' + lm + '</p>' + BTN_FERMER()); return; }
  else if(a === "chien"){ confirmerChien = false; openChien(); return; }
  else if(a === "mangerchien"){ confirmerChien = true; openChien(); return; }
  else if(a === "mangerchienok"){ confirmerChien = false; var mc = mangerChien(); render(); show('<h2>Un soir de famine</h2><p>' + (mc || "Ce n’est plus possible.") + '</p>' + BTN_FERMER("Continuer")); return; }
  else if(a === "marche"){ openMarche(); return; }
  else if(a === "troc"){ msgMarche = echanger(i) || ""; render(); openMarche(); return; }
  else if(a === "refuge"){ if(typeof allerPieceId === "function") allerPieceId("atelier"); openRef(); return; }
  else if(a === "dormir"){ if(typeof allerPieceId === "function") allerPieceId("chambre"); openDormir(); return; }
  else if(a === "endday"){ var n = finJour(); G.derniereNuit = n.filter(function(l){ return l[0] !== "mort"; }).slice(0, 8); render(); openNuit(n);
    if(typeof envoyerMonde === "function" && vivants().length) envoyerMonde(n.some(function(l){ return l[0] === "mort"; }));
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
  else if(a === "build"){ if(ameliorer(id)) msgAtelier = "✅ " + REFUGE[id].nom + " : niveau " + G.ref[id] + " !"; render(); openRef(); return; }
  else if(a === "onglet"){ pieceChoisie = null; openRef(id); return; }
  else if(a === "refsel"){ son("bois"); selRef = selRef === id ? null : id; openRef(); return; }
  else if(a === "bilanref"){ bilanOuvert = !bilanOuvert; openRef(); return; }
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
  else if(G.rencontre) openRencontre();
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
  document.body.classList.add("accueil-ouvert"); // la fenêtre « Partie en cours » laisse toucher la vitrine derrière elle
  document.body.classList.add("fond");
  $("app").innerHTML = '<div class="accueil"><img class="logo grand" src="images/logo.webp" alt=""><h1>SURVIVAL</h1><p class="sub">Le dernier refuge</p>' + vitrine() + '</div>';
  lancerVitrine();
  show('<h2>Partie en cours</h2><p>' + (enCours.seed ? "🏆 Partie classée du " + dateGraine(enCours.seed) : "🎲 Partie libre") + ' · <b>Jour ' + enCours.day + '</b> · ⭐ ' + enCours.score + ' · '
    + enCours.m.filter(function(x){ return x.al; }).map(function(x){ return iconeMembre(x); }).join(" ") + '</p>'
    + '<div class="monde-place" data-compact="1"></div>'
    + '<button class="btn" style="width:100%;margin-bottom:8px" data-act="continuer">▶️ Continuer</button>'
    + '<button class="btn alt" style="width:100%;margin-bottom:8px" data-act="guide">📖 Guide du survivant</button>'
    + '<button class="btn alt" style="width:100%" data-act="nouvelle">🆕 Nouvelle famille (la partie en cours sera perdue)</button>');
  if(typeof poserMonde === "function") poserMonde();
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
  if(SONS_SYNTH[nom]){ if(sonActif){ if(delai) setTimeout(function(){ jouerSynth(nom); }, delai); else jouerSynth(nom); } return; }
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

/* Petits bruitages fabriqués par le navigateur (pas de fichier) : feu qui crépite, poules, moulinet, bois */
var SONS_SYNTH = { feu:1, poule:1, moulinet:1, bois:1 };
function jouerSynth(nom){
  try{
    ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)();
    var c = ctxAudio, t = c.currentTime;
    var bruit = function(debut, duree, vol, freq){ // petit souffle de bruit filtré
      var n = Math.floor(c.sampleRate * duree), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for(var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
      var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = buf; f.type = "bandpass"; f.frequency.value = freq; g.gain.value = vol;
      s.connect(f); f.connect(g); g.connect(c.destination); s.start(t + debut);
    };
    var note = function(debut, duree, f0, f1, vol, type){
      var o = c.createOscillator(), g = c.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(f0, t + debut); o.frequency.exponentialRampToValueAtTime(f1, t + debut + duree);
      g.gain.setValueAtTime(0.0001, t + debut); g.gain.exponentialRampToValueAtTime(vol, t + debut + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + debut + duree);
      o.connect(g); g.connect(c.destination); o.start(t + debut); o.stop(t + debut + duree + 0.02);
    };
    if(nom === "feu"){ bruit(0, 0.5, 0.25, 900); for(var k = 0; k < 9; k++) bruit(0.05 + Math.random() * 0.9, 0.04, 0.5, 2000 + Math.random() * 2500); }
    else if(nom === "poule"){ note(0, 0.09, 900, 1300, 0.12, "triangle"); note(0.13, 0.09, 950, 1400, 0.12, "triangle"); note(0.3, 0.22, 1100, 700, 0.14, "triangle"); }
    else if(nom === "moulinet"){ for(var m = 0; m < 10; m++) bruit(m * 0.035, 0.02, 0.35, 3500); note(0.38, 0.12, 500, 900, 0.1, "square"); }
    else if(nom === "bois"){ note(0, 0.08, 220, 140, 0.18, "triangle"); bruit(0, 0.05, 0.15, 600); }
  }catch(e){}
}
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
      if(J.indexOf("🔫") >= 0) sonTir(); else if(/⚔️|🎯|✋|🔥/.test(J)) son("coup");
      if(J.indexOf("📢") >= 0) son("zombie", 120);
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
