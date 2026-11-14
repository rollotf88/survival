/* =====================================================================
   serveur-o2switch/app.js : le serveur du jeu chez o2switch (Node.js, via « Setup Node.js App » du cPanel).
   Il fait tourner EXACTEMENT le même code que sur Cloudflare (worker/index.js, copié ici sous le nom worker.mjs
   par preparer-site.py) ; seul le stockage change : au lieu du KV de Cloudflare, un fichier JSON par clé dans le
   dossier « donnees » (à côté de ce fichier, hors du site public).
   - Mot de passe de l'administration : fichier « reglages.json » (à créer par Fabien sur o2switch, jamais dans GitHub) :
     { "ADMIN_MDP": "…" }
   - Reprise des données de Cloudflare : déposer le fichier exporté depuis l'administration sous le nom
     « donnees/import.json » ; au démarrage suivant, il est découpé en fichiers puis renommé « import-fait.json ».
   - Pour redémarrer après une mise à jour : toucher le fichier « tmp/restart.txt » (l'envoi automatique le fait).
   Écrit en CommonJS (le plus sûr avec Passenger, le lanceur d'o2switch) ; le code du serveur est chargé par import().
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path"), crypto = require("crypto");
if(!globalThis.crypto) globalThis.crypto = crypto.webcrypto; // Node 18 : crypto.subtle (empreinte du mot de passe admin)

const ICI = __dirname, DONNEES = path.join(ICI, "donnees");
fs.mkdirSync(DONNEES, { recursive: true });

/* ---------- Le stockage (remplace le KV de Cloudflare) ---------- */
const fichierCle = (k) => path.join(DONNEES, encodeURIComponent(String(k)).replace(/\./g, "%2E") + ".json");
const KV = {
  async get(k, opt){
    let brut; try{ brut = fs.readFileSync(fichierCle(k), "utf8"); }catch(e){ return null; }
    let e; try{ e = JSON.parse(brut); }catch(err){ return null; }
    if(e.expire && Date.now() > e.expire){ try{ fs.unlinkSync(fichierCle(k)); }catch(err){} return null; }
    if(opt && (opt === "json" || opt.type === "json")){ try{ return JSON.parse(e.v); }catch(err){ return null; } }
    return e.v;
  },
  async put(k, v, opt){
    const e = { v: String(v) }; if(opt && opt.expirationTtl) e.expire = Date.now() + opt.expirationTtl * 1000;
    const f = fichierCle(k), tmp = f + "." + process.pid + "." + Date.now() + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(e)); fs.renameSync(tmp, f); // écriture « tout ou rien »
  },
  async delete(k){ try{ fs.unlinkSync(fichierCle(k)); }catch(e){} }
};

// Reprise des données exportées de Cloudflare : { "clé": "valeur (texte)", … }
(function importer(){
  const f = path.join(DONNEES, "import.json"); if(!fs.existsSync(f)) return;
  try{
    const tout = JSON.parse(fs.readFileSync(f, "utf8")), cles = tout.donnees || tout;
    Object.keys(cles).forEach((k) => { const v = cles[k]; KV.put(k, typeof v === "string" ? v : JSON.stringify(v)); });
    fs.renameSync(f, path.join(DONNEES, "import-fait-" + Date.now() + ".json"));
    console.log("Import terminé : " + Object.keys(cles).length + " clés");
  }catch(e){ console.error("Import impossible :", e.message); }
})();

/* ---------- E-mail à l'éditeur quand un joueur envoie un avis ou signale un message (2026-11-14) ----------
   Par le programme sendmail de l'hébergement (pas de mot de passe, pas de module à installer).
   Adresse : « AVIS_EMAIL » dans reglages.json, sinon contact@zombria.com (redirigée vers la boîte de Fabien).
   Un échec d'envoi ne bloque jamais le jeu. */
const { spawn } = require("child_process");
function entete(t){ return "=?UTF-8?B?" + Buffer.from(String(t).replace(/[\r\n]+/g, " ")).toString("base64") + "?="; }
async function notifier(sujet, texte){
  const a = reglages().AVIS_EMAIL || "contact@zombria.com";
  const msg = ["From: " + entete("ZOMBRIA") + " <noreply@zombria.com>", "To: " + a, "Subject: " + entete(sujet),
    "MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: base64", "",
    Buffer.from(String(texte)).toString("base64").replace(/(.{76})/g, "$1\n")].join("\n");
  await new Promise((ok) => {
    try{
      const p = spawn("/usr/sbin/sendmail", ["-t", "-i"]);
      p.on("error", (e) => { console.error("sendmail :", e.message); ok(); });
      p.on("close", () => ok());
      p.stdin.end(msg);
      setTimeout(ok, 8000);
    }catch(e){ console.error("sendmail :", e.message); ok(); }
  });
}

function reglages(){ try{ return JSON.parse(fs.readFileSync(path.join(ICI, "reglages.json"), "utf8")); }catch(e){ return {}; } }

/* ---------- Le serveur : chaque requête /api/… est passée au même code que sur Cloudflare ---------- */
let worker = null;
const pret = import("./worker.mjs").then((m) => { worker = m.default; });

http.createServer(async (req, res) => {
  try{
    await pret;
    // Passenger peut retirer ou garder le préfixe /api selon la configuration : on le remet si besoin
    let chemin = req.url || "/"; if(!/^\/api\//.test(chemin)) chemin = "/api" + (chemin.charAt(0) === "/" ? "" : "/") + chemin;
    const hote = req.headers["x-forwarded-host"] || req.headers.host || "zombria.com";
    const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "inconnue").split(",")[0].trim();
    const morceaux = []; for await (const c of req) morceaux.push(c);
    const corps = Buffer.concat(morceaux);
    const entetes = new Headers(); Object.keys(req.headers).forEach((h) => { const v = req.headers[h]; if(v !== undefined) entetes.set(h, Array.isArray(v) ? v.join(", ") : v); });
    entetes.set("CF-Connecting-IP", ip);
    const requete = new Request("https://" + hote + chemin, { method: req.method, headers: entetes, body: ["GET", "HEAD"].includes(req.method) || !corps.length ? undefined : corps });
    const env = { CLASSEMENT: KV, ADMIN_MDP: reglages().ADMIN_MDP || "", NOTIFIER: notifier, ASSETS: { fetch: async () => new Response("Introuvable", { status: 404 }) } };
    const rep = await worker.fetch(requete, env);
    const h = {}; rep.headers.forEach((v, k) => { h[k] = v; });
    res.writeHead(rep.status, h);
    res.end(Buffer.from(await rep.arrayBuffer()));
  }catch(e){
    console.error(e);
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ erreur: "serveur" }));
  }
}).listen(process.env.PORT || 3000);
