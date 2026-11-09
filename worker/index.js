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
