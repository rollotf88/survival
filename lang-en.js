/* =====================================================================
   lang-en.js : la traduction anglaise (2026-11-14, en cours).
   TRADUCTIONS.en : texte français exact → texte anglais. Garder les {n} et les balises (<b>…</b>) telles quelles.
   Chargé juste après data.js (voir langue.js pour le principe).
   ===================================================================== */
Object.assign(TRADUCTIONS.en, {
  // Titre et écran d'histoire
  "Le dernier refuge": "The Last Refuge",
  "Le monde d’après": "The world after",
  "Personne n’a compris ce qui se passait. En une semaine, les villes se sont tues : les morts se relèvent, et ils ont faim.":
    "Nobody understood what was happening. Within a week, the cities fell silent: the dead are rising, and they are hungry.",
  "Ta famille a tenu bon dans votre maison… jusqu’à ce soir. <b>Ils sont à la porte.</b> Tu as une minute pour remplir le sac avant de fuir vers le refuge : une vieille maison au bout de la rue, avec une cheminée et des murs solides.":
    "Your family held out at home… until tonight. <b>They are at the door.</b> You have one minute to pack the bag before fleeing to the refuge: an old house at the end of the street, with a fireplace and solid walls.",
  "Là-bas, il faudra fouiller le quartier, barricader, soigner les tiens. Personne ne viendra vous sauver. Le seul but : <b>tenir le plus longtemps possible, tous ensemble.</b>":
    "There, you will have to scavenge the neighborhood, barricade, and care for your loved ones. Nobody is coming to save you. The only goal: <b>hold out as long as possible, all together.</b>",
  "Une famille de 4": "A family of 4",
  "Plus de 20 lieux": "Over 20 places",
  "Clans et guerres": "Clans and wars",
  "Événements uniques": "Unique events",
  "Fuir vers le refuge": "Flee to the refuge",
  // Menu
  "Langue": "Language",
  // Écran du sac et guide
  "{n} places": "{n} slots",
  "(départ)": "(start)"
});

/* ---------- Données du jeu (2026-11-14) ----------
   Les noms français restent les identifiants internes : un lieu ou une maison traduits gardent leur nom français
   dans .cle (les tables d'images et d'icônes sont rangées par nom français). traduireTables("data") est appelé ici
   (tables de data.js), traduireTables("ui") juste après la définition des tables de ui.js. */
