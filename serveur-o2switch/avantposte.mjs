// AVANT-POSTE : la carte des avant-postes, côté serveur (2026-11-15). Module à part, branché par une seule ligne dans worker/index.js.
// Adresse : POST /api/avantposte { action:"maj"|"carte", id, pseudo, avatar, niv, def, bats }
// Données : clé KV « ap_carte » = { postes: { id: { s, p, pseudo, avatar, niv, def, bats, jour, vu } } }
// La carte est faite de secteurs (images/avantposte/secteurs/) posés en spirale ; le secteur 0 (centre-ville) n'a que des camps
// de pillards gérés par le jeu ; dans les autres, l'emplacement 0 est aussi un camp de pillards. Un joueur absent depuis 30 jours
// devient une ruine ; après 60 jours, il disparaît et sa place se libère.
// À GARDER IDENTIQUE à avantposte.js (côté jeu) : AP_SECTEURS et typeSecteur().

export const AP_SECTEURS = {
  quartier: [[369, 25], [86, 49], [220, 74], [434, 159], [193, 187], [29, 195], [328, 198], [456, 236], [73, 296], [170, 339], [321, 344], [37, 425], [467, 471], [295, 473]],
  foret: [[232, 73], [66, 100], [417, 107], [118, 156], [457, 197], [245, 232], [79, 266], [388, 305], [100, 378], [449, 402], [390, 449]],
  industrie: [[40, 69], [441, 78], [283, 91], [196, 223], [305, 291], [205, 421], [136, 478], [43, 287], [117, 367], [309, 473], [443, 467]],
  riviere: [[193, 43], [41, 125], [321, 151], [404, 181], [112, 189], [457, 276], [186, 311], [227, 365], [267, 459]],
  autoroute: [[348, 203], [434, 255], [225, 423], [302, 455], [172, 37], [448, 51], [421, 155], [45, 288], [128, 361], [75, 428]],
  centre: [[166, 36], [411, 51], [98, 102], [403, 171], [477, 279], [27, 299], [124, 325], [202, 431], [34, 444], [326, 469]]
};
const TYPES = ["quartier", "foret", "industrie", "riviere", "autoroute"];
export function typeSecteur(s){ return s === 0 ? "centre" : TYPES[(s * 3 + 1) % TYPES.length]; }
const BATS_OK = ["citerne", "serre", "scierie", "palissade", "entrepot", "infirmerie", "forge", "radio", "tour", "garage", "planque", "pieges", "charrette", "siege", "chenil"];
const JOUR = 86400000, RUINE = 30 * JOUR, OUBLI = 60 * JOUR;
// Mode pillard : on ne peut piller (et être pillé) que si on l'a activé ; engagement de 3 jours relancé à chaque attaque ;
// 24 h de bouclier après avoir été pillé ; 10 à 20 % du stock non récolté (moins la planque), plafonné par la charrette.
const ENGAGE = 3 * JOUR, BOUCLIER = JOUR, RES_OK = ["eau", "nour", "planche", "herbes", "bandage", "clous", "ferraille", "jerrican"];
const PLANQUE = [15, 25, 35, 45, 60];
// Éclaireurs (2026-11-16, idée de Fabien) : les bâtiments et la défense d'un autre joueur ne sont plus envoyés à tout le monde.
// Il faut envoyer un éclaireur : retour au bout de 5 min, rapport valable 24 h. Le chenil de la cible le repère (15 % par niveau)
// et la tour de guet aussi (4 % par niveau), 85 % au plus ; repéré = pas de rapport, la cible est prévenue, nouvel essai dans 1 h.
// La radio de celui qui espionne donne le stock exact (sinon « peu / moyen / beaucoup »).
const ECL_DUREE = 5 * 60000, ECL_VALIDE = JOUR, ECL_REESSAI = 3600000, ECL_MAX = 3;
function rapportDe(A, P){
  const st = P.stock || {}, total = Object.keys(st).reduce(function(t, r){ return t + (st[r] || 0); }, 0);
  const radio = (A.bats && A.bats.radio) || 0;
  return { bats: Object.assign({}, P.bats || {}), def: P.def || 0, stock: radio ? Object.assign({}, st) : null, niveauStock: total >= 40 ? 3 : total >= 12 ? 2 : total > 0 ? 1 : 0 };
}
// 2026-11-15 (choix de Fabien) : piller d'autres joueurs (et passer en mode pillard) demande une famille qui a tenu 30 jours ;
// à la mort de la famille, retour automatique en mode protégé + 24 h de bouclier (action « mort »)
const JOUR_PVP = 30;
const MSG_JOUR_PVP = "Ta famille doit avoir tenu 30 jours pour piller d’autres survivants.";
function peutCibler(A, P, now){
  if(!P) return "Cet avant-poste n’existe plus.";
  if(P === A) return "Tu ne peux pas te piller toi-même.";
  if(!A.pillard) return "Active d’abord le mode pillard.";
  if((A.jour || 0) < JOUR_PVP) return MSG_JOUR_PVP;
  const ruine = now - (P.vu || 0) > RUINE;
  if(!ruine && !P.pillard) return "Cet avant-poste est protégé : il n’est pas en mode pillard.";
  if((P.bouclier || 0) > now) return "Cet avant-poste vient d’être pillé : il est à l’abri encore un moment.";
  if(!ruine && (P.niv || 0) < Math.floor((A.niv || 0) / 2) && (P.niv || 0) < 10) return "Cet avant-poste est bien plus petit que le tien : ce ne serait pas juste.";
  return "";
}

