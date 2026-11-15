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

/* ---------- Récits des fouilles, combats et nuits (2026-11-15) ---------- */
Object.assign(TRADUCTIONS.en, {
  "{nom} devient « {titre} » : {effet} !": "{nom} becomes “{titre}”: {effet}!",
  "{nom} éclaire les lieux avec la lampe torche (1 pile utilisée).": "{nom} lights up the place with the flashlight (1 battery used).",
  "La lampe torche n’a plus de piles.": "The flashlight is out of batteries.",
  "Fouille à tâtons dans le noir.": "Fumbling around in the dark.",
  "{nom} ouvre la porte avec {outil}.": "{nom} opens the door with {outil}.",
  "Porte forcée à la brute, ça fait du bruit.": "Door forced open by brute strength: that makes noise.",
  "Moral bas : l’équipe fouille mal.": "Low morale: the team searches poorly.",
  "Bon moral : l’équipe fouille avec entrain (+{n} objet).": "Good morale: the team searches eagerly (+{n} item).",
  "{noms} sont fatigués : fouille et combat moins efficaces.": "{noms} are tired: searching and fighting less effectively.",
  "{noms} est fatigué : fouille et combat moins efficaces.": "{noms} is tired: searching and fighting less effectively.",
  "{nom} crochète la serrure en silence ({epingles} cassée(s)).": "{nom} quietly picks the lock ({epingles} broken).",
  "{nom} crochète la serrure en silence.": "{nom} quietly picks the lock.",
  "Vous pêchez {poissons} ({n} touche(s) sur {l}).": "You catch {poissons} ({n} bite(s) out of {l}).",
  "Aucun poisson cette fois : ils ont tous filé.": "No fish this time: they all got away.",
  "L’étang est gelé : impossible de pêcher avant le printemps.": "The pond is frozen: no fishing until spring.",
  "{nom} pêche {poissons}.": "{nom} catches {poissons}.", "rien": "nothing",
  "{nom} abat un arbre : {planches}.": "{nom} fells a tree: {planches}.",
  "Sans hache en main, impossible de couper du bois.": "Without an axe in hand, there’s no way to chop wood.",
  "Il ne reste plus un arbre debout dans la forêt.": "Not a single tree is left standing in the forest.",
  "Sans canne à pêche, impossible d’attraper les poissons.": "Without a fishing rod, there’s no way to catch the fish.",
  "À la pompe à main, vous remplissez {j} dans la cuve (il reste {n} L).": "With the hand pump, you fill {j} from the tank ({n} L left).",
  "La cuve de la station est vide.": "The gas station tank is empty.",
  "Vous passez devant une voiture abandonnée sans vous arrêter.": "You walk past an abandoned car without stopping.",
  "Le kit de siphonnage est fichu : le tuyau a cédé.": "The siphon kit is done for: the hose gave way.",
  "Vous siphonnez {n} L d’essence dans une voiture abandonnée": "You siphon {n} L of gas from an abandoned car",
  " (réservoir : {n} L)": " (tank: {n} L)", " et remplissez {j}": " and fill {j}", " (le reste déborde)": " (the rest spills over)",
  "Le tuyau gargouille, l’essence gicle… le bruit attire des zombies : vous filez les mains vides !": "The hose gurgles, gas splashes everywhere… the noise draws zombies: you run off empty-handed!",
  "+{n} L d’essence": "+{n} L of gas", ", {j} remplis": ", {j} filled",
  "{z} rôde en ville : un zombie que tout le monde craint.": "{z} is prowling the town: a zombie everyone fears.",
  "Une radio permettrait de savoir où.": "A radio would tell you where.",
  "{z} s’échappe, blessée ({pv} / {max} PV). Elle rôdera ailleurs cette nuit.": "{z} escapes, wounded ({pv} / {max} HP). She’ll prowl somewhere else tonight.",
  "{z} s’échappe, blessé ({pv} / {max} PV). Il rôdera ailleurs cette nuit.": "{z} escapes, wounded ({pv} / {max} HP). He’ll prowl somewhere else tonight.",
  "{z} est tombée sous les coups de {par} ! La nouvelle fait le tour du quartier (moral +{m}). Sur sa dépouille : {butin}. Son trophée trône au salon.": "{z} has fallen to {par}! The news spreads around the neighborhood (morale +{m}). On the body: {butin}. Its trophy now sits in the living room.",
  "{z} est tombé sous les coups de {par} ! La nouvelle fait le tour du quartier (moral +{m}). Sur sa dépouille : {butin}. Son trophée trône au salon.": "{z} has fallen to {par}! The news spreads around the neighborhood (morale +{m}). On the body: {butin}. Its trophy now sits in the living room.",
  // Combat
  "{nom} porte : {objets}.": "{nom} wears: {objets}.",
  "Le blindage du camion encaisse 1 mine sans dégâts.": "The truck’s armor takes 1 mine without damage.", "Le blindage du camion encaisse {n} mines sans dégâts.": "The truck’s armor takes {n} mines without damage.",
  "Une mine explose sous {nom} (−{n} PV), son casque l’a protégé !": "A mine explodes under {nom} (−{n} HP), the helmet helped!",
  "Une mine explose sous {nom} (−{n} PV) !": "A mine explodes under {nom} (−{n} HP)!",
  "Les défenseurs portent des gilets (armurerie niveau {n}) : chaque tir perd {t} dégâts, chaque coup {c}.": "The defenders wear vests (armory level {n}): each shot loses {t} damage, each blow {c}.",
  "Les remparts (niveau {n}) rendent les défenseurs plus coriaces.": "The ramparts (level {n}) make the defenders tougher.",
  "Le camion enfonce l’entrée avec son pare-buffle : chaque défenseur perd {n} PV !": "The truck rams the entrance with its bull bar: each defender loses {n} HP!",
  "La tourelle du camion tirera à chaque tour (niveau {n}).": "The truck’s turret will fire every turn (level {n}).",
  "avec {arme}": "with {arme}", "à mains nues": "bare-handed",
  "n’a plus de balles, frappe avec la crosse": "is out of bullets, hits with the butt", "n’a plus de cartouches, frappe avec la crosse": "is out of shells, hits with the butt",
  "Le bruit du tir attire un {z} !": "The gunshot draws a {z}!",
  "{z} explose en tombant !": "{z} explodes as it falls!",
  "{nom} est éclaboussée (−{n} PV).": "{nom} is splattered (−{n} HP).", "{nom} est éclaboussé (−{n} PV).": "{nom} is splattered (−{n} HP).",
  "{z} hurle : un {t} accourt !": "{z} screams: a {t} comes running!", "{z} hurle dans le vide.": "{z} screams into the void.",
  "{z} fouille vos sacs et y fourre {n} objets du butin !": "{z} rummages through your bags and grabs {n} items of loot!",
  "{z} s’enfuit avec {n} objets de votre butin !": "{z} runs off with {n} items of your loot!",
  "Un Rampant s’extirpe du ventre de {z} !": "A Crawler wriggles out of {z}’s belly!", "{z} se tord, mais rien ne sort.": "{z} writhes, but nothing comes out.",
  "{z} gonfle et palpite.": "{z} swells and throbs.", "{z} frappe {nom} (−{n} PV).": "{z} hits {nom} (−{n} HP).",
  "Raja surgit en rugissant et bondit sur les défenseurs !": "Raja bursts in roaring and leaps at the defenders!", "Raja surgit en rugissant et bondit sur les zombies !": "Raja bursts in roaring and leaps at the zombies!",
  "Raja lacère {z} (−{n}).": "Raja mauls {z} (−{n}).", "Raja terrasse {z} !": "Raja brings down {z}!",
  "La tourelle tire sur {z} : −{n}": "The turret fires at {z}: −{n}", ", à terre !": ", down!",
  "La tourelle tire sur {z} : la balle ricoche sur son gilet.": "The turret fires at {z}: the bullet bounces off the vest.",
  "{nom} se protège.": "{nom} defends.", "{nom} soigne ses blessures avec {soin} ({n} PV).": "{nom} treats their wounds with {soin} ({n} HP).",
  "{nom} soigne {autre} avec {soin} ({n} PV).": "{nom} treats {autre} with {soin} ({n} HP).", "{nom} lance un cocktail Molotov !": "{nom} throws a Molotov cocktail!",
  "{z} ne craint pas le feu.": "{z} isn’t afraid of fire.", "{z} brûle : −{n}": "{z} burns: −{n}",
  "{nom} pousse {z}… qui ne recule pas !": "{nom} shoves {z}… who doesn’t budge!", "{nom} repousse {z} : il perd son tour.": "{nom} shoves {z} back: it loses its turn.",
  " : coup à la tête ! {z} −{n}": ": headshot! {z} −{n}", " vise la tête… et rate {z}.": " aims for the head… and misses {z}.",
  "{nom} frappe": "{nom} hits", " (gilet)": " (vest)",
  "{nom} se brûle en le frappant (−{n} PV).": "{nom} gets burned hitting it (−{n} HP).",
  "Vous récupérez les {n} objets que {z} vous avait volés.": "You get back the {n} items {z} had stolen.",
  "L’équipe prend la fuite !": "The team runs for it!", "La retraite échoue, les défenseurs vous rattrapent !": "The retreat fails, the defenders catch up with you!",
  "La fuite échoue, les zombies vous rattrapent !": "The escape fails, the zombies catch up with you!",
  // Nuit
  "Le feu de cheminée a brûlé toute la nuit (la planche d’hier a suffi).": "The fire burned all night (yesterday’s plank was enough).",
  "Le feu de cheminée a brûlé toute la nuit (−{p} planche(s), elle durera {n} nuits).": "The fire burned all night (−{p} plank(s), it will last {n} nights).",
  "Le feu de cheminée a brûlé toute la nuit (−{p} planche(s)).": "The fire burned all night (−{p} plank(s)).",
  "Le feu s’est éteint : plus de planches à brûler.": "The fire went out: no more planks to burn.", "Le feu s’est éteint : plus de briquet pour le rallumer.": "The fire went out: no lighter to relight it.",
  "{nom} dort mal après sa canette (+{n} ⚡ seulement).": "{nom} sleeps badly after the energy drink (only +{n} ⚡).",
  "{nom} est parti chercher à manger ailleurs. La défense de nuit baisse.": "{nom} has gone off to look for food elsewhere. Night defense drops.",
  "{nom} n’a rien eu à manger ce soir ({n} nuit sur {max} avant qu’il parte).": "{nom} got nothing to eat tonight ({n} night of {max} before he leaves).",
  "Les poules ont bu {n} ration(s) d’eau": "The chickens drank {n} water ration(s)", "La poule a bu {n} ration(s) d’eau": "The chicken drank {n} water ration(s)",
  " et pondu {n} œuf(s) (+{n} ration(s)).": " and laid {n} egg(s) (+{n} ration(s)).", ", pas d’œuf cette nuit.": ", no eggs tonight.",
  "Plus d’eau pour les poules : l’une d’elles est morte. Vous la mangerez (+{n} rations).": "No water left for the chickens: one of them died. You’ll eat it (+{n} rations).",
  "Nuit glaciale pour {noms} : pas de feu ni assez de couvertures (+{r} ⚡ au lieu de +{n}, −{d} PV).": "A freezing night for {noms}: no fire and not enough blankets (+{r} ⚡ instead of +{n}, −{d} HP).",
  "La grande horde rôde : les zombies sont plus nombreux cette nuit.": "The great horde is prowling: there are more zombies tonight.",
  "Un piège à zombies a servi (+{n} de défense), il est cassé.": "A zombie trap did its job (+{n} defense), and it’s broken now.",
  "Attaque de nuit repoussée (force {s} contre votre défense {d}).": "Night attack driven off (strength {s} against your defense {d}).",
  "Attaque de nuit (force {s} contre votre défense {d}) : ils saccagent {objets}.": "Night attack (strength {s} against your defense {d}): they wreck {objets}.",
  "Attaque de nuit (force {s} contre votre défense {d}).": "Night attack (strength {s} against your defense {d}).",
  "Ils arrachent une partie de la barricade (niveau {n}).": "They tear down part of the barricade (level {n}).",
  "La bâche a recueilli de l’eau de pluie (+{n} ration(s)).": "The tarp collected rainwater (+{n} ration(s)).", "Un collet a attrapé du gibier (+{n} ration(s)).": "A snare caught some game (+{n} ration(s)).",
  "Le récupérateur a recueilli 1 ration d’eau.": "The collector gathered 1 water ration.", "Le récupérateur a recueilli {n} rations d’eau.": "The collector gathered {n} water rations.",
  "Le potager a donné 1 ration de nourriture.": "The garden produced 1 food ration.", "Le potager a donné {n} rations de nourriture.": "The garden produced {n} food rations.",
  "Les Pilleurs sont partis avec 1 objet de votre butin.": "The Looters made off with 1 item of your loot.", "Les Pilleurs sont partis avec {n} objets de votre butin.": "The Looters made off with {n} items of your loot.",
  "Au dîner : {plats}.": "For dinner: {plats}.", "Gâté(s) : {plats}, à jeter.": "Spoiled: {plats}, to be thrown out.",
  "Des herbes fraîches ont poussé au potager.": "Fresh herbs have grown in the garden.",
  "La porte est restée ouverte toute la nuit (défense −{n}). Au matin, quelqu’un la referme enfin.": "The door stayed open all night (defense −{n}). In the morning, someone finally closes it.",
  "{nom} s’installe au coin de la rue aujourd’hui : allez voir le marché !": "{nom} has set up at the street corner today: go check out the market!",
  "Nuit calme.": "A quiet night.",
  "Trajet en voiture (⛽ −{l} L, reste {r} L) : le moteur fait du bruit.": "Drive by car (⛽ −{l} L, {r} L left): the engine makes noise.",
  "Des pillards ont fouillé {lieu} cette nuit : il n’y reste plus que {n} objet(s).": "Raiders searched {lieu} last night: only {n} item(s) left there.",
  "Nouveau lieu découvert :": "New place discovered:", "Mission ratée :": "Mission failed:", "Nouvelle mission : {titre} ({n} jours).": "New mission: {titre} ({n} days).",
  // Folie
  "{nom} a perdu la raison. Une nuit, elle est sortie sans un mot et n’est jamais revenue.": "{nom} lost their mind. One night, she walked out without a word and never came back.",
  "{nom} a perdu la raison. Une nuit, il est sorti sans un mot et n’est jamais revenu.": "{nom} lost their mind. One night, he walked out without a word and never came back.",
  "Pris de folie, {nom} frappe violemment {autre} (−{n} PV).": "In a fit of madness, {nom} violently hits {autre} (−{n} HP).",
  "{nom} a hurlé toute la nuit : personne n’a dormi (−15 ⚡ chacun).": "{nom} screamed all night: nobody slept (−15 ⚡ each).",
  "{nom} est sortie en pleine nuit… et revient au petit matin, couverte de griffures (−{n} PV).": "{nom} went out in the middle of the night… and came back at dawn covered in scratches (−{n} HP).",
  "{nom} est sorti en pleine nuit… et revient au petit matin, couvert de griffures (−{n} PV).": "{nom} went out in the middle of the night… and came back at dawn covered in scratches (−{n} HP).",
  "{nom} a laissé la porte grande ouverte : des zombies sont entrés !": "{nom} left the door wide open: zombies got in!",
  "{autre} est blessée (−{n} PV)": "{autre} is wounded (−{n} HP)", "{autre} est blessé (−{n} PV)": "{autre} is wounded (−{n} HP)", ", la barricade est abîmée": ", the barricade is damaged",
  "{nom} a mangé en cachette une partie des réserves (−{n} rations).": "{nom} ate in secret from the supplies (−{n} rations).",
  "{nom} a mangé en cachette une partie des réserves.": "{nom} ate in secret from the supplies.",
  "Personne n’a mangé ce soir : la faim baisse.": "Nobody ate tonight: hunger rises.", "Rien à manger pour {noms} : la faim baisse.": "Nothing to eat for {noms}: hunger rises.",
  "Personne n’a bu ce soir : la soif baisse.": "Nobody drank tonight: thirst rises.", "Rien à boire pour {noms} : la soif baisse.": "Nothing to drink for {noms}: thirst rises."
});

