/* =====================================================================
   data.js : TOUTES les données du jeu (objets, maisons, lieux, refuge,
   événements) et les chiffres d'équilibrage.
   Pour rééquilibrer le jeu, on modifie surtout ce fichier.
   ===================================================================== */

/* Icône d'un objet. Pour l'instant un emoji ; plus tard on renverra ici
   une image ou un SVG, sans toucher au reste du code. */
function icone(id){ return typeof ICONES_SVG !== "undefined" && ICONES_SVG[id] ? svgIcone(id) : OBJETS[id].icone; }
// Pareil pour les membres de la famille (les recrues gardent leur emoji) et les zombies
var ICONE_MEMBRE = { "Papa":"papa", "Maman":"maman", "Léo":"leo", "Emma":"emma", "Sam":"sam", "Nora":"nora", "Inès":"ines", "Yanis":"yanis" };
// Icône dessinée k si elle existe, sinon l'emoji donné
function ic(k, emoji){ if(typeof ICONES_SVG !== "undefined" && PORTRAITS_PNJ[k]) return portraitPNJ(k); return typeof ICONES_SVG !== "undefined" && ICONES_SVG[k] ? svgIcone(k) : emoji; }
// Portraits peints des zombies et de Marco (Gemini, 2026-11-09)
var PORTRAITS_PNJ = { rodeur:"images/portrait-rodeur.webp", coureur:"images/portrait-coureur.webp", costaud:"images/portrait-costaud.webp", marco:"images/portrait-marco.webp" };
function portraitPNJ(k){ return '<span class="portrait pnj"><img src="' + PORTRAITS_PNJ[k] + '" alt=""></span>'; }
var ICONE_LIEU = { "Maison voisine":"lieuMaison", "Rue des pavillons":"lieuRue", "Supermarché":"lieuSuper", "Hôpital":"lieuHopital",
  "Quincaillerie":"lieuQuinc", "Station-service":"lieuStation", "Garage auto":"lieuGarage", "Commissariat":"lieuPolice",
  "Zone industrielle":"lieuIndus", "Étang":"lieuEtang", "Centre commercial":"lieuCentre", "Village voisin":"lieuVillage", "École Jules-Ferry":"lieuEcole", "Caserne des pompiers":"lieuCaserne", "Péniche du canal":"lieuPeniche",
  "Camping des Pins":"lieuCamping", "Clinique vétérinaire":"lieuClinique", "Bunker du survivaliste":"lieuBunker", "Entrepôt logistique":"lieuEntrepot", "Base militaire":"lieuBase" };
var ICONE_MAISON = { "Pavillon":"maisonPavillon", "Ferme":"maisonFerme", "Appart":"maisonAppart" };
function iconeLieu(L){ return ic(ICONE_LIEU[L.nom], L.icone); }
// Illustrations peintes des lieux (Gemini, grilles de 4 découpées) : images/lieux/<nom>.webp
var IMAGES_LIEUX = { "Maison voisine":"maison", "Rue des pavillons":"rue", "Supermarché":"super", "Hôpital":"hopital",
  "Quincaillerie":"quinc", "Station-service":"station", "Étang":"etang", "Garage auto":"garage",
  "Commissariat":"police", "Zone industrielle":"indus", "Centre commercial":"centre", "Village voisin":"village",
  "Entrepôt logistique":"entrepot", "Base militaire":"base", "École Jules-Ferry":"ecole", "Caserne des pompiers":"caserne",
  "Péniche du canal":"peniche", "Camping des Pins":"camping", "Clinique vétérinaire":"clinique", "Bunker du survivaliste":"bunker" };
function imageLieu(L){ return typeof ICONES_SVG !== "undefined" && IMAGES_LIEUX[L.nom] ? "images/lieux/" + IMAGES_LIEUX[L.nom] + ".webp" : null; }
// Petite vignette pour la liste des lieux (sinon l'icône dessinée)
function vignetteLieu(L){ var i = imageLieu(L); return i ? '<img class="vign" src="' + i + '" alt="">' : iconeLieu(L); }
// Portraits peints (images faites avec ChatGPT par Fabien, découpées dans images/)
var PORTRAITS = { "Papa":"images/portrait-papa.webp", "Maman":"images/portrait-maman.webp", "Léo":"images/portrait-leo.webp", "Emma":"images/portrait-emma.webp",
  // Recrues (Leonardo.ai, 2026-11-09)
  "Sam":"images/portrait-sam.webp", "Nora":"images/portrait-nora.webp", "Inès":"images/portrait-ines.webp", "Yanis":"images/portrait-yanis.webp" };
// x.r = rôle d'origine (Papa, Maman, Léo, Emma ou le nom d'une recrue) : il garde le bon portrait même renommé
function iconeMembre(x){
  var r = x.r || x.nom;
  if(PORTRAITS[r] && typeof ICONES_SVG !== "undefined") return portraitMembre(x);
  var k = ICONE_MEMBRE[r]; return k && typeof ICONES_SVG !== "undefined" && ICONES_SVG[k] ? svgMembre(k, x) : x.icone;
}
function iconeZombie(z){ if(typeof ICONES_SVG !== "undefined" && PORTRAITS_PNJ[z.id]) return portraitPNJ(z.id); return typeof ICONES_SVG !== "undefined" && ICONES_SVG[z.id] ? svgIcone(z.id) : z.icone; }

