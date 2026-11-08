# SURVIVAL – Le dernier refuge

Jeu de survie 2D (cartoon, post-apocalyptique) jouable dans le navigateur, destiné à être adapté sur mobile (Android/iOS), puis multijoueur par échanges différés.

## Fichiers
- `index.html` : page, charge `style.css` puis `data.js`, `logique.js`, `ui.js` (scripts classiques, pas de modules : doit marcher en double-clic / file://)
- `style.css` : styles (thème clair/sombre via variables, mobile d'abord). Palette « refuge » depuis le 2026-11-08 (demande de Fabien, pour aller avec la pièce peinte) : papier vieilli, parchemin, contours brun foncé, `--bois` / `--boisClair` pour les bordures des fenêtres, boutons couleur lanterne (ambre). Contrastes vérifiés ≥ 4,5 en clair et en sombre
- `data.js` : chiffres d'équilibrage (`BAL`), objets (`OBJETS`), maisons, famille, lieux et leur butin fini, refuge, événements
- `logique.js` : règles (stock, équipement, expédition, nuit), aucun accès au DOM (simulable)
- `ui.js` : écrans, fenêtres, clics
- `piece.js` : la pièce peinte cliquable (`ZONES_PIECE` en pixels de refuge-fond.webp, `CADRE_PIECE` = partie utile recadrée dans l'espace libre entre le chapitre et les cartes, `placerPiece()` appelé à chaque `render`). Porte → partir (« Qui part ? »), canapé → dormir (confirmation, étiquette qui pulse quand plus personne ne peut sortir), table → atelier, étagère → guide, cheminée → refuge, portraits → famille. Les 4 boutons du bas restent toujours (Fabien voulait seulement alléger l'image) : la pièce est un raccourci discret, ses étiquettes sont cachées et ne s'affichent que 3 s au début de chaque journée (et au survol sur PC). Le portemanteau n'est plus une zone. Chargé en dernier
- `guide.js` : menu ☰ et « Guide du survivant » (règles avec les chiffres de BAL, fiches objets / lieux / zombies / famille générées depuis data.js). Chargé après ui.js
- `icones.js` : icônes SVG dessinées à la main (`ICONES_SVG`, `svgIcone`). `icone(id)`, `iconeMembre(x)`, `iconeZombie(z)` (dans data.js) prennent le SVG s'il existe, sinon l'emoji. Chargé avant logique.js ; la simulation ne le charge pas (emojis)
- `ancien/jeu.js` : ancienne version en un seul fichier (référence)
- `publication-en-ligne.html` : page utilisée pour publier le jeu en lien privé sur claude.ai (sans en-tête HTML, la plateforme l'ajoute). Ne pas l'ouvrir en double-clic : c'est `index.html` qui sert à jouer en local
- `simulation.html`, `sim.js` : simulation d'équilibrage (robots qui jouent des centaines de parties)
- `controle-affichage.js` : outil de vérification (pas chargé par le jeu ni publié). `controleAffichage()` liste les chevauchements, textes coupés, débordements de l'écran affiché
- `.claude/launch.json` : petit serveur local (python) utilisé pour tester dans le navigateur intégré
- `images/`, `sons/` : assets à venir (gratuits uniquement, vérifier les licences : CC0 ou CC BY)

## Version en ligne (test sur téléphone)
- Lien privé : https://claude.ai/artifact/CRHRodmpWgrpSNamCHHGqP (publié le 2026-11-08). Seul Fabien peut l'ouvrir ; pour le faire tester, il le partage lui-même via le menu Partager de la page
- Pour mettre à jour : republier `publication-en-ligne.html` sur cette même adresse (`url`) avec les fichiers `style.css`, `data.js`, `icones.js`, `logique.js`, `ui.js`, `guide.js`, `piece.js` (et les images / sons s'ils ont changé). La sauvegarde et le record des joueurs sont gardés sur leur appareil

## Version installable (site)
- Adresse publique (installable sur téléphone) : https://unique-moxie-1ab990.netlify.app — dépôt GitHub privé rollotf88/survival, en ligne depuis le 2026-11-08. À chaque mise à jour, publier aux deux endroits (claude.ai et Netlify)
- Dossier `site/` : copie propre du jeu à héberger (index.html, scripts, style, manifest.json, sw.js, images sans les sources, sons). Le refaire après chaque changement (et augmenter `VERSION` dans sw.js)
- `python preparer-site.py` refait `site/` et met une nouvelle `VERSION` dans site/sw.js (date + heure)
- Hébergement (option B choisie par Fabien le 2026-11-08) : dépôt git dans ce dossier → GitHub (compte de Fabien, dépôt privé) → Netlify relié au dépôt, publie le dossier `site` (`netlify.toml`). Mise à jour : `python preparer-site.py`, commit, `git push` ; Netlify republie tout seul. Fabien se connecte lui-même à GitHub dans la fenêtre qui s'ouvre au premier push ; Claude ne reçoit jamais de mot de passe

## Principes de design (décidés avec Fabien)
- Famille de 4 membres max, mort permanente, pas de fin de jeu : bac à sable à la Project Zomboid (le seul but est de durer ; score = jours-personnes : chaque jour terminé rapporte 1 point par membre vivant, décidé avec Fabien le 2026-11-08 pour ne pas récompenser le fait de laisser mourir sa famille)
- Départ : sac limité, compte à rebours de 60 s, la maison de départ change les objets disponibles
- Chaque objet du sac doit servir plus tard (ex. lampe torche : lieux sombres ; boîte à outils : portes verrouillées ; radio : révèle le danger)
- Lieux qui s'épuisent, difficulté croissante, attaques de nuit, refuge à construire, événements à dilemmes
- Combats automatiques selon défense et compétences
- Interface type jeu mobile : tout tient sur un écran, peu de scroll, jouable sur toute résolution (portrait et paysage)
- Pubs récompensées : limitées (bonus de départ +1 place ou +20 s, expédition en plus, 2 par jour max), jamais de résurrection, récompenses non échangeables. Actuellement une fausse pub de 5 s.
- Multijoueur prévu en différé (offres de troc, appels de détresse, réputation), vérifié côté serveur, après que la version solo est fun
- Les emojis actuels sont des placeholders : prévoir une fonction `icone(id)` pour les remplacer par des SVG/images
- Fabien n'écrit pas le code lui-même : expliquer simplement, tester avant de dire que c'est fini

## État actuel du prototype
Étape 1 (fondation) faite le 2026-11-08 :
- Objets nommés (`OBJETS`) ; stock partagé `G.stock` (`n` = empilables, `o` = objets uniques avec solidité) ; rations entamées dans `G.reste`
- Équipement individuel : `x.eq.arme / outil / sac`, choisi par le joueur (cases sur les cartes des membres) ; une case vide est orange avec un « + » quand un objet de ce type attend au stock (demandé par Fabien) ; seul ce que l'équipe porte compte en expédition ; au départ le matériel du sac est réparti automatiquement
- Loot fini : chaque lieu a sa vraie liste d'objets (`G.lieux[i].butin`), affichée en nombre d'objets restants, « Vidé » quand elle est vide ; ce qui ne rentre pas dans les sacs reste sur place
- Les armes s'usent à chaque combat et se cassent ; messages de butin nommés (« Vous trouvez une hache et 2 planches »)
- Simulation d'équilibrage : `simulation.html` + `sim.js` (robots « Malin » et « Naïf », hasard à graine, 500 parties chacun ; mesure aussi les jours-personnes). Relancer après chaque changement d'équilibrage.
- Réglages du 2026-11-08 : potager/récupérateur à 1 ration par jour et par niveau, force des attaques +1 tous les 3 jours, une attaque perdue détruit un niveau de barricade. Résultat : Malin tient 53 jours (médiane, 10 % ≤ 47, 90 % ≤ 62, max 129), Naïf 7 jours, plus personne en vie au jour 200.
Étape 2a (fatigue et distance) faite le 2026-11-08 :
- Chaque membre a une énergie ⚡ (`x.en`, 0 à 100). Une expédition coûte `energieBase + energieParDistance × distance` (près 35, moyen 50, loin 65) ; on ne peut pas partir sans assez d'énergie. Sous 50 au départ : fatigué (fouille ×0,75, −1 de force)
- Plus de limite « une sortie par jour » : bouton « 🌙 Dormir » (mis en avant quand plus personne ne peut sortir). Le sommeil rend +70 ⚡ (+40 si nuit glaciale)
- La pub « Expédition en plus » devient « Second souffle » : +40 ⚡ pour toute la famille (2 par jour max)
- Simulation : Malin 55 jours (médiane), Naïf 11, plus personne en vie au jour 200 ; tous les lieux sont vidés vers le jour 12
Étape 2b (craft) faite le 2026-11-08 :
- Nouveaux matériaux dans les lieux : chiffon, clous, ferraille, adhésif, alcool
- Refuge en 4 onglets : Construire / Fabriquer (`RECETTES`) / Réparer (`REPARATION`, +60 % de solidité) / Démonter (`DEMONTAGE`). Chaque travail coûte 10 ⚡ au membre le plus reposé
- Fabrications : bandage, trousse, torche (4 fouilles), lance, gourdin clouté et piège à zombies (avec boîte à outils), sacoche, bâche (eau de pluie, 6 nuits), collet (gibier, 5 nuits)
- `icone(id)` est maintenant dans data.js (logique.js s'en sert, la simulation ne charge pas ui.js)
- Simulation : Malin 50 jours (médiane), 193 jours-personnes contre 187 sans atelier, première mort au jour 47 contre 43 ; Naïf 9 jours
- Score passé en jours-personnes (`G.score`, ajouté au début de `finJour`), affiché à chaque nuit et sur l'écran de fin ; record gardé dans le navigateur (localStorage `survival_record`). Simulation : Malin 193 points (médiane, 10 % ≤ 178, 90 % ≤ 206), 187 sans atelier, Naïf 28
Étape 2c (canettes énergisantes) faite le 2026-11-08 → étape 2 terminée :
- Canette (rare : 9 dans les lieux, 2 au départ dans l'Appart) : +40 ⚡ tout de suite, une par membre et par jour, et 20 ⚡ de repos en moins la nuit suivante
- Bouton ＋ sur la carte d'un membre : fenêtre « Soigner » (dit quel soin sera utilisé) / « Boire une canette »
- Simulation : les canettes ne changent presque pas le score (190 avec, 190 sans) : rien ne presse dans le jeu actuel, l'énergie sert surtout à vider les lieux plus vite. Elles prendront de la valeur quand il y aura une pression du temps (zones éloignées, événements urgents, pillards qui vident les lieux)
Étape 3 (combat RPG + armes à feu) faite le 2026-11-08 :
- En expédition, une rencontre ouvre un combat au tour par tour (`G.exp`, `G.combat`, `jouerTour`, `fuir`, `finExpedition`) : chaque membre frappe le zombie visé ou se protège (dégâts ÷2), ou toute l'équipe tente de fuir (60 %, butin ÷2). Bouton 🤖 Auto = `tourAuto()` (même stratégie que le robot Malin)
- 3 zombies (`ZOMBIES`) : Rôdeur, Coureur (jour 5+), Costaud (jour 12+) ; parfois plusieurs (de plus en plus avec les jours). Chaque arme a des dégâts (`degats`) et s'use à chaque coup ; Papa frappe +1, fatigué −1
- Armes à feu : pistolet (Commissariat, nouveau lieu jour 6) et fusil de chasse (Ferme au départ, Centre commercial). 1 munition du stock par tir (boîtes ouvertes à l'unité via `contient`), sans munition on frappe avec la crosse ; chaque tir a 30 % de chances d'attirer un zombie de plus (max 5)
- Les attaques de nuit restent automatiques
- Simulation : Malin 187 points (médiane, 10 % ≤ 152, 90 % ≤ 208), Naïf 27. Environ 36 combats par partie pour Malin, d'où le bouton Auto. Fusil au départ dans la Ferme ≈ autant de points que le riz à la place (188 contre 192) : vrai dilemme
Étape 4 (voiture, zones éloignées, crochetage) faite le 2026-11-08 :
- Voiture (`VOITURE`, `G.voiture`) : en panne au départ, 3 pièces à installer (batterie et roue au Garage auto, courroie à la Zone industrielle) par glisser-déposer dans l'onglet 🚗 Voiture du refuge (événements pointer : souris et doigt ; ou toucher la pièce puis l'emplacement). Jerricans (Station-service, Garage, zones éloignées) : +10 L, réservoir 20 L
- En voiture : le trajet ne coûte pas d'énergie (seulement la fouille, 20 ⚡), +8 places de coffre, 2 L par niveau de distance, +10 % de danger (bruit). Interrupteur « À pied / En voiture » dans le choix du lieu
- Zones éloignées (voiture obligatoire) : Village voisin, Entrepôt logistique, Base militaire (très dangereuse). L'essence limite à environ 4 trajets éloignés par partie
- Crochetage : porte verrouillée sans outil + épingles → choix Crocheter (mini-jeu : appuyer quand le curseur est dans la zone verte, 3 goupilles, un raté casse une épingle) ou Forcer. Emma a une zone plus large. L'expédition est découpée en étapes : `expedition` → (serrure) → `suiteExpedition` → (combat) → `finExpedition`
- Simulation : Malin 214 points (médiane, 10 % ≤ 177, 90 % ≤ 237), 191 sans voiture, 209 sans crochetage ; Naïf 28. Voiture réparée vers le jour 11
Étape 5 (graine du jour, chapitres, marché PNJ) faite le 2026-11-08 :
- Partie du jour (par défaut, bouton en haut de l'écran de départ ; sinon Partie libre) : graine = date (`graineDuJour`). `alea(tag)` fixe par graine + jour + étiquette : maison imposée, ordre des objets dans les lieux, attaques de nuit, événements du matin, offres du marché. Les combats restent au vrai hasard. Meilleur score du jour gardé dans le navigateur (`survival_jour_AAAAMMJJ`) + bouton « Copier mon résultat » à coller dans un message. Pas encore de classement en ligne (il faudra un serveur)
- Chapitres (`CHAPITRES`) : Premiers pas, Le refuge, Bricoleurs, Sur la route, Au-delà du quartier, puis « Tenir bon » tous les 10 jours sans fin. Affiché en petit sous « Jour X » : juste « Chapitre N », sans emoji (`.chapcourt`, demande de Fabien) ; le toucher ouvre `openChapitre` (objectif, progression via `progres()` de chaque chapitre, récompense, liste des chapitres). Annonce + récompense quand il est atteint (`verifierChapitre`, appelé dans `render`). « Tenir bon » ne donne que du moral : avec des objets (canette + bandages), le jeu redevenait infini (constaté en simulation)
- Marché de quartier (`MARCHE`, `VALEURS`) : Marco le brocanteur passe tous les 3 jours, 3 offres de troc (il ne demande jamais plus que ce qu'on a, rend 80 % de la valeur). Sa charrette a un stock limité (`G.charrette`) : vide, il ne revient plus. Sans cette limite, le jeu redevenait infini
- Simulation : Malin 239 points (médiane, 10 % ≤ 186, 90 % ≤ 268, max 310), Naïf 29, personne en vie au jour 200
- Combats fixés aussi (décidé avec Fabien le 2026-11-08) : en Partie du jour, TOUT le hasard de logique.js passe par `hasard()` (graine + jour + compteur de tirages `G.nTirage`, remis à 0 chaque nuit) → mêmes choix = même résultat, exactement. Vérifié : 50 parties Malin sur la même graine donnent le même score ; seul le mini-jeu de crochetage (adresse du joueur) fait varier. Nouvelle règle : ne jamais utiliser Math.random() dans logique.js ou data.js, toujours `hasard()` ou `R()`
- À faire plus tard pour l'étape 5 : classement en ligne et marché entre vrais joueurs (serveur), réputation
Sauvegarde automatique faite le 2026-11-08 :
- Après chaque clic (et quand la page passe en arrière-plan), `G` est enregistré dans localStorage (`survival_partie`, avec `VERSION_SAUVEGARDE`). Au lancement : fenêtre « Partie en cours » → Continuer / Nouvelle famille. Reprise au milieu d'un combat, d'un crochetage ou d'un événement (`reprendre` dans ui.js). Sauvegarde effacée à la mort ou en choisissant Nouvelle famille. L'écran de départ (compte à rebours) n'est pas sauvegardé
- `G.ev` (qui contient des fonctions) n'est pas enregistré : on garde son numéro `G.evIdx`. Règle : tout ce qui est dans `G` doit rester des données simples (pas de fonctions)
- Si on change la forme de `G` de façon incompatible, augmenter `VERSION_SAUVEGARDE` (les anciennes sauvegardes seront ignorées)
Événements et astuces faits le 2026-11-08 :
- 16 événements du matin (`EVENEMENTS`). Champs possibles : `si` (condition, ex. pillards à partir du jour 6, Emma a peur seulement si Emma vit), `prep` (choisit un membre ou une recrue, gardé dans `G.evCible` / `G.evIcone`), `texte` peut être une fonction. Le premier choix est le choix prudent (le robot Malin le prend par défaut)
- Nouvelles mécaniques : recrue (une survivante prend la place d'un membre mort, famille de 4 max : `recruter`), chien de garde (`G.chien = {nom:"Rex", faim}`, `chien()` ; défense de nuit +1, mange 1 ration par soir après la famille, part après 2 nuits sans manger, peut être mangé en cas de famine avec confirmation : +6 rations, moral −25 ; pastille + fiche dans l'interface ; réglages `BAL.chien`. Demandé par Fabien. Coût visible en simulation : Malin 227 au lieu de 237), horde (`G.hordeJour`, +20 % de danger ce jour-là), incendie (abîme la barricade ou brûle des planches)
- Astuces de première partie (`ASTUCES`) : bulle en haut de l'écran, une seule fois chacune (localStorage `survival_astuces`), bouton « Ne plus montrer d'astuces ». Le compte à rebours du départ est en pause pendant une astuce. Le premier toucher n'importe où ferme l'astuce (comptée comme lue) et l'action touchée se fait quand même (demandé par Fabien)
- Simulation : Malin 237 points (médiane), Naïf 29, personne au jour 200 ; chaque événement revient 2 à 3 fois par partie
Icônes (échantillon) faites le 2026-11-08 :
- Style : cartoon « autocollant », dessin 48 × 48, contour sombre épais (2,5) ajouté par `svgIcone`, couleurs communes dans `COUL`. En mode sombre, liseré clair (`--halo`) pour que le contour reste visible
- Choix (2026-11-08) : Fabien préfère les icônes dessinées à la main (plus cohérentes avec le jeu) plutôt que game-icons.net (comparaison faite, fichiers game-icons supprimés, donc pas de crédits nécessaires ; la planche reste en ligne en privé : https://claude.ai/artifact/9QgG6WiLRd92dG1x251tjJ)
- Dessinés : famille, recrues (Sam, Nora, Inès, Yanis), Marco, 3 zombies, les 54 objets, les 13 lieux, les 3 maisons, les 3 améliorations du refuge, les pastilles du haut (défense, moral ×3) et les 4 boutons d'action. `ic(clé, emoji)` affiche le dessin ou l'emoji de secours ; `iconeLieu(L)` via `ICONE_LIEU` (par nom). Restent en emoji : petits symboles dans les textes (⚡, ❤️, 📖, 📺…) et quelques boutons secondaires
- Visages selon l'état (fait le 2026-11-08) : `detailsEtat(x)` / `svgMembre` dans icones.js ajoutent bandage (PV < 40), cernes + Z (énergie < 35), bulle goutte ou cuisse (soif / faim < 25), yeux en croix + gris (mort). Seuils dans `ETATS_VISAGE`
 les lieux sont tous vidés vers le jour 12 (16 avant la fatigue) ; ensuite il ne reste qu'à attendre en vivant sur les réserves. Les zones éloignées (voiture, étape 4) et le craft (étape 2) devront remplir ce creux.

Boire / manger et écran « scène » (2026-11-08, retours de Fabien) :
- Problème constaté : la ration de chaque nuit compensait juste la perte du jour, une jauge basse ne remontait jamais (mort de soif avec du stock). Correctif : bouton ＋ → « Boire une ration d'eau » / « Manger une ration » (`prendreRation`, +30) ; la nuit, rattrapage automatique d'une ration de plus si la jauge est sous `BAL.rattrapage` (50) et qu'il reste assez pour les autres. Simulation : Malin 228, Naïf 31
- Écran principal en « scène » (`.stage.scene`) : chapitre en haut, la pièce peinte visible au milieu, les cartes de la famille compactes en bas sur le plancher, ligne d'aide masquée (les astuces l'expliquent). Rien à redemander à ChatGPT : l'image avait déjà le plancher vide en bas prévu pour les cartes
- Téléphone (largeur < 560 px, `modeMini()`) : barre de famille compacte (4 membres sur une ligne : portrait, nom, état, jauges fines, pastille « + » s'il y a un objet à équiper). Toucher un membre ouvre sa fiche (`openMembre` : jauges chiffrées, équipement, soins/boire/manger, « Choisir pour partir »). « Fouiller » sans membre choisi ouvre « Qui part ? ». Pub en petite pastille. Paysage et PC gardent les grandes cartes (retour de Fabien : sur mobile la pièce était trop petite)
Pêche et poules faites le 2026-11-08 (idée de Fabien) :
- Étang (`peche:true`, distance moyenne, jour 4) : avec une canne à pêche (case outil, fabriquée planche + adhésif + clous, ou trouvée à l'étang / chez Marco, s'use en 8 sorties) chacun pêche 1 à 3 poissons (2 rations). `G.lieux[i].poissons` (16 au départ) : +1 toutes les 2 nuits seulement s'il en reste au moins 4, sinon l'étang meurt. `resteLieu(i)` = objets + poissons. Réglages `BAL.peche`
- Poules (`poule`, catégorie Animaux) : Village voisin, Marco, événement « Une poule égarée » (dernier de `EVENEMENTS` pour ne pas décaler les sauvegardes). La nuit : boivent 1 ration d'eau pour 3 poules, pondent 1 ration 7 fois sur 10 chacune, +3 % de risque d'attaque par poule ; sans eau, une meurt (+2 rations). Réglages `BAL.poules`. Visible dans le bilan du refuge et le guide (« Pêche et poules »)
- `migrerPartie` (logique.js) insère l'étang dans les anciennes sauvegardes. Règle : ajouter les nouveaux lieux / événements sans décaler les anciens numéros, ou prévoir une migration
- Simulation : Malin 222 points (médiane), 226 sans garder de poules (vrai dilemme, mais 10 % ≤ 187 contre 180), 220 sans pêche ; Naïf 32 ; personne au jour 200. La soif reste la première cause de mort

Histoire, pub, installation (2026-11-08, retours de Fabien) :
- Histoire : chaque chapitre a un `recit` (data.js), « Tenir bon » pioche dans `RECITS_TENIR`. La fenêtre du chapitre montre « 📜 L'histoire jusqu'ici » (récits passés en gris, celui en cours) à la place de la liste des chapitres (Fabien : on ne sait pas combien il y en a, donc inutile). Le récit du chapitre suivant s'affiche aussi quand un chapitre se termine
- Jauges faim / soif des membres : mêmes dessins que l'en-tête (conserve, bouteille) au lieu de 🍽️ / 💧
- Pub « Second souffle » : plus de bouton fixe. Proposée comme sur un jeu mobile (`offrePub`, `pubUtile` dans ui.js) seulement quand plus personne ne peut sortir : dans « Qui part ? », la fiche d'un membre et la confirmation du canapé (`openDormir`). Toujours 2 par jour. Le bonus pub de l'écran de départ reste. Idée de Fabien pour plus tard : une boutique
- Installation sur téléphone préparée : `manifest.json`, `sw.js` (copie hors connexion, réseau d'abord ; changer `VERSION` à chaque mise à jour), icônes `images/icone-192.png`, `icone-512.png`, `icone-apple.png` (la cheminée de la pièce peinte). Ne marche que si le jeu est hébergé sur un vrai site en https (GitHub Pages, Netlify… compte de Fabien nécessaire), pas sur le lien claude.ai ni en double-clic

## Feuille de route (ordre voulu par Fabien)
1. Fondation : vrais objets nommés, inventaire partagé, équipement par membre, loot fini par lieu
2. Fatigue et distance (remplacent « finir le jour »), craft, canettes énergisantes — FAIT
3. Combat interactif façon RPG, armes (dont armes à feu et munitions) — FAIT
4. Voiture (réparation en glisser-déposer, essence), crochetage (mini-jeu), zones éloignées — FAIT
5. Chapitres (paliers de progression, sans fin de jeu), graine commune quotidienne + classement, marché de quartier avec PNJ puis vrais joueurs (serveur, après que le solo est fun) — FAIT en solo (chapitres, graine du jour, record du jour, marché PNJ) ; reste le serveur

## Étape 1 – Fondation (FAITE, garder pour mémoire)
Problèmes constatés par Fabien : « +1 arme » ne dit pas quelle arme ; les lieux ne se vident jamais vraiment ; les objets du sac de départ ne sont qu'une liste.
À faire :
- Remplacer les compteurs par un **inventaire d'objets nommés** (id, nom, icône, catégorie, stats, solidité éventuelle). Une hache reste une hache. Les consommables (eau, conserves, soins...) peuvent rester empilables.
- **Stock partagé** du refuge + **équipement individuel** : chaque membre a 3 emplacements (arme, éclairage/outil, sac) ; on équipe avant de partir en expédition.
- **Loot fini par lieu** : chaque lieu a une vraie liste d'objets ; quand elle est vide, le lieu est marqué « vidé » (pas de regénération magique). Les lieux plus loin (voiture plus tard) sont plus riches et plus dangereux.
- Les messages de butin doivent nommer les objets trouvés (« Vous trouvez une hache »).
- Séparer le code : `data.js` (objets, lieux, événements, recettes), `logique.js`, `ui.js`. Les chiffres d'équilibrage doivent être faciles à modifier.
- Garder l'écran de départ (sac limité + compte à rebours) et l'écran de refuge avec l'équipement visible.
- Garder l'interface mobile : un écran, peu de scroll, portrait et paysage.

## Idées pour plus tard (proposées par Fabien)
- (Pêche et poules FAITES le 2026-11-08 ; bétail pas fait) Pêche, élevage, et autres sources de nourriture. Règle : elles doivent s'épuiser ou coûter quelque chose (l'étang se vide, les animaux boivent, mangent et attirent zombies et pillards), sinon le jeu redevient infini. Bon moment : après la voiture (étape 4), avec des zones éloignées (lac, ferme).

- FAIT le 2026-11-08 (`guide.js`, bouton ☰) : un menu principal avec un « wiki » intégré (proposé par Fabien) : fiches des objets (à quoi ça sert, où le trouver, recettes), des lieux, des zombies, des membres et de leurs atouts, règles du jeu (énergie, score, chapitres). Les données sont déjà dans data.js, le wiki peut être généré à partir d'elles

- Rendre la pièce vivante (proposé le 2026-11-08) : variantes d'image demandées à ChatGPT (Rex devant la cheminée, planches sur la fenêtre avec la barricade, bâche/collet dans un coin, nuit)

## Questions de design à garder en tête
- La durée de survie doit refléter les décisions du joueur, pas le hasard : danger lisible, difficulté qui finit toujours par vaincre, idée d'une graine commune (mêmes événements pour tous les joueurs du jour) pour un classement équitable.
- Tester l'équilibrage par simulation (script qui joue des centaines de parties) avant de dire que c'est équilibré.

## Façon de travailler
- Fabien n'est pas développeur : expliquer simplement, dire ce qui a été changé et comment le tester (double-clic sur index.html).
- Faire des changements par petites étapes jouables, tester avant de dire que c'est fini.
- En-tête : seulement les pastilles essentielles (eau, nourriture, soins, défense de nuit, moral), en grille de 3 colonnes qui remplit toute la largeur sur téléphone (pas de vide à droite) ; un fondu (`#fondu`, piece.js) fait se mêler le bas de l'image au plancher sur les téléphones hauts ; la vraie solution pour remplir les écrans hauts serait une image de pièce plus haute (9:16) ; la pièce est collée en haut de l'espace libre (pas de bande vide) + ☰ + Rex ; planches et piles se voient dans le Stock (demande de Fabien)
- RÈGLE (demandée par Fabien le 2026-11-08 après un bug d'en-tête) : avant chaque publication qui touche l'affichage, charger `controle-affichage.js` dans le navigateur de test et lancer `await toutControler()` (parcourt les écrans principaux) / `controleAffichage()` sur les écrans principaux (départ, principal avec chien/marché, fiche membre, « Qui part », refuge, guide, chapitre) aux tailles 355×760, 360×640, 390×844, 412×915, 740×360, 1280×800. Ne publier qu'avec « aucun problème ». Le volet du navigateur est souvent replié : les captures ne marchent pas, ce contrôle par mesures les remplace
- Assets : emojis en attendant ; ensuite SVG codés à la main ; sinon packs gratuits (Kenney CC0, game-icons.net CC BY) en vérifiant les licences.
