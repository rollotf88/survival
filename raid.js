/* =====================================================================
   raid.js : le raid de l'immeuble (2026-11-10, idée de Fabien)
   Organisé au bastion (onglet « Immeuble ») : chaque famille du clan inscrit un volontaire et lui confie
   munitions, soins et équipement de guerre. Dès 4 volontaires, le chef lance le raid et le joue :
   son jeu bascule dans une « partie temporaire » (les volontaires des autres + leurs kits), le combat
   tactique habituel se joue étage par étage ; entre deux étages, monter ou redescendre avec le butin.
   À la fin, le résultat et le replay partent au serveur, le chef retrouve sa partie, et chaque joueur
   récupère sa part (et des nouvelles de son volontaire) en ouvrant le bastion.
   Chargé après classement.js (il utilise appelClans, etatBastion, afficherBastion).
   ===================================================================== */
var KIT_RAID = ["balle", "cartouche", "trousse", "bandage", "antibio", "alcool", "chiffon", "canette"], GEAR_RAID = ["gilet", "casque", "bouclier"];
var G_MAISON = null;          // la vraie partie du chef pendant qu'il joue le raid
var raidPrep = null;          // préparation du volontaire : { idx, n:{id:q}, o:{id:true} }
var msgRaid = "";

function imgEtage(k){ var E = BAL.immeuble.etages[k]; return E ? E.img : BAL.immeuble.exterieur; }
function secoursEtage(k){ var E = BAL.immeuble.etages[k]; return E ? E.secours : BAL.immeuble.exterieurSecours; }
// Une image d'étage qui n'existe pas encore est remplacée par son image de secours
function imgAvecSecours(src, secours, cls){ return '<img class="' + (cls || "") + '" src="' + src + '" alt="" onerror="this.onerror=null;this.src=\'' + secours + '\'">'; }
var imagesEtagesOk = {};
(function(){ if(typeof Image === "undefined") return; BAL.immeuble.etages.forEach(function(E){ var im = new Image(); im.onload = function(){ imagesEtagesOk[E.img] = true; }; im.src = E.img; }); })();
function fondEtage(k){ var E = BAL.immeuble.etages[k]; return E ? (imagesEtagesOk[E.img] ? E.img : E.secours) : "images/piece-bastion-cour.webp"; }
function texteBrut(t){ return String(t || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); }
function enRaid(){ return !!(G && G.bacASable); }
function membreRaid(){ return G && G.m ? G.m.find(function(x){ return x.raid; }) : null; }

/* ---------- Force estimée de l'équipe (aperçu « prête / risquée / suicidaire ») ----------
   Réglée avec la simulation (sim : voir CLAUDE.md) : arme, munitions, vie, énergie, soins et équipement de guerre. */
function forceVolontaire(v){
  var m = v.membre, k = v.kit || { n:{}, o:[] }, a = m.eq && m.eq.arme, O = a && OBJETS[a.id];
  var dg = O && O.degats ? (O.degats[0] + O.degats[1]) / 2 : BAL.combat.poings ? (BAL.combat.poings[0] + BAL.combat.poings[1]) / 2 : 2;
  if(O && O.munition){ var mu = (k.n || {})[O.munition] || 0; dg = dg * Math.min(1, mu / 12) + (BAL.combat.crosse ? (BAL.combat.crosse[0] + BAL.combat.crosse[1]) / 2 : 3) * (1 - Math.min(1, mu / 12)); }
  var vie = (m.hp || 0) * (m.en >= 50 ? 1 : 0.8), soins = ((k.n || {}).trousse || 0) * 30 + ((k.n || {}).bandage || 0) * 15 + ((k.n || {}).antibio || 0) * 10;
  var gear = (k.o || []).length * 12;
  return dg * 10 + vie * 0.6 + soins * 0.5 + gear;
}
function evalEquipeRaid(vols){
  var f = vols.reduce(function(t, v){ return t + forceVolontaire(v); }, 0);
  var S = BAL.immeuble.seuils;
  if(f >= S.prete) return { cls:"ok", txt:"Équipe prête", detail:"Avec cette équipe, le toit est à votre portée." };
  if(f >= S.risquee) return { cls:"moy", txt:"Équipe risquée", detail:"Les premiers étages passeront, mais le dernier étage et le toit (soldats en gilet, le Colosse) demandent des armes à feu, des munitions et des gilets : il faudra sans doute redescendre." };
  return { cls:"ko", txt:"Équipe suicidaire", detail:"Pas assez d’armes, de munitions ou de soins : l’équipe risque de tomber dès les premiers étages." };
}


/* ---------- Les opérations du clan (2026-11-10, demande de Fabien) ----------
   Le raid de l'immeuble est la première « opération » ; d'autres viendront (une carte de plus dans OPERATIONS, pas un nouveau menu).
   On y accède par l'onglet « Opérations » du bastion, la table de la grande salle (qui brille quand il faut agir),
   la grande carte en haut de « Où envoyer l'équipe ? », la ligne de « Mon clan » et les bandeaux au lancement. */