/* ---------- Équilibrage : les chiffres faciles à modifier ---------- */
var BAL = {
  tempsDepart: 60,          // secondes pour remplir le sac au départ
  membresParExpedition: 2,  // nombre max de membres envoyés en même temps
  fouilleParMembre: 4,      // objets trouvés par membre (si tout va bien)
  mainsParMembre: 3,        // places de transport sans sac (dans les bras)
  // Traits de caractère (voir TRAITS plus bas) : un atout et un défaut chacun
  traits: {
    costaud: 1,             // Costaud : +1 dégât au corps à corps et +1 de force
    costaudFaim: 5,         //   mais perd 5 de faim de plus par jour
    soin: 20,               // Soigneur : chaque soin rend 20 PV de plus tant qu'il est en vie
    pacifiste: 1,           //   mais −1 dégât en combat
    fouine: 2,              // Fouineur : +2 objets par fouille
    bruit: 0.05,            //   mais +5 % de danger
    frele: 1,               // Doigts de fée : crochète mieux, mais porte 1 objet de moins
    endurant: 10,           // Endurant : expéditions −10 ⚡
    endurantSoif: 5,        //   mais perd 5 de soif de plus par jour
    tireur: 2,              // Tireur : +2 dégâts à l'arme à feu
    nerveux: 0.2,           //   mais ses tirs attirent plus souvent un zombie (+20 %)
    optimiste: 2,           // Optimiste : moral +2 chaque nuit
    reveur: 1               //   mais 1 objet de moins par fouille
  },
  dangerParJour: 0.01,      // le danger des lieux augmente chaque jour...
  dangerMaxAjoute: 0.3,     // ...jusqu'à +30 % au maximum
  noir:   { fouille: 0.5,  danger: 0.25 }, // lieu sombre sans lumière
  lueur:  { fouille: 0.75, danger: 0.10 }, // lieu sombre avec un briquet
  force:  { fouille: 0.5,  danger: 0.15 }, // porte forcée sans outil
  moralBas: 25,             // en dessous, l'équipe fouille moins bien
  moralBasFouille: 0.75,
  faimParJour: 30, soifParJour: 30, // perte de jauge par jour (une ration rend autant)
  rattrapage: 50,           // la nuit, sous 50 de faim ou de soif, on prend une ration de plus si le stock le permet
  degatsFaimSoif: 20,       // PV perdus si la jauge est à zéro
  degatsFroid: 5,           // PV perdus par nuit sans chaleur
  regenPV: 5,               // PV regagnés par nuit si bien nourri
  usureButin: [50, 100],    // les objets trouvés ont entre 50 et 100 % de solidité
  attaqueNuit: { base: 0.25, parJour: 0.02, max: 0.8,
                 joursParForce: 3,       // la force des attaques monte de 1 tous les N jours
                 casseBarricade: true }, // une attaque perdue détruit un niveau de barricade
  defenseBarricade: 2,      // défense de nuit par niveau de barricade
  moralDepart: 40, moralParObjet: 15, moralPerteNuit: 7, moralBonusObjet: 2,
  pubsParJour: 2,
  // Fatigue et distance : chaque membre a une énergie de 0 à 100
  energieBase: 20,          // énergie dépensée par une expédition...
  energieParDistance: 15,   // ...+15 par niveau de distance (près 35, moyen 50, loin 65)
  fatigueSeuil: 50,         // en dessous de 50 d'énergie au départ, on est fatigué :
  fatigueFouille: 0.75,     //   on fouille moins bien
  fatigueForce: 1,          //   et on se bat moins bien (-1 de force par membre fatigué)
  reposNuit: 70,            // énergie regagnée en dormant
  reposFroid: 40,           // seulement 40 si la nuit est glaciale
  energiePub: 40,           // pub « Second souffle » : +40 d'énergie pour toute la famille
  // Atelier (craft)
  energieCraft: 10,         // fabriquer, réparer ou démonter coûte 10 d'énergie au plus reposé
  reparation: 0.6,          // une réparation rend 60 % de la solidité maximum
  piegeDef: 3,              // un piège ajoute +3 de défense contre UNE attaque de nuit
  // Canette énergisante
  canetteEnergie: 40,       // +40 d'énergie tout de suite (une seule par membre et par jour)
  canetteSoif: 20,          // c'est une boisson : +20 sur la jauge de soif
  canetteContrecoup: 20,
  // Le chien (événement « Un chien errant »)
  chien: {
    defense: 1,              // défense de nuit en plus
    rations: 1,              // il mange 1 ration de nourriture par nuit (après la famille)
    nuitsSansManger: 2,      // au bout de 2 nuits sans manger, il part
    viande: 6,               // en cas de famine, le manger donne 6 rations...
    moral: -25               // ...mais le moral s'effondre
  },    // mais la nuit suivante, ce membre récupère 20 de moins
  // Crochetage (mini-jeu) : quand personne n'a d'outil pour ouvrir une porte
  crochetage: {
    goupilles: 3,            // nombre de goupilles à mettre en place
    zone: 0.18,              // largeur de la zone verte (18 % de la barre)
    zoneAgile: 0.28,         // trait « Doigts de fée » : zone plus large
    vitesse: 0.9,            // allers-retours du curseur par seconde
    chanceRobot: 0.65,       // réussite par goupille pour les robots de simulation
    chanceRobotAgile: 0.8
  },
  // Pêche à l'étang : il faut une canne à pêche équipée (case outil)
  peche: {
    prises: [1, 3],          // poissons attrapés par pêcheur
    poissons: 16,            // poissons dans l'étang au départ (et au maximum)
    seuil: 4,                // en dessous de 4 poissons, ils ne se reproduisent plus : l'étang meurt
    nuitsParNaissance: 2,    // sinon, +1 poisson toutes les 2 nuits
    lancers: 3,              // mini-jeu : 3 lancers par pêcheur (chaque touche ferrée à temps = 1 poisson)
    fenetre: 0.75,           // le bouchon reste enfoncé 0,75 s : il faut toucher pendant ce temps
    chanceRobot: 0.65        // réussite d'un lancer pour les robots de simulation
  },
  // Poules : des œufs, mais elles boivent et leurs caquètements attirent les zombies
  poules: {
    oeuf: 0.7,               // chaque poule pond 1 ration de nourriture 7 nuits sur 10
    eauPour: 3,              // 1 ration d’eau par nuit pour 3 poules (arrondi au-dessus)
    attaque: 0.03,           // +3 % de risque d'attaque de nuit par poule
    viande: 2                // une poule qui meurt de soif donne 2 rations
  },
  // Lieux secrets : découverts avec le temps (2 jours plus tôt avec une radio)
  avanceRadio: 2,
  // Pillards : à partir du jour 8, ils vident peu à peu les lieux qu'on n'a pas encore fouillés
  pillards: {
    jour: 8,                 // premier jour possible
    chance: 0.3,             // chance par nuit
    part: [0.3, 0.6],        // part des objets restants qu'ils emportent
    minimum: 3               // ils ne vont que dans les lieux où il reste au moins 3 objets
  },
  // Missions urgentes (une à la fois, avec un délai)
  missions: {
    jour: 6,                 // première mission possible
    chance: 0.2              // chance chaque nuit qu'une mission arrive (s'il n'y en a pas déjà une)
  },
  // Combat au tour par tour (en expédition)
  combat: {
    poings: [1, 2],          // dégâts sans arme
    malusFatigue: 1,         // un membre fatigué frappe moins fort
    protection: 0.5,         // « Se protéger » divise les dégâts reçus par 2
    fuite: 0.6,              // chance de réussir à fuir
    butinFuite: 0.5,         // en fuyant, on rapporte 2 fois moins de butin
    zombieEnPlus: 0.03,      // chance par jour d'avoir un zombie de plus (max +2)
    maxEnPlus: 2,
    crosse: [2, 3],          // arme à feu sans munition : on frappe avec la crosse
    bruitTir: 0.3,           // chaque tir a 30 % de chances d'attirer un zombie de plus...
    maxZombies: 5            // ...jusqu'à 5 zombies debout
  }
};

/* ---------- La voiture ----------
   La vieille voiture du voisin est dans le garage, en panne.
   On installe les pièces trouvées (glisser-déposer), puis on fait le plein. */
var VOITURE = {
  nom: "Vieux break du voisin",
  pieces: ["batterie", "roue", "courroie"], // pièces à installer
  reservoir: 20,          // litres maximum
  litresJerrican: 10,     // un jerrican = 10 litres
  litresParDistance: 2,   // litres consommés par niveau de distance (aller-retour)
  coffre: 8,              // places de butin en plus
  bruit: 0.10             // le moteur attire les zombies : +10 % de danger
};

/* ---------- Zombies (combat en expédition) ----------
   jour : apparaît à partir de ce jour ; poids : plus il est grand, plus il est fréquent */
var ZOMBIES = [
  { id:"rodeur",  nom:"Rôdeur",  icone:"🧟",   pv:6,  degats:[3, 7],  jour:1,  poids:6 },
  { id:"coureur", nom:"Coureur", icone:"🧟‍♀️", pv:4,  degats:[5, 9],  jour:5,  poids:3 },
  { id:"costaud", nom:"Costaud", icone:"🧟‍♂️", pv:14, degats:[8, 13], jour:12, poids:2 }
];
var DISTANCES = ["", "🚶 Près", "🚶 Moyen", "🚶 Loin", "🚗 Éloigné", "🚗 Très éloigné"];

/* ---------- Objets ----------
   nom / pl (pluriel) / g (genre : "m" ou "f") servent aux messages
   « Vous trouvez une hache ».
   place : places occupées dans le sac de départ ET pour rapporter le butin.
   empile : true = consommable rangé en tas (eau, nourriture, piles...).
   rations : rations d'eau ou de nourriture que l'objet contient.
   emplacement : "arme", "outil" ou "sac" = objet qu'un membre peut équiper.
   sol : solidité maximum (une arme s'use à chaque combat, puis se casse). */
