/* =====================================================================
   paroles.js — les survivants parlent (2026-11-21, demande de Fabien : s'attacher aux survivants)
   Une bulle au-dessus de la carte d'un survivant (en bas de l'écran, téléphone comme PC), selon son état :
   deuil, folie, blessure, soif, faim, froid, fatigue, son envie, le moral de la famille, ou une phrase du quotidien.
   Elle apparaît au début de chaque journée, puis de temps en temps quand rien ne se passe, et disparaît seule.
   Interface seulement (la simulation ne charge pas ce fichier). Chargé après piece.js.
   ===================================================================== */
var PAROLES = {
  "Papa": {
    deuil:["Je n’ai pas su protéger {mort}…", "Je pense à {mort} à chaque instant."],
    fou:["Tu les entends aussi ? Ils grattent… ils grattent…", "Il faut tout barricader. Tout. Maintenant."],
    blesse:["Ce n’est rien. Juste une égratignure… aïe.", "Je tiendrai. Il le faut."],
    soif:["Ma gorge… une gorgée d’eau, juste une."], faim:["Je donnerais n’importe quoi pour un vrai repas."],
    froid:["Il nous faudrait un feu. Les enfants grelottent."], fatigue:["Laissez-moi fermer les yeux cinq minutes…"],
    triste:["On va s’en sortir. Il faut y croire."], content:["Regardez-nous. On est encore debout.", "Ce soir, on mange tous ensemble. C’est ça qui compte."],
    idle:["J’ai vérifié les planches deux fois. Elles tiendront.", "Il faut penser à l’eau. Toujours l’eau.", "Restez près de moi, d’accord ?"]
  },
  "Maman": {
    deuil:["La place de {mort} reste vide à table.", "Je garde les affaires de {mort}. Je n’arrive pas à les jeter."],
    fou:["Qui a bougé les conserves ? QUI ?", "Je n’ai pas dormi depuis… depuis quand ?"],
    blesse:["Passe-moi un bandage, je m’en occupe toute seule."], soif:["On rationne l’eau, mais moi je n’en peux plus."],
    faim:["J’ai encore donné ma part. Ce n’est pas grave."], froid:["Une couverture de plus, ou un feu. Sinon on tombe malades."],
    fatigue:["Je dors debout…"], triste:["Il faut qu’on se serre les coudes. Tous."], content:["Ça sent presque bon, ici. Presque."],
    idle:["Qui a pensé à compter les rations ?", "Lavez-vous les mains, même ici.", "On fait l’inventaire ce soir."]
  },
  "Léo": {
    deuil:["C’est pas juste. {mort} aurait dû être là.", "Je vais le faire pour {mort}. Tout."],
    fou:["Ils sont dans les murs. Je te jure qu’ils sont dans les murs."], blesse:["Ça va, ça va ! Arrête de me regarder comme ça."],
    soif:["J’ai la langue comme du carton."], faim:["On mange quand ? Sérieux."], froid:["Je sens plus mes doigts."],
    fatigue:["Encore cinq minutes…"], triste:["Ça sert à quoi, tout ça ?"], content:["Avoue, on gère quand même."],
    idle:["Laisse-moi venir la prochaine fois. S’il te plaît.", "Y’a plus de réseau depuis des mois et je vérifie encore.", "J’ai trouvé un raccourci, je te montrerai."]
  },
  "Emma": {
    deuil:["Je parle à {mort} tous les soirs, avant de dormir.", "Je garde un dessin pour {mort}."],
    fou:["La dame dans le placard m’a dit de ne pas dormir."], blesse:["Ça fait mal… tu me fais un bisou magique ?"],
    soif:["J’ai soif… très très soif."], faim:["Mon ventre fait des bruits de zombie."], froid:["J’ai froid aux pieds…"],
    fatigue:["Tu me portes jusqu’au lit ?"], triste:["Quand est-ce qu’on rentre à la maison ?"], content:["Je t’ai fait un dessin ! C’est nous, et là c’est le soleil."],
    idle:["Pourquoi les zombies ils sont tristes ?", "J’ai compté les étoiles. Il en manque aucune.", "Quand je serai grande, je soignerai les zombies."]
  },
  autres: {
    deuil:["Je pensais avoir déjà tout perdu. Pas deux fois.", "{mort} m’avait ouvert la porte, ce jour-là."],
    fou:["Je les vois encore, sur la route. Ils me suivent."], blesse:["Je vais bien. J’ai connu pire."],
    soif:["Un peu d’eau… s’il en reste."], faim:["Je ne me plains pas. Mais j’ai faim."], froid:["Ce froid me rappelle la route."],
    fatigue:["Je ne tiens plus debout."], triste:["Merci de m’avoir ouvert la porte, ce jour-là."], content:["Je crois que je me sens chez moi, ici."],
    idle:["Avant, j’avais une famille, moi aussi.", "Je monte la garde cette nuit, si tu veux."]
  }
};
// Ce que chacun dit de son envie (voir ENVIES dans data.js)
var DIT_ENVIE = {
  radio:"Si on trouvait une radio… juste pour savoir s’il reste du monde.", voiture:"Cette vieille voiture… elle peut repartir, j’en suis sûr.",
  barricade:"Il faudrait une vraie barricade. Celle-là ne tiendra pas.", potager:"J’aimerais faire pousser quelque chose. Un petit potager.",
  trousse:"Je serais plus tranquille avec une trousse de soins de côté.", plat:"Un vrai repas chaud… je ne me souviens plus du goût.",
  cartes:"Si on avait un jeu de cartes, au moins…", arme:"Je veux ma propre arme. Je suis plus un gamin.",
  chien:"Un chien. Rien qu’un chien. Ce serait trop bien.", peluche:"J’ai perdu ma peluche… tu crois qu’on la retrouvera ?",
  poules:"On pourrait avoir des poules ? Je m’en occuperai !", feu:"Un feu dans la cheminée, ce soir ? Comme avant ?"
};

