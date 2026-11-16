/* =====================================================================
   COMPTES JOUEURS (2026-11-16) : connexion avec Google, partie enregistrée sur le serveur et reprise sur un autre appareil.
   POST /api/compte, actions :
     connexion  {credential (jeton Google), id (identifiant de l'appareil)}  → {jeton, idJoueur, nom, sauvegarde:{t, jour, appareil}|null}
     sauver     {jeton, donnees:{clé:valeur}, jour}                           → {ok, t}
     charger    {jeton}                                                       → {donnees, t, jour}
     deconnexion{jeton}
     supprimer  {jeton}                                                       → compte et sauvegarde effacés
   Ce qui est gardé : l'identifiant Google (un numéro, pas l'adresse e-mail), le prénom affiché par Google, l'identifiant
   de joueur du jeu, la date de création, la sauvegarde (clés « survival_… » du navigateur) et le jeton de la session en cours.
   Une seule session à la fois : se connecter ailleurs rend l'ancien jeton invalide (l'autre appareil le voit au prochain envoi).
   Clés KV : « compte_<sub> » (le compte), « jeton_<jeton> » (sub du compte). Identifiant client Google : reglages.json
   (GOOGLE_CLIENT_ID) ou réglage par défaut ci-dessous.
   ===================================================================== */
const TAILLE_MAX = 400 * 1024; // une sauvegarde de 400 Ko au plus
const CLIENT_PAR_DEFAUT = ""; // rempli quand Fabien aura créé l'identifiant client Google
let certs = null, certsT = 0;

function b64url(s){ s = s.replace(/-/g, "+").replace(/_/g, "/"); while(s.length % 4) s += "="; return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); }
function texte(u8){ return new TextDecoder().decode(u8); }
async function clesGoogle(){
  if(certs && Date.now() - certsT < 3600000) return certs;
  const r = await fetch("https://www.googleapis.com/oauth2/v3/certs"); certs = (await r.json()).keys || []; certsT = Date.now(); return certs;
}
// Vérifie le jeton d'identité envoyé par Google (signature RS256, destinataire, émetteur, date) et renvoie son contenu
export async function verifierGoogle(credential, clientId){
  const p = String(credential || "").split("."); if(p.length !== 3) throw new Error("jeton");
  const tete = JSON.parse(texte(b64url(p[0]))), corps = JSON.parse(texte(b64url(p[1])));
  const cle = (await clesGoogle()).find((k) => k.kid === tete.kid); if(!cle || tete.alg !== "RS256") throw new Error("clé");
  const k = await crypto.subtle.importKey("jwk", cle, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", k, b64url(p[2]), new TextEncoder().encode(p[0] + "." + p[1]));
  if(!ok) throw new Error("signature");
  if(corps.aud !== clientId) throw new Error("destinataire");
  if(corps.iss !== "accounts.google.com" && corps.iss !== "https://accounts.google.com") throw new Error("émetteur");
  if(!(corps.exp * 1000 > Date.now())) throw new Error("expiré");
  return corps;
}
function nouveauJeton(){ const a = new Uint8Array(24); crypto.getRandomValues(a); return Array.from(a, (x) => x.toString(16).padStart(2, "0")).join(""); }

// O = outils de worker/index.js : { reponse }
export async function comptePost(request, env, O){
  let d; try{ d = await request.json(); }catch(e){ return O.reponse({ erreur: "Demande illisible." }, 400); }
  const KV = env.CLASSEMENT, now = Date.now();
  const lireCompte = async (sub) => sub ? await KV.get("compte_" + sub, { type: "json" }) : null;
  const ecrireCompte = (C) => KV.put("compte_" + C.sub, JSON.stringify(C));
  const parJeton = async () => { const j = String(d.jeton || "").replace(/[^a-f0-9]/g, ""); if(!j) return null; const sub = await KV.get("jeton_" + j); if(!sub) return null; const C = await lireCompte(sub); return C && C.session && C.session.jeton === j ? C : null; };

  if(d.action === "connexion"){
    const clientId = env.GOOGLE_CLIENT_ID || CLIENT_PAR_DEFAUT;
    if(!clientId) return O.reponse({ erreur: "La connexion Google n’est pas encore configurée sur le serveur." }, 503);
    let g; try{ g = env.VERIFIER_GOOGLE ? await env.VERIFIER_GOOGLE(d.credential) : await verifierGoogle(d.credential, clientId); }
    catch(e){ return O.reponse({ erreur: "Connexion Google refusée." }, 401); }
    const sub = String(g.sub || "").replace(/[^0-9]/g, ""); if(!sub) return O.reponse({ erreur: "Connexion Google refusée." }, 401);
    const appareil = String(d.id || "").replace(/[^a-z0-9]/gi, "").slice(0, 24);
    let C = await lireCompte(sub);
    if(!C) C = { sub, idJoueur: appareil || nouveauJeton().slice(0, 16), cree: now, nom: "", appareils: {}, save: null };
    C.nom = String(g.given_name || g.name || "").replace(/[<>]/g, "").slice(0, 30);
    if(appareil) C.appareils[appareil] = now;
    // une seule session : l'ancien jeton ne marche plus
    if(C.session && C.session.jeton) await KV.delete("jeton_" + C.session.jeton);
    const jeton = nouveauJeton(); C.session = { jeton, appareil, t: now };
    await ecrireCompte(C); await KV.put("jeton_" + jeton, sub);
    return O.reponse({ jeton, idJoueur: C.idJoueur, nom: C.nom, sauvegarde: C.save ? { t: C.save.t, jour: C.save.jour, appareil: C.save.appareil } : null });
  }
  const C = await parJeton();
  if(!C) return O.reponse({ erreur: "Session terminée : ton compte est ouvert sur un autre appareil, ou tu as été déconnecté.", session: false }, 401);
  if(d.action === "sauver"){
    const donnees = d.donnees && typeof d.donnees === "object" ? d.donnees : null; if(!donnees) return O.reponse({ erreur: "Rien à enregistrer." }, 400);
    const propre = {}; for(const k in donnees){ if(/^survival_[\w-]{1,60}$/.test(k) && typeof donnees[k] === "string") propre[k] = donnees[k]; }
    const brut = JSON.stringify(propre); if(brut.length > TAILLE_MAX) return O.reponse({ erreur: "Sauvegarde trop grosse." }, 413);
    C.save = { t: now, jour: Math.max(0, Math.min(5000, Math.floor(+d.jour) || 0)), appareil: C.session.appareil, donnees: propre };
    await ecrireCompte(C); return O.reponse({ ok: true, t: now });
  }
  if(d.action === "charger") return O.reponse({ donnees: C.save ? C.save.donnees : null, t: C.save ? C.save.t : 0, jour: C.save ? C.save.jour : 0, idJoueur: C.idJoueur });
  if(d.action === "deconnexion"){ await KV.delete("jeton_" + C.session.jeton); C.session = null; await ecrireCompte(C); return O.reponse({ ok: true }); }
  if(d.action === "supprimer"){ await KV.delete("jeton_" + C.session.jeton); await KV.delete("compte_" + C.sub); return O.reponse({ ok: true }); }
  return O.reponse({ erreur: "Action inconnue." }, 400);
}