var OBJETS = {
  // Eau
  bidon:      { nom:"Bidon d’eau", pl:"Bidons d’eau", g:"m", icone:"💧", cat:"eau", place:2, empile:true, rations:8, desc:"8 rations d’eau" },
  bouteille:  { nom:"Bouteille d’eau", pl:"Bouteilles d’eau", g:"f", icone:"🥤", cat:"eau", place:1, empile:true, rations:2, desc:"2 rations d’eau" },
  // Nourriture
  conserves:  { nom:"Lot de conserves", pl:"Lots de conserves", g:"m", icone:"🥫", cat:"nour", place:2, empile:true, rations:8, desc:"8 rations de nourriture" },
  riz:        { nom:"Sac de riz", pl:"Sacs de riz", g:"m", icone:"🍚", cat:"nour", place:2, empile:true, rations:12, desc:"12 rations de nourriture" },
  biscuits:   { nom:"Paquet de biscuits", pl:"Paquets de biscuits", g:"m", icone:"🍪", cat:"nour", place:1, empile:true, rations:4, desc:"4 rations de nourriture" },
  conserve:   { nom:"Boîte de conserve", pl:"Boîtes de conserve", g:"f", icone:"🥫", cat:"nour", place:1, empile:true, rations:2, desc:"2 rations de nourriture" },
  pates:      { nom:"Paquet de pâtes", pl:"Paquets de pâtes", g:"m", icone:"🍝", cat:"nour", place:1, empile:true, rations:3, desc:"3 rations de nourriture" },
  ration:     { nom:"Ration militaire", pl:"Rations militaires", g:"f", icone:"🍱", cat:"nour", place:1, empile:true, rations:4, desc:"4 rations de nourriture" },
  barre:      { nom:"Barre de céréales", pl:"Barres de céréales", g:"f", icone:"🍫", cat:"nour", place:1, empile:true, rations:1, desc:"1 ration de nourriture" },
  // Énergie
  canette:    { nom:"Canette énergisante", pl:"Canettes énergisantes", g:"f", icone:"🧃", cat:"energie", place:1, empile:true, desc:"+40 ⚡ et +20 de soif tout de suite, mais on dort mal la nuit suivante" },
  // Soins
  bandage:    { nom:"Bandage", pl:"Bandages", g:"m", icone:"🩹", cat:"soin", place:1, empile:true, soin:30, desc:"Soigne 30 PV" },
  trousse:    { nom:"Trousse de soins", pl:"Trousses de soins", g:"f", icone:"⛑️", cat:"soin", place:1, empile:true, soin:60, desc:"Soigne 60 PV" },
  antibio:    { nom:"Boîte d’antibiotiques", pl:"Boîtes d’antibiotiques", g:"f", icone:"💊", cat:"soin", place:1, empile:true, soin:40, desc:"Soigne 40 PV" },
  // Armes (emplacement « arme »)
  couteau:    { nom:"Couteau", pl:"Couteaux", g:"m", icone:"🔪", cat:"arme", place:1, emplacement:"arme", def:1, degats:[2,3], sol:12, desc:"Dégâts 2-3 · défense +1" },
  batte:      { nom:"Batte", pl:"Battes", g:"f", icone:"🏏", cat:"arme", place:2, emplacement:"arme", def:2, degats:[3,4], sol:15, desc:"Dégâts 3-4 · défense +2" },
  barrefer:   { nom:"Barre de fer", pl:"Barres de fer", g:"f", icone:"🦯", cat:"arme", place:2, emplacement:"arme", def:2, degats:[3,5], sol:25, desc:"Dégâts 3-5 · défense +2, très solide" },
  hache:      { nom:"Hache", pl:"Haches", g:"f", icone:"🪓", cat:"arme", place:2, emplacement:"arme", def:3, degats:[4,6], sol:20, desc:"Dégâts 4-6 · défense +3" },
  machette:   { nom:"Machette", pl:"Machettes", g:"f", icone:"🗡️", cat:"arme", place:1, emplacement:"arme", def:3, degats:[4,5], sol:16, desc:"Dégâts 4-5 · défense +3, légère" },
  // Armes à feu : très puissantes, mais chaque tir use une munition et fait du bruit
  pistolet:   { nom:"Pistolet", pl:"Pistolets", g:"m", icone:"🔫", cat:"arme", place:1, emplacement:"arme", def:3, degats:[6,9], munition:"balle", sol:30, desc:"Dégâts 6-9 · 1 balle par tir, bruyant" },
  fusil:      { nom:"Fusil de chasse", pl:"Fusils de chasse", g:"m", icone:"🎯", cat:"arme", place:2, emplacement:"arme", def:4, degats:[9,14], munition:"cartouche", sol:25, desc:"Dégâts 9-14 · 1 cartouche par tir, très bruyant" },
  // Munitions : on les trouve en boîtes, rangées à l'unité dans le stock
  balle:      { nom:"Balle", pl:"Balles", g:"f", icone:"🔹", cat:"munition", place:0, empile:true, desc:"Munition du pistolet" },
  cartouche:  { nom:"Cartouche", pl:"Cartouches", g:"f", icone:"🔸", cat:"munition", place:0, empile:true, desc:"Munition du fusil de chasse" },
  boiteBalles:{ nom:"Boîte de balles", pl:"Boîtes de balles", g:"f", icone:"📦", cat:"munition", place:1, empile:true, contient:{ balle:6 }, desc:"6 balles de pistolet" },
  boiteCart:  { nom:"Boîte de cartouches", pl:"Boîtes de cartouches", g:"f", icone:"🧨", cat:"munition", place:1, empile:true, contient:{ cartouche:4 }, desc:"4 cartouches de fusil" },
  // Voiture
  batterie:   { nom:"Batterie de voiture", pl:"Batteries de voiture", g:"f", icone:"🔌", cat:"voiture", place:2, empile:true, piece:true, desc:"Pièce pour la voiture" },
  roue:       { nom:"Roue", pl:"Roues", g:"f", icone:"🛞", cat:"voiture", place:2, empile:true, piece:true, desc:"Pièce pour la voiture" },
  courroie:   { nom:"Courroie", pl:"Courroies", g:"f", icone:"⛓️", cat:"voiture", place:1, empile:true, piece:true, desc:"Pièce pour la voiture" },
  jerrican:   { nom:"Jerrican d’essence", pl:"Jerricans d’essence", g:"m", icone:"⛽", cat:"voiture", place:2, empile:true, desc:"10 litres d’essence pour la voiture" },
  // Outils et éclairage (emplacement « outil »)
  lampe:      { nom:"Lampe torche", pl:"Lampes torches", g:"f", icone:"🔦", cat:"outil", place:1, emplacement:"outil", lumiere:2, desc:"Éclaire les lieux sombres (1 pile par fouille)" },
  briquet:    { nom:"Briquet", pl:"Briquets", g:"m", icone:"🔥", cat:"outil", place:1, emplacement:"outil", lumiere:1, chaleur:true, desc:"Lueur faible dans le noir, chaleur la nuit" },
  outils:     { nom:"Boîte à outils", pl:"Boîtes à outils", g:"f", icone:"🧰", cat:"outil", place:2, emplacement:"outil", ouvre:true, desc:"Ouvre les portes verrouillées sans bruit" },
  canne:      { nom:"Canne à pêche", pl:"Cannes à pêche", g:"f", icone:"🎣", cat:"outil", place:2, emplacement:"outil", peche:true, sol:8, desc:"Pour pêcher à l’étang (s’use à chaque sortie, 8 fois)" },
  pdb:        { nom:"Pied-de-biche", pl:"Pieds-de-biche", g:"m", icone:"⛏️", cat:"outil", place:1, emplacement:"outil", ouvre:true, desc:"Ouvre les portes verrouillées" },
  // Sacs (emplacement « sac ») : places de butin en plus
  sacoche:    { nom:"Sacoche", pl:"Sacoches", g:"f", icone:"👝", cat:"sac", place:1, emplacement:"sac", capacite:2, desc:"+2 places pour rapporter du butin" },
  sacados:    { nom:"Sac à dos", pl:"Sacs à dos", g:"m", icone:"🎒", cat:"sac", place:1, emplacement:"sac", capacite:4, desc:"+4 places pour rapporter du butin" },
  randonnee:  { nom:"Sac de randonnée", pl:"Sacs de randonnée", g:"m", icone:"🏕️", cat:"sac", place:2, emplacement:"sac", capacite:6, desc:"+6 places pour rapporter du butin" },
  // Confort : fonctionnent tant qu'ils sont au refuge
  couverture: { nom:"Couverture", pl:"Couvertures", g:"f", icone:"🧣", cat:"confort", place:1, chaleur:true, desc:"Nuits supportables" },
  radio:      { nom:"Radio", pl:"Radios", g:"f", icone:"📻", cat:"confort", place:1, radio:true, desc:"Révèle le danger des lieux" },
  peluche:    { nom:"Peluche d’Emma", pl:"Peluches", g:"f", icone:"🧸", cat:"confort", place:1, moral:2, desc:"Moral +2" },
  photo:      { nom:"Photo de famille", pl:"Photos de famille", g:"f", icone:"🖼️", cat:"confort", place:1, moral:1, desc:"Moral +1" },
  cartes:     { nom:"Jeu de cartes", pl:"Jeux de cartes", g:"m", icone:"🃏", cat:"confort", place:1, moral:1, desc:"Moral +1" },
  // Matériaux
  planche:    { nom:"Planche", pl:"Planches", g:"f", icone:"🪵", cat:"materiau", place:1, empile:true, desc:"Pour construire le refuge" },
  epingle:    { nom:"Épingle à cheveux", pl:"Épingles à cheveux", g:"f", icone:"📍", cat:"materiau", place:0, empile:true, desc:"Pour crocheter une serrure (casse si on rate)" },
  pile:       { nom:"Pile", pl:"Piles", g:"f", icone:"🔋", cat:"materiau", place:1, empile:true, desc:"Alimente la lampe torche" },
  chiffon:    { nom:"Chiffon", pl:"Chiffons", g:"m", icone:"🧶", cat:"materiau", place:1, empile:true, desc:"Pour bandages, torches et sacs" },
  clous:      { nom:"Poignée de clous", pl:"Poignées de clous", g:"f", icone:"🔩", cat:"materiau", place:1, empile:true, desc:"Pour pièges et armes cloutées" },
  ferraille:  { nom:"Morceau de ferraille", pl:"Morceaux de ferraille", g:"m", icone:"⚙️", cat:"materiau", place:1, empile:true, desc:"Pour réparer et fabriquer" },
  poisson:    { nom:"Poisson", pl:"Poissons", g:"m", icone:"🐟", cat:"nour", place:1, empile:true, rations:2, desc:"2 rations de nourriture (pêché à l’étang)" },
  ruban:      { nom:"Rouleau d’adhésif", pl:"Rouleaux d’adhésif", g:"m", icone:"➰", cat:"materiau", place:1, empile:true, desc:"Pour réparer et assembler" },
  alcool:     { nom:"Bouteille d’alcool", pl:"Bouteilles d’alcool", g:"f", icone:"🍾", cat:"materiau", place:1, empile:true, desc:"Désinfecte, brûle bien" },
  // Objets qu'on ne trouve qu'en les fabriquant
  lance:      { nom:"Lance", pl:"Lances", g:"f", icone:"🔱", cat:"arme", place:2, emplacement:"arme", def:2, degats:[3,4], sol:10, desc:"Dégâts 3-4 · défense +2 (fabriquée)" },
  gourdin:    { nom:"Gourdin clouté", pl:"Gourdins cloutés", g:"m", icone:"🏑", cat:"arme", place:2, emplacement:"arme", def:3, degats:[4,5], sol:10, desc:"Dégâts 4-5 · défense +3 (fabriqué)" },
  torche:     { nom:"Torche", pl:"Torches", g:"f", icone:"🕯️", cat:"outil", place:1, emplacement:"outil", lumiere:1, sol:4, desc:"Lueur faible dans le noir, brûle 4 fouilles" },
  // Installations : travaillent chaque nuit au refuge, puis s'usent (sol = nombre de nuits)
  bache:      { nom:"Bâche de récupération", pl:"Bâches de récupération", g:"f", icone:"⛺", cat:"installation", place:2, sol:6, nuit:{ cat:"eau", rations:1, chance:0.7 }, desc:"Recueille la pluie : souvent +1 ration d’eau par nuit (6 nuits)" },
  collet:     { nom:"Collet", pl:"Collets", g:"m", icone:"🪢", cat:"installation", place:1, sol:5, nuit:{ cat:"nour", rations:2, chance:0.4 }, desc:"Attrape parfois du gibier : +2 rations de nourriture (5 nuits)" },
  poule:      { nom:"Poule", pl:"Poules", g:"f", icone:"🐔", cat:"animal", place:2, empile:true, desc:"Pond souvent un œuf la nuit (+1 ration), mais boit et attire les zombies" },
  piege:      { nom:"Piège à zombies", pl:"Pièges à zombies", g:"m", icone:"🪤", cat:"defense", place:2, empile:true, desc:"+3 de défense contre une attaque de nuit, puis cassé" }
};