// L'état le plus fort du survivant, puis une phrase au hasard pour cet état
function etatParole(x){
  if(enDeuil(x)) return "deuil";
  if(fou(x)) return "fou";
  if(x.hp < 40) return "blesse";
  if(x.soif < 25) return "soif";
  if(x.faim < 25) return "faim";
  if(estSaison("hiver") && !G.feu) return "froid";
  if(!peutSortir(x)) return "fatigue";
  if(x.envie && Math.random() < 0.5) return "envie";
  if(G.moral < 35) return "triste";
  if(G.moral >= 70 && Math.random() < 0.5) return "content";
  return "idle";
}
function phraseDe(x){
  var e = etatParole(x);
  if(e === "envie" && DIT_ENVIE[x.envie]) return trad(DIT_ENVIE[x.envie]);
  var P = PAROLES[roleDe(x)] || PAROLES.autres, L = P[e] || P.idle;
  return trad(L[Math.floor(Math.random() * L.length)], { mort:x.deuil ? x.deuil.nom : "" });
}
// Peut-on parler maintenant ? Pas pendant une sortie, un combat, un événement, la nuit, le raid ; sur téléphone, pas sous une fenêtre ouverte
function peutParler(){
  if(typeof G === "undefined" || !G || G.ph !== "game" || G.bacASable || G.exp || G.combat || G.rencontre || G.siphon || G.ev || G.nuit) return false;
  if(document.getElementById("gameover") || document.querySelector("#astuce.on") || document.getElementById("apCarte") && document.getElementById("apCarte").style.display === "flex") return false;
  var m = document.getElementById("modal"), ouvert = m && (m.style.display === "flex" || m.style.display === "block");
  return !ouvert || document.body.classList.contains("pc"); /* sur PC, la fenêtre est dans le panneau : les cartes restent visibles */
}
var bulleT = null;
function direQuelqueChose(x){
  if(!x || !x.al || !peutParler()) return false;
  var i = G.m.indexOf(x), carte = document.querySelector('.mc[data-id="' + i + '"]'); if(!carte) return false;
  var r = carte.getBoundingClientRect(); if(!r.width || r.bottom < 0) return false;
  var b = document.getElementById("bulleParole");
  if(!b){ b = document.createElement("div"); b.id = "bulleParole"; b.setAttribute("role", "status"); b.setAttribute("aria-live", "polite"); document.body.appendChild(b); }
  b.innerHTML = '<b>' + echapper(x.nom) + '</b>' + phraseDe(x);
  b.classList.remove("on"); b.style.left = "0px"; b.style.top = "0px"; b.style.visibility = "hidden"; b.style.display = "block";
  var w = b.offsetWidth, h = b.offsetHeight, cx = r.left + r.width / 2, L = Math.max(8, Math.min(window.innerWidth - w - 8, cx - w / 2));
  b.style.left = L + "px"; b.style.top = Math.max(8, r.top - h - 12) + "px"; b.style.setProperty("--queue", Math.max(14, Math.min(w - 14, cx - L)) + "px");
  b.style.visibility = ""; void b.offsetWidth; b.classList.add("on");
  clearTimeout(bulleT); bulleT = setTimeout(function(){ b.classList.remove("on"); }, 5500);
  return true;
}
// Qui parle ? De préférence quelqu'un qui a quelque chose sur le cœur (deuil, blessure, envie…)
function choisirParleur(){
  var v = vivants().filter(function(x){ return !x.raid; }); if(!v.length) return null;
  var forts = v.filter(function(x){ var e = etatParole(x); return e !== "idle" && e !== "content"; });
  var L = forts.length && Math.random() < 0.7 ? forts : v;
  return L[Math.floor(Math.random() * L.length)];
}
// Au début de chaque journée, puis toutes les 40 à 75 secondes quand rien ne se passe
var paroleJour = -1, paroleProchaine = Date.now() + 8000;
setInterval(function(){
  try{
    if(!peutParler()) return;
    if(G.day !== paroleJour){ if(direQuelqueChose(choisirParleur())){ paroleJour = G.day; paroleProchaine = Date.now() + 40000 + Math.random() * 35000; } return; }
    if(Date.now() > paroleProchaine){ direQuelqueChose(choisirParleur()); paroleProchaine = Date.now() + 40000 + Math.random() * 35000; }
  }catch(e){}
}, 1500);
// La bulle se cache dès qu'une fenêtre s'ouvre (téléphone) ou qu'on change d'écran
setInterval(function(){ var b = document.getElementById("bulleParole"); if(b && b.classList.contains("on") && !peutParler()) b.classList.remove("on"); }, 400);

