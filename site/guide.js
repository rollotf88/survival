/* =====================================================================
   guide.js : le menu ☰ et le « Guide du survivant » (le wiki du jeu).
   Les règles citent les vrais chiffres de BAL ; les fiches des objets,
   lieux et zombies sont fabriquées à partir de data.js : quand on ajoute
   un objet ou un lieu, sa fiche apparaît toute seule.
   ===================================================================== */

/* ---------- Règles (titre, icône, texte) ---------- */
function reglesGuide(){
  var B = BAL;
  return [
    ["Boire et manger", ic("bouteille", "💧"),
      "Chaque nuit, chaque membre boit 1 ration d’eau et mange 1 ration de nourriture : ça compense ce qu’il a perdu dans la journée (−" + B.soifParJour + " de soif, −" + B.faimParJour + " de faim). " +
      "Si une jauge est sous " + B.rattrapage + ", il prend une ration de plus, s’il en reste assez pour les autres. " +
      "Tu peux aussi le faire boire ou manger quand tu veux avec le bouton ＋ de sa carte. Une jauge à 0 fait perdre " + B.degatsFaimSoif + " PV par nuit."],
    ["L’énergie", "⚡",
      "Une expédition coûte " + (B.energieBase + B.energieParDistance) + " ⚡ (près), " + (B.energieBase + 2 * B.energieParDistance) + " ⚡ (moyen) ou " + (B.energieBase + 3 * B.energieParDistance) + " ⚡ (loin). " +
      "En voiture, seule la fouille coûte (" + B.energieBase + " ⚡). Sous " + B.fatigueSeuil + " ⚡ au départ, on est fatigué : fouille et combat moins bons. " +
      "Dormir rend " + B.reposNuit + " ⚡ (" + B.reposFroid + " si la nuit est glaciale). Une canette donne +" + B.canetteEnergie + " ⚡ et +" + (B.canetteSoif || 0) + " de soif, mais on dort moins bien."],
    ["Les expéditions", ic("loupe", "🔍"),
      "Choisis 1 ou 2 membres, équipe-les (arme, outil, sac), puis touche Fouiller. Chaque lieu a une vraie liste d’objets qui ne revient jamais : quand il est « Vidé », c’est fini. " +
      "Lieu sombre : il faut une lampe (et des piles) ou au moins un briquet. Porte verrouillée : une boîte à outils, un pied-de-biche, ou des épingles pour crocheter. " +
      "Chacun porte " + B.mainsParMembre + " objets dans les bras, plus son sac : ce qui ne rentre pas reste sur place."],
    ["Les combats", ic("rodeur", "🧟"),
      "Pour chaque membre : Frapper (dégâts selon l’arme) ou Se protéger (dégâts reçus ÷2). Fuir réussit " + Math.round(B.combat.fuite * 100) + " % du temps, mais on rapporte moitié moins. " +
      "Les armes s’usent à chaque coup et finissent par casser. Une arme à feu frappe fort mais utilise une munition et attire parfois un zombie de plus. Le bouton 🤖 Auto joue pour toi."],
    ["Pêche et poules", ic("poule", "🐔"),
      "L’étang (à partir du jour " + LIEUX.filter(function(L){ return L.peche; })[0].jour + ") : avec une canne à pêche dans la case outil, chacun attrape " + B.peche.prises[0] + " à " + B.peche.prises[1] + " poissons (2 rations chacun). La canne s’use à chaque sortie, on peut la fabriquer. " +
      "Les poissons se reproduisent lentement (+1 toutes les " + B.peche.nuitsParNaissance + " nuits), mais seulement s’il en reste au moins " + B.peche.seuil + " : vide l’étang et il ne donnera plus rien. " +
      "Les poules pondent souvent un œuf la nuit (+1 ration), boivent 1 ration d’eau pour " + B.poules.eauPour + " poules, et chaque poule ajoute +" + Math.round(B.poules.attaque * 100) + " % de risque d’attaque. Sans eau, l’une d’elles meurt."],
    ["Le monde bouge", "🏴",
      "À partir du jour " + B.pillards.jour + ", des pillards passent parfois la nuit et vident une partie d’un lieu que tu n’as pas fini : ne traîne pas. " +
      "De nouveaux lieux secrets se découvrent avec le temps (jour 10, 15, 20…), " + B.avanceRadio + " jours plus tôt si tu as une radio. " +
      "Des missions arrivent aussi, avec un délai : livrer un objet ou aller secourir quelqu’un. Le bouton 🎯 en bas de l’écran les montre."],
    ["La nuit", ic("lune", "🌙"),
      "Des zombies peuvent attaquer, de plus en plus fort avec les jours. Ta défense = armes en main + barricade (+" + B.defenseBarricade + " par niveau) + piège + Rex. " +
      "Une attaque perdue blesse quelqu’un, fait perdre de la nourriture et détruit un niveau de barricade. Sans couverture ni briquet, la nuit est glaciale."],
    ["Le refuge", ic("marteau", "🛠️"),
      "Construire : barricade, récupérateur d’eau, potager (avec des planches). Fabriquer, réparer, démonter : chaque travail coûte " + B.energieCraft + " ⚡ au plus reposé. " +
      "Le bilan en haut de l’onglet Construire résume tout ce qui protège et nourrit la famille."],
    ["La voiture", ic("roue", "🚗"),
      "La voiture du voisin est en panne : trouve une batterie, une roue et une courroie, puis glisse-les dessus (onglet Voiture du refuge). " +
      "Elle consomme " + VOITURE.litresParDistance + " L par niveau de distance, porte " + VOITURE.coffre + " objets de plus et seule elle mène aux zones éloignées."],
    ["Score et chapitres", "⭐",
      "Chaque nuit, tu gagnes 1 point par membre en vie : garder toute la famille en vie rapporte le plus. Les chapitres donnent des objectifs et des récompenses ; ensuite, « Tenir bon » revient tous les 10 jours. " +
      "En Partie du jour, tout le monde a la même partie : mêmes choix, même résultat. Compare ton score !"]
  ];
}

