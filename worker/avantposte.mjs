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
const BATS_OK = ["citerne", "serre", "scierie", "palissade", "entrepot", "infirmerie", "forge", "radio", "tour", "garage", "planque", "pieges", "charrette", "siege"];
const JOUR = 86400000, RUINE = 30 * JOUR, OUBLI = 60 * JOUR;

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
  const postes = Object.keys(C.postes).map(function(k){
    const P = C.postes[k]; if(P.s > sMax) sMax = P.s;
    return { s: P.s, p: P.p, pseudo: P.pseudo || "", avatar: P.avatar || "", niv: P.niv || 0, def: P.def || 0, bats: P.bats || {}, ruine: now - (P.vu || 0) > RUINE, absent: Math.floor((now - (P.vu || 0)) / JOUR), moi: k === id };
  });
  const moi = C.postes[id] ? { s: C.postes[id].s, p: C.postes[id].p } : null;
  return { secteurs: sMax + 1, moi, postes };
}

// O = outils de worker/index.js : { reponse, texteInterdit, nomPropre, avatarDe }
export async function avantpostePost(request, env, O){
  let d; try{ d = await request.json(); }catch(e){ return O.reponse({ erreur: "Demande illisible." }, 400); }
  const id = String(d.id || "").replace(/[^\w-]/g, "").slice(0, 40);
  if(!id) return O.reponse({ erreur: "Identifiant manquant." }, 400);
  const now = Date.now(), C = await lire(env);
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
    if(P.s == null){ const pl = placeLibre(C); if(!pl) return O.reponse({ erreur: "La carte est pleine." }, 503); P.s = pl.s; P.p = pl.p; }
    C.postes[id] = P; change = true;
  }
  if(change) await env.CLASSEMENT.put("ap_carte", JSON.stringify(C));
  return O.reponse(vue(C, id, now));
}
