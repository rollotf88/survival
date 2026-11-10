/* test-raid.js : parcours de test du raid dans le navigateur (pas chargé par le jeu ni publié).
   Branche appelClans sur le vrai code du serveur (worker/index.js) avec un faux stockage, crée un clan de 4 familles,
   puis await testRaid() parcourt les écrans du raid et lance controleAffichage() sur chacun. */
async function serveurFactice(){
  var W = (await import("/worker/index.js?" + Date.now())).default, store = {};
  var env = { CLASSEMENT:{ get:async function(k, o){ return store[k] === undefined ? null : (o && o.type === "json" ? JSON.parse(store[k]) : store[k]); }, put:async function(k, v){ store[k] = v; } } };
  window.__srv = async function(c){ var r = await W.fetch(new Request("https://x/api/clans", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(c) }), env); return r.json(); };
  appelClans = function(corps){ corps.id = idAppareil(); corps.pseudo = lirePseudo() || "Fabou"; corps.jour = corps.jour || jourPartie() || 40; corps.cadre = cadreActif(); corps.profil = monProfil(); return window.__srv(JSON.parse(JSON.stringify(corps))); };
  try{ localStorage.setItem("survival_pseudo", "Fabou"); }catch(e){}
}
async function testRaid(){
  var w = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }, pb = {};
  var verif = function(nom){ var r = controleAffichage(); if(r && r.length) pb[nom] = r; };
  var clic = function(act, id){ var b = document.querySelector('#sheet [data-act="' + act + '"]' + (id !== undefined ? '[data-id="' + id + '"]' : "")); if(b && !b.disabled){ b.click(); return true; } return false; };
  await serveurFactice();
  nouvellePartie(null); demarrer(); G.ph = "game"; G.day = 40;
  var x = G.m[0]; ajouter("fusil", 1); var f = G.stock.o.find(function(o){ return o.id === "fusil"; }); G.stock.o.splice(G.stock.o.indexOf(f), 1); x.eq.arme = f; f.sol = 20;
  ajouter("cartouche", 30); ajouter("trousse", 4); ajouter("bandage", 3); ajouter("gilet", 1); ajouter("casque", 1); ajouter("bouclier", 1); ajouter("alcool", 2); ajouter("chiffon", 3);
  render();
  var c0 = await appelClans({ action:"creer", nom:"Les Testeurs", blason:3 }), cid = c0.monClan.id;
  var ids = ["autreBBBB2", "autreCCCC3", "autreDDDD4"], ps = ["Bob", "Cleo", "Dan"], armes = ["pistolet", "fusil", "fusil"], mun = { pistolet:"balle", fusil:"cartouche" };
  for(var i = 0; i < 3; i++){
    await window.__srv({ action:"rejoindre", id:ids[i], pseudo:ps[i], jour:45, clan:cid });
    var kit = { n:{ trousse:2, bandage:2 }, o:[{ id:"gilet", sol:4, uid:7 }, { id:"casque", sol:4, uid:8 }, { id:"bouclier", sol:4, uid:9 }] }; kit.n[mun[armes[i]]] = 15;
    await window.__srv({ action:"raidPret", id:ids[i], pseudo:ps[i], jour:45, membre:{ nom:["Karim", "Lina", "Tom"][i], r:["Papa", "Maman", "Léo"][i], hp:95, en:90, trait:"costaud", idx:1, eq:{ arme:{ id:armes[i], sol:15, uid:5 } } }, kit:kit });
  }
  ouvrirOperation(null); await w(400); verif("listeOperations"); window.__liste = document.getElementById("sheet").innerText;
  try{ localStorage.setItem("survival_mon_clan", "1"); }catch(e){}
  G.sel = [1]; openLoc(); await w(300); verif("lieuxAvecOperation"); window.__carteLieu = (document.querySelector("#sheet .carte-op") || {}).innerText;
  ouvrirOperation("immeuble"); await w(400); verif("onglet");
  clic("raidpret"); await w(200); verif("choixVolontaire");
  clic("raidchoix", 0); await w(200); verif("kit");
  clic("raidenvoyer"); await w(500); verif("ongletPret");
  clic("raidlancer"); await w(800); verif("combatEtage1");
  clic("cauto"); await w(300); verif("combatFini");
  clic("cfin"); await w(400); verif("entreEtages");
  // on redescend tout de suite
  clic("raiddescendre"); await w(900); verif("bilan");
  clic("raidreplay"); await w(600); await w(1900); verif("replay");
  clic("rpfin"); await w(300); verif("replayFin");
  hide();
  return innerWidth + "x" + innerHeight + " raid : " + (Object.keys(pb).length ? JSON.stringify(pb) : "aucun problème");
}
