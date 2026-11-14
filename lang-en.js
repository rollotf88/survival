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

/* ---------- Événements du matin (2026-11-14) ---------- */
Object.assign(TRADUCTIONS.en, {
  "Résultat": "Outcome", "Continuer": "Continue",
  // Un survivant blessé
  "🚪 Un survivant blessé": "🚪 A wounded survivor",
  "Un inconnu frappe à la porte, il saigne. Il supplie qu’on le soigne.": "A stranger knocks at the door, bleeding. He begs you to treat him.",
  "Le soigner (−1 objet de soin)": "Treat him (−1 healing item)",
  "Vous n’avez rien pour le soigner. Il repart en titubant.": "You have nothing to treat him with. He staggers away.",
  "Vous utilisez {soin}. Il guérit et vous laisse 2 boîtes de conserve avant de repartir. 🥫": "You use {soin}. He recovers and leaves you 2 cans of food before heading off. 🥫",
  "Le chasser": "Send away",
  "Vous fermez la porte. Ses cris résonnent longtemps. Moral −10.": "You close the door. His cries echo for a long time. Morale −10.",
  // Marchand louche
  "🧔 Un marchand louche": "🧔 A shady trader",
  "Il propose une trousse de soins et 2 bandages contre 6 rations de nourriture. Son sac est trop lourd pour être honnête.": "He offers a first aid kit and 2 bandages for 6 food rations. His bag is too heavy to be honest.",
  "Accepter": "Accept", "Refuser": "Refuse",
  "Vous n’avez pas assez de nourriture, il s’en va.": "You don’t have enough food, so he leaves.",
  "Marché conclu : −6 rations de nourriture, +1 trousse de soins, +2 bandages. ⛑️": "Deal: −6 food rations, +1 first aid kit, +2 bandages. ⛑️",
  "Il hausse les épaules et disparaît dans la nuit.": "He shrugs and disappears into the night.",
  // Cauchemars
  "🧸 Cauchemars": "🧸 Nightmares",
  "{nom} n’arrive pas à dormir et réclame une part en plus.": "{nom} can’t sleep and asks for an extra portion.",
  "Lui donner une ration (−1 nourriture)": "Give her a ration (−1 food)",
  "Il ne reste rien à donner.": "There’s nothing left to give.",
  "Elle s’endort enfin. Moral +10.": "She finally falls asleep. Morale +10.",
  "La rassurer sans rien donner": "Comfort her without giving anything",
  "Elle pleure longtemps. Moral −6.": "She cries for a long time. Morale −6.",
  // Voisins assoiffés
  "💧 Voisins assoiffés": "💧 Thirsty neighbors",
  "Une famille voisine demande de l’eau. Ils ont l’air épuisés.": "A neighboring family asks for water. They look exhausted.",
  "Donner 4 rations d’eau": "Give 4 water rations",
  "Vous n’avez pas assez d’eau.": "You don’t have enough water.",
  "Ils vous remercient. Moral +8.": "They thank you. Morale +8.",
  "Ils repartent sans un mot.": "They leave without a word.",
  "Les piller": "Rob them",
  "Vous prenez 2 boîtes de conserve. Moral −15.": "You take 2 cans of food. Morale −15.",
  // On frappe à la porte
  "🚪 On frappe à la porte": "🚪 A knock at the door",
  "{nom} frappe à la porte. Elle a perdu les siens et demande à rester avec vous. Une bouche de plus à nourrir… mais aussi une paire de bras.": "{nom} knocks at the door. She has lost her family and asks to stay with you. One more mouth to feed… but also another pair of hands.",
  "{nom} frappe à la porte. Il a perdu les siens et demande à rester avec vous. Une bouche de plus à nourrir… mais aussi une paire de bras.": "{nom} knocks at the door. He has lost his family and asks to stay with you. One more mouth to feed… but also another pair of hands.",
  "L’accueillir dans la famille": "Welcome them into the family",
  "{nom} pose son sac. La famille s’agrandit ! Moral +10.": "{nom} puts down their bag. The family grows! Morale +10.",
  "Lui donner 2 rations, puis refermer": "Give them 2 rations, then close the door",
  "Vous n’avez rien à lui donner. Elle repart dans la nuit.": "You have nothing to give her. She heads back into the night.",
  "Vous n’avez rien à lui donner. Il repart dans la nuit.": "You have nothing to give him. He heads back into the night.",
  "Elle vous remercie et s’en va. Moral +3.": "She thanks you and leaves. Morale +3.",
  "Il vous remercie et s’en va. Moral +3.": "He thanks you and leaves. Morale +3.",
  "Vous fermez la porte. Moral −6.": "You close the door. Morale −6.",
  // L'orage
  "🌧️ L’orage": "🌧️ The storm",
  "Une pluie violente s’abat sur le quartier toute la nuit.": "Violent rain pounds the neighborhood all night.",
  "Sortir des récipients": "Put out containers",
  "+5 rations d’eau. Mais {nom} a pris froid (−10 PV).": "+5 water rations. But {nom} caught a chill (−10 HP).",
  "+5 rations d’eau de pluie. 💧": "+5 rations of rainwater. 💧",
  "Rester à l’abri": "Stay under cover",
  "Vous écoutez la pluie tomber. Rien ne se passe.": "You listen to the rain. Nothing happens.",
  // Des pillards
  "🏴 Des pillards": "🏴 Raiders",
  "Trois pillards armés exigent un tribut : 6 rations de nourriture, sinon ils attaquent. (Votre défense de nuit : {d})": "Three armed raiders demand a tribute: 6 food rations, or they attack. (Your night defense: {d})",
  "Payer le tribut": "Pay the tribute",
  "Vous donnez {n} rations. Ils repartent en ricanant. Moral −5.": "You hand over {n} rations. They leave sneering. Morale −5.",
  "Se battre": "Fight",
  "Vous repoussez les pillards (force {f} contre {d}) ! Ils abandonnent 2 boîtes de conserve et une boîte de balles. Moral +10.": "You drive off the raiders (strength {f} against {d})! They leave behind 2 cans of food and a box of bullets. Morale +10.",
  "Les pillards sont trop forts (force {f} contre {d}). {nom} est blessé et ils emportent 4 rations.": "The raiders are too strong (strength {f} against {d}). {nom} is wounded and they take 4 rations.",
  "Négocier (si le moral est bon)": "Negotiate (if morale is good)",
  "Votre calme les impressionne : ils se contentent de 2 rations.": "Your calm impresses them: they settle for 2 rations.",
  "La négociation tourne mal : ils prennent {n} rations. Moral −10.": "The talks go badly: they take {n} rations. Morale −10.",
  // La fièvre
  "🤒 La fièvre": "🤒 Fever",
  "{nom} a de la fièvre et tremble sous la couverture.": "{nom} has a fever and shivers under the blanket.",
  "Utiliser un soin": "Use a healing item",
  "Vous n’avez aucun soin. {nom} doit se reposer : pas de sortie aujourd’hui.": "You have no healing items. {nom} has to rest: no trips today.",
  "Vous utilisez {soin}. La fièvre tombe dans la matinée.": "You use {soin}. The fever breaks during the morning.",
  "Le laisser se reposer": "Let them rest",
  "Trop tard…": "Too late…",
  "{nom} reste couché toute la journée (énergie à 0, −10 PV).": "{nom} stays in bed all day (energy at 0, −10 HP).",
  // Chien errant
  "🐕 Un chien errant": "🐕 A stray dog",
  "Un gros chien maigre rôde devant le refuge. Il a l’air affamé mais pas méchant.": "A big, skinny dog prowls outside the refuge. It looks hungry but not mean.",
  "Le nourrir (−2 rations)": "Feed it (−2 rations)",
  "Vous n’avez rien à lui donner. Il finit par partir.": "You have nothing to give it. It eventually wanders off.",
  "Il ne vous quitte plus ! Les enfants l’appellent Rex. Il montera la garde la nuit (défense +1), mais il mangera une ration chaque soir. Moral +10.": "It won’t leave your side! The kids call it Rex. It will stand guard at night (defense +1), but it will eat a ration every evening. Morale +10.",
  "Il s’éloigne en boitant.": "It limps away.",
  // Message radio
  "📻 Un message radio": "📻 A radio message",
  "La radio grésille : « Largage de vivres au parc, ce matin seulement. » Un piège ?": "The radio crackles: “Supply drop at the park, this morning only.” A trap?",
  "Ignorer le message": "Ignore the message",
  "Vous éteignez la radio. Mieux vaut ne pas tenter le diable.": "You switch off the radio. Better not to tempt fate.",
  "Envoyer le plus reposé": "Send the most rested",
  "{nom} revient avec une trousse de soins et 3 boîtes de conserve ! (−30 ⚡)": "{nom} comes back with a first aid kit and 3 cans of food! (−30 ⚡)",
  "C’était un piège : {nom} s’enfuit blessé (−30 ⚡).": "It was a trap: {nom} escapes, wounded (−30 ⚡).",
  // Voiture accidentée
  "🚙 Une voiture accidentée": "🚙 A wrecked car",
  "Une voiture renversée bloque la rue. Le coffre est entrouvert.": "An overturned car blocks the street. The trunk is ajar.",
  "La laisser": "Leave it", "La fouiller": "Search it",
  "Vous contournez l’épave.": "You walk around the wreck.",
  "un jerrican d’essence": "a jerry can of gas",
  "2 morceaux de ferraille et un rouleau d’adhésif": "2 pieces of scrap metal and a roll of duct tape",
  "2 bouteilles d’eau": "2 water bottles",
  "Vous trouvez {gain}, mais {nom} se coupe sur la tôle.": "You find {gain}, but {nom} gets cut on the sheet metal.",
  "Vous trouvez {gain} !": "You find {gain}!",
  // Vieille voisine
  "👵 La vieille voisine": "👵 The old neighbor",
  "Mme Roux, 80 ans, refuse de quitter sa maison. Elle demande un médicament pour son cœur.": "Mrs. Roux, 80, refuses to leave her house. She asks for medicine for her heart.",
  "Lui donner un soin": "Give her a healing item",
  "Vous n’avez rien à lui donner. Elle vous bénit quand même.": "You have nothing to give her. She blesses you anyway.",
  "Elle vous donne la clé de sa cave : 3 boîtes de conserve et une bouteille d’alcool ! Moral +8.": "She gives you the key to her cellar: 3 cans of food and a bottle of alcohol! Morale +8.",
  "Refuser poliment": "Politely refuse",
  "Elle referme sa porte sans un mot. Moral −8.": "She closes her door without a word. Morale −8.",
  // Incendie
  "🔥 Incendie": "🔥 Fire",
  "Un incendie se propage au bout de la rue. Le vent souffle vers le refuge.": "A fire is spreading at the end of the street. The wind is blowing toward the refuge.",
  "Arroser les murs (−4 eau)": "Hose down the walls (−4 water)",
  "Vous arrosez tout. Le feu passe à côté. 💧 −4 rations d’eau.": "You soak everything. The fire passes you by. 💧 −4 water rations.",
  "Prier pour que le vent tourne": "Pray for the wind to change",
  "Le vent tourne. Ouf.": "The wind changes. Phew.",
  // Dispute à table
  "🍽️ Dispute à table": "🍽️ An argument at dinner",
  "{a} et {b} se disputent : faut-il se rationner ou garder des forces ?": "{a} and {b} are arguing: should you ration food or keep up your strength?",
  "Se rationner aujourd’hui": "Ration food today",
  "Tout le monde mange un peu moins : +2 rations économisées. Moral −8.": "Everyone eats a little less: +2 rations saved. Morale −8.",
  "Repas de fête (−4 rations)": "Feast (−4 rations)",
  "Il n’y a pas de quoi faire la fête…": "There’s not enough for a feast…",
  "Un vrai repas, des rires. Moral +15.": "A real meal, and laughter. Morale +15.",
  // Horde au loin
  "🧟 Une horde au loin": "🧟 A distant horde",
  "Une horde immense passe à deux rues d’ici. Le sol tremble.": "A huge horde passes two streets away. The ground shakes.",
  "Se cacher toute la journée": "Hide all day",
  "Personne ne sort aujourd’hui. La horde passe sans vous voir.": "Nobody goes out today. The horde passes without seeing you.",
  "Sortir quand même (danger accru)": "Go out anyway (more danger)",
  "Vous restez sur vos gardes : les lieux seront bien plus dangereux aujourd’hui (+20 %).": "You stay on guard: places will be much more dangerous today (+20%).",
  // Coffre-fort
  "🔐 Un coffre-fort": "🔐 A safe",
  "Dans la cave d’à côté, un vieux coffre-fort. Avec vos outils, il faudrait des heures.": "In the cellar next door, an old safe. With your tools, it would take hours.",
  "Le forcer (−30 ⚡ au plus reposé)": "Crack it (−30 ⚡ for the most rested)",
  "Personne n’a assez d’énergie aujourd’hui.": "Nobody has enough energy today.",
  "{nom} ouvre le coffre : une boîte de balles et une trousse de soins !": "{nom} opens the safe: a box of bullets and a first aid kit!",
  "{nom} ouvre le coffre : 2 canettes et 2 piles.": "{nom} opens the safe: 2 energy drinks and 2 batteries.",
  "{nom} ouvre le coffre… vide. Quelqu’un est passé avant vous.": "{nom} opens the safe… empty. Someone got here first.",
  "Laisser tomber": "Forget it",
  "Vous laissez le coffre à d’autres.": "You leave the safe to someone else.",
  // Poule égarée
  "🐔 Une poule égarée": "🐔 A stray chicken",
  "Une poule picore devant la porte. Elle pourrait pondre... mais il faudra lui donner à boire, et ses caquètements s’entendent de loin.": "A chicken pecks around outside the door. It could lay eggs… but it will need water, and its clucking carries a long way.",
  "La laisser partir": "Let it go", "La garder": "Keep it", "La manger tout de suite": "Eat it right away",
  "Elle s’éloigne en caquetant.": "It wanders off clucking.",
  "Vous avez une poule ! Elle pondra souvent la nuit, mais boit de l’eau et attire un peu les zombies. 🐔": "You have a chicken! It will often lay at night, but it drinks water and attracts zombies a little. 🐔",
  "Ce soir, c’est poulet : +{n} rations de nourriture.": "Chicken for dinner tonight: +{n} food rations.",
  // Épidémie
  "🦠 Une épidémie dans le quartier": "🦠 An epidemic in the neighborhood",
  "Des voisins toussent à s’en déchirer la gorge. Une maladie se propage de maison en maison. Il faudrait désinfecter le refuge… ou croiser les doigts.": "Neighbors are coughing their throats raw. A sickness is spreading from house to house. You should disinfect the refuge… or cross your fingers.",
  "Désinfecter le refuge (1 alcool ou 1 objet de soin)": "Disinfect the refuge (1 alcohol or 1 healing item)",
  "Vous frottez chaque recoin à l’alcool. La maladie passe à côté de vous. 🧴": "You scrub every corner with alcohol. The sickness passes you by. 🧴",
  "Faute d’alcool, vous utilisez {soin} pour désinfecter. La maladie passe à côté de vous.": "With no alcohol, you use {soin} to disinfect. The sickness passes you by.",
  "Vous n’avez rien pour désinfecter. {nom} tombe malade (−15 PV).": "You have nothing to disinfect with. {nom} falls ill (−15 HP).",
  "Croiser les doigts": "Cross your fingers",
  "La toux s’éloigne. Vous avez eu de la chance.": "The coughing fades away. You got lucky.",
  "La maladie entre au refuge : {noms} tombent malades (−20 PV).": "The sickness gets into the refuge: {noms} fall ill (−20 HP).",
  "La maladie entre au refuge : {noms} tombe malade (−20 PV).": "The sickness gets into the refuge: {noms} falls ill (−20 HP).",
  // Convoi militaire
  "🎖️ Un convoi militaire": "🎖️ A military convoy",
  "Des camions kaki s’arrêtent devant le refuge. Un officier fatigué descend : « Réquisition. Vos vivres serviront à tenir la ligne. » Ses soldats ont l’air aussi affamés que vous.": "Khaki trucks stop outside the refuge. A tired officer climbs down: “Requisition. Your supplies will help hold the line.” His soldiers look as hungry as you.",
  "Donner 2 rations d’eau et 2 de nourriture": "Give 2 water rations and 2 food rations",
  "Vous donnez {e} rations d’eau et {f} de nourriture. L’officier salue et le convoi repart. Moral −3.": "You give {e} water rations and {f} food rations. The officer salutes and the convoy moves on. Morale −3.",
  "Échanger 6 planches contre des munitions": "Trade 6 planks for ammo",
  "Vous n’avez pas 6 planches. L’officier perd patience et ses soldats prennent {n} rations de nourriture.": "You don’t have 6 planks. The officer loses patience and his soldiers take {n} food rations.",
  "« Des planches ? On en manque pour les barricades. » Marché conclu : −6 planches, +1 boîte de balles, +1 boîte de cartouches.": "“Planks? We’re short of them for the barricades.” Deal: −6 planks, +1 box of bullets, +1 box of shells.",
  "Cacher vos réserves et faire les pauvres": "Hide your supplies and play poor",
  "Les soldats fouillent sans conviction et repartent bredouilles. Moral +5.": "The soldiers search half-heartedly and leave empty-handed. Morale +5.",
  "Ils trouvent la cachette. Furieux, ils emportent {n} rations de nourriture. Moral −10.": "They find the hiding place. Furious, they take {n} food rations. Morale −10.",
  // Tempête de neige
  "🌨️ La tempête de neige": "🌨️ The snowstorm",
  "Le vent hurle toute la nuit. La neige s’entasse contre les portes et le froid traverse les murs.": "The wind howls all night. Snow piles up against the doors and the cold seeps through the walls.",
  "Brûler 2 planches pour tenir": "Burn 2 planks to hold out",
  "Il n’y a pas assez de planches. Toute la famille grelotte (−15 ⚡, −5 PV chacun).": "There aren’t enough planks. The whole family shivers (−15 ⚡, −5 HP each).",
  "Le feu crépite toute la nuit. Serrés autour, vous racontez des histoires d’avant. −2 planches, moral +3.": "The fire crackles all night. Huddled around it, you tell stories from before. −2 planks, morale +3.",
  "Se serrer sous les couvertures": "Huddle under the blankets",
  "La nuit est longue et glacée : −15 ⚡ pour tout le monde, et ceux sans couverture perdent 8 PV.": "The night is long and freezing: −15 ⚡ for everyone, and those without a blanket lose 8 HP.",
  "La nuit est longue et glacée : −15 ⚡ pour tout le monde.": "The night is long and freezing: −15 ⚡ for everyone.",
  // Les Corbeaux
  "🏴 La bande des Corbeaux": "🏴 The Crows gang",
  "Une dizaine de pillards organisés encerclent le refuge, menés par un chef au manteau noir : « La moitié de vos vivres, et on vous laisse en paix pour l’hiver. » (Votre défense de nuit : {d})": "A dozen organized raiders surround the refuge, led by a boss in a black coat: “Half your supplies, and we’ll leave you in peace for the winter.” (Your night defense: {d})",
  "Payer (la moitié de la nourriture, 8 rations au plus)": "Pay (half your food, 8 rations at most)",
  "Vous leur donnez {n} rations. Le chef sourit. « Sage décision. » Moral −8.": "You give them {n} rations. The boss smiles. “Wise choice.” Morale −8.",
  "Leur offrir des munitions à la place": "Offer them ammo instead",
  "Vous n’avez pas de munitions à offrir. Vexés, ils prennent {n} rations. Moral −12.": "You have no ammo to offer. Offended, they take {n} rations. Morale −12.",
  "Le chef soupèse les munitions. « Ça ira. » Ils repartent sans toucher à vos vivres.": "The boss weighs the ammo in his hand. “That’ll do.” They leave without touching your supplies.",
  "Le chef soupèse la boîte. « Ça ira. » Ils repartent sans toucher à vos vivres.": "The boss weighs the box in his hand. “That’ll do.” They leave without touching your supplies.",
  "Les Corbeaux se brisent sur vos défenses (force {f} contre {d}) ! Dans leur fuite, ils abandonnent un lot de conserves, une trousse et une boîte de balles. Moral +15.": "The Crows break against your defenses (strength {f} against {d})! As they flee, they drop a pack of canned food, a first aid kit and a box of bullets. Morale +15.",
  "Ils sont trop nombreux (force {f} contre {d}). La barricade cède, il y a des blessés, et ils emportent {n} rations.": "There are too many of them (strength {f} against {d}). The barricade gives way, people are hurt, and they take {n} rations.",
  // L'éclaireur
  "👁️ L’éclaireur sur le toit": "👁️ The scout on the roof",
  "Depuis l’aube, un homme observe le refuge à la jumelle, couché sur un toit voisin. Un éclaireur… mais de quel groupe ?": "Since dawn, a man lying on a nearby roof has been watching the refuge through binoculars. A scout… but for which group?",
  "Rester discrets et barricader les fenêtres (−1 planche)": "Keep a low profile and board up the windows (−1 plank)",
  "Vous clouez une planche de plus. À midi, l’éclaireur a disparu.": "You nail up one more plank. By noon, the scout is gone.",
  "Sans planche à clouer, vous restez loin des fenêtres. À midi, l’éclaireur a disparu.": "With no plank to nail up, you stay away from the windows. By noon, the scout is gone.",
  "Lui faire signe de descendre": "Wave him down",
  "Il vous parle d’un endroit encore intact : 📍 {lieu}.": "He tells you about a place still untouched: 📍 {lieu}.",
  "Il descend, méfiant, puis partage de l’eau (+3 bouteilles).": "He comes down, wary, then shares some water (+3 bottles).",
  "Moral +5.": "Morale +5.",
  "Il fait un signe… à d’autres. Le temps de comprendre, des inconnus ont filé avec {n} rations de nourriture.": "He signals… to others. Before you realize it, strangers have run off with {n} food rations.",
  "Tenter de le capturer": "Try to capture him",
  "Vous le surprenez sur le toit. Il jure qu’il était seul et vous laisse son pistolet et 4 balles pour repartir libre. Moral −5.": "You catch him by surprise on the roof. He swears he was alone and gives you his pistol and 4 bullets to go free. Morale −5.",
  "{nom} glisse sur le toit en le poursuivant (−25 PV). L’éclaireur s’enfuit.": "{nom} slips on the roof while chasing him (−25 HP). The scout gets away.",
  // La meute
  "🐺 La meute": "🐺 The pack",
  "Des chiens retournés à l’état sauvage tournent autour du refuge, les côtes saillantes. Ils grattent à la porte de la réserve.": "Dogs gone feral circle the refuge, ribs showing. They scratch at the storeroom door.",
  "Leur jeter 3 rations pour qu’ils partent": "Throw them 3 rations so they leave",
  "Ils se battent pour la viande, puis disparaissent dans la nuit.": "They fight over the meat, then vanish into the night.",
  "Ce n’est pas assez : la meute force l’entrée et mord {nom} (−15 PV) avant de s’enfuir.": "It’s not enough: the pack forces its way in and bites {nom} (−15 HP) before running off.",
  "Les effrayer avec le feu (1 alcool + 1 chiffon)": "Scare them with fire (1 alcohol + 1 rag)",
  "Il vous manque de quoi faire une torche. Les chiens finissent par partir… avec {n} rations.": "You don’t have what you need for a torch. The dogs eventually leave… with {n} rations.",
  "La torche enflammée les fait détaler en couinant. La nuit redevient calme.": "The flaming torch sends them running off whimpering. The night is calm again.",
  "Les chasser à la hache et au bâton": "Drive them off with axes and sticks",
  "Après une lutte brutale, la meute s’enfuit en laissant deux bêtes derrière elle : +6 rations de viande. Moral −3.": "After a brutal fight, the pack flees, leaving two animals behind: +6 rations of meat. Morale −3.",
  "La meute est trop nombreuse : des morsures partout avant qu’elle ne s’enfuie.": "The pack is too big: bites everywhere before it runs off."
});