var OPERATIONS = [
  { id:"immeuble", nom:"L’immeuble abandonné", img:function(){ return BAL.immeuble.exterieur; }, secours:function(){ return BAL.immeuble.exterieurSecours; },
    court:"Chaque famille envoie un volontaire. Dès 4, le chef mène l’assaut, étage par étage. Le butin est partagé.",
    etat:function(B){ return B.raid; } }
];
var opOuverte = null;
function ouvrirOperation(id){ opOuverte = id || null; ongletBastion = "operations"; openBastion("operations"); }
// Où en est l'opération (texte court) et faut-il faire quelque chose ?
function statutOp(R){
  if(!R) return { txt:"", cls:"" };
  if(R.fait) return R.maPart ? { txt:"🎁 Pillé : ta part t’attend !", cls:"ok", agir:true } : { txt:"✅ Pillé · revoir le replay", cls:"" };
  if(R.lance) return { txt:"⏳ Raid en cours (" + (R.lance.pseudo || "?") + ")", cls:"moy" };
  if(R.nb >= R.min) return R.peutLancer ? { txt:"✅ Équipe prête : lance le raid !", cls:"ok", agir:true } : { txt:"✅ Équipe prête : le chef peut lancer", cls:"ok" };
  var moi = R.participe || (R.volontaires || []).some(function(v){ return v.moi; });
  return { txt:"👥 " + R.nb + " / " + R.min + " volontaires" + (moi ? " · le tien est inscrit" : " · il en manque " + (R.min - R.nb)), cls:moi ? "" : "moy", agir:!moi };
}
// État gardé dans le navigateur (pour la lueur de la table et la carte des lieux, sans appeler le serveur)
function noterEtatOp(R){
  if(!R) return;
  var moi = R.participe || (R.volontaires || []).some(function(v){ return v.moi; });
  try{ localStorage.setItem("survival_op_etat", JSON.stringify({ fait:R.fait, nb:R.nb, min:R.min, max:R.max, lance:R.lance ? { pseudo:R.lance.pseudo } : null, peutLancer:R.peutLancer, maPart:!!R.maPart, participe:moi, chef:R.chef, t:Date.now() })); }catch(e){}
}
function etatOpGarde(){ try{ return JSON.parse(localStorage.getItem("survival_op_etat")); }catch(e){ return null; } }
function opAttention(){ var R = etatOpGarde(); return !!(R && typeof dansUnClan === "function" && dansUnClan() && statutOp(R).agir); }
function contenuOperations(B){
  if(B.raid) noterEtatOp(B.raid);
  if(opOuverte === "immeuble") return '<button class="lien-retour" data-act="opliste">← Toutes les opérations</button>' + contenuRaid(B);
  return '<p class="sub">Les opérations se préparent à plusieurs : chaque famille y envoie un volontaire, puis une seule équipe part pour tout le clan. De nouvelles opérations arriveront.</p>'
    + '<div class="ops">' + OPERATIONS.map(function(O){ var st = statutOp(O.etat(B));
      return '<button class="op-carte" data-act="opouvrir" data-id="' + O.id + '">' + imgAvecSecours(O.img(), O.secours(), "op-img") + '<span class="op-txt"><b>' + O.nom + '</b><small>' + O.court + '</small>'
        + (st.txt ? '<span class="op-st ' + st.cls + '">' + st.txt + '</span>' : '') + '</span></button>'; }).join("") + '</div>';
}
// Grande carte (sur deux cases) en haut de « Où envoyer l'équipe ? »
function carteOperationLieux(){
  if(typeof dansUnClan !== "function" || !dansUnClan()) return "";
  var O = OPERATIONS[0], R = etatOpGarde(), st = R ? statutOp(R) : { txt:"Ouvre-la pour voir où en est ton clan.", cls:"" };
  return '<button class="carte-lieu carte-op" data-act="opouvrir" data-id="' + O.id + '"><span class="cl-img">' + imgAvecSecours(O.img(), O.secours()) + '<span class="cl-reste">🎯 Opération de clan</span></span>'
    + '<span class="op-txt"><b>' + O.nom + '</b><small>' + O.court + '</small><span class="op-st ' + st.cls + '">' + st.txt + '</span></span></button>';
}

/* ---------- Fenêtre de l'opération « L'immeuble abandonné » ---------- */
function contenuRaid(B){
  var R = B.raid || { volontaires:[] }, enJeu = typeof G !== "undefined" && G && G.ph === "game" && !G.cumule, I = BAL.immeuble, h = "";
  h += '<div class="raid-tete">' + imgAvecSecours(I.exterieur, I.exterieurSecours, "raid-img") + '<div class="raid-titre"><b>' + ic("bastion", "🏢") + ' L’immeuble abandonné</b><small>' + I.etages.length + ' étages · une seule fois par clan</small></div></div>';
  if(msgRaid){ h += '<p class="msg ' + (msgRaid.charAt(0) === "❌" ? "" : "g2") + '">' + msgRaid + '</p>'; msgRaid = ""; }
  if(R.fait){
    var S = R.res || {};
    h += '<div class="raid-res ' + (S.issue === "defaite" ? "ko" : "ok") + '"><b>' + (S.issue === "sommet" ? "🏆 Le toit est tombé !" : S.issue === "defaite" ? "💀 L’équipe n’est pas revenue" : "⬇️ L’équipe est redescendue") + '</b>'
      + '<small>Raid mené par ' + echapper(S.par || "?") + ' · ' + (S.etages || 0) + ' étage' + ((S.etages || 0) > 1 ? "s" : "") + ' sur ' + (S.max || I.etages.length) + ' · ' + (S.total || 0) + ' objets ramenés' + (S.perdu ? " (" + S.perdu + " laissés faute de place)" : "") + '</small></div>';
    if(S.equipe) h += '<div class="raid-vols">' + S.equipe.map(function(e){ return '<span class="raid-v' + (e.al ? "" : " mort") + '">' + iconeMembre({ nom:e.nom, r:e.r, icone:"🙂", al:e.al, hp:e.al ? 80 : 0, en:80, faim:80, soif:80 }) + '<b>' + echapper(e.nom) + '</b><small>' + echapper(e.pseudo || "?") + (e.al ? "" : " · 💀") + '</small></span>'; }).join("") + '</div>';
    h += '<div class="row">' + (R.maPart ? '<button class="btn" data-act="raidpart">🎁 Récupérer ma part</button>' : '') + '<button class="btn alt" data-act="raidreplay">▶️ Revoir le raid</button></div>';
    if(R.participe && !R.maPart) h += '<p class="sub">✅ Tu as récupéré ta part.</p>';
    return h;
  }
  h += '<p class="sub">Un immeuble de ' + I.etages.length + ' étages, plein de provisions… et de zombies. Chaque famille du clan peut y envoyer <b>un volontaire</b>. Dès <b>' + R.min + ' volontaires</b>, le chef lance le raid et le joue, étage par étage : entre deux étages, il choisit de monter ou de redescendre avec le butin. Les blessures et les morts sont réelles.</p>';
  h += '<div class="raid-etages">' + I.etages.map(function(E, k){ return '<span class="raid-e"><b>' + (k + 1) + '</b>' + E.nom + '</span>'; }).join("") + '</div>';
  // Remorque artisanale
  var cr = B.couts && B.couts.remorque;
  h += '<div class="bast-def"><div class="invfiche"><span class="em">' + ic("camionClan", "🚚") + '</span><span class="eqt"><b>Remorque artisanale · ' + (R.remorque ? "construite ✔" : "à construire") + '</b><small>'
    + (R.remorque ? "Elle ramène " + I.remorque + " objets de plus." : "Sans elle, chaque volontaire debout ne ramène que " + I.sac + " objets : le reste du butin reste dans l’immeuble.") + '</small></span></div>';
  if(!R.remorque && cr){
    var manque = Object.keys(cr).filter(function(m){ return !((B.reserve[m] || 0) >= cr[m]); });
    h += '<div class="ings2">' + Object.keys(cr).map(function(m){ var a = B.reserve[m] || 0; return '<span class="ing2 ' + (a >= cr[m] ? "ok" : "ko") + '"><span class="ing2-case">' + icone(m) + '</span><b>' + a + '/' + cr[m] + '</b><small>' + (NOM_COURT[m] || OBJETS[m].nom) + '</small></span>'; }).join("") + '</div>'
      + '<button class="btn" style="width:100%" data-act="bastconstruire" data-id="remorque"' + (manque.length ? " disabled" : "") + '>' + (manque.length ? "❌ Il manque des matériaux dans la réserve" : "🔨 Construire la remorque") + '</button>';
  }
  h += '</div>';
  // Volontaires
  h += '<p class="titre-butin">✋ Volontaires · ' + R.nb + ' / ' + R.min + (R.nb > R.min ? " (" + R.max + " au plus)" : "") + '</p>';
  h += R.volontaires.length ? '<div class="raid-liste">' + R.volontaires.map(function(v){
    var m = v.membre, a = m.eq && m.eq.arme, kit = v.kit || { n:{}, o:[] };
    var kitTxt = Object.keys(kit.n || {}).map(function(k){ return icone(k) + kit.n[k]; }).concat((kit.o || []).map(function(o){ return icone(o.id); })).join(" ");
    return '<div class="raid-l' + (v.moi ? " moi" : "") + '">' + iconeMembre({ nom:m.nom, r:m.r, icone:"🙂", al:true, hp:m.hp, en:m.en, faim:80, soif:80 }) + '<span class="cl-info"><b>' + echapper(m.nom) + ' <small>· famille de ' + echapper(v.pseudo || "?") + (v.moi ? " (toi)" : "") + '</small></b>'
      + '<small>❤️ ' + m.hp + ' · ⚡ ' + m.en + ' · ' + (a && OBJETS[a.id] ? icone(a.id) + " " + OBJETS[a.id].nom : "à mains nues") + '</small><small>' + (kitTxt || "Rien d’autre") + '</small></span></div>';
  }).join("") + '</div>' : '<p class="sub">Personne pour l’instant. Sois le premier !</p>';
  if(R.volontaires.length){ var ev = evalEquipeRaid(R.volontaires); h += '<p class="etat ' + ev.cls + '">' + ev.txt + '</p><p class="sub">' + ev.detail + '</p>'; }
  // Actions
  var moi = R.volontaires.some(function(v){ return v.moi; });
  if(R.lance) h += '<p class="msg">⏳ Raid en cours, lancé par ' + echapper(R.lance.pseudo || "?") + ' ' + quand(R.lance.t) + '.</p>';
  if(R.peutLancer) h += '<button class="btn" style="width:100%;margin-bottom:8px" data-act="raidlancer"' + (enJeu ? "" : " disabled") + '>' + (R.lance && R.lance.moi ? "▶️ Reprendre le raid" : "▶️ Lancer le raid") + '</button>';
  else if(R.nb >= R.min && !R.chef) h += '<p class="sub">L’équipe est prête : le chef peut lancer le raid' + (R.attenteChef ? " (sinon, n’importe qui pourra le lancer dans " + tempsRestant(Date.now() + R.attenteChef) + ")" : "") + '.</p>';
  h += '<button class="op-ligne chat-ligne" data-act="chat">💬 <b>En parler au clan</b><small>Qui est prêt ? Qui lance ?</small></button>';
  if(!R.lance){
    if(moi) h += '<button class="btn alt" style="width:100%" data-act="raidretrait">↩️ Retirer mon volontaire</button>';
    else if(R.nb < R.max) h += '<button class="btn" style="width:100%" data-act="raidpret"' + (enJeu ? "" : " disabled") + '>✋ Je suis prêt : envoyer un volontaire</button>' + (enJeu ? "" : '<p class="sub">Pendant une partie.</p>');
  }
  return h;
}