/* ---------- Atelier : recettes ----------
   ingredients : ce qui est consommé ; besoin : objet qu'il faut posséder (non consommé).
   Chaque fabrication coûte BAL.energieCraft au membre le plus reposé. */
var RECETTES = [
  { id:"bandage", ingredients:{ chiffon:2 } },
  { id:"trousse", ingredients:{ bandage:2, alcool:1 } },
  { id:"torche",  ingredients:{ planche:1, chiffon:1, alcool:1 } },
  { id:"lance",   ingredients:{ planche:1, ferraille:1, ruban:1 } },
  { id:"gourdin", ingredients:{ planche:2, clous:2 }, besoin:"outils" },
  { id:"piege",   ingredients:{ planche:1, clous:1, ferraille:1 }, besoin:"outils" },
  { id:"sacoche", ingredients:{ chiffon:3, ruban:1 } },
  { id:"bache",   ingredients:{ chiffon:3, ruban:1, planche:1 } },
  { id:"collet",  ingredients:{ ferraille:1, ruban:1 } },
  { id:"canne",   ingredients:{ planche:1, ruban:1, clous:1 } }
];
var REPARATION = { ferraille:1, ruban:1 }; // coût d'une réparation d'arme

/* ---------- Atelier : démontage (objet -> matériaux récupérés) ---------- */
var DEMONTAGE = {
  couverture:{ chiffon:2 }, sacoche:{ chiffon:2 }, sacados:{ chiffon:3 }, randonnee:{ chiffon:4 },
  radio:{ ferraille:1, pile:1 }, lampe:{ ferraille:1 }, pdb:{ ferraille:2 },
  couteau:{ ferraille:1 }, batte:{ planche:1 }, barrefer:{ ferraille:2 }, hache:{ ferraille:1, planche:1 },
  machette:{ ferraille:1 }, lance:{ planche:1 }, gourdin:{ planche:1, clous:1 }
};

/* Ordre et titres des catégories dans l'écran du stock */
var CATEGORIES = [
  ["eau","Eau"],["nour","Nourriture"],["soin","Soins"],["energie","Énergie"],["arme","Armes"],["munition","Munitions"],
  ["outil","Outils et éclairage"],["sac","Sacs"],["voiture","Voiture"],["defense","Défense"],["animal","Animaux"],["installation","Installations"],["confort","Confort"],["materiau","Matériaux"]
];

/* ---------- Maisons de départ : ce qu'on peut mettre dans le sac ---------- */
var MAISONS = [
  { nom:"Pavillon", icone:"🏡", cap:10, objets:{ bidon:2, conserves:2, biscuits:2, trousse:1, antibio:1, couteau:1, couverture:2, lampe:1, pile:3, radio:1, peluche:1, photo:1, cartes:1, outils:1, briquet:1, sacados:1 } },
  { nom:"Ferme", icone:"🚜", cap:10, objets:{ riz:2, conserves:1, bidon:3, hache:1, batte:1, fusil:1, boiteCart:1, outils:1, pdb:1, couverture:2, briquet:1, trousse:1, peluche:1, photo:1, sacoche:1 } },
  { nom:"Appart", icone:"🏢", cap:8, objets:{ bidon:2, conserves:2, biscuits:3, trousse:1, antibio:2, couteau:1, couverture:1, lampe:1, pile:3, radio:1, cartes:1, photo:1, peluche:1, batte:1, sacados:1, canette:2 } }
];

/* ---------- La famille ---------- */
// trait : celui proposé par défaut (le joueur peut le changer au départ, et renommer chacun)
var FAMILLE = [
  { icone:"👨", nom:"Papa",  trait:"costaud" },
  { icone:"👩", nom:"Maman", trait:"soigneur" },
  { icone:"👦", nom:"Léo",   trait:"fouineur" },
  { icone:"👧", nom:"Emma",  trait:"agile" }
];
/* Traits de caractère : chacun a un atout ET un défaut (chiffres dans BAL.traits).
   Les recrues en reçoivent un au hasard. */
var TRAITS = {
  costaud:   { nom:"Costaud",       icone:"💪", plus:"frappe plus fort (+1 dégât au corps à corps, +1 de force)", moins:"gros appétit (−5 de faim de plus par jour)" },
  soigneur:  { nom:"Soigneur",      icone:"🩺", plus:"chaque soin rend 20 PV de plus (tant qu’il est en vie)", moins:"pacifiste (−1 dégât en combat)" },
  fouineur:  { nom:"Fouineur",      icone:"🔍", plus:"trouve 2 objets de plus en fouille", moins:"bruyant (+5 % de danger quand il sort)" },
  agile:     { nom:"Doigts de fée", icone:"🗝️", plus:"crochète mieux les serrures (zone verte plus large)", moins:"frêle (porte 1 objet de moins)" },
  endurant:  { nom:"Endurant",      icone:"🏃", plus:"les expéditions lui coûtent 10 ⚡ de moins", moins:"assoiffé (−5 de soif de plus par jour)" },
  tireur:    { nom:"Tireur",        icone:"🎯", plus:"vise juste (+2 dégâts avec une arme à feu)", moins:"nerveux (ses tirs attirent plus souvent un zombie)" },
  optimiste: { nom:"Optimiste",     icone:"😊", plus:"moral +2 chaque nuit (tant qu’il est en vie)", moins:"rêveur (1 objet de moins en fouille)" }
};

