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
    scores: liste.slice(0, 50).map(({ pseudo, score, jours, id }) => ({ pseudo, score, jours, moi: !!moi && id === moi })),
    monRang: k >= 0 ? k + 1 : null, moi: k >= 0 ? { pseudo: liste[k].pseudo, score: liste[k].score, jours: liste[k].jours } : null
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
  if(ancien){ if(score > ancien.score){ ancien.score = score; ancien.jours = jours; } else record = false; ancien.pseudo = pseudo; }
  else liste.push({ id, pseudo, score, jours });
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