/* ---------- Textes des écrans : lot 2 (départ, combat, résultat, nuit), 2026-11-15 ---------- */
Object.assign(TRAD_ECRAN, {
  // Ta famille
  "Ta famille": "Your family", "Ton pseudo": "Your username", "Choisir": "Choose",
  "La même pour tous aujourd’hui": "The same for everyone today", "Au hasard, sans classement": "Random, unranked",
  "J’ai un code d’invitation": "I have an invite code", "Préparer le sac": "Pack the bag", "Trait précédent": "Previous trait", "Trait suivant": "Next trait",
  "Code d’invitation reçu : {#} (toucher pour valider)": "Invite code received: {#} (tap to confirm)",
  // Le sac
  "{#} s": "{#} s", "Ils arrivent ! Choisis ce que la famille emporte avant la fin du compte à rebours": "They’re coming! Choose what the family takes before the countdown ends",
  "Le sac": "The bag", "{#} pl": "{#} sl.",
  "Partie classée : même maison, mêmes lieux et mêmes nuits pour tous les joueurs aujourd’hui. Ton score ira au classement": "Ranked game: same house, same places and same nights for every player today. Your score goes on the leaderboard",
  "Partie libre : maison et lieux au hasard, pas de classement": "Free play: random house and places, no leaderboard",
  "Bonus (pub": "Bonus (ad", "Partir": "Leave", "Trop tard": "Too late",
  "Les zombies enfoncent la porte. Vous fuyez avec ce qu’il y a dans le sac": "The zombies break down the door. You flee with whatever is in the bag",
  // Astuces (bulle)
  "Vite ! Touche les objets pour les mettre dans le sac. Tout servira : de l’eau et à manger d’abord, puis de quoi se défendre et s’éclairer": "Hurry! Tap items to put them in the bag. Everything will be useful: water and food first, then something to defend yourself and see in the dark",
  "Ne plus montrer d’astuces": "Don’t show tips anymore", "ou touche n’importe où": "or tap anywhere", "OK": "OK",
  // Nuit
  "Fin du jour {#}": "End of day {#}", "{#} (un point par survivant) · Score : {#}": "{#} (one point per survivor) · Score: {#}",
  // Combat
  "Tour {#}": "Turn {#}", "Mains nues · {#}-{#}": "Bare hands · {#}-{#}", "Frapper": "Hit", "Tête {#}%": "Head {#}%", "Pousser {#}%": "Shove {#}%",
  "Protéger": "Defend", "Soigner": "Heal", "Jouer": "Play", "Auto": "Auto", "Fuir": "Run", "Tigre": "Tiger", "Cocktail ×{#}": "Molotov ×{#}",
  "Victoire": "Victory", "En fuite": "Fled", "Défaite": "Defeat", "tours": "turns", "abattus": "killed", "vie perdue": "health lost", "Plus d’arme": "No weapon",
  "La voie est libre : il reste": "The way is clear:", "objets à fouiller ici": "items left to search here", "Fouiller les lieux": "Search the place",
  "Les zombies": "The zombies", "Les défenseurs": "The defenders", "Ce qui s’est passé": "What happened", "L’équipe": "The team",
  "Va hurler": "Will scream", "Vise": "Targets", "Choisis l’action de chacun, puis Jouer": "Choose everyone’s action, then Play",
  // Résultat de fouille
  "rapportés": "brought back", "laissés sur place": "left behind", "reste ici": "left here", "Combat gagné en {#} tours": "Fight won in {#} turns",
  "Butin rapporté": "Loot brought back", "Laissé sur place (plus de place": "Left behind (no more room", "Un sac permet de rapporter plus": "A bag lets you bring back more",
  "Retour au refuge": "Back to the refuge", "Rien trouvé": "Nothing found", "Vous fuyez les mains vides": "You flee empty-handed"
});
TRAD_MOTIFS.push(
  [/^Prendre (.+) \((\d+) places?$/, "Take $1 ($2 slot(s)"], [/^Retirer (.+)$/, "Remove $1"], [/^Changer le prénom de (.+)$/, "Change $1’s name"], [/^Changer le prénom d’(.+)$/, "Change $1’s name"],
  [/^Soigner, faire boire ou manger (.+)$/, "Heal $1, or give them something to drink or eat"], [/^(.+), (\d+) PV$/, "$1, $2 HP"],
  [/^(\d+)\/(\d+) PV · (.+)$/, "$1/$2 HP · $3"], [/^(.+) ×(\d+)$/, "$1 ×$2"]
);

/* ---------- Règles du guide (2026-11-15) ----------
   Rangées par titre français de la règle. Chaque {#} reçoit, dans l'ordre, les nombres du texte français
   (les chiffres viennent de BAL) : garder le même nombre de {#} et le même ordre. */
var REGLES_EN = {
  "Boire et manger": "Every night, each member drinks {#} water ration and eats {#} food ration: that makes up for what they lost during the day (−{#} thirst, −{#} hunger). If a gauge is below {#}, they take one more ration, if there’s enough left for the others. You can also have them drink or eat whenever you like by tapping their card, then “Heal · drink, eat”. A gauge at {#} costs {#} HP per night.",
  "L’énergie": "A trip costs {#} ⚡ (near), {#} ⚡ (medium) or {#} ⚡ (far). By car, only the search costs energy ({#} ⚡). Below {#} ⚡ when leaving, you’re tired: worse at searching and fighting. Sleeping restores {#} ⚡ ({#} if the night is freezing). An energy drink gives +{#} ⚡ and +{#} thirst, but you sleep worse.",
  "Le froid et le feu": "Nights are cold. A fire in the fireplace (tap the fireplace in the living room or the bedroom) warms the whole family: you need a lighter at the refuge, and it burns {#} plank per night. With a fire, you sleep better (+{#} ⚡) and morale goes up (+{#}). Without a fire, a blanket keeps {#} people warm. Those who are cold recover less ({#} ⚡ instead of {#}) and lose {#} HP. When there are no planks left, the fire goes out.",
  "Les expéditions": "Pick {#} or {#} members, equip them (weapon, tool, bag), then tap Scavenge. Each place has a real list of items that never comes back: once it’s “Emptied”, it’s over. Dark place: you need a flashlight (and batteries) or at least a lighter. Locked door: a toolbox, a crowbar, or hairpins to pick the lock. Everyone carries {#} items in their arms, plus their bag: whatever doesn’t fit stays behind.",
  "Les combats": "At the start of each turn, a bubble above each zombie says what it’s going to do: who it will bite (and how much it could hurt), or whether it will scream. Tap a zombie to target it, then pick everyone’s action: ⚔️ Hit; 🎯 Aim for the head ({#}% chance, damage ×{#}, armor doesn’t count); ✋ Shove ({#}% chance the zombie loses its attack, {#}% against a Brute); 🛡️ Defend (damage taken ÷{#}); 🩹 Heal (a healing item on the most wounded); 🔥 Molotov (a Molotov cocktail from the stock, crafted in the workshop with {#} alcohol + {#} rag, and a lighter in the family to light it: {#} to {#} damage to every zombie). Running away works {#}% of the time, but you bring back half as much. Weapons wear out with every hit; a firearm uses one round and sometimes draws an extra zombie. The 🤖 Auto button plays for you.",
  "Pêche et poules": "The pond (from day {#}): with a fishing rod in the tool slot, each angler gets {#} casts: when the float goes under, tap “Strike” in time to catch a fish ({#} rations each). The rod wears out with each trip, and you can craft one. Fish breed slowly (+{#} every {#} nights), but only if at least {#} are left: empty the pond and it will give nothing more. Chickens often lay an egg at night (+{#} ration), drink {#} water ration per {#} chickens, and each chicken adds +{#}% attack risk. Without water, one of them dies.",
  "La cuisine": "In the kitchen (or the 🍲 tab of the refuge), the wood stove turns your supplies and ingredients (spices, oil, flour, mushrooms, berries, herbs) into dishes: pasta soup ({#} portions), herb fish ({#} portions), forest stew ({#} portions), flatbreads ({#} portions), fried rice ({#} portions), berry pie ({#} portions). Each dish burns one plank and costs the cook {#} ⚡. A portion is more filling than a ration (+{#} to +{#} hunger instead of +{#}) with a bonus (morale, HP, energy), but dishes spoil after {#} nights (flatbreads after {#}). At night, everyone eats a dish first if there is one. The garden sometimes yields herbs. On a day when you’ve cooked, the stove stays lit and someone from the family is at the stove (the cook, if there is one).",
  "Le dernier recours": "If the family is starving and there’s truly nothing left, a terrible option may be offered at bedtime: sacrificing one of your own (+{#} rations). Morale collapses (−{#}) and madness sets in among the survivors: it rises every night (unless morale stays above {#}), makes them search worse and drives them to mad acts (hitting someone, screaming all night, going out alone, leaving the door open, stealing supplies). At {#}, they leave forever. This content can be turned off in the menu (“Mature” setting). A door left open by someone who has gone mad stays open in the living room: tap it to close it, otherwise the next night defense drops by {#} and the attack risk goes up.",
  "La Légende du mois": "The player who ends the month with the best score (in a ranked game) becomes the Legend of the following month: for that whole month, a crown appears next to their username everywhere (leaderboard, clans, chat), they wear the golden frame, have Raja the tiger at their side, and everyone sees them on the home screen. They receive a package on the day they are crowned. During the current month, it’s a race for the next crown: the “This month” leaderboard is live, and a ranked game still in progress appears there with “● in progress” and its current score, updated about every {#} minutes. During your ranked game, a gauge shows where you stand compared to the month’s no. {#}, and the night tells you when you pass the halfway mark, three quarters, then when you take the lead. On the {#}st of each month, no. {#} is crowned and enters the hall of fame (leaderboard tab), then a new race begins.",
  "Le tigre de la Légende": "They say that when the cities fell, a survivor found a starving tiger in the abandoned zoo. Every night, they slipped it a little meat through the rusty bars, until the day the tiger followed them. It’s called Raja, and it only stays with the Legend of the Month. Once per game, the Legend can unleash Raja in any fight (trip, apartment block raid, famous zombie, war assault): every zombie falls; the Colossus and famous zombies lose {#}% of their health; in clan wars, each defender loses {#}% of their health. Raja rests in the living room, next to the door, and changes masters when the Legend is dethroned.",
  "Les défis": "Every day, {#} challenges (the same for every player): kill zombies, scavenge, cook, fish, chop wood… They progress across all your games. Completing all {#} earns a package (a supply drop with a bonus); the big weekly challenge earns another. Menu ☰ → Challenges.",
  "Les zombies célèbres": "From day {#}, a unique zombie prowls the town: <b>The Bride</b>, <b>The Firefighter</b>, <b>The Butcher</b>. It changes place every night; with a radio, the nightly summary says where it was seen and its card is marked 💀. Going to its place means facing it for sure; it keeps its wounds if you run. Once killed, it leaves rare loot, lifts morale (+{#}) and its trophy sits on the living room mantelpiece. The next one arrives {#} days later.",
  "Les saisons": "A season lasts {#} game days, in this order: 🍂 <b>Autumn</b> (rain: +{#} water ration per night with a collector); ❄️ <b>Winter</b> (cold: a blanket only keeps one person warm, the fire burns one plank per night, +{#} hunger per day, the pond is frozen, the garden gives nothing); 🌱 <b>Spring</b> (the garden gives twice as much, +{#} morale per night); ☀️ <b>Summer</b> (+{#} thirst per day). The season is shown next to the chapter, under the day: tap it to see where you are and what each season changes; the nightly summary announces it when it changes.",
  "La grande horde du week-end": "Every weekend, from Friday evening to Monday morning, a great horde sweeps over every player at once: night attacks are more likely (+{#}%) and stronger (+{#}), and fights bring more zombies. All the zombies killed during the horde, by every player, add up: if the shared goal is reached, each participant receives a package. Menu ☰ → Challenges.",
  "L’héritage": "When your family dies, it leaves one item to the next (the most valuable is picked in advance on the end screen, you can choose another) and a letter. The new family finds the chest as they set off; the letter stays by the graves, in the yard.",
  "Les tombes": "Every lost member has a headstone at the back of the yard, against the fence. Tap the graves to see who fell, how and on which day, and to pay your respects: once a day, morale goes up a little (+{#}).",
  "L’expérience des survivants": "Each member earns titles by actually doing things: ⚔️ <b>Veteran</b> ({#} zombies killed): +{#} damage in combat; 💀 <b>Zombie slayer</b> ({#} zombies killed): +{#} more damage (+{#} in total); 🗺️ <b>Scout</b> ({#} searches): each trip costs them {#} ⚡ less; 🗝️ <b>Lockpicker</b> ({#} locks picked): wider green zone when picking locks; 🔨 <b>Handyman</b> ({#} workshop jobs): workshop jobs cost them {#} ⚡ less; 🍲 <b>Chef</b> ({#} dishes cooked): +{#} portion per cooked dish (for the whole family); 🩹 <b>Tough nut</b> ({#} serious wounds survived): −{#} damage on every zombie hit taken. Titles and counters show on the member’s card (tap it). An experienced member is worth their weight in gold: losing them hurts.",
  "Les clans": "From day {#}, your family can found or join a clan of up to {#} families (menu ☰ → Clans). After leaving a clan, you must wait {#} h before joining or founding another (not after being kicked by the leader, nor when the family dies). Everyone keeps their own house and game; the clan adds {#} rooms: the great hall, the treasury and the fortified yard. The clan stockpile fills with everyone’s deposits (supplies, healing, ammo, materials): you can take {#} items per day, and at most {#} more than you’ve deposited. It pays for the defenses: ramparts, mines, watchtowers (+{#} night defense for each family), the armory and the truck. A full clan can go to war against another clan in its league: {#} days, one assault per member per day, stars to win and a share of the enemy stockpile as loot. The clan’s last {#} wars (opponent, stars, result, trophies) are kept in the history, at the bottom of the “The war” window. Victories earn trophies and move you up the leagues (Scrap, Bronze, Silver, Gold, Legend).",
  "Les opérations du clan": "From time to time, the clan can plan an operation together (stronghold → Operations, the notice board in the great hall, or the big card at the top of “Where to send the team?”). The first one: <b>the abandoned apartment block</b>, only once per clan. Each family sends one volunteer (who stays at the stronghold and no longer scavenges) with whatever it entrusts to them: ammo, healing, vest, helmet, shield. With {#} volunteers, the leader launches the raid and plays it: {#} floors, each harder than the last, with the Colossus on the roof. Between floors, the game shows the odds of clearing the next one: go up or head back down with the loot. Each volunteer still standing brings back {#} items, {#} more with the homemade trailer (a stronghold build). Afterwards, everyone watches the raid replay, gets their volunteer back (wounded, or dead for good), what’s left of their kit and their share of the loot; {#}% goes to the clan stockpile. A well-armed team (firearms, ammo, vests, first aid kits) has a good chance of reaching the roof; a light team will have to head down sooner.",
  "La discussion du clan": "To get organized: menu ☰ → Clans → Clan chat, or the fireplace in the stronghold’s great hall (on PC, the right-hand panel). Quick messages are sent with one tap (“I’m ready for the raid!”…), and clan life (deposits, raid, war) shows up in gray. A red dot on the ☰ button counts new messages, on every screen. Swear words are hidden; the leader can delete a message, and anyone can report one (🚩) to the game team.",
  "Les échanges du clan": "In the clan chat, the 🤝 button to the left of the text box lets you propose a trade: choose what you give and what you ask for (supplies, healing, ammo or materials), and the offer appears as a card for the whole clan. Another member accepts it with one tap if they have the requested items. To keep it fair: at most {#} items on each side, only one trade (proposed or accepted) every {#} hours, one open offer at a time, and you can’t ask for more than one and a half times the value of what you give. What you give is set aside as soon as you post the offer; if nobody takes it within {#} hours (or if you cancel it), everything comes back to you. When your offer is accepted, you get your share on your next visit to the chat.",
  "Équipement de guerre": "For clan wars, craft in the workshop (or find at the police station, the fire station, the military base): the bulletproof vest (−{#} damage per hit taken), the makeshift helmet (mines and explosions ÷{#}) and the riot shield (“Defend” only lets {#}% of the damage through). They’re worn automatically by the assault team, one of each per member, and lose one notch per assault. The stronghold’s armory puts vests on the defenders: each shot loses {#} damage per level (even to the head), a melee blow a little less.",
  "Le camion du clan": "At the stronghold, Truck tab: the clan upgrades its truck with the stockpile. Bull bar: each defender loses {#} to {#} HP per level at the start of an assault. Armor: the truck absorbs one mine per level. Turret: each turn, it fires at the weakest defender ({#} damage per level, plus {#} to {#}, slowed by the enemy armory). It serves every member’s assault.",
  "La forêt et le bois": "The forest (from day {#}): each survivor with an axe in hand (weapon slot) fells a tree and brings back {#} or {#} planks. It holds about {#} planks in all, and the trees don’t grow back. Each trip wears the axe (−{#}), and zombies prowl among the trees: the axe is also your best weapon, so go easy on it.",
  "Le monde bouge": "From day {#}, raiders sometimes come through at night and empty part of a place you haven’t finished: don’t dawdle. From day {#}, fleeing raiders may also abandon a stash ({#} to {#} items) in an almost empty place: listen to the radio and the nightly summary. New secret places reveal themselves over time (day {#}, {#}, {#}…), {#} days earlier if you have a radio. Families that hold out a long time also discover late-game places, very rich but very dangerous: the abandoned zoo (day {#}), the airport ({#}), the prison ({#}) and the power plant ({#}). Missions also come along, with a deadline: deliver an item or go rescue someone. The 🎯 button at the bottom of the screen shows them.",
  "Événements et rencontres": "Almost every morning, an event comes knocking: a wounded stranger, raiders, a storm… It’s your choice (the first option is always the safest). The same event won’t come back for {#} days. After day {#}, new dangers appear: an epidemic, a military convoy, an organized gang, a pack of dogs… On the way back from a search, the team sometimes has an encounter: a dialogue where every choice counts, sometimes with a 🎲 percentage chance (higher if someone in the team has the right trait). Each encounter happens only once per game, and some only take place in a specific location, like the zoo, the prison, the airport or the power plant.",
  "La nuit": "Zombies may attack, harder and harder as the days go by. Your defense = weapons in hand + barricade (+{#} per level) + trap + Rex. A lost attack wounds someone, costs food and destroys one barricade level. Without a blanket or a lighter, the night is freezing.",
  "Le refuge": "Build: barricade, water collector, vegetable garden (with planks). Craft, repair, dismantle: each job costs the most rested member {#} ⚡. The summary at the top of the Build tab sums up everything that protects and feeds the family. Each barricade level shows on the house windows: a few planks, then tight planks, then sheet metal and barbed wire. Tap a window to see the barricade and upgrade it. The family lives in the house: whoever is at the refuge and fit sits on the living room couch, whoever is exhausted rests in their bed, in the bedroom. A recruit takes the place of the member they replace; if that member is still there, they keep busy in the storeroom.",
  "La voiture": "The neighbor’s car is broken down: find a battery, a wheel and a fan belt, then drag them onto it (Car tab of the refuge). It uses {#} L per distance level, carries {#} more items, and only it can reach the distant zones. Gas: the gas station tank (on foot) holds {#} L, and each survivor sent there brings back a full jerry can. With a siphon kit at the refuge (garage, gas station, or crafted: duct tape, rag, scrap metal), you may come across an abandoned car on the way back: suck at the right moment to recover {#} to {#} L, otherwise the noise draws zombies and you have to run.",
  "Score et chapitres": "Every night, you earn {#} point per living member: keeping the whole family alive pays the most. Chapters give goals and rewards; after that, “Hold on” comes back every {#} days. In the daily game, everyone has the same game: same choices, same result. Compare your score!",
  "Crédits": "Music: “EmptyCity” by yd (public domain, CC{#}). Name filter: some of the words come from the “List of Dirty, Naughty, Obscene and Otherwise Bad Words” (LDNOOBW, github.com/LDNOOBW), CC BY {#} license, sorted and expanded for the game."
};
// Titres et thèmes du guide (affichés)
Object.assign(TRAD_ECRAN, {
  "Règles": "Rules", "Objets": "Items", "Lieux": "Places", "Zombies": "Zombies", "Famille": "Family",
  "Boire et manger": "Drinking and eating", "L’énergie": "Energy", "Le froid et le feu": "Cold and fire", "La nuit": "The night", "Les saisons": "The seasons",
  "Le dernier recours": "The last resort", "La cuisine": "Cooking", "Pêche et poules": "Fishing and chickens", "La forêt et le bois": "The forest and wood",
  "La voiture": "The car", "Les expéditions": "Trips", "Les combats": "Fights", "Les zombies célèbres": "Famous zombies", "Le monde bouge": "The world moves on",
  "Événements et rencontres": "Events and encounters", "L’expérience des survivants": "Survivor experience", "Score et chapitres": "Score and chapters",
  "Le tigre de la Légende": "The Legend’s tiger", "Les défis": "Challenges", "La grande horde du week-end": "The great weekend horde", "L’héritage": "Inheritance",
  "Les tombes": "The graves", "Les clans": "Clans", "Les opérations du clan": "Clan operations", "La discussion du clan": "Clan chat", "Les échanges du clan": "Clan trades",
  "Équipement de guerre": "War gear", "Le camion du clan": "The clan truck", "Et aussi": "And also", "Crédits": "Credits", "Le refuge": "The refuge",
  "Survivre": "Surviving", "Dehors": "Outside", "Progresser": "Progress", "La Légende du mois": "Legend of the Month",
  "Rien ne correspond à ta recherche": "Nothing matches your search", "Revoir les astuces": "Show the tips again", "L’immeuble (clan": "The apartment block (clan",
  "Toutes les règles": "All the rules", "Chercher": "Search", "Tout": "All"
});

/* ---------- Guide : fiches des objets, lieux, zombies, famille (2026-11-15) ---------- */
Object.assign(TRADUCTIONS.en, {
  "1 ration d’eau": "1 water ration", "{n} rations d’eau": "{n} water rations", "1 ration de nourriture": "1 food ration", "{n} rations de nourriture": "{n} food rations",
  "soigne {n} PV": "heals {n} HP", "dégâts {a}-{b}": "damage {a}-{b}", "défense de nuit +{n}": "night defense +{n}", "solidité {n}": "durability {n}",
  "munition : {m}": "ammo: {m}", "+{n} places de butin": "+{n} loot slots", "éclaire bien (1 pile par fouille)": "bright light (1 battery per search)", "lueur faible": "faint glow",
  "ouvre les portes verrouillées": "opens locked doors", "tient chaud 2 personnes la nuit": "keeps 2 people warm at night", "allume le feu de cheminée": "lights the fireplace",
  "moral +{n}": "morale +{n}", "révèle le danger des lieux": "reveals how dangerous places are",
  "se porte : arme": "worn as: weapon", "se porte : outil / éclairage": "worn as: tool / light", "se porte : sac": "worn as: bag",
  "1 place dans un sac": "1 slot in a bag", "{n} places dans un sac": "{n} slots in a bag", "ne prend pas de place": "takes no space",
  "Marco le brocanteur": "Marco the junk dealer", "Où le trouver": "Where to find it", "Nulle part : il faut le fabriquer.": "Nowhere: you have to craft it.",
  "Se fabrique avec": "Crafted from", "(avec {outil})": "(with {outil})", "réparer une arme": "repair a weapon", "réparer la voiture": "repair the car",
  "faire le plein de la voiture": "fill up the car", "construire le refuge": "build up the refuge", "crocheter une serrure": "pick a lock",
  "Sert à fabriquer ou à faire": "Used to craft or do", "Démonté, il donne": "Dismantled, it gives",
  "Ce qu’on peut y trouver": "What you can find there", "L’immeuble abandonné": "The abandoned apartment block",
  "Opération de clan · {n} étages · 4 à 5 volontaires · une seule fois par clan · le chef mène le raid": "Clan operation · {n} floors · 4 to 5 volunteers · only once per clan · the leader leads the raid",
  "Zombies renforcés étage après étage. Butin : {n} objets par volontaire debout, {r} de plus avec la remorque du bastion.": "Zombies get tougher floor after floor. Loot: {n} items per volunteer still standing, {r} more with the stronghold trailer."
});
Object.assign(TRAD_ECRAN, {
  "Près": "Near", "Moyen": "Medium", "Loin": "Far", "Éloigné": "Distant", "Très éloigné": "Very distant",
  "danger faible": "low danger", "danger moyen": "medium danger", "danger élevé": "high danger", "danger très élevé": "very high danger",
  "sombre": "dark", "verrouillé": "locked", "voiture obligatoire": "car required", "pêche (canne à pêche)": "fishing (fishing rod)", "bois (une hache en main)": "wood (axe in hand)",
  "secret : découvert vers le jour {#}": "secret: discovered around day {#}", "à partir du jour {#}": "from day {#}",
  "Tous les objets": "All items", "Tous les lieux": "All places", "Tous les zombies": "All zombies", "La famille": "The family",
  "{#}. Le hall": "{#}. The lobby", "{#}. Les appartements": "{#}. The apartments", "{#}. Les bureaux": "{#}. The offices", "{#}. Le dernier étage": "{#}. The top floor", "{#}. Le toit": "{#}. The roof",
  "PV": "HP", "dégâts": "damage", "dès le jour": "from day", "célèbre": "famous", "de l’immeuble": "of the block", "toit": "roof", "zoo": "zoo", "seulement": "only", "j. {#}": "d. {#}",
  "Avec les jours, ils arrivent plus souvent à plusieurs. Le bruit (tirs, voiture, porte forcée) attire du monde": "As the days go by, they come in groups more often. Noise (gunshots, car, forced doors) draws a crowd",
  "Au départ, tu peux renommer chacun ({#} lettres au plus) et lui choisir un trait de caractère : un atout, mais aussi un défaut": "At the start, you can rename each one ({#} letters max) and pick a personality trait for them: a strength, but also a flaw",
  "Les traits de caractère": "Personality traits", "Les recrues": "Recruits",
  "Si un membre meurt, une survivante peut frapper à la porte et prendre sa place (famille de {#} au maximum). Elle arrive avec un trait au hasard": "If a member dies, a survivor may knock at the door and take their place (family of {#} at most). They arrive with a random trait",
  "Rex, le chien": "Rex, the dog",
  "Après l’avoir nourri, il reste : +{#} de défense la nuit, mais il mange {#} ration chaque soir et part au bout de {#} nuits sans manger": "Once fed, he stays: +{#} defense at night, but he eats {#} ration every evening and leaves after {#} nights without food"
});

/* ---------- Lot 3 : marché, missions, mini-jeux, chien, tigre, game over, astuces (2026-11-15) ---------- */
Object.assign(TRADUCTIONS.en, {
  "La fièvre de Lucie": "Lucie’s fever", "Le convoi": "The convoy", "Appel de détresse": "Distress call",
  "Chez les voisins, la petite Lucie brûle de fièvre. Son père supplie : un antibiotique ou une trousse de soins, vite.": "Next door, little Lucie is burning with fever. Her father begs: an antibiotic or a first aid kit, quickly.",
  "Un convoi de survivants passera bientôt. Ils réparent leurs camions et échangent 10 planches contre une trousse, 2 canettes et un jerrican.": "A convoy of survivors will pass by soon. They’re repairing their trucks and will trade a first aid kit, 2 energy drinks and a jerry can for 10 planks.",
  "📻 Une voix à la radio : quelqu’un est coincé à LIEU, blessé. Il faut y aller (et revenir vivant) avant la fin du délai.": "📻 A voice on the radio: someone is trapped at LIEU, wounded. You must go there (and come back alive) before the deadline.",
  "Lucie va mieux. Son père vous apporte des planches et des clous de son atelier.": "Lucie is better. Her father brings you planks and nails from his workshop.",
  "Les volets des voisins sont restés fermés ce matin. Personne n’ose en parler.": "The neighbors’ shutters stayed closed this morning. Nobody dares talk about it.",
  "Le convoi repart en klaxonnant. Marché conclu !": "The convoy drives off honking. Deal done!", "Le convoi est passé sans s’arrêter.": "The convoy went by without stopping.",
  "Vous ramenez le survivant. Il partage ses réserves avant de partir rejoindre sa famille.": "You bring the survivor back. He shares his supplies before leaving to join his family.",
  "La radio ne grésille plus. Trop tard.": "The radio has gone silent. Too late.", "Mission réussie :": "Mission complete:"
});
Object.assign(TRAD_ECRAN, {
  // Marché
  "Marché de quartier": "Neighborhood market", "Seulement aujourd’hui · revient dans {#} jours": "Today only · back in {#} days", "Charrette : {#} objets": "Cart: {#} items",
  "Tu donnes": "You give", "tu en as {#}": "you have {#}", "Tu reçois": "You get", "Échanger": "Trade", "Il en manque": "Not enough", "Fait": "Done",
  // Missions
  "La fièvre de Lucie": "Lucie’s fever", "Le convoi": "The convoy", "Appel de détresse": "Distress call",
  "Chez les voisins, la petite Lucie brûle de fièvre. Son père supplie : un antibiotique ou une trousse de soins, vite": "Next door, little Lucie is burning with fever. Her father begs: an antibiotic or a first aid kit, quickly",
  "Un convoi de survivants passera bientôt. Ils réparent leurs camions et échangent {#} planches contre une trousse, {#} canettes et un jerrican": "A convoy of survivors will pass by soon. They’re repairing their trucks and will trade a first aid kit, {#} energy drinks and a jerry can for {#} planks",
  "Récompense": "Reward", "À livrer (au choix": "To deliver (your choice", "À livrer": "To deliver", "Livrer": "Deliver", "ou": "or",
  "Il vous manque des objets : allez fouiller": "You’re missing items: go scavenge", "Où aller": "Where to go", "Encore {#} jours": "{#} days left", "Encore {#} jour": "{#} day left",
  "La mission réussit si quelqu’un en revient vivant. Le lieu est marqué 🎯 dans la liste": "The mission succeeds if someone comes back alive. The place is marked 🎯 in the list",
  "La mission réussit si quelqu’un en revient vivant. Le lieu est marqué": "The mission succeeds if someone comes back alive. The place is marked", "dans la liste": "in the list",
  // Serrure
  "Porte verrouillée": "Locked door", "peut essayer de": "can try to", "crocheter": "pick", "la serrure ({#} goupilles": "the lock ({#} pins",
  "{#} épingle). Chaque raté casse une épingle": "{#} hairpin). Each miss breaks a hairpin", "{#} épingles). Chaque raté casse une épingle": "{#} hairpins). Each miss breaks a hairpin",
  "Forcer la porte fait du bruit : plus de danger et fouille moins efficace": "Forcing the door makes noise: more danger and a less effective search",
  "Crocheter": "Pick the lock", "Forcer la porte": "Force the door", "Appuyer": "Press",
  // Pêche, siphon
  "Pêche à l’étang": "Fishing at the pond", "Lancer {#} / {#}": "Cast {#} / {#}", "prise": "caught", "prises": "caught", "{#} poissons dans l’étang": "{#} fish in the pond",
  "Attends que le bouchon s’enfonce, puis touche vite « Ferrer": "Wait for the float to go under, then quickly tap “Strike", "Ferrer": "Strike", "Lancer": "Cast",
  "Une voiture abandonnée": "An abandoned car",
  "Sur le chemin du retour, une vieille voiture est garée de travers, portières ouvertes. Le bouchon du réservoir est encore là… il reste peut-être de l’essence": "On the way back, an old car is parked crooked, doors open. The fuel cap is still on… there may be some gas left",
  "Continuer la route": "Keep going", "Siphonner": "Siphon", "Aspirer": "Suck",
  // Rex
  "Il a suivi la famille après qu’on l’a nourri": "He followed the family after being fed", "Monte la garde": "Stands guard", "{#} de défense": "{#} defense", "la nuit": "at night",
  "{#} ration de nourriture": "{#} food ration", "chaque soir, après la famille": "every evening, after the family",
  "Sans manger {#} nuits de suite, il part chercher ailleurs": "After {#} nights in a row without food, he leaves to look elsewhere", "Il a mangé, il va bien": "He has eaten, he’s fine",
  "La famille n’a plus de quoi manger ce soir. +{#} rations, moral -{#}, et plus de chien de garde": "The family has nothing left to eat tonight. +{#} rations, morale −{#}, and no more guard dog",
  // Raja
  "Il suit la Légende du mois": "He follows the Legend of the Month",
  "Quand les villes sont tombées, le zoo de la ville a été abandonné du jour au lendemain. Les gardiens ont fui, les cages sont restées fermées. Des semaines plus tard, un survivant a entendu des rugissements derrière les grilles rouillées : un tigre, affamé, qui se jetait contre les barreaux. Chaque nuit, il est revenu lui glisser un peu de viande, sans jamais ouvrir la cage. Au bout d’un mois, le tigre a cessé de gronder quand il approchait. Le jour où il a ouvert la porte, le tigre ne l’a pas dévoré : il l’a suivi. On l’appelle Raja. On dit qu’il ne reste qu’auprès du plus grand survivant de son temps… et qu’il change de maître le jour où quelqu’un fait mieux que lui": "When the cities fell, the city zoo was abandoned overnight. The keepers fled, and the cages stayed shut. Weeks later, a survivor heard roaring behind the rusty gates: a starving tiger, throwing itself against the bars. Every night, they came back to slip it a little meat, without ever opening the cage. After a month, the tiger stopped growling when they came near. The day they opened the door, the tiger didn’t devour them: it followed them. It’s called Raja. They say it only stays with the greatest survivor of their time… and changes masters the day someone does better",
  "Ce qu’il fait": "What it does",
  "Une fois par partie, dans n’importe quel combat (expédition, raid de l’immeuble, zombie célèbre, assaut de guerre), le bouton « Lâcher le tigre » fait bondir Raja : tous les zombies tombent ; le Colosse et les zombies célèbres perdent {#} % de leur vie ; en guerre de clans, chaque défenseur perd {#} % de sa vie. Détrônée, la Légende perd Raja": "Once per game, in any fight (trip, apartment block raid, famous zombie, war assault), the “Unleash the tiger” button sends Raja leaping: every zombie falls; the Colossus and famous zombies lose {#}% of their health; in clan wars, each defender loses {#}% of their health. Once dethroned, the Legend loses Raja",
  // Trophées, radio, bonus
  "Les trophées": "The trophies", "Sur la cheminée, les souvenirs des zombies célèbres que la famille a abattus": "On the mantelpiece, mementos of the famous zombies the family has killed",
  "Aucun trophée pour l’instant": "No trophies yet",
  "La radio grésille. Elle capte parfois des messages : on sait mieux où sont les dangers": "The radio crackles. It sometimes picks up messages: you know better where the dangers are",
  "Montre le danger de chaque lieu dans la liste « Où envoyer l’équipe": "Shows the danger of each place in the “Where to send the team",
  "Fait découvrir les lieux secrets {#} jours plus tôt, et capte parfois des messages le matin": "Reveals secret places {#} days earlier, and sometimes picks up messages in the morning",
  "Un seul bonus par partie. Gagne des colis en invitant des amis": "One bonus per game. Earn packages by inviting friends", "Aucun bonus pour l’instant": "No bonuses yet",
  // Game over
  "Votre famille n’est plus": "Your family is gone", "Ce que ta famille laisse à la suivante": "What your family leaves to the next one",
  "touche un autre objet pour changer": "tap another item to change", "Vous avez tenu {#} jours": "You held out {#} days", "Vous avez tenu {#} jour": "You held out {#} day",
  "Record : {#} points": "Record: {#} points", "Nouveau record": "New record", "Copier mon résultat": "Copy my result", "Voir le classement": "See the leaderboard",
  // Astuces (bulle)
  "La maison a plusieurs pièces : glisse le doigt sur la pièce (ou touche les flèches ◀ ▶ en haut) pour aller à la chambre, à la réserve, à l’atelier, au garage et dans la cour": "The house has several rooms: swipe across the room (or tap the ◀ ▶ arrows at the top) to go to the bedroom, the storeroom, the workshop, the garage and the yard",
  "Voici ta famille. Touche {#} ou {#} membres, puis 🔍 Fouiller pour les envoyer chercher des objets. Raccourci : les objets de la pièce sont cliquables (porte, table, canapé": "Here’s your family. Tap {#} or {#} members, then 🔍 Scavenge to send them looking for items. Shortcut: things in the room can be tapped (door, table, couch",
  "Sous chaque membre, {#} cases : arme, outil (lampe, boîte à outils…) et sac. Une case orange avec un « + » : un objet t’attend au stock, touche-la pour l’équiper": "Under each member, {#} slots: weapon, tool (flashlight, toolbox…) and bag. An orange slot with a “+”: an item is waiting in the stock, tap it to equip it",
  "Chaque lieu contient une vraie liste d’objets qui ne revient jamais. Lieu sombre : prends une lampe. Porte verrouillée : une boîte à outils": "Each place holds a real list of items that never comes back. Dark place: bring a flashlight. Locked door: a toolbox",
  "Touche un zombie pour le viser, puis choisis l’action de chacun : frapper, viser la tête, pousser, se protéger… La bulle au-dessus d’un zombie dit ce qu’il va faire. 🤖 Auto joue à ta place": "Tap a zombie to target it, then choose everyone’s action: hit, aim for the head, shove, defend… The bubble above a zombie says what it will do. 🤖 Auto plays for you",
  "Plus personne n’a assez d’énergie : appuie sur Dormir (ou touche le canapé). Chacun mange et boit une ration (touche une carte puis « Soigner » pour boire ou manger en plus)… et la nuit, ils peuvent attaquer": "Nobody has enough energy left: tap Sleep (or tap the couch). Everyone eats and drinks a ration (tap a card then “Heal” to drink or eat more)… and at night, they may attack",
  "Ton score : {#} point par jour et par membre en vie. Garde toute la famille en vie le plus longtemps possible": "Your score: {#} point per day per living member. Keep the whole family alive as long as you can",
  "Le refuge : construis des défenses, fabrique (soins, armes, bâche pour l’eau de pluie…), répare et démonte. Et plus tard, répare la voiture": "The refuge: build defenses, craft (healing, weapons, a tarp for rainwater…), repair and dismantle. And later, fix the car",
  "La forêt : un survivant avec une hache en main coupe du bois ({#} ou {#} planches). Les arbres ne repoussent pas, et la hache s’use": "The forest: a survivor with an axe in hand chops wood ({#} or {#} planks). Trees don’t grow back, and the axe wears out",
  "La cuisine : la cuisinière à bois transforme tes vivres et des ingrédients (épices, huile, farine, champignons…) en plats plus nourrissants, avec un bonus. {#} planche par plat, et les plats se gâtent vite": "The kitchen: the wood stove turns your supplies and ingredients (spices, oil, flour, mushrooms…) into more filling dishes, with a bonus. {#} plank per dish, and dishes spoil quickly",
  "L’étang : équipe une canne à pêche (case outil) pour pêcher. Ne le vide pas : sous {#} poissons, ils ne se reproduisent plus": "The pond: equip a fishing rod (tool slot) to fish. Don’t empty it: below {#} fish, they stop breeding",
  "Une mission ! Elle a un délai : touche le bouton 🎯 en bas de l’écran pour la voir et livrer ce qu’il faut. Réussir rapporte des objets et du moral": "A mission! It has a deadline: tap the 🎯 button at the bottom of the screen to see it and deliver what’s needed. Success brings items and morale",
  "Appuie quand le curseur rouge passe dans la zone verte. Chaque raté casse une épingle": "Tap when the red cursor is in the green zone. Each miss breaks a hairpin",
  "Vite ! Touche les objets pour les mettre dans le sac. Tout servira : de l’eau et à manger d’abord, puis de quoi se défendre et s’éclairer": "Hurry! Tap items to put them in the bag. Everything will be useful: water and food first, then something to defend yourself and see in the dark"
});
TRAD_MOTIFS.push([/^(.+) : personne n’a d’outil pour ouvrir$/, "$1: nobody has a tool to open it"]);
Object.assign(TRAD_ECRAN, { "Vous avez tenu": "You held out", "{#} jours": "{#} days", "{#} jour": "{#} day", "Pêche terminée": "Fishing over", "Fouiller maintenant": "Search now" });
Object.assign(TRAD_ECRAN, { "pêche (canne à pêche": "fishing (fishing rod", "bois (une hache en main": "wood (axe in hand" });
TRAD_MOTIFS.push([/^(.+) peut essayer de$/, "$1 can try to"]);

/* ---------- Lot 4 : clans, bastion, guerre, raid, discussion, classement, profil (2026-11-15) ---------- */
Object.assign(TRAD_ECRAN, {
  "Le hall": "The lobby", "Les appartements": "The apartments", "Les bureaux": "The offices", "Le dernier étage": "The top floor", "Le toit": "The roof",
  "Succès débloqué": "Achievement unlocked", "Le bastion": "The stronghold", "Défenses": "Defenses", "Opérations": "Operations", "Opération": "Operation",
  "Les opérations se préparent à plusieurs : chaque famille y envoie un volontaire, puis une seule équipe part pour tout le clan. De nouvelles opérations arriveront": "Operations are prepared together: each family sends a volunteer, then a single team goes out for the whole clan. New operations will come",
  "L’immeuble abandonné": "The abandoned apartment block",
  "Chaque famille envoie un volontaire. Dès {#}, le chef mène l’assaut, étage par étage. Le butin est partagé": "Each family sends a volunteer. With {#}, the leader leads the assault, floor by floor. The loot is shared",
  "Opération de clan": "Clan operation", "Pas de canne à pêche": "No fishing rod", "Pas de hache": "No axe", "Toutes les opérations": "All operations",
  "{#} étages · une seule fois par clan": "{#} floors · only once per clan", "volontaire par famille": "volunteer per family", "pour partir ({#} au plus": "to go ({#} at most",
  "le chef mène le raid": "the leader leads the raid", "dernier étage": "top floor",
  "Entre deux étages, le chef choisit de monter ou de redescendre avec le butin. Blessures et morts sont réelles": "Between floors, the leader chooses to go up or head back down with the loot. Wounds and deaths are real",
  "en plus": "extra", "Équipe risquée": "Risky team", "Équipe prête": "Team ready", "Équipe suicidaire": "Suicidal team",
  "Les premiers étages passeront, mais le dernier étage et le toit (soldats en gilet, le Colosse) demandent des armes à feu, des munitions et des gilets : il faudra sans doute redescendre": "The first floors will go fine, but the top floor and the roof (soldiers in vests, the Colossus) call for firearms, ammo and vests: you’ll probably have to head back down",
  "Envoyer un volontaire": "Send a volunteer", "Sans elle : {#} objets par volontaire": "Without it: {#} items per volunteer", "Construire la remorque": "Build the trailer",
  "En parler au clan": "Talk it over with the clan", "Qui part à l’immeuble": "Who goes to the apartment block",
  "Ton volontaire reste au bastion jusqu’au raid : il ne pourra plus fouiller. Il emporte ce qu’il porte (arme, outil, sac": "Your volunteer stays at the stronghold until the raid: they can’t scavenge anymore. They take what they’re carrying (weapon, tool, bag",
  "sans arme": "no weapon",
  "Les munitions, les soins et l’équipement servent à toute l’équipe pendant le raid. Ce qui n’a pas servi te revient après": "Ammo, healing and gear are used by the whole team during the raid. Whatever isn’t used comes back to you afterwards",
  "pour son arme": "for their weapon", "{#} au stock": "{#} in stock", "Avec cette équipe, le toit est à votre portée": "With this team, the roof is within reach",
  "Lancer le raid": "Launch the raid", "Fouiller l’étage": "Search the floor", "Trouvé à cet étage": "Found on this floor", "Fin du raid": "End of the raid",
  "Étage {#} / {#} nettoyé : fouillez-le, puis choisissez de monter ou de redescendre": "Floor {#} / {#} cleared: search it, then choose to go up or head back down",
  "Étage {#} / {#} · {#} objets trouvés · place pour {#}": "Floor {#} / {#} · {#} items found · room for {#}",
  "Chances de nettoyer l’étage : {#} % · sans perte : {#} %": "Chance to clear the floor: {#}% · with no losses: {#}%",
  "Soigner le plus blessé ({#} soins en réserve": "Heal the most wounded ({#} healing items in reserve", "Monter": "Go up", "Redescendre": "Head back down",
  "Envoi du résultat au clan": "Sending the result to the clan", "Retour du raid": "Back from the raid", "Ta part du butin": "Your share of the loot",
  "L’équipe est redescendue. {#} étage sur {#}, {#} objets ramenés": "The team came back down. {#} floor out of {#}, {#} items brought back",
  "Revoir le raid": "Watch the raid again", "Replay du raid": "Raid replay", "Raid de l’immeuble": "Apartment block raid", "Départ": "Start", "Aller au résultat": "Skip to the result",
  "L’équipe redescend": "The team heads back down", "{#} étage nettoyé · {#} objets ramenés": "{#} floor cleared · {#} items brought back", "{#} étages nettoyés · {#} objets ramenés": "{#} floors cleared · {#} items brought back",
  // Mon clan
  "Pas encore de devise": "No motto yet", "Modifier la description": "Edit the description", "réserve, défenses": "stockpile, defenses", "La guerre": "The war",
  "trouver un rival": "find a rival", "écrire au clan": "write to the clan", "Équipe prête : lance le raid": "Team ready: launch the raid",
  "Les familles": "The families", "Classement des clans": "Clan leaderboard", "Quitter le clan": "Leave the clan", "toi": "you", "Toi": "You", "Chef": "Leader", "Exclure": "Kick", "Confirmer": "Confirm",
  "Mon clan": "My clan", "Rejoindre": "Join", "Fonder un clan": "Found a clan", "{#} / {#} familles": "{#} / {#} families", "{#} / {#} joueurs": "{#} / {#} players",
  // Bastion
  "La réserve commune du clan. Ta participation": "The clan’s shared stockpile. Your contribution", "déposés": "deposited",
  "pris. On peut prendre au plus {#} objets de plus que ce qu’on a déposé, et {#} par jour : tu peux encore en prendre": "taken. You can take at most {#} more items than you’ve deposited, and {#} per day: you can still take",
  "Touche un objet de la réserve pour en prendre {#}": "Tap an item in the stockpile to take {#}", "Déposer depuis ton stock": "Deposit from your stock",
  "Touche un objet de ton stock pour en déposer {#}": "Tap an item in your stock to deposit {#}", "Réserve": "Stockpile", "Journal": "Log", "Camion": "Truck",
  "Remparts": "Ramparts", "Mines": "Mines", "Tours de guet": "Watchtowers", "Armurerie": "Armory", "Pare-buffle": "Bull bar", "Blindage": "Armor plating", "Tourelle": "Turret", "Remorque": "Trailer",
  "Pendant une guerre, chaque défenseur a +{#} PV et frappe plus fort": "During a war, each defender has +{#} HP and hits harder",
  "Niveau {#} : il faut dans la réserve": "Level {#}: needed in the stockpile", "Il manque des matériaux": "Materials missing",
  "Le camion du clan conduit chaque équipe à l’assaut. Ses améliorations servent à tous les membres. Il est encore nu : améliore-le avec la réserve": "The clan truck drives each team to the assault. Its upgrades serve every member. It’s still bare: upgrade it with the stockpile",
  "Le camion enfonce l’entrée : chaque défenseur perd {#} PV au début de l’assaut": "The truck rams the entrance: each defender loses {#} HP at the start of the assault",
  "Aujourd’hui": "Today", "Hier": "Yesterday", "à l’instant": "just now",
  // Guerre
  "dans le clan pour partir en guerre. Les clans incomplets ne peuvent ni attaquer ni être attaqués": "in the clan to go to war. Incomplete clans can neither attack nor be attacked",
  "Chercher une guerre": "Look for a war", "Annuler la recherche": "Cancel the search", "Attaquer": "Attack", "Attaquée aujourd’hui": "Attacked today", "Ton assaut est fait": "Your assault is done",
  "Historique des guerres": "War history", "gagnées": "won", "perdues": "lost", "égalités": "draws",
  // Discussion
  "Le clan": "The clan", "Discussion du clan": "Clan chat", "Je suis prêt pour le raid": "I’m ready for the raid", "Qui envoie un volontaire pour le raid": "Who’s sending a volunteer for the raid",
  "J’ai déposé des matériaux dans la réserve": "I’ve put materials in the stockpile", "Regardez mon offre d’échange": "Check out my trade offer", "On attaque ce soir": "We attack tonight",
  "D’accord": "OK", "Salut le clan": "Hi clan", "Proposer un échange": "Propose a trade", "Discussion du clan · {#} / {#} familles": "Clan chat · {#} / {#} families",
  "Écris au clan": "Write to the clan", "Effacer": "Delete", "Signaler": "Report", "Accepter": "Accept", "Annuler": "Cancel",
  // Échange
  "{#} objets au plus de chaque côté": "{#} items at most on each side", "{#} échange toutes les {#} h": "{#} trade every {#} h", "Pas plus de {#} fois ce que tu donnes": "No more than {#}× what you give",
  "Valeur : {#} ➜ {#} · choisis des deux côtés": "Value: {#} ➜ {#} · choose on both sides", "Ce que je donne": "What I give", "Ce que je demande": "What I ask for", "Proposer au clan": "Offer to the clan",
  "Ce que tu donnes est mis de côté jusqu’à ce qu’un membre accepte. Sans preneur en {#} h, ça te revient": "What you give is set aside until a member accepts. If nobody takes it within {#} h, it comes back to you",
  // Classement des clans, profils, fondation
  "Voir le clan": "See the clan", "Ton clan : {#}er": "Your clan: {#}st", "Ton clan : {#}e": "Your clan: no. {#}", "Les ligues (trophées": "Leagues (trophies", "Légende": "Legend",
  "Ferraille": "Scrap", "Bronze": "Bronze", "Argent": "Silver", "Or": "Gold",
  "jour de survie": "day survived", "jours de survie": "days survived", "Au combat": "In combat", "étoiles d’assaut": "assault stars", "guerres gagnées": "wars won", "succès": "achievements",
  "Réserve du clan": "Clan stockpile", "A déposé": "Deposited", "A pris": "Took",
  "Tu en seras le chef. Les autres familles qui ont tenu assez longtemps pourront te rejoindre": "You’ll be its leader. Other families who have held out long enough can join you",
  "Nom du clan": "Clan name", "Blason": "Crest", "Fonder le clan": "Found the clan", "Description du clan": "Clan description",
  "Loup": "Wolf", "Aigle": "Eagle", "Ours": "Bear", "Scorpion": "Scorpion", "Flamme": "Flame", "Crâne": "Skull", "Épées": "Swords", "Bouclier": "Shield", "Sapin": "Pine", "Drapeau noir": "Black flag", "Engrenage": "Gear", "Serpent": "Snake",
  "Présente ton clan aux autres joueurs ({#} lettres au plus) : votre façon de jouer, vos règles, quand vous êtes là": "Introduce your clan to other players ({#} characters max): how you play, your rules, when you’re around",
  "Enregistrer": "Save",
  // Classement général
  "Ce mois-ci": "This month", "Depuis toujours": "All time", "La Légende": "The Legend", "Panthéon": "Hall of fame", "Anciennes Légendes": "Past Legends",
  "Personne… pour l’instant": "Nobody… for now", "Ta partie en cours est une": "Your current game is a", "partie libre": "free game",
  ": elle ne compte pas pour le classement. Seules les parties classées y entrent": ": it doesn’t count for the leaderboard. Only ranked games go in",
  "{#} joueurs ce mois-ci ·": "{#} players this month ·",
  "meilleur score d’une partie classée ({#} point par jour et par survivant) · ● en cours = partie encore en vie, score mis à jour en direct": "best score from a ranked game ({#} point per day per survivor) · ● in progress = game still alive, score updated live",
  "en cours": "in progress", "Choisir mon pseudo": "Choose my username", "n°{#} du mois": "no. {#} of the month",
  // Profil, cadres
  "Changer de pseudo": "Change username", "un changement tous les {#} jours, jamais en guerre": "one change every {#} days, never during a war",
  "Ton cadre entoure ton pseudo dans le classement, les clans et les guerres. Les plus beaux se débloquent avec les succès": "Your frame surrounds your username in the leaderboard, clans and wars. The finest ones unlock with achievements",
  "Tu as {#} succès · {#} cadres débloqués · prochain": "You have {#} achievements · {#} frames unlocked · next", "dans {#} succès": "in {#} achievements",
  "Le cadre le plus rare": "The rarest frame",
  "Réservé à la Légende du mois. Fais le meilleur score du mois en partie classée pour le porter, avec Raja en prime": "Reserved for the Legend of the Month. Get the month’s best score in a ranked game to wear it, with Raja as a bonus",
  "Porté": "Worn", "Porter": "Wear", "{#} succès débloqués": "{#} achievements unlocked", "Tous les succès débloqués": "All achievements unlocked", "Aperçu": "Preview",
  "Bois": "Wood", "Mythique": "Mythic",
  // Divers
  "Code d’invitation": "Invite code", "Tape le code d’un ami (ou un code spécial": "Type a friend’s code (or a special code", "Valider": "Confirm",
  "Le choix impossible": "The impossible choice", "Ce n’est plus nécessaire": "It’s no longer necessary", "Pillé · revoir le replay": "Looted · watch the replay"
});
var ETAGES_FR_EN = function(s){ return TRAD_ECRAN[s] || s; };
var MOIS_EN = { "janv.":"Jan", "févr.":"Feb", "mars":"Mar", "avr.":"Apr", "mai":"May", "juin":"Jun", "juil.":"Jul", "août":"Aug", "sept.":"Sep", "oct.":"Oct", "nov.":"Nov", "déc.":"Dec" };
TRAD_MOTIFS.push(
  [/^(Classée|Libre) · (\d+) (\S+) (\d+)$/, function(m, t, j, mo, a){ return (t === "Classée" ? "Ranked" : "Free play") + " · " + (MOIS_EN[mo] || mo) + " " + j + ", " + a; }],
  [/^(\d+) (\S+)$/, function(m, j, mo){ return MOIS_EN[mo] ? MOIS_EN[mo] + " " + j : m; }],
  [/^(.+) envoie (.+) pour le raid de l’immeuble \((\d+) \/ (\d+)$/, "$1 sends $2 for the apartment block raid ($3 / $4"],
  [/^Raid de l’immeuble mené par (.+) : (\d+) étages? sur (\d+), (\d+) objets ramenés, aucun mort$/, "Apartment block raid led by $1: $2 floor(s) out of $3, $4 items brought back, no deaths"],
  [/^Raid de l’immeuble mené par (.+) : (\d+) étages? sur (\d+), (\d+) objets ramenés, (\d+) morts?$/, "Apartment block raid led by $1: $2 floor(s) out of $3, $4 items brought back, $5 dead"],
  [/^Ce que tu confies à (.+)$/, "What you entrust to $1"],
  [/^Apport de (.+) : (\d+) points de force \(une équipe prête en réunit environ (\d+)$/, "$1’s contribution: $2 strength points (a ready team totals about $3"],
  [/^(.+) est parti au bastion pour le raid de l’immeuble$/, "$1 has gone to the stronghold for the apartment block raid"],
  [/^(.+) est partie au bastion pour le raid de l’immeuble$/, "$1 has gone to the stronghold for the apartment block raid"],
  [/^(.+) est revenue? du raid \((.*)$/, "$1 is back from the raid ($2"],
  [/^Rendu de ce que tu avais confié : (.+)$/, "Returned from what you entrusted: $1"],
  [/^Part du clan versée à la réserve : (.+)$/, "Clan share paid into the stockpile: $1"],
  [/^(.+) \(étage (\d+) \/ (\d+)\) : (\d+) zombies vous attendent$/, function(m, e, a, b, n){ return ETAGES_FR_EN(e) + " (floor " + a + " / " + b + "): " + n + " zombies are waiting for you"; }],
  [/^(.+) : nettoyé$/, function(m, e){ return ETAGES_FR_EN(e) + ": cleared"; }],
  [/^Plus haut : (.+)$/, function(m, e){ return "Higher up: " + ETAGES_FR_EN(e); }],
  [/^Étage (\d+) \/ (\d+) · (.+?)( · tour (\d+))?$/, function(m, a, b, e, t, n){ return "Floor " + a + " / " + b + " · " + ETAGES_FR_EN(e) + (t ? " · turn " + n : ""); }],
  [/^(.+) : (\d+) zombies$/, function(m, e, n){ return ETAGES_FR_EN(e) + ": " + n + " zombies"; }],
  [/^Chef du clan « (.+) » depuis (.+) · vu (.+)$/, function(m, c, d, v){ return "Leader of the “" + c + "” clan since " + (d === "peu" ? "recently" : d) + " · seen " + (v === "à l’instant" ? "just now" : v); }],
  [/^Membre du clan « (.+) » depuis (.+) · vu (.+)$/, function(m, c, d, v){ return "Member of the “" + c + "” clan since " + (d === "peu" ? "recently" : d) + " · seen " + (v === "à l’instant" ? "just now" : v); }],
  [/^Jour (\d+) · vu (.+?)( · .*)?$/, function(m, j, v, r){ return "Day " + j + " · seen " + (v === "à l’instant" ? "just now" : v.replace(/^il y a /, "").replace(/ min$/, " min ago").replace(/ h$/, " h ago").replace(/ j$/, " d ago")) + (r || ""); }],
  [/^vu il y a (\d+) (min|h|j)$/, function(m, n, u){ return "seen " + n + " " + (u === "j" ? "d" : u) + " ago"; }],
  [/^il y a (\d+) (min|h|j)$/, function(m, n, u){ return n + " " + (u === "j" ? "d" : u) + " ago"; }],
  [/^La Légende de (\S+)$/, function(m, mo){ return "The Legend of " + moisAnglais(mo); }],
  [/^En tête de (\S+)$/, function(m, mo){ return "Leading in " + moisAnglais(mo); }],
  [/^Le n°(\d+) de (\S+) sera la Légende de (\S+), couronnée? le (\d+)er (\S+)$/, function(m, n, a, b, j, c){ return "No. " + n + " of " + moisAnglais(a) + " will be the Legend of " + moisAnglais(b) + ", crowned on " + moisAnglais(c) + " " + j; }],
  [/^(\d+) points\), futur\(e\) Légende de (\S+) si personne ne fait mieux$/, function(m, p, mo){ return p + " points), future Legend of " + moisAnglais(mo) + " if nobody does better"; }],
  [/^Couronne remise le (\d+)er (\S+), dans (\d+) jours?$/, function(m, j, mo, n){ return "Crown awarded on " + moisAnglais(mo) + " " + j + ", in " + n + " day(s)"; }]
);
function moisAnglais(m){ return { janvier:"January", février:"February", mars:"March", avril:"April", mai:"May", juin:"June", juillet:"July", août:"August", septembre:"September", octobre:"October", novembre:"November", décembre:"December" }[m] || m; }

/* ---------- Messages du serveur (erreurs), traduits à l'affichage (2026-11-15) ---------- */
Object.assign(TRAD_ECRAN, {
  "Assaut introuvable": "Assault not found", "Ce clan est complet ({#} familles": "This clan is full ({#} families", "Ce clan n’existe plus": "This clan no longer exists",
  "Ce code existe déjà": "This code already exists", "Ce code n’est plus actif": "This code is no longer active", "Ce code n’existe pas": "This code doesn’t exist",
  "Ce membre n’est plus dans le clan": "This member is no longer in the clan", "Ce nom de clan est déjà pris": "This clan name is already taken",
  "Ce n’est pas toi qui as lancé le raid": "You’re not the one who launched the raid",
  "Cette description n’est pas autorisée (insulte ou mot blessant": "This description isn’t allowed (insult or hurtful word",
  "Cette famille a déjà été attaquée aujourd’hui": "This family has already been attacked today", "Cette famille n’est plus dans le clan adverse": "This family is no longer in the enemy clan",
  "Cette offre ne peut plus être annulée": "This offer can no longer be canceled", "Cette offre n’est plus disponible": "This offer is no longer available",
  "Choisis de {#} à {#} objets à donner et de {#} à {#} à demander": "Choose {#} to {#} items to give and {#} to {#} to ask for",
  "Choisis d’abord un pseudo": "Choose a username first", "Code trop court ({#} caractères au moins": "Code too short ({#} characters at least",
  "C’est ta propre offre": "It’s your own offer", "C’est ton propre code": "It’s your own code",
  "Doucement ! Attends quelques secondes entre deux messages": "Easy! Wait a few seconds between messages",
  "Il faut avoir tenu {#} jours pour fonder un clan": "You must have held out {#} days to found a clan", "Il faut avoir tenu {#} jours pour rejoindre un clan": "You must have held out {#} days to join a clan",
  "Il manque des matériaux dans la réserve": "Materials are missing from the stockpile", "Il n’y en a plus assez dans la réserve": "There aren’t enough left in the stockpile",
  "Il y a déjà {#} volontaires": "There are already {#} volunteers", "Il faut {#} familles dans le clan pour partir en guerre": "The clan needs {#} families to go to war",
  "La guerre est terminée": "The war is over", "Le clan adverse n’existe plus": "The enemy clan no longer exists", "Le clan est déjà en guerre": "The clan is already at war",
  "Le nom du clan doit faire au moins {#} lettres": "The clan name must be at least {#} letters",
  "Le raid est en cours : impossible de changer les volontaires": "The raid is underway: volunteers can’t be changed",
  "Le raid est en cours : ton volontaire ne peut plus se retirer": "The raid is underway: your volunteer can no longer withdraw",
  "L’immeuble a déjà été pillé par le clan": "The clan has already looted the apartment block", "L’immeuble a déjà été pillé": "The apartment block has already been looted",
  "Message introuvable": "Message not found", "Message refusé (insulte ou mot blessant": "Message refused (insult or hurtful word", "Message vide": "Empty message",
  "Niveau maximum atteint": "Maximum level reached", "Pour partir, utilise « Quitter le clan": "To leave, use “Leave the clan", "Rien à déposer": "Nothing to deposit",
  "Seul le chef du clan peut changer la description": "Only the clan leader can change the description", "Seul le chef du clan peut exclure un membre": "Only the clan leader can kick a member",
  "Seul le chef peut annuler": "Only the leader can cancel", "Seul le chef peut effacer le message d’un autre": "Only the leader can delete someone else’s message",
  "Seul le chef peut lancer une guerre": "Only the leader can start a war", "Ton clan n’est pas en guerre": "Your clan isn’t at war",
  "Tu as déjà envoyé {#} messages aujourd’hui. Merci ! Réessaie demain": "You’ve already sent {#} messages today. Thanks! Try again tomorrow",
  "Tu as déjà lancé ton assaut aujourd’hui. Reviens demain": "You’ve already launched your assault today. Come back tomorrow",
  "Tu as déjà pris {#} objets aujourd’hui ({#} au maximum par jour": "You’ve already taken {#} items today ({#} max per day",
  "Tu as déjà pris {#} objets de plus que ce que tu as déposé : dépose d’abord quelque chose dans la réserve": "You’ve already taken {#} more items than you’ve deposited: put something in the stockpile first",
  "Tu as déjà récupéré ta part": "You’ve already collected your share",
  "Tu as déjà une offre en cours : attends qu’elle soit prise, ou annule-la": "You already have an open offer: wait until it’s taken, or cancel it",
  "Tu as déjà utilisé ce code": "You’ve already used this code", "Tu as déjà utilisé un code d’invitation": "You’ve already used an invite code",
  "Tu fais déjà partie d’un clan": "You’re already in a clan", "Tu n’as pas de clan": "You don’t have a clan", "Tu n’as pas de volontaire inscrit": "You have no registered volunteer",
  "Tu n’as pas participé au raid": "You didn’t take part in the raid",
  "Échange trop déséquilibré : tu demandes beaucoup plus que ce que tu donnes": "Trade too lopsided: you’re asking for much more than you give",
  "Écris un peu plus ({#} lettres au moins": "Write a bit more ({#} letters at least",
  "Impossible de joindre le serveur": "Can’t reach the server", "Pas de connexion : réessaie plus tard": "No connection: try again later",
  "Chargement": "Loading", "Chargement…": "Loading…"
});
TRAD_MOTIFS.push([/^Un échange toutes les 8 h : le prochain dans (\d+) h$/, "One trade every 8 h: the next one in $1 h"]);
/* Journal du clan (lignes écrites par le serveur, ou assemblées par classement.js) */
Object.assign(TRAD_ECRAN, {
  "a pillé notre bastion": "looted our stronghold", "a repoussé": "drove back", "Assaut ennemi repoussé": "Enemy assault repelled", "a pillé": "looted",
  "a été repoussé par": "was driven back by", "Notre assaut": "Our assault", "Assaut raté": "Failed assault",
  "Guerre gagnée": "War won", "Guerre perdue": "War lost", "Guerre à égalité": "War drawn", "contre": "against", "trophée": "trophy", "trophées": "trophies",
  "Un membre": "A member", "Survivant": "Survivor", "Aucun clan pour l’instant": "No clans yet"
});
TRAD_MOTIFS.push(
  [/^en attaquant (.+)$/, "while attacking $1"],
  [/^(\d+) mines? (?:ont|a) explosé sous les pieds de (.+)$/, "$1 mine(s) exploded under $2’s feet"],
  [/^(.+) retire son volontaire du raid$/, "$1 withdraws their volunteer from the raid"],
  [/^La famille de (.+) est tombée au jour (\d+)\. Le clan perd une famille$/, "$1’s family fell on day $2. The clan loses a family"],
  [/^La famille de (.+) est tombée\. Le clan perd une famille$/, "$1’s family fell. The clan loses a family"],
  [/^(.+) a quitté le clan$/, "$1 left the clan"], [/^(.+) a rejoint le clan$/, "$1 joined the clan"], [/^(.+) a fondé le clan$/, "$1 founded the clan"],
  [/^(.+) s’appelle maintenant (.+)$/, "$1 is now called $2"],
  [/^a construit : (.+) \(niveau (\d+)$/, "built: $1 (level $2"], [/^a déposé (.+)$/, "deposited $1"], [/^a pris (\d+) (.+)$/, "took $1 $2"],
  [/^(.+) a fait un échange avec (.+)$/, "$1 made a trade with $2"],
  [/^(.+) a attaqué (.+) \((.+)\) : (.+)$/, "$1 attacked $2 ($3): $4"]
);
Object.assign(TRAD_ECRAN, {
  "Revoir le raid": "Replay", "Bastion": "Stronghold", "Discussion": "Chat", "Bastion · grande salle": "Stronghold · great hall", "Bastion · salle du trésor": "Stronghold · treasury",
  "Bastion · cour fortifiée": "Stronghold · fortified yard", "{#} / {#} familles · {#} jours tenus": "{#} / {#} families · {#} days survived", "{#} / {#} familles ·": "{#} / {#} families ·",
  "{#} joueurs ce mois-ci · ⭐ = meilleur score d’une partie classée ({#} point par jour et par survivant) · ● en cours = partie encore en vie, score mis à jour en direct": "{#} players this month · ⭐ = best score from a ranked game ({#} point per day per survivor) · ● in progress = game still alive, score updated live"
});
TRAD_MOTIFS.push([/^(.+?) · (\d+)$/, function(m, l, n){ var L = { "Ferraille":"Scrap", "Argent":"Silver", "Or":"Gold", "Légende":"Legend" }; return L[l] ? L[l] + " · " + n : m; }]);
Object.assign(TRAD_ECRAN, { "Redescendre": "Go down" });
Object.assign(TRADUCTIONS.en, { "Partie classée du {date}": "Ranked game of {date}", "Partie libre": "Free play",
  "Partie classée du {date} : ma famille a tenu {j} jours, ⭐ {s} points. Tu fais mieux ?": "Ranked game of {date}: my family held out {j} days, ⭐ {s} points. Can you beat that?" });
TRAD_MOTIFS.unshift([/^Classée · (.+)$/, function(m, d){ return "Ranked · " + d; }], [/^Partie classée du (.+)$/, "Ranked game of $1"]);
// Dates courtes françaises « 9 nov. » (le point final est retiré avant la recherche)
TRAD_MOTIFS.unshift([/^(\d+) (janv|févr|mars|avr|avril|mai|juin|juil|août|sept|oct|nov|déc)\.?$/, function(m, j, mo){ return (MOIS_EN[mo + "."] || MOIS_EN[mo] || { avril:"Apr" }[mo] || mo) + " " + j; }]);
/* Corrections du 2026-11-15 (relecture de Fabien) */
Object.assign(TRAD_ECRAN, {
  "Lancer une guerre": "Start a war", "Ton clan est complet : inscris-le": "Your clan is full: sign it up", "Guerre : ton assaut": "War: your assault", "Guerre en cours": "War underway",
  "Dont {#} de défense grâce aux armes en main": "Including {#} defense from weapons in hand", "niveau {#}": "level {#}", "Niveau {#}": "Level {#}", "Bilan détaillé": "Full summary",
  "Personne n’a bu ce soir : la soif baisse": "Nobody drank tonight: thirst rises", "Personne n’a mangé ce soir : la faim baisse": "Nobody ate tonight: hunger rises",
  "La grande horde · encore {#} h {#}": "The great horde · {#} h {#} left", "La grande horde · encore {#} j {#} h": "The great horde · {#} d {#} h left", "Prochaine horde dans {#} j {#} h": "Next horde in {#} d {#} h",
  "Abats {#} zombies": "Kill {#} zombies", "Fouille {#} lieux": "Search {#} places", "Cuisine {#} plats": "Cook {#} dishes", "Pêche {#} poissons": "Catch {#} fish",
  "Coupe {#} planches en forêt": "Cut {#} planks in the forest", "Crochète une serrure": "Pick a lock", "Fais {#} travaux à l’atelier": "Do {#} workshop jobs", "Tiens {#} nuits": "Survive {#} nights",
  "Abats {#} zombies cette semaine": "Kill {#} zombies this week", "Tiens {#} nuits cette semaine": "Survive {#} nights this week", "Fouille {#} lieux cette semaine": "Search {#} places this week",
  "Fais {#} travaux à l’atelier cette semaine": "Do {#} workshop jobs this week",
  "Tu récupères": "You get back", "Tu récupères :": "You get back:",
  "{#} trajet vers une zone éloignée · cuve de la station : {#} L": "{#} trip to a distant zone · gas station tank: {#} L", "{#} trajets vers une zone éloignée · cuve de la station : {#} L": "{#} trips to a distant zone · gas station tank: {#} L",
  "{#} jerrican · +{#} L chacun": "{#} jerry can · +{#} L each", "{#} jerricans · +{#} L chacun": "{#} jerry cans · +{#} L each"
});
TRAD_MOTIFS.push(
  [/^Nuit glaciale pour (.+) : pas de feu ni assez de couvertures \(\+(\d+) (.*)au lieu de \+(\d+), −(\d+) PV\)$/, "A freezing night for $1: no fire and not enough blankets (+$2 $3instead of +$4, −$5 HP)"],
  [/^Attaque de nuit \(force (\d+) contre votre défense (\d+)\)(.*)$/, "Night attack (strength $1 against your defense $2)$3"],
  [/^Attaque de nuit repoussée \(force (\d+) contre votre défense (\d+)\)$/, "Night attack driven off (strength $1 against your defense $2)"],
  [/^Rien à (manger|boire) pour (.+) : la (faim|soif) baisse$/, function(m, a, n, b){ return "Nothing to " + (a === "manger" ? "eat" : "drink") + " for " + n + ": " + (b === "faim" ? "hunger" : "thirst") + " rises"; }],
  [/^(.+) · encore (\d+) nuits?$/, "$1 · $2 night(s) left"]
);

/* ---------- Balayage du 2026-11-15 : partie bien remplie ---------- */
Object.assign(TRADUCTIONS.en, {
  "La peluche d’Emma. Elle la serre fort chaque soir : tout le monde dort un peu mieux en la voyant.": "Emma’s teddy bear. She hugs it tight every night: everyone sleeps a little better seeing it.",
  "La peluche d’Emma. On l’a gardée près du lit, en souvenir d’elle : elle donne du courage à tout le monde.": "Emma’s teddy bear. It’s kept by the bed, in her memory: it gives everyone courage.",
  "La photo de famille d’avant. Elle rappelle pour qui on se bat.": "The family photo from before. It reminds you who you’re fighting for.",
  "Un vieux jeu de cartes. Une partie le soir, et on oublie un moment les grattements dehors.": "An old deck of cards. A game in the evening, and for a while you forget the scratching outside.",
  "La radio grésille. Elle capte parfois des messages : on sait mieux où sont les dangers.": "The radio crackles. It sometimes picks up messages: you know better where the dangers are."
});
Object.assign(TRAD_ECRAN, {
  "Un objet peut être équipé": "An item can be equipped", "Un objet est disponible au stock": "An item is available in the stock",
  "zombies. Objectif atteint = un colis pour chaque participant": "zombies. Goal reached = a package for every participant", "Trophées": "Trophies",
  "Prêts": "Ready", "Prêts :": "Ready:",
  "Le feu brûle toute la nuit ({#} planche pour {#} nuits": "The fire burns all night ({#} plank for {#} nights",
  "Rex mange {#} ration et monte la garde": "Rex eats {#} ration and stands guard", "Les poules boivent {#} ration d’eau et pondent peut-être": "The chickens drink {#} water ration and may lay eggs",
  "Touche une case pour voir l’objet": "Tap a slot to see the item", "Test sur l’ordinateur : rien n’est envoyé au serveur": "Testing on the computer: nothing is sent to the server",
  "{#} · {#} de trop": "{#} · {#} wasted", "énergie pleine": "full energy", "Dans le stock ({#}": "In the stock ({#}",
  "Coupe du bois": "Chops wood", "Éclaire": "Lights up", "Allume le feu": "Lights the fire", "Pêche": "Fishing", "Ouvre les portes": "Opens doors",
  "Fouille moins bien, actes terribles la nuit ; à {#}, elle part": "Searches worse, terrible acts at night; at {#}, she leaves",
  "Fouille moins bien, actes terribles la nuit ; à {#}, il part": "Searches worse, terrible acts at night; at {#}, he leaves",
  "élevé": "high", "faible": "low", "moyen": "medium", "très élevé": "very high", "Danger élevé": "High danger", "Danger faible": "Low danger", "Danger moyen": "Medium danger", "Danger très élevé": "Very high danger",
  "Solidité {#} / {#}": "Durability {#} / {#}", "Solidité {#} / {#} →": "Durability {#} / {#} →", "après réparation": "after repair",
  "La barricade ajoute": "The barricade adds", "la nuit. Une attaque perdue en détruit un niveau": "at night. A lost attack destroys one level",
  "Niveau suivant : +{#} de défense · coût": "Next level: +{#} defense · cost", "chaque nuit": "every night",
  "Niveau suivant : +{#} ration de nourriture par nuit · coût": "Next level: +{#} food ration per night · cost", "{#} ration d’eau": "{#} water ration",
  "Niveau suivant : +{#} ration d’eau par nuit · coût": "Next level: +{#} water ration per night · cost", "{#} œufs": "{#} eggs", "{#} œuf": "{#} egg",
  "par nuit ({#} ration de nourriture chacun, {#} % de chances par poule": "per night ({#} food ration each, {#}% chance per chicken",
  "par nuit, après la famille. Sans eau, l’une d’elles meurt": "per night, after the family. Without water, one of them dies",
  "Leurs caquètements attirent les zombies": "Their clucking attracts zombies", "de risque d’attaque la nuit": "attack risk at night",
  "Il réchauffe toute la famille la nuit": "It warms the whole family at night", "de repos et": "rest and", ". Il brûle": ". It burns",
  "{#} planches au refuge : de quoi tenir {#} nuits · elles servent aussi à construire et à fabriquer": "{#} planks at the refuge: enough for {#} nights · they’re also used to build and craft",
  "Éteindre le feu (garder les planches": "Put out the fire (save the planks", "Allumer le feu": "Light the fire",
  "Jour {#} sur {#} de la saison · 🌱 Spring dans {#} jours": "Day {#} of {#} of the season · 🌱 Spring in {#} days",
  "{#} de défense la nuit (une attaque perdue en détruit un niveau": "{#} defense at night (a lost attack destroys one level",
  "{#} ration(s) d’eau chaque nuit": "{#} water ration(s) every night", "{#} ration(s) de nourriture chaque nuit": "{#} food ration(s) every night",
  "{#} % de chances chaque nuit : +{#} ration(s) d’eau": "{#}% chance every night: +{#} water ration(s)", "{#} % de chances chaque nuit : +{#} ration(s) de nourriture": "{#}% chance every night: +{#} food ration(s)",
  "{#} de défense contre la prochaine attaque de nuit (un piège par attaque": "{#} defense against the next night attack (one trap per attack",
  "pondent ≈ {#} ration(s) par nuit · boivent {#} ration(s) d’eau · +{#} % de risque d’attaque": "lay ≈ {#} ration(s) per night · drink {#} water ration(s) · +{#}% attack risk",
  "{#} de défense la nuit · mange {#} ration chaque soir": "{#} defense at night · eats {#} ration every evening", "Ça va": "OK",
  "Le récupérateur rapporte {#} ration par nuit": "The collector gives {#} ration per night", "Le potager rapporte {#} ration par nuit": "The garden gives {#} ration per night",
  "Piège à zombies : +{#} (un seul usage": "Zombie trap: +{#} (single use", "Rex monte la garde : +{#}": "Rex stands guard: +{#}",
  "Seulement en cas de famine : quand il ne reste plus de quoi nourrir la famille ce soir": "Only in a famine: when there’s nothing left to feed the family tonight",
  "Encore en liberté": "Still on the loose", "Tenir {#} jours": "Hold out {#} days",
  "chaque nuit, tant qu’elle est au refuge (le moral baisse de {#} par nuit sinon": "every night, as long as it’s at the refuge (otherwise morale drops by {#} per night",
  "chaque nuit, tant qu’il est au refuge (le moral baisse de {#} par nuit sinon": "every night, as long as it’s at the refuge (otherwise morale drops by {#} per night",
  "À {#} de moral ou plus, l’équipe trouve {#} objet de plus en fouille ; sous {#}, elle fouille mal": "At {#} morale or more, the team finds {#} more item when searching; below {#}, it searches poorly"
});
TRAD_MOTIFS.push(
  [/^Outil \/ éclairage de (.+) : vide, un objet est disponible au stock$/, "$1’s tool / light: empty, an item is available in the stock"],
  [/^Arme de (.+) : vide, un objet est disponible au stock$/, "$1’s weapon: empty, an item is available in the stock"],
  [/^Sac de (.+) : vide, un objet est disponible au stock$/, "$1’s bag: empty, an item is available in the stock"],
  [/^Cuisinière à bois : a plank par plat \(il en reste (\d+)\) · (.*)$/, function(m, n, r){ return "Wood stove: one plank per dish (" + n + " left) · " + r.replace(/^.*Prêts : /, "Ready: "); }],
  [/^(.+) : installée$/, "$1: installed"],
  [/^(.+) · voir et modifier$/, "$1 · view and edit"],
  [/^(.+) rôde ici$/, "$1 is prowling here"],
  [/^Abattue? par (.+)$/, "Killed by $1"],
  [/^(.+) \((\d+) \/ (\d+) PV\) rôde en ville, près de (.+)$/, "$1 ($2 / $3 HP) is prowling the town, near $4"]
);
// Les motifs précis passent avant les motifs généraux (« Arme de X »)
TRAD_MOTIFS.unshift(
  [/^Arme de (.+) : vide, un objet est disponible au stock$/, "$1’s weapon: empty, an item is available in the stock"],
  [/^Arme d’(.+) : vide, un objet est disponible au stock$/, "$1’s weapon: empty, an item is available in the stock"],
  [/^Sac de (.+) : vide, un objet est disponible au stock$/, "$1’s bag: empty, an item is available in the stock"],
  [/^Sac d’(.+) : vide, un objet est disponible au stock$/, "$1’s bag: empty, an item is available in the stock"],
  [/^Outil \/ éclairage d(?:e |’)(.+) : vide, un objet est disponible au stock$/, "$1’s tool / light: empty, an item is available in the stock"],
  [/^Arme de (.+) : vide$/, "$1’s weapon: empty"], [/^Sac de (.+) : vide$/, "$1’s bag: empty"], [/^Outil \/ éclairage de (.+) : vide$/, "$1’s tool / light: empty"],
  [/^(.+) · (\d+) j$/, function(m, t, n){ return (TRAD_ECRAN[t] || t) + " · " + n + " d"; }]
);
Object.assign(TRAD_ECRAN, { "pas besoin": "not needed", "pas faim": "not hungry", "pas soif": "not thirsty", "{#} rations d’eau": "{#} water rations",
  "Les poules boivent {#} rations d’eau et pondent peut-être": "The chickens drink {#} water rations and may lay eggs" });
TRAD_MOTIFS.unshift([/^Nuit glaciale pour (.+) : pas de feu ni assez de couvertures \(\+(\d+) (.*)au lieu de \+(\d+), −(\d+) PV$/, function(m, n, a, x, b, c){ return "A freezing night for " + n.replace(/ et /g, " and ") + ": no fire and not enough blankets (+" + a + " " + x + "instead of +" + b + ", −" + c + " HP"; }]);
TRAD_MOTIFS.unshift(
  [/^Attaque de nuit \(force (\d+) contre votre défense (\d+)$/, "Night attack (strength $1 against your defense $2"],
  [/^Attaque de nuit repoussée \(force (\d+) contre votre défense (\d+)$/, "Night attack driven off (strength $1 against your defense $2"]
);
/* Relecture du 2026-11-15 (2) */
Object.assign(TRAD_ECRAN, {
  "touche pour la retirer": "tap to remove it", "touche pour le retirer": "tap to remove him", "Touche pour la retirer": "Tap to remove her", "Touche pour le retirer": "Tap to remove him",
  "Forcer": "Force", "Le combat commence : les zombies arrivent": "The fight begins: the zombies are coming",
  "{#} objets à fouiller": "{#} items to search", "{#} objet à fouiller": "{#} item to search",
  "Ce qui ne rentre pas dans les sacs restera sur place pour une prochaine fois": "Whatever doesn’t fit in the bags will stay there for next time",
  "À mains nues": "Bare-handed", "abattu": "killed", "tour": "turn", "L’équipe avant de fouiller": "The team before searching", "Ici": "Here",
  "laissé sur place": "left behind", "Mains nues": "Bare hands",
  "Va hurler": "Will scream", "va hurler pour appeler du renfort": "will scream to call for backup", "Va voler": "Will steal", "Va s’enfuir": "Will run off",
  "va s’enfuir avec ce qu’il a volé : abattez-le vite": "will run off with what it stole: take it down fast", "Va pondre": "Will spawn",
  "un Rampant va sortir de son ventre": "a Crawler is about to come out of its belly", "Gonfle": "Swelling",
  "gonfle doucement (un Rampant sortira au tour suivant": "swells slowly (a Crawler will come out next turn"
});
TRAD_MOTIFS.unshift(
  [/^va attaquer (.+) \((\d+)-(\d+)$/, "will attack $1 ($2-$3"], [/^va attaquer (.+) et (.+) \((\d+)-(\d+)$/, "will attack $1 and $2 ($3-$4"],
  [/^va attaquer (.+)$/, "will attack $1"], [/^va arracher (\d+) objets de votre butin$/, "will snatch $1 items from your loot"],
  [/^frappe en premier$/, "strikes first"]
);
Object.assign(TRAD_ECRAN, { "S’est enfui": "Ran off", "À terre": "Down" });
Object.assign(TRAD_ECRAN, { "touche pour la retirer": "tap to remove", "touche pour le retirer": "tap to remove", "Touche pour la retirer": "Tap to remove", "Touche pour le retirer": "Tap to remove" });
/* Relecture du 2026-11-15 (3) : clans, échanges */
Object.assign(TRAD_ECRAN, {
  "Vraiment quitter ? Tu devras attendre {#} h avant un autre clan": "Really leave? You’ll have to wait {#} h before another clan",
  "{#}/{#} volontaires": "{#}/{#} volunteers", "{#} / {#} volontaires": "{#} / {#} volunteers", "{#} / {#} volontaires · dont le tien": "{#} / {#} volunteers · including yours",
  "Écrire au clan": "Write to the clan", "Écrire au clan…": "Write to the clan…", "Tu demandes": "You ask for", "Tu donnes": "You give", "Ton offre": "Your offer", "Contre": "In exchange for", "Donne": "Gives",
  "Il te manque des objets": "You’re missing items", "Pendant une partie seulement": "During a game only", "Tu as fait cet échange": "You made this trade",
  "Choisis au moins un objet à donner et un objet à demander": "Choose at least one item to give and one to ask for",
  "Les échanges se font pendant une partie, au refuge": "Trades happen during a game, at the refuge",
  "Tu as déjà une offre en cours : annule-la ou attends qu’elle soit prise": "You already have an open offer: cancel it or wait until it’s taken",
  "Tu demandes beaucoup plus que ce que tu donnes : ajoute un objet ou demande moins": "You’re asking for much more than you give: add an item or ask for less",
  "Tu n’as plus tous les objets que tu proposes": "You no longer have all the items you’re offering",
  "Ton offre est publiée. Ce que tu donnes est mis de côté jusqu’à ce qu’un membre accepte": "Your offer is posted. What you give is set aside until a member accepts",
  "Expirée": "Expired", "Annulée": "Canceled", "Acceptée": "Accepted"
});
TRAD_MOTIFS.unshift(
  [/^En attente · encore (.+)$/, "Waiting · $1 left"], [/^Ton prochain échange dans (.+)$/, "Your next trade in $1"],
  [/^Pris par (.+)$/, "Taken by $1"], [/^Échangé avec (.+)$/, "Traded with $1"], [/^(.+) propose un échange$/, "$1 offers a trade"],
  [/^(.+) a déposé (.+)$/, "$1 deposited $2"], [/^(.+) a pris (\d+) (.+)$/, "$1 took $2 $3"], [/^(.+) a construit : (.+)$/, "$1 built: $2"],
  [/^(\d+) bots? (?:ont|a) rejoint le clan \(test$/, "$1 bot(s) joined the clan (test"]
);
Object.assign(TRAD_ECRAN, {
  "Que s’est-il passé ? Sur quel écran ? Qu’attendais-tu": "What happened? On which screen? What did you expect", "Ton idée pour améliorer le jeu": "Your idea to improve the game",
  "Ton message": "Your message", "Ex. : Renard du quartier": "E.g.: Neighborhood Fox", "Ex. BL{#}": "E.g. BL{#}",
  "Chercher dans les règles": "Search the rules", "Chercher dans les objets": "Search the items", "Chercher dans les lieux": "Search the places",
  "Chercher dans les zombies": "Search the zombies", "Chercher dans la famille": "Search the family"
});

/* ---------- Balayage du code (classement.js, raid.js, chat.js), 2026-11-15 ---------- */
Object.assign(TRAD_ECRAN, {
  "Impossible de joindre le classement (pas de connexion, ou cette page bloque internet). Il marche dans le jeu installé": "Can’t reach the leaderboard (no connection, or this page blocks the internet). It works in the installed game",
  "Score refusé par le serveur": "Score refused by the server", "tu es": "you are", "sur": "out of", "tu n’es pas encore dans les": "you’re not in the top", "Nouveau meilleur score enregistré": "New best score saved",
  "Ton meilleur score reste": "Your best score is still", "hors des": "outside the top", "Score envoyé": "Score sent",
  "Personne n’a encore de partie classée ce mois-ci : la couronne est à prendre": "Nobody has a ranked game this month yet: the crown is up for grabs",
  "Personne n’a encore envoyé de score. Sois le premier": "Nobody has sent a score yet. Be the first", "ce mois-ci": "this month",
  "janvier": "January", "février": "February", "mars": "March", "avril": "April", "mai": "May", "juin": "June", "juillet": "July", "août": "August", "septembre": "September", "octobre": "October", "novembre": "November", "décembre": "December",
  "fouillé": "searched", "fabriqué": "crafted", "pêché": "caught", "coupée": "cut", "réussie": "completed", "plus longue survie (jours": "longest survival (days", "au total": "in total",
  "est tombée au jour": "fell on day", "n°{#} du mois dernier avec": "no. {#} of last month with", "points. Qui sera la prochaine Légende": "points. Who will be the next Legend",
  "passe en tête du mois devant": "takes the lead this month ahead of", "déjà tenté leur chance": "already tried their luck", "Sois le premier à défendre ta famille": "Be the first to defend your family",
  "Ce n’est plus possible": "It’s no longer possible", "Un nouveau membre rejoint la famille (si quelqu’un est mort": "A new member joins the family (if someone has died", "rejoint la famille": "joins the family",
  "{#} rations d’eau et {#} de nourriture": "{#} water rations and {#} food rations", "Un bidon d’eau et un lot de conserves au stock": "A water jug and a pack of canned food in the stock",
  "{#} trousses de soins et {#} antibiotique": "{#} first aid kits and {#} antibiotic", "{#} trousses de soins et un antibiotique au stock": "{#} first aid kits and an antibiotic in the stock",
  "Caisse d’armes": "Weapons crate", "Un fusil de chasse et une boîte de cartouches": "A hunting rifle and a box of shells", "Un fusil de chasse et des cartouches au stock": "A hunting rifle and shells in the stock",
  "Kit du mécano": "Mechanic’s kit", "Une pièce de voiture manquante et un jerrican": "A missing car part and a jerry can", "et un": "and a", "jerrican au stock": "jerry can in the stock",
  "en réserve": "in reserve", "Déjà utilisé par": "Already used by", "Je survis à l’apocalypse dans ZOMBRIA – Le dernier refuge 🧟 Rejoins-moi avec mon code": "I’m surviving the apocalypse in ZOMBRIA – The Last Refuge 🧟 Join me with my code",
  "on reçoit chacun un colis de ravitaillement": "we each get a supply package", "Vérification": "Checking", "Code spécial accepté": "Special code accepted",
  "Code accepté ! Ton ami reçoit aussi un colis": "Code accepted! Your friend gets a package too", "Code refusé": "Code refused", "Ravitaillement largué": "Supplies dropped",
  "tu as déjà utilisé le tien pour cette partie": "you’ve already used yours for this game", "Pendant une partie": "During a game", "Déjà un bonus cette partie": "Already one bonus this game",
  "Pas utile pour l’instant": "Not useful right now", "a été utilisé par": "was used by", "ZOMBRIA – Le dernier refuge": "ZOMBRIA – The Last Refuge",
  "Message copié : colle-le à tes amis": "Message copied: paste it to your friends", "Lien copié": "Link copied", "Chef du clan «": "Leader of the clan “", "Membre du clan «": "Member of the clan “",
  "le classement": "the leaderboard", "les clans": "the clans", "aujourd’hui": "today", "à l’assaut": "to the assault", "l’immeuble": "the apartment block",
  "Tu as tenu": "You’ve held out", "jours : tu peux fonder un clan ou en rejoindre un ({#} familles maximum": "days: you can found a clan or join one ({#} families max",
  "Les clans s’ouvrent quand ta famille a tenu": "Clans open once your family has held out", "tu en es au jour": "you’re on day", "Voici ceux qui t’attendent": "Here are the ones waiting for you",
  "Le nom doit faire au moins {#} lettres": "The name must be at least {#} letters", "Le clan «": "The clan “", "est fondé ! Tu en es le chef": "is founded! You’re its leader",
  "Ce nom": "This name", "Cette description": "This description", "Change-la": "Change it", "Description enregistrée": "Description saved", "Bienvenue dans le clan": "Welcome to the clan",
  "Tu as quitté le clan. Tu pourras en rejoindre ou en fonder un autre dans {#} h": "You left the clan. You can join or found another in {#} h",
  "Pendant une guerre, chaque défenseur a +": "During a war, each defender has +", "PV et frappe plus fort": "HP and hits harder",
  "Pas encore de remparts : les défenseurs ne sont pas mieux protégés": "No ramparts yet: the defenders aren’t better protected", "posée": "laid", "posées": "laid", "Aucune mine posée": "No mines laid",
  "chacune blesse un assaillant pendant une guerre, puis disparaît": "each one wounds an attacker during a war, then disappears",
  "Les défenseurs portent des gilets : pendant une guerre, chaque tir ennemi perd": "The defenders wear vests: during a war, each enemy shot loses", "dégâts (": "damage (", "à la tête) et chaque coup": "to the head) and each blow",
  "Pas encore d’armurerie : les armes à feu adverses font tous leurs dégâts": "No armory yet: enemy firearms do full damage", "de défense de nuit pour chaque famille du clan": "night defense for each family in the clan",
  "Pas encore de tour : aucune défense de nuit en plus": "No tower yet: no extra night defense", "Le camion enfonce l’entrée : chaque défenseur perd": "The truck rams the entrance: each defender loses",
  "PV au début de l’assaut": "HP at the start of the assault", "Le camion arrive sans rien pour enfoncer l’entrée": "The truck arrives with nothing to ram the entrance",
  "Le camion encaisse les": "The truck absorbs the", "première": "first", "premières": "first", "de chaque assaut, sans blessé": "of each assault, with nobody hurt",
  "Les mines adverses blessent directement l’équipe": "Enemy mines hit the team directly", "Accrochée au camion pour le raid de l’immeuble": "Hitched to the truck for the apartment block raid",
  "objets de plus ramenés": "more items brought back", "Pour le raid de l’immeuble : sans elle, chaque volontaire ne ramène que": "For the apartment block raid: without it, each volunteer only brings back",
  "À chaque tour, la tourelle tire sur le défenseur le plus faible (": "Each turn, the turret fires at the weakest defender (", "dégâts ; les gilets de l’armurerie adverse la freinent": "damage; the enemy armory’s vests slow it down",
  "Pas de tourelle : toute l’attaque repose sur l’équipe": "No turret: the whole attack relies on the team", "le bastion": "the stronghold",
  "Il est encore nu : améliore-le avec la réserve": "It’s still bare: upgrade it with the stockpile", "Payé par la réserve": "Paid by the stockpile",
  "a pillé le bastion (": "looted the stronghold (", "a pillé notre bastion (": "looted our stronghold (", "Tu as déposé": "You deposited", "dans la réserve": "into the stockpile", "Tu as pris": "You took",
  "niveau supérieur construit": "next level built", "la guerre": "the war", "Gagnée": "Won", "Égalité": "Draw", "Perdue": "Lost",
  "Dernière guerre gagnée": "Last war won", "Dernière guerre perdue": "Last war lost", "Dernière guerre : match nul": "Last war: draw",
  "nouveaux assauts dans": "new assaults in", "fin dans": "ends in", "repoussé": "repelled", "Personne n’a assez d’énergie (": "Nobody has enough energy (",
  "ni de vie pour partir à l’assaut. Reviens après une nuit de repos": "or health to go on the assault. Come back after a night’s rest",
  "Équipement de guerre porté": "War gear worn", "Aucun équipement de guerre (gilet, casque, bouclier) : fabrique-le à l’atelier": "No war gear (vest, helmet, shield): craft it in the workshop",
  "Les défenseurs ont une armurerie niveau": "The defenders have an armory level", "vise la tête": "aim for the head", "Assaut réussi": "Assault succeeded", "Assaut repoussé": "Assault repelled",
  "Un adversaire a été trouvé : la guerre commence": "An opponent has been found: the war begins", "Recherche lancée. La guerre commencera dès qu’un autre clan complet sera prêt": "Search started. The war will begin as soon as another full clan is ready",
  "Recherche annulée": "Search canceled", "Le cadre de départ": "The starting frame", "porté": "worn", "Ton clan est attaqué": "Your clan is under attack", "a attaqué": "attacked",
  "Tu es la Légende de": "You are the Legend of", "avec": "with", "points : couronne, cadre doré et Raja tout le mois. Un colis t’attend": "points: crown, golden frame and Raja all month. A package awaits you",
  "Ton règne est terminé": "Your reign is over", "est la Légende de": "is the Legend of", "Pas de Légende ce mois-ci": "No Legend this month", "Finis n°{#} du mois pour reprendre la couronne": "Finish no. {#} of the month to take back the crown",
  "du mois prochain": "of next month", "Tu dépasses": "You pass", "points) : tu es en tête du mois ! Garde la tête jusqu’au {#}er": "points): you’re leading the month! Stay ahead until the {#}st",
  "pour devenir la Légende": "to become the Legend", "Plus que": "Only", "points pour passer en tête du mois": "points to take the lead this month",
  "Tu as fait les trois quarts du chemin vers la tête du mois": "You’re three quarters of the way to the top of the month", "Tu as dépassé la moitié du score du n°{#} du mois (": "You’ve passed half the score of the month’s no. {#} (",
  "Quand les villes sont tombées, le zoo de la ville a été abandonné du jour au lendemain. Les gardiens ont fui, les cages sont restées fermées": "When the cities fell, the city zoo was abandoned overnight. The keepers fled, and the cages stayed shut",
  "Des semaines plus tard, un survivant a entendu des rugissements derrière les grilles rouillées : un tigre, affamé, qui se jetait contre les barreaux": "Weeks later, a survivor heard roaring behind the rusty gates: a starving tiger, throwing itself against the bars",
  "Chaque nuit, il est revenu lui glisser un peu de viande, sans jamais ouvrir la cage. Au bout d’un mois, le tigre a cessé de gronder quand il approchait": "Every night, they came back to slip it a little meat, without ever opening the cage. After a month, the tiger stopped growling when they came near",
  "Le jour où il a ouvert la porte, le tigre ne l’a pas dévoré : il l’a suivi. On l’appelle Raja. On dit qu’il ne reste qu’auprès du plus grand survivant de son temps": "The day they opened the door, the tiger didn’t devour them: it followed them. It’s called Raja. They say it only stays with the greatest survivor of their time",
  "et qu’il change de maître le jour où quelqu’un fait mieux que lui": "and changes masters the day someone does better",
  "Prêt à bondir dans cette partie": "Ready to leap in this game", "Il a déjà bondi dans cette partie": "It has already leapt in this game", "sur {#} · ton clan compte sur toi": "out of {#} · your clan is counting on you",
  "Les rencontres": "Encounters", "Choisir ce portrait": "Choose this portrait",
  "Nouvel avatar choisi. Il apparaîtra dans le classement à ton prochain score envoyé": "New avatar chosen. It will appear on the leaderboard with your next score",
  "Ton avatar est revenu à l’initiale de ton pseudo": "Your avatar is back to your username’s initial", "Tu le portes : tu es la Légende du mois. Raja te suit": "You’re wearing it: you are the Legend of the Month. Raja follows you",
  "Réservé à la Légende du mois": "Reserved for the Legend of the Month", "Fais le meilleur score du mois en partie classée pour le porter, avec Raja en prime": "Get the month’s best score in a ranked game to wear it, with Raja as a bonus",
  "Pas pendant une guerre de clans": "Not during a clan war", "Prochain changement dans": "Next change in", "un changement tous les": "one change every", "Ranger au stock": "Put in the stock",
  "Classement général": "General leaderboard", "Ton score (": "Your score (", "sera comparé à ceux de tous les joueurs. Seul ton meilleur score est gardé": "will be compared with every player’s. Only your best score is kept",
  "Choisis un pseudo (pas ton vrai nom": "Choose a username (not your real name", "elle ne compte pas pour le classement. Seules les parties classées y entrent": "it doesn’t count for the leaderboard. Only ranked games go in",
  "Ta partie classée n’apparaît pas encore : il te faut un": "Your ranked game doesn’t show yet: you need a", "c’est lui que les autres verront": "that’s what the others will see",
  "Ta partie classée entrera au classement dès ton premier point (à la fin de ta première journée": "Your ranked game will enter the leaderboard with your first point (at the end of your first day",
  "Ta partie classée (⭐": "Your ranked game (⭐", "points) est envoyée au serveur : elle apparaîtra ici dans quelques instants. Sans connexion, elle partira plus tard": "points) has been sent to the server: it will appear here in a few moments. Without a connection, it will go later",
  "Le panthéon est encore vide : le n°{#} de ce mois y entrera le {#}er du mois prochain": "The hall of fame is still empty: this month’s no. {#} will enter it on the {#}st of next month",
  "Chaque fin de mois, le n°{#} devient la Légende du mois suivant et entre au panthéon": "At the end of each month, no. {#} becomes the Legend of the next month and enters the hall of fame",
  "a régné": "reigned", "Tu es": "You are", "meilleur score d’une partie classée ({#} point par jour et par survivant": "best score from a ranked game ({#} point per day per survivor",
  "en cours = partie encore en vie, score mis à jour en direct": "in progress = game still alive, score updated live", "La Légende de": "The Legend of", "c’est toi": "it’s you",
  "Le n°{#} de": "No. {#} of", "sera la Légende de": "will be the Legend of", "couronnée le {#}er": "crowned on the {#}st", "Tu es en tête de": "You’re leading", "points) : garde la tête jusqu’au {#}er": "points): stay ahead until the {#}st",
  "En tête de": "Leading in", "points), futur(e) Légende de": "points), future Legend of", "si personne ne fait mieux": "if nobody does better", "Personne n’est encore en tête de": "Nobody is leading yet in",
  "la couronne de": "the crown of", "est à prendre": "is up for grabs", "Couronne remise le {#}er": "Crown awarded on the {#}st", "dans": "in", "La couronne est remise demain": "The crown is awarded tomorrow",
  "Ils nous ont quittés": "They left us", "Joue une première partie pour remplir tes stats": "Play a first game to fill in your stats",
  "Il n’y a plus rien à manger. Demain, quelqu’un mourra de faim. Dans le silence, une idée terrible fait son chemin": "There’s nothing left to eat. Tomorrow, someone will starve. In the silence, a terrible idea takes shape",
  "Si tu choisis quelqu’un, la famille aura de quoi tenir quelques jours (+": "If you choose someone, the family will have enough to last a few days (+",
  "rations). Mais le moral s’effondrera, et la": "rations). But morale will collapse, and", "s’installera chez les survivants : elle grandira chaque nuit et les poussera à des actes terribles": "will take hold of the survivors: it will grow every night and drive them to terrible acts",
  "Vraiment ? Il n’y aura pas de retour en arrière, et personne n’oubliera": "Really? There’s no going back, and nobody will forget", "Oui, il le faut": "Yes, it has to be done", "La nuit la plus longue": "The longest night",
  "Ton sac de bonus est plein (": "Your bonus bag is full (", "au maximum). Utilise un bonus pendant une partie, puis reviens ouvrir ton colis": "max). Use a bonus during a game, then come back to open your package",
  "Un avion survole le quartier et largue trois caisses. Tu n’as le temps d’en récupérer qu’une. Laquelle": "A plane flies over the neighborhood and drops three crates. You only have time to grab one. Which one",
  "Il rejoint ton sac de bonus (": "It goes into your bonus bag (", "Tu pourras l’utiliser": "You can use it", "une fois par partie": "once per game",
  "au moment de ton choix ; s’il ne sert pas, il reste pour la partie suivante": "whenever you choose; if it isn’t used, it stays for the next game", "Ouvrir le colis suivant (": "Open the next package (",
  "Gagne des colis en invitant des amis": "Earn packages by inviting friends", "Ce membre n’a pas encore partagé ses chiffres (ils arrivent à sa prochaine visite": "This member hasn’t shared their numbers yet (they come with their next visit",
  "Fondé": "Founded", "jours tenus à eux tous": "days survived between them", "Ce clan n’a pas encore de description": "This clan has no description yet",
  "Aucun clan pour l’instant. Sois le premier à en fonder un": "No clans yet. Be the first to found one", "Choisis d’abord ton pseudo (il apparaîtra dans le clan": "Choose your username first (it will appear in the clan",
  "Choisis d’abord ton pseudo : c’est lui que les autres membres verront": "Choose your username first: that’s what the other members will see",
  "La réserve est vide : déposez des vivres et des matériaux": "The stockpile is empty: deposit supplies and materials", "Rien à déposer (vivres, soins, munitions, matériaux": "Nothing to deposit (supplies, healing, ammo, materials",
  "Le camion du clan conduit chaque équipe à l’assaut. Ses améliorations servent à tous les membres": "The clan truck drives each team to the assault. Its upgrades serve every member",
  "il faut dans la réserve": "needed in the stockpile", "Rien pour l’instant": "Nothing yet", "gagnée": "won", "égalité": "draw", "perdue": "lost",
  "Le détail des guerres apparaîtra ici à la fin de la prochaine guerre": "War details will appear here at the end of the next war",
  "Le clan cherche un adversaire de sa taille… La guerre commencera dès qu’un autre clan complet sera prêt": "The clan is looking for an opponent its size… The war will begin as soon as another full clan is ready",
  "Une guerre dure": "A war lasts", "Chaque jour, chaque membre peut lancer": "Each day, each member can launch",
  "contre une famille adverse : un combat tactique contre ses défenseurs, ses mines et ses remparts. Les étoiles décident du vainqueur, et chaque victoire rapporte une part de la réserve adverse": "against an enemy family: a tactical fight against its defenders, mines and ramparts. Stars decide the winner, and each victory brings a share of the enemy stockpile",
  "Ligues : une guerre gagnée rapporte +{#} trophées, perdue −{#}, nulle +{#}. Tu n’affrontes qu’un clan de ta ligue (ou de la ligue voisine si personne d’autre n’attend) : Ferraille, Bronze ({#}), Argent ({#}), Or ({#}), Légende ({#}": "Leagues: a war won earns +{#} trophies, lost −{#}, drawn +{#}. You only face a clan from your league (or the next league if nobody else is waiting): Scrap, Bronze ({#}), Silver ({#}), Gold ({#}), Legend ({#}",
  "Seul le chef peut lancer la recherche d’un adversaire": "Only the leader can start looking for an opponent", "Tu as lancé ton assaut aujourd’hui. Reviens demain": "You’ve launched your assault today. Come back tomorrow",
  "Assaut sur": "Assault on", "Partent à l’assaut": "Going on the assault", "chacun). Ils affronteront les défenseurs du bastion adverse, ses mines et ses remparts": "each). They’ll face the enemy stronghold’s defenders, mines and ramparts",
  "Les blessures et les morts sont réelles. Tu peux fuir pendant le combat, mais sans étoile": "Wounds and deaths are real. You can flee during the fight, but with no stars",
  "À l’assaut": "Attack", "Butin pris dans la réserve adverse": "Loot taken from the enemy stockpile", "La réserve adverse était vide": "The enemy stockpile was empty",
  "Tu as": "You have", "succès ·": "achievements ·", "débloqué": "unlocked", "Ton clan": "Your clan", "Tu passes en tête du mois": "You take the lead this month",
  "Garde la tête jusqu’au {#}er": "Stay ahead until the {#}st", "Tu restes en tête du mois": "You stay in the lead this month",
  "Personne n’est encore en tête du mois : la prochaine couronne est à prendre": "Nobody is leading the month yet: the next crown is up for grabs", "Tu es en tête du mois (": "You’re leading the month (", "tu passes devant": "you pass",
  "Une fois par partie, dans n’importe quel combat (expédition, raid de l’immeuble, zombie célèbre, assaut de guerre), le bouton « Lâcher le tigre » fait bondir Raja : tous les zombies tombent ; le Colosse et les zombies célèbres perdent": "Once per game, in any fight (trip, apartment block raid, famous zombie, war assault), the “Unleash the tiger” button sends Raja leaping: every zombie falls; the Colossus and famous zombies lose",
  "de leur vie ; en guerre de clans, chaque défenseur perd": "of their health; in clan wars, each defender loses", "de sa vie. Détrônée, la Légende perd Raja": "of their health. Once dethroned, the Legend loses Raja",
  "Ton avatar s’affiche dans le classement et dans ton clan. Il reste le même d’une partie à l’autre": "Your avatar shows on the leaderboard and in your clan. It stays the same from one game to the next",
  "Revenir à l’initiale de mon pseudo": "Go back to my username’s initial", "Ton historique se remplira à la fin de ta première famille": "Your history will fill up at the end of your first family",
  "Un cadeau de l’équipe": "A gift from the team", "Dans le colis": "In the package",
  "Pas assez d’armes, de munitions ou de soins : l’équipe risque de tomber dès les premiers étages": "Not enough weapons, ammo or healing: the team may fall on the first floors",
  "Pillé : ta part t’attend": "Looted: your share is waiting", "Équipe prête : le chef peut lancer": "Team ready: the leader can launch", "dont le tien": "including yours",
  "Ouvre-la pour voir où en est ton clan": "Open it to see how your clan is doing", "Le toit est tombé": "The roof has fallen", "L’équipe n’est pas revenue": "The team didn’t come back",
  "L’équipe est redescendue": "The team came back down", "laissés faute de place": "left for lack of room", "Reprendre le raid": "Resume the raid",
  "sinon, n’importe qui pourra le lancer dans": "otherwise, anyone can launch it in", "objets ramenés": "items brought back", "Sans elle": "Without it",
  "est parti": "has gone", "est partie": "has gone", "au bastion pour le raid de l’immeuble": "to the stronghold for the apartment block raid", "est rentré": "came home", "est rentrée": "came home",
  "à la maison avec ce que tu lui avais confié": "with what you entrusted to them", "Ton volontaire est rentré": "Your volunteer came home", "étage": "floor", "étages": "floors",
  "le reste devra être abandonné": "the rest will have to be left behind", "est soigné": "is healed", "est soignée": "is healed", "s’est brisé": "broke", "s’est brisée": "broke", "pendant le raid": "during the raid",
  "est revenu": "came back", "est revenue": "came back", "du raid (❤️": "from the raid (❤️", "Rendu de ce que tu avais confié": "Returned from what you entrusted", "Pas de replay pour ce raid": "No replay for this raid",
  "Trouvé": "Found", "Étage": "Floor", "Personne n’est revenu": "Nobody came back", "abandonnés": "left behind", "Raid à envoyer": "Raid to send",
  "Le résultat du raid attend : ouvre les Opérations du bastion": "The raid result is waiting: open the stronghold’s Operations", "Le raid de l’immeuble a eu lieu": "The apartment block raid has taken place",
  "Va au bastion (Opérations) : replay, nouvelles de ton volontaire et ta part du butin": "Go to the stronghold (Operations): replay, news of your volunteer and your share of the loot",
  "L’équipe est prête": "The team is ready", "volontaires attendent au bastion : à toi de lancer le raid de l’immeuble": "volunteers are waiting at the stronghold: it’s up to you to launch the apartment block raid",
  "Ton clan prépare une opération": "Your clan is preparing an operation", "Le raid de l’immeuble peut partir : il reste une place pour ton volontaire": "The apartment block raid can go: there’s one place left for your volunteer",
  "Raid de l’immeuble : il manque": "Apartment block raid: missing", "Envoie le tien depuis le bastion": "Send yours from the stronghold", "étages · une seule fois par clan": "floors · only once per clan",
  "Raid mené par": "Raid led by", "Récupérer ma part": "Collect my share", "Tu as récupéré ta part": "You collected your share", "pour partir (": "to go (", "au plus": "at most",
  "Raid en cours, lancé par": "Raid underway, launched by", "L’équipe est prête : le chef peut lancer le raid": "The team is ready: the leader can launch the raid",
  "En parler au clan ›": "Talk it over with the clan ›", "au stock": "in the stock", "Ce que tu confies à": "What you entrust to",
  "Rien à confier (munitions, cocktails, soins, canettes": "Nothing to entrust (ammo, Molotovs, healing, energy drinks", "points de force (une équipe prête en réunit environ": "strength points (a ready team totals about",
  "nettoyé": "cleared", "trouvés · place pour": "found · room for", "Plus haut": "Higher up", "Chances de nettoyer l’étage": "Chance to clear the floor", "sans perte": "with no losses",
  "Soigner le plus blessé (": "Heal the most wounded (", "Réessayer": "Try again", "Plus tard": "Later",
  "Le résultat est gardé : il sera envoyé dès que tu réessaies (onglet Immeuble du bastion": "The result is kept: it will be sent as soon as you try again (stronghold Building tab",
  "Pas de butin pour toi cette fois": "No loot for you this time", "Part du clan versée à la réserve": "Clan share paid into the stockpile",
  "Ton clan t’a écrit : ouvre la discussion (menu ☰ → Clans, ou la cheminée du bastion": "Your clan wrote to you: open the chat (menu ☰ → Clans, or the stronghold fireplace",
  "Il te manque des objets pour cet échange": "You’re missing items for this trade", "Touche encore 🚩 pour signaler ce message à l’équipe du jeu": "Tap 🚩 again to report this message to the game team",
  "Merci, le message a été signalé": "Thanks, the message has been reported", "Un échange toutes les {#} h : le prochain dans": "One trade every {#} h: the next one in", "Échange du clan": "Clan trade",
  "Échangé avec": "Traded with", "Ton prochain échange dans": "Your next trade in", "Tu n’as rien à échanger : vivres, soins, munitions et matériaux seulement": "You have nothing to trade: supplies, healing, ammo and materials only",
  "choisis des deux côtés": "choose on both sides", "équitable": "fair", "tu demandes trop": "you’re asking too much", "Aucun message pour l’instant": "No messages yet",
  "Dis bonjour à ton clan": "Say hi to your clan", "Offre annulée": "Offer canceled", "Offre expirée": "Offer expired", "propose un échange": "offers a trade",
  "libre": "free", "Remorque artisanale": "Homemade trailer", "appartements": "apartments", "bureaux": "offices", "en guerre": "at war", "à l'assaut": "to the assault",
  "Jour {#} / {#}": "Day {#} / {#}", "{#} mine": "{#} mine", "{#} mines": "{#} mines", "remparts {#}": "ramparts {#}", "Familles adverses": "Enemy families",
  "nouveaux assauts dans {#} h {#} min": "new assaults in {#} h {#} min", "fin dans {#} h {#} min": "ends in {#} h {#} min"
});
TRAD_MOTIFS.unshift(
  [/^Jour (\d+) : (.+) attaque (.+) → repoussé$/, "Day $1: $2 attacks $3 → repelled"],
  [/^Jour (\d+) : (.+) attaque (.+) → (.+)$/, "Day $1: $2 attacks $3 → $4"],
  [/^La guerre contre « (.+) » commence$/, "The war against “$1” begins"],
  [/^Une guerre dure (\d+) jours\. (.+)$/, function(m, n, r){ return "A war lasts " + n + " days. " + (TRAD_ECRAN[r] || r); }]
);
Object.assign(TRADUCTIONS.en, { "Jour {j} : {qui} attaque {cible} → {res}": "Day {j}: {qui} attacks {cible} → {res}", "repoussé": "repelled" });
Object.assign(TRADUCTIONS.en, { "Personne n’a assez d’énergie ({n} ⚡) ni de vie pour partir à l’assaut. Reviens après une nuit de repos.": "Nobody has enough energy ({n} ⚡) or health to go on the assault. Come back after a night’s rest." });
Object.assign(TRAD_ECRAN, { "Assauts": "Assaults" });
Object.assign(TRADUCTIONS.en, { "Une guerre dure <b>3 jours</b>. Chaque jour, chaque membre peut lancer <b>un assaut</b> contre une famille adverse : un combat tactique contre ses défenseurs, ses mines et ses remparts. Les étoiles décident du vainqueur, et chaque victoire rapporte une part de la réserve adverse.": "A war lasts <b>3 days</b>. Each day, every member can launch <b>one assault</b> against an enemy family: a tactical fight against its defenders, mines and ramparts. Stars decide the winner, and each victory brings a share of the enemy stockpile." });

/* ---------- Balayage du code (ui.js, piece.js, guide.js, succes.js, defis.js), 2026-11-15 ---------- */
Object.assign(TRAD_ECRAN, {
  "Survivant blessé": "Wounded survivor", "Un survivant blessé": "A wounded survivor", "Des pillards": "Raiders", "La bande des Corbeaux": "The Crows gang", "Le chef des Corbeaux": "The Crows’ leader",
  "L’officier": "The officer", "L’éclaireur sur le toit": "The scout on the roof", "L’éclaireur": "The scout", "La vieille voisine": "The old neighbor", "On frappe à la porte": "Someone’s knocking at the door",
  "La fièvre": "The fever", "Dispute à table": "Argument at dinner", "Le chien": "The dog", "Ragoût": "Stew", "Adhésif": "Tape", "Épingles": "Pins", "Défense": "Defense", "Lumière": "Light",
  "sont gravement blessés": "are badly wounded", "est gravement blessé": "is badly wounded", "est gravement blessée": "is badly wounded", "lampe prête": "lamp ready", "pas de lumière": "no light", "porte à forcer": "door to force",
  "Trajet sans fatigue et +": "Tireless trip and +", "places dans le coffre, mais l’essence baisse et le moteur fait du bruit": "trunk slots, but fuel goes down and the engine makes noise",
  "Le trajet fatigue l’équipe. La voiture mène aussi aux zones éloignées": "The trip tires the team. The car also reaches the far zones",
  "Sombre : lampe prête": "Dark: lamp ready", "Sombre : lampe sans pile": "Dark: lamp with no battery", "Verrouillé : de quoi ouvrir": "Locked: something to open it",
  "Canne à pêche prête": "Fishing rod ready", "Hache prête": "Axe ready", "Pas assez d’essence": "Not enough fuel", "a des doigts de fée : la zone verte est plus large": "has nimble fingers: the green zone is wider",
  "Vous avez fui : vous ne rapporterez que la moitié de ce que vous trouverez": "You fled: you’ll only bring back half of what you find", "sont blessés": "are wounded", "est blessé": "is wounded", "est blessée": "is wounded",
  "pense à soigner en rentrant (touche sa carte, puis « Soigner": "remember to heal when you get back (tap their card, then “Heal",
  "choisis l’action de chacun puis « Jouer": "choose everyone’s action then “Play", "L’assaut commence : les défenseurs vous attendent": "The assault begins: the defenders are waiting for you", "Tête": "Head",
  "Le toit est à vous : l’immeuble est pillé": "The roof is yours: the building is looted", "nettoyé : fouillez-le, puis choisissez de monter ou de redescendre": "cleared: search it, then choose to go up or come back down",
  "L’équipe quitte l’immeuble avec ce qu’elle a déjà trouvé": "The team leaves the building with what it has already found", "Personne n’est revenu de l’immeuble : tout le butin est perdu": "Nobody came back from the building: all the loot is lost",
  "Le bastion est tombé : à vous le butin et les étoiles": "The stronghold has fallen: the loot and the stars are yours", "L’assaut a échoué": "The assault failed", "à fouiller ici": "to search here",
  "Vous avez fui : vous ne ramènerez que la moitié de ce que vous trouverez": "You fled: you’ll only bring back half of what you find", "Personne n’est revenu de": "Nobody came back from",
  "Voir le butin": "See the loot", "Continuer la fouille": "Keep searching", "Lâcher le tigre": "Unleash the tiger", "Réussi": "Success", "Raté": "Missed", "rapporté": "brought back",
  "Fouille les lieux ou fabrique-en une à l’atelier (lance, gourdin clouté": "Search places or craft one in the workshop (spear, nail club",
  "Lampe, torche, canne à pêche… à trouver dehors ou à fabriquer à l’atelier": "Lamp, torch, fishing rod… found outside or crafted in the workshop",
  "Sacoches et sacs se trouvent en fouillant, ou se fabriquent avec des chiffons": "Satchels and bags are found while searching, or crafted with rags",
  "dans l’équipe": "in the team", "trop fatigué": "too tired", "trop fatiguée": "too tired", "Vous avez ce qu’il faut": "You have what you need", "Aucun soin au refuge": "No healing at the refuge", "déjà bu aujourd’hui": "already drunk today",
  "Il n’a pas mangé hier soir. Ce soir, il faut une ration pour lui, sinon il part": "He didn’t eat last night. Tonight he needs a ration, or he’ll leave",
  "La famille n’a plus de quoi manger ce soir. +": "The family has nothing left to eat tonight. +", "Matériaux": "Materials", "Solidité": "Durability",
  "tout le monde est trop fatigué": "everyone is too tired", "vers une zone éloignée": "to a far zone", "Pas assez pour une zone éloignée (": "Not enough for a far zone (", "Tout le monde est trop fatigué": "Everyone is too tired",
  "Prêt : touche pour le faire": "Ready: tap to do it", "de défense la nuit (une attaque perdue en détruit un niveau": "defense at night (a lost attack destroys one level", "Récupérateur d’eau · niveau": "Water collector · level",
  "ration(s) d’eau chaque nuit": "water ration(s) every night", "ration(s) de nourriture chaque nuit": "food ration(s) every night", "de chances chaque nuit : +": "chance every night: +",
  "de défense contre la prochaine attaque de nuit (un piège par attaque": "defense against the next night attack (one trap per attack", "ration(s) d’eau · +": "water ration(s) · +",
  "de défense la nuit · mange": "defense at night · eats", "n’a pas mangé hier": "didn’t eat yesterday", "mangés": "eaten", "de défense grâce aux armes en main": "defense from the weapons in hand",
  "Améliorer": "Upgrade", "aucun plat prêt": "no dish ready", "la dernière": "the last", "à tomber": "to fall", "Tenez plus longtemps que nous": "Hold out longer than we did",
  "Copié ! Colle-le dans un message": "Copied! Paste it into a message", "Récompense prête": "Reward ready", "échangé": "traded", "ne va pas là": "doesn’t go there", "Impossible pour l’instant": "Not possible right now",
  "Ta famille a tenu bon dans votre maison… jusqu’à ce soir": "Your family held on in your home… until tonight", "Ils sont à la porte": "They’re at the door",
  "Tu as une minute pour remplir le sac avant de fuir vers le refuge : une vieille maison au bout de la rue, avec une cheminée et des murs solides": "You have one minute to fill the bag before fleeing to the refuge: an old house at the end of the street, with a fireplace and solid walls",
  "Là-bas, il faudra fouiller le quartier, barricader, soigner les tiens. Personne ne viendra vous sauver. Le seul but": "Over there, you’ll have to search the neighborhood, barricade, heal your family. Nobody will come to save you. The only goal",
  "tenir le plus longtemps possible, tous ensemble": "hold out as long as possible, all together", "Une famille de {#}": "A family of {#}", "Plus de {#} lieux": "Over {#} places",
  "Code d’invitation reçu": "Invite code received", "Prénom de": "First name of", "Il s’affichera dans le classement (pas ton vrai nom). {#} lettres au plus": "It will show on the leaderboard (not your real name). {#} letters max",
  "{#} lettres au plus": "{#} letters max", "Pseudo enregistré : tu peux rejoindre un clan": "Username saved: you can join a clan", "Pseudo enregistré": "Username saved",
  "Pseudo enregistré : ta partie classée entre au classement du mois": "Username saved: your ranked game enters the monthly leaderboard", "Un autre membre s’appelle déjà «": "Another member is already called “",
  "choisis des prénoms différents": "choose different first names", "Pas assez pour tout le monde ce soir": "Not enough for everyone tonight", "va faire des dégâts": "will do damage",
  "Chaque nuit, chacun": "Every night, everyone", "{#} ration, et {#} de plus si sa jauge tombe sous": "{#} ration, and {#} more if their gauge drops below", "Le récupérateur": "The collector",
  "Piège à zombies : +": "Zombie trap: +", "monte la garde : +": "stands guard: +", "Tours de guet du bastion de ton clan : +": "Your clan stronghold’s watchtowers: +",
  "Tu as changé de maison : le sac est vidé": "You changed house: the bag has been emptied", "Classée ·": "Ranked ·", "personne n’a d’outil pour ouvrir": "nobody has a tool to open",
  "la serrure (": "the lock (", "Chaque raté casse une épingle": "Each miss breaks a pin", "Appuie quand le curseur est dans la zone verte": "Tap when the cursor is in the green zone",
  "à fouiller": "to search", "L’arme de": "The weapon of", "est presque cassée : répare-la à l’atelier": "is almost broken: repair it in the workshop",
  "Raja a déjà bondi dans cette partie": "Raja has already leapt in this game", "Lâcher le tigre : une fois par partie": "Unleash the tiger: once per game",
  "Vous rentrez les mains vides": "You come home empty-handed", "Vous avez vidé les lieux : il n’y a plus rien à trouver ici": "You’ve emptied the place: there’s nothing left to find here",
  "Aucun objet de ce type au refuge": "No item of this kind at the refuge", "Fouille moins bien, actes terribles la nuit ; à {#}": "Searches worse, terrible acts at night; at {#}",
  "de la saison ·": "of the season ·", "jours de jeu, puis la suivante arrive ; après l’été, l’automne revient": "days of play, then the next one comes; after summer, autumn returns",
  "PV grâce au soigneur": "HP thanks to the healer", "La nuit, chacun boit et mange déjà {#} ration ({#} si sa jauge passe sous": "At night, everyone already drinks and eats {#} ration ({#} if their gauge drops below",
  "n’en donne en plus qu’en cas d’urgence": "only gives extra in an emergency", "Seulement aujourd’hui · revient dans": "Today only · back in", "Sans manger": "Without food",
  "ne reviendra jamais, et toute la famille va le vivre très mal": "will never come back, and the whole family will take it very hard",
  "Glisse chaque pièce sur son emplacement (": "Drag each part onto its slot (", "Tout le monde est trop fatigué (il faut": "Everyone is too tired (you need",
  "Cuisinière à bois": "Wood stove", "Chaque portion": "Each portion", "Fin du jour": "End of the day", "Envoi au classement": "Sending to the leaderboard", "Envoyer au classement": "Send to the leaderboard",
  "Copier mon résultat pour le partager": "Copy my result to share it", "Partie libre : pas de classement": "Free game: no leaderboard", "Le coffre de la famille d’avant": "The previous family’s chest",
  "Sous l’escalier, une caisse attendait. Dedans": "Under the stairs, a crate was waiting. Inside", "La lettre est gardée près des tombes, dans la cour": "The letter is kept near the graves, in the yard",
  "Regarder une courte pub · encore": "Watch a short ad · left", "Publicité (simulation": "Ad (simulation", "Ici s’affichera plus tard une vraie pub récompensée": "A real rewarded ad will show here later",
  "Récupérer la récompense": "Collect the reward", "Dans la fuite, vous emportez aussi le coffre de la famille d’avant": "As you flee, you also take the previous family’s chest",
  "est là aujourd’hui": "is here today", "Il échange ce qu’il a dans sa charrette. Il repart ce soir": "He trades what’s in his cart. He leaves tonight",
  "Préparer le sac ⏱": "Pack the bag ⏱", "Préparer le sac": "Pack the bag", "Tu restes": "You stay", "pour l’instant": "for now",
  "On ne peut changer de pseudo qu’une fois tous les {#} jours, et jamais pendant une guerre de clans, pour que chacun sache qui est qui": "You can only change your username once every {#} days, and never during a clan war, so everyone knows who is who",
  "Mission réussie": "Mission complete", "Choisis ta récompense": "Choose your reward", "{#} place dans le sac": "{#} slot in the bag", "Fermer la porte": "Close the door",
  "Remparts et mines": "Ramparts and mines", "L’immeuble": "The apartment block", "froid sans feu ni couverture : +": "cold with no fire or blanket: +", "Le feu brûle toute la nuit": "The fire burns all night",
  "la planche d’hier suffit": "yesterday’s plank is enough", "{#} planche pour {#} nuits": "{#} plank for {#} nights", "mange {#} ration et monte la garde": "eats {#} ration and stands guard",
  "Les poules boivent": "The chickens drink", "d’eau et pondent peut-être": "water and may lay eggs", "Si les zombies viennent : force": "If the zombies come: strength",
  "votre défense": "your defense", "la barricade risque de céder": "the barricade may give way", "La porte d’entrée est restée ouverte ! Défense −": "The front door was left open! Defense −",
  "et plus de risque d’attaque tant qu’elle n’est pas fermée": "and more risk of attack as long as it isn’t closed",
  "Quelqu’un va mourir de faim, et il n’y a plus rien. Il reste une solution, la pire de toutes": "Someone is going to starve, and there’s nothing left. There is one solution left, the worst of all",
  "La famille se recueille en silence. Le moral remonte un peu (+": "The family pays its respects in silence. Morale picks up a little (+", "amélioré : niveau": "upgraded: level",
  "Pas encore de barricade : la porte ne tiendra pas longtemps": "No barricade yet: the door won’t hold for long", "Trop tard : le poisson s’est décroché": "Too late: the fish got away",
  "Trop tôt ! Le poisson a eu peur": "Too early! The fish got scared", "Ferré ! Un beau poisson": "Hooked! A fine fish", "Plus de planches à brûler": "No more planks to burn",
  "il est allumé": "it’s lit", "il est éteint": "it’s out", "Déjà fait aujourd’hui": "Already done today", "Une radio dirait où": "A radio would say where",
  "Remettre la barre avant de dormir": "Put the bar back before sleeping", "Sacrifier l’un des vôtres pour que les autres survivent": "Sacrifice one of your own so the others survive",
  "Porte refermée": "Door closed", "Tu refermes la porte et remets la barre. La maison est de nouveau à l’abri pour la nuit": "You close the door and put the bar back. The house is safe again for the night",
  "Une attaque perdue en détruit un niveau": "A lost attack destroys one level", "planches (tu en as": "planks (you have", "dans l’étang": "in the pond", "Rentrer avec la pêche": "Go home with the catch",
  "Il brûle": "It burns", "Les autres auront froid (": "The others will be cold (", "elles servent aussi à construire et à fabriquer": "they’re also used to build and craft",
  "chaque nuit, tant qu": "every night, as long as", "est au refuge (le moral baisse de": "is at the refuge (morale drops by",
  "de moral ou plus, l’équipe trouve {#} objet de plus en fouille ; sous": "morale or more, the team finds {#} more item when searching; below",
  "Fait découvrir les lieux secrets": "Reveals the secret places", "jours plus tôt, et capte parfois des messages le matin": "days earlier, and sometimes picks up messages in the morning",
  "Le foyer du bastion": "The stronghold hearth", "Le clan l’entretient jour et nuit : il ne s’éteint jamais. C’est ici que les familles se retrouvent pour les veillées et pour préparer les guerres": "The clan keeps it going day and night: it never goes out. This is where families gather for evenings and to prepare for wars",
  "Il ne chauffe pas ta maison : ton propre feu s’allume dans la cheminée du salon ou de la chambre (": "It doesn’t heat your house: your own fire is lit in the living room or bedroom fireplace (",
  "Aller au salon": "Go to the living room", "La lettre de la famille d’avant": "The previous family’s letter", "PV) rôde en ville": "HP) is prowling the town",
  "Il faut aspirer au bon moment : trop tôt ou trop tard, ça gicle et le bruit attire les zombies": "You have to suck at the right moment: too early or too late, it splashes and the noise attracts zombies",
  "Appuie sur « Aspirer » quand le niveau est dans la zone verte": "Press “Siphon” when the level is in the green zone",
  "éclaire bien ({#} pile par fouille": "gives good light ({#} battery per search", "tient chaud {#} personnes la nuit": "keeps {#} people warm at night",
  "{#} place dans un sac": "{#} slot in a bag", "{#} aujourd’hui": "{#} today", "débloqués": "unlocked", "colis à ouvrir": "packages to open", "bonus gardés": "bonuses saved",
  "secret : découvert vers le jour": "secret: discovered around day", "Une partie du menu n’a pas pu s’afficher (": "Part of the menu couldn’t be displayed (",
  "Si un membre meurt, une survivante peut frapper à la porte et prendre sa place (famille de": "If a member dies, a survivor may knock on the door and take their place (family of",
  "au maximum). Elle arrive avec un trait au hasard": "max). She arrives with a random trait", "Après l’avoir nourri, il reste : +": "After feeding him, there’s: +", "de défense la nuit, mais il mange": "defense at night, but he eats",
  "Toute la famille en vie au jour {#}": "The whole family alive on day {#}", "Barricade au niveau maximum": "Barricade at max level", "Potager et récupérateur d’eau au maximum": "Garden and water collector at max",
  "Fabriquer {#} objets à l’atelier": "Craft {#} items in the workshop", "Crocheter une serrure": "Pick a lock", "Pêcher {#} poissons": "Catch {#} fish", "Avoir {#} poules en même temps": "Have {#} chickens at once",
  "Réussir {#} missions": "Complete {#} missions", "Découvrir tous les lieux secrets": "Discover every secret place", "Revenir vivant du Bunker du survivaliste": "Come back alive from the Survivalist’s Bunker",
  "Revenir vivant de la Base militaire": "Come back alive from the Military Base", "Déposer {#} objets dans la réserve du clan": "Deposit {#} items into the clan stockpile",
  "Construire une défense du bastion": "Build a stronghold defense", "Gagner une étoile pendant une guerre de clans": "Win a star during a clan war", "Réussir un assaut à {#} étoiles": "Win a {#}-star assault",
  "Gagner une guerre de clans": "Win a clan war", "Cadre Mythique : tout réussir": "Mythic frame: do it all", "Tous les cadres débloqués": "All frames unlocked", "Débloqué": "Unlocked",
  "Défi réussi": "Challenge complete", "Les {#} défis du jour": "All {#} daily challenges", "Défi de la semaine réussi": "Weekly challenge complete", "Colis gagné": "Package earned",
  "La grande horde est là": "The great horde is here", "Tout le week-end : nuits et combats plus durs. Chaque zombie abattu compte pour l’objectif de tous les joueurs": "All weekend: harder nights and fights. Every zombie killed counts toward all players’ goal",
  "Les survivants ont abattu": "Survivors have killed", "Défis du jour ·": "Daily challenges ·", "Événement mondial": "World event", "Grande horde du week-end": "Great weekend horde",
  "Prochaine horde dans": "Next horde in", "La grande horde · encore": "The great horde · left", "Objectif atteint = un colis pour chaque participant": "Goal reached = a package for every participant",
  "Survivre à la première nuit": "Survive the first night", "Tenir {#} jours": "Hold out {#} days", "Atteindre un score de {#}": "Reach a score of {#}", "Réparer la voiture": "Repair the car",
  "Garder Rex {#} nuits": "Keep Rex {#} nights", "Rejoindre ou fonder un clan": "Join or found a clan", "Fonder un clan": "Found a clan",
  "Le cadre de départ": "The starting frame", "{#} succès débloqués": "{#} achievements unlocked", "Tous les succès débloqués": "All achievements unlocked", "Bois": "Wood", "Mythique": "Mythic", "Argent": "Silver", "Or": "Gold"
});
Object.assign(TRAD_ECRAN, { "un changement tous les {#} jours, jamais en guerre": "one change every {#} days, never during a war" });
TRAD_MOTIFS.unshift(
  [/^Cadre (Bronze|Argent|Or|Bois) : encore (\d+)$/, function(m, c, n){ return ({ Bronze:"Bronze", Argent:"Silver", Or:"Gold", Bois:"Wood" })[c] + " frame: " + n + " to go"; }],
  [/^Pas pendant une guerre de clans · un changement tous les (\d+) jours, jamais en guerre$/, "Not during a clan war · one change every $1 days, never during a war"],
  [/^(.+) · un changement tous les (\d+) jours, jamais en guerre$/, function(m, r, n){ return (TRAD_ECRAN[r] || r) + " · one change every " + n + " days, never during a war"; }]
);
/* Vitrine raccourcie (128 caractères au plus, 2026-11-15) */
Object.assign(TRAD_ECRAN, {
  "Chaque objet trouvé ne revient jamais. Des lieux secrets s’ouvrent avec le temps, jusqu’au zoo et à la prison": "Every item you find is gone for good. Secret places open up over time, all the way to the zoo and the prison",
  "Vise la tête, pousse, soigne, lance un cocktail… Des zombies variés et des zombies célèbres à traquer": "Aim for the head, shove, heal, throw a Molotov… All kinds of zombies, and famous ones to hunt down",
  "Dès 30 jours, rejoins un clan de 5 familles : bastion, réserve, défenses, échanges et guerres contre d’autres clans": "From day 30, join a clan of 5 families: stronghold, stockpile, defenses, trades and wars against other clans",
  "Chacun envoie un volontaire, le chef mène l’assaut d’un immeuble de 5 étages. Replay pour tous, butin partagé": "Everyone sends a volunteer, the leader storms a 5-floor apartment block. Replay for all, shared loot",
  "Le meilleur joueur du mois devient la Légende du mois suivant, avec Raja le tigre. Défis chaque jour, horde chaque week-end": "The month’s best player becomes the next month’s Legend, with Raja the tiger. Daily challenges, a horde every weekend"
});
Object.assign(TRAD_ECRAN, {
  "Dès {#} jours, rejoins un clan de {#} familles : bastion, réserve, défenses, échanges et guerres contre d’autres clans": "From day {#}, join a clan of {#} families: stronghold, stockpile, defenses, trades and wars against other clans",
  "Chacun envoie un volontaire, le chef mène l’assaut d’un immeuble de {#} étages. Replay pour tous, butin partagé": "Everyone sends a volunteer, the leader storms a {#}-floor apartment block. Replay for all, shared loot"
});
