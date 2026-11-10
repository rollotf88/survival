/* ---------- Modération des noms (2026-11-10, demande de Fabien) ----------
   Refuse les pseudos, prénoms, noms et descriptions de clan qui contiennent une insulte ou un mot haineux.
   La même liste et la même fonction sont recopiées dans worker/index.js (le serveur vérifie aussi : on ne peut pas contourner le jeu).
   Comment ça marche : le texte est mis en minuscules, sans accents, les chiffres « déguisés » sont remis en lettres (0→o, 1→i, 3→e, 4→a, 5→s, 7→t, @→a, $→s),
   les lettres répétées sont réduites (« connnnard » → « conard »). Les mots longs (6 lettres et plus) sont cherchés n'importe où dans le texte ;
   les mots courts seulement comme mot entier (sinon « computer » serait refusé à cause de « pute », « fichier » à cause de « chier »). */
var MOTS_INTERDITS = {
  // cherchés n'importe où (assez longs pour ne pas se cacher dans des mots normaux)
  partout: ["connard", "connasse", "salope", "salopard", "salaud", "enculé", "enculer", "enculeur", "putain", "pétasse", "pouffiasse", "grognasse", "bâtard", "batard",
    "niquer", "nique ta", "niquetamere", "fils de pute", "filsdepute", "branleur", "branlette", "suceur", "suceuse", "enfoiré", "emmerdeur", "trouduc", "trou du cul",
    "tapette", "tarlouze", "pédale", "gouine", "nègre", "négro", "bougnoule", "youpin", "chinetoque", "bamboula", "sale arabe", "sale noir", "sale juif",
    "pédophile", "pedophile", "violeur", "zoophile", "nécrophile", "inceste", "hitler", "terroriste", "daech", "jihad", "djihad",
    "fuck", "motherfucker", "bitch", "faggot", "whore", "pussy", "asshole", "cocksucker", "rapist", "porno"],
  // seulement comme mot entier
  mot: ["con", "conne", "cul", "pute", "putes", "bite", "zob", "chatte", "couille", "couilles", "merde", "chier", "nique", "ntm", "fdp", "pd", "pédé", "pede",
    "salop", "naze", "nazi", "nazis", "kkk", "ss", "viol", "sexe", "sex", "porn", "shit", "cunt", "dick", "cock", "slut", "fag", "ass", "rape", "negro", "nigger", "nigga", "niger", "heil"]
};
function normaliserMod(t){
  return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/0/g, "o").replace(/1/g, "i").replace(/3/g, "e").replace(/4/g, "a").replace(/5/g, "s").replace(/7/g, "t").replace(/8/g, "b").replace(/@/g, "a").replace(/\$/g, "s").replace(/[!|]/g, "i");
}
var listeModPrete = null;
function preparerListeMod(){
  var serre = function(w){ return normaliserMod(w).replace(/[^a-z]/g, "").replace(/(.)\1+/g, "$1"); };
  listeModPrete = { partout: MOTS_INTERDITS.partout.map(serre).filter(function(w){ return w.length >= 3; }), mot: MOTS_INTERDITS.mot.map(serre) };
}
// true si le texte contient un mot interdit
function texteInterdit(t){
  if(!listeModPrete) preparerListeMod();
  var n = normaliserMod(String(t || "").replace(/([a-zà-ÿ])([A-Z])/g, "$1 $2")), colle = n.replace(/[^a-z]/g, "").replace(/(.)\1+/g, "$1");
  var mots = n.split(/[^a-z]+/).filter(Boolean).map(function(w){ return w.replace(/(.)\1+/g, "$1"); });
  if(listeModPrete.partout.some(function(w){ return colle.indexOf(w) >= 0; })) return true;
  return listeModPrete.mot.some(function(w){ return mots.indexOf(w) >= 0 || colle === w; });
}
var MSG_NOM_INTERDIT = "Ce nom n’est pas autorisé (insulte ou mot blessant). Choisis-en un autre.";