/* ---------- Choisir son volontaire et ce qu'on lui confie ---------- */
function openRaidPret(){
  if(!raidPrep){
    var dispo = G.m.map(function(x, i){ return i; }).filter(function(i){ return G.m[i].al && !G.m[i].raid; });
    var h = '<h2>✋ Qui part à l’immeuble ?</h2><p class="sub">Ton volontaire reste au bastion jusqu’au raid : il ne pourra plus fouiller. Il emporte ce qu’il porte (arme, outil, sac).</p><div class="raid-choix">'
      + dispo.map(function(i){ var x = G.m[i], a = x.eq.arme;
        return '<button class="raid-c" data-act="raidchoix" data-id="' + i + '">' + iconeMembre(x) + '<b>' + x.nom + '</b><small>❤️ ' + x.hp + ' · ⚡ ' + x.en + '</small><small>' + (a ? icone(a.id) + " " + (NOM_COURT[a.id] || OBJETS[a.id].nom) : "sans arme") + '</small></button>'; }).join("") + '</div>'
      + '<button class="btn alt" style="width:100%" data-act="raidretour">Retour</button>';
    show(h); return;
  }
  var x = G.m[raidPrep.idx], a = x.eq.arme, mu = a && OBJETS[a.id].munition;
  var lignes = KIT_RAID.filter(function(k){ return compter(k) > 0; }).map(function(k){
    var q = raidPrep.n[k] || 0;
    return '<div class="raid-kit"><span class="ing2-case">' + icone(k) + '</span><span class="rk-nom">' + OBJETS[k].nom + (k === mu ? " <small>(pour son arme)</small>" : "") + '<small>' + compter(k) + ' au stock</small></span>'
      + '<button class="mini" data-act="raidmoins" data-id="' + k + '"' + (q ? "" : " disabled") + '>−</button><b class="rk-q">' + q + '</b><button class="mini" data-act="raidplus" data-id="' + k + '"' + (q < Math.min(40, compter(k)) ? "" : " disabled") + '>+</button></div>';
  }).join("");
  var gears = GEAR_RAID.filter(function(k){ return compter(k) > 0; }).map(function(k){
    return '<button class="raid-g' + (raidPrep.o[k] ? " on" : "") + '" data-act="raidgear" data-id="' + k + '">' + icone(k) + '<small>' + (NOM_COURT[k] || OBJETS[k].nom) + '</small>' + (raidPrep.o[k] ? "✔" : "") + '</button>';
  }).join("");
  var vol = { membre:{ hp:x.hp, en:x.en, eq:{ arme:a ? { id:a.id } : null } }, kit:kitPrep() }, ev = evalEquipeRaid([vol]);
  show('<h2>🎒 Ce que tu confies à ' + x.nom + '</h2><p class="sub">Les munitions, les soins et l’équipement servent à toute l’équipe pendant le raid. Ce qui n’a pas servi te revient après.</p>'
    + (lignes || '<p class="sub">Rien à confier (munitions, soins, alcool, chiffons, canettes).</p>')
    + (gears ? '<p class="titre-butin">🎽 Équipement de guerre</p><div class="raid-gears">' + gears + '</div>' : '')
    + '<p class="sub">Apport de ' + x.nom + ' : ' + Math.round(forceVolontaire(vol)) + ' points de force (une équipe prête en réunit environ ' + BAL.immeuble.seuils.prete + ').</p>'
    + '<div class="row"><button class="btn" data-act="raidenvoyer">🏢 Envoyer ' + x.nom + '</button><button class="btn alt" data-act="raidretour">Retour</button></div>');
}
function kitPrep(){
  var n = {}, o = [];
  for(var k in raidPrep.n) if(raidPrep.n[k] > 0) n[k] = raidPrep.n[k];
  GEAR_RAID.forEach(function(k){ if(raidPrep.o[k]){ var inst = G.stock.o.find(function(i){ return i.id === k; }); if(inst) o.push({ id:k, sol:inst.sol, uid:inst.uid }); } });
  return { n:n, o:o };
}
function choisirVolontaire(i){
  var x = G.m[i], a = x.eq.arme, mu = a && OBJETS[a.id].munition;
  raidPrep = { idx:i, n:{}, o:{} };
  if(mu && compter(mu)) raidPrep.n[mu] = Math.min(15, compter(mu));
  if(compter("trousse")) raidPrep.n.trousse = Math.min(2, compter("trousse"));
  if(compter("bandage")) raidPrep.n.bandage = Math.min(2, compter("bandage"));
  GEAR_RAID.forEach(function(k){ if(compter(k)) raidPrep.o[k] = true; });
  openRaidPret();
}
function envoyerVolontaire(){
  var x = G.m[raidPrep.idx]; if(!x || !x.al) return;
  var kit = kitPrep(), eq = {};
  ["arme", "outil", "sac"].forEach(function(s){ var o = x.eq[s]; if(o) eq[s] = { id:o.id, sol:o.sol, uid:o.uid }; });
  var membre = { nom:x.nom, r:roleDe(x), icone:x.icone, trait:x.trait, hp:x.hp, en:x.en, faim:x.faim, soif:x.soif, folie:x.folie || 0, idx:raidPrep.idx, eq:eq };
  appelClans({ action:"raidPret", membre:membre, kit:kit }).then(function(d){
    if(d.erreur){ msgRaid = "❌ " + d.erreur; raidPrep = null; ongletBastion = "operations"; opOuverte = "immeuble"; afficherBastion(); return; }
    // Le kit quitte le stock, le volontaire est réservé pour le raid
    for(var k in kit.n) retirer(k, kit.n[k]);
    kit.o.forEach(function(o){ retirerInstance(o.uid); });
    x.raid = true; x.raidEq = {}; for(var s in eq) x.raidEq[s] = eq[s].uid;
    G.sel = (G.sel || []).filter(function(j){ return j !== raidPrep.idx; });
    etatBastion = d.bastion; msgRaid = "🏢 " + x.nom + " est parti" + (estFeminin(x) ? "e" : "") + " au bastion pour le raid de l’immeuble.";
    raidPrep = null; ongletBastion = "operations"; opOuverte = "immeuble"; render(); if(typeof sauver === "function") sauver(); afficherBastion();
  }).catch(function(){ msgRaid = "❌ " + MSG_HORS_LIGNE; raidPrep = null; afficherBastion(); });
}
function retirerVolontaire(){
  appelClans({ action:"raidRetrait" }).then(function(d){
    if(d.erreur){ msgRaid = "❌ " + d.erreur; afficherBastion(); return; }
    rendreKit(d.kit); var x = membreRaid(); if(x){ x.raid = false; delete x.raidEq; }
    etatBastion = d.bastion; msgRaid = "↩️ " + (x ? x.nom + " est rentré" + (estFeminin(x) ? "e" : "") + " à la maison avec ce que tu lui avais confié." : "Ton volontaire est rentré.");
    render(); if(typeof sauver === "function") sauver(); afficherBastion();
  }).catch(function(){ msgRaid = "❌ " + MSG_HORS_LIGNE; afficherBastion(); });
}
function rendreKit(kit){
  if(!kit) return;
  for(var k in (kit.n || {})) if(OBJETS[k]) ajouter(k, kit.n[k]);
  (kit.o || []).forEach(function(o){ if(OBJETS[o.id]) G.stock.o.push({ uid:++G.uid, id:o.id, sol:Math.max(1, o.sol || 1) }); });
}