/* ---------- Lieux à fouiller ----------
   butin : la VRAIE liste des objets présents (rien ne repousse).
   jour : le lieu n'apparaît qu'à partir de ce jour.
   distance : 1 près, 2 moyen, 3 loin (plus c'est loin, plus ça fatigue),
   4 et 5 : zones éloignées, seulement en voiture (voiture:true). */
var LIEUX = [
  { nom:"Maison voisine", icone:"🏠", danger:0.20, distance:1,
    butin:{ conserve:3, bouteille:3, biscuits:1, planche:4, bandage:1, couteau:1, couverture:1, sacoche:1, chiffon:3, clous:1, epingle:3 } },
  { nom:"Rue des pavillons", icone:"🏘️", danger:0.30, distance:1,
    butin:{ conserve:4, bouteille:4, pates:2, planche:6, bandage:2, pile:2, batte:1, sacados:1, cartes:1, chiffon:4, clous:2, alcool:1, ruban:1, canette:1, epingle:4 } },
  { nom:"Supermarché", icone:"🛒", sombre:true, danger:0.40, distance:2,
    butin:{ conserve:8, bouteille:8, pates:4, barre:4, biscuits:2, pile:3, planche:4, briquet:1, alcool:3, ruban:2, chiffon:2, canette:3 } },
  { nom:"Hôpital", icone:"🏥", sombre:true, danger:0.60, distance:2,
    butin:{ bandage:4, trousse:3, antibio:3, bouteille:3, barre:2, lampe:1, alcool:3, chiffon:4, epingle:2 } },
  { nom:"Quincaillerie", icone:"🔧", verrou:true, danger:0.35, distance:2,
    butin:{ planche:10, pile:4, hache:1, pdb:1, outils:1, barrefer:1, lampe:1, clous:5, ruban:3, ferraille:3 } },
  { nom:"Station-service", icone:"⛽", danger:0.45, distance:1, jour:2,
    butin:{ jerrican:2, canette:2, barre:4, bouteille:4, chiffon:2, biscuits:2 } },
  // L'étang : on y pêche avec une canne. Les poissons se reproduisent lentement... tant qu'il en reste assez
  { nom:"Étang", icone:"🎣", danger:0.25, distance:2, jour:4, peche:true,
    butin:{ canne:1, bouteille:2, ferraille:2, chiffon:1 } },
  { nom:"Garage auto", icone:"🛠️", verrou:true, danger:0.40, distance:2, jour:3,
    butin:{ batterie:1, roue:1, jerrican:1, ferraille:4, ruban:2, chiffon:2, pile:2 } },
  { nom:"Commissariat", icone:"🚓", sombre:true, verrou:true, danger:0.65, distance:2, jour:6,
    butin:{ pistolet:1, boiteBalles:3, trousse:1, lampe:1, pile:2, canette:1, bandage:2 } },
  { nom:"Zone industrielle", icone:"🏭", sombre:true, verrou:true, danger:0.55, distance:3, jour:4,
    butin:{ conserve:5, bouteille:4, planche:14, trousse:1, barrefer:1, randonnee:1, pile:2, machette:1, ferraille:8, clous:4, ruban:2, canette:1, courroie:1 } },
  { nom:"Centre commercial", icone:"🏬", sombre:true, danger:0.70, distance:3, jour:8,
    butin:{ conserve:10, bouteille:10, pates:5, barre:5, trousse:2, pile:4, planche:6, randonnee:1, batte:1, machette:1, radio:1, chiffon:5, ruban:3, alcool:2, ferraille:3, canette:3, fusil:1, boiteCart:2 } },
  // Zones éloignées : riches mais dangereuses, seulement en voiture
  { nom:"Village voisin", icone:"🏡", danger:0.50, distance:4, voiture:true,
    butin:{ epingle:3, conserve:12, bouteille:12, pates:6, riz:1, bandage:3, couverture:2, chiffon:4, planche:10, jerrican:1, canette:2, boiteBalles:1, sacados:1, poule:3 } },
  { nom:"Entrepôt logistique", icone:"📦", verrou:true, danger:0.60, distance:4, voiture:true,
    butin:{ bouteille:20, conserve:15, riz:3, planche:12, clous:6, ruban:4, pile:4, barre:6 } },
  { nom:"Base militaire", icone:"🪖", sombre:true, verrou:true, danger:0.85, distance:5, voiture:true,
    butin:{ ration:10, bouteille:8, trousse:4, antibio:2, fusil:1, pistolet:1, boiteBalles:4, boiteCart:3, jerrican:2, randonnee:1, barrefer:1, canette:2 } },
  // Lieux secrets : invisibles au début, découverts vers le jour indiqué (secret)
  { nom:"École Jules-Ferry", icone:"🏫", danger:0.35, distance:1, secret:10,
    indice:"Une flèche dessinée à la craie mène vers l’école : la cantine n’a peut-être pas été pillée.",
    butin:{ biscuits:3, barre:4, bouteille:4, conserve:3, chiffon:4, ruban:2, bandage:2, alcool:1, cartes:1 } },
  { nom:"Caserne des pompiers", icone:"🚒", verrou:true, danger:0.5, distance:2, secret:15,
    indice:"📻 Un message tourne en boucle : « Caserne nord… il reste du matériel… ». Puis plus rien.",
    butin:{ hache:1, trousse:3, bandage:3, bouteille:6, randonnee:1, ruban:2, ferraille:3, alcool:2, pile:2 } },
  { nom:"Péniche du canal", icone:"⛴️", danger:0.4, distance:2, secret:20,
    indice:"De la fumée au-dessus du canal : une péniche est amarrée, apparemment abandonnée.",
    butin:{ conserve:6, riz:1, bouteille:6, canne:1, couverture:1, chiffon:3, jerrican:1, poisson:3 } },
  { nom:"Camping des Pins", icone:"🏕️", danger:0.55, distance:3, secret:26,
    indice:"Une carte routière tombée d’une voiture : le camping des Pins est entouré au feutre rouge.",
    butin:{ conserves:2, bouteille:8, pates:4, sacados:1, briquet:1, couverture:2, canette:2, planche:6, collet:1 } },
  { nom:"Clinique vétérinaire", icone:"🐾", sombre:true, danger:0.6, distance:2, secret:32,
    indice:"Rex (ou un chien du quartier) revient avec un collier marqué « Clinique vétérinaire des Acacias ».",
    butin:{ antibio:3, bandage:4, trousse:2, alcool:3, chiffon:3, barre:3, ferraille:2 } },
  { nom:"Bunker du survivaliste", icone:"🛢️", sombre:true, verrou:true, danger:0.8, distance:4, voiture:true, secret:40,
    indice:"Sur un survivant mort, un carnet : « Mon bunker, route de la carrière. Réserves pour un an. »",
    butin:{ ration:12, bidon:3, trousse:3, boiteBalles:3, boiteCart:2, fusil:1, barrefer:1, canette:3, pile:4 } }
];
// Nombre de lieux avant l'ajout de l'étang (pour reprendre les anciennes sauvegardes)
var LIEUX_AVANT_ETANG = 13;

/* ---------- Missions urgentes ----------
   Arrivent la nuit (une à la fois), avec un délai en jours.
   livrer : objets à donner depuis le stock (bouton « Livrer ») ;
   aller : il faut revenir vivant d'un lieu donné avant la fin du délai. */