if(typeof TRADUCTIONS !== "undefined"){ TRADUCTIONS.en = TRADUCTIONS.en || {}; Object.assign(TRADUCTIONS.en, {
  "Je n’ai pas su protéger {mort}…":"I couldn’t protect {mort}…", "Je pense à {mort} à chaque instant.":"I think about {mort} every moment.",
  "Tu les entends aussi ? Ils grattent… ils grattent…":"Can you hear them too? Scratching… scratching…", "Il faut tout barricader. Tout. Maintenant.":"We have to board everything up. Everything. Now.",
  "Ce n’est rien. Juste une égratignure… aïe.":"It’s nothing. Just a scratch… ouch.", "Je tiendrai. Il le faut.":"I’ll hold on. I have to.",
  "Ma gorge… une gorgée d’eau, juste une.":"My throat… a sip of water, just one.", "Je donnerais n’importe quoi pour un vrai repas.":"I’d give anything for a real meal.",
  "Il nous faudrait un feu. Les enfants grelottent.":"We need a fire. The kids are shivering.", "Laissez-moi fermer les yeux cinq minutes…":"Let me close my eyes for five minutes…",
  "On va s’en sortir. Il faut y croire.":"We’ll make it. We have to believe it.", "Regardez-nous. On est encore debout.":"Look at us. We’re still standing.",
  "Ce soir, on mange tous ensemble. C’est ça qui compte.":"Tonight we all eat together. That’s what matters.",
  "J’ai vérifié les planches deux fois. Elles tiendront.":"I checked the boards twice. They’ll hold.", "Il faut penser à l’eau. Toujours l’eau.":"We have to think about water. Always water.",
  "Restez près de moi, d’accord ?":"Stay close to me, okay?",
  "La place de {mort} reste vide à table.":"{mort}’s seat stays empty at the table.", "Je garde les affaires de {mort}. Je n’arrive pas à les jeter.":"I’m keeping {mort}’s things. I can’t throw them away.",
  "Qui a bougé les conserves ? QUI ?":"Who moved the cans? WHO?", "Je n’ai pas dormi depuis… depuis quand ?":"I haven’t slept since… since when?",
  "Passe-moi un bandage, je m’en occupe toute seule.":"Hand me a bandage, I’ll do it myself.", "On rationne l’eau, mais moi je n’en peux plus.":"We ration the water, but I can’t take it anymore.",
  "J’ai encore donné ma part. Ce n’est pas grave.":"I gave my share away again. It doesn’t matter.", "Une couverture de plus, ou un feu. Sinon on tombe malades.":"One more blanket, or a fire. Otherwise we’ll get sick.",
  "Je dors debout…":"I’m asleep on my feet…", "Il faut qu’on se serre les coudes. Tous.":"We have to stick together. All of us.", "Ça sent presque bon, ici. Presque.":"It almost smells nice in here. Almost.",
  "Qui a pensé à compter les rations ?":"Who remembered to count the rations?", "Lavez-vous les mains, même ici.":"Wash your hands, even here.", "On fait l’inventaire ce soir.":"We’re doing inventory tonight.",
  "C’est pas juste. {mort} aurait dû être là.":"It’s not fair. {mort} should be here.", "Je vais le faire pour {mort}. Tout.":"I’ll do it for {mort}. All of it.",
  "Ils sont dans les murs. Je te jure qu’ils sont dans les murs.":"They’re in the walls. I swear they’re in the walls.", "Ça va, ça va ! Arrête de me regarder comme ça.":"I’m fine, I’m fine! Stop looking at me like that.",
  "J’ai la langue comme du carton.":"My tongue feels like cardboard.", "On mange quand ? Sérieux.":"When do we eat? Seriously.", "Je sens plus mes doigts.":"I can’t feel my fingers.",
  "Encore cinq minutes…":"Five more minutes…", "Ça sert à quoi, tout ça ?":"What’s the point of all this?", "Avoue, on gère quand même.":"Admit it, we’re doing pretty well.",
  "Laisse-moi venir la prochaine fois. S’il te plaît.":"Let me come next time. Please.", "Y’a plus de réseau depuis des mois et je vérifie encore.":"There’s been no signal for months and I still check.",
  "J’ai trouvé un raccourci, je te montrerai.":"I found a shortcut, I’ll show you.",
  "Je parle à {mort} tous les soirs, avant de dormir.":"I talk to {mort} every night before I sleep.", "Je garde un dessin pour {mort}.":"I’m keeping a drawing for {mort}.",
  "La dame dans le placard m’a dit de ne pas dormir.":"The lady in the closet told me not to sleep.", "Ça fait mal… tu me fais un bisou magique ?":"It hurts… will you give it a magic kiss?",
  "J’ai soif… très très soif.":"I’m thirsty… really really thirsty.", "Mon ventre fait des bruits de zombie.":"My tummy is making zombie noises.", "J’ai froid aux pieds…":"My feet are cold…",
  "Tu me portes jusqu’au lit ?":"Will you carry me to bed?", "Quand est-ce qu’on rentre à la maison ?":"When are we going home?",
  "Je t’ai fait un dessin ! C’est nous, et là c’est le soleil.":"I made you a drawing! That’s us, and that’s the sun.",
  "Pourquoi les zombies ils sont tristes ?":"Why are the zombies sad?", "J’ai compté les étoiles. Il en manque aucune.":"I counted the stars. None are missing.",
  "Quand je serai grande, je soignerai les zombies.":"When I grow up, I’ll make the zombies better.",
  "Je pensais avoir déjà tout perdu. Pas deux fois.":"I thought I’d already lost everything. Not twice.", "{mort} m’avait ouvert la porte, ce jour-là.":"{mort} opened the door for me that day.",
  "Je les vois encore, sur la route. Ils me suivent.":"I still see them on the road. They follow me.", "Je vais bien. J’ai connu pire.":"I’m fine. I’ve had worse.",
  "Un peu d’eau… s’il en reste.":"A little water… if there’s any left.", "Je ne me plains pas. Mais j’ai faim.":"I’m not complaining. But I’m hungry.",
  "Ce froid me rappelle la route.":"This cold reminds me of the road.", "Je ne tiens plus debout.":"I can barely stand.",
  "Merci de m’avoir ouvert la porte, ce jour-là.":"Thank you for opening the door that day.", "Je crois que je me sens chez moi, ici.":"I think I feel at home here.",
  "Avant, j’avais une famille, moi aussi.":"I had a family too, before.", "Je monte la garde cette nuit, si tu veux.":"I’ll keep watch tonight, if you want.",
  "Si on trouvait une radio… juste pour savoir s’il reste du monde.":"If we found a radio… just to know if anyone’s still out there.",
  "Cette vieille voiture… elle peut repartir, j’en suis sûr.":"That old car… it can run again, I’m sure of it.", "Il faudrait une vraie barricade. Celle-là ne tiendra pas.":"We need a real barricade. This one won’t hold.",
  "J’aimerais faire pousser quelque chose. Un petit potager.":"I’d love to grow something. A little vegetable garden.", "Je serais plus tranquille avec une trousse de soins de côté.":"I’d feel safer with a first aid kit put aside.",
  "Un vrai repas chaud… je ne me souviens plus du goût.":"A real hot meal… I can’t remember the taste.", "Si on avait un jeu de cartes, au moins…":"If only we had a deck of cards…",
  "Je veux ma propre arme. Je suis plus un gamin.":"I want my own weapon. I’m not a kid anymore.", "Un chien. Rien qu’un chien. Ce serait trop bien.":"A dog. Just a dog. That would be so cool.",
  "J’ai perdu ma peluche… tu crois qu’on la retrouvera ?":"I lost my teddy… do you think we’ll find it?", "On pourrait avoir des poules ? Je m’en occuperai !":"Could we have chickens? I’ll take care of them!",
  "Un feu dans la cheminée, ce soir ? Comme avant ?":"A fire in the fireplace tonight? Like before?"
}); }