/* ---------- Le chef joue le raid ---------- */
function lancerRaid(){
  appelClans({ action:"raidLancer" }).then(function(d){
    if(d.erreur){ msgRaid = "❌ " + d.erreur; afficherBastion(); return; }
    demarrerRaid(d);
  }).catch(function(){ msgRaid = "❌ " + MSG_HORS_LIGNE; afficherBastion(); });
}
// Bascule dans la partie temporaire : les volontaires deviennent la « famille », leurs kits le stock
function demarrerRaid(d){
  if(typeof sauver === "function") sauver();
  G_MAISON = G;
  var S = JSON.parse(JSON.stringify(G, function(k, v){ return k === "ev" ? undefined : v; }));
  S.bacASable = true; S.seed = null; S.m = []; S.stock = { n:{}, o:[] }; S.sel = []; S.uid = 1; S.dd = []; S.exp = null; S.combat = null; S.rencontre = null;
  var uidMap = {}, contrib = {}, owners = [];
  d.volontaires.forEach(function(v){
    var m = v.membre, x = { nom:m.nom, r:m.r, icone:m.icone || "🙂", trait:m.trait, hp:m.hp, en:m.en, faim:m.faim, soif:m.soif, folie:m.folie || 0, al:true, eq:{ arme:null, outil:null, sac:null } };
    for(var s in (m.eq || {})){ var o = m.eq[s]; if(o && OBJETS[o.id]){ var nu = ++S.uid; uidMap[nu] = { v:v.id, uid:o.uid, slot:s }; x.eq[s] = { uid:nu, id:o.id, sol:o.sol || null }; } }
    S.m.push(x); owners.push(v.id);
    var k = v.kit || { n:{}, o:[] };
    for(var id in (k.n || {})){ if(!OBJETS[id]) continue; S.stock.n[id] = (S.stock.n[id] || 0) + k.n[id]; (contrib[id] = contrib[id] || {})[v.id] = k.n[id]; }
    (k.o || []).forEach(function(o){ if(!OBJETS[o.id]) return; var nu = ++S.uid; uidMap[nu] = { v:v.id, uid:o.uid, gear:true }; S.stock.o.push({ uid:nu, id:o.id, sol:o.sol }); });
  });
  S.exp = { raid:true, guerre:true, nomLieu:"l’immeuble", lieu:0, equipe:S.m.map(function(x, i){ return i; }), notes:[], mult:1, d:0, voiture:false,
            etage:0, etagesFaits:0, butin:{}, replay:[], owners:owners, uidMap:uidMap, contrib:contrib, remorque:d.remorque || 0, clan:d.clan || "" };
  G = S;
  G.exp.equipGuerre = equipGuerrePour(G.exp.equipe);
  var porte = []; for(var j in G.exp.equipGuerre) porte.push(G.m[j].nom + " : " + G.exp.equipGuerre[j].map(function(o){ return OBJETS[o.id].nom.toLowerCase(); }).join(", "));
  G.exp.replay.push({ k:"debut", m:G.m.map(function(x, i){ return [x.nom, x.r, x.hp, owners[i]]; }), porte:porte, remorque:G.exp.remorque });
  monterEtage();
}
function zombiesEtage(k){
  var E = BAL.immeuble.etages[k];
  return E.z.map(function(id, n){
    var T = ZOMBIES.find(function(t){ return t.id === id; }), z = nouveauZombie(T);
    z.pv = z.pvMax = Math.max(1, Math.round(T.pv * E.pv)); z.degats = [T.degats[0] + E.degats, T.degats[1] + E.degats];
    var meme = E.z.slice(0, n).filter(function(i2){ return i2 === id; }).length; if(meme) z.nom = T.nom + " " + (meme + 1);
    return z;
  });
}
/* Chances de l'étage suivant : on rejoue l'étage en coulisses (n fois, bouton Auto) avec l'équipe telle qu'elle est.
   Renvoie { victoire, sansPerte } en %. La vraie partie temporaire est remise exactement comme avant. */
