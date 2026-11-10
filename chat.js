/* =====================================================================
   chat.js : la discussion du clan (2026-11-11, demande de Fabien)
   Fenêtre « 💬 Le clan » : messages des membres, messages rapides en un toucher, et la vie du clan
   (journal : dépôts, raid, guerre) mêlée en gris. Pastille rouge du nombre de messages non lus sur le
   bouton ☰ du menu (et sur Clans / Discussion), partout dans le jeu, et bandeau au lancement.
   Le chef efface, chacun signale. Partie séparée : à refaire avec une vraie base sur l'hébergeur définitif.
   Chargé après raid.js (utilise appelClans, fileSucces, quand, echapper, pseudoCadre).
   ===================================================================== */
var CHAT_RAPIDES = ["✋ Je suis prêt pour le raid !", "🏢 Qui envoie un volontaire pour le raid ?", "📦 J’ai déposé des matériaux dans la réserve.", "🆘 J’ai besoin de soins.", "⚔️ On attaque ce soir ?", "👍 D’accord !", "🙏 Merci !", "👋 Salut le clan !"];
var chatSignalAttente = null;
var etatChat = null, chatNonLus = 0, chatMinuterie = null, msgChat = "", chatBandeauFait = false;
function chatVu(){ try{ return +localStorage.getItem("survival_chat_vu") || 0; }catch(e){ return 0; } }
function noterChatVu(t){ try{ localStorage.setItem("survival_chat_vu", String(t)); }catch(e){} }
function compterNonLus(d){ var vu = chatVu(); return (d && d.messages || []).filter(function(m){ return !m.moi && m.t > vu; }).length; }

function openChat(){
  var h = '<h2>💬 <span id="chatNom">Le clan</span></h2><div id="chat" class="chat-fil"><p class="sub">Chargement…</p></div>'
    + '<p class="msg" id="chatMsg" style="display:none"></p>'
    + '<div class="chat-rapides-boite"><div class="chat-rapides">' + CHAT_RAPIDES.map(function(t, i){ return '<button class="chat-r" data-act="chatrapide" data-id="' + i + '">' + t + '</button>'; }).join("") + '</div></div>'
    + '<div class="chat-saisie"><input id="chatTexte" maxlength="200" placeholder="Écrire au clan…" autocomplete="off" enterkeyhint="send"><button class="btn" data-act="chatenvoyer" aria-label="Envoyer">➤</button></div>'
    + '<div class="row"><button class="btn alt" data-act="clans">⚔️ Mon clan</button><button class="btn" data-act="close">Fermer</button></div>';
  show(h);
  var inp = document.getElementById("chatTexte");
  if(inp) inp.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); envoyerChat(); } });
  chargerChat(true);
}
function chargerChat(defiler){
  appelClans({ action:"chat" }).then(function(d){
    if(d.erreur){ var f = document.getElementById("chat"); if(f) f.innerHTML = '<p class="msg">❌ ' + d.erreur + '</p>'; return; }
    etatChat = d; afficherChat(defiler);
  }).catch(function(){ var f = document.getElementById("chat"); if(f) f.innerHTML = '<p>' + MSG_HORS_LIGNE + '</p>'; });
  planifierChat();
}
function planifierChat(){
  if(chatMinuterie) clearTimeout(chatMinuterie);
  chatMinuterie = setTimeout(function(){ if(document.getElementById("chat")) chargerChat(false); }, 4000);
}
// « a déposé 5 planche, 2 clous » → « a déposé 5 planches, 2 poignées de clous » (comme le journal du bastion)
function texteJournalClan(t){ return String(t || "").replace(/\b(\d+) (\w+)/g, function(m0, n, k){ return OBJETS[k] ? nommer(k, +n) : m0; }).replace(/: (\w+) \(/, function(m0, k){ return typeof defBastion === "function" && defBastion(k) ? ": " + defBastion(k).nom.toLowerCase() + " (" : m0; }); }
function heureChat(t){ var d = new Date(t), j = new Date(); return (d.toDateString() === j.toDateString() ? "" : d.getDate() + "/" + (d.getMonth() + 1) + " ") + d.getHours() + "h" + String(d.getMinutes()).padStart(2, "0"); }
function afficherChat(defiler){
  var f = document.getElementById("chat"); if(!f || !etatChat) return;
  var nom = document.getElementById("chatNom"); if(nom) nom.textContent = "Le clan « " + etatChat.nom + " »";
  var bas = f.scrollHeight - f.scrollTop - f.clientHeight < 40;
  // Messages et vie du clan, dans l'ordre du temps
  var tout = etatChat.messages.map(function(m){ return { t:m.t, m:m }; }).concat(etatChat.journal.slice(0, 8).map(function(j){ return { t:j.t, j:j }; })).sort(function(a, b){ return a.t - b.t; });
  f.innerHTML = tout.length ? tout.map(function(e){
    if(e.j) return '<div class="cm-sys">' + echapper(e.j.qui) + ' ' + echapper(texteJournalClan(e.j.txt)) + ' <small>' + heureChat(e.t) + '</small></div>';
    var m = e.m;
    return '<div class="cm-m' + (m.moi ? " moi" : "") + (m.r ? " rapide" : "") + '"><span class="cm-tete">' + (m.chef ? ic("couronne", "👑") + " " : "") + (m.moi ? "<b>Toi</b>" : pseudoCadre(m.qui && m.qui !== "?" ? m.qui : "Sans pseudo", m.cadre)) + ' <small>' + heureChat(m.t) + '</small>'
      + (m.moi || etatChat.chef ? '<button class="cm-a" data-act="chateffacer" data-id="' + m.id + '" aria-label="Effacer">🗑️</button>' : '')
      + (!m.moi ? '<button class="cm-a" data-act="chatsignaler" data-id="' + m.id + '" aria-label="Signaler">🚩</button>' : '') + '</span><p>' + echapper(m.txt) + '</p></div>';
  }).join("") : '<p class="sub">Aucun message pour l’instant. Lance la discussion !</p>';
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
  appelClans({ action:"chat" }).then(function(d){
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
  else if(a === "chatenvoyer") envoyerChat();
  else if(a === "chatrapide") envoyerChat(+id);
  else if(a === "chateffacer") appelClans({ action:"chatEffacer", mid:id }).then(function(d){ if(d.erreur){ montrerMsgChat("❌ " + d.erreur); return; } etatChat = d; afficherChat(false); });
  else if(a === "chatsignaler"){
    if(chatSignalAttente !== id){ chatSignalAttente = id; montrerMsgChat("Touche encore 🚩 pour signaler ce message à l’équipe du jeu."); return; }
    chatSignalAttente = null;
    appelClans({ action:"chatSignaler", mid:id }).then(function(d){ montrerMsgChat(d.erreur ? "❌ " + d.erreur : "🚩 Merci, le message a été signalé."); });
  }
});