/* ---------- 2e lot (2026-11-21) : répliques qui réagissent, binômes, épitaphes ---------- */
var REACTIONS = {
  "Papa":{ retourBon:["De quoi tenir quelques jours de plus."], retourVide:["Rien. On recommencera demain."], victoire:["Personne ne touche à ma famille."],
    nuitRepoussee:["Ils ont tapé toute la nuit. La barricade a tenu."], nuitPerdue:["Il faut réparer. Tout de suite."], binome:["Avec {autre} à mes côtés, je ne crains rien."] },
  "Maman":{ retourBon:["Bon butin. Je range tout de suite."], retourVide:["Tout ça pour rien…"], victoire:["C’est fini… on rentre. Maintenant."],
    nuitRepoussee:["Personne n’a fermé l’œil… mais on est là."], nuitPerdue:["On a eu de la chance. Cette fois."], binome:["{autre} et moi, on se comprend sans parler."] },
  "Léo":{ retourBon:["Vous avez vu ce qu’on a ramené ?!"], retourVide:["Franchement, c’était vide de chez vide."], victoire:["T’as vu comment je l’ai eu ?!"],
    nuitRepoussee:["Ils reviendront. Et on sera prêts."], nuitPerdue:["Ils sont entrés… ils sont entrés !"], binome:["Avec {autre}, je crains rien."] },
  "Emma":{ retourBon:["C’est quoi dans le sac ? Montre !"], retourVide:["On a rien trouvé… pardon."], victoire:["J’ai eu peur… mais on a gagné !"],
    nuitRepoussee:["J’ai entendu les monstres… mais ils sont partis."], nuitPerdue:["Je veux pas qu’ils reviennent…"], binome:["J’aime bien sortir avec {autre}."] },
  autres:{ retourBon:["Une bonne sortie. Ça fait du bien."], retourVide:["Les lieux se vident. Il faudra aller plus loin."], victoire:["On fait une bonne équipe."],
    nuitRepoussee:["Une nuit de plus. On tient."], nuitPerdue:["Il faut renforcer les défenses, et vite."], binome:["{autre} me couvre toujours. Je lui dois beaucoup."],
    arrivee:["Merci de m’accueillir. Je ne vous décevrai pas.", "Je sais me rendre utile, vous verrez."] }
};
// Une réplique en attente : elle sera dite dès que possible (dans les 30 s), par l'un des survivants concernés
var reactionAttente = null;
function noterReaction(cle, qui){ reactionAttente = { cle:cle, qui:(qui || []).filter(function(x){ return x && x.al; }), t:Date.now() }; }
function direReaction(){
  var R0 = reactionAttente; reactionAttente = null; if(!R0 || Date.now() - R0.t > 30000) return false;
  var L = R0.qui.length ? R0.qui : vivants(); var x = L[Math.floor(Math.random() * L.length)]; if(!x) return false;
  var P = REACTIONS[roleDe(x)] || REACTIONS.autres, lignes = P[R0.cle] || REACTIONS.autres[R0.cle]; if(!lignes) return false;
  return direQuelqueChose(x, trad(lignes[Math.floor(Math.random() * lignes.length)]));
}
// Une phrase de binôme de temps en temps, quand rien d'autre ne presse
var phraseDeBase = phraseDe;
phraseDe = function(x){
  var br = typeof binomeDe === "function" ? binomeDe(x) : null, bx = br && G.m.filter(function(y){ return y.al && roleDe(y) === br; })[0];
  if(bx && etatParole(x) === "idle" && Math.random() < 0.35){ var P = REACTIONS[roleDe(x)] || REACTIONS.autres, L = P.binome || REACTIONS.autres.binome; return trad(L[Math.floor(Math.random() * L.length)], { autre:bx.nom }); }
  return phraseDeBase(x);
};
// direQuelqueChose accepte maintenant une phrase toute faite
var direBase = direQuelqueChose;
direQuelqueChose = function(x, phrase){
  if(!phrase) return direBase(x);
  var avant = phraseDe; phraseDe = function(){ return phrase; };
  try{ return direBase(x); } finally { phraseDe = avant; }
};
// Les événements qui font réagir : départ (on retient l'équipe), retour de fouille, victoire, nuit attaquée, nouvelle recrue
var equipeSortie = [];
if(typeof expedition === "function"){ var expeditionBase = expedition; expedition = function(){ equipeSortie = G.sel.map(function(j){ return G.m[j]; }); return expeditionBase.apply(this, arguments); }; }
if(typeof openResultat === "function"){ var openResultatBase = openResultat; openResultat = function(r){ try{ if(!reactionAttente || reactionAttente.cle !== "victoire") noterReaction(r && r.pris && r.pris.length ? "retourBon" : "retourVide", equipeSortie); }catch(e){} return openResultatBase.apply(this, arguments); }; }
if(typeof openCombat === "function"){ var openCombatBase = openCombat; openCombat = function(){ try{ var C = G.combat; if(C && C.fin === "victoire" && !C.reagi){ C.reagi = true; noterReaction("victoire", equipeSortie); } }catch(e){} return openCombatBase.apply(this, arguments); }; }
if(typeof openNuit === "function"){ var openNuitBase = openNuit; openNuit = function(n){ try{ (n || []).forEach(function(l){ if(/^🧟/.test(l[1] || "")) noterReaction(l[0] === "g2" ? "nuitRepoussee" : "nuitPerdue", vivants()); }); }catch(e){} return openNuitBase.apply(this, arguments); }; }
var nomsConnus = null;
setInterval(function(){
  try{
    if(typeof G === "undefined" || !G || G.ph !== "game" || !G.m) { nomsConnus = null; return; }
    var noms = vivants().map(function(x){ return x.nom; });
    if(nomsConnus){ var nouveau = vivants().filter(function(x){ return nomsConnus.indexOf(x.nom) < 0 && !FAMILLE.some(function(f){ return f.nom === x.r; }); })[0]; if(nouveau) noterReaction("arrivee", [nouveau]); }
    nomsConnus = noms;
    if(reactionAttente && peutParler()) direReaction();
  }catch(e){}
}, 1200);