var DONNEES_EN = {
  objets: {
    bidon:["Water jug","Water jugs","8 water rations"], bouteille:["Water bottle","Water bottles","2 water rations"],
    conserves:["Pack of canned food","Packs of canned food","8 food rations"], riz:["Bag of rice","Bags of rice","12 food rations"],
    biscuits:["Pack of biscuits","Packs of biscuits","4 food rations"], conserve:["Can of food","Cans of food","2 food rations"],
    pates:["Pack of pasta","Packs of pasta","3 food rations"], ration:["Military ration","Military rations","4 food rations"],
    barre:["Cereal bar","Cereal bars","1 food ration"],
    canette:["Energy drink","Energy drinks","+40 ⚡ and +20 thirst right away, but you sleep badly the next night"],
    bandage:["Bandage","Bandages","Heals 30 HP"], trousse:["First aid kit","First aid kits","Heals 60 HP"], antibio:["Box of antibiotics","Boxes of antibiotics","Heals 40 HP"],
    couteau:["Knife","Knives","Damage 2-3 · defense +1"], batte:["Bat","Bats","Damage 3-4 · defense +2"],
    barrefer:["Iron bar","Iron bars","Damage 3-5 · defense +2, very sturdy"], hache:["Axe","Axes","Damage 4-6 · defense +3"],
    machette:["Machete","Machetes","Damage 4-5 · defense +3, light"], pistolet:["Pistol","Pistols","Damage 6-9 · 1 bullet per shot, noisy"],
    fusil:["Hunting rifle","Hunting rifles","Damage 9-14 · 1 shell per shot, very noisy"],
    cocktail:["Molotov cocktail","Molotov cocktails","Thrown in combat (with a lighter in the family): burns every zombie. Stays in the stockpile, takes no equipment slot"],
    balle:["Bullet","Bullets","Pistol ammo"], cartouche:["Shell","Shells","Hunting rifle ammo"],
    boiteBalles:["Box of bullets","Boxes of bullets","6 pistol bullets"], boiteCart:["Box of shells","Boxes of shells","4 rifle shells"],
    batterie:["Car battery","Car batteries","Car part"], roue:["Wheel","Wheels","Car part"], courroie:["Fan belt","Fan belts","Car part"],
    jerrican:["Jerry can of gas","Jerry cans of gas","10 liters of gas for the car"],
    lampe:["Flashlight","Flashlights","Lights up dark places (1 battery per search)"],
    briquet:["Lighter","Lighters","Faint light in the dark, lets you light the fireplace"],
    outils:["Toolbox","Toolboxes","Opens locked doors without a sound"],
    siphon:["Siphon kit","Siphon kits","A hose and a pump bulb to siphon gas from abandoned cars on the way home (wears out: 8 uses)"],
    canne:["Fishing rod","Fishing rods","For fishing at the pond (wears out with each trip, 8 times)"],
    gilet:["Bulletproof vest","Bulletproof vests","Clan wars: removes 2 damage from each hit taken during an assault (3 assaults)"],
    casque:["Makeshift helmet","Makeshift helmets","Clan wars: mines and explosions hurt half as much (3 assaults)"],
    bouclier:["Riot shield","Riot shields","Clan wars: “Defend” lets only 40% of the damage through instead of half (4 assaults)"],
    pdb:["Crowbar","Crowbars","Opens locked doors"],
    sacoche:["Satchel","Satchels","+2 slots to bring back loot"], sacados:["Backpack","Backpacks","+4 slots to bring back loot"],
    randonnee:["Hiking pack","Hiking packs","+6 slots to bring back loot"],
    couverture:["Blanket","Blankets","Keeps 2 people warm at night (without a fire)"], radio:["Radio","Radios","Reveals how dangerous places are"],
    peluche:["Emma’s teddy bear","Teddy bears","Morale +2"], photo:["Family photo","Family photos","Morale +1"], cartes:["Deck of cards","Decks of cards","Morale +1"],
    planche:["Plank","Planks","To build up the refuge"], epingle:["Hairpin","Hairpins","To pick a lock (breaks if you miss)"],
    pile:["Battery","Batteries","Powers the flashlight"], chiffon:["Rag","Rags","For bandages, torches and bags"],
    clous:["Handful of nails","Handfuls of nails","For traps and nailed weapons"], ferraille:["Scrap metal","Pieces of scrap metal","To repair and craft"],
    epices:["Spices","Spices","Salt, pepper and herbs: they lift a dish (cooking)"], huile:["Bottle of oil","Bottles of oil","For frying and cooking (cooking)"],
    farine:["Bag of flour","Bags of flour","For flatbreads and pies (cooking)"], champignons:["Mushrooms","Mushrooms","Picked in the forest: for the stew (cooking)"],
    baies:["Wild berries","Wild berries","Picked in the forest: for the pie (cooking)"], herbes:["Fresh herbs","Fresh herbs","Thyme, parsley… (vegetable garden, village): for the fish (cooking)"],
    soupe:["Pasta soup","Pasta soups","+45 hunger and morale +2 (keeps 3 nights)"], poissonHerbes:["Herb fish","Herb fish","+45 hunger and +10 HP (keeps 3 nights)"],
    ragout:["Forest stew","Forest stews","+50 hunger and +10 ⚡ (keeps 3 nights)"], galettes:["Flatbreads","Flatbreads","+35 hunger (keep 8 nights)"],
    rizSaute:["Fried rice","Fried rice","+40 hunger (keeps 3 nights)"], tarte:["Berry pie","Berry pies","+35 hunger and morale +4: a real feast (keeps 3 nights)"],
    poisson:["Fish","Fish","2 food rations (caught at the pond)"], ruban:["Roll of duct tape","Rolls of duct tape","To repair and assemble"],
    alcool:["Bottle of alcohol","Bottles of alcohol","Disinfects, burns well"], lance:["Spear","Spears","Damage 3-4 · defense +2 (crafted)"],
    gourdin:["Nail club","Nail clubs","Damage 4-5 · defense +3 (crafted)"], torche:["Torch","Torches","Faint light in the dark, burns for 4 searches"],
    bache:["Salvaged tarp","Salvaged tarps","Collects rain: often +1 water ration per night (6 nights)"],
    collet:["Snare","Snares","Sometimes catches game: +2 food rations (5 nights)"],
    poule:["Chicken","Chickens","Often lays an egg at night (+1 ration), but drinks and attracts zombies"],
    piege:["Zombie trap","Zombie traps","+3 defense against one night attack, then broken"]
  },
  court: { epices:"Spices", huile:"Oil", farine:"Flour", champignons:"Mushrooms", baies:"Berries", herbes:"Herbs", soupe:"Soup", poissonHerbes:"Fish",
    ragout:"Stew", galettes:"Flatbreads", rizSaute:"Fried rice", tarte:"Pie", eau:"Water", clous:"Nails", ruban:"Tape", chiffon:"Rag", ferraille:"Scrap",
    alcool:"Alcohol", epingle:"Hairpins", jerrican:"Jerry can", bouteille:"Water", conserve:"Can", batterie:"Battery", courroie:"Belt", bidon:"Water",
    conserves:"Cans", biscuits:"Biscuits", trousse:"First aid", antibio:"Antibiotics", couverture:"Blanket", lampe:"Flashlight", peluche:"Teddy", photo:"Photo",
    cartes:"Cards", outils:"Tools", sacados:"Backpack", riz:"Rice", fusil:"Rifle", boiteCart:"Shells", pdb:"Crowbar", canette:"Energy drink", sacoche:"Satchel" },
  zombies: {
    rodeur:["Walker","Slow and clumsy, but it never gives up."], coureur:["Runner","Fragile but fast: it strikes twice per turn."],
    costaud:["Brute","Huge: it crushes your guard (only −25%) and rarely backs off when shoved."],
    rampant:["Crawler","It drags itself along the ground unseen: it strikes before everyone else."],
    hurleur:["Screamer","Every other turn, it screams and calls another zombie. Take it down first!"],
    gonfle:["Bloater","When it dies, it explodes and hurts the whole team (half as much for those defending)."],
    soldat:["Soldier","Its vest removes 3 damage from each hit. Aim for the head: armor doesn’t protect it."],
    defenseur:["Defender","A survivor from another clan defending their stronghold. Ramparts make them tougher."],
    mariee:["The Bride","Famous zombie: in her torn dress, she runs faster than anyone and strikes twice."],
    pompier:["The Firefighter","Famous zombie: his helmet and jacket stop blows (armor 2), and he crushes your guard. Aim for the head!"],
    boucher:["The Butcher","Famous zombie: he hits harder than all the others. Better to defend or shove him back."],
    colosse:["Colossus","The monster on the apartment block’s roof: huge, it crushes your guard and soaks up a lot of damage. Aim for the head!"],
    pilleur:["Looter","It doesn’t bite: it snatches 2 items from your loot, then runs off the next turn. Take it down (or shove it back) first: you get everything back."],
    couveuse:["Brooder","It doesn’t bite, but every other turn a Crawler crawls out of its belly (3 at most). Target it first; fire hurts it twice as much."],
    brule:["Burnt One","Fire does nothing to it, and hitting it in melee burns you (−2 HP). Better use a firearm."],
    gorille:["Gorilla","A zoo gorilla turned zombie: it hits two people at once and almost never backs off. Only found at the zoo."]
  },
  traits: {
    costaud:["Strong","hits harder (+1 melee damage, +1 strength)","big appetite (−5 more hunger per day)"],
    soigneur:["Healer","every heal gives 20 more HP (while alive)","pacifist (−1 damage in combat)"],
    fouineur:["Scavenger","finds 2 more items when searching","noisy (+5% danger on trips)"],
    agile:["Nimble fingers","better at picking locks (wider green zone)","frail (carries 1 fewer item)"],
    endurant:["Tireless","trips cost 10 ⚡ less","thirsty (−5 more thirst per day)"],
    tireur:["Marksman","good aim (+2 damage with a firearm)","jumpy (shots attract a zombie more often)"],
    cuisinier:["Cook","each cooked dish gives 1 extra portion","not a fighter (−1 damage in combat)"],
    optimiste:["Optimist","morale +2 every night (while alive)","daydreamer (1 fewer item when searching)"]
  },
  lieux: {
    "Maison voisine":["Neighbor’s house"], "Rue des pavillons":["Suburban street"], "Supermarché":["Supermarket"], "Hôpital":["Hospital"],
    "Quincaillerie":["Hardware store"], "Station-service":["Gas station"], "Étang":["Pond"], "Garage auto":["Auto repair shop"],
    "Commissariat":["Police station"], "Zone industrielle":["Industrial park"], "Centre commercial":["Shopping mall"], "Village voisin":["Nearby village"],
    "Entrepôt logistique":["Distribution warehouse"], "Base militaire":["Military base"],
    "École Jules-Ferry":["Jules Ferry School","An arrow drawn in chalk points to the school: the cafeteria may not have been looted."],
    "Caserne des pompiers":["Fire station","📻 A message plays on a loop: “North fire station… there’s still gear…”. Then nothing."],
    "Péniche du canal":["Canal barge","Smoke above the canal: a barge is moored there, apparently abandoned."],
    "Camping des Pins":["Pine Tree Campground","A road map dropped from a car: the Pine Tree Campground is circled in red marker."],
    "Clinique vétérinaire":["Veterinary clinic","Rex (or a neighborhood dog) comes back wearing a collar marked “Acacia Veterinary Clinic”."],
    "Bunker du survivaliste":["Survivalist’s bunker","On a dead survivor, a notebook: “My bunker, quarry road. Supplies for a year.”"],
    "Forêt":["Forest"],
    "Zoo abandonné":["Abandoned zoo","📻 A tired voice on the radio: “At the zoo, the keepers’ supplies are untouched… but something prowls between the enclosures.”"],
    "Aéroport":["Airport","An airliner flew very low over the city before landing in the distance. Nobody came out of it."],
    "Prison":["Prison","Gunshots at night, over by the prison. Then nothing. The guards’ armory may still be full."],
    "Centrale électrique":["Power plant","On an engineer’s map, the power plant is circled: “spare parts, warehouse B”. They say cocoons line its basements."]
  },
  maisons: { "Pavillon":"House", "Ferme":"Farm", "Appart":"Apartment" },
  famille: { "Papa":"Dad", "Maman":"Mom", "Léo":"Léo", "Emma":"Emma" },
  saisons: {
    automne:["Autumn","Autumn settles in: the rain fills the water collector.","rain: +1 water ration per night with a collector"],
    hiver:["Winter","Winter is coming: the pond freezes, the garden sleeps, and the fire becomes vital.","cold: a blanket only keeps one person warm, the fire burns one plank per night, +3 hunger per day, the pond is frozen, the garden gives nothing"],
    printemps:["Spring","Spring is back: the garden grows again and morale picks up.","the garden gives twice as much, +1 morale per night"],
    ete:["Summer","Summer crushes everything: the heat makes you thirsty.","+3 thirst per day"]
  },
  titres: {
    veteran:["Veteran","+1 damage in combat"], tueur:["Zombie slayer","+1 more damage (+2 in total)"], eclaireur:["Scout","each trip costs them 5 ⚡ less"],
    passepartout:["Lockpicker","wider green zone when picking locks"], bricoleur:["Handyman","workshop jobs cost them 5 ⚡ less"],
    chef:["Chef","+1 portion per cooked dish (for the whole family)"], durACuire:["Tough nut","−1 damage on every zombie hit taken"]
  },
  categories: { eau:"Water", nour:"Food", soin:"Healing", energie:"Energy", arme:"Weapons", munition:"Ammo", outil:"Tools and light", sac:"Bags",
    voiture:"Car", defense:"Defense", animal:"Animals", installation:"Installations", confort:"Comfort", materiau:"Materials", ingredient:"Ingredients (cooking)",
    plat:"Cooked dishes", guerre:"War gear" },
  famillesStock: { tout:"All", vivres:"Supplies", soins:"Healing", combat:"Combat", outils:"Tools", materiaux:"Materials", divers:"Misc." }
};
function traduireTables(quoi){
  if(LANGUE !== "en") return;
  var D = DONNEES_EN, k;
  if(quoi === "data"){
    for(k in D.objets) if(OBJETS[k]){ OBJETS[k].nom = D.objets[k][0]; OBJETS[k].pl = D.objets[k][1]; OBJETS[k].desc = D.objets[k][2]; }
    ZOMBIES.forEach(function(z){ var e = D.zombies[z.id]; if(e){ z.nom = e[0]; z.desc = e[1]; } });
    for(k in D.traits) if(TRAITS[k]){ TRAITS[k].nom = D.traits[k][0]; TRAITS[k].plus = D.traits[k][1]; TRAITS[k].moins = D.traits[k][2]; }
    LIEUX.forEach(function(L){ var e = D.lieux[L.nom]; if(!e) return; L.cle = L.nom; L.nom = e[0]; if(e[1]) L.indice = e[1]; });
    MAISONS.forEach(function(M){ if(D.maisons[M.nom]){ M.cle = M.nom; M.nom = D.maisons[M.nom]; } });
    SAISONS.forEach(function(S){ var e = D.saisons[S.id]; if(e){ S.nom = e[0]; S.annonce = e[1]; S.effet = e[2]; } });
    TITRES.forEach(function(T){ var e = D.titres[T.id]; if(e){ T.nom = e[0]; T.effet = e[1]; } });
    CATEGORIES.forEach(function(c){ if(D.categories[c[0]]) c[1] = D.categories[c[0]]; });
  }
  if(quoi === "ui"){
    for(k in D.court) NOM_COURT[k] = D.court[k];
    FAMILLES_STOCK.forEach(function(f){ if(D.famillesStock[f[0]]) f[2] = D.famillesStock[f[0]]; });
  }
}
traduireTables("data");
// Prénom par défaut d'un membre de la famille (le rôle interne reste « Papa », « Maman »…)
function prenomDefaut(r){ return LANGUE === "en" && DONNEES_EN.famille[r] ? DONNEES_EN.famille[r] : r; }