var MISSIONS = [
  { id:"medicament", titre:"La fièvre de Lucie", icone:"💊", delai:3,
    texte:"Chez les voisins, la petite Lucie brûle de fièvre. Son père supplie : un antibiotique ou une trousse de soins, vite.",
    livrer:[{ antibio:1 }, { trousse:1 }],
    recompense:{ planche:6, clous:2 }, moral:10, merci:"Lucie va mieux. Son père vous apporte des planches et des clous de son atelier.",
    echec:"Les volets des voisins sont restés fermés ce matin. Personne n’ose en parler.", moralEchec:-10 },
  { id:"convoi", titre:"Le convoi", icone:"🚚", delai:3,
    texte:"Un convoi de survivants passera bientôt. Ils réparent leurs camions et échangent 10 planches contre une trousse, 2 canettes et un jerrican.",
    livrer:[{ planche:10 }],
    recompense:{ trousse:1, canette:2, jerrican:1 }, moral:5, merci:"Le convoi repart en klaxonnant. Marché conclu !",
    echec:"Le convoi est passé sans s’arrêter.", moralEchec:0 },
  { id:"detresse", titre:"Appel de détresse", icone:"📻", delai:2,
    texte:"📻 Une voix à la radio : quelqu’un est coincé à LIEU, blessé. Il faut y aller (et revenir vivant) avant la fin du délai.",
    aller:true,
    recompense:{ conserve:4, bouteille:4, bandage:2 }, moral:10, merci:"Vous ramenez le survivant. Il partage ses réserves avant de partir rejoindre sa famille.",
    echec:"La radio ne grésille plus. Trop tard.", moralEchec:-8 }
];

/* ---------- Améliorations du refuge (coût en planches) ---------- */
var REFUGE = {
  barr: { icone:"🧱", nom:"Barricade", cout:5, coutParNiveau:4, max:3, desc:"Défense +2 la nuit par niveau (une attaque perdue en détruit un)" },
  eau:  { icone:"🪣", nom:"Récupérateur d’eau", cout:8, coutParNiveau:0, max:2, parJour:1, desc:"+1 ration d’eau par jour et par niveau" },
  pot:  { icone:"🥕", nom:"Potager", cout:10, coutParNiveau:0, max:2, parJour:1, desc:"+1 ration de nourriture par jour et par niveau" }
};

/* ---------- Marché de quartier (personnage non joueur) ----------
   Marco le brocanteur passe tous les 3 jours avec quelques offres de troc.
   Il prend des objets que vous avez et donne en échange un peu moins de
   valeur (c'est sa marge). Plus tard : de vrais joueurs, via un serveur. */
var MARCHE = {
  nom: "Marco le brocanteur", icone: "🧔",
  tousLes: 3,        // jours entre deux passages
  offres: 3,         // offres par passage
  marge: 0.8,        // il rend 80 % de la valeur donnée
  // Sa charrette : un stock LIMITÉ (sinon le jeu redeviendrait infini). Vide = il ne revient plus.
  stock: { bouteille:6, conserve:6, pates:3, bandage:4, trousse:2, pile:6, canette:3, jerrican:2, boiteBalles:2, boiteCart:2,
           planche:10, clous:6, ferraille:6, ruban:4, alcool:3, epingle:6, batterie:1, roue:1, courroie:1, poule:2, canne:1 }
};
// Valeur des objets pour le troc (1 = une planche)
var VALEURS = {
  bouteille:2, bidon:8, conserve:2, conserves:8, riz:12, biscuits:4, pates:3, barre:1, ration:4,
  bandage:3, trousse:6, antibio:5, canette:4, planche:1, pile:2, chiffon:1, clous:1, ferraille:2,
  ruban:2, alcool:2, epingle:1, jerrican:8, boiteBalles:6, boiteCart:6, balle:1, cartouche:1.5,
  batterie:10, roue:10, courroie:8, piege:4, poisson:2, poule:6, canne:5
};

/* ---------- Chapitres ----------
   Des paliers qui guident le joueur, avec une récompense. Le jeu ne s'arrête
   jamais : après le dernier chapitre, « Tenir bon » revient tous les 10 jours
   (récompense : du moral seulement, sinon le jeu redeviendrait infini).
   test : fonction qui dit si l'objectif est atteint (G = la partie en cours). */
// Récits de « Tenir bon » (un nouveau tous les 10 jours, puis ils reviennent)
var RECITS_TENIR = [
  "Les réserves du quartier sont presque épuisées. Chaque jour gagné est une victoire : la famille s’organise et se relaie pour les gardes.",
  "Le monde d’avant semble loin. Le soir, Léo raconte des histoires de super-héros à Emma, et pendant un moment, on oublie les grattements dehors.",
  "Les zombies sont plus nombreux, plus affamés. Papa compte les planches, Maman compte les rations. Personne ne parle de partir.",
  "Une fumée au loin, peut-être d’autres survivants. Peut-être pas. Ici, au moins, c’est chez vous.",
  "L’hiver approche, ou peut-être pas : on ne compte plus les saisons, seulement les jours. Et vous êtes encore là."
];
var CHAPITRES = [
  { titre:"Premiers pas", objectif:"Fouiller 3 lieux différents",
    recit:"Il y a trois jours, la radio s’est tue. Puis les sirènes. Dans la rue, les voisins ne sont plus vraiment des voisins. Papa a calé la porte avec la commode : il va falloir sortir chercher de quoi tenir.",
    test:function(){ return Object.keys(G.stats.lieux).length >= 3; }, progres:function(){ return [Object.keys(G.stats.lieux).length, 3, "lieux fouillés"]; },
    recompense:{ canette:1 }, moral:5, texte:"Le quartier n’a plus de secrets pour vous. Un voisin vous laisse une canette." },
  { titre:"Le refuge", objectif:"Construire la barricade (niveau 1)",
    recit:"Les premières sorties ont appris une chose à la famille : la nuit, ils viennent gratter aux fenêtres. Le salon doit devenir un vrai refuge.",
    test:function(){ return G.ref.barr >= 1; }, progres:function(){ return [Math.min(1, G.ref.barr), 1, "niveau de barricade"]; },
    recompense:{ piege:1 }, moral:5, texte:"La porte tient. Léo bricole un piège avec les restes." },
  { titre:"Bricoleurs", objectif:"Fabriquer 2 objets à l’atelier",
    recit:"La porte tient. Mais les armes s’usent et les bandages manquent. Maman ressort la boîte à couture, Léo démonte tout ce qui traîne : il est temps d’apprendre à fabriquer.",
    test:function(){ return G.stats.fabriques >= 2; }, progres:function(){ return [Math.min(2, G.stats.fabriques), 2, "objets fabriqués"]; },
    recompense:{ ferraille:2, ruban:2 }, moral:5, texte:"La famille prend le coup de main. Des matériaux en plus pour la suite." },
  { titre:"Sur la route", objectif:"Réparer la voiture",
    recit:"Le quartier se vide. Dans le garage du voisin, un vieux break dort sous une bâche. Avec une batterie, une roue et une courroie, il pourrait encore rouler.",
    test:function(){ return voitureReparee(); }, progres:function(){ return [VOITURE.pieces.filter(function(p){ return G.voiture.installees[p]; }).length, VOITURE.pieces.length, "pièces installées"]; },
    recompense:{ jerrican:1 }, moral:10, texte:"Le moteur ronronne. Un jerrican oublié dans le coffre !" },
  { titre:"Au-delà du quartier", objectif:"Revenir vivant d’une zone éloignée",
    recit:"Le moteur tousse, puis ronronne. Emma colle son nez à la vitre : au-delà du quartier, il reste peut-être des réserves… et d’autres survivants.",
    test:function(){ return G.stats.eloignes >= 1; }, progres:function(){ return [Math.min(1, G.stats.eloignes), 1, "retour de zone éloignée"]; },
    recompense:{ boiteBalles:1, trousse:1 }, moral:10, texte:"Le monde est plus grand que la rue. Et plus dangereux." }
];
var TENIR_TOUS_LES = 10; // après les chapitres : « Tenir bon jusqu'au jour N », N de 10 en 10

/* ---------- Événements à dilemmes (le matin) ----------
   Chaque choix est une fonction qui modifie le jeu et renvoie le texte du résultat. */
