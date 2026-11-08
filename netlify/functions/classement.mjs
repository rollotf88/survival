// Classement de la Partie du jour (serveur Netlify, gratuit).
// GET  /api/classement?jour=AAAAMMJJ  -> les 50 meilleurs scores de ce jour
// POST /api/classement {jour, id, pseudo, score, jours} -> enregistre (garde le meilleur score par appareil)
import { getStore } from "@netlify/blobs";

const ENTETES = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json; charset=utf-8" };
const reponse = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: ENTETES });

// Graine du jour d'une date (comme dans le jeu)
const graine = (d) => d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
// Une partie du jour peut se terminer quelques jours plus tard : on accepte les 7 derniers jours
function jourValide(j){
  const maintenant = Date.now();
  for(let k = -1; k <= 7; k++) if(graine(new Date(maintenant - k * 86400000)) === j) return true;
  return false;
}

export default async (req) => {
  if(req.method === "OPTIONS") return new Response("", { headers: ENTETES });
  const store = getStore({ name: "classement", consistency: "strong" }); // lecture immédiate de ce qui vient d’être écrit
  if(req.method === "GET"){
    const params = new URL(req.url).searchParams, jour = +params.get("jour"), moi = params.get("id") || "";
    if(!/^\d{8}$/.test(String(jour))) return reponse({ erreur: "jour invalide" }, 400);
    const liste = (await store.get(String(jour), { type: "json" })) || [];
    return reponse({ jour, scores: liste.slice(0, 50).map(({ pseudo, score, jours, id }) => ({ pseudo, score, jours, moi: !!moi && id === moi })) });
  }
  if(req.method !== "POST") return reponse({ erreur: "méthode" }, 405);
  let d; try{ d = await req.json(); }catch(e){ return reponse({ erreur: "données" }, 400); }
  const jour = +d.jour, score = Math.floor(+d.score), jours = Math.floor(+d.jours);
  const pseudo = String(d.pseudo || "").replace(/[^\p{L}\p{N} _\-'.]/gu, "").trim().slice(0, 16);
  const id = String(d.id || "").replace(/[^a-z0-9]/gi, "").slice(0, 24);
  // Vérifications simples : un score impossible est refusé (au plus 4 points par jour tenu)
  if(!jourValide(jour) || !pseudo || id.length < 8 || !(jours >= 0 && jours <= 400) || !(score >= 0 && score <= jours * 4))
    return reponse({ erreur: "score refusé" }, 400);
  const cle = String(jour);
  const liste = (await store.get(cle, { type: "json" })) || [];
  const ancien = liste.find((e) => e.id === id);
  if(ancien){ if(score > ancien.score){ ancien.score = score; ancien.jours = jours; } ancien.pseudo = pseudo; }
  else liste.push({ id, pseudo, score, jours });
  liste.sort((a, b) => b.score - a.score || a.jours - b.jours);
  const garde = liste.slice(0, 200);
  await store.setJSON(cle, garde);
  const rang = garde.findIndex((e) => e.id === id) + 1;
  return reponse({ ok: true, rang, total: garde.length });
};

export const config = { path: "/api/classement" };