// Un seul objet, en anglais, quand « a / an » ne va pas (noms sans singulier)
var UN_EN = { epices:"some spices", champignons:"some mushrooms", baies:"some wild berries", herbes:"some fresh herbs", galettes:"some flatbreads",
  rizSaute:"some fried rice", poissonHerbes:"a herb fish", ferraille:"a piece of scrap metal", poisson:"a fish", clous:"a handful of nails" };

/* ---------- Rencontres en chemin (2026-11-14) ---------- */
Object.assign(TRADUCTIONS.en, {
  "Sur le chemin du retour": "On the way back",
  "🎲 Réussi ! ": "🎲 Success! ", "🎲 Raté… ": "🎲 Failed… ", "🎲 {p} % de chances": "🎲 {p}% chance",
  // La fillette
  "👧 Une petite fille en pleurs": "👧 A little girl in tears", "Chloé": "Chloé",
  "Assise sur un muret, une petite fille serre une peluche. « Mon papa est entré dans l’immeuble pour chercher à manger… il n’est jamais ressorti. »": "Sitting on a low wall, a little girl clutches a teddy bear. “My daddy went into the building to look for food… he never came out.”",
  "Lui donner à manger et lui indiquer un abri": "Give her food and point her to a shelter",
  "Elle dévore la boîte de conserve, puis file vers l’église où d’autres survivants se cachent. Elle se retourne pour vous faire un signe.": "She devours the can of food, then runs off toward the church where other survivors are hiding. She turns around to wave at you.",
  "Entrer dans l’immeuble chercher son père": "Go into the building to find her father",
  "Au deuxième étage, un homme est coincé derrière une porte bloquée. Vous le libérez. En pleurant, il vous donne ce qu’il avait trouvé.": "On the second floor, a man is trapped behind a jammed door. You free him. In tears, he gives you what he had found.",
  "L’immeuble grouille de zombies. Vous ressortez de justesse… sans le père.": "The building is crawling with zombies. You barely make it out… without the father.",
  "Passer votre chemin": "Keep walking",
  "Ses sanglots vous suivent longtemps dans la rue.": "Her sobs follow you down the street for a long time.",
  // Le soldat
  "🪖 Le soldat blessé": "🪖 The wounded soldier", "Le soldat": "The soldier",
  "Adossé à une voiture, un soldat se tient la jambe. Son pistolet est posé à côté de lui. « Doucement… J’ai pas de mauvaises intentions. J’ai juste besoin de soins. »": "Leaning against a car, a soldier holds his leg. His pistol lies beside him. “Easy… I don’t mean any harm. I just need some first aid.”",
  "Le soigner (1 objet de soin)": "Treat him (1 healing item)", "Aucun objet de soin": "No healing item",
  "Il serre les dents pendant le pansement. « Merci. Tenez, des munitions… et un conseil : j’ai repéré un endroit que personne n’a encore fouillé. »": "He grits his teeth while you dress the wound. “Thanks. Here, some ammo… and a tip: I spotted a place nobody has searched yet.”",
  "Lui prendre ses armes": "Take his weapons",
  "Il est trop faible pour résister. Vous repartez avec son pistolet… et ce regard que vous n’oublierez pas.": "He is too weak to resist. You leave with his pistol… and a look you will never forget.",
  "Il a encore la force de tirer. La balle vous frôle… pas tout à fait.": "He still has the strength to shoot. The bullet grazes you… not quite.",
  "Le laisser là": "Leave him there",
  "Vous vous éloignez. Derrière vous, il ne dit plus rien.": "You walk away. Behind you, he says nothing more.",
  // Barrage des pillards
  "🏴 Le barrage des pillards": "🏴 The raiders’ roadblock", "Chef des pillards": "Raider boss",
  "Une barricade de voitures bloque la rue. Trois hommes armés vous mettent en joue. « Ici, on paie le passage. À manger, ou ce que vous portez. »": "A barricade of cars blocks the street. Three armed men take aim at you. “You pay to pass here. Food, or whatever you’re carrying.”",
  "Payer avec de la nourriture (3 rations)": "Pay with food (3 rations)", "Pas assez de nourriture": "Not enough food",
  "Ils rient en fouillant vos sacs, puis vous laissent passer.": "They laugh as they go through your bags, then let you pass.",
  "Bluffer : « On est une vingtaine juste derrière »": "Bluff: “There are twenty of us right behind”",
  "Ils hésitent, se regardent… et décampent en abandonnant une partie de leur butin.": "They hesitate, look at each other… and run off, leaving part of their loot behind.",
  "« Mauvaise réponse. » Les coups pleuvent avant que vous puissiez fuir.": "“Wrong answer.” The blows rain down before you can run.",
  "Faire un long détour": "Take a long detour",
  "Le détour vous épuise, mais personne n’est blessé.": "The detour wears you out, but nobody gets hurt.",
  // Le prêcheur
  "📿 Le prêcheur de la fin": "📿 The doomsday preacher", "Le prêcheur": "The preacher",
  "Debout sur un banc, un homme en soutane déchirée harangue une rue vide. « Le jugement est venu ! Approchez, mes enfants… »": "Standing on a bench, a man in a torn cassock harangues an empty street. “Judgment has come! Come closer, my children…”",
  "L’éviter discrètement": "Quietly avoid him",
  "Vous passez de l’autre côté de la rue. Il continue de prêcher pour personne.": "You cross to the other side of the street. He keeps preaching to nobody.",
  "L’écouter un moment": "Listen to him for a while",
  "Sa voix est étrangement douce. Il parle d’espoir, de familles réunies…": "His voice is strangely gentle. He speaks of hope, of families reunited…",
  "« Il me reste quelques provisions bénies. Je les partage… contre un petit souvenir de votre vie d’avant. »": "“I have a few blessed provisions left. I’ll share them… for a little keepsake from your life before.”",
  "Le remercier et partir": "Thank him and leave",
  "Ses paroles vous ont fait du bien, sans que vous sachiez vraiment pourquoi.": "His words did you good, though you’re not quite sure why.",
  "Lui donner un objet de confort": "Give him a comfort item", "Aucun objet de confort": "No comfort item",
  "Il serre l’objet contre son cœur et vous tend un bidon d’eau et une ration militaire.": "He holds the item to his heart and hands you a water jug and a military ration.",
  // Mme Roux
  "👵 Mme Roux à sa fenêtre": "👵 Mrs. Roux at her window", "Mme Roux": "Mrs. Roux",
  "Au premier étage, une vieille dame vous fait signe. « Mon petit-fils a de la fièvre depuis trois jours. Vous n’auriez pas un médicament ? »": "From a first-floor window, an old lady waves at you. “My grandson has had a fever for three days. You wouldn’t have any medicine?”",
  "Lui expliquer que vous n’avez rien": "Explain that you have nothing",
  "Elle hoche la tête tristement et referme la fenêtre.": "She nods sadly and closes the window.",
  "Lui donner un antibiotique": "Give her an antibiotic", "Lui donner un objet de soin": "Give a healing item", "Pas d’antibiotique": "No antibiotics",
  "Elle descend un panier au bout d’une corde : de la farine, des herbes de son jardin et une couverture tricotée main.": "She lowers a basket on a rope: flour, herbs from her garden and a hand-knitted blanket.",
  "« Que Dieu vous garde. » Elle vous jette quelques herbes séchées.": "“God keep you.” She throws you some dried herbs.",
  // La boîte du marchand
  "🎁 La boîte du marchand": "🎁 The trader’s box", "Le marchand": "The trader",
  "Un homme au chapeau cabossé pousse un caddie. « Boîte mystère ! Trois rations de nourriture, et elle est à vous. Parfois c’est Noël… parfois non. »": "A man in a battered hat pushes a shopping cart. “Mystery box! Three food rations and it’s yours. Sometimes it’s Christmas… sometimes it isn’t.”",
  "« Tant pis pour vous ! » Il s’éloigne en sifflotant.": "“Your loss!” He walks off whistling.",
  "Acheter la boîte (3 rations)": "Buy the box (3 rations)",
  "C’est Noël : une trousse de secours, deux canettes et une boîte de cartouches !": "It’s Christmas: a first aid kit, two energy drinks and a box of shells!",
  "Des cailloux emballés dans du papier journal. Le marchand a déjà disparu.": "Stones wrapped in newspaper. The trader is already gone.",
  // Voix à la radio
  "📻 Une voix à la radio": "📻 A voice on the radio", "Voix inconnue": "Unknown voice",
  "Votre radio grésille : « …à tous les survivants… caisse de ravitaillement larguée près du château d’eau… je répète… »": "Your radio crackles: “…to all survivors… supply crate dropped near the water tower… I repeat…”",
  "Ne pas prendre le risque": "Don’t take the risk",
  "Le message tourne en boucle, puis s’éteint.": "The message loops, then goes silent.",
  "Aller jusqu’au château d’eau (−15 ⚡)": "Go to the water tower (−15 ⚡)",
  "La caisse est bien là, intacte : rations militaires, eau et munitions !": "The crate is really there, untouched: military rations, water and ammo!",
  "C’était un piège : la caisse est vide et des zombies attendaient autour.": "It was a trap: the crate is empty and zombies were waiting around it.",
  // L'enfant mordu
  "🩸 L’enfant mordu": "🩸 The bitten child", "Une mère": "A mother",
  "Une femme berce un garçon fiévreux. Une morsure suinte sur son bras. « Aidez-le, je vous en supplie… ce n’est peut-être qu’un chien… »": "A woman rocks a feverish boy. A bite is oozing on his arm. “Help him, I beg you… maybe it was just a dog…”",
  "Vous éloigner prudemment": "Back away carefully",
  "Ses supplications vous poursuivent jusqu’au coin de la rue.": "Her pleas follow you to the corner of the street.",
  "C’était bien un chien. La fièvre tombe pendant que vous le soignez. La mère vous donne tout ce qu’elle a.": "It really was a dog. The fever breaks while you treat him. The mother gives you everything she has.",
  "Ses yeux se voilent pendant le pansement. Il se jette sur vous.": "His eyes cloud over while you dress the wound. He lunges at you.",
  "Abréger ses souffrances": "End his suffering",
  "La mère hurle. Vous ne dormirez pas bien cette nuit.": "The mother screams. You won’t sleep well tonight.",
  // Le camp des survivants
  "⛺ Le camp des survivants": "⛺ The survivors’ camp", "Chef du camp": "Camp leader",
  "Derrière une palissade, une dizaine de survivants vous observent. Leur chef s’avance. « On commerce avec ceux qui ne cherchent pas d’ennuis. »": "Behind a fence, a dozen survivors watch you. Their leader steps forward. “We trade with people who aren’t looking for trouble.”",
  "Échanger 3 planches contre de l’eau": "Trade 3 planks for water", "Pas assez de planches": "Not enough planks",
  "Marché conclu. « Revenez quand vous voulez. »": "Deal. “Come back any time.”",
  "Demander si quelqu’un veut vous rejoindre": "Ask if anyone wants to join you", "La famille est au complet": "The family is full",
  "Un jeune homme s’avance. « Ici, on est trop nombreux. Je viens avec vous. »": "A young man steps forward. “There are too many of us here. I’ll come with you.”",
  "Repartir": "Move on",
  "Vous les saluez de loin et reprenez la route.": "You wave from a distance and get back on the road.",
  // Le chien piégé
  "🐕 Le chien piégé": "🐕 The trapped dog", "Un chien": "A dog",
  "Des gémissements sous une voiture : un chien, la patte coincée dans un collet rouillé.": "Whimpering under a car: a dog with its paw caught in a rusty snare.",
  "Le libérer": "Free it",
  "Il vous lèche la main, puis vous suit jusqu’au refuge en boitant. Il s’appelle peut-être Rex…": "It licks your hand, then limps after you all the way to the refuge. Maybe its name is Rex…",
  "Affolé, il vous mord avant de s’enfuir.": "Panicked, it bites you before running off.",
  "Le laisser": "Leave it",
  "Ses gémissements résonnent longtemps.": "Its whimpering echoes for a long time.",
  // Le gardien du zoo
  "🐅 Le gardien du zoo": "🐅 The zookeeper", "Le vieux gardien": "The old zookeeper",
  "Près de l’enclos vide des tigres, un vieil homme en uniforme délavé jette des graines aux pigeons. « Vous cherchez Raja ? Il est parti. C’est moi qui le nourrissais à travers les barreaux… »": "Near the empty tiger enclosure, an old man in a faded uniform throws seeds to the pigeons. “Looking for Raja? He’s gone. I used to feed him through the bars…”",
  "Écouter son histoire": "Listen to his story",
  "Il s’assoit sur un banc et sourit pour la première fois depuis longtemps.": "He sits down on a bench and smiles for the first time in a long while.",
  "Partager un repas avec lui (2 rations)": "Share a meal with him (2 rations)",
  "Il mange lentement, puis vous tend la trousse de la clinique du zoo. « Prenez. Moi, je n’en ai plus besoin. »": "He eats slowly, then hands you the first aid kit from the zoo clinic. “Take it. I don’t need it anymore.”",
  "« Un soir, Raja a brisé sa cage. Il ne m’a pas attaqué : il est parti vers la ville, comme s’il cherchait quelqu’un. On dit qu’il ne suit que les plus grands survivants… ceux qu’on appelle les Légendes. »": "“One night, Raja broke out of his cage. He didn’t attack me: he headed for the city, as if he were looking for someone. They say he only follows the greatest survivors… the ones they call Legends.”",
  "Le remercier": "Thank him",
  "« Survivez assez longtemps, et peut-être qu’il viendra à vous. » Vous repartez le cœur plus léger.": "“Survive long enough, and maybe he’ll come to you.” You leave with a lighter heart.",
  "Lui proposer de venir au refuge": "Invite him to the refuge",
  "Il secoue la tête. « Ma place est ici, avec mes bêtes. » Il vous donne un lot de conserves de la réserve des soigneurs.": "He shakes his head. “My place is here, with my animals.” He gives you a pack of canned food from the keepers’ stores.",
  // Le détenu
  "⛓️ Le détenu oublié": "⛓️ The forgotten prisoner", "Le détenu": "The prisoner",
  "Au fond d’un couloir, une main maigre sort d’entre les barreaux. « Ils sont partis sans ouvrir ma cellule… Ça fait des semaines. Par pitié. »": "At the end of a corridor, a thin hand reaches out between the bars. “They left without opening my cell… It’s been weeks. Please.”",
  "Lui glisser de l’eau et partir": "Slip him some water and leave",
  "Il boit d’un trait. « La clé de l’armurerie est sous le bureau du gardien-chef. » Vous y trouvez une boîte de balles.": "He drinks it in one go. “The armory key is under the chief guard’s desk.” You find a box of bullets there.",
  "Ouvrir la cellule": "Open the cell",
  "Il pleure en sortant. « Je vous dois la vie. » Il vous mène à l’armurerie des gardiens avant de disparaître.": "He weeps as he steps out. “I owe you my life.” He leads you to the guards’ armory before disappearing.",
  "À peine sorti, il se jette sur vous avec une lame de fortune et s’enfuit dans les couloirs.": "The moment he’s out, he lunges at you with a makeshift blade and flees down the corridors.",
  "Ses appels vous poursuivent jusqu’à la sortie.": "His calls follow you all the way to the exit.",
  // La pilote
  "✈️ La pilote blessée": "✈️ The wounded pilot", "La pilote": "The pilot",
  "Dans le cockpit d’un petit avion, une femme en uniforme se tient la jambe. « J’ai posé l’appareil comme j’ai pu… Je connais un dépôt de carburant intact, si vous m’aidez. »": "In the cockpit of a small plane, a woman in uniform holds her leg. “I landed it as best I could… I know an untouched fuel depot, if you help me.”",
  "La soigner (1 objet de soin)": "Treat her (1 healing item)",
  "Elle serre les dents pendant le pansement, puis vous guide jusqu’à une cuve cachée et vous parle d’un autre endroit encore intact.": "She grits her teeth while you dress the wound, then guides you to a hidden tank and tells you about another place still untouched.",
  "Lui laisser de l’eau": "Leave her some water",
  "« Merci… Je tiendrai. » Elle vous regarde partir depuis le cockpit.": "“Thank you… I’ll hold on.” She watches you leave from the cockpit.",
  "Fouiller l’avion pendant qu’elle somnole": "Search the plane while she dozes",
  "Vous repartez avec deux jerricans et des canettes. Elle ne s’est pas réveillée.": "You leave with two jerry cans and some energy drinks. She didn’t wake up.",
  // L'ingénieure
  "⚙️ L’ingénieure de la centrale": "⚙️ The power plant engineer", "L’ingénieure": "The engineer",
  "Une femme en casque de chantier bricole un générateur à la lueur d’une lampe. « Si je le relance, j’éclaire tout le quartier une nuit. Il me manque des bras… et du courage. »": "A woman in a hard hat tinkers with a generator by lamplight. “If I get it running, I’ll light up the whole neighborhood for a night. I need more hands… and some nerve.”",
  "L’aider à relancer le générateur": "Help her restart the generator",
  "Le générateur rugit ! Elle rit aux éclats et vous donne tout ce qu’elle avait mis de côté.": "The generator roars! She bursts out laughing and gives you everything she had set aside.",
  "Une étincelle, un claquement : le court-circuit vous projette contre un mur.": "A spark, a crack: the short circuit throws you against a wall.",
  "Lui laisser des piles et partir": "Leave her some batteries and go", "Pas assez de piles": "Not enough batteries",
  "« Ça m’aidera. » Elle vous donne de la ferraille et des clous en échange.": "“That’ll help.” She gives you scrap metal and nails in exchange.",
  "Repartir sans traîner": "Leave without lingering",
  "Le bruit des machines vous suit jusqu’à la grille.": "The noise of the machines follows you to the gate.",
  // Les jumeaux
  "👦👧 Les jumeaux de la voiture": "👦👧 The twins in the car", "Les jumeaux": "The twins",
  "Dans une voiture aux vitres couvertes de dessins, deux enfants identiques vous fixent. « Maman a dit d’attendre ici. Ça fait longtemps. »": "In a car with drawings all over its windows, two identical children stare at you. “Mom said to wait here. It’s been a long time.”",
  "Les conduire au camp des survivants (2 rations)": "Take them to the survivors’ camp (2 rations)",
  "Ils vous tiennent la main tout le long du chemin. Au camp, on les accueille comme des rois.": "They hold your hands the whole way. At the camp, they are welcomed like royalty.",
  "Leur laisser à manger et revenir plus tard": "Leave them food and come back later",
  "Ils partagent la boîte en deux, parfaitement. Quand vous repassez, la voiture est vide.": "They split the can perfectly in two. When you come back, the car is empty.",
  "Fouiller la voiture": "Search the car",
  "Ils pleurent sans bruit pendant que vous prenez leurs biscuits.": "They cry silently while you take their biscuits.",
  // Le médecin
  "🩺 Le médecin de la pharmacie": "🩺 The pharmacy doctor", "Le médecin": "The doctor",
  "Derrière le comptoir d’une pharmacie barricadée, un homme en blouse sale vous braque avec une seringue. « Je soigne. Contre de quoi manger. Rien n’est gratuit. »": "Behind the counter of a barricaded pharmacy, a man in a dirty coat points a syringe at you. “I treat people. For food. Nothing is free.”",
  "Faire soigner l’équipe (3 rations)": "Have the team treated (3 rations)",
  "Il recoud, désinfecte, bande. Ses mains ne tremblent pas. Vous ressortez comme neufs.": "He stitches, disinfects, bandages. His hands don’t shake. You come out as good as new.",
  "Lui acheter des médicaments (2 rations d’eau)": "Buy medicine from him (2 water rations)", "Pas assez d’eau": "Not enough water",
  "Il compte les cachets un par un, puis vous les glisse dans un sachet.": "He counts the pills one by one, then slips them into a little bag.",
  "« Revenez quand vous saignerez. » La porte se referme.": "“Come back when you’re bleeding.” The door closes.",
  // Le pont à péage
  "🌉 Le pont à péage": "🌉 The toll bridge", "Le péagiste": "The toll keeper",
  "Des voitures en travers bloquent le pont. Un homme armé fait les cent pas. « Péage : 3 rations par tête. Ou vous faites le tour par la rivière. »": "Cars parked sideways block the bridge. An armed man paces back and forth. “Toll: 3 rations a head. Or you go around by the river.”",
  "Faire le grand détour par la rivière": "Take the long way around by the river",
  "La rivière est glacée, le détour interminable. Mais personne ne vous a tiré dessus.": "The river is freezing and the detour endless. But nobody shot at you.",
  "Payer le péage (3 rations)": "Pay the toll (3 rations)",
  "Il compte les boîtes et lève la barrière avec un sourire édenté.": "He counts the cans and lifts the barrier with a toothless grin.",
  "Forcer le passage": "Force your way through",
  "Vous le désarmez avant qu’il ait compris. Sous son abri, ses « péages » des dernières semaines !": "You disarm him before he knows what’s happening. In his shelter: weeks’ worth of “tolls”!",
  "Il tire. La balle vous touche avant que vous ne battiez en retraite.": "He fires. The bullet hits you before you can retreat.",
  // Le violoniste
  "🎻 Le violoniste des ruines": "🎻 The violinist in the ruins", "Le violoniste": "The violinist",
  "Au milieu d’une place dévastée, un vieil homme joue du violon. Les notes résonnent entre les façades. Les zombies, au loin, semblent tendre l’oreille.": "In the middle of a devastated square, an old man plays the violin. The notes echo between the buildings. In the distance, the zombies seem to be listening.",
  "L’écouter quelques minutes": "Listen for a few minutes",
  "Pendant un instant, le monde d’avant revient. Vous repartez les larmes aux yeux.": "For a moment, the world before comes back. You leave with tears in your eyes.",
  "La musique a attiré un rôdeur dans votre dos.": "The music drew a walker up behind you.",
  "Lui donner à manger (1 ration)": "Give him food (1 ration)", "Pas de nourriture": "No food",
  "Il vous joue un air rien que pour vous, puis vous souhaite bonne chance.": "He plays a tune just for you, then wishes you luck.",
  "Le faire taire avant que ça attire la horde": "Silence him before it draws the horde",
  "Il range son violon sans un mot. Le silence est pire que tout.": "He puts away his violin without a word. The silence is worse than anything.",
  // Le chasseur
  "🏹 Le chasseur solitaire": "🏹 The lone hunter", "Le chasseur": "The hunter",
  "Un homme en tenue de camouflage dépèce un lapin au bord d’un chemin. « La forêt nourrit ceux qui savent regarder. Je peux vous apprendre… contre quelques balles. »": "A man in camouflage is skinning a rabbit by the side of a path. “The forest feeds those who know how to look. I can teach you… for a few bullets.”",
  "Échanger 4 balles contre deux collets": "Trade 4 bullets for two snares", "Pas assez de balles": "Not enough bullets",
  "Il vous montre comment les poser près des terriers. « Patience. Toujours. »": "He shows you how to set them near the burrows. “Patience. Always.”",
  "Partager son repas": "Share his meal",
  "Le lapin grillé a un goût de paradis. Il vous indique où cueillir herbes et champignons.": "The roast rabbit tastes like heaven. He shows you where to pick herbs and mushrooms.",
  "Le saluer et continuer": "Greet him and move on",
  "Il hoche la tête sans lever les yeux de son couteau.": "He nods without looking up from his knife.",
  // L'hélicoptère
  "🚁 L’hélicoptère écrasé": "🚁 The crashed helicopter",
  "Une épave d’hélicoptère fume encore au milieu d’un champ. Des caisses frappées d’une croix rouge sont éparpillées autour. De l’essence goutte du réservoir.": "A helicopter wreck is still smoking in the middle of a field. Crates marked with a red cross are scattered around it. Fuel is dripping from the tank.",
  "Ramasser seulement les caisses éparpillées": "Only pick up the scattered crates",
  "Vous ramassez ce qui traîne dans l’herbe sans vous approcher de l’épave.": "You pick up what’s lying in the grass without going near the wreck.",
  "Fouiller l’épave": "Search the wreck",
  "Dans la soute : du matériel médical, une arme et des munitions. Une vraie fortune !": "In the hold: medical supplies, a weapon and ammo. A real fortune!",
  "Le réservoir s’embrase pendant que vous fouillez. Vous sortez de justesse.": "The tank goes up in flames while you search. You barely get out.",
  // La famille vers le sud
  "🛻 La famille en route vers le sud": "🛻 The family heading south", "Le père de famille": "The father",
  "Un pick-up chargé jusqu’au toit s’arrête à votre hauteur. Un homme, sa femme et une adolescente. « On descend vers le sud, il paraît qu’il y a un camp près de la mer. Vous venez ? »": "A pickup loaded to the roof pulls up beside you. A man, his wife and a teenage girl. “We’re heading south, they say there’s a camp by the sea. Coming?”",
  "Leur souhaiter bonne route": "Wish them a safe trip",
  "L’adolescente vous fait un signe par la vitre arrière, jusqu’à ce que le pick-up disparaisse.": "The girl waves at you through the rear window until the pickup disappears.",
  "Échanger du carburant (1 jerrican) contre des vivres": "Trade fuel (1 jerry can) for supplies", "Pas de jerrican": "No jerry can",
  "« Avec ça, on arrivera peut-être. » Ils vous laissent un lot de conserves et un bidon d’eau.": "“With this, we might make it.” They leave you a pack of canned food and a water jug.",
  "Demander si quelqu’un veut rester avec vous": "Ask if anyone wants to stay with you",
  "Après une longue discussion à voix basse, une jeune femme qui voyageait avec eux descend du pick-up. « Le sud, c’est un rêve. Ici, au moins, il y a vous. »": "After a long, hushed discussion, a young woman traveling with them climbs out of the pickup. “The south is a dream. Here, at least, there’s you.”"
});

