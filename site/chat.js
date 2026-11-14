/* =====================================================================
   chat.js : la discussion du clan (2026-11-11, demande de Fabien)
   Fenêtre « 💬 Le clan » : messages des membres, messages rapides en un toucher, et la vie du clan
   (journal : dépôts, raid, guerre) mêlée en gris. Pastille rouge du nombre de messages non lus sur le
   bouton ☰ du menu (et sur Clans / Discussion), partout dans le jeu, et bandeau au lancement.
   Le chef efface, chacun signale. Partie séparée : à refaire avec une vraie base sur l'hébergeur définitif.
   Chargé après raid.js (utilise appelClans, fileSucces, quand, echapper, pseudoCadre).
   ===================================================================== */
// À GARDER IDENTIQUE à CHAT_RAPIDES dans worker/index.js (le serveur reçoit le numéro du message). 2026-11-14 : « J’ai besoin de soins » remplacé (les échanges le remplacent)
var CHAT_RAPIDES = ["✋ Je suis prêt pour le raid !", "🏢 Qui envoie un volontaire pour le raid ?", "📦 J’ai déposé des matériaux dans la réserve.", "🤝 Regardez mon offre d’échange !", "⚔️ On attaque ce soir ?", "👍 D’accord !", "🙏 Merci !", "👋 Salut le clan !"];
var chatSignalAttente = null;
var etatChat = null, chatNonLus = 0, chatMinuterie = null, msgChat = "", chatBandeauFait = false;
function chatVu(){ try{ return +localStorage.getItem("survival_chat_vu") || 0; }catch(e){ return 0; } }
function noterChatVu(t){ try{ localStorage.setItem("survival_chat_vu", String(t)); }catch(e){} }
function compterNonLus(d){ var vu = chatVu(); return (d && d.messages || []).filter(function(m){ return !m.moi && m.t > vu; }).length; }

/* Fenêtre façon messagerie (2026-11-11, retour de Fabien : « ça fait old school ») :
   en-tête avec le blason, bulles groupées par auteur avec une pastille de couleur, heure dans la bulle,
   séparateurs de jour, actions (effacer / signaler) au toucher de la bulle, messages rapides en puces,
   barre d'envoi arrondie ; sur PC la discussion prend toute la hauteur du panneau. */
