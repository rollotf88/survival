/* =====================================================================
   sw.js : permet d'installer le jeu sur le téléphone et d'y jouer sans
   connexion. Il garde une copie des fichiers du jeu.
   IMPORTANT : à chaque mise à jour du jeu, changer VERSION (sinon les
   téléphones garderaient l'ancienne copie).
   ===================================================================== */
var VERSION = "survival-20261109-1054";
var FICHIERS = [
  "./",
  "index.html",
  "style.css",
  "data.js",
  "icones.js",
  "logique.js",
  "ui.js",
  "guide.js",
  "classement.js",
  "succes.js",
  "piece.js",
  "manifest.json",
  "images/refuge-fond.webp",
  "images/portrait-papa.webp",
  "images/portrait-maman.webp",
  "images/portrait-leo.webp",
  "images/portrait-emma.webp",
  "images/icone-192.png",
  "images/icone-512.png",
  "images/icone-apple.png",
  "sons/musique-emptycity.ogg",
  "sons/.gitkeep",
  "sons/atelier.ogg",
  "sons/butin.ogg",
  "sons/casse.wav",
  "sons/clic.wav",
  "sons/construire.ogg",
  "sons/coup.ogg",
  "sons/depart.ogg",
  "sons/goupille.ogg",
  "sons/nuit.ogg",
  "sons/pas1.ogg",
  "sons/pas2.ogg",
  "sons/pas3.ogg",
  "sons/piece.ogg",
  "sons/porte.ogg",
  "sons/soin.ogg",
  "sons/troc.ogg",
  "sons/zombie1.wav",
  "sons/zombie2.wav",
  "sons/zombie3.wav"
];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(FICHIERS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(cles){ return Promise.all(cles.filter(function(k){ return k !== VERSION; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
// Réseau d'abord (pour avoir la dernière version), copie si pas de connexion
self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(function(r){
    if(r.ok && new URL(e.request.url).origin === location.origin){ var copie = r.clone(); caches.open(VERSION).then(function(c){ c.put(e.request, copie); }); }
    return r;
  }).catch(function(){ return caches.match(e.request, { ignoreSearch:true }); }));
});