/* ---------- Petits outils pour les fiches ---------- */
function niveauDanger(d){ return d < 0.3 ? "faible" : d < 0.5 ? "moyen" : d < 0.7 ? "élevé" : "très élevé"; }
function ouTrouver(id){
  var t = [];
  LIEUX.forEach(function(L){ if(L.butin[id]) t.push(iconeLieu(L) + " " + L.nom); });
  MAISONS.forEach(function(M){ if(M.objets[id]) t.push(ic(ICONE_MAISON[M.nom], M.icone) + " " + M.nom + " (départ)"); });
  if(MARCHE.stock[id]) t.push(ic("marco", "🧔") + " Marco le brocanteur");
  return t;
}
function caracteristiques(o){
  var t = [];
  if(o.rations) t.push(o.rations + " ration" + (o.rations > 1 ? "s" : "") + (o.cat === "eau" ? " d’eau" : " de nourriture"));
  if(o.soin) t.push("soigne " + o.soin + " PV");
  if(o.degats) t.push("dégâts " + o.degats[0] + "-" + o.degats[1]);
  if(o.def) t.push("défense de nuit +" + o.def);
  if(o.sol && o.emplacement) t.push("solidité " + o.sol);
  if(o.munition) t.push("munition : " + minus(OBJETS[o.munition].pl));
  if(o.capacite) t.push("+" + o.capacite + " places de butin");
  if(o.lumiere) t.push(o.lumiere === 2 ? "éclaire bien (1 pile par fouille)" : "lueur faible");
  if(o.ouvre) t.push("ouvre les portes verrouillées");
  if(o.chaleur) t.push("tient chaud la nuit");
  if(o.moral) t.push("moral +" + o.moral);
  if(o.radio) t.push("révèle le danger des lieux");
  if(o.emplacement) t.push("se porte : " + { arme:"arme", outil:"outil / éclairage", sac:"sac" }[o.emplacement]);
  if(o.place !== undefined) t.push(o.place ? o.place + " place" + (o.place > 1 ? "s" : "") + " dans un sac" : "ne prend pas de place");
  return t;
}

/* ---------- Affichage ---------- */
var guideOnglet = "regles", guideFiche = null, confirmerNouvelle = false;
var ONGLETS_GUIDE = [["regles","📜","Règles"],["objets","🎒","Objets"],["lieux","🗺️","Lieux"],["zombies","🧟","Zombies"],["famille","👪","Famille"]];