function chancesEtage(k, n){
  n = n || 30;
  var save = JSON.stringify(G), rep = G.exp.replay, v = 0, sp = 0;
  for(var i = 0; i < n; i++){
    G = JSON.parse(save); G.exp.replay = [];
    G.m.forEach(function(x){ if(x.al) x.en = Math.max(0, x.en - BAL.immeuble.energieEtage); });
    G.combat = { zombies:zombiesEtage(k), tour:1, journal:[], resume:[], fin:null, pv0:{}, abattus:0 };
    preparerIntentions();
    var vivants0 = G.m.filter(function(x){ return x.al; }).length, t = 0;
    while(!G.combat.fin && t++ < 80) tourAuto();
    if(G.combat.fin === "victoire"){ v++; if(G.m.filter(function(x){ return x.al; }).length === vivants0) sp++; }
  }
  G = JSON.parse(save); G.exp.replay = rep;
  return { victoire:Math.round(v / n * 100), sansPerte:Math.round(sp / n * 100) };
}
function monterEtage(){
  var k = G.exp.etage, E = BAL.immeuble.etages[k];
  G.m.forEach(function(x){ if(x.al) x.en = Math.max(0, x.en - BAL.immeuble.energieEtage); });
  var zs = zombiesEtage(k);
  var pv0 = {}; G.m.forEach(function(x, i){ if(x.al) pv0[i] = x.hp; });
  G.combat = { zombies:zs, tour:1, journal:[["", "🏢 " + E.nom + " (étage " + (k + 1) + " / " + BAL.immeuble.etages.length + ") : " + zs.length + " zombies vous attendent."]], resume:[], fin:null, pv0:pv0, abattus:0 };
  preparerIntentions();
  G.exp.replay.push({ k:"etage", e:k, nom:E.nom, z:zs.map(function(z){ return [z.id, z.nom, z.pvMax]; }), m:G.m.map(function(x){ return x.al ? x.hp : 0; }) });
  choixCombat = {}; cibleCombat = 0; dernierPV = null; combatVu = null;
  render(); openCombat();
}
// Après chaque tour (jouerTour / fuir, appelé par logique.js) : une image du combat pour le replay
function noterTourRaid(J){
  var C = G.combat;
  G.exp.replay.push({ k:"tour", t:Math.max(1, C.tour - 1), z:C.zombies.map(function(z){ return [z.id, z.nom, z.pvMax, z.pv]; }), m:G.m.map(function(x){ return x.al ? x.hp : 0; }),
    j:(J || []).map(function(l){ return [l[0], texteBrut(l[1]), l[2] || ""]; }), fin:C.fin || "" });
}
// Bouton de fin de combat pendant le raid
function finEtageRaid(){
  var C = G.combat, k = G.exp.etage, E = BAL.immeuble.etages[k];
  if(C.fin === "victoire"){
    var trouve = {};
    for(var id in E.butin){ var q = R(E.butin[id][0], E.butin[id][1]); if(q > 0 && OBJETS[id]){ trouve[id] = q; G.exp.butin[id] = (G.exp.butin[id] || 0) + q; } }
    G.exp.etage = k + 1; G.exp.etagesFaits = k + 1; G.exp.dernierButin = trouve;
    G.exp.replay.push({ k:"butin", e:k, objets:trouve });
    if(G.exp.etage >= BAL.immeuble.etages.length) finirRaid("sommet"); else openEntreEtages();
  } else finirRaid(C.fin === "fuite" ? "fuite" : "defaite");
}
function placeRaid(){ var v = G.m.filter(function(x){ return x.al; }).length; return v * BAL.immeuble.sac + (G.exp.remorque ? BAL.immeuble.remorque : 0); }
function totalButin(b){ var t = 0; for(var k in b) t += b[k]; return t; }
function openEntreEtages(){
  var k = G.exp.etage, Ep = BAL.immeuble.etages[k - 1], En = BAL.immeuble.etages[k], tot = totalButin(G.exp.butin), place = placeRaid();
  var blesses = G.m.filter(function(x){ return x.al && x.hp < 100; }).length, soins = soinsDispo();
  var h = '<h2>🏢 ' + Ep.nom + ' : nettoyé !</h2><p class="sub">Étage ' + k + ' / ' + BAL.immeuble.etages.length + ' · ' + tot + ' objet' + (tot > 1 ? "s" : "") + ' trouvés · place pour ' + place + (tot > place ? " : le reste devra être abandonné" : "") + '</p>';
  var dern = G.exp.dernierButin || {}, ids = Object.keys(dern);
  if(ids.length) h += '<p class="titre-butin">📦 Trouvé à cet étage</p>' + etageres(ids.map(function(id){ return caseObjet(id, { fixe:true, n:dern[id] }); }), 5);
  h += '<p class="titre-butin">👥 L’équipe</p><div class="raid-equipe">' + G.m.map(function(x){ return '<span class="raid-v' + (x.al ? "" : " mort") + '">' + iconeMembre(x) + '<b>' + x.nom + '</b><small>' + (x.al ? "❤️ " + x.hp + " · ⚡ " + x.en : "💀") + '</small></span>'; }).join("") + '</div>';
  var ch = chancesEtage(k, 30), cls = ch.sansPerte >= 60 ? "ok" : ch.victoire >= 50 ? "moy" : "ko";
  h += '<p class="titre-butin">⬆️ Plus haut : ' + En.nom + '</p><div class="raid-menace">' + En.z.map(function(id){ var T = ZOMBIES.find(function(t){ return t.id === id; }); return '<span title="' + T.nom + '">' + iconeZombie(T) + '</span>'; }).join("") + '</div>'
    + '<p class="etat ' + cls + '">🎲 Chances de nettoyer l’étage : ' + ch.victoire + ' % · sans perte : ' + ch.sansPerte + ' %</p>';
  h += '<div class="row"><button class="btn" data-act="raidmonter">⬆️ Monter</button><button class="btn alt" data-act="raiddescendre">⬇️ Redescendre</button></div>';
  if(blesses && soins) h += '<button class="btn alt" style="width:100%;margin-top:6px" data-act="raidsoigner">🩹 Soigner le plus blessé (' + soins + ' soin' + (soins > 1 ? "s" : "") + ' en réserve)</button>';
  show(h);
}
function soignerRaid(){
  var bl = G.m.map(function(x, i){ return i; }).filter(function(i){ return G.m[i].al && G.m[i].hp < 100; }).sort(function(a, b){ return G.m[a].hp - G.m[b].hp; })[0];
  if(bl !== undefined){ var k = soigner(bl); if(k) G.exp.replay.push({ k:"soin", txt:G.m[bl].nom + " est soigné" + (estFeminin(G.m[bl]) ? "e" : "") + " avec " + nommer(k, 1) + " (" + G.m[bl].hp + " PV)." }); }
  render(); openEntreEtages();
}
// Fin du raid : ce qu'on ramène, ce que devient chaque volontaire, retour à la vraie partie
function finirRaid(issue){
  var S = G, E = S.exp, place = placeRaid(), butin = issue === "defaite" ? {} : JSON.parse(JSON.stringify(E.butin)), perdu = 0;
  if(issue === "defaite") perdu = totalButin(E.butin);
  while(totalButin(butin) > place){ var gros = Object.keys(butin).sort(function(a, b){ return butin[b] - butin[a]; })[0]; butin[gros]--; if(!butin[gros]) delete butin[gros]; perdu++; }
  // L'équipement de guerre s'use d'un cran
  S.stock.o.slice().forEach(function(o){ var u = E.uidMap[o.uid]; if(u && u.gear){ o.sol = (o.sol || 1) - 1; if(o.sol <= 0) S.stock.o.splice(S.stock.o.indexOf(o), 1); } });
  var res = {};
  E.owners.forEach(function(vid, i){
    var x = S.m[i], mort = S.dd.find(function(d){ return d.n === x.nom; });
    var eq = {}; // l'équipement porté au départ, encore entier (sur lui ou, s'il est mort, au stock)
    var tous = S.stock.o.concat(["arme", "outil", "sac"].map(function(s){ return x.eq[s]; }).filter(Boolean));
    tous.forEach(function(o){ var u = E.uidMap[o.uid]; if(u && !u.gear && u.v === vid) eq[u.slot] = { id:o.id, sol:o.sol, uid:u.uid }; });
    res[vid] = { al:x.al, hp:x.hp, en:x.en, cause:mort ? mort.c : "", eq:eq, kit:{ n:{}, o:[] } };
  });
  // Ce qui reste des kits : rendu à chacun au prorata de ce qu'il avait apporté
  for(var id in E.contrib){
    var reste = S.stock.n[id] || 0, c = E.contrib[id], ids = Object.keys(c).sort(function(a, b){ return c[b] - c[a]; }), tot = 0, donne = 0;
    ids.forEach(function(v){ tot += c[v]; });
    ids.forEach(function(v){ var q = Math.floor(reste * c[v] / tot); if(q){ res[v].kit.n[id] = q; donne += q; } });
    for(var n = 0; donne < reste; n++){ var v2 = ids[n % ids.length]; res[v2].kit.n[id] = (res[v2].kit.n[id] || 0) + 1; donne++; }
  }
  S.stock.o.forEach(function(o){ var u = E.uidMap[o.uid]; if(u && u.gear && res[u.v]) res[u.v].kit.o.push({ id:o.id, sol:o.sol, uid:u.uid }); });
  E.replay.push({ k:"fin", issue:issue, butin:butin, perdu:perdu, etages:E.etagesFaits });
  var resultat = { etages:E.etagesFaits, max:BAL.immeuble.etages.length, issue:issue, butin:butin, perdu:perdu, volontaires:res, replay:E.replay };
  // Retour à la vraie partie
  G = G_MAISON; G_MAISON = null; G.exp = null; G.combat = null; combatVu = null; dernierPV = null;
  try{ localStorage.setItem("survival_raid_attente", JSON.stringify(resultat)); }catch(e){}
  render(); if(typeof sauver === "function") sauver();
  envoyerRaid(resultat);
}
function envoyerRaid(resultat){
  show('<h2>🏢 Fin du raid</h2><p class="sub">Envoi du résultat au clan…</p>');
  appelClans({ action:"raidFin", resultat:resultat }).then(function(d){
    if(d.erreur && !/déjà été pillé/.test(d.erreur)){ show('<h2>🏢 Fin du raid</h2><p class="msg">❌ ' + d.erreur + '</p><div class="row"><button class="btn" data-act="raidrenvoyer">🔁 Réessayer</button><button class="btn alt" data-act="close">Plus tard</button></div>'); return; }
    try{ localStorage.removeItem("survival_raid_attente"); }catch(e){}
    if(d.bastion) etatBastion = d.bastion;
    recupererPart();
  }).catch(function(){ show('<h2>🏢 Fin du raid</h2><p class="msg">❌ ' + MSG_HORS_LIGNE + '</p><p class="sub">Le résultat est gardé : il sera envoyé dès que tu réessaies (onglet Immeuble du bastion).</p><div class="row"><button class="btn" data-act="raidrenvoyer">🔁 Réessayer</button><button class="btn alt" data-act="close">Plus tard</button></div>'); });
}
function raidEnAttente(){ try{ return JSON.parse(localStorage.getItem("survival_raid_attente")); }catch(e){ return null; } }

