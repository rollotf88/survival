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