function openMenu(){
  var h = '<h2>☰ Menu</h2>';
  h += '<button class="loc" data-act="close"><b>▶️ Reprendre la partie</b></button>';
  h += '<button class="loc" data-act="guide"><b>📖 Guide du survivant</b><small>Règles, objets, lieux, zombies, famille</small></button>';
  if(typeof openClassement === "function") h += '<button class="loc" data-act="classement"><b>🏆 Classement</b><small>Les meilleurs scores de tous les joueurs</small></button>';
  h += '<button class="loc" data-act="menuson"><b>' + (sonEstActif() ? "🔊 Son : activé" : "🔇 Son : coupé") + '</b><small>Toucher pour ' + (sonEstActif() ? "couper" : "remettre") + ' le son</small></button>';
  h += '<button class="loc" data-act="revoirastuces"><b>💡 Revoir les astuces</b><small>Les bulles d’aide de la première partie réapparaîtront</small></button>';
  h += '<p class="sub">' + (G.seed ? "📅 Partie du " + dateGraine(G.seed) : "🎲 Partie libre") + ' · ⭐ score ' + (G.score || 0) + ' · 🏆 record ' + RECORD + '</p>';
  if(!confirmerNouvelle) h += '<button class="loc" data-act="menunouvelle"><b>🆕 Nouvelle famille</b><small>Abandonner la partie en cours</small></button>';
  else h += '<p class="msg">Vraiment ? La partie en cours sera perdue.</p><div class="row"><button class="btn" data-act="menunouvelleok">Oui, recommencer</button><button class="btn alt" data-act="menu">Non</button></div>';
  show(h);
}

function openGuide(){
  var h = '<h2>📖 Guide du survivant</h2><div class="tabs onglets">' + ONGLETS_GUIDE.map(function(o){ return '<button class="tab' + (o[0] === guideOnglet ? " on" : "") + '" data-act="gonglet" data-id="' + o[0] + '">' + o[1] + '<small>' + o[2] + '</small></button>'; }).join("") + '</div>';
  if(guideFiche){ h += ficheObjet(guideFiche); }
  else if(guideOnglet === "regles"){
    h += reglesGuide().map(function(r){ return '<div class="gsec"><b>' + r[1] + ' ' + r[0] + '</b><p>' + r[2] + '</p></div>'; }).join("");
  } else if(guideOnglet === "objets"){
    h += '<p class="sub">Touche un objet pour voir sa fiche.</p>';
    CATEGORIES.forEach(function(c){
      var ids = Object.keys(OBJETS).filter(function(id){ return OBJETS[id].cat === c[0]; });
      if(!ids.length) return;
      h += '<b class="gcat">' + c[1] + '</b><div class="gobjets">' + ids.map(function(id){ return '<button class="gobj" data-act="gfiche" data-id="' + id + '">' + icone(id) + '<small>' + OBJETS[id].nom + '</small></button>'; }).join("") + '</div>';
    });
  } else if(guideOnglet === "lieux"){
    h += LIEUX.map(function(L){
      var tags = [DISTANCES[L.distance], "danger " + niveauDanger(L.danger)];
      if(L.sombre) tags.push("sombre"); if(L.verrou) tags.push("verrouillé"); if(L.voiture) tags.push("voiture obligatoire"); if(L.peche) tags.push("pêche (canne à pêche)"); if(L.secret) tags.push("secret : découvert vers le jour " + L.secret); if(L.jour) tags.push("à partir du jour " + L.jour);
      return '<div class="gsec"><b>' + iconeLieu(L) + ' ' + L.nom + '</b><p class="sub">' + tags.join(" · ") + '</p><div class="gmini">' + Object.keys(L.butin).map(function(id){ return '<span title="' + OBJETS[id].nom + '">' + icone(id) + '</span>'; }).join("") + '</div></div>';
    }).join("");
  } else if(guideOnglet === "zombies"){
    h += ZOMBIES.map(function(z){
      return '<div class="gsec"><b>' + iconeZombie(z) + ' ' + z.nom + '</b><p>' + z.pv + ' PV · frappe ' + z.degats[0] + ' à ' + z.degats[1] + ' · ' + (z.jour > 1 ? "apparaît à partir du jour " + z.jour : "dès le premier jour") + '</p></div>';
    }).join("") + '<p class="sub">Avec les jours, ils arrivent plus souvent à plusieurs. Le bruit (tirs, voiture, porte forcée) attire du monde.</p>';
  } else {
    h += FAMILLE.map(function(f){ var x = { nom:f.nom, icone:f.icone, al:true, hp:100, en:100, faim:100, soif:100 }; return '<div class="gsec"><b>' + iconeMembre(x) + ' ' + f.nom + '</b><p>' + (f.atout || "Aucun atout particulier") + '</p></div>'; }).join("");
    h += '<div class="gsec"><b>' + ic("sam", "🧑") + ' Les recrues</b><p>Si un membre meurt, une survivante peut frapper à la porte et prendre sa place (famille de ' + FAMILLE.length + ' au maximum).</p></div>';
    h += '<div class="gsec"><b>' + ic("chien", "🐕") + ' Rex, le chien</b><p>Après l’avoir nourri, il reste : +' + BAL.chien.defense + ' de défense la nuit, mais il mange ' + BAL.chien.rations + ' ration chaque soir et part au bout de ' + BAL.chien.nuitsSansManger + ' nuits sans manger.</p></div>';
  }
  show(h + (guideFiche ? '<div class="row"><button class="btn alt" data-act="gretour">← Tous les objets</button><button class="btn alt" data-act="close">Fermer</button></div>' : BTN_FERMER()));
  $("sheet").scrollTop = 0;
}

