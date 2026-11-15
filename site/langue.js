/* =====================================================================
   langue.js : la langue du jeu (2026-11-14, début de la traduction en anglais).
   Chargé en premier (après transfert.js). Principe :
   - le texte français reste écrit dans le code, et sert de clé : trad("Ta famille") ;
   - lang-en.js remplit TRADUCTIONS.en = { "Ta famille": "Your family", … } et peut remplacer les champs
     des données (noms d'objets, lieux…) par leur version anglaise (DONNEES_EN, appliquées par data-langue) ;
   - un texte sans traduction reste en français (rien ne casse) et est noté dans TRAD_MANQUANTES,
     pour retrouver ce qui manque : exporterManquantes() dans la console du navigateur ;
   - trad("Jour {n}", { n: 5 }) remplace {n} par la valeur ; pluriel : tradN(n, "1 ration", "{n} rations").
   Langue choisie dans le menu ☰ (localStorage survival_langue). Tant que l'anglais n'est pas fini
   (LANGUES_PRETES), le jeu démarre en français, même sur un téléphone réglé en anglais.
   ===================================================================== */
var LANGUES = { fr:"Français", en:"English" };
var LANGUES_PRETES = { fr:true, en:false }; // passer en à true quand toute la traduction sera faite : détection automatique
var TRADUCTIONS = { en:{} };
var TRAD_MANQUANTES = {};
// Pour essayer avant la sortie : zombria.com/?langue=en (ou ?langue=fr pour revenir) ; le réglage du menu apparaît alors
try{ var lq = (location.search.match(/[?&]langue=(\w+)/) || [])[1]; if(lq && LANGUES[lq]) localStorage.setItem("survival_langue", lq); }catch(e){}
var LANGUE = (function(){
  try{ var l = localStorage.getItem("survival_langue"); if(LANGUES[l]) return l; }catch(e){}
  var n = (navigator.language || "fr").slice(0, 2).toLowerCase();
  return LANGUES[n] && LANGUES_PRETES[n] ? n : (LANGUES_PRETES.en && n !== "fr" ? "en" : "fr");
})();
try{ document.documentElement.lang = LANGUE; }catch(e){}

function trad(fr, v){
  var s = fr;
  if(LANGUE !== "fr"){
    var d = TRADUCTIONS[LANGUE] || {};
    if(Object.prototype.hasOwnProperty.call(d, fr)) s = d[fr];
    else TRAD_MANQUANTES[fr] = (TRAD_MANQUANTES[fr] || 0) + 1;
  }
  return v ? String(s).replace(/\{(\w+)\}/g, function(m, k){ return v[k] != null ? v[k] : m; }) : s;
}
// Un texte qui peut être une liste de versions (récits selon qui est en vie) : chaque version est traduite
function tradVersions(t){ return Array.isArray(t) ? t.map(function(x){ return trad(x); }) : trad(t); }
// Pluriel : tradN(3, "1 ration", "{n} rations") ; l'anglais a la même règle simple (1 = singulier)
function tradN(n, un, plusieurs, v){ return trad(n === 1 || (LANGUE === "fr" && n === 0) ? un : plusieurs, Object.assign({ n: n }, v || {})); }
function changerLangue(l){
  if(!LANGUES[l] || l === LANGUE) return;
  try{ localStorage.setItem("survival_langue", l); }catch(e){}
  try{ if(typeof sauver === "function") sauver(); }catch(e){}
  location.reload();
}
// Pour Claude : la liste des textes vus à l'écran qui n'ont pas encore de traduction
function exporterManquantes(){ return Object.keys(TRAD_MANQUANTES); }

/* ---------- Traduction de l'affichage (2026-11-14) ----------
   Pour ne pas réécrire les milliers de textes des écrans, chaque texte affiché est traduit au passage :
   les nombres deviennent {#} dans la clé (« 3 / 5 joueurs » → « {#} / {#} joueurs »), les emojis et signes du début
   et de la fin sont gardés tels quels. Le dictionnaire est TRAD_ECRAN (lang-en.js). Les pseudos, prénoms, messages
   de la discussion et champs de saisie sont sous .sans-trad (ou input/textarea) : jamais traduits.
   Les textes affichés sans traduction sont notés dans ECRAN_MANQUANTS (pour Claude : ecranManquants()). */
