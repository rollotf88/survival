// Classement général (serveur Netlify, gratuit) : le meilleur score de chaque joueur, toutes parties.
// GET  /api/classement?id=...  -> les 50 meilleurs + la place du joueur
// POST /api/classement {id, pseudo, score, jours} -> enregistre (garde le meilleur score par appareil)
import { getStore } from "@netlify/blobs";

const ENTETES = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json; charset=utf-8" };
const reponse = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: ENTETES });
const CLE = "general", GARDES = 1000;

export default async (req) => {
  if(req.method === "OPTIONS") return new Response("", { headers: ENTETES });
  const store = getStore({ name: "classement", consistency: "strong" }); // lecture immédiate de ce qui vient d’être écrit
  if(req.method === "GET"){
    const moi = new URL(req.url).searchParams.get("id") || "";
    const liste = (await store.get(CLE, { type: "json" })) || [];
    const k = moi ? liste.findIndex((e) => e.id === moi) : -1;
    return reponse({
      total: liste.length,
      scores: liste.slice(0, 50).map(({ pseudo, score, jours, id }) => ({ pseudo, score, jours, moi: !!moi && id === moi })),
      monRang: k >= 0 ? k + 1 : null, moi: k >= 0 ? { pseudo: liste[k].pseudo, score: liste[k].score, jours: liste[k].jours } : null
    });
  }
  if(req.method !== "POST") return reponse({ erreur: "méthode" }, 405);
  let d; try{ d = await req.json(); }catch(e){ return reponse({ erreur: "données" }, 400); }
  const score = Math.floor(+d.score), jours = Math.floor(+d.jours);
  const pseudo = String(d.pseudo || "").replace(/[^\p{L}\p{N} _\-'.]/gu, "").trim().slice(0, 16);
  const id = String(d.id || "").replace(/[^a-z0-9]/gi, "").slice(0, 24);
  // Vérifications simples : un score impossible est refusé (au plus 4 points par jour tenu)
  if(!pseudo || id.length < 8 || !(jours >= 0 && jours <= 400) || !(score >= 0 && score <= jours * 4))
    return reponse({ erreur: "score refusé" }, 400);
  const liste = (await store.get(CLE, { type: "json" })) || [];
  const ancien = liste.find((e) => e.id === id);
  let record = true;
  if(ancien){ if(score > ancien.score){ ancien.score = score; ancien.jours = jours; } else record = false; ancien.pseudo = pseudo; }
  else liste.push({ id, pseudo, score, jours });
  liste.sort((a, b) => b.score - a.score || a.jours - b.jours);
  const garde = liste.slice(0, GARDES);
  await store.setJSON(CLE, garde);
  const rang = garde.findIndex((e) => e.id === id) + 1;
  return reponse({ ok: true, rang, total: garde.length, record, meilleur: ancien ? ancien.score : score });
};

export const config = { path: "/api/classement" };