var EVENEMENTS = [
  { titre:"🚪 Un survivant blessé", texte:"Un inconnu frappe à la porte, il saigne. Il supplie qu’on le soigne.", choix:[
    ["Le soigner (−1 objet de soin)", function(){
      var s = retirerSoin(); if(!s) return "Vous n’avez rien pour le soigner. Il repart en titubant.";
      ajouter("conserve", 2);
      return "Vous utilisez " + nommer(s, 1) + ". Il guérit et vous laisse 2 boîtes de conserve avant de repartir. 🥫"; }],
    ["Le chasser", function(){ changerMoral(-10); return "Vous fermez la porte. Ses cris résonnent longtemps. Moral −10."; }]
  ]},
  { titre:"🧔 Un marchand louche", texte:"Il propose une trousse de soins et 2 bandages contre 6 rations de nourriture. Son sac est trop lourd pour être honnête.", choix:[
    ["Accepter", function(){
      if(rations("nour") < 6) return "Vous n’avez pas assez de nourriture, il s’en va.";
      prendreRations("nour", 6); ajouter("trousse", 1); ajouter("bandage", 2);
      return "Marché conclu : −6 rations de nourriture, +1 trousse de soins, +2 bandages. ⛑️"; }],
    ["Refuser", function(){ return "Il hausse les épaules et disparaît dans la nuit."; }]
  ]},
  { titre:"🧸 Cauchemars", si:function(){ var e = parRole("Emma"); return e && e.al; }, texte:function(){ return parRole("Emma").nom + " n’arrive pas à dormir et réclame une part en plus."; }, choix:[
    ["Lui donner une ration (−1 nourriture)", function(){
      if(rations("nour") < 1) return "Il ne reste rien à donner.";
      prendreRations("nour", 1); changerMoral(10); return "Elle s’endort enfin. Moral +10."; }],
    ["La rassurer sans rien donner", function(){ changerMoral(-6); return "Elle pleure longtemps. Moral −6."; }]
  ]},
  { titre:"💧 Voisins assoiffés", texte:"Une famille voisine demande de l’eau. Ils ont l’air épuisés.", choix:[
    ["Donner 4 rations d’eau", function(){
      if(rations("eau") < 4) return "Vous n’avez pas assez d’eau.";
      prendreRations("eau", 4); changerMoral(8); return "Ils vous remercient. Moral +8."; }],
    ["Refuser", function(){ return "Ils repartent sans un mot."; }],
    ["Les piller", function(){
      ajouter("conserve", 2); changerMoral(-15);
      var n = [], v = vivants();
      if(hasard() < 0.4) blesser(v[R(0, v.length-1)], R(15, 30), n, "tué en pillant des voisins");
      return "Vous prenez 2 boîtes de conserve. Moral −15." + (n.length ? " " + n.map(function(a){ return a[1]; }).join(" ") : ""); }]
  ]},
  // ----- Nouveaux événements -----
  // si : condition pour que l'événement puisse arriver ; prep : prépare (ex. choisit un membre)
  // texte peut être une fonction (pour citer un nom). Le premier choix est le choix « prudent ».
  { titre:"🚪 On frappe à la porte", si:function(){ return vivants().length < FAMILLE.length; },
    prep:function(){ var r = RECRUES[aleaR("recrue", 0, RECRUES.length - 1)]; G.evCible = r.nom; G.evIcone = r.icone; },
    texte:function(){ var f = FEMININS.indexOf(G.evCible) >= 0; return '<span class="evportrait">' + iconeMembre({ nom:G.evCible, icone:G.evIcone, al:true, hp:100, en:100, faim:100, soif:100 }) + '</span>' + G.evCible + " frappe à la porte. " + (f ? "Elle" : "Il") + " a perdu les siens et demande à rester avec vous. Une bouche de plus à nourrir… mais aussi une paire de bras."; }, choix:[
    ["L’accueillir dans la famille", function(){ recruter(G.evCible, G.evIcone); changerMoral(10); return G.evCible + " pose son sac. La famille s’agrandit ! Moral +10."; }],
    ["Lui donner 2 rations, puis refermer", function(){ var e = FEMININS.indexOf(G.evCible) >= 0 ? "Elle" : "Il"; if(rations("nour") < 2) return "Vous n’avez rien à lui donner. " + e + " repart dans la nuit."; prendreRations("nour", 2); changerMoral(3); return e + " vous remercie et s’en va. Moral +3."; }],
    ["Refuser", function(){ changerMoral(-6); return "Vous fermez la porte. Moral −6."; }]
  ]},
  { titre:"🌧️ L’orage", texte:"Une pluie violente s’abat sur le quartier toute la nuit.", choix:[
    ["Sortir des récipients", function(){
      G.reste.eau += 5; var x = vivants()[R(0, vivants().length - 1)], n = [];
      if(!possede(function(o){ return o.chaleur; })){ blesser(x, 10, n, "mort de froid sous l’orage"); return "+5 rations d’eau. Mais " + x.nom + " a pris froid (−10 PV)." + (n.length ? " " + n[0][1] : ""); }
      return "+5 rations d’eau de pluie. 💧"; }],
    ["Rester à l’abri", function(){ return "Vous écoutez la pluie tomber. Rien ne se passe."; }]
  ]},
  { titre:"🏴 Des pillards", si:function(){ return G.day >= 6; },
    texte:function(){ return "Trois pillards armés exigent un tribut : 6 rations de nourriture, sinon ils attaquent. (Votre défense de nuit : " + defenseNuit() + ")"; }, choix:[
    ["Payer le tribut", function(){ var p = prendreRations("nour", 6); changerMoral(-5); return "Vous donnez " + p + " rations. Ils repartent en ricanant. Moral −5."; }],
    ["Se battre", function(){
      var force = 3 + Math.floor(G.day / 4) + R(0, 2), df = defenseNuit(), n = [];
      if(df >= force){ ajouter("conserve", 2); ajouter("boiteBalles", 1); changerMoral(10); return "Vous repoussez les pillards (force " + force + " contre " + df + ") ! Ils abandonnent 2 boîtes de conserve et une boîte de balles. Moral +10."; }
      var v = vivants(), x = v[R(0, v.length - 1)]; blesser(x, R(20, 35), n, "tué par des pillards"); prendreRations("nour", 4);
      return "Les pillards sont trop forts (force " + force + " contre " + df + "). " + x.nom + " est blessé et ils emportent 4 rations." + (n.length ? " " + n[0][1] : ""); }],
    ["Négocier (si le moral est bon)", function(){
      if(G.moral >= 50 && hasard() < 0.6){ prendreRations("nour", 2); return "Votre calme les impressionne : ils se contentent de 2 rations."; }
      var p = prendreRations("nour", 8); changerMoral(-10); return "La négociation tourne mal : ils prennent " + p + " rations. Moral −10."; }]
  ]},
  { titre:"🤒 La fièvre",
    prep:function(){ var v = vivants(); G.evCible = v[R(0, v.length - 1)].nom; },
    texte:function(){ return G.evCible + " a de la fièvre et tremble sous la couverture."; }, choix:[
    ["Utiliser un soin", function(){ var s = retirerSoin(); if(!s){ var x = membre(G.evCible); if(x) x.en = 0; return "Vous n’avez aucun soin. " + G.evCible + " doit se reposer : pas de sortie aujourd’hui."; } return "Vous utilisez " + nommer(s, 1) + ". La fièvre tombe dans la matinée."; }],
    ["Le laisser se reposer", function(){
      var x = membre(G.evCible), n = []; if(!x || !x.al) return "Trop tard…";
      x.en = 0; blesser(x, 10, n, "emporté par la fièvre");
      return x.nom + " reste couché toute la journée (énergie à 0, −10 PV)." + (n.length ? " " + n[0][1] : ""); }]
  ]},
  { titre:"🐕 Un chien errant", si:function(){ return !G.chien; }, texte:"Un gros chien maigre rôde devant le refuge. Il a l’air affamé mais pas méchant.", choix:[
    ["Le nourrir (−2 rations)", function(){ if(rations("nour") < 2) return "Vous n’avez rien à lui donner. Il finit par partir."; prendreRations("nour", 2); G.chien = { nom:"Rex", faim:0 }; changerMoral(10); return "Il ne vous quitte plus ! Les enfants l’appellent Rex. Il montera la garde la nuit (défense +1), mais il mangera une ration chaque soir. Moral +10."; }],
    ["Le chasser", function(){ return "Il s’éloigne en boitant."; }]
  ]},
  { titre:"📻 Un message radio", si:function(){ return possede(function(o){ return o.radio; }); },
    texte:"La radio grésille : « Largage de vivres au parc, ce matin seulement. » Un piège ?", choix:[
    ["Ignorer le message", function(){ return "Vous éteignez la radio. Mieux vaut ne pas tenter le diable."; }],
    ["Envoyer le plus reposé", function(){
      var x = vivants().slice().sort(function(a, b){ return b.en - a.en; })[0], n = [];
      x.en = Math.max(0, x.en - 30);
      if(hasard() < 0.5){ ajouter("trousse", 1); ajouter("conserve", 3); return x.nom + " revient avec une trousse de soins et 3 boîtes de conserve ! (−30 ⚡)"; }
      blesser(x, R(15, 30), n, "tombé dans un piège au parc"); return "C’était un piège : " + x.nom + " s’enfuit blessé (−30 ⚡)." + (n.length ? " " + n[0][1] : ""); }]
  ]},
  { titre:"🚙 Une voiture accidentée", texte:"Une voiture renversée bloque la rue. Le coffre est entrouvert.", choix:[
    ["La laisser", function(){ return "Vous contournez l’épave."; }],
    ["La fouiller", function(){
      var v = vivants(), x = v[R(0, v.length - 1)], n = [], r = hasard(), gain;
      if(r < 0.35){ ajouter("jerrican", 1); gain = "un jerrican d’essence"; } else if(r < 0.6){ ajouter("ferraille", 2); ajouter("ruban", 1); gain = "2 morceaux de ferraille et un rouleau d’adhésif"; } else { ajouter("bouteille", 2); gain = "2 bouteilles d’eau"; }
      if(hasard() < 0.3){ blesser(x, R(10, 20), n, "coupé par la tôle d’une épave"); return "Vous trouvez " + gain + ", mais " + x.nom + " se coupe sur la tôle." + (n.length ? " " + n[0][1] : ""); }
      return "Vous trouvez " + gain + " !"; }]
  ]},
  { titre:"👵 La vieille voisine", texte:"Mme Roux, 80 ans, refuse de quitter sa maison. Elle demande un médicament pour son cœur.", choix:[
    ["Lui donner un soin", function(){ var s = retirerSoin(); if(!s) return "Vous n’avez rien à lui donner. Elle vous bénit quand même."; ajouter("conserve", 3); ajouter("alcool", 1); changerMoral(8); return "Elle vous donne la clé de sa cave : 3 boîtes de conserve et une bouteille d’alcool ! Moral +8."; }],
    ["Refuser poliment", function(){ changerMoral(-8); return "Elle referme sa porte sans un mot. Moral −8."; }]
  ]},
  { titre:"🔥 Incendie", texte:"Un incendie se propage au bout de la rue. Le vent souffle vers le refuge.", choix:[
    ["Arroser les murs (−4 eau)", function(){ if(rations("eau") < 4){ return incendie(); } prendreRations("eau", 4); return "Vous arrosez tout. Le feu passe à côté. 💧 −4 rations d’eau."; }],
    ["Prier pour que le vent tourne", function(){ return hasard() < 0.5 ? "Le vent tourne. Ouf." : incendie(); }]
  ]},
  { titre:"🍽️ Dispute à table", si:function(){ return ["Papa","Maman"].every(function(n){ var x = parRole(n); return x && x.al; }); }, texte:function(){ return parRole("Papa").nom + " et " + parRole("Maman").nom + " se disputent : faut-il se rationner ou garder des forces ?"; }, choix:[
    ["Se rationner aujourd’hui", function(){ G.reste.nour += 2; changerMoral(-8); return "Tout le monde mange un peu moins : +2 rations économisées. Moral −8."; }],
    ["Repas de fête (−4 rations)", function(){ if(rations("nour") < 4) return "Il n’y a pas de quoi faire la fête…"; prendreRations("nour", 4); changerMoral(15); return "Un vrai repas, des rires. Moral +15."; }]
  ]},
  { titre:"🧟 Une horde au loin", si:function(){ return G.day >= 10; }, texte:"Une horde immense passe à deux rues d’ici. Le sol tremble.", choix:[
    ["Se cacher toute la journée", function(){ vivants().forEach(function(x){ x.en = Math.min(x.en, 0); }); return "Personne ne sort aujourd’hui. La horde passe sans vous voir."; }],
    ["Sortir quand même (danger accru)", function(){ G.hordeJour = G.day; return "Vous restez sur vos gardes : les lieux seront bien plus dangereux aujourd’hui (+20 %)."; }]
  ]},
  { titre:"🔐 Un coffre-fort", si:function(){ return possede(function(o){ return o.ouvre; }); }, texte:"Dans la cave d’à côté, un vieux coffre-fort. Avec vos outils, il faudrait des heures.", choix:[
    ["Le forcer (−30 ⚡ au plus reposé)", function(){
      var x = artisan(); if(!x || x.en < 30) return "Personne n’a assez d’énergie aujourd’hui.";
      x.en -= 30; var r = hasard();
      if(r < 0.4){ ajouter("boiteBalles", 1); ajouter("trousse", 1); return x.nom + " ouvre le coffre : une boîte de balles et une trousse de soins !"; }
      if(r < 0.8){ ajouter("canette", 2); ajouter("pile", 2); return x.nom + " ouvre le coffre : 2 canettes et 2 piles."; }
      return x.nom + " ouvre le coffre… vide. Quelqu’un est passé avant vous."; }],
    ["Laisser tomber", function(){ return "Vous laissez le coffre à d’autres."; }]
  ]},
  { titre:"🐔 Une poule égarée", si:function(){ return G.day >= 3; }, texte:"Une poule picore devant la porte. Elle pourrait pondre... mais il faudra lui donner à boire, et ses caquètements s’entendent de loin.", choix:[
    ["La laisser partir", function(){ return "Elle s’éloigne en caquetant."; }],
    ["La garder", function(){ ajouter("poule", 1); return "Vous avez une poule ! Elle pondra souvent la nuit, mais boit de l’eau et attire un peu les zombies. 🐔"; }],
    ["La manger tout de suite", function(){ G.reste.nour += BAL.poules.viande; return "Ce soir, c’est poulet : +" + BAL.poules.viande + " rations de nourriture."; }]
  ]}
];
var RECRUES = [ { nom:"Sam", icone:"🧑" }, { nom:"Nora", icone:"👩‍🦱" }, { nom:"Inès", icone:"👱‍♀️" }, { nom:"Yanis", icone:"🧔" } ];