/* ---------- Ma part : nouvelles de mon volontaire, mon kit, mon butin ---------- */
function recupererPart(){
  appelClans({ action:"raidRecuperer" }).then(function(d){
    if(d.erreur){ msgRaid = "❌ " + d.erreur; ongletBastion = "operations"; opOuverte = "immeuble"; ouvrirOperation("immeuble"); return; }
    appliquerPart(d.part, d.res);
  }).catch(function(){ msgRaid = "❌ " + MSG_HORS_LIGNE; ouvrirOperation("immeuble"); });
}
function appliquerPart(p, res){
  var x = G.m[p.idx] && G.m[p.idx].raid ? G.m[p.idx] : membreRaid(), M = p.membre || {}, lignes = [];
  if(x){
    var avant = x.raidEq || {};
    x.raid = false; delete x.raidEq;
    // L'équipement emporté : usé, ou cassé pendant le raid
    for(var s in avant){
      var inst = x.eq[s] && x.eq[s].uid === avant[s] ? x.eq[s] : null; if(!inst) continue;
      var r = Object.keys(M.eq || {}).map(function(k){ return M.eq[k]; }).find(function(o){ return o.uid === avant[s]; });
      if(r) inst.sol = r.sol; else { x.eq[s] = null; lignes.push(["b2", "💥 " + OBJETS[inst.id].nom + " " + de(x.nom) + " s’est brisé" + (OBJETS[inst.id].g === "f" ? "e" : "") + " pendant le raid."]); }
    }
    if(M.al){ x.hp = Math.max(1, M.hp); x.en = M.en; lignes.unshift(["g2", "🏠 " + x.nom + " est revenu" + (estFeminin(x) ? "e" : "") + " du raid (❤️ " + x.hp + ", ⚡ " + x.en + ")."]); }
    else {
      x.hp = 0; x.al = false; changerMoral(-25);
      G.dd.push({ n:x.nom, r:roleDe(x), c:M.cause || "tombé pendant le raid de l’immeuble", j:G.day, ic:x.icone });
      rendreAuStock([x]);
      lignes.unshift(["mort", phraseMort(x.nom, M.cause || "tué pendant le raid de l’immeuble", roleDe(x)), roleDe(x)]);
    }
  }
  rendreKit(p.kit);
  var rend = Object.keys((p.kit || {}).n || {}).map(function(k){ return nommer(k, p.kit.n[k]); }).concat(((p.kit || {}).o || []).map(function(o){ return nommer(o.id, 1); }));
  if(rend.length) lignes.push(["", "🎒 Rendu de ce que tu avais confié : " + liste(rend) + "."]);
  var part = [];
  for(var k in (p.objets || {})) if(OBJETS[k]){ ajouter(k, p.objets[k]); part.push(k); }
  render(); if(typeof sauver === "function") sauver();
  var S = res || {};
  var h = '<h2>🏢 Retour du raid</h2><p class="sub">' + (S.issue === "sommet" ? "🏆 Le toit est tombé !" : S.issue === "defaite" ? "💀 L’équipe n’est pas revenue." : "⬇️ L’équipe est redescendue.") + ' ' + (S.etages || 0) + ' étage' + ((S.etages || 0) > 1 ? "s" : "") + ' sur ' + (S.max || 5) + ', ' + (S.total || 0) + ' objets ramenés.</p>'
    + puces(lignes);
  h += part.length ? '<p class="titre-butin">🎁 Ta part du butin</p>' + etageres(part.map(function(k){ return caseObjet(k, { fixe:true, n:p.objets[k] }); }), 5) : '<p class="sub">Pas de butin pour toi cette fois.</p>';
  var rv = S.reserve ? Object.keys(S.reserve).map(function(k){ return nommer(k, S.reserve[k]); }) : [];
  if(rv.length) h += '<p class="sub">📦 Part du clan versée à la réserve : ' + liste(rv) + '.</p>';
  h += '<div class="row"><button class="btn" data-act="raidreplay">▶️ Revoir le raid</button><button class="btn alt" data-act="close">Fermer</button></div>';
  show(h);
  if(typeof finiSiMorts === "function") finiSiMorts();
}