function ficheObjet(id){
  var o = OBJETS[id], h = '<div class="rt"><span class="em" style="font-size:56px">' + icone(id) + '</span><span class="eqt"><h2>' + o.nom + '</h2><p class="sub">' + o.desc + '</p></span></div>';
  var c = caracteristiques(o); if(c.length) h += '<p>' + c.join(" · ") + '</p>';
  var ou = ouTrouver(id);
  h += '<div class="gsec"><b>Où le trouver</b><p>' + (ou.length ? ou.join(", ") : "Nulle part : il faut le fabriquer.") + '</p></div>';
  var rec = RECETTES.filter(function(r){ return r.id === id; })[0];
  if(rec){ var ing = []; for(var k in rec.ingredients) ing.push(icone(k) + " " + nommer(k, rec.ingredients[k])); h += '<div class="gsec"><b>Se fabrique avec</b><p>' + ing.join(", ") + (rec.besoin ? " (avec " + nommer(rec.besoin, 1) + ")" : "") + '</p></div>'; }
  var sert = RECETTES.filter(function(r){ return r.ingredients[id] || r.besoin === id; }).map(function(r){ return icone(r.id) + " " + OBJETS[r.id].nom; });
  if(id === "ferraille" || id === "ruban") sert.push("🔧 réparer une arme");
  if(OBJETS[id].piece) sert.push(ic("roue", "🚗") + " réparer la voiture");
  if(id === "jerrican") sert.push(ic("roue", "🚗") + " faire le plein de la voiture");
  if(id === "planche") sert.push(ic("ref_barr", "🧱") + " construire le refuge");
  if(id === "epingle") sert.push("🗝️ crocheter une serrure");
  if(sert.length) h += '<div class="gsec"><b>Sert à fabriquer ou à faire</b><p>' + sert.join(", ") + '</p></div>';
  if(DEMONTAGE[id]){ var d = []; for(var k2 in DEMONTAGE[id]) d.push(icone(k2) + " " + nommer(k2, DEMONTAGE[id][k2])); h += '<div class="gsec"><b>Démonté, il donne</b><p>' + d.join(", ") + '</p></div>'; }
  return h;
}

/* ---------- Clics du menu et du guide ---------- */
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
  if(a === "menu"){ confirmerNouvelle = false; openMenu(); }
  else if(a === "guide"){ guideFiche = null; openGuide(); }
  else if(a === "gonglet"){ guideOnglet = id; guideFiche = null; openGuide(); }
  else if(a === "gfiche"){ guideFiche = id; guideOnglet = "objets"; openGuide(); }
  else if(a === "gretour"){ guideFiche = null; openGuide(); }
  else if(a === "menuson"){ basculerSon(); openMenu(); }
  else if(a === "revoirastuces"){ astucesVues = {}; try{ localStorage.removeItem("survival_astuces"); }catch(err){} hide(); render(); }
  else if(a === "menunouvelle"){ confirmerNouvelle = true; openMenu(); }
  else if(a === "menunouvelleok"){ confirmerNouvelle = false; nouvelleFamille(); }
});