/* ---------- Causes de mort (2026-11-14) ----------
   La cause est gardée en français dans la partie (« tué par un coureur (Supermarché) ») ; causeAnglaise la traduit
   à l'affichage en bout de phrase anglaise : « was killed by a runner (Supermarket) », « died of thirst ». */
var CAUSES_EN = {
  "mort":"died", "mort de soif":"died of thirst", "mort de faim":"died of hunger", "mort de froid":"froze to death",
  "mort de froid sous l’orage":"froze to death in the storm", "mort de froid pendant la tempête":"froze to death in the snowstorm",
  "mort de la maladie du quartier":"died of the neighborhood sickness", "mort dehors, seul dans la nuit":"died outside, alone in the night",
  "tué pendant l’attaque de nuit":"was killed in the night attack", "tué par une meute de chiens":"was killed by a pack of dogs",
  "tué par des pillards":"was killed by raiders", "tué pendant le raid de l’immeuble":"was killed during the apartment block raid",
  "tué par un soldat aux abois":"was killed by a desperate soldier", "tué par un détenu en fuite":"was killed by an escaping prisoner",
  "tué par un court-circuit à la centrale":"was killed by a short circuit at the power plant", "tué par la bande des Corbeaux":"was killed by the Crows gang",
  "tué en écoutant un violon":"was killed while listening to a violin", "tué en poursuivant un éclaireur":"was killed chasing a scout",
  "tué en pillant des voisins":"was killed robbing the neighbors", "tué en chemin":"was killed on the road",
  "tué dans un immeuble infesté":"was killed in an infested building", "tué dans un guet-apens":"was killed in an ambush",
  "tué dans l’explosion d’un hélicoptère":"was killed when a helicopter exploded", "tué au pont à péage":"was killed at the toll bridge",
  "tombé pendant le raid de l’immeuble":"fell during the apartment block raid", "tombé dans un piège au parc":"fell into a trap at the park",
  "sacrifié":"was sacrificed", "parti dans la nuit, fou à lier":"walked out into the night, raving mad",
  "mordu":"was bitten", "mordu par un enfant qui s’est transformé":"was bitten by a child who turned", "mordu par un chien affolé":"was bitten by a panicked dog",
  "emporté par la fièvre":"was taken by the fever", "coupé par la tôle d’une épave":"bled out after a cut on a wreck’s sheet metal"
};
function causeAnglaise(c){
  c = String(c || "mort");
  // la forme féminine (« morte », « tuée », « partie… folle ») revient à la forme de la table
  var base = c.replace(/^(mort|tué|mordu|tombé|emporté|coupé|sacrifié|parti|blessé)e(?![a-zé])/, "$1").replace(/, seule\b/, ", seul").replace("folle à lier", "fou à lier");
  if(CAUSES_EN[base]) return CAUSES_EN[base];
  var m;
  if((m = base.match(/^tué par une mine devant (.+)$/))) return "was killed by a mine outside " + m[1];
  if((m = base.match(/^tué par l’explosion d’un (.+?) \((.+)\)$/))) return "was killed when a " + m[1] + " exploded (" + m[2] + ")";
  if((m = base.match(/^tué par (.+), devenue? folle?$/)) || (m = base.match(/^tué par (.+), devenu fou$/))) return "was killed by " + m[1] + ", who had gone mad";
  if((m = base.match(/^tué par une? (.+?)( \(.+\))?$/))) return "was killed by " + (/^[aeiou]/i.test(m[1]) ? "an " : "a ") + m[1] + (m[2] || "");
  if((m = base.match(/^tué par (.+)$/))) return "was killed by " + m[1];
  return "died (" + c + ")";
}

