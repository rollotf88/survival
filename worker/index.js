// Worker Cloudflare (gratuit) : sert le jeu (dossier « site ») et le classement général.
// Classement : le meilleur score de chaque joueur, toutes parties. Adresse : /api/classement
// GET  /api/classement?id=...  -> les 50 meilleurs + la place du joueur
// POST /api/classement {id, pseudo, score, jours} -> enregistre (garde le meilleur score par appareil)
// Les scores sont rangés dans un « KV » Cloudflare relié au projet sous le nom CLASSEMENT.

const ENTETES = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
const reponse = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: ENTETES });
const CLE = "general", GARDES = 1000;

async function lireListe(env){ return (await env.CLASSEMENT.get(CLE, { type: "json" })) || []; }

async function onRequestOptions(){ return new Response("", { headers: ENTETES }); }

async function onRequestGet({ request, env }){
  if(!env.CLASSEMENT) return reponse({ erreur: "stockage non relié (CLASSEMENT)" }, 500);
  const moi = new URL(request.url).searchParams.get("id") || "";
  const liste = await lireListe(env);
  const k = moi ? liste.findIndex((e) => e.id === moi) : -1;
  return reponse({
    total: liste.length,
    scores: liste.slice(0, 50).map(({ pseudo, score, jours, id, cadre }) => ({ pseudo, score, jours, cadre: cadre || "", moi: !!moi && id === moi })),
    monRang: k >= 0 ? k + 1 : null, moi: k >= 0 ? { pseudo: liste[k].pseudo, score: liste[k].score, jours: liste[k].jours, cadre: liste[k].cadre || "" } : null
  });
}