/* ---------- L'épitaphe : graver quelques mots sur la tombe ---------- */
function openEpitaphe(i){
  var d = G.dd && G.dd[i]; if(!d) return; d.epVu = true;
  var L = EPITAPHES[d.r] || EPITAPHES.autres, x = { nom:d.n, r:d.r, icone:d.ic || "🙂", al:false, hp:0, en:0, faim:0, soif:0 };
  var h = '<div class="ep-fen"><div class="ep-por">' + iconeMembre(x) + '<div><h2>🪦 ' + trad("Une tombe pour {nom}", { nom:echapper(d.n) }) + '</h2>'
    + (d.dp ? '<p class="ep-dp">💬 « ' + trad(d.dp) + ' »</p>' : '') + '</div></div>'
    + '<p class="sub">' + trad("Quels mots graver sur sa tombe ?") + '</p>'
    + L.map(function(t, k){ return '<button class="loc" data-act="epchoix" data-id="' + i + ':' + k + '"><b>« ' + trad(t) + ' »</b></button>'; }).join("") + '</div>' + BTN_FERMER();
  show(h);
}
document.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest("[data-act]"); if(!b) return;
  var a = b.getAttribute("data-act");
  if(a === "epit"){ openEpitaphe(+b.getAttribute("data-id")); return; }
  if(a === "epchoix"){ var p = b.getAttribute("data-id").split(":"), d = G.dd[+p[0]]; if(!d) return; var L = EPITAPHES[d.r] || EPITAPHES.autres; d.ep = L[+p[1]];
    if(typeof sauver === "function") sauver(); hide(); if(typeof openTombes === "function") openTombes(); return; }
});
// Après une mort récente, la fenêtre de l'épitaphe s'ouvre d'elle-même au premier moment calme (une seule fois par mort)
setInterval(function(){
  try{
    if(typeof momentCalme !== "function" || !momentCalme()) return;
    var i = (G.dd || []).findIndex(function(d){ return !d.ep && !d.epVu && G.day - d.j <= 2; });
    if(i >= 0) openEpitaphe(i);
  }catch(e){}
}, 2000);