var TRAD_ECRAN = {};
var TRAD_MOTIFS = []; // [expression, remplacement] pour les textes qui contiennent un nom
var ECRAN_MANQUANTS = {};
var RE_NOMBRE = /\d+(?:[.,]\d+)?/g;
function traduireTexteEcran(t){
  var m = /^([\s\p{Extended_Pictographic}\uFE0F\u200D\p{S}\p{Pd}\p{Pi}«"“(\[•·]*)([\s\S]*?)([\s\p{Extended_Pictographic}\uFE0F\u200D\p{Pf}:…!?.,;)\]»"”’]*)$/u.exec(t);
  if(!m || !m[2] || !/[A-Za-zÀ-ÿ]/.test(m[2])) return null;
  var core = m[2], nums = core.match(RE_NOMBRE) || [], cle = core.replace(RE_NOMBRE, "{#}");
  var tr = TRAD_ECRAN[cle];
  if(tr === undefined){
    // Textes avec un nom dedans (« Arme de Papa : vide ») : modèles de TRAD_MOTIFS (lang-en.js)
    for(var i = 0; i < TRAD_MOTIFS.length; i++){ if(TRAD_MOTIFS[i][0].test(core)){ var res = core.replace(TRAD_MOTIFS[i][0], TRAD_MOTIFS[i][1]); if(/^[A-Z][a-z]{2} \d+$/.test(res)) m[3] = m[3].replace(/^\./, ""); /* « 9 nov. » → « Nov 9 » */ return m[1] + res + m[3].replace(/^[\s  ]+(?=[:?!;])/, ""); } }
    ECRAN_MANQUANTS[cle] = (ECRAN_MANQUANTS[cle] || 0) + 1;
    // pas de traduction : au moins la ponctuation à l'anglaise (« Strong : … » → « Strong: … »)
    var fixe = t.replace(/[   ]+([:?!;])/g, "$1");
    return fixe !== t ? fixe : null;
  }
  var k = 0; tr = tr.replace(/\{#\}/g, function(){ return nums[k++] || ""; });
  return m[1] + tr + m[3].replace(/^[\s  ]+(?=[:?!;])/, ""); // « équipe ? » → « team? » (pas d'espace avant ? ! : en anglais)
}
function traduireNoeud(racine){
  if(LANGUE === "fr" || !racine) return;
  var ignorer = function(el){ return !el || el.closest && el.closest(".sans-trad, input, textarea, script, style, [contenteditable]"); };
  if(racine.nodeType === 3){ if(!ignorer(racine.parentElement)){ var r = traduireTexteEcran(racine.nodeValue); if(r !== null && r !== racine.nodeValue) racine.nodeValue = r; } return; }
  if(racine.nodeType !== 1 || ignorer(racine)) return;
  var w = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT), n, liste = [];
  while((n = w.nextNode())) liste.push(n);
  liste.forEach(function(x){ if(!ignorer(x.parentElement)){ var r = traduireTexteEcran(x.nodeValue); if(r !== null && r !== x.nodeValue) x.nodeValue = r; } });
  ["placeholder", "aria-label", "title"].forEach(function(a){ racine.querySelectorAll("[" + a + "]").forEach(function(el){ if(ignorer(el)) return; var r = traduireTexteEcran(el.getAttribute(a)); if(r !== null) el.setAttribute(a, r); }); });
}
// Règle du guide : texte anglais rangé par titre (REGLES_EN), les nombres repris dans l'ordre du texte français
function tradRegle(titre, fr){
  if(LANGUE === "fr" || typeof REGLES_EN === "undefined" || !REGLES_EN[titre]) return fr;
  var nums = String(fr).replace(/<[^>]+>/g, "").match(/\d+(?:[.,]\d+)?/g) || [], k = 0;
  return REGLES_EN[titre].replace(/\{#\}/g, function(){ return nums[k++] || ""; });
}
// Un long texte traduit d'un bloc AVANT l'affichage (avant que les icônes ne le coupent en morceaux) : règles du guide…
function tradEcran(t){ if(LANGUE === "fr" || !t) return t; var r = traduireTexteEcran(String(t)); return r === null ? t : r; }
function ecranManquants(){ return Object.keys(ECRAN_MANQUANTS); }
if(typeof document !== "undefined" && typeof MutationObserver !== "undefined" && LANGUE !== "fr"){
  var obsLangue = new MutationObserver(function(muts){
    muts.forEach(function(mu){
      if(mu.type === "characterData") traduireNoeud(mu.target);
      else mu.addedNodes.forEach(function(n){ traduireNoeud(n); });
    });
  });
  var lancerObsLangue = function(){ traduireNoeud(document.body); obsLangue.observe(document.body, { childList:true, subtree:true, characterData:true }); };
  if(document.body) lancerObsLangue(); else document.addEventListener("DOMContentLoaded", lancerObsLangue);
}
// Titre de l'onglet du navigateur dans la langue du jeu
try{ if(LANGUE === "en") document.title = "ZOMBRIA – The Last Refuge"; }catch(e){}