/* ---------- Replay ---------- */
var rp = null;
function openReplayRaid(){
  show('<h2>▶️ Replay du raid</h2><p class="sub">Chargement…</p>' + BTN_FERMER());
  appelClans({ action:"raidReplay" }).then(function(d){
    if(d.erreur || !d.replay || !d.replay.length){ show('<h2>▶️ Replay du raid</h2><p>' + (d.erreur ? "❌ " + d.erreur : "Pas de replay pour ce raid.") + '</p>' + BTN_FERMER()); return; }
    lireReplay(d.replay, d.res);
  }).catch(function(){ show('<h2>▶️ Replay du raid</h2><p>' + MSG_HORS_LIGNE + '</p>' + BTN_FERMER()); });
}
function lireReplay(frames, res){
  if(rp && rp.minuterie) clearTimeout(rp.minuterie);
  rp = { f:frames, i:0, vitesse:1, pause:false, res:res, minuterie:null };
  dessinerReplay(); planifierReplay();
}
function etatReplay(){
  var e = { etage:-1, nom:"", z:[], m:[], eq:[], j:[], fin:null, butin:{}, tour:0 };
  for(var i = 0; i <= rp.i && i < rp.f.length; i++){
    var F = rp.f[i];
    if(F.k === "debut") e.eq = F.m;
    else if(F.k === "etage"){ e.etage = F.e; e.nom = F.nom; e.z = F.z.map(function(z){ return [z[0], z[1], z[2], z[2]]; }); e.m = F.m; e.j = [["", "🏢 " + F.nom + " : " + F.z.length + " zombies."]]; e.tour = 0; }
    else if(F.k === "tour"){ e.z = F.z; e.m = F.m; e.j = F.j; e.tour = F.t; }
    else if(F.k === "butin"){ e.j = [["g2", "📦 Trouvé : " + liste(Object.keys(F.objets).map(function(k){ return OBJETS[k] ? nommer(k, F.objets[k]) : k; })) + "."]]; for(var k in F.objets) e.butin[k] = (e.butin[k] || 0) + F.objets[k]; }
    else if(F.k === "soin") e.j = [["g2", "🩹 " + F.txt]];
    else if(F.k === "fin") e.fin = F;
  }
  return e;
}
function dessinerReplay(){
  var e = etatReplay(), fini = rp.i >= rp.f.length - 1, h = '<h2>▶️ Raid de l’immeuble</h2><div id="rp">';
  h += '<p class="sub">' + (e.etage >= 0 ? "Étage " + (e.etage + 1) + " / " + BAL.immeuble.etages.length + " · " + e.nom + (e.tour ? " · tour " + e.tour : "") : "Départ") + '</p>';
  h += '<div class="rp-arene" style="background-image:url(\'' + fondEtage(Math.max(0, e.etage)) + '\')">' + e.z.map(function(z){
    var sp = spriteZombie({ id:z[0] });
    return '<span class="rp-z' + (z[3] > 0 ? "" : " mort") + '">' + (sp ? '<img src="' + sp + '" alt="">' : iconeZombie({ id:z[0] })) + '<i class="zpv"><b style="width:' + Math.round(Math.max(0, z[3]) / Math.max(1, z[2]) * 100) + '%"></b></i><small>' + z[1] + '</small></span>';
  }).join("") + '</div>';
  h += '<div class="rp-equipe">' + e.eq.map(function(x, i){ var hp = e.m.length ? e.m[i] : x[2];
    return '<span class="raid-v' + (hp > 0 ? "" : " mort") + '">' + iconeMembre({ nom:x[0], r:x[1], icone:"🙂", al:hp > 0, hp:hp, en:80, faim:80, soif:80 }) + '<b>' + x[0] + '</b><i class="zpv"><b style="width:' + Math.max(0, hp) + '%"></b></i></span>'; }).join("") + '</div>';
  if(e.fin){
    var tb = totalButin(e.fin.butin || {});
    h += '<div class="raid-res ' + (e.fin.issue === "defaite" ? "ko" : "ok") + '"><b>' + (e.fin.issue === "sommet" ? "🏆 Le toit est tombé !" : e.fin.issue === "defaite" ? "💀 Personne n’est revenu" : "⬇️ L’équipe redescend") + '</b><small>' + (e.fin.etages || 0) + ' étage' + ((e.fin.etages || 0) > 1 ? "s" : "") + ' nettoyé' + ((e.fin.etages || 0) > 1 ? "s" : "") + ' · ' + tb + ' objets ramenés' + (e.fin.perdu ? " · " + e.fin.perdu + " abandonnés" : "") + '</small></div>';
  } else h += '<div class="rp-journal">' + puces(e.j.map(function(l){ return l; })) + '</div>';
  h += '</div><div class="row rp-boutons"><button class="btn alt" data-act="rppause" aria-label="Lecture ou pause">' + (rp.pause || fini ? "▶️" : "⏸️") + '</button><button class="btn alt" data-act="rpvite">⏩ ×' + (rp.vitesse === 1 ? 2 : rp.vitesse === 2 ? 4 : 1) + '</button><button class="btn alt" data-act="rpfin" aria-label="Aller au résultat">⏭️</button><button class="btn" data-act="close">Fermer</button></div>';
  show(h);
}
function planifierReplay(){
  if(rp.minuterie) clearTimeout(rp.minuterie);
  if(rp.pause || rp.i >= rp.f.length - 1) return;
  rp.minuterie = setTimeout(function(){ if(!document.getElementById("rp")) return; rp.i++; dessinerReplay(); planifierReplay(); }, 1700 / rp.vitesse);
}