async function lire(env){ return (await env.CLASSEMENT.get("ap_carte", { type: "json" })) || { postes: {} }; }
function nettoyer(C, now){
  let change = false;
  for(const id in C.postes) if(now - (C.postes[id].vu || 0) > OUBLI){ delete C.postes[id]; change = true; }
  return change;
}
function placeLibre(C){
  const prises = {};
  for(const id in C.postes){ const P = C.postes[id]; prises[P.s + ":" + P.p] = true; }
  for(let s = 1; s < 5000; s++){
    const n = AP_SECTEURS[typeSecteur(s)].length;
    for(let p = 1; p < n; p++) if(!prises[s + ":" + p]) return { s, p };
  }
  return null;
}
function vue(C, id, now){
  let sMax = 1;
  const M0 = C.postes[id], R = (M0 && M0.eclaireurs) || {};
  const postes = Object.keys(C.postes).map(function(k){
    const P = C.postes[k]; if(P.s > sMax) sMax = P.s;
    const ruine = now - (P.vu || 0) > RUINE, moi = k === id, r = R[k];
    const o = { s: P.s, p: P.p, pseudo: P.pseudo || "", avatar: P.avatar || "", niv: P.niv || 0, ruine, absent: Math.floor((now - (P.vu || 0)) / JOUR), moi,
      pillard: !!P.pillard, bouclier: (P.bouclier || 0) > now ? P.bouclier : 0 };
    if(moi || ruine){ o.def = P.def || 0; o.bats = P.bats || {}; }
    else if(r){
      if(r.fin > now) o.eclaireur = r.fin;
      else if(r.echec){ if(now - r.fin < ECL_REESSAI) o.repere = r.fin; }
      else if(now - r.fin < ECL_VALIDE) o.rapport = { t: r.fin, bats: r.bats, def: r.def, stock: r.stock, niveauStock: r.niveauStock };
    }
    return o;
  });
  const M = C.postes[id], moi = M ? { s: M.s, p: M.p, pillard: !!M.pillard, engage: M.engage || 0 } : null;
  return { secteurs: sMax + 1, moi, postes };
}