/* ---------- Effets des rencontres, chapitres et récits (2026-11-14) ---------- */
Object.assign(TRADUCTIONS.en, {
  "−1 ration de nourriture.": "−1 food ration.", "−{n} rations de nourriture.": "−{n} food rations.",
  "−1 ration d’eau.": "−1 water ration.", "−{n} rations d’eau.": "−{n} water rations.",
  "Vous rapportez {objets}.": "You bring back {objets}.",
  "Rex fait désormais partie de la famille.": "Rex is part of the family now.",
  "{nom} rejoint la famille.": "{nom} joins the family.",
  "Nouveau lieu découvert : {lieu}.": "New place discovered: {lieu}.",
  "L’équipe est soignée (+{n} PV chacun).": "The team is patched up (+{n} HP each).",
  "−{n} d’énergie pour l’équipe.": "−{n} energy for the team.",
  "Moral +{n}.": "Morale +{n}.", "Moral {n}.": "Morale {n}.", "Moral +{n}": "Morale +{n}", "moral +{n}": "morale +{n}",
  "{nom} est blessée (−{n} PV).": "{nom} is wounded (−{n} HP).", "{nom} est blessé (−{n} PV).": "{nom} is wounded (−{n} HP).",
  // Fenêtre du chapitre
  "le bastion « {clan} »": "the “{clan}” stronghold",
  "Chapitre {n}": "Chapter {n}", "Chapitre {n} terminé": "Chapter {n} complete", "Objectif :": "Goal:", "Récompense :": "Reward:", "aucune": "none",
  "L’histoire jusqu’ici": "The story so far", "Prochain :": "Next:",
  // Chapitres
  "Premiers pas": "First steps", "Fouiller 3 lieux différents": "Search 3 different places", "lieux fouillés": "places searched",
  "Il y a trois jours, la radio s’est tue. Puis les sirènes. Dans la rue, les voisins ne sont plus vraiment des voisins. Papa a calé la porte avec la commode : il va falloir sortir chercher de quoi tenir.":
    "Three days ago, the radio went silent. Then the sirens. Out in the street, the neighbors aren’t really neighbors anymore. Dad has wedged the door shut with the dresser: someone will have to go out and find supplies.",
  "Il y a trois jours, la radio s’est tue. Puis les sirènes. Dans la rue, les voisins ne sont plus vraiment des voisins. La porte est calée avec la commode : il va falloir sortir chercher de quoi tenir.":
    "Three days ago, the radio went silent. Then the sirens. Out in the street, the neighbors aren’t really neighbors anymore. The door is wedged shut with the dresser: someone will have to go out and find supplies.",
  "Le quartier n’a plus de secrets pour vous. Un voisin vous laisse une canette.": "The neighborhood holds no more secrets for you. A neighbor leaves you an energy drink.",
  "Le refuge": "The refuge", "Construire la barricade (niveau 1)": "Build the barricade (level 1)", "niveau de barricade": "barricade level",
  "Les premières sorties ont appris une chose à la famille : la nuit, ils viennent gratter aux fenêtres. Le salon doit devenir un vrai refuge.":
    "The first trips taught the family one thing: at night, they come and scratch at the windows. The living room has to become a real refuge.",
  "La porte tient. Léo bricole un piège avec les restes.": "The door holds. Léo rigs up a trap with the leftovers.",
  "La porte tient. Avec les restes, on bricole un piège.": "The door holds. You rig up a trap with the leftovers.",
  "Bricoleurs": "Handymen", "Fabriquer 2 objets à l’atelier": "Craft 2 items in the workshop", "objets fabriqués": "items crafted",
  "La porte tient. Mais les armes s’usent et les bandages manquent. Maman ressort la boîte à couture, Léo démonte tout ce qui traîne : il est temps d’apprendre à fabriquer.":
    "The door holds. But weapons wear out and bandages run short. Mom digs out the sewing kit, Léo takes apart everything lying around: it’s time to learn to craft.",
  "La porte tient. Mais les armes s’usent et les bandages manquent. Maman ressort la boîte à couture et démonte tout ce qui traîne : il est temps d’apprendre à fabriquer.":
    "The door holds. But weapons wear out and bandages run short. Mom digs out the sewing kit and takes apart everything lying around: it’s time to learn to craft.",
  "La porte tient. Mais les armes s’usent et les bandages manquent. Léo démonte tout ce qui traîne et ressort la vieille boîte à couture : il est temps d’apprendre à fabriquer.":
    "The door holds. But weapons wear out and bandages run short. Léo takes apart everything lying around and digs out the old sewing kit: it’s time to learn to craft.",
  "La porte tient. Mais les armes s’usent et les bandages manquent. On ressort la boîte à couture, on démonte tout ce qui traîne : il est temps d’apprendre à fabriquer.":
    "The door holds. But weapons wear out and bandages run short. Out comes the sewing kit, apart comes everything lying around: it’s time to learn to craft.",
  "La famille prend le coup de main. Des matériaux en plus pour la suite.": "The family is getting the hang of it. Some extra materials for what’s ahead.",
  "Sur la route": "On the road", "Réparer la voiture": "Repair the car", "pièces installées": "parts installed",
  "Le quartier se vide. Dans le garage du voisin, un vieux break dort sous une bâche. Avec une batterie, une roue et une courroie, il pourrait encore rouler.":
    "The neighborhood is emptying out. In the neighbor’s garage, an old station wagon sleeps under a tarp. With a battery, a wheel and a fan belt, it could still run.",
  "Le moteur ronronne. Un jerrican oublié dans le coffre !": "The engine purrs. A forgotten jerry can in the trunk!",
  "Au-delà du quartier": "Beyond the neighborhood", "Revenir vivant d’une zone éloignée": "Come back alive from a distant zone", "retour de zone éloignée": "return from a distant zone",
  "Le moteur tousse, puis ronronne. Emma colle son nez à la vitre : au-delà du quartier, il reste peut-être des réserves… et d’autres survivants.":
    "The engine coughs, then purrs. Emma presses her nose to the window: beyond the neighborhood, there may still be supplies… and other survivors.",
  "Le moteur tousse, puis ronronne. Les visages se collent aux vitres : au-delà du quartier, il reste peut-être des réserves… et d’autres survivants.":
    "The engine coughs, then purrs. Faces press against the windows: beyond the neighborhood, there may still be supplies… and other survivors.",
  "Le monde est plus grand que la rue. Et plus dangereux.": "The world is bigger than the street. And more dangerous.",
  // Tenir bon
  "Tenir bon": "Hold on", "Survivre jusqu’au jour {n}": "Survive until day {n}", "jours": "days",
  "Encore debout. Chaque jour arraché compte. La famille reprend courage.": "Still standing. Every day snatched back counts. The family takes heart again.",
  "Encore debout. Chaque jour arraché compte, même sans les autres.": "Still standing. Every day snatched back counts, even without the others.",
  "Les réserves du quartier sont presque épuisées. Chaque jour gagné est une victoire : la famille s’organise et se relaie pour les gardes.":
    "The neighborhood’s supplies are nearly gone. Every day won is a victory: the family gets organized and takes turns keeping watch.",
  "Le monde d’avant semble loin. Le soir, Léo raconte des histoires de super-héros à Emma, et pendant un moment, on oublie les grattements dehors.":
    "The world before feels far away. In the evening, Léo tells Emma superhero stories, and for a while, everyone forgets the scratching outside.",
  "Le monde d’avant semble loin. Le soir, Léo raconte des histoires de super-héros, et pendant un moment, on oublie les grattements dehors.":
    "The world before feels far away. In the evening, Léo tells superhero stories, and for a while, everyone forgets the scratching outside.",
  "Le monde d’avant semble loin. Le soir, Emma invente des histoires de princesses guerrières, et pendant un moment, on oublie les grattements dehors.":
    "The world before feels far away. In the evening, Emma makes up stories about warrior princesses, and for a while, everyone forgets the scratching outside.",
  "Le monde d’avant semble loin. Le soir, on se raconte des souvenirs d’avant, et pendant un moment, on oublie les grattements dehors.":
    "The world before feels far away. In the evening, you share memories from before, and for a while, everyone forgets the scratching outside.",
  "Les zombies sont plus nombreux, plus affamés. Papa compte les planches, Maman compte les rations. Personne ne parle de partir.":
    "The zombies are more numerous, hungrier. Dad counts the planks, Mom counts the rations. Nobody talks about leaving.",
  "Les zombies sont plus nombreux, plus affamés. Papa compte les planches et les rations, deux fois par jour. Personne ne parle de partir.":
    "The zombies are more numerous, hungrier. Dad counts the planks and the rations, twice a day. Nobody talks about leaving.",
  "Les zombies sont plus nombreux, plus affamés. Maman compte les planches et les rations, deux fois par jour. Personne ne parle de partir.":
    "The zombies are more numerous, hungrier. Mom counts the planks and the rations, twice a day. Nobody talks about leaving.",
  "Les zombies sont plus nombreux, plus affamés. On compte les planches, on compte les rations. Personne ne parle de partir.":
    "The zombies are more numerous, hungrier. You count the planks, you count the rations. Nobody talks about leaving.",
  "Une fumée au loin, peut-être d’autres survivants. Peut-être pas. Ici, au moins, c’est chez vous.":
    "Smoke in the distance, maybe other survivors. Maybe not. Here, at least, it’s home.",
  "L’hiver approche, ou peut-être pas : on ne compte plus les saisons, seulement les jours. Et vous êtes encore là.":
    "Winter is coming, or maybe not: nobody counts the seasons anymore, only the days. And you’re still here.",
  "Le refuge est trop grand maintenant. Chaque bruit fait sursauter. Mais tant qu’il reste quelqu’un pour garder la porte, la maison tient.":
    "The refuge is too big now. Every noise makes you jump. But as long as someone is left to guard the door, the house holds.",
  "Les lits vides, les tasses en trop sur l’étagère. On continue pour eux, un jour après l’autre.":
    "The empty beds, the extra mugs on the shelf. You keep going for them, one day after another."
});

