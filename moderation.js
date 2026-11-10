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
    "fuck", "motherfucker", "bitch", "faggot", "whore", "asshole", "cocksucker", "porno",
    // ajoutés depuis la liste LDNOOBW (fr et en, licence CC BY 4.0), triée à la main
    "bigornette", "bloblos", "brackmard", "branlage", "branler", "branleuse", "brouter le cresson", "chiottes", "clitoris", "cramouille", "emmerdant", "emmerder", "emmerdeuse", "enculeurs", "fille de pute", "grogniasse", "la putain de ta mère", "merdeuse", "merdeux", "nique ta race", "palucher", "pousse-crotte", "sac à foutre", "sac à merde", "tringler", "troncher", "zigounette", "acrotomophilia", "alabama hot pocket", "alaskan pipeline", "anilingus", "apeshit", "arsehole", "assmunch", "auto erotic", "babeland", "baby batter", "baby juice", "ball gravy", "ball sack", "bangbros", "bangbus", "barely legal", "barenaked", "bastard", "bastardo", "beaners", "beaver cleaver", "beaver lips", "beastiality", "bestiality", "big breasts", "big knockers", "big tits", "birdlock", "bitches", "black cock", "blowjob", "blow your load", "blue waffle", "blumpkin", "bollocks", "brown showers", "bulldyke", "bullet vibe", "bullshit", "bung hole", "buttcheeks", "butthole", "camel toe", "camgirl", "camslut", "camwhore", "carpet muncher", "chocolate rosebuds", "circlejerk", "cleveland steamer", "clover clamps", "clusterfuck", "coprolagnia", "coprophilia", "cornhole", "creampie", "cumshot", "cumshots", "cunnilingus", "date rape", "deep throat", "dendrophilia", "dingleberry", "dingleberries", "dirty sanchez", "doggie style", "doggy style", "dog style", "dominatrix", "donkey punch", "double dong", "double penetration", "dp action", "dry hump", "eat my ass", "ejaculation", "erotism", "fellatio", "fingerbang", "foot fetish", "fuck buttons", "fucktards", "fudge packer", "futanari", "gangbang", "genitals", "giant cock", "girls gone wild", "golden shower", "goregasm", "group sex", "hand job", "homoerotic", "intercourse", "jail bait", "jiggerboo", "kinbaku", "kinkster", "leather restraint", "leather straight jacket", "lemon party", "livesex", "make me come", "masturbate", "masturbation", "menage a trois", "missionary position", "mound of venus", "mr hands", "muff diver", "nawashi", "neonazi", "nimphomania", "nsfw images", "nymphomania", "octopussy", "omorashi", "one cup two girls", "one guy one jar", "paedophile", "pedobear", "phone sex", "piece of shit", "pole smoker", "ponyplay", "poontang", "poop chute", "pornography", "raghead", "raging boner", "reverse cowgirl", "rosy palm", "rusty trombone", "schlong", "sexually", "sexuality", "shaved beaver", "shaved pussy", "shemale", "shibari", "shitblimp", "slanteye", "sodomize", "splooge moose", "spread legs", "strip club", "suicide girls", "swastika", "threesome", "thumbzilla", "towelhead", "tribadism", "tub girl", "two girls one cup", "upskirt", "urethra play", "urophilia", "venus mound", "vibrator", "vorarephilia", "voyeurweb", "wetback", "wet dream", "white power", "worldsex", "wrinkled starfish", "yellow showers", "zoophilia"],
  // seulement comme mot entier
  mot: ["con", "conne", "cul", "pute", "putes", "bite", "zob", "chatte", "couille", "couilles", "merde", "chier", "nique", "ntm", "fdp", "pd", "pédé", "pede",
    "salop", "naze", "nazi", "nazis", "kkk", "ss", "viol", "sexe", "sex", "porn", "shit", "cunt", "dick", "cock", "slut", "fag", "ass", "rape", "negro", "nigger", "nigga", "niger", "heil", "pussy", "rapist",
    // ajoutés depuis la liste LDNOOBW (fr et en, licence CC BY 4.0)
    "bander", "chiasse", "clito", "étron", "foutre", "jouir", "MALPT", "suce", "trique", "anal", "anus", "ball gag", "ball kicking", "ball licking", "ball sucking", "bbw", "bdsm", "beaner", "bimbos", "boner", "boob", "boobs", "bukkake", "busty", "cialis", "clit", "cocks", "coons", "cum", "cumming", "darkie", "dildo", "dolcett", "dommes", "dvda", "ecchi", "fecal", "felch", "feltch", "female squirting", "femdom", "figging", "fisting", "footjob", "frotting", "fuckin", "fucking", "gay sex", "goatcx", "goatse", "gokkun", "goodpoop", "goo girl", "g-spot", "guro", "hentai", "honkey", "hooker", "horny", "incest", "jack off", "jerk off", "jigaboo", "jizz", "juggs", "kike", "knobbing", "male squirting", "masturbating", "milf", "muffdiving", "nambla", "nig nog", "nsfw", "nutten", "nympho", "orgasm", "orgy", "paki", "pegging", "penis", "pikey", "pissing", "piss pig", "poof", "poon", "punany", "prince albert piercing", "pthc", "pubes", "queaf", "queef", "quim", "raping", "rectum", "rimjob", "rimming", "sadism", "scissoring", "semen", "sexcam", "sexo", "sexual", "shitty", "shota", "smut", "sodomy", "spic", "splooge", "spooge", "spunk", "tea bagging", "tits", "titties", "titty", "tosser", "tranny", "tushy", "twat", "twink", "vagina", "viagra", "voyuer", "vulva", "wank", "yaoi", "yiffy", "turlute", "strap on"]
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
