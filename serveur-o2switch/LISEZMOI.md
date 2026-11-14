# Installer ZOMBRIA chez o2switch (zombria.com)

Deux parties :
- **le jeu** (pages, images, sons) : le contenu du dossier `site/`, dans le dossier `/zombria.com` d'o2switch ;
- **le serveur** (classement, clans, discussion, codes, avis, administration) : le contenu de `serveur-o2switch/`, dans un dossier **à part** `/zombria-serveur` (hors du site public), lancé par « Setup Node.js App ».

## 1. Le serveur Node.js (une seule fois)
1. cPanel → **Setup Node.js App** → **Create Application**
   - Node.js version : la plus récente proposée (18 ou plus)
   - Application mode : **Production**
   - Application root : `zombria-serveur`
   - Application URL : `zombria.com` + `/api`
   - Application startup file : `app.js`
   - → **Create**
2. Dans le dossier `zombria-serveur` (gestionnaire de fichiers), envoyer `app.js`, `package.json` et `worker.mjs`.
3. Créer le fichier `reglages.json` (dans `zombria-serveur`) avec ton mot de passe d'administration :
   `{ "ADMIN_MDP": "ton-mot-de-passe-de-10-caracteres-ou-plus" }`
   Ce fichier ne va JAMAIS dans GitHub.
4. Retour dans Setup Node.js App → **Restart**.
5. Test : https://zombria.com/api/monde doit afficher du texte qui commence par `{`.

## 2. Reprendre les données de Cloudflare
1. https://survival-refuge.rollotf88.workers.dev/admin → Résumé → **📥 Télécharger les données** (fichier `import.json`).
2. Le déposer dans `zombria-serveur/donnees/import.json`.
3. Setup Node.js App → **Restart** : le fichier est lu puis renommé `import-fait-….json`.

## 3. Le jeu
Envoyer le contenu de `site/` (y compris le fichier caché `.htaccess`) dans `/zombria.com`.
Ensuite, l'envoi automatique depuis GitHub (GitHub Actions + compte FTP limité) fera ces mises à jour tout seul.