async function onRequestPost({ request, env }){
  if(!env.CLASSEMENT) return reponse({ erreur: "stockage non relié (CLASSEMENT)" }, 500);
  let d; try{ d = await request.json(); }catch(e){ return reponse({ erreur: "données" }, 400); }
  const score = Math.floor(+d.score), jours = Math.floor(+d.jours);
  const pseudo = String(d.pseudo || "").replace(/[^\p{L}\p{N} _\-'.]/gu, "").trim().slice(0, 16);
  const id = String(d.id || "").replace(/[^a-z0-9]/gi, "").slice(0, 24);
  // Vérifications simples : un score impossible est refusé (au plus 4 points par jour tenu)
  if(!pseudo || id.length < 8 || !(jours >= 0 && jours <= 400) || !(score >= 0 && score <= jours * 4))
    return reponse({ erreur: "score refusé" }, 400);
  const liste = await lireListe(env);
  const ancien = liste.find((e) => e.id === id);
  let record = true;
  const cadre = cadreDe(d);
  if(ancien){ if(score > ancien.score){ ancien.score = score; ancien.jours = jours; } else record = false; ancien.pseudo = pseudo; if(cadre) ancien.cadre = cadre; }
  else liste.push({ id, pseudo, score, jours, cadre });
  liste.sort((a, b) => b.score - a.score || a.jours - b.jours);
  const garde = liste.slice(0, GARDES);
  await env.CLASSEMENT.put(CLE, JSON.stringify(garde));
  const rang = garde.findIndex((e) => e.id === id) + 1;
  return reponse({ ok: true, rang, total: garde.length, record, meilleur: ancien ? ancien.score : score });
}

// ---------- Chiffres du monde : /api/monde ----------
// GET  -> { survivants, familles, morts, zombies, joueurs, parties, record, doyen, tombes }
// POST {id, pseudo, vivants, jour, zombies, morts, parties, fin?} -> enregistre les totaux de cet appareil
// Tout est dans la clé « monde » du même KV que le classement.
const CLE_MONDE = "monde", ACTIF = 3 * 24 * 3600 * 1000, MAX_APPAREILS = 5000;
const entier = (v, max) => { v = Math.floor(+v); return v >= 0 && v <= max ? v : 0; };
async function lireMonde(env){ return (await env.CLASSEMENT.get(CLE_MONDE, { type: "json" })) || { j: {}, tombes: [] }; }
async function mondeGet(env){
  const m = await lireMonde(env), now = Date.now();
  let survivants = 0, familles = 0, morts = 0, zombies = 0, joueurs = 0, parties = 0, doyen = null;
  for(const id in m.j){
    const e = m.j[id]; joueurs++; morts += e.m || 0; zombies += e.z || 0; parties += e.p || 0;
    if(e.v > 0 && now - e.t < ACTIF){ survivants += e.v; familles++; if(!doyen || e.d > doyen.jour) doyen = { pseudo: e.n || "", jour: e.d }; }
  }
  const liste = await lireListe(env), r = liste[0];
  return reponse({ survivants, familles, morts, zombies, joueurs, parties, doyen,
    record: r ? { pseudo: r.pseudo, score: r.score, jours: r.jours } : null, tombes: (m.tombes || []).slice(0, 5) });
}
async function mondePost(request, env){
  let d; try{ d = await request.json(); }catch(e){ return reponse({ erreur: "données" }, 400); }
  const id = String(d.id || "").replace(/[^a-z0-9]/gi, "").slice(0, 24);
  if(id.length < 8) return reponse({ erreur: "id" }, 400);
  const pseudo = String(d.pseudo || "").replace(/[^\p{L}\p{N} _\-'.]/gu, "").trim().slice(0, 16);
  const m = await lireMonde(env), now = Date.now();
  m.j[id] = { v: entier(d.vivants, 4), d: entier(d.jour, 400), n: pseudo, m: entier(d.morts, 100000), z: entier(d.zombies, 1000000), p: entier(d.parties, 10000), t: now };
  if(d.fin){ m.tombes = [{ n: pseudo, j: entier(d.fin.jour, 400), s: entier(d.fin.score, 1600), t: now }].concat(m.tombes || []).slice(0, 10); }
  const ids = Object.keys(m.j);
  if(ids.length > MAX_APPAREILS) ids.sort((a, b) => m.j[a].t - m.j[b].t).slice(0, ids.length - MAX_APPAREILS).forEach((k) => delete m.j[k]);
  await env.CLASSEMENT.put(CLE_MONDE, JSON.stringify(m));
  return reponse({ ok: true });
}

// ---------- Parrainage : /api/parrainage (POST seulement) ----------
// {action:"moncode", id}                 -> { code }  (créé la première fois : 2 lettres + 3 chiffres, ex. BL615)
// {action:"utiliser", id, code, pseudo}  -> { ok, colis } ou { erreur }  (un code d'invitation par appareil ; codes spéciaux à part)
// {action:"nouvelles", id}               -> { filleuls:[pseudos] }  (les utilisations de mon code depuis la dernière fois, puis on vide)
// Tout est dans la clé « parrainage » du KV. Codes spéciaux (ex. « 18-25 » pour les bêta-testeurs) : speciaux[code] = { actif, n }
const CLE_PARR = "parrainage", LETTRES = "ABCDEFGHJKLMNPRSTUVWXYZ";
async function lireParr(env){
  const p = (await env.CLASSEMENT.get(CLE_PARR, { type: "json" })) || {};
  p.codes = p.codes || {}; p.parId = p.parId || {}; p.utilises = p.utilises || {}; p.attente = p.attente || {}; p.spUtilises = p.spUtilises || {};
  p.speciaux = p.speciaux || { "18-25": { actif: true, n: 0 } };
  return p;
}
const normCode = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 12);
async function parrainagePost(request, env){
  let d; try{ d = await request.json(); }catch(e){ return reponse({ erreur: "données" }, 400); }
  const id = String(d.id || "").replace(/[^a-z0-9]/gi, "").slice(0, 24);
  if(id.length < 8) return reponse({ erreur: "id" }, 400);
  const p = await lireParr(env);
  if(d.action === "moncode"){
    let code = p.parId[id];
    if(!code){
      do{ code = LETTRES[Math.floor(Math.random() * LETTRES.length)] + LETTRES[Math.floor(Math.random() * LETTRES.length)] + String(Math.floor(Math.random() * 1000)).padStart(3, "0"); }
      while(p.codes[code] || p.speciaux[code]);
      p.codes[code] = { id, n: 0 }; p.parId[id] = code;
      await env.CLASSEMENT.put(CLE_PARR, JSON.stringify(p));
    }
    return reponse({ code, n: p.codes[code].n });
  }
  if(d.action === "utiliser"){
    const code = normCode(d.code), pseudo = String(d.pseudo || "").replace(/[^\p{L}\p{N} _\-'.]/gu, "").trim().slice(0, 16) || "Un nouveau joueur";
    const sp = p.speciaux[code];
    if(sp){
      if(!sp.actif) return reponse({ erreur: "Ce code n’est plus actif." });
      const deja = p.spUtilises[id] || [];
      if(deja.indexOf(code) >= 0) return reponse({ erreur: "Tu as déjà utilisé ce code." });
      p.spUtilises[id] = deja.concat([code]); sp.n = (sp.n || 0) + 1;
      await env.CLASSEMENT.put(CLE_PARR, JSON.stringify(p));
      return reponse({ ok: true, colis: 1, special: true });
    }
    const c = p.codes[code];
    if(!c) return reponse({ erreur: "Ce code n’existe pas." });
    if(c.id === id) return reponse({ erreur: "C’est ton propre code !" });
    if(p.utilises[id]) return reponse({ erreur: "Tu as déjà utilisé un code d’invitation." });
    p.utilises[id] = code; c.n = (c.n || 0) + 1;
    p.attente[c.id] = (p.attente[c.id] || []).concat([pseudo]).slice(-20);
    await env.CLASSEMENT.put(CLE_PARR, JSON.stringify(p));
    return reponse({ ok: true, colis: 1 });
  }
  if(d.action === "nouvelles"){
    const f = p.attente[id] || [];
    if(f.length){ delete p.attente[id]; await env.CLASSEMENT.put(CLE_PARR, JSON.stringify(p)); }
    return reponse({ filleuls: f });
  }
  return reponse({ erreur: "action" }, 400);
}

// ---------- Guerres de clans (phase 3) ----------
// Seuls deux clans COMPLETS (5 familles) peuvent se battre. Le chef lance la recherche ; dès qu'un autre clan complet
// cherche aussi, la guerre commence : 3 jours, chaque jour chaque membre peut lancer 1 assaut contre une famille adverse
// (combat tactique dans le jeu). Étoiles : 1 pour la victoire, +1 si personne n'est mort, +1 si gagné en 3 tours ou moins.
// Butin : une petite part de la réserve adverse (jamais plus de 30 % de ce qu'elle avait au début de la guerre).
const DUREE_GUERRE = 3, JOUR_MS = 24 * 3600 * 1000;
// Ligues (2026-11-10) : chaque clan a des trophées ; une guerre gagnée +30, perdue −20 (jamais sous 0), nulle +5.
// On n'affronte qu'un clan de sa ligue, ou de la ligue juste au-dessus / au-dessous si personne d'autre n'attend.
const LIGUES = [{ nom: "Ferraille", min: 0 }, { nom: "Bronze", min: 100 }, { nom: "Argent", min: 250 }, { nom: "Or", min: 450 }, { nom: "Légende", min: 700 }];
const TROPHEES = { victoire: 30, defaite: -20, nul: 5 };
function ligueDe(t){ let k = 0; LIGUES.forEach((L, i) => { if((t || 0) >= L.min) k = i; }); return k; }
const CADRES_OK = ["bois", "bronze", "argent", "or", "legende"];
const cadreDe = (d) => CADRES_OK.indexOf(String(d.cadre || "")) >= 0 ? String(d.cadre) : "";
function jourGuerre(W){ return Math.floor((Date.now() - W.debut) / JOUR_MS) + 1; }
// ---------- Bots de test (2026-11-10, demande de Fabien) ----------
// Créés et supprimés depuis l'administration. Un bot est un faux joueur (id commençant par « bot », m.bot = true).
// Les clans de bots cherchent toujours une guerre ; pendant une guerre, chaque bot (ennemi ou équipier) lance
// tout seul son assaut de chaque jour, avec des étoiles au hasard.
const PSEUDOS_BOTS = ["Rex_Ranger", "Lili", "MadMax", "Zoé", "Bertrand", "Kader", "Nina", "Tonton", "Jojo", "Sacha", "Hugo", "Lola", "Marius", "Gaby", "Yoyo", "Capu", "Mamie_Ro", "Brico", "Sniper", "Pépé"];
const NOMS_CLANS_BOTS = ["Les Rôdeurs du Sud", "La Horde Grise", "Les Corbeaux", "Bastion de Fer", "Les Survivants du Lac", "La Meute"];
const CADRES_BOTS = ["bois", "bronze", "argent", "or", "legende"];
// Profil d'un membre (2026-11-10) : quelques chiffres envoyés par son jeu, bornés (pas de vraie vérification)
const CHAMPS_PROFIL = { zombies: 1000000, meilleur: 100000, plusLongue: 1000, parties: 100000, succes: 100, etoiles: 100000, victoires: 10000, depots: 1000000, vivants: 4 };
function profilDe(d){ const p = d && d.profil; if(!p || typeof p !== "object") return null; const r = {}; for(const k in CHAMPS_PROFIL){ const v = Math.floor(+p[k]); r[k] = v >= 0 ? Math.min(v, CHAMPS_PROFIL[k]) : 0; } return r; }
function profilBot(jour){ return { zombies: hasardEntier(jour, jour * 4), meilleur: hasardEntier(jour * 2, jour * 4), plusLongue: jour, parties: hasardEntier(1, 30), succes: hasardEntier(3, 22), etoiles: hasardEntier(0, 40), victoires: hasardEntier(0, 8), depots: hasardEntier(0, 200), vivants: hasardEntier(1, 4) }; }
const hasardEntier = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const idBot = () => "bot" + Math.random().toString(36).slice(2, 12);
const estBot = (id) => String(id || "").indexOf("bot") === 0;
function nouveauBot(){ return { id: idBot(), pseudo: PSEUDOS_BOTS[hasardEntier(0, PSEUDOS_BOTS.length - 1)] + hasardEntier(1, 99), jour: hasardEntier(30, 150), vu: Date.now() - hasardEntier(0, 2) * JOUR_MS, rejoint: Date.now(), cadre: CADRES_BOTS[hasardEntier(0, 4)], bot: true, depose: hasardEntier(0, 30), pris: 0 }; }
function etoilesBot(){ const r = Math.random(); return r < 0.25 ? 0 : r < 0.6 ? 1 : r < 0.85 ? 2 : 3; }
// Les bots des deux camps lancent leurs assauts manqués (un par jour écoulé). Renvoie true si quelque chose a changé.
function botsAttaquent(C, W){
  let change = false; const jMax = Math.min(DUREE_GUERRE, jourGuerre(W)), now = Date.now();
  ["a", "b"].forEach((camp) => {
    const nous = C.clans[W[camp]], eux = C.clans[W[camp === "a" ? "b" : "a"]]; if(!nous || !eux) return;
    nous.membres.filter((m) => m.bot).forEach((m) => {
      for(let j = 1; j <= jMax; j++){
        if(W.assauts.some((s) => s.par === m.id && s.jour === j)) continue;
        const libres = eux.membres.filter((c) => !W.assauts.some((s) => s.cible === c.id && s.jour === j && s.fini !== false)), cible = libres.length ? libres[hasardEntier(0, libres.length - 1)] : null;
        if(!cible) continue;
        const etoiles = etoilesBot(), s = { id: "s" + Math.random().toString(36).slice(2, 9), par: m.id, pseudo: m.pseudo, camp, cible: cible.id, ciblePseudo: cible.pseudo, jour: j, fini: true, etoiles, butin: [], t: Math.min(now, W.debut + (j - 1) * JOUR_MS + hasardEntier(1, 20) * 3600 * 1000) };
        W.assauts.push(s); W.etoiles[camp] += etoiles; nous.etoilesTotal = (nous.etoilesTotal || 0) + etoiles;
        if(etoiles){
          bastionDe(eux); const dep = W.depart[camp === "a" ? "b" : "a"] || {}, pris = W.pris[camp];
          Object.keys(eux.reserve).filter((k) => eux.reserve[k] > 0).slice(0, 2).forEach((k) => { const n = Math.min(Math.floor((dep[k] || 0) * 0.3) - (pris[k] || 0), Math.max(1, Math.floor(eux.reserve[k] * 0.05 * etoiles)));
            if(n > 0){ eux.reserve[k] -= n; if(!eux.reserve[k]) delete eux.reserve[k]; pris[k] = (pris[k] || 0) + n; s.butin.push([k, n]); } });
          noter(eux, "⚔️", m.pseudo + " a pillé le bastion (" + etoiles + " ★)");
        }
        change = true;
      }
    });
  });
  return change;
}

function cloreGuerres(C){
  const now = Date.now();
  // Les bots jouent leurs assauts dans les guerres en cours
  for(const wid in C.guerres){ const W = C.guerres[wid]; if(!W.fini && botsAttaquent(C, W)) C._change = true; }
  for(const wid in C.guerres){
    const W = C.guerres[wid]; if(W.fini || now < W.debut + DUREE_GUERRE * JOUR_MS) continue;
    W.fini = true; W.gagnant = W.etoiles.a > W.etoiles.b ? W.a : W.etoiles.b > W.etoiles.a ? W.b : null;
    W.trophees = {};
    ["a", "b"].forEach((camp) => { const c = C.clans[W[camp]]; if(!c) return; const delta = !W.gagnant ? TROPHEES.nul : W.gagnant === c.id ? TROPHEES.victoire : TROPHEES.defaite;
      const avant = c.trophees || 0; c.trophees = Math.max(0, avant + delta); W.trophees[camp] = c.trophees - avant; });
    C._change = true;
    [W.a, W.b].forEach((cid) => { const c = C.clans[cid]; if(!c) return; c.guerre = null; c.historique = [wid].concat(c.historique || []).slice(0, 10);
      if(c.bot && c.membres.length >= MAX_CLAN){ c.recherche = true; if(C.file.indexOf(c.id) < 0) C.file.push(c.id); }
      c.bilan = c.bilan || { gagnees: 0, perdues: 0, nulles: 0 }; if(!W.gagnant) c.bilan.nulles++; else if(W.gagnant === cid) c.bilan.gagnees++; else c.bilan.perdues++; });
  }
  // On ne garde que les 30 dernières guerres terminées
  const finies = Object.keys(C.guerres).filter((w) => C.guerres[w].fini).sort((x, y) => C.guerres[y].debut - C.guerres[x].debut);
  finies.slice(30).forEach((w) => { delete C.guerres[w]; });
}
function vueGuerre(C, W, mon, id){
  const camp = W.a === mon.id ? "a" : "b", adv = C.clans[camp === "a" ? W.b : W.a] || { nom: "?", blason: 1, membres: [], def: {} };
  const j = Math.min(DUREE_GUERRE, jourGuerre(W)), finJour = W.debut + j * JOUR_MS;
  const dejaMoi = W.assauts.some((s) => s.par === id && s.jour === j && s.fini !== false);
  return { id: W.id, jour: j, fini: !!W.fini, gagnant: W.gagnant === mon.id ? "nous" : W.gagnant ? "eux" : null, finJour, fin: W.debut + DUREE_GUERRE * JOUR_MS,
    nous: { nom: mon.nom, blason: mon.blason, etoiles: W.etoiles[camp], trophees: mon.trophees || 0, ligue: ligueDe(mon.trophees) }, eux: { nom: adv.nom, blason: adv.blason, etoiles: W.etoiles[camp === "a" ? "b" : "a"], remparts: (adv.def || {}).remparts || 0, mines: (adv.def || {}).mines || 0, armurerie: (adv.def || {}).armurerie || 0, trophees: adv.trophees || 0, ligue: ligueDe(adv.trophees) },
    gainTrophees: W.trophees ? W.trophees[camp] : null,
    cibles: (adv.membres || []).map((m) => ({ id: m.id, pseudo: m.pseudo, jour: m.jour, attaquee: W.assauts.some((s) => s.cible === m.id && s.jour === j && s.fini !== false) })),
    dejaMoi, assauts: W.assauts.filter((s) => s.fini !== false).slice(-30).reverse().map((s) => ({ t: s.t || 0, jour: s.jour, qui: s.pseudo, cible: s.ciblePseudo, nous: s.camp === camp, etoiles: s.etoiles, butin: s.butin })) };
}

// ---------- Bastion du clan (phase 2) : réserve commune, défenses, journal ----------
// Objets qu'on peut déposer (empilables uniquement) et coût des défenses (payé avec la réserve)
const DEPOSABLES = ["bidon", "bouteille", "conserve", "conserves", "riz", "pates", "biscuits", "barre", "ration", "poisson", "bandage", "trousse", "antibio", "balle", "cartouche", "planche", "ferraille", "clous", "ruban", "chiffon", "alcool", "pile", "jerrican", "canette", "epices", "huile", "farine"];
const RETRAITS_JOUR = 5, CREDIT_RESERVE = 5; // on peut prendre au plus 5 objets de plus que ce qu'on a déposé
const DEFENSES = {
  remparts: { max: 5, cout: (l) => ({ planche: 6 * (l + 1), ferraille: 2 * (l + 1) }) },
  mines:    { max: 10, cout: () => ({ ferraille: 2, clous: 2, alcool: 1 }) },
  tours:    { max: 3, cout: (l) => ({ planche: 8 * (l + 1), clous: 4 * (l + 1) }) },
  armurerie:{ max: 3, cout: (l) => ({ ferraille: 4 * (l + 1), ruban: 2 * (l + 1), chiffon: 2 * (l + 1) }) },
  // Camion du clan (2026-11-10) : servent aux assauts de chaque membre
  parebuffle:{ max: 3, cout: (l) => ({ ferraille: 3 * (l + 1), clous: 3 * (l + 1) }) },
  blindage:  { max: 3, cout: (l) => ({ ferraille: 4 * (l + 1), planche: 3 * (l + 1), ruban: l + 1 }) },
  tourelle:  { max: 3, cout: (l) => ({ ferraille: 5 * (l + 1), clous: 2 * (l + 1), ruban: 2 * (l + 1) }) }
};
function bastionDe(c){ c.reserve = c.reserve || {}; c.def = c.def || {}; for(const k in DEFENSES) c.def[k] = c.def[k] || 0; c.journal = c.journal || []; c.retraits = c.retraits || {}; return c; }
const aujourdhui = () => new Date().toISOString().slice(0, 10);
function noter(c, qui, txt){ c.journal.unshift({ t: Date.now(), qui, txt }); c.journal = c.journal.slice(0, 40); }
function partDe(c, id){ const m = c.membres.find((x) => x.id === id) || {}; return { depose: m.depose || 0, pris: m.pris || 0, credit: (m.depose || 0) + CREDIT_RESERVE - (m.pris || 0) }; }
function etatBastion(c, id){ bastionDe(c); const r = c.retraits[id]; const pris = r && r.jour === aujourdhui() ? r.n : 0;
  const couts = {}; for(const k in DEFENSES){ c.def[k] = c.def[k] || 0; couts[k] = c.def[k] >= DEFENSES[k].max ? null : DEFENSES[k].cout(c.def[k]); }
  return { reserve: c.reserve, def: c.def, couts, max: { remparts: 5, mines: 10, tours: 3, armurerie: 3, parebuffle: 3, blindage: 3, tourelle: 3 }, journal: c.journal.slice(0, 25), retraitsRestants: Math.max(0, Math.min(RETRAITS_JOUR - pris, partDe(c, id).credit)), part: partDe(c, id), deposables: DEPOSABLES }; }

// ---------- Clans : /api/clans (POST) — phase 1 des guerres de clans ----------
// {action:"liste", id}                               -> { jourMin, clans:[résumés], monClan:{détail} | null }
// {action:"creer", id, pseudo, jour, nom, blason}    -> crée un clan (le créateur en est le chef)
// {action:"rejoindre", id, pseudo, jour, clan}       -> rejoint un clan qui a de la place (5 au maximum)
// {action:"quitter", id}                             -> quitte (si le chef part, le plus ancien devient chef ; un clan vide disparaît)
// {action:"exclure", id, cible}                      -> le chef exclut un membre
// Accès à partir du jour `jourMinClan` de sa partie (30 depuis le 2026-11-10, réglable dans l'administration : clé KV « reglages »).
const CLE_CLANS = "clans", CLE_REGLAGES = "reglages", MAX_CLAN = 5, BLASONS_OK = 12;
async function lireClans(env){ const c = (await env.CLASSEMENT.get(CLE_CLANS, { type: "json" })) || {}; c.clans = c.clans || {}; c.parJoueur = c.parJoueur || {}; c.guerres = c.guerres || {}; c.file = c.file || []; cloreGuerres(c); return c; }
async function lireReglages(env){ const r = (await env.CLASSEMENT.get(CLE_REGLAGES, { type: "json" })) || {}; if(!(r.jourMinClan >= 1)) r.jourMinClan = 30; return r; }
const nomPropre = (t, n) => String(t || "").replace(/[^\p{L}\p{N} _\-'.!]/gu, "").replace(/\s+/g, " ").trim().slice(0, n);
function resumeClan(c){ const chef = c.membres.find((m) => m.id === c.chef) || c.membres[0] || {};
  return { id: c.id, nom: c.nom, blason: c.blason, membres: c.membres.length, chef: chef.pseudo || "", jours: c.membres.reduce((t, m) => t + (m.jour || 0), 0), cree: c.cree, trophees: c.trophees || 0, ligue: ligueDe(c.trophees),
    desc: c.desc || "", bilan: c.bilan || null, noms: c.membres.map((m) => ({ pseudo: m.pseudo, cadre: m.cadre || "", chef: m.id === c.chef, jour: m.jour || 0 })) }; }
// Description du clan (2026-11-10) : 200 caractères au plus, écrite par le chef
const DESC_MAX = 200;
function descPropre(t){ return String(t || "").replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, DESC_MAX); }
const DESC_BOTS = ["Clan de test : on défend, on partage, on tient bon.", "Ici on ne laisse personne derrière. Dépose avant de prendre !", "Chasseurs de rôdeurs depuis le premier jour.", "Petit clan tranquille, actif tous les soirs."];
function detailClan(c, moi){ return Object.assign(resumeClan(c), { tours: (c.def && c.def.tours) || 0, enGuerre: !!c.guerre, recherche: !!c.recherche, bilan: c.bilan || null, chefId: c.chef === moi, membresListe: c.membres.map((m) => ({ id: m.id === moi ? "moi" : m.id.slice(0, 6), vrai: m.id, pseudo: m.pseudo, cadre: m.cadre || "", depose: m.depose || 0, pris: m.pris || 0, profil: m.profil || (m.bot ? (m.profil = profilBot(m.jour || 30)) : null), rejoint: m.rejoint || 0, bot: !!m.bot, jour: m.jour, vu: m.vu, chef: m.id === c.chef, moi: m.id === moi })) }); }
async function clansPost(request, env){
  let d; try{ d = await request.json(); }catch(e){ return reponse({ erreur: "données" }, 400); }
  const id = String(d.id || "").replace(/[^a-z0-9]/gi, "").slice(0, 24);
  if(id.length < 8) return reponse({ erreur: "id" }, 400);
  const C = await lireClans(env), R = await lireReglages(env), now = Date.now();
  const sauver = () => env.CLASSEMENT.put(CLE_CLANS, JSON.stringify(C));
  const pseudo = nomPropre(d.pseudo, 16), jour = Math.max(0, Math.min(2000, Math.floor(+d.jour) || 0));
  const monCid = C.parJoueur[id], mon = monCid ? C.clans[monCid] : null;
  if(mon){ const m = mon.membres.find((x) => x.id === id); if(m && (jour || pseudo)){ if(jour) m.jour = jour; if(pseudo) m.pseudo = pseudo; m.vu = now; const cd = cadreDe(d); if(cd) m.cadre = cd; const pf = profilDe(d); if(pf) m.profil = pf; } }
  switch(d.action){
    case "liste": {
      const liste = Object.values(C.clans).map(resumeClan).sort((a, b) => b.jours - a.jours).slice(0, 100);
      if(mon || C._change) await sauver(); // garde la dernière visite du membre (inactivité visible du chef) et les assauts des bots
      return reponse({ jourMin: R.jourMinClan, clans: liste, monClan: mon ? detailClan(mon, id) : null });
    }
    case "creer": {
      if(mon) return reponse({ erreur: "Tu fais déjà partie d’un clan." });
      if(jour < R.jourMinClan) return reponse({ erreur: "Il faut avoir tenu " + R.jourMinClan + " jours pour fonder un clan." });
      if(!pseudo) return reponse({ erreur: "Choisis d’abord un pseudo." });
      const nom = nomPropre(d.nom, 20); if(nom.length < 3) return reponse({ erreur: "Le nom du clan doit faire au moins 3 lettres." });
      if(Object.values(C.clans).some((c) => c.nom.toLowerCase() === nom.toLowerCase())) return reponse({ erreur: "Ce nom de clan est déjà pris." });
      const blason = Math.max(1, Math.min(BLASONS_OK, Math.floor(+d.blason) || 1));
      let cid; do{ cid = "c" + Math.random().toString(36).slice(2, 9); }while(C.clans[cid]);
      C.clans[cid] = { id: cid, nom, blason, chef: id, cree: now, membres: [{ id, pseudo, jour, vu: now, rejoint: now, cadre: cadreDe(d) }] };
      C.parJoueur[id] = cid; await sauver();
      return reponse({ ok: true, monClan: detailClan(C.clans[cid], id) });
    }
    case "rejoindre": {
      if(mon) return reponse({ erreur: "Tu fais déjà partie d’un clan." });
      if(jour < R.jourMinClan) return reponse({ erreur: "Il faut avoir tenu " + R.jourMinClan + " jours pour rejoindre un clan." });
      if(!pseudo) return reponse({ erreur: "Choisis d’abord un pseudo." });
      const c = C.clans[String(d.clan || "")]; if(!c) return reponse({ erreur: "Ce clan n’existe plus." });
      if(c.membres.length >= MAX_CLAN) return reponse({ erreur: "Ce clan est complet (" + MAX_CLAN + " familles)." });
      c.membres.push({ id, pseudo, jour, vu: now, rejoint: now, cadre: cadreDe(d) }); C.parJoueur[id] = c.id; await sauver();
      return reponse({ ok: true, monClan: detailClan(c, id) });
    }
    case "quitter": {
      if(!mon) return reponse({ erreur: "Tu n’as pas de clan." });
      bastionDe(mon);
      if(d.raison === "mort") noter(mon, "💀", "La famille de " + (pseudo || "?") + " est tombée" + (jour ? " au jour " + jour : "") + ". Le clan perd une famille.");
      else noter(mon, "🚪", (pseudo || "?") + " a quitté le clan.");
      mon.membres = mon.membres.filter((m) => m.id !== id); delete C.parJoueur[id];
      if(!mon.membres.length) delete C.clans[mon.id];
      else if(mon.chef === id) mon.chef = mon.membres.slice().sort((a, b) => a.rejoint - b.rejoint)[0].id;
      await sauver(); return reponse({ ok: true });
    }
    case "bastion": {
      if(!mon) return reponse({ erreur: "Tu n’as pas de clan." });
      await sauver(); return reponse({ ok: true, bastion: etatBastion(mon, id) });
    }
    case "deposer": {
      if(!mon) return reponse({ erreur: "Tu n’as pas de clan." });
      bastionDe(mon); const o = d.objets || {}, liste = [];
      const moi = mon.membres.find((x) => x.id === id);
      for(const k in o){ const n = Math.floor(+o[k]); if(DEPOSABLES.indexOf(k) < 0 || !(n >= 1 && n <= 500)) continue; mon.reserve[k] = (mon.reserve[k] || 0) + n; liste.push(n + " " + k); if(moi) moi.depose = (moi.depose || 0) + n; }
      if(!liste.length) return reponse({ erreur: "Rien à déposer." });
      noter(mon, pseudo || "?", "a déposé " + liste.join(", ")); await sauver();
      return reponse({ ok: true, bastion: etatBastion(mon, id) });
    }
    case "retirer": {
      if(!mon) return reponse({ erreur: "Tu n’as pas de clan." });
      bastionDe(mon); const k = String(d.objet || ""), n = Math.floor(+d.n) || 1;
      const r = mon.retraits[id] && mon.retraits[id].jour === aujourdhui() ? mon.retraits[id] : { jour: aujourdhui(), n: 0 };
      if(r.n + n > RETRAITS_JOUR) return reponse({ erreur: "Tu as déjà pris " + r.n + " objets aujourd’hui (" + RETRAITS_JOUR + " au maximum par jour)." });
      if(!(mon.reserve[k] >= n)) return reponse({ erreur: "Il n’y en a plus assez dans la réserve." });
      if(partDe(mon, id).credit < n) return reponse({ erreur: "Tu as déjà pris " + CREDIT_RESERVE + " objets de plus que ce que tu as déposé : dépose d’abord quelque chose dans la réserve." });
      const moiR = mon.membres.find((x) => x.id === id); if(moiR) moiR.pris = (moiR.pris || 0) + n;
      mon.reserve[k] -= n; if(!mon.reserve[k]) delete mon.reserve[k];
      r.n += n; mon.retraits[id] = r; noter(mon, pseudo || "?", "a pris " + n + " " + k); await sauver();
      return reponse({ ok: true, objet: k, n, bastion: etatBastion(mon, id) });
    }
    case "construire": {
      if(!mon) return reponse({ erreur: "Tu n’as pas de clan." });
      bastionDe(mon); const k = String(d.def || ""), D = DEFENSES[k];
      if(!D) return reponse({ erreur: "défense" }, 400);
      if(mon.def[k] >= D.max) return reponse({ erreur: "Niveau maximum atteint." });
      const cout = D.cout(mon.def[k]);
      for(const m in cout) if(!(mon.reserve[m] >= cout[m])) return reponse({ erreur: "Il manque des matériaux dans la réserve." });
      for(const m in cout){ mon.reserve[m] -= cout[m]; if(!mon.reserve[m]) delete mon.reserve[m]; }
      mon.def[k]++; noter(mon, pseudo || "?", "a construit : " + k + " (niveau " + mon.def[k] + ")"); await sauver();
      return reponse({ ok: true, bastion: etatBastion(mon, id) });
    }
    case "classementClans": {
      const tous = Object.values(C.clans).map((c) => { const b = c.bilan || { gagnees: 0, perdues: 0, nulles: 0 };
        return Object.assign(resumeClan(c), { gagnees: b.gagnees, perdues: b.perdues, nulles: b.nulles, etoiles: c.etoilesTotal || 0, moi: !!mon && mon.id === c.id }); })
        .sort((x, y) => y.trophees - x.trophees || y.gagnees - x.gagnees || y.etoiles - x.etoiles);
      const k = mon ? tous.findIndex((c) => c.id === mon.id) : -1;
      return reponse({ clans: tous.slice(0, 50), monRang: k >= 0 ? k + 1 : null, total: tous.length });
    }
    case "guerre": {
      if(!mon) return reponse({ erreur: "Tu n’as pas de clan." });
      const W = mon.guerre ? C.guerres[mon.guerre] : null;
      if(C._change) await sauver();
      return reponse({ ok: true, complet: mon.membres.length >= MAX_CLAN, chef: mon.chef === id, recherche: !!mon.recherche, bilan: mon.bilan || null,
        guerre: W ? vueGuerre(C, W, mon, id) : null,
        derniere: !W && mon.historique && C.guerres[mon.historique[0]] ? vueGuerre(C, C.guerres[mon.historique[0]], mon, id) : null });
    }
    case "chercherGuerre": {
      if(!mon) return reponse({ erreur: "Tu n’as pas de clan." });
      if(mon.chef !== id) return reponse({ erreur: "Seul le chef peut lancer une guerre." });
      if(mon.membres.length < MAX_CLAN) return reponse({ erreur: "Il faut " + MAX_CLAN + " familles dans le clan pour partir en guerre." });
      if(mon.guerre) return reponse({ erreur: "Le clan est déjà en guerre." });
      C.file = C.file.filter((cid) => C.clans[cid] && C.clans[cid].recherche && !C.clans[cid].guerre && C.clans[cid].membres.length >= MAX_CLAN && cid !== mon.id);
      // Adversaire de la même ligue de préférence, sinon de la ligue voisine ; le plus proche en trophées
      const maLigue = ligueDe(mon.trophees);
      const candidats = C.file.filter((cid) => Math.abs(ligueDe(C.clans[cid].trophees) - maLigue) <= 1)
        .sort((x, y) => Math.abs(ligueDe(C.clans[x].trophees) - maLigue) - Math.abs(ligueDe(C.clans[y].trophees) - maLigue) || Math.abs((C.clans[x].trophees || 0) - (mon.trophees || 0)) - Math.abs((C.clans[y].trophees || 0) - (mon.trophees || 0)));
      if(candidats.length){
        C.file = C.file.filter((cid) => cid !== candidats[0]);
        const autre = C.clans[candidats[0]], wid = "w" + Math.random().toString(36).slice(2, 9);
        C.guerres[wid] = { id: wid, a: autre.id, b: mon.id, debut: now, etoiles: { a: 0, b: 0 }, assauts: [], pris: { a: {}, b: {} }, depart: { a: Object.assign({}, autre.reserve || {}), b: Object.assign({}, mon.reserve || {}) } };
        autre.guerre = mon.guerre = wid; autre.recherche = mon.recherche = false;
        noter(bastionDe(autre), "⚔️", "La guerre contre « " + mon.nom + " » commence !"); noter(bastionDe(mon), "⚔️", "La guerre contre « " + autre.nom + " » commence !");
        await sauver(); return reponse({ ok: true, debut: true });
      }
      mon.recherche = true; C.file.push(mon.id); await sauver();
      return reponse({ ok: true, attente: true });
    }
    case "annulerRecherche": {
      if(!mon || mon.chef !== id) return reponse({ erreur: "Seul le chef peut annuler." });
      mon.recherche = false; C.file = C.file.filter((cid) => cid !== mon.id); await sauver(); return reponse({ ok: true });
    }
    case "debutAssaut": {
      if(!mon || !mon.guerre) return reponse({ erreur: "Ton clan n’est pas en guerre." });
      const W = C.guerres[mon.guerre], j = jourGuerre(W); if(W.fini || j > DUREE_GUERRE) return reponse({ erreur: "La guerre est terminée." });
      const camp = W.a === mon.id ? "a" : "b", adv = C.clans[camp === "a" ? W.b : W.a];
      if(!adv) return reponse({ erreur: "Le clan adverse n’existe plus." });
      if(W.assauts.some((s) => s.par === id && s.jour === j && s.fini !== false)) return reponse({ erreur: "Tu as déjà lancé ton assaut aujourd’hui. Reviens demain !" });
      const cible = adv.membres.find((m) => m.id === String(d.cible || "")); if(!cible) return reponse({ erreur: "Cette famille n’est plus dans le clan adverse." });
      if(W.assauts.some((s) => s.cible === cible.id && s.jour === j && s.fini !== false)) return reponse({ erreur: "Cette famille a déjà été attaquée aujourd’hui." });
      bastionDe(mon); bastionDe(adv); const mines = Math.min(3, adv.def.mines || 0); adv.def.mines -= mines;
      W.assauts = W.assauts.filter((s) => !(s.par === id && s.fini === false)); // un assaut abandonné ne compte pas
      const sid = "s" + Math.random().toString(36).slice(2, 9);
      W.assauts.push({ id: sid, par: id, pseudo, camp, cible: cible.id, ciblePseudo: cible.pseudo, jour: j, fini: false, etoiles: 0, butin: [] });
      if(mines) noter(adv, "💣", mines + " mine" + (mines > 1 ? "s ont" : " a") + " explosé sous les pieds de " + (pseudo || "?"));
      await sauver();
      return reponse({ ok: true, assaut: sid, clan: adv.nom, cible: cible.pseudo, jourCible: cible.jour || 30, remparts: adv.def.remparts || 0, armurerie: adv.def.armurerie || 0, mines, camion: { parebuffle: mon.def.parebuffle || 0, blindage: mon.def.blindage || 0, tourelle: mon.def.tourelle || 0 } });
    }
    case "finAssaut": {
      if(!mon || !mon.guerre) return reponse({ erreur: "Ton clan n’est pas en guerre." });
      const W = C.guerres[mon.guerre], s = W.assauts.find((x) => x.id === String(d.assaut || "") && x.par === id && x.fini === false);
      if(!s) return reponse({ erreur: "Assaut introuvable." });
      const camp = s.camp, adv = bastionDe(C.clans[camp === "a" ? W.b : W.a] || { reserve: {} });
      s.fini = true; s.etoiles = d.victoire ? Math.max(1, Math.min(3, Math.floor(+d.etoiles) || 1)) : 0;
      // On garde la meilleure attaque par cible et par jour : seules les étoiles en plus comptent
      W.etoiles[camp] += s.etoiles; s.t = now; mon.etoilesTotal = (mon.etoilesTotal || 0) + s.etoiles;
      if(s.etoiles){
        const dep = W.depart[camp === "a" ? "b" : "a"] || {}, pris = W.pris[camp];
        const ids = Object.keys(adv.reserve).filter((k) => adv.reserve[k] > 0).sort((x, y) => adv.reserve[y] - adv.reserve[x]).slice(0, 3);
        ids.forEach((k) => { const plafond = Math.floor((dep[k] || 0) * 0.3) - (pris[k] || 0); const n = Math.min(plafond, Math.max(1, Math.floor(adv.reserve[k] * 0.05 * s.etoiles)));
          if(n > 0){ adv.reserve[k] -= n; if(!adv.reserve[k]) delete adv.reserve[k]; pris[k] = (pris[k] || 0) + n; s.butin.push([k, n]); } });
        noter(adv, "⚔️", (pseudo || "?") + " a pillé le bastion (" + s.etoiles + " ★)");
      }
      noter(bastionDe(mon), "⚔️", (pseudo || "?") + " a attaqué " + s.ciblePseudo + " : " + (s.etoiles ? s.etoiles + " ★" : "repoussé"));
      await sauver();
      return reponse({ ok: true, etoiles: s.etoiles, butin: s.butin, guerre: vueGuerre(C, W, mon, id) });
    }
    case "description": {
      if(!mon || mon.chef !== id) return reponse({ erreur: "Seul le chef du clan peut changer la description." });
      mon.desc = descPropre(d.desc); await sauver(); return reponse({ ok: true, monClan: detailClan(mon, id) });
    }
    case "exclure": {
      if(!mon || mon.chef !== id) return reponse({ erreur: "Seul le chef du clan peut exclure un membre." });
      const cible = String(d.cible || ""); if(cible === id) return reponse({ erreur: "Pour partir, utilise « Quitter le clan »." });
      if(!mon.membres.some((m) => m.id === cible)) return reponse({ erreur: "Ce membre n’est plus dans le clan." });
      mon.membres = mon.membres.filter((m) => m.id !== cible); delete C.parJoueur[cible];
      await sauver(); return reponse({ ok: true, monClan: detailClan(mon, id) });
    }
  }
  return reponse({ erreur: "action" }, 400);
}

// ---------- Administration : /api/admin (POST, réservé à Fabien) ----------
// Le mot de passe est un « secret » Cloudflare nommé ADMIN_MDP, choisi et saisi par Fabien dans le tableau de bord
// Cloudflare (il n'est écrit nulle part dans le code). Chaque demande l'envoie dans l'en-tête Authorization (HTTPS).
// Protection contre les essais au hasard : après 5 mauvais mots de passe, l'adresse est bloquée 15 minutes.
// Pas d'en-tête CORS : seule la page admin.html du site peut appeler ces routes depuis un navigateur.
const ENTETES_ADMIN = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
const repAdmin = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: ENTETES_ADMIN });
async function empreinte(t){ return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(t)))); }
async function memeMdp(a, b){ const x = await empreinte(a), y = await empreinte(b); let d = 0; for(let i = 0; i < x.length; i++) d |= x[i] ^ y[i]; return d === 0; }
// Mot de passe PROVISOIRE (demande de Fabien, 2026-11-09, en attendant son propre hébergeur) : utilisé tant que le
// secret ADMIN_MDP n'existe pas. À remplacer avant une vraie sortie : n'importe qui peut deviner « 123456 ».
const MDP_PROVISOIRE = "123456";
async function adminPost(request, env){
  const mdpAdmin = env.ADMIN_MDP || MDP_PROVISOIRE;
  const ip = request.headers.get("CF-Connecting-IP") || "inconnue", cleEchecs = "admin_echecs_" + ip;
  const echecs = +(await env.CLASSEMENT.get(cleEchecs)) || 0;
  if(echecs >= 5) return repAdmin({ erreur: "Trop d’essais. Réessaie dans 15 minutes." }, 429);
  const mdp = (request.headers.get("Authorization") || "").replace(/^Bearer /, "");
  if(!mdp || !(await memeMdp(mdp, mdpAdmin))){
    await env.CLASSEMENT.put(cleEchecs, String(echecs + 1), { expirationTtl: 900 });
    return repAdmin({ erreur: "Mot de passe incorrect." }, 401);
  }
  let d; try{ d = await request.json(); }catch(e){ return repAdmin({ erreur: "données" }, 400); }
  const now = Date.now(), JOUR = 24 * 3600 * 1000;
  const monde = await lireMonde(env), liste = await lireListe(env), parr = await lireParr(env);
  const ecrireMonde = () => env.CLASSEMENT.put(CLE_MONDE, JSON.stringify(monde));
  const ecrireListe = () => env.CLASSEMENT.put(CLE, JSON.stringify(liste));
  const ecrireParr = () => env.CLASSEMENT.put(CLE_PARR, JSON.stringify(parr));
  const joueurs = () => Object.keys(monde.j).map((id) => { const e = monde.j[id], s = liste.find((x) => x.id === id);
    return { id, pseudo: e.n || (s && s.pseudo) || "", vivants: e.v, jour: e.d, morts: e.m || 0, zombies: e.z || 0, parties: e.p || 0, vu: e.t, score: s ? s.score : null, code: parr.parId[id] || null, filleuls: parr.parId[id] && parr.codes[parr.parId[id]] ? parr.codes[parr.parId[id]].n : 0 }; })
    .sort((a, b) => b.vu - a.vu);
  switch(d.action){
    case "resume": {
      const js = joueurs();
      return repAdmin({ joueurs: js.length, actifs24h: js.filter((j) => now - j.vu < JOUR).length, actifs7j: js.filter((j) => now - j.vu < 7 * JOUR).length,
        enPartie: js.filter((j) => j.vivants > 0 && now - j.vu < 3 * JOUR).length, survivants: js.filter((j) => now - j.vu < 3 * JOUR).reduce((t, j) => t + j.vivants, 0),
        morts: js.reduce((t, j) => t + j.morts, 0), zombies: js.reduce((t, j) => t + j.zombies, 0), parties: js.reduce((t, j) => t + j.parties, 0),
        classement: liste.length, codes: Object.keys(parr.codes).length, parrainages: Object.keys(parr.utilises).length,
        speciaux: Object.keys(parr.speciaux).map((c) => ({ code: c, actif: !!parr.speciaux[c].actif, n: parr.speciaux[c].n || 0 })),
        tombes: monde.tombes || [] });
    }
    case "joueurs": return repAdmin({ joueurs: joueurs().slice(0, 500) });
    case "classement": return repAdmin({ scores: liste.slice(0, 200) });
    case "supprimerJoueur": {
      const id = String(d.id || ""); if(!id) return repAdmin({ erreur: "id" }, 400);
      delete monde.j[id]; const k = liste.findIndex((e) => e.id === id); if(k >= 0) liste.splice(k, 1);
      await ecrireMonde(); if(k >= 0) await ecrireListe();
      return repAdmin({ ok: true });
    }
    case "supprimerScore": {
      const k = liste.findIndex((e) => e.id === String(d.id || "")); if(k < 0) return repAdmin({ erreur: "introuvable" }, 404);
      liste.splice(k, 1); await ecrireListe(); return repAdmin({ ok: true });
    }
    case "clans": {
      const C = await lireClans(env), R = await lireReglages(env);
      if(C._change) await env.CLASSEMENT.put(CLE_CLANS, JSON.stringify(C));
      return repAdmin({ jourMin: R.jourMinClan, clans: Object.values(C.clans).map((c) => Object.assign(resumeClan(c), { bot: !!c.bot, bots: c.membres.filter((m) => m.bot).length, enGuerre: !!c.guerre, recherche: !!c.recherche, liste: c.membres.map((m) => (m.bot ? "🤖 " : "") + m.pseudo + " (j" + m.jour + ")").join(", ") })) });
    }
    case "botsCreer": {
      const C = await lireClans(env), n = Math.max(1, Math.min(3, Math.floor(+d.clans) || 1)), now2 = Date.now(), noms = [];
      for(let k = 0; k < n; k++){
        let cid; do{ cid = "c" + Math.random().toString(36).slice(2, 9); }while(C.clans[cid]);
        let nom = NOMS_CLANS_BOTS[hasardEntier(0, NOMS_CLANS_BOTS.length - 1)]; while(Object.values(C.clans).some((c) => c.nom === nom)) nom = nom.replace(/ \d+$/, "") + " " + hasardEntier(2, 99);
        const membres = []; for(let j = 0; j < MAX_CLAN; j++){ const b = nouveauBot(); membres.push(b); C.parJoueur[b.id] = cid; }
        C.clans[cid] = { id: cid, nom, blason: hasardEntier(1, 12), chef: membres[0].id, cree: now2, membres, bot: true, desc: DESC_BOTS[hasardEntier(0, DESC_BOTS.length - 1)], recherche: true, trophees: Math.max(0, Math.floor(+d.trophees) >= 0 && d.trophees !== undefined && d.trophees !== "" ? Math.floor(+d.trophees) : hasardEntier(0, 300)),
          reserve: { planche: hasardEntier(20, 60), conserve: hasardEntier(5, 20), bidon: hasardEntier(1, 5), ferraille: hasardEntier(4, 15), clous: hasardEntier(4, 15), balle: hasardEntier(0, 20) },
          def: { remparts: hasardEntier(0, 3), mines: hasardEntier(0, 5), tours: hasardEntier(0, 2), armurerie: hasardEntier(0, 2), parebuffle: hasardEntier(0, 2), blindage: hasardEntier(0, 2), tourelle: hasardEntier(0, 2) }, journal: [], retraits: {} };
        C.file.push(cid); noms.push(nom);
      }
      await env.CLASSEMENT.put(CLE_CLANS, JSON.stringify(C));
      // Les bots apparaissent aussi au classement général (pour voir leurs cadres)
      const L = await lireListe(env);
      Object.values(C.clans).filter((c) => c.bot).forEach((c) => c.membres.forEach((m) => { if(!L.some((e) => e.id === m.id)){ const j = m.jour; L.push({ id: m.id, pseudo: m.pseudo, score: hasardEntier(j, j * 3), jours: j, cadre: m.cadre }); } }));
      L.sort((a, b) => b.score - a.score || a.jours - b.jours); await env.CLASSEMENT.put(CLE, JSON.stringify(L.slice(0, GARDES)));
      return repAdmin({ ok: true, noms });
    }
    case "clanTrophees": {
      const C = await lireClans(env), c = C.clans[String(d.clan || "")], t = Math.floor(+d.trophees);
      if(!c) return repAdmin({ erreur: "introuvable" }, 404);
      if(!(t >= 0 && t <= 5000)) return repAdmin({ erreur: "Entre 0 et 5000." }, 400);
      c.trophees = t; await env.CLASSEMENT.put(CLE_CLANS, JSON.stringify(C)); return repAdmin({ ok: true });
    }
    case "botsCompleter": {
      const C = await lireClans(env), c = C.clans[String(d.clan || "")];
      if(!c) return repAdmin({ erreur: "introuvable" }, 404);
      let ajoutes = 0; while(c.membres.length < MAX_CLAN){ const b = nouveauBot(); c.membres.push(b); C.parJoueur[b.id] = c.id; ajoutes++; }
      bastionDe(c); noter(c, "🤖", ajoutes + " bot" + (ajoutes > 1 ? "s ont" : " a") + " rejoint le clan (test).");
      await env.CLASSEMENT.put(CLE_CLANS, JSON.stringify(C));
      return repAdmin({ ok: true, ajoutes });
    }
    case "botsSupprimer": {
      const C = await lireClans(env); let nb = 0;
      // Guerres avec un clan de bots : effacées, l'autre clan est libéré
      for(const wid in C.guerres){ const W = C.guerres[wid], A = C.clans[W.a], B = C.clans[W.b];
        if((A && A.bot) || (B && B.bot)){ [A, B].forEach((c) => { if(c && c.guerre === wid) c.guerre = null; }); delete C.guerres[wid]; } }
      for(const cid in C.clans){
        const c = C.clans[cid], bots = c.membres.filter((m) => m.bot || estBot(m.id));
        bots.forEach((m) => { delete C.parJoueur[m.id]; nb++; });
        c.membres = c.membres.filter((m) => !(m.bot || estBot(m.id)));
        if(!c.membres.length || c.bot){ c.membres.forEach((m) => { delete C.parJoueur[m.id]; }); delete C.clans[cid]; continue; }
        if(!c.membres.some((m) => m.id === c.chef)) c.chef = c.membres.slice().sort((a, b) => a.rejoint - b.rejoint)[0].id;
        // une guerre en cours où des bots attaquaient : leurs assauts restent comptés
      }
      C.file = C.file.filter((cid) => C.clans[cid]);
      await env.CLASSEMENT.put(CLE_CLANS, JSON.stringify(C));
      const L = await lireListe(env), L2 = L.filter((e) => !estBot(e.id)); if(L2.length !== L.length) await env.CLASSEMENT.put(CLE, JSON.stringify(L2));
      return repAdmin({ ok: true, supprimes: nb });
    }
    case "reglageJourClan": {
      const R = await lireReglages(env), j = Math.floor(+d.jour);
      if(!(j >= 1 && j <= 1000)) return repAdmin({ erreur: "Entre 1 et 1000 jours." }, 400);
      R.jourMinClan = j; await env.CLASSEMENT.put(CLE_REGLAGES, JSON.stringify(R)); return repAdmin({ ok: true });
    }
    case "clanSupprimer": {
      const C = await lireClans(env), c = C.clans[String(d.clan || "")]; if(!c) return repAdmin({ erreur: "introuvable" }, 404);
      c.membres.forEach((m) => { delete C.parJoueur[m.id]; }); delete C.clans[c.id];
      await env.CLASSEMENT.put(CLE_CLANS, JSON.stringify(C)); return repAdmin({ ok: true });
    }
    case "codeCreer": {
      const c = normCode(d.code); if(c.length < 3) return repAdmin({ erreur: "Code trop court (3 caractères au moins)." }, 400);
      if(parr.speciaux[c] || parr.codes[c]) return repAdmin({ erreur: "Ce code existe déjà." }, 400);
      parr.speciaux[c] = { actif: true, n: 0 }; await ecrireParr(); return repAdmin({ ok: true });
    }
    case "codeBasculer": { const c = normCode(d.code); if(!parr.speciaux[c]) return repAdmin({ erreur: "introuvable" }, 404); parr.speciaux[c].actif = !parr.speciaux[c].actif; await ecrireParr(); return repAdmin({ ok: true }); }
    case "codeSupprimer": { const c = normCode(d.code); if(!parr.speciaux[c]) return repAdmin({ erreur: "introuvable" }, 404); delete parr.speciaux[c]; await ecrireParr(); return repAdmin({ ok: true }); }
  }
  return repAdmin({ erreur: "action" }, 400);
}

// Point d'entrée : /api/classement -> le classement ; /api/monde -> les chiffres du monde ; tout le reste -> les fichiers du jeu
export default {
  async fetch(request, env){
    const url = new URL(request.url);
    if(url.pathname === "/api/classement"){
      if(request.method === "OPTIONS") return onRequestOptions();
      if(request.method === "GET") return onRequestGet({ request, env });
      if(request.method === "POST") return onRequestPost({ request, env });
      return reponse({ erreur: "méthode" }, 405);
    }
    if(url.pathname === "/api/admin"){
      if(!env.CLASSEMENT) return repAdmin({ erreur: "stockage non relié (CLASSEMENT)" }, 500);
      if(request.method === "POST") return adminPost(request, env);
      return repAdmin({ erreur: "méthode" }, 405);
    }
    if(url.pathname === "/api/clans"){
      if(!env.CLASSEMENT) return reponse({ erreur: "stockage non relié (CLASSEMENT)" }, 500);
      if(request.method === "OPTIONS") return onRequestOptions();
      if(request.method === "POST") return clansPost(request, env);
      return reponse({ erreur: "méthode" }, 405);
    }
    if(url.pathname === "/api/parrainage"){
      if(!env.CLASSEMENT) return reponse({ erreur: "stockage non relié (CLASSEMENT)" }, 500);
      if(request.method === "OPTIONS") return onRequestOptions();
      if(request.method === "POST") return parrainagePost(request, env);
      return reponse({ erreur: "méthode" }, 405);
    }
    if(url.pathname === "/api/monde"){
      if(!env.CLASSEMENT) return reponse({ erreur: "stockage non relié (CLASSEMENT)" }, 500);
      if(request.method === "OPTIONS") return onRequestOptions();
      if(request.method === "GET") return mondeGet(env);
      if(request.method === "POST") return mondePost(request, env);
      return reponse({ erreur: "méthode" }, 405);
    }
    return env.ASSETS.fetch(request);
  }
};
