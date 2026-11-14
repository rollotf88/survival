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