// O = outils de worker/index.js : { reponse, texteInterdit, nomPropre, avatarDe }
export async function avantpostePost(request, env, O){
  let d; try{ d = await request.json(); }catch(e){ return O.reponse({ erreur: "Demande illisible." }, 400); }
  const id = String(d.id || "").replace(/[^\w-]/g, "").slice(0, 40);
  if(!id && d.action !== "reglage") return O.reponse({ erreur: "Identifiant manquant." }, 400);
  const now = Date.now();
  const RG = (await env.CLASSEMENT.get("reglages", { type: "json" })) || {}, jourAcces = RG.jourAvantposte >= 1 ? RG.jourAvantposte : 50;
  if(d.action === "reglage") return O.reponse({ jour: jourAcces });
  const C = await lire(env);
  let change = nettoyer(C, now);
  if(d.action === "maj"){
    const P = C.postes[id] || {};
    const pseudo = O.nomPropre(d.pseudo, 16);
    P.pseudo = O.texteInterdit(pseudo) ? "" : pseudo;
    P.avatar = O.avatarDe(d);
    P.niv = Math.max(0, Math.min(70, Math.floor(+d.niv) || 0));
    P.def = Math.max(0, Math.min(60, Math.floor(+d.def) || 0));
    P.bats = {};
    const b = d.bats && typeof d.bats === "object" ? d.bats : {};
    BATS_OK.forEach(function(k){ const n = Math.floor(+b[k]) || 0; if(n > 0) P.bats[k] = Math.min(5, n); });
    P.jour = Math.max(0, Math.min(5000, Math.floor(+d.jour) || 0));
    P.vu = now;
    // Le stock non récolté (sert à calculer ce qu'un pillard peut prendre)
    P.stock = {}; const st = d.stock && typeof d.stock === "object" ? d.stock : {};
    RES_OK.forEach(function(r){ const n = Math.floor(+st[r]) || 0; if(n > 0) P.stock[r] = Math.min(200, n); });
    if(P.s == null){ const pl = placeLibre(C); if(!pl) return O.reponse({ erreur: "La carte est pleine." }, 503); P.s = pl.s; P.p = pl.p; }
    C.postes[id] = P; change = true;
  }
  let extra = {};
  const A = C.postes[id];
  // Pillages subis depuis la dernière fois : envoyés une fois, puis effacés
  if(d.action === "maj" && A && A.pille && A.pille.length){ extra.pillages = A.pille; A.pille = []; change = true; }
  if(A && A.espions && A.espions.length){ const arr = A.espions.filter(function(E){ return E.t <= now; }); if(arr.length){ extra.espions = arr; A.espions = A.espions.filter(function(E){ return E.t > now; }); change = true; } }
  // vieux rapports effacés
  if(A && A.eclaireurs){ for(const k in A.eclaireurs){ const r = A.eclaireurs[k]; if(now - r.fin > ECL_VALIDE || !C.postes[k]){ delete A.eclaireurs[k]; change = true; } } }
  // Le jour de la famille, envoyé avec les actions qui en dépendent
  if(A && d.jour != null && d.action !== "maj"){ A.jour = Math.max(0, Math.min(5000, Math.floor(+d.jour) || 0)); change = true; }
  if(d.action === "mort"){
    if(A){ A.pillard = false; A.engage = 0; A.bouclier = now + BOUCLIER; delete A.attaque; change = true; }
  }
  if(d.action === "pillard"){
    if(!A) return O.reponse({ erreur: "Ton avant-poste n’est pas encore sur la carte." });
    if(d.on && (A.jour || 0) < JOUR_PVP) return O.reponse({ erreur: MSG_JOUR_PVP });
    if(d.on){ A.pillard = true; A.engage = Math.max(A.engage || 0, now + ENGAGE); }
    else { if((A.engage || 0) > now) return O.reponse({ erreur: "Tu t’es engagé : le mode pillard reste actif encore un peu." }); A.pillard = false; }
    change = true;
  }
  if(d.action === "eclaireur"){
    if(!A) return O.reponse({ erreur: "Ton avant-poste n’est pas encore sur la carte." });
    const cid = Object.keys(C.postes).find(function(k){ return C.postes[k].s === +d.s && C.postes[k].p === +d.p; }), P = cid && C.postes[cid];
    if(!P) return O.reponse({ erreur: "Cet avant-poste n’existe plus." });
    if(P === A) return O.reponse({ erreur: "C’est ton propre avant-poste." });
    A.eclaireurs = A.eclaireurs || {};
    const r0 = A.eclaireurs[cid];
    if(r0 && r0.fin > now) return O.reponse({ erreur: "Ton éclaireur est déjà en route." });
    if(r0 && r0.echec && now - r0.fin < ECL_REESSAI) return O.reponse({ erreur: "Ton dernier éclaireur a été repéré : attends un peu avant d’en renvoyer un." });
    if(Object.keys(A.eclaireurs).filter(function(k){ return A.eclaireurs[k].fin > now; }).length >= ECL_MAX) return O.reponse({ erreur: "Tous tes éclaireurs sont déjà dehors." });
    const ch = (P.bats && P.bats.chenil) || 0, tr = (P.bats && P.bats.tour) || 0, fin = now + ECL_DUREE;
    const repere = Math.random() < Math.min(0.85, ch * 0.15 + tr * 0.04);
    A.eclaireurs[cid] = repere ? { fin, echec: true } : Object.assign({ fin }, rapportDe(A, P));
    if(repere) P.espions = (P.espions || []).concat([{ t: fin, par: A.pseudo || "" }]).slice(-10);
    change = true;
  }
  if(d.action === "attaquer"){
    if(!A) return O.reponse({ erreur: "Ton avant-poste n’est pas encore sur la carte." });
    const cid = Object.keys(C.postes).find(function(k){ return C.postes[k].s === +d.s && C.postes[k].p === +d.p; }), P = cid && C.postes[cid];
    const raison = peutCibler(A, P, now);
    if(raison) return O.reponse({ erreur: raison });
    A.engage = now + ENGAGE; A.attaque = { cible: cid, t: now }; change = true;
    extra.cible = { pseudo: P.pseudo || "", niv: P.niv || 0, bats: P.bats || {}, ruine: now - (P.vu || 0) > RUINE };
  }
  if(d.action === "finAttaque"){
    if(!A || !A.attaque || now - A.attaque.t > 2 * 3600000) return O.reponse({ erreur: "Aucune attaque en cours." });
    if(d.victoire && now - A.attaque.t < 5000) return O.reponse({ erreur: "Combat trop rapide : résultat refusé." }); // SÉCURITÉ (2026-11-16)
    const P = C.postes[A.attaque.cible]; delete A.attaque; change = true;
    if(!P) return O.reponse({ erreur: "Cet avant-poste n’existe plus." });
    if(d.victoire){
      const pl = (P.bats && P.bats.planque) || 0, frac = (0.10 + Math.min(0.10, (+d.etoiles || 0) * 0.033)) * (1 - (pl ? PLANQUE[pl - 1] / 100 : 0));
      const cap = 6 + 6 * Math.min(5, (A.bats && A.bats.charrette) || 0);
      let total = 0; const butin = [];
      RES_OK.forEach(function(r){ const dispo = (P.stock && P.stock[r]) || 0; let n = Math.floor(dispo * frac); if(n < 1 && dispo >= 3) n = 1; n = Math.min(n, cap - total); if(n > 0){ butin.push([r, n]); total += n; P.stock[r] = dispo - n; } });
      P.bouclier = now + BOUCLIER;
      P.pille = (P.pille || []).concat([{ t: now, par: A.pseudo || "", ok: false, pertes: butin }]).slice(-10);
      extra.butin = butin;
    } else {
      P.pille = (P.pille || []).concat([{ t: now, par: A.pseudo || "", ok: true, pertes: [] }]).slice(-10);
    }
  }
  if(change) await env.CLASSEMENT.put("ap_carte", JSON.stringify(C));
  return O.reponse(Object.assign(vue(C, id, now), { jour: jourAcces }, extra));
}