function openChat(){
  var h = '<div class="ch-app">'
    + '<div class="ch-tete"><span class="ch-blason" id="chatBlason">' + ic("bulle", "💬") + '</span><span class="ch-titre"><b id="chatNom">Le clan</b><small id="chatInfo">Discussion du clan</small></span>'
    + '<button class="ch-bouton" data-act="clans" aria-label="Mon clan" title="Mon clan">' + ic("bastion", "🏰") + '</button><button class="ch-bouton" data-act="close" aria-label="Fermer" title="Fermer">✕</button></div>'
    + '<div id="chat" class="ch-fil"><p class="ch-vide">Chargement…</p></div>'
    + '<div class="ch-bas"><p class="ch-toast" id="chatMsg" style="display:none"></p>'
    + '<div class="ch-rapides">' + CHAT_RAPIDES.map(function(t, i){ return '<button class="ch-r" data-act="chatrapide" data-id="' + i + '">' + t + '</button>'; }).join("") + '</div>'
    + '<div class="ch-saisie"><button class="ch-ech-b" data-act="echouvrir" aria-label="Proposer un échange" title="Proposer un échange">' + ic("poigneeMain", "🤝") + '</button><input id="chatTexte" maxlength="200" placeholder="Écrire au clan…" autocomplete="off" enterkeyhint="send" aria-label="Message"><button class="ch-envoi" data-act="chatenvoyer" aria-label="Envoyer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20.5 21 12 3 3.5l2.5 7L15 12l-9.5 1.5z"/></svg></button></div></div>'
    + '</div>';
  show(h);
  var inp = document.getElementById("chatTexte");
  if(inp) inp.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); envoyerChat(); } });
  defilementHorizontal(document.querySelector(".ch-rapides"));
  chargerChat(true);
}
// Messages rapides : au doigt ça glisse tout seul ; à la souris, on peut tirer la rangée ou tourner la molette (retour de Fabien)
function defilementHorizontal(el){
  if(!el) return;
  el.addEventListener("wheel", function(e){ if(Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth){ el.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive:false });
  var x0 = null, s0 = 0, bouge = false;
  el.addEventListener("pointerdown", function(e){ if(e.pointerType !== "mouse") return; x0 = e.clientX; s0 = el.scrollLeft; bouge = false; });
  window.addEventListener("pointermove", function(e){ if(x0 === null) return; var d = e.clientX - x0; if(Math.abs(d) > 5){ bouge = true; el.classList.add("tire"); } if(bouge) el.scrollLeft = s0 - d; });
  window.addEventListener("pointerup", function(){ if(x0 === null) return; x0 = null; setTimeout(function(){ el.classList.remove("tire"); }, 0); });
  // après avoir tiré, le clic qui suit n'envoie pas de message
  el.addEventListener("click", function(e){ if(bouge){ e.stopPropagation(); e.preventDefault(); bouge = false; } }, true);
}
function chargerChat(defiler){
  appelClans({ action:"chat", prendre:peutEchanger() }).then(function(d){
    if(d.erreur){ var f = document.getElementById("chat"); if(f) f.innerHTML = '<p class="ch-vide">❌ ' + d.erreur + '</p>'; return; }
    etatChat = d; afficherChat(defiler);
  }).catch(function(){ var f = document.getElementById("chat"); if(f) f.innerHTML = '<p class="ch-vide">' + MSG_HORS_LIGNE + '</p>'; });
  planifierChat();
}
function planifierChat(){
  if(chatMinuterie) clearTimeout(chatMinuterie);
  chatMinuterie = setTimeout(function(){ if(document.getElementById("chat")) chargerChat(false); }, 4000);
}
// « a déposé 5 planche, 2 clous » → « a déposé 5 planches, 2 poignées de clous » (comme le journal du bastion)
function texteJournalClan(t){ return String(t || "").replace(/\b(\d+) (\w+)/g, function(m0, n, k){ return OBJETS[k] ? nommer(k, +n) : m0; }).replace(/: (\w+) \(/, function(m0, k){ return typeof defBastion === "function" && defBastion(k) ? ": " + defBastion(k).nom.toLowerCase() + " (" : m0; }); }
function heureChat(t){ var d = new Date(t); return d.getHours() + "h" + String(d.getMinutes()).padStart(2, "0"); }
function jourChat(t){
  var d = new Date(t), j = new Date(), hier = new Date(Date.now() - 864e5);
  if(d.toDateString() === j.toDateString()) return "Aujourd’hui";
  if(d.toDateString() === hier.toDateString()) return "Hier";
  return d.getDate() + " " + ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."][d.getMonth()];
}
// Pastille de couleur avec l'initiale (la couleur dépend du pseudo : chacun garde la sienne)
function avatarChat(p){
  p = String(p || "?"); var h = 0; for(var i = 0; i < p.length; i++) h = (h * 31 + p.charCodeAt(i)) % 360;
  return '<span class="ch-av" style="background:hsl(' + h + ',42%,40%)" aria-hidden="true">' + echapper(p.charAt(0).toUpperCase()) + '</span>';
}
function afficherChat(defiler){
  var f = document.getElementById("chat"); if(!f || !etatChat) return;
  var nom = document.getElementById("chatNom"); if(nom) nom.textContent = etatChat.nom;
  var info = document.getElementById("chatInfo"); if(info) info.textContent = "Discussion du clan" + (etatChat.membres ? " · " + etatChat.membres + " / 5 familles" : "");
  var bl = document.getElementById("chatBlason"); if(bl && etatChat.blason && typeof imgBlason === "function" && !bl.dataset.b){ bl.innerHTML = imgBlason(etatChat.blason); bl.dataset.b = "1"; }
  var bas = f.scrollHeight - f.scrollTop - f.clientHeight < 40;
  // Messages et vie du clan, dans l'ordre du temps
  var tout = etatChat.messages.map(function(m){ return { t:m.t, m:m }; }).concat(etatChat.journal.slice(0, 8).map(function(j){ return { t:j.t, j:j }; })).sort(function(a, b){ return a.t - b.t; });
  var h = "", jour = "", prec = null;
  tout.forEach(function(e){
    var jj = jourChat(e.t);
    if(jj !== jour){ h += '<div class="ch-jour"><span>' + jj + '</span></div>'; jour = jj; prec = null; }
    if(e.j){ h += '<div class="ch-sys">' + echapper(e.j.qui) + ' ' + echapper(texteJournalClan(e.j.txt)) + '</div>'; prec = null; return; }
    var m = e.m, qui = m.qui && m.qui !== "?" ? m.qui : "Sans pseudo";
    if(m.ech && etatChat.echanges && etatChat.echanges[m.ech]){ h += carteEchange(etatChat.echanges[m.ech], m, qui); prec = null; return; }
    // même auteur, moins de 5 minutes après : la bulle se range sous la précédente, sans répéter le nom
    var suite = prec && prec.moi === m.moi && prec.qui === m.qui && m.t - prec.t < 5 * 60000;
    var actions = (m.moi || etatChat.chef ? '<button class="ch-act" data-act="chateffacer" data-id="' + m.id + '">' + ic("poubelle", "🗑️") + ' Effacer</button>' : '')
      + (!m.moi ? '<button class="ch-act" data-act="chatsignaler" data-id="' + m.id + '">' + ic("signaler", "🚩") + ' Signaler</button>' : '');
    h += '<div class="ch-l' + (m.moi ? " moi" : "") + (suite ? " suite" : "") + '">'
      + (m.moi ? '' : (suite ? '<span class="ch-av vide"></span>' : (typeof avatarHtml === "function" ? avatarHtml(m.avatar, qui, "ch-av") : avatarChat(qui))))
      + '<div class="ch-b' + (m.r ? " rapide" : "") + '" data-act="chatbulle" tabindex="0">'
      + (!m.moi && !suite ? '<span class="ch-qui">' + (m.chef ? ic("couronne", "👑") + " " : "") + echapper(qui) + '</span>' : '')
      + '<span class="ch-txt">' + echapper(m.txt) + '</span><span class="ch-h">' + heureChat(m.t) + '</span>'
      + (actions ? '<span class="ch-acts">' + actions + '</span>' : '') + '</div></div>';
    prec = m;
  });
  f.innerHTML = h || '<div class="ch-vide">' + ic("bulle", "💬") + '<p>Aucun message pour l’instant.<br>Dis bonjour à ton clan !</p></div>';
  if(defiler || bas) f.scrollTop = f.scrollHeight;
  // Fenêtre ouverte : tout est lu
  var der = etatChat.messages.reduce(function(t, m){ return Math.max(t, m.t); }, 0);
  if(der > chatVu()) noterChatVu(der);
  chatNonLus = 0; majBadgeChat();
}
function montrerMsgChat(t){ var p = document.getElementById("chatMsg"); if(!p) return; p.textContent = t; p.style.display = t ? "" : "none"; if(t) setTimeout(function(){ if(p.textContent === t){ p.textContent = ""; p.style.display = "none"; } }, 4000); }
function envoyerChat(rapide){
  var inp = document.getElementById("chatTexte"), corps = { action:"chatEnvoyer" };
  if(rapide !== undefined) corps.rapide = rapide;
  else { var t = (inp && inp.value || "").trim(); if(!t) return; corps.texte = t; }
  appelClans(corps).then(function(d){
    if(d.erreur){ montrerMsgChat("❌ " + d.erreur); return; }
    if(inp && rapide === undefined) inp.value = "";
    etatChat = d; afficherChat(true);
  }).catch(function(){ montrerMsgChat("❌ " + MSG_HORS_LIGNE); });
}

/* ---------- Pastille des non-lus : sur le bouton ☰ du menu (tous les écrans), Clans et Discussion ---------- */
function majBadgeChat(){
  var n = chatNonLus;
  Array.prototype.forEach.call(document.querySelectorAll('[data-act="menu"], [data-act="clans"], [data-act="chat"]'), function(b){
    var s = b.querySelector(".nl-badge");
    if(!n){ if(s) s.remove(); return; }
    if(!s){ s = document.createElement("span"); s.className = "nl-badge"; b.appendChild(s); }
    var txt = n > 99 ? "99+" : String(n); if(s.textContent !== txt) s.textContent = txt;
    s.setAttribute("aria-label", n + " nouveau" + (n > 1 ? "x" : "") + " message" + (n > 1 ? "s" : ""));
  });
}
setInterval(majBadgeChat, 1000);
// En fond : toutes les 2 minutes, on regarde s'il y a de nouveaux messages (pas pendant un raid, pas en test local)
function verifierChat(){
  if(typeof location !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  if(typeof dansUnClan === "function" && !dansUnClan()) { chatNonLus = 0; return; }
  if(document.getElementById("chat") || (typeof enRaid === "function" && enRaid())) return;
  appelClans({ action:"chat", prendre:peutEchanger() }).then(function(d){
    if(d.erreur) return;
    etatChat = d; chatNonLus = compterNonLus(d); majBadgeChat();
    if(chatNonLus && !chatBandeauFait && typeof fileSucces !== "undefined"){
      chatBandeauFait = true;
      fileSucces.push({ icone:"💬", titre:chatNonLus + " nouveau" + (chatNonLus > 1 ? "x" : "") + " message" + (chatNonLus > 1 ? "s" : ""), nom:"Ton clan t’a écrit : ouvre la discussion (menu ☰ → Clans, ou la cheminée du bastion)." });
      montrerSucces();
    }
  }).catch(function(){});
}
setTimeout(verifierChat, 7000); setInterval(verifierChat, 120000);

document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
  if(a === "chat") openChat();
  else if(a === "echouvrir"){ echForm = { donne:{}, veut:{}, cote:"donne" }; echMsg = ""; openEchange(); }
  else if(a === "echcote"){ echForm.cote = id; openEchange(); }
  else if(a === "echpick"){ var p = id.split(":"), cote = p[0], k = p[1], o = echForm[cote]; if(nbEch(o) >= ECH_MAX_C){ echMsg = "3 objets au plus de chaque côté."; openEchange(); return; } if(cote === "donne" && (o[k] || 0) >= compter(k)) return; o[k] = (o[k] || 0) + 1; echMsg = ""; openEchange(); }
  else if(a === "echote"){ var q = id.split(":"), o2 = echForm[q[0]]; if(o2[q[1]]){ o2[q[1]]--; if(!o2[q[1]]) delete o2[q[1]]; } echMsg = ""; openEchange(); }
  else if(a === "echproposer"){
    var ok = verifEchange(); if(ok !== true){ echMsg = ok; openEchange(); return; }
    b.disabled = true;
    appelClans({ action:"echProposer", donne:echForm.donne, veut:echForm.veut }).then(function(d){
      if(d.erreur){ echMsg = "❌ " + d.erreur; openEchange(); return; }
      etatChat = d; openChat(); setTimeout(function(){ montrerMsgChat("🤝 Ton offre est publiée. Ce que tu donnes est mis de côté jusqu’à ce qu’un membre accepte."); }, 300);
    }).catch(function(){ echMsg = "❌ " + MSG_HORS_LIGNE; openEchange(); });
  }
  else if(a === "echaccepter" || a === "echannuler"){
    if(a === "echaccepter"){ var E = etatChat && etatChat.echanges[id]; if(!E || !aLesObjets(E.veut)){ montrerMsgChat("❌ Il te manque des objets pour cet échange."); return; } }
    b.disabled = true;
    appelClans({ action:a === "echaccepter" ? "echAccepter" : "echAnnuler", eid:id }).then(function(d){ if(d.erreur){ montrerMsgChat("❌ " + d.erreur); b.disabled = false; return; } etatChat = d; afficherChat(false); })
      .catch(function(){ montrerMsgChat("❌ " + MSG_HORS_LIGNE); b.disabled = false; });
  }
  else if(a === "chatbulle"){ var ouverte = b.classList.contains("voir"); Array.prototype.forEach.call(document.querySelectorAll(".ch-b.voir"), function(x){ x.classList.remove("voir"); }); if(!ouverte && b.querySelector(".ch-acts")) b.classList.add("voir"); }
  else if(a === "chatenvoyer") envoyerChat();
  else if(a === "chatrapide") envoyerChat(+id);
  else if(a === "chateffacer") appelClans({ action:"chatEffacer", mid:id }).then(function(d){ if(d.erreur){ montrerMsgChat("❌ " + d.erreur); return; } etatChat = d; afficherChat(false); });
  else if(a === "chatsignaler"){
    if(chatSignalAttente !== id){ chatSignalAttente = id; montrerMsgChat("Touche encore 🚩 pour signaler ce message à l’équipe du jeu."); return; }
    chatSignalAttente = null;
    appelClans({ action:"chatSignaler", mid:id }).then(function(d){ montrerMsgChat(d.erreur ? "❌ " + d.erreur : "🚩 Merci, le message a été signalé."); });
  }
});


/* ---------- Échanges entre membres du clan (2026-11-14, demande de Fabien) ----------
   Bouton 🤝 à gauche de la saisie → « Proposer un échange » : 3 objets au plus de chaque côté (objets déposables
   seulement), un échange toutes les 8 h, on ne demande pas plus de 1,5 fois la valeur de ce qu'on donne.
   L'offre apparaît dans la discussion en carte ; un autre membre l'accepte en un toucher. Ce que le serveur dit
   d'ajouter ou de retirer (champ « ech » de la réponse) est rangé dans le stock par appliquerEch (appelClans). */
var ECH_OBJETS = ["bidon", "bouteille", "conserve", "conserves", "riz", "pates", "biscuits", "barre", "ration", "poisson", "bandage", "trousse", "antibio", "balle", "cartouche",
  "planche", "ferraille", "clous", "ruban", "chiffon", "alcool", "pile", "jerrican", "canette", "epices", "huile", "farine"]; // = DEPOSABLES du serveur
var ECH_MAX_C = 3, ECH_RATIO_C = 1.5, echForm = { donne:{}, veut:{}, cote:"donne" }, echMsg = "";
function peutEchanger(){ return typeof partieEnJeu === "function" && partieEnJeu() && !G.bacASable && !G.exp; }
function nbEch(o){ var n = 0; for(var k in o) n += o[k]; return n; }
function valEch(o){ var v = 0; for(var k in o) v += (VALEURS[k] || 1) * o[k]; return Math.round(v * 10) / 10; }
function aLesObjets(o){ if(!peutEchanger()) return false; for(var k in o) if(compter(k) < o[k]) return false; return true; }
function heuresEch(ms){ var h = Math.floor(ms / 3600e3), m = Math.ceil((ms % 3600e3) / 60000); if(m === 60){ h++; m = 0; } return h ? h + " h" + (m ? " " + String(m).padStart(2, "0") : "") : m + " min"; }
function verifEchange(){
  if(!peutEchanger()) return "Les échanges se font pendant une partie, au refuge.";
  if(!nbEch(echForm.donne) || !nbEch(echForm.veut)) return "Choisis au moins un objet à donner et un objet à demander.";
  if(valEch(echForm.veut) > ECH_RATIO_C * valEch(echForm.donne)) return "Tu demandes beaucoup plus que ce que tu donnes : ajoute un objet ou demande moins.";
  if(!aLesObjets(echForm.donne)) return "Tu n’as plus tous les objets que tu proposes.";
  if(etatChat && etatChat.echAttente > 0) return "Un échange toutes les 8 h : le prochain dans " + heuresEch(etatChat.echAttente) + ".";
  if(etatChat && Object.keys(etatChat.echanges || {}).some(function(k){ var e = etatChat.echanges[k]; return e.moi && e.etat === "ouvert"; })) return "Tu as déjà une offre en cours : annule-la ou attends qu’elle soit prise.";
  return true;
}
// Ce que le serveur demande d'ajouter / retirer (échange fait, offre annulée, livraison…)
function appliquerEch(e){
  if(!e || (!e.ajouter && !e.retirer) || !peutEchanger()) return;
  var k;
  for(k in (e.retirer || {})){ var n = Math.min(compter(k), e.retirer[k]); if(n > 0){ if(OBJETS[k].empile) retirer(k, n); else consommer(k, n); } }
  for(k in (e.ajouter || {})) ajouter(k, e.ajouter[k]);
  var recu = Object.keys(e.ajouter || {}).map(function(k){ return nommer(k, e.ajouter[k]); });
  var txt = (e.msgs || []).join(" ") + (recu.length ? " Tu reçois " + liste(recu) + "." : "");
  if(txt.trim()){
    if(document.getElementById("chatMsg")) setTimeout(function(){ montrerMsgChat("🤝 " + txt.trim()); }, 350);
    else if(typeof fileSucces !== "undefined"){ fileSucces.push({ icone:"🤝", titre:"Échange du clan", nom:txt.trim() }); if(typeof montrerSucces === "function") montrerSucces(); }
  }
  if(typeof sauver === "function") setTimeout(sauver, 0);
  if(typeof render === "function" && !document.getElementById("chat")) setTimeout(render, 0);
}
function casesEch(o, mini){
  var k = Object.keys(o);
  return k.length ? k.map(function(id){ return '<span class="ce-c" title="' + OBJETS[id].nom + '">' + icone(id) + (o[id] > 1 ? '<i>×' + o[id] + '</i>' : '') + '<small>' + (NOM_COURT[id] || OBJETS[id].nom) + '</small></span>'; }).join("") : '<span class="ce-c vide">?</span>';
}
// Carte d'une offre dans la discussion
function carteEchange(E, m, qui){
  var bas;
  if(E.etat === "fait") bas = '<span class="ce-etat ok">✅ ' + (E.moi ? "Échangé avec " + echapper(E.preneur) : E.jePrends ? "Tu as fait cet échange" : "Pris par " + echapper(E.preneur)) + '</span>';
  else if(E.etat === "annule") bas = '<span class="ce-etat">Offre annulée</span>';
  else if(E.etat === "expire") bas = '<span class="ce-etat">Offre expirée</span>';
  else if(E.moi) bas = '<span class="ce-etat">⏳ En attente · encore ' + heuresEch(Math.max(0, E.fin - Date.now())) + '</span><button class="ce-btn alt" data-act="echannuler" data-id="' + E.eid + '">Annuler</button>';
  else {
    var raison = !peutEchanger() ? "Pendant une partie seulement" : etatChat.echAttente > 0 ? "Ton prochain échange dans " + heuresEch(etatChat.echAttente) : !aLesObjets(E.veut) ? "Il te manque des objets" : "";
    bas = raison ? '<span class="ce-etat ko">' + raison + '</span>' : '<button class="ce-btn" data-act="echaccepter" data-id="' + E.eid + '">' + ic("poigneeMain", "🤝") + ' Accepter</button>';
  }
  return '<div class="ch-ech' + (E.moi ? " moi" : "") + (E.etat !== "ouvert" ? " clos" : "") + '"><div class="ce-t">' + ic("poigneeMain", "🤝") + ' <b>' + (E.moi ? "Ton offre" : echapper(qui) + ' propose un échange') + '</b><span class="ch-h">' + heureChat(m.t) + '</span></div>'
    + '<div class="ce-o"><span class="ce-cote"><small>' + (E.moi ? "Tu donnes" : "Donne") + '</small><span class="ce-cases">' + casesEch(E.donne) + '</span></span><span class="ce-fl" aria-hidden="true">⇄</span>'
    + '<span class="ce-cote"><small>' + (E.moi ? "Tu demandes" : "Contre") + '</small><span class="ce-cases">' + casesEch(E.veut) + '</span></span></div>'
    + '<div class="ce-bas">' + bas + '</div></div>';
}
// Fenêtre « Proposer un échange »
function openEchange(){
  var F = echForm, att = etatChat ? etatChat.echAttente : 0;
  var plateau = function(cote){ var o = F[cote], cases = [];
    Object.keys(o).forEach(function(k){ for(var i = 0; i < o[k]; i++) cases.push(caseObjet(k, { act:"echote", cle:cote + ":" + k, nom:"Retirer " + OBJETS[k].nom })); });
    while(cases.length < ECH_MAX_C) cases.push('<span class="ec-vide" aria-hidden="true"></span>');
    return '<div class="ec-cote' + (F.cote === cote ? " on" : "") + '"><b>' + (cote === "donne" ? "Je donne" : "Je demande") + ' <small>' + nbEch(o) + ' / ' + ECH_MAX_C + '</small></b><div class="ec-cases">' + cases.join("") + '</div></div>'; };
  var vd = valEch(F.donne), vv = valEch(F.veut), juste = !nbEch(F.veut) || vv <= ECH_RATIO_C * vd;
  var objets = F.cote === "donne" ? ECH_OBJETS.filter(function(k){ return compter(k) - (F.donne[k] || 0) > 0; }) : ECH_OBJETS.filter(function(k){ return OBJETS[k]; });
  var grille = objets.length ? '<div class="inv ec-grille">' + objets.map(function(k){ return caseObjet(k, { act:"echpick", cle:F.cote + ":" + k, n:F.cote === "donne" ? compter(k) - (F.donne[k] || 0) : 0 }); }).join("") + '</div>'
    : '<p class="msg">' + (F.cote === "donne" ? "Tu n’as rien à échanger : vivres, soins, munitions et matériaux seulement." : "") + '</p>';
  var h = '<button class="lien-retour" data-act="chat">← Discussion</button><h2>' + ic("poigneeMain", "🤝") + ' Proposer un échange</h2>'
    + '<div class="ec-regles"><span>🎒 3 objets au plus de chaque côté</span><span>⏳ 1 échange toutes les 8 h</span><span>⚖️ Pas plus de 1,5 fois ce que tu donnes</span></div>'
    + (att > 0 ? '<p class="msg b2">⏳ Ton prochain échange dans ' + heuresEch(att) + '.</p>' : '')
    + '<div class="ec-plateau">' + plateau("donne") + '<span class="ec-fl" aria-hidden="true">⇄</span>' + plateau("veut") + '</div>'
    + '<p class="ec-bilan ' + (juste ? "ok" : "ko") + '">Valeur : ' + vd + ' ➜ ' + vv + ' · ' + (!nbEch(F.donne) || !nbEch(F.veut) ? "choisis des deux côtés" : juste ? "✅ équitable" : "❌ tu demandes trop") + '</p>'
    + '<div class="tabs onglets"><button class="tab' + (F.cote === "donne" ? " on" : "") + '" data-act="echcote" data-id="donne">Ce que je donne</button><button class="tab' + (F.cote === "veut" ? " on" : "") + '" data-act="echcote" data-id="veut">Ce que je demande</button></div>'
    + grille
    + '<p class="msg" id="echMsg">' + (echMsg ? echapper(echMsg) : "") + '</p>'
    + '<button class="btn ec-go" data-act="echproposer"' + (verifEchange() === true ? "" : " disabled") + '>' + ic("poigneeMain", "🤝") + ' Proposer au clan</button>'
    + '<p class="sub ec-note">Ce que tu donnes est mis de côté jusqu’à ce qu’un membre accepte. Sans preneur en 24 h, ça te revient.</p>' + BTN_FERMER();
  show(h);
}