if(typeof TRADUCTIONS !== "undefined") Object.assign(TRADUCTIONS.en, {
  "De quoi tenir quelques jours de plus.":"Enough to hold out a few more days.", "Rien. On recommencera demain.":"Nothing. We’ll try again tomorrow.", "Personne ne touche à ma famille.":"Nobody touches my family.",
  "Ils ont tapé toute la nuit. La barricade a tenu.":"They pounded all night. The barricade held.", "Il faut réparer. Tout de suite.":"We have to repair it. Right now.", "Avec {autre} à mes côtés, je ne crains rien.":"With {autre} by my side, I fear nothing.",
  "Bon butin. Je range tout de suite.":"Good haul. I’ll put it away right now.", "Tout ça pour rien…":"All that for nothing…", "C’est fini… on rentre. Maintenant.":"It’s over… we’re going home. Now.",
  "Personne n’a fermé l’œil… mais on est là.":"Nobody slept a wink… but we’re here.", "On a eu de la chance. Cette fois.":"We were lucky. This time.", "{autre} et moi, on se comprend sans parler.":"{autre} and I understand each other without words.",
  "Vous avez vu ce qu’on a ramené ?!":"Did you see what we brought back?!", "Franchement, c’était vide de chez vide.":"Honestly, it was totally empty.", "T’as vu comment je l’ai eu ?!":"Did you see how I got it?!",
  "Ils reviendront. Et on sera prêts.":"They’ll be back. And we’ll be ready.", "Ils sont entrés… ils sont entrés !":"They got in… they got in!", "Avec {autre}, je crains rien.":"With {autre}, I’m not scared of anything.",
  "C’est quoi dans le sac ? Montre !":"What’s in the bag? Show me!", "On a rien trouvé… pardon.":"We didn’t find anything… sorry.", "J’ai eu peur… mais on a gagné !":"I was scared… but we won!",
  "J’ai entendu les monstres… mais ils sont partis.":"I heard the monsters… but they left.", "Je veux pas qu’ils reviennent…":"I don’t want them to come back…", "J’aime bien sortir avec {autre}.":"I like going out with {autre}.",
  "Une bonne sortie. Ça fait du bien.":"A good outing. That feels good.", "Les lieux se vident. Il faudra aller plus loin.":"The places are emptying out. We’ll have to go further.", "On fait une bonne équipe.":"We make a good team.",
  "Une nuit de plus. On tient.":"One more night. We’re holding on.", "Il faut renforcer les défenses, et vite.":"We need to strengthen the defenses, fast.", "{autre} me couvre toujours. Je lui dois beaucoup.":"{autre} always has my back. I owe them a lot.",
  "Merci de m’accueillir. Je ne vous décevrai pas.":"Thank you for taking me in. I won’t let you down.", "Je sais me rendre utile, vous verrez.":"I know how to make myself useful, you’ll see.",
  "Une tombe pour {nom}":"A grave for {nom}", "Quels mots graver sur sa tombe ?":"What words should be carved on the grave?", "Graver une épitaphe":"Carve an epitaph"
});
