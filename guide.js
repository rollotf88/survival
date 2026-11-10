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
    ["Le froid et le feu", "🔥",
      "La nuit, il fait froid. Un feu de cheminée (touche la cheminée du salon ou de la chambre) réchauffe toute la famille : il faut un briquet au refuge, et il brûle " + B.feu.planches + " planche par nuit. Avec le feu, on dort mieux (+" + B.feu.repos + " ⚡) et le moral monte (+" + B.feu.moral + "). " +
      "Sans feu, une couverture tient chaud " + B.feu.couvrePar + " personnes. Ceux qui ont froid récupèrent moins (" + B.reposFroid + " ⚡ au lieu de " + B.reposNuit + ") et perdent " + B.degatsFroid + " PV. Quand il n’y a plus de planches, le feu s’éteint."],
    ["Les expéditions", ic("loupe", "🔍"),
      "Choisis 1 ou 2 membres, équipe-les (arme, outil, sac), puis touche Fouiller. Chaque lieu a une vraie liste d’objets qui ne revient jamais : quand il est « Vidé », c’est fini. " +
      "Lieu sombre : il faut une lampe (et des piles) ou au moins un briquet. Porte verrouillée : une boîte à outils, un pied-de-biche, ou des épingles pour crocheter. " +
      "Chacun porte " + B.mainsParMembre + " objets dans les bras, plus son sac : ce qui ne rentre pas reste sur place."],
    ["Les combats", ic("rodeur", "🧟"),
      "Au début de chaque tour, une bulle au-dessus de chaque zombie dit ce qu’il va faire : qui il va mordre (et combien ça peut faire mal), ou s’il va hurler. Touche un zombie pour le viser, puis choisis l’action de chacun : " +
      "⚔️ Frapper ; 🎯 Viser la tête (" + Math.round(B.combat.tete * 100) + " % de chances, dégâts ×" + B.combat.teteMult + ", l’armure ne compte pas) ; ✋ Pousser (" + Math.round(B.combat.pousser * 100) + " % de chances que le zombie perde son attaque, " + Math.round(B.combat.pousserLourd * 100) + " % contre un Costaud) ; " +
      "🛡️ Se protéger (dégâts reçus ÷2) ; 🩹 Soigner (un objet de soin sur le plus blessé) ; 🔥 Cocktail (1 alcool + 1 chiffon, avec un briquet dans la famille : " + B.combat.cocktail[0] + " à " + B.combat.cocktail[1] + " dégâts à tous les zombies). " +
      "Fuir réussit " + Math.round(B.combat.fuite * 100) + " % du temps, mais on rapporte moitié moins. Les armes s’usent à chaque coup ; une arme à feu utilise une munition et attire parfois un zombie de plus. Le bouton 🤖 Auto joue pour toi."],
    ["Pêche et poules", ic("poule", "🐔"),
      "L’étang (à partir du jour " + LIEUX.filter(function(L){ return L.peche; })[0].jour + ") : avec une canne à pêche dans la case outil, chaque pêcheur a " + B.peche.lancers + " lancers : quand le bouchon s’enfonce, touche « Ferrer » à temps pour attraper un poisson (2 rations chacun). La canne s’use à chaque sortie, on peut la fabriquer. " +
      "Les poissons se reproduisent lentement (+1 toutes les " + B.peche.nuitsParNaissance + " nuits), mais seulement s’il en reste au moins " + B.peche.seuil + " : vide l’étang et il ne donnera plus rien. " +
      "Les poules pondent souvent un œuf la nuit (+1 ration), boivent 1 ration d’eau pour " + B.poules.eauPour + " poules, et chaque poule ajoute +" + Math.round(B.poules.attaque * 100) + " % de risque d’attaque. Sans eau, l’une d’elles meurt."],
    ["La cuisine", "🍲",
      "Dans la cuisine (ou l’onglet 🍲 du refuge), la cuisinière à bois transforme tes vivres et des ingrédients (épices, huile, farine, champignons, baies, herbes) en plats : " +
      RECETTES_CUISINE.map(function(r){ var o = OBJETS[r.id]; return o.nom.toLowerCase() + " (" + r.portions + " portions)"; }).join(", ") + ". " +
      "Chaque plat brûle " + nommer("planche", B.cuisine.planches) + " et coûte " + B.energieCraft + " ⚡ au cuisinier. Une portion nourrit plus qu’une ration (+35 à +50 de faim au lieu de +30) avec un bonus (moral, PV, énergie), mais les plats se gâtent en 3 nuits (les galettes en 8). La nuit, chacun mange d’abord un plat s’il y en a. Le potager donne parfois des herbes."],
    ["Le dernier recours", "🕯️",
      "Si la famille meurt de faim et qu’il ne reste vraiment plus rien, une solution terrible peut être proposée au moment de dormir : sacrifier l’un des vôtres (+" + B.sacrifice.viande + " rations). Le moral s’effondre (" + B.sacrifice.moral + ") et la folie s’installe chez les survivants : elle monte chaque nuit (sauf si le moral tient au-dessus de " + B.folie.moralCalme + "), fait fouiller moins bien et pousse à des actes fous (frapper quelqu’un, hurler toute la nuit, sortir seul, laisser la porte ouverte, voler les réserves). À 100, on part pour toujours. Ce contenu peut être coupé dans le menu (Contenus durs)."],
    ["Les clans", ic("bastion", "🏰"),
      "Dès le jour " + BAL.jourClans + ", ta famille peut fonder ou rejoindre un clan de 5 familles au plus (menu ☰ → Clans). Chacun garde sa maison et sa partie ; le clan ajoute 3 pièces : la grande salle, la salle du trésor et la cour fortifiée. " +
      "La réserve du clan se remplit avec les dépôts de chacun (vivres, soins, munitions, matériaux) : on peut prendre 5 objets par jour, et au plus 5 de plus que ce qu’on a déposé. Elle paie les défenses : remparts, mines, tours de guet (+1 de défense de nuit pour chaque famille), armurerie et le camion. " +
      "Un clan complet peut partir en guerre contre un autre clan de sa ligue : 3 jours, un assaut par membre et par jour, des étoiles pour gagner et une part de la réserve adverse en butin. Les victoires rapportent des trophées et font monter de ligue (Ferraille, Bronze, Argent, Or, Légende)."],
    ["Les opérations du clan", ic("cible", "🎯"),
      "De temps en temps, le clan peut préparer une opération ensemble (bastion → Opérations, la table de la grande salle, ou la grande carte en haut de « Où envoyer l’équipe ? »). La première : <b>l’immeuble abandonné</b>, une seule fois par clan. " +
      "Chaque famille y envoie un volontaire (il reste au bastion et ne fouille plus) avec ce qu’elle lui confie : munitions, soins, gilet, casque, bouclier. Dès " + 4 + " volontaires, le chef lance le raid et le joue : " + BAL.immeuble.etages.length + " étages de plus en plus durs, avec le Colosse sur le toit. " +
      "Entre deux étages, le jeu annonce les chances de passer l’étage suivant : monter ou redescendre avec le butin. Chaque volontaire debout ramène " + BAL.immeuble.sac + " objets, " + BAL.immeuble.remorque + " de plus avec la remorque artisanale (une construction du bastion). " +
      "Ensuite, chacun revoit le raid en replay, récupère son volontaire (blessé, ou mort pour de bon), ce qui reste de son kit et sa part du butin ; 30 % vont à la réserve du clan. Une équipe bien armée (armes à feu, munitions, gilets, trousses) a de bonnes chances d’atteindre le toit ; une équipe légère devra redescendre plus tôt."],
    ["La discussion du clan", "💬",
      "Pour s’organiser : menu ☰ → Clans → Discussion du clan, ou la cheminée de la grande salle du bastion (sur PC, le panneau de droite). Les messages rapides s’envoient en un toucher (« Je suis prêt pour le raid ! »…), la vie du clan (dépôts, raid, guerre) s’y affiche en gris. " +
      "Une pastille rouge sur le bouton ☰ compte les nouveaux messages, sur tous les écrans. Les gros mots sont masqués ; le chef peut effacer un message, et chacun peut en signaler un (🚩) à l’équipe du jeu."],
    ["Équipement de guerre", "🦺",
      "Pour les guerres de clans, fabrique à l’atelier (ou trouve au commissariat, à la caserne, à la base militaire) : le gilet pare-balles (−2 dégâts par coup reçu), le casque de fortune (mines et explosions ÷2) et le bouclier anti-émeute (« Se protéger » ne laisse passer que 40 % des dégâts). Ils sont portés tout seuls par l’équipe d’assaut, un de chaque par membre, et s’usent d’un cran par assaut. L’armurerie du bastion habille les défenseurs de gilets : chaque tir perd 2 dégâts par niveau (même à la tête), un coup de mêlée un peu moins."],
    ["Le camion du clan", "🚚",
      "Au bastion, onglet Camion : le clan améliore son camion avec la réserve. Pare-buffle : chaque défenseur perd 1 à 2 PV par niveau en début d’assaut. Blindage : le camion encaisse une mine par niveau. Tourelle : à chaque tour, elle tire sur le défenseur le plus faible (1 dégât par niveau, plus 0 à 2, freinée par l’armurerie adverse). Il sert à l’assaut de chaque membre."],
    ["La forêt et le bois", "🌲",
      "La forêt (à partir du jour " + LIEUX.filter(function(L){ return L.bois; })[0].jour + ") : chaque survivant qui a une hache en main (case arme) abat un arbre et rapporte " + B.foret.coupe[0] + " ou " + B.foret.coupe[1] + " planches. " +
      "Elle compte environ " + B.foret.arbres + " planches en tout, et les arbres ne repoussent pas. Chaque sortie use la hache (−" + B.foret.usure + "), et des zombies rôdent entre les arbres : la hache est aussi ta meilleure arme, ménage-la."],
    ["Le monde bouge", "🏴",
      "À partir du jour " + B.pillards.jour + ", des pillards passent parfois la nuit et vident une partie d’un lieu que tu n’as pas fini : ne traîne pas. À partir du jour " + B.caches.jour + ", il arrive aussi que des pillards en fuite abandonnent une cache (" + B.caches.taille[0] + " à " + B.caches.taille[1] + " objets) dans un lieu presque vide : écoute la radio et le bilan de la nuit. " +
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
      "En Partie du jour, tout le monde a la même partie : mêmes choix, même résultat. Compare ton score !"],
    ["Crédits", "🙏",
      "Musique : « EmptyCity » par yd (domaine public, CC0). " +
      "Filtre des noms : une partie des mots vient de la liste « List of Dirty, Naughty, Obscene and Otherwise Bad Words » (LDNOOBW, github.com/LDNOOBW), licence CC BY 4.0, triée et complétée pour le jeu."]
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
  if(o.chaleur) t.push("tient chaud 2 personnes la nuit");
  if(o.allume) t.push("allume le feu de cheminée");
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
  // Grille compacte : tout tient sans faire défiler, même sur un petit téléphone ou couché
  var t = function(act, titre, sous){ return '<button class="mt" data-act="' + act + '"><b>' + titre + '</b>' + (sous ? '<small>' + sous + '</small>' : '') + '</button>'; };
  var h = '<h2>☰ Menu</h2><p class="sub">' + (G.seed ? "🏆 Partie classée du " + dateGraine(G.seed) : G.ph === "game" ? "🎲 Partie libre" : "") + ' · ⭐ score ' + (G.score || 0) + ' · 🏆 record ' + RECORD + '</p><div class="menugrille">';
  h += t("guide", "📖 Guide", "Règles, objets, lieux");
  if(typeof openClassement === "function") h += t("classement", "🏆 Classement", "Tous les joueurs");
  if(typeof openSucces === "function") h += t("succes", "🏅 Succès", nbSucces() + " / " + SUCCES.length + " débloqués");
  if(typeof openClans === "function") h += t("clans", "⚔️ Clans", jourPartie() >= BAL.jourClans ? "Fonder ou rejoindre" : "Dès le jour " + BAL.jourClans);
  if(typeof openInviter === "function"){
    var nc = lireColis(), nb = lireBonus().length;
    h += t(nc ? "sacbonus" : "inviter", (nc ? "🪂 " : "🎁 ") + "Inviter", nc ? nc + " colis à ouvrir !" : nb + " / " + MAX_BONUS + " bonus gardés");
  }
  if(typeof openStats === "function") h += t("stats", "📊 Mes stats", (typeof statsJoueur === "function" ? statsJoueur().zombies : 0) + " zombies abattus");
  h += t("revoirastuces", "💡 Astuces", "Les revoir");
  h += t("menuson", sonEstActif() ? "🔊 Son" : "🔇 Son", sonEstActif() ? "Activé" : "Coupé");
  if(typeof basculerMusique === "function" && lectureOgg) h += t("menumusique", musiqueActive() ? "🎵 Musique" : "🔇 Musique", musiqueActive() ? "Activée" : "Coupée");
  h += t("menusensible", CONTENUS_SENSIBLES ? "🕯️ Contenus" : "🚫 Contenus", CONTENUS_SENSIBLES ? "Durs : activés" : "Durs : coupés");
  if(typeof basculerVibrations === "function" && navigator.vibrate) h += t("menuvibre", vibrationsActives() ? "📳 Vibrations" : "📴 Vibrations", vibrationsActives() ? "Activées" : "Coupées");
  if(typeof openAvis === "function") h += t("avis", "💬 Avis / bug", "Signaler, proposer");
  h += '</div>';
  if(!confirmerNouvelle) h += '<div class="row"><button class="btn" data-act="close">▶️ Reprendre</button><button class="btn alt" data-act="menunouvelle">🆕 Recommencer</button></div>';
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
    }).join("")
      // L'immeuble du raid (opération de clan) : ses étages, leurs zombies et leur butin
      + '<div class="gsec"><b>' + ic("cible", "🎯") + ' L’immeuble abandonné <small>· opération de clan</small></b><p class="sub">' + BAL.immeuble.etages.length + ' étages · ' + 4 + ' volontaires du clan · une seule fois par clan · le chef mène le raid</p>'
      + BAL.immeuble.etages.map(function(E, n){ return '<p class="g-etage"><b>' + (n + 1) + '. ' + E.nom + '</b> ' + E.z.map(function(id){ var T = ZOMBIES.find(function(t){ return t.id === id; }); return '<span class="g-z" title="' + T.nom + '">' + iconeZombie(T) + '</span>'; }).join("")
        + '</p><div class="gmini">' + Object.keys(E.butin).map(function(id){ return '<span title="' + OBJETS[id].nom + '">' + icone(id) + '</span>'; }).join("") + '</div>'; }).join("")
      + '<p class="sub">Zombies renforcés étage après étage. Butin : ' + BAL.immeuble.sac + ' objets par volontaire debout, ' + BAL.immeuble.remorque + ' de plus avec la remorque du bastion.</p></div>';
  } else if(guideOnglet === "zombies"){
    h += ZOMBIES.filter(function(z){ return z.jour < 1000 || z.id === "colosse"; }).map(function(z){
      var Et = z.id === "colosse" ? BAL.immeuble.etages[BAL.immeuble.etages.length - 1] : null, pvG = Et ? Math.round(z.pv * Et.pv) : z.pv, dgG = Et ? [z.degats[0] + Et.degats, z.degats[1] + Et.degats] : z.degats;
      return '<div class="gsec"><b>' + iconeZombie(z) + ' ' + z.nom + '</b><p>' + pvG + ' PV · frappe ' + dgG[0] + ' à ' + dgG[1] + (z.coups ? ' (' + z.coups + ' fois)' : '') + ' · ' + (z.id === "colosse" ? "seulement sur le toit de l’immeuble (opération de clan)" : z.jour > 1 ? "apparaît à partir du jour " + z.jour : "dès le premier jour") + (z.desc ? '<br>' + z.desc : '') + '</p></div>';
    }).join("") + '<p class="sub">Avec les jours, ils arrivent plus souvent à plusieurs. Le bruit (tirs, voiture, porte forcée) attire du monde.</p>';
  } else {
    h += '<div class="gsec"><b>👪 La famille</b><p>Au départ, tu peux renommer chacun (10 lettres au plus) et lui choisir un trait de caractère : un atout, mais aussi un défaut.</p></div>';
    h += Object.keys(TRAITS).map(function(k){ var T = TRAITS[k]; return '<div class="gsec"><b>' + T.icone + ' ' + T.nom + '</b><p><span class="plus">+ ' + T.plus + '</span><br><span class="moins">− ' + T.moins + '</span></p></div>'; }).join("");
    h += '<div class="gsec"><b>' + ic("sam", "🧑") + ' Les recrues</b><p>Si un membre meurt, une survivante peut frapper à la porte et prendre sa place (famille de ' + FAMILLE.length + ' au maximum). Elle arrive avec un trait au hasard.</p></div>';
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
  else if(a === "menumusique"){ basculerMusique(); openMenu(); }
  else if(a === "revoirastuces"){ astucesVues = {}; try{ localStorage.removeItem("survival_astuces"); }catch(err){} hide(); render(); }
  else if(a === "menunouvelle"){ confirmerNouvelle = true; openMenu(); }
  else if(a === "menunouvelleok"){ confirmerNouvelle = false; nouvelleFamille(); }
});