/* ---------- Astuces de première partie ----------
   Chacune s'affiche une seule fois, au bon moment (bulle en haut de l'écran). */
var ASTUCES = {
  pieces:     "👉 La maison a plusieurs pièces : glisse le doigt sur la pièce (ou touche les flèches ◀ ▶ en haut) pour aller à la réserve, à l’atelier, au garage et dans la cour.",
  depart:     "⏱ Vite ! Touche les objets pour les mettre dans le sac. Tout servira : de l’eau et à manger d’abord, puis de quoi se défendre et s’éclairer.",
  famille:    "👨‍👩‍👧‍👦 Voici ta famille. Touche 1 ou 2 membres, puis 🔍 Fouiller pour les envoyer chercher des objets. Raccourci : les objets de la pièce sont cliquables (porte, table, canapé…).",
  equipement: "🗡️ Sous chaque membre, 3 cases : arme, outil (lampe, boîte à outils…) et sac. Une case orange avec un « + » : un objet t’attend au stock, touche-la pour l’équiper.",
  lieux:      "🗺️ Chaque lieu contient une vraie liste d’objets qui ne revient jamais. Lieu sombre : prends une lampe. Porte verrouillée : une boîte à outils.",
  combat:     "⚔️ Pour chacun : Frapper ou Se protéger. Touche un zombie pour le viser. 🤖 Auto joue le combat à ta place.",
  dormir:     "🌙 Plus personne n’a assez d’énergie : appuie sur Dormir (ou touche le canapé). Chacun mange et boit une ration (touche ＋ sur une carte pour boire ou manger en plus)… et la nuit, ils peuvent attaquer.",
  score:      "⭐ Ton score : 1 point par jour et par membre en vie. Garde toute la famille en vie le plus longtemps possible !",
  atelier:    "🛠️ Le refuge : construis des défenses, fabrique (soins, armes, bâche pour l’eau de pluie…), répare et démonte. Et plus tard, répare la voiture.",
  peche:      "🎣 L’étang : équipe une canne à pêche (case outil) pour pêcher. Ne le vide pas : sous 4 poissons, ils ne se reproduisent plus.",
  mission:    "🎯 Une mission ! Elle a un délai : touche le bouton 🎯 en bas de l’écran pour la voir et livrer ce qu’il faut. Réussir rapporte des objets et du moral.",
  serrure:    "🗝️ Appuie quand le curseur rouge passe dans la zone verte. Chaque raté casse une épingle."
};