/* ---------- Textes des écrans (traduits à l'affichage, voir langue.js) : lot 1, 2026-11-14 ----------
   Clé = texte français affiché, sans les emojis ni la ponctuation du début et de la fin ; {#} = un nombre. */
Object.assign(TRAD_ECRAN, {
  // Vitrine de l'accueil
  "Ton refuge, pièce par pièce": "Your refuge, room by room",
  "Salon, cuisine, chambre, atelier, garage, cour… barricade, cultive, cuisine au feu de bois": "Living room, kitchen, bedroom, workshop, garage, yard… barricade, grow food, cook over a wood fire",
  "Plus de {#} lieux à fouiller": "Over {#} places to scavenge",
  "Chaque objet trouvé ne revient jamais. Des lieux secrets se découvrent avec le temps, jusqu’au zoo abandonné et à la prison": "Every item you find is gone for good. Secret places reveal themselves over time, all the way to the abandoned zoo and the prison",
  "Des combats tactiques": "Tactical fights",
  "Vise la tête, pousse, soigne, lance un cocktail… Des zombies variés, chacun son piège, et des zombies célèbres à traquer": "Aim for the head, shove, heal, throw a Molotov… Many kinds of zombies, each with its own trick, and famous zombies to hunt down",
  "Des rencontres et des choix": "Encounters and choices",
  "Aider, mentir, voler ou fuir : chaque décision peut sauver ou condamner les tiens": "Help, lie, steal or run: every decision can save or doom your family",
  "Ta famille, tes règles": "Your family, your rules",
  "Renomme-les, choisis leurs traits, regarde-les devenir Vétéran ou Éclaireur… La mort est définitive": "Rename them, pick their traits, watch them become Veterans or Scouts… Death is permanent",
  "Forêt, étang, potager, poules": "Forest, pond, garden, chickens",
  "Coupe du bois, pêche, élève des poules : rien n’est infini, tout s’épuise": "Chop wood, fish, raise chickens: nothing is endless, everything runs out",
  "Répare la vieille voiture": "Fix the old car",
  "Trouve batterie, roue et courroie pour atteindre les zones lointaines, riches et dangereuses": "Find a battery, a wheel and a fan belt to reach distant zones, rich and dangerous",
  "Clans et guerres": "Clans and wars",
  "Après {#} jours, rejoins un clan de {#} familles : bastion commun, réserve, défenses, discussion et échanges entre membres, et guerres de {#} jours contre d’autres clans": "After {#} days, join a clan of {#} families: a shared stronghold, supplies, defenses, chat and trading between members, and {#}-day wars against other clans",
  "Opérations de clan": "Clan operations",
  "Préparez un raid ensemble : chacun envoie un volontaire, le chef mène l’assaut d’un immeuble de {#} étages. Replay pour tous, butin partagé": "Plan a raid together: everyone sends a volunteer, the leader storms a {#}-story apartment block. Replay for all, shared loot",
  "Nuits et saisons": "Nights and seasons",
  "Les zombies attaquent, l’hiver gèle l’étang, l’été donne soif, la folie guette. Tiendras-tu jusqu’au matin": "Zombies attack, winter freezes the pond, summer makes you thirsty, madness lurks. Will you last until morning",
  "La Légende du mois": "Legend of the Month",
  "Le meilleur joueur du mois est couronné Légende pour tout le mois suivant, avec Raja le tigre. La même partie pour tous chaque jour, des défis et une grande horde chaque week-end : à toi de prendre la couronne": "The month’s best player is crowned Legend for the whole next month, with Raja the tiger. The same game for everyone each day, challenges and a great horde every weekend: the crown is yours to take",
  "Ce qui t’attend": "What awaits you", "Carte précédente": "Previous card", "Carte suivante": "Next card",
  "Voir : Ton refuge, pièce par pièce": "See: Your refuge, room by room", "Voir : Plus de {#} lieux à fouiller": "See: Over {#} places to scavenge",
  "Voir : Des combats tactiques": "See: Tactical fights", "Voir : Des rencontres et des choix": "See: Encounters and choices",
  "Voir : Ta famille, tes règles": "See: Your family, your rules", "Voir : Forêt, étang, potager, poules": "See: Forest, pond, garden, chickens",
  "Voir : Répare la vieille voiture": "See: Fix the old car", "Voir : Clans et guerres": "See: Clans and wars",
  "Voir : Opérations de clan": "See: Clan operations", "Voir : Nuits et saisons": "See: Nights and seasons", "Voir : La Légende du mois": "See: Legend of the Month",
  // Accueil « Partie en cours » et panneau « En ce moment »
  "Partie en cours": "Game in progress", "Libre": "Free play", "Classée": "Ranked", "Jour {#}": "Day {#}", "points": "points",
  "Continuer la partie": "Continue the game", "Guide": "Guide", "Nouvelle famille": "New family",
  "Une nouvelle famille efface la partie en cours": "A new family erases the current game",
  "En ce moment": "Right now", "{#} familles tiennent bon": "{#} families holding out", "{#} famille tient bon": "{#} family holding out", "aucune famille en vie": "no family alive",
  "tes chiffres (hors ligne)": "your numbers (offline)",
  "survivants en vie": "survivors alive", "morts": "dead", "zombies abattus": "zombies killed",
  "En tête du mois": "Leading this month", "En tête ce mois-ci": "Leading this month",
  "Chaque membre en vie compte : une famille de {#} en vie, c’est {#} survivants": "Every living member counts: a family of {#} alive means {#} survivors",
  "La famille de": "The family of", "tient depuis {#} jours": "has held out for {#} days",
  ", {#} points. Qui sera la prochaine Légende": ", {#} points. Who will be the next Legend",
  "Record de tous les temps": "All-time record", ", {#} points en {#} jours": ", {#} points in {#} days",
  // En-tête
  "Chapitre {#}": "Chapter {#}", "eau": "water", "repas": "meals", "soins": "healing", "défense": "defense", "moral": "morale", "menu": "menu",
  "score": "score", "record {#}": "record {#}", "record": "record",
  "Retour à l’accueil du jeu": "Back to the game’s home screen", "Détail du chapitre": "Chapter details", "La saison : comment ça marche": "The season: how it works",
  "Rations d’eau : {#}": "Water rations: {#}", "Rations de nourriture : {#}": "Food rations: {#}", "Objets de soin : {#}": "Healing items: {#}",
  "Défense de nuit : {#}": "Night defense: {#}", "Moral : {#}": "Morale: {#}", "Menu et guide": "Menu and guide",
  "Score : chaque jour terminé rapporte {#} point par membre en vie": "Score: each completed day earns {#} point per living member",
  // Écran principal
  "Au refuge": "At the refuge",
  "Touche {#} ou {#} membres pour fouiller · cases 🗡️ 🔦 🎒 pour équiper · ⚡ = énergie": "Tap {#} or {#} members to scavenge · 🗡️ 🔦 🎒 slots to equip · ⚡ = energy",
  "Touche {#} ou {#} membres pour fouiller · cases": "Tap {#} or {#} members to scavenge ·", "pour équiper ·": "slots to equip ·", "énergie": "energy",
  "Fouiller": "Scavenge", "Stock": "Stock", "Refuge": "Refuge", "Dormir": "Sleep", "Pièces": "Rooms", "Aller dans une pièce": "Go to a room", "Les pièces": "The rooms",
  "Famille": "Family", "Feu": "Fire", "Partir": "Leave", "Histoire": "Story",
  "Salon": "Living room", "Cuisine": "Kitchen", "Chambre": "Bedroom", "Réserve": "Storeroom", "Atelier": "Workshop", "Garage": "Garage", "Cour": "Yard",
  "Grande salle": "Great hall", "Salle du trésor": "Treasury", "Cour fortifiée": "Fortified yard", "La maison": "The house", "Le bastion du clan": "The clan stronghold",
  "Pièce précédente": "Previous room", "Pièce suivante": "Next room",
  // Menu
  "Menu": "Menu", "Mon profil": "My profile", "voir et modifier": "view and edit", "Règles, objets, lieux": "Rules, items, places",
  "Défis": "Challenges", "La horde est là": "The horde is here", "Classement": "Leaderboard", "Tous les joueurs": "All players",
  "Succès": "Achievements", "{#} / {#} débloqués": "{#} / {#} unlocked", "Clans": "Clans", "Dès le jour {#}": "From day {#}", "Fonder ou rejoindre": "Found or join",
  "Inviter": "Invite", "{#} / {#} bonus gardés": "{#} / {#} bonuses saved", "{#} colis à ouvrir": "{#} packages to open",
  "Mes stats": "My stats", "{#} zombies abattus": "{#} zombies killed", "Avis / bug": "Feedback", "Signaler, proposer": "Report, suggest",
  "{#} / {#} aujourd’hui": "{#} / {#} today",
  "Son": "Sound", "Oui": "Yes", "Non": "No", "Musique": "Music", "Vibrations": "Vibration", "Adulte": "Mature",
  "Mentions légales": "Legal notice", "Confidentialité": "Privacy", "Reprendre": "Resume", "Recommencer": "Start over",
  "Vraiment ? La partie en cours sera perdue": "Really? The current game will be lost", "Oui, recommencer": "Yes, start over",
  // Fiche d'un membre
  "Vie": "Health", "Énergie": "Energy", "Faim": "Hunger", "Soif": "Thirst", "Folie": "Madness", "Exploits": "Feats", "Équipement": "Equipment",
  "Arme": "Weapon", "Outil / éclairage": "Tool / light", "Sac": "Bag", "Soigner": "Heal", "boire, manger": "drink, eat",
  "{#} · {#} / {#} dans l’équipe": "{#} · {#} / {#} in the team", "Fermer": "Close",
  "Épuisé": "Exhausted", "Épuisée": "Exhausted", "Fatigué": "Tired", "Fatiguée": "Tired", "Blessé": "Wounded", "Blessée": "Wounded",
  "Assoiffé": "Thirsty", "Assoiffée": "Thirsty", "Affamé": "Starving", "Affamée": "Starving", "En forme": "Fit",
  "Choisir pour partir": "Choose to go out", "Part en fouille": "Going out", "Touche pour le retirer": "Tap to remove",
  "Mort": "Dead", "Morte": "Dead", "Partant": "Going", "Partante": "Going",
  // Soins
  "{#} PV grâce au soigneur": "{#} HP thanks to the healer", "En pleine forme : pas besoin de soin": "In great shape: no healing needed",
  "Boire et manger": "Drink and eat", "Canette": "Energy drink", "plus aucune": "none left", "Ration d’eau": "Water ration", "plus rien": "none left", "Ration": "Ration",
  "conseillé": "recommended", "PV de trop": "HP wasted",
  "La nuit, chacun boit et mange déjà {#} ration ({#} si sa jauge passe sous {#}) : n’en donne en plus qu’en cas d’urgence": "At night, everyone already drinks and eats {#} ration ({#} if their gauge drops below {#}): only give extra in an emergency",
  // Qui part ?
  "Qui part fouiller": "Who’s going out", "Équipe {#} / {#}": "Team {#} / {#}", "Touche un survivant pour le choisir, une case pour l’équiper": "Tap a survivor to pick them, a slot to equip them",
  "Disponible": "Available", "Choisis d’abord": "Choose first", "Annuler": "Cancel", "Choisir le lieu": "Choose the place", "Part": "Going", "Au bastion": "At the stronghold",
  // Où envoyer l'équipe ?
  "Où envoyer l’équipe": "Where to send the team", "force {#}": "strength {#}", "{#} places": "{#} slots", "{#} obj": "{#} items",
  "Trop fatigués": "Too tired", "Trop fatigué": "Too tired", "Voiture en panne": "Car broken down", "Vidé": "Emptied",
  "Danger inconnu (il faut une radio": "Danger unknown (you need a radio", "Sombre : pas de lumière": "Dark: no light", "Verrouillé : porte à forcer": "Locked: door to force",
  "En voiture : ⛽ −{#} L": "By car: ⛽ −{#} L", "Sans radio, le danger des lieux est inconnu": "Without a radio, the danger of each place is unknown",
  "À pied": "On foot", "En voiture": "By car",
  // Stock
  "Le stock du refuge": "The refuge stock", "{#} rations · {#} case": "{#} rations · {#} slot", "{#} rations · {#} cases": "{#} rations · {#} slots", "Le stock est vide": "The stock is empty",
  "Équiper sur": "Equip on",
  // Refuge
  "Le refuge": "The refuge", "Construire": "Build", "Fabriquer": "Craft", "Réparer": "Repair", "Démonter": "Dismantle", "Voiture": "Car",
  "Bilan ›": "Summary ›", "Bilan": "Summary", "Défense de nuit": "Night defense", "Eau par nuit": "Water per night", "Repas par nuit": "Meals per night", "Planches": "Planks",
  "Barricade": "Barricade", "Récupérateur d’eau": "Water collector", "Potager": "Vegetable garden", "Niveau {#} / {#}": "Level {#} / {#}",
  "de défense la nuit": "defense at night", "Une attaque perdue en détruit un": "A lost attack destroys one",
  "Niveau {#} : il faut": "Level {#}: you need", "Il manque {#} planks": "{#} planks missing", "Il faut": "You need", "Il manque {#} rags": "{#} rags missing",
  "Aucune arme abîmée": "No damaged weapon", "Touche une case pour voir le détail": "Tap a slot to see the details",
  "Rien à démonter dans le stock (les objets équipés ne sont pas proposés": "Nothing to dismantle in the stock (equipped items aren’t listed",
  "Vieux break du voisin": "The neighbor’s old station wagon", "En panne": "Broken down", "En état de rouler": "Ready to drive",
  "Glisse chaque pièce sur son emplacement ({#} ⚡ au plus reposé": "Drag each part onto its slot ({#} ⚡ for the most rested",
  "Glisse chaque pièce sur son emplacement ({#}": "Drag each part onto its slot ({#}", "au plus reposé": "for the most rested",
  "Car battery : emplacement vide": "Car battery: empty slot", "Wheel : emplacement vide": "Wheel: empty slot", "Fan belt : emplacement vide": "Fan belt: empty slot",
  "Pièces au refuge": "Parts at the refuge", "Aucune pour l’instant. Cherche au Garage auto et à la Zone industrielle": "None yet. Look in the auto repair shop and the industrial park",
  "Pas assez pour une zone éloignée ({#} L) · cuve de la station : {#} L": "Not enough for a distant zone ({#} L) · gas station tank: {#} L",
  "Faire le plein": "Fill up", "aucun jerrican": "no jerry can",
  "Cuisiner": "Cook", "Recettes": "Recipes", "Garde-manger": "Pantry",
  "Cuisinière à bois : a plank par plat (il en reste {#}) · aucun plat prêt": "Wood stove: one plank per dish ({#} left) · no dish ready",
  "Il manque des ingrédients": "Ingredients missing", "Eau": "Water",
  // Dormir
  "Aller dormir": "Go to sleep", "eau · reste {#}": "water · {#} left", "repas · reste {#}": "meals · {#} left", "risque d’attaque": "attack risk", "Cette nuit": "Tonight",
  "{#} auront froid sans feu ni couverture : +{#} ⚡ seulement, −{#} PV": "{#} will be cold without a fire or blanket: only +{#} ⚡, −{#} HP",
  "{#} auront froid sans feu ni couverture : +{#}": "{#} will be cold without a fire or blanket: only +{#}", "seulement, −{#} PV": ", −{#} HP",
  "Pas assez d’eau pour tout le monde": "Not enough water for everyone", "Pas assez à manger pour tout le monde": "Not enough food for everyone",
  "Si les zombies viennent : force {#} à {#}, votre défense {#} : la barricade risque de céder": "If the zombies come: strength {#} to {#}, your defense {#}: the barricade may give way",
  "Pas encore": "Not yet",
  // Pastilles du haut
  "Pas assez ce soir": "Not enough tonight", "cette nuit": "tonight", "gagné / nuit": "gained / night", "{#} nuit": "{#} night", "{#} nuits": "{#} nights", "réserve": "in reserve",
  "Bon à savoir": "Good to know", "Pas assez pour tout le monde ce soir : la soif va faire des dégâts": "Not enough for everyone tonight: thirst will take its toll",
  "Chaque nuit, chacun boit {#} ration, et {#} de plus si sa jauge tombe sous {#}": "Each night, everyone drinks {#} ration, and {#} more if their gauge drops below {#}",
  "Construis un récupérateur d’eau, fabrique une bâche, ou profite de la pluie": "Build a water collector, craft a tarp, or make the most of the rain",
  "Une ration de plus dans la journée (touche un membre, puis « Soigner · boire, manger ») ne sert qu’en urgence": "An extra ration during the day (tap a member, then “Heal · drink, eat”) is only for emergencies",
  "Rations d’eau": "Water rations", "Rations de nourriture": "Food rations",
  "Pas assez pour tout le monde ce soir : la faim va faire des dégâts": "Not enough for everyone tonight: hunger will take its toll",
  "Chaque nuit, chacun mange {#} ration, et {#} de plus si sa jauge tombe sous {#}": "Each night, everyone eats {#} ration, and {#} more if their gauge drops below {#}",
  "Construis un potager, pêche à l’étang, élève des poules ou pose des collets": "Build a vegetable garden, fish at the pond, raise chickens or set snares",
  "Objets de soin": "Healing items", "Aucun soin": "No healing", "blessés": "wounded", "{#} PV": "{#} HP", "bonus soigneur": "healer bonus", "repos / nuit": "rest / night",
  "Pour soigner quelqu’un, touche sa carte puis « Soigner » : le soin conseillé est mis en avant": "To heal someone, tap their card then “Heal”: the recommended item is highlighted",
  "Aucun soin au refuge : cherche à l’hôpital, au supermarché, ou fabrique des bandages à l’atelier": "No healing items at the refuge: look in the hospital or the supermarket, or craft bandages in the workshop",
  "Trop faible": "Too weak", "risque cette nuit": "risk tonight", "{#} à {#}": "{#} to {#}", "force attendue": "expected strength", "verdict": "verdict",
  "Solide": "Solid", "Juste": "Tight", "Correct": "Fair", "Au plus bas": "Rock bottom",
  "Rien pour l’instant : construis la barricade et garde des armes en main": "Nothing yet: build the barricade and keep weapons in hand",
  "Attaque perdue : un blessé, de la nourriture volée et un niveau de barricade détruit": "Attack lost: someone wounded, food stolen and one barricade level destroyed",
  "Moral de la famille": "Family morale", "fouille moins bien": "scavenges worse", "normal": "normal", "{#} objet": "{#} item",
  "perte / nuit": "loss / night", "gain / nuit": "gain / night", "bilan / nuit": "balance / night",
  "Les objets de confort au refuge (peluche, photo, cartes…) remontent le moral chaque nuit": "Comfort items at the refuge (teddy bear, photo, cards…) lift morale every night",
  "Un feu de cheminée, les bons choix du matin, les chapitres et les missions réussis aussi": "So do a fire in the fireplace, good morning choices, and completed chapters and missions",
  "Une mort fait chuter le moral de {#}": "A death drops morale by {#}",
  "ici": "here",
  // Saisons
  "Jour {#} sur {#} de la saison · ❄️ Winter dans {#} jours": "Day {#} of {#} of the season · ❄️ Winter in {#} days",
  "Jour {#} sur {#} de la saison ·": "Day {#} of {#} of the season ·", "Winter dans {#} jours": "Winter in {#} days", "Spring dans {#} jours": "Spring in {#} days",
  "Summer dans {#} jours": "Summer in {#} days", "Autumn dans {#} jours": "Autumn in {#} days",
  "Les quatre saisons": "The four seasons", "Autumn · en ce moment": "Autumn · right now", "Winter · en ce moment": "Winter · right now",
  "Spring · en ce moment": "Spring · right now", "Summer · en ce moment": "Summer · right now",
  "Une saison dure {#} jours de jeu, puis la suivante arrive ; après l’été, l’automne revient": "A season lasts {#} game days, then the next one arrives; after summer, autumn comes back",
  // Bilan du refuge
  "Bilan du refuge": "Refuge summary", "défense de nuit": "night defense", "eau / nuit · {#} bues": "water / night · {#} drunk", "repas / nuit · {#} mangés": "meals / night · {#} eaten",
  "Ce qui protège et nourrit le refuge": "What protects and feeds the refuge",
  "Rien pour l’instant : construis, ou fabrique une bâche ou un collet à l’atelier": "Nothing yet: build, or craft a tarp or a snare in the workshop",
  "Pas encore construit": "Not built yet", "{#} défense": "{#} defense", "Récupérateur": "Collector", "{#} eau / nuit": "{#} water / night", "{#} repas / nuit": "{#} meals / night",
  "Construire et fabriquer": "Build and craft",
  // Emplacements d'équipement
  "En main": "In hand", "Rien en main": "Nothing in hand", "Dans le stock": "In the stock", "Ranger": "Put away", "Équiper": "Equip",
  "Aucun objet de ce type au refuge. Fouille les lieux ou fabrique-en une à l’atelier (lance, gourdin clouté": "No item of this kind at the refuge. Scavenge or craft one in the workshop (spear, nail club",
  "Aucun objet de ce type au refuge. Lampe, torche, canne à pêche… à trouver dehors ou à fabriquer à l’atelier": "No item of this kind at the refuge. Flashlight, torch, fishing rod… found outside or crafted in the workshop",
  "Aucun objet de ce type au refuge. Sacoches et sacs se trouvent en fouillant, ou se fabriquent avec des chiffons": "No item of this kind at the refuge. Satchels and bags are found while scavenging, or crafted from rags",
  // Stats
  "Cette partie": "This game", "Toutes tes parties": "All your games", "Depuis le début": "Since the start",
  "jour tenu": "day survived", "jours tenus": "days survived", "en vie": "alive", "zombie abattu": "zombie killed", "lieu fouillé": "place searched", "lieux fouillés": "places searched",
  "objet fabriqué": "item crafted", "objets fabriqués": "items crafted", "poisson pêché": "fish caught", "poissons pêchés": "fish caught",
  "planche coupée": "plank cut", "planches coupées": "planks cut", "mission réussie": "mission completed", "missions réussies": "missions completed",
  "Sans pseudo": "No username", "Mon cadre": "My frame",
  // Succès
  "Succès débloqués": "Achievements unlocked", "À débloquer": "To unlock", "Ils restent débloqués d’une partie à l’autre": "They stay unlocked from one game to the next",
  "Première nuit": "First night", "Survivre à la première nuit": "Survive the first night", "Une semaine": "One week", "Un mois de survie": "A month of survival",
  "Centenaire": "Centenarian", "Tous ensemble": "All together", "{#} points": "{#} points", "Forteresse": "Fortress", "Autonomes": "Self-sufficient",
  "Mains d’or": "Golden hands", "Ça roule": "Rolling", "Doigts de fée": "Nimble fingers", "Pêcheur": "Angler", "Basse-cour": "Farmyard", "Meilleur ami": "Best friend",
  "Héros du quartier": "Neighborhood hero", "Explorateur": "Explorer", "Le trésor du bunker": "The bunker’s treasure", "Commando": "Commando",
  "Plus jamais seuls": "Never alone again", "Chef de meute": "Pack leader", "Le cœur sur la main": "Big-hearted", "Bâtisseur du bastion": "Stronghold builder",
  "Première étoile": "First star", "Assaut parfait": "Perfect assault", "Vainqueurs": "Victors",
  // Défis
  "Défis du jour · {#} / {#}": "Daily challenges · {#} / {#}", "{#} h {#}": "{#} h {#}", "Pêche {#} poissons": "Catch {#} fish", "Fouille {#} lieux": "Search {#} places",
  "Crochète une serrure": "Pick a lock", "Les {#} = {#} colis": "All {#} = {#} package", "Défi de la semaine": "Weekly challenge",
  "Abats {#} zombies cette semaine": "Kill {#} zombies this week", "Réussi = {#} colis": "Done = {#} package",
  "Les défis avancent dans toutes tes parties et sont les mêmes pour tous les joueurs": "Challenges progress across all your games and are the same for every player",
  "La grande horde · encore {#} j {#} h": "The great horde · {#} d {#} h left",
  "Nuits et combats plus durs pour tout le monde. Objectif commun : abattre des zombies": "Harder nights and fights for everyone. Shared goal: kill zombies",
  "Ta part": "Your share", "zombie. Objectif atteint = un colis pour chaque participant": "zombie. Goal reached = a package for every participant",
  // Profil
  "Changer": "Change", "Pas encore de pseudo": "No username yet", "Choisir un pseudo": "Choose a username", "Changer d’avatar": "Change avatar",
  "Profil": "Profile", "Mes chiffres": "My numbers", "Avatar": "Avatar", "Un portrait": "A portrait", "Historique": "History",
  "{#} partie": "{#} game", "{#} parties": "{#} games", "familles": "families", "meilleur score": "best score", "{#} j": "{#} d", "plus longue survie": "longest survival",
  "Mon cadre : Bois": "My frame: Wood", "Débloque de nouveaux cadres avec les succès": "Unlock new frames with achievements",
  "Toutes mes stats": "All my stats", "Poissons, planches, missions, morts": "Fish, planks, missions, deaths",
  "Retrouver ma partie partout": "Find my game everywhere", "bientôt": "soon",
  "Pour l’instant, ta partie est gardée sur cet appareil. Lier un compte permettra de la retrouver sur ton téléphone, ta tablette et ton ordinateur": "For now, your game is saved on this device. Linking an account will let you pick it up on your phone, tablet and computer",
  "Bois · {#} / {#} succès": "Wood · {#} / {#} achievements", "Cadre Bronze : encore {#}": "Bronze frame: {#} to go",
  // Avis
  "Ton avis compte": "Your feedback matters", "Un bug, une idée, une remarque ? Écris-nous : chaque message est lu": "A bug, an idea, a comment? Write to us: every message is read",
  "Un bug": "A bug", "Une idée": "An idea", "Autre": "Other", "{#} lettres restantes": "{#} characters left",
  "Joindre mon pseudo et les infos techniques (jour, taille d’écran, appareil) : pour retrouver le bug et, si besoin, te rendre ce que tu as perdu": "Attach my username and technical info (day, screen size, device): to track down the bug and, if needed, give back what you lost",
  "Retour": "Back", "Envoyer": "Send", "Merci ! Ton message est bien arrivé": "Thanks! Your message has arrived",
  // Inviter
  "Inviter des amis": "Invite friends", "Un colis pour toi, un pour ton ami": "A package for you, one for your friend",
  "Quand un ami utilise ton code, vous recevez chacun un colis largué sur le quartier, avec un bonus exclusif": "When a friend uses your code, you each get a package dropped on the neighborhood, with an exclusive bonus",
  "Ton code": "Your code", "Test sur l’ordinateur : pas de code créé": "Testing on the computer: no code created", "Partager": "Share", "Copier le lien": "Copy the link",
  "J’ai un code": "I have a code", "d’un ami ou spécial": "from a friend or special", "Mes bonus": "My bonuses", "aucun pour l’instant": "none yet",
  // Tombes, feu, cour
  "Les tombes": "The graves", "Au fond de la cour, contre la palissade, la famille a enterré ses disparus": "At the back of the yard, against the fence, the family has buried its dead",
  "Personne n’est mort. Pourvu que ça dure": "Nobody has died. Long may it last", "Se recueillir": "Pay respects",
  "Le feu de cheminée": "The fireplace", "Éteint": "Out", "Allumé": "Lit", "Allumer": "Light", "Éteindre": "Put out",
  "Sans feu, seules les couvertures tiennent chaud": "Without a fire, only blankets keep you warm", "{#} couverture": "{#} blanket", "{#} couvertures": "{#} blankets",
  "pour {#} personne sur {#}": "for {#} person out of {#}", "pour {#} personnes sur {#}": "for {#} people out of {#}",
  "Les autres auront froid ({#} ⚡ au lieu de {#}, −{#} PV": "The others will be cold ({#} ⚡ instead of {#}, −{#} HP",
  "Les autres auront froid ({#}": "The others will be cold ({#}", "au lieu de {#}, −{#} PV": "instead of {#}, −{#} HP",
  "{#} planche au refuge · elles servent aussi à construire et à fabriquer": "{#} plank at the refuge · they’re also used to build and craft",
  "{#} planches au refuge · elles servent aussi à construire et à fabriquer": "{#} planks at the refuge · they’re also used to build and craft",
  "Il faut un briquet pour l’allumer": "You need a lighter to light it",
  "Pas encore de barricade : la porte ne tiendra pas longtemps. Une attaque perdue en détruit un niveau": "No barricade yet: the door won’t hold for long. A lost attack destroys one level",
  "Construire : +{#} de défense · coût": "Build: +{#} defense · cost", "{#} planches (tu en as {#}": "{#} planks (you have {#}",
  "Les bacs sont vides : il faut des planches pour les préparer et semer": "The planters are empty: you need planks to prepare them and sow",
  "Construire : +{#} ration de nourriture par nuit · coût": "Build: +{#} food ration per night · cost",
  "Pas encore de tonneau sous la gouttière : l’eau de pluie est perdue": "No barrel under the gutter yet: the rainwater is wasted",
  "Construire : +{#} ration d’eau par nuit · coût": "Build: +{#} water ration per night · cost",
  "Le poulailler": "The henhouse", "Vide": "Empty", "Pas encore de poule. On en trouve au": "No chickens yet. You can find them in the",
  "Village voisin": "Nearby village", ", chez": ", from", "le brocanteur, et parfois une poule égarée arrive le matin": "the junk dealer, and sometimes a stray chicken turns up in the morning"
});
TRAD_MOTIFS.push(
  [/^Arme de (.+) : vide$/, "$1’s weapon: empty"], [/^Outil \/ éclairage de (.+) : vide$/, "$1’s tool / light: empty"], [/^Sac de (.+) : vide$/, "$1’s bag: empty"],
  [/^Arme de (.+)$/, "$1’s weapon"], [/^Outil de (.+)$/, "$1’s tool"], [/^Outil d’(.+)$/, "$1’s tool"], [/^Sac de (.+)$/, "$1’s bag"], [/^Arme d’(.+)$/, "$1’s weapon"], [/^Sac d’(.+)$/, "$1’s bag"],
  [/^(.+) : Trop fatigués$/, "$1: Too tired"], [/^(.+) : Voiture en panne$/, "$1: Car broken down"], [/^(.+) : Vidé$/, "$1: Emptied"],
  [/^Chaque portion : (.+)$/, "Each portion: $1"]
);
Object.assign(TRAD_ECRAN, {
  "Partie libre": "Free play", "Partie classée": "Ranked game", "Guide du survivant": "Survivor’s guide",
  "Commencer une nouvelle famille efface la partie en cours": "Starting a new family erases the current game",
  "{#} joueurs ont déjà tenté leur chance": "{#} players have already tried their luck",
  "eau / nuit": "water / night", "repas / nuit": "meals / night", "planches": "planks", "Bilan détaillé ›": "Full summary ›",
  "Le stock": "The stock", "Tout le stock": "Whole stock", "La nuit dernière": "Last night", "Marché": "Market", "Voir le marché": "See the market"
});