/* ---------- Clics ---------- */
// Pendant le raid (partie temporaire), seuls le combat et les fenêtres du raid répondent : pas de nuit, de fouille ni de pièce
var ACTIONS_RAID = /^(cible|cact|ctour|cfuir|cauto|cfin|raid\w*|rp\w*|son)$/;
document.addEventListener("click", function(e){
  if(!enRaid()) return;
  var b = e.target.closest("[data-act]"), dansFenetre = e.target.closest("#modal");
  if(!dansFenetre || (b && !ACTIONS_RAID.test(b.getAttribute("data-act")))){ e.stopPropagation(); e.preventDefault(); }
}, true);
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]"); if(!b || b.disabled) return;
  var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
  if(a === "opouvrir") ouvrirOperation(id);
  else if(a === "opliste"){ opOuverte = null; afficherBastion(); }
  else if(a === "raidpret"){ raidPrep = null; openRaidPret(); }
  else if(a === "raidchoix") choisirVolontaire(+id);
  else if(a === "raidplus"){ raidPrep.n[id] = Math.min(40, compter(id), (raidPrep.n[id] || 0) + 1); openRaidPret(); }
  else if(a === "raidmoins"){ raidPrep.n[id] = Math.max(0, (raidPrep.n[id] || 0) - 1); openRaidPret(); }
  else if(a === "raidgear"){ raidPrep.o[id] = !raidPrep.o[id]; openRaidPret(); }
  else if(a === "raidretour"){ if(raidPrep){ raidPrep = null; openRaidPret(); } else { ongletBastion = "operations"; opOuverte = "immeuble"; afficherBastion(); } }
  else if(a === "raidenvoyer") envoyerVolontaire();
  else if(a === "raidretrait") retirerVolontaire();
  else if(a === "raidlancer") lancerRaid();
  else if(a === "raidmonter"){ G.exp.replay.push({ k:"choix", txt:"monte" }); monterEtage(); }
  else if(a === "raiddescendre"){ G.exp.replay.push({ k:"choix", txt:"redescend" }); finirRaid("redescendu"); }
  else if(a === "raidsoigner") soignerRaid();
  else if(a === "raidrenvoyer"){ var r = raidEnAttente(); if(r) envoyerRaid(r); else hide(); }
  else if(a === "raidpart") recupererPart();
  else if(a === "raidreplay") openReplayRaid();
  else if(a === "rppause"){ if(rp.i >= rp.f.length - 1){ rp.i = 0; rp.pause = false; } else rp.pause = !rp.pause; dessinerReplay(); planifierReplay(); }
  else if(a === "rpvite"){ rp.vitesse = rp.vitesse === 1 ? 2 : rp.vitesse === 2 ? 4 : 1; dessinerReplay(); planifierReplay(); }
  else if(a === "rpfin"){ rp.i = rp.f.length - 1; dessinerReplay(); planifierReplay(); }
});

// Au lancement : le raid a eu lieu et ma part m'attend → bandeau
(function(){
  if(typeof location === "undefined" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  setTimeout(function(){
    if(typeof dansUnClan === "function" && !dansUnClan()) return;
    if(raidEnAttente()){ if(typeof fileSucces !== "undefined"){ fileSucces.push({ icone:"🏢", titre:"Raid à envoyer", nom:"Le résultat du raid attend : ouvre les Opérations du bastion." }); montrerSucces(); } return; }
    appelClans({ action:"bastion" }).then(function(d){
      var R = d && d.bastion && d.bastion.raid; if(!R || typeof fileSucces === "undefined") return;
      noterEtatOp(R);
      var moi = R.participe || (R.volontaires || []).some(function(v){ return v.moi; }), b = null;
      if(R.maPart) b = { k:"part", icone:"🏢", titre:"Le raid de l’immeuble a eu lieu !", nom:"Va au bastion (Opérations) : replay, nouvelles de ton volontaire et ta part du butin." };
      else if(!R.fait && !R.lance && R.peutLancer && R.chef) b = { k:"pret", icone:"🎯", titre:"L’équipe est prête !", nom:R.nb + " volontaires attendent au bastion : à toi de lancer le raid de l’immeuble." };
      else if(!R.fait && !R.lance && !moi && R.nb > 0 && R.nb < R.max) b = { k:"besoin", icone:"🎯", titre:"Ton clan prépare une opération", nom:R.nb >= R.min ? "Le raid de l’immeuble peut partir : il reste une place pour ton volontaire." : "Raid de l’immeuble : il manque " + (R.min - R.nb) + " volontaire" + (R.min - R.nb > 1 ? "s" : "") + ". Envoie le tien depuis le bastion !" };
      if(!b) return;
      var cle = new Date().toISOString().slice(0, 10) + b.k; try{ if(localStorage.getItem("survival_op_bandeau") === cle) return; localStorage.setItem("survival_op_bandeau", cle); }catch(e){}
      fileSucces.push(b); montrerSucces();
    }).catch(function(){});
  }, 8000);
})();
