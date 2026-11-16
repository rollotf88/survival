# preparer-site.py : refait le dossier « site » (la version installable du jeu
# hébergée sur Netlify) à partir des fichiers du jeu, et change la version de
# sw.js pour que les téléphones prennent la nouvelle version.
# Utilisation : python preparer-site.py
import os, shutil, re, time

ici = os.path.dirname(os.path.abspath(__file__))
os.chdir(ici)
FICHIERS = ["index.html", "ads.txt", "transfert.js", "langue.js", "maintenance.js", "lang-en.js", "mentions-legales.html", "confidentialite.html", "legal-notice.html", "privacy.html", "legal.css", "style.css", "data.js", "icones.js", "logique.js", "ui.js", "guide.js", "moderation.js", "classement.js", "compte.js", "raid.js", "chat.js", "defis.js", "succes.js", "piece.js", "avantposte.js", "avantposte.css", "manifest.json", "sw.js", "admin.html", "robots.txt", "sitemap.xml"]  # AVANT-POSTE : avantposte.js et avantposte.css

if os.path.isdir("site"): shutil.rmtree("site")
os.makedirs("site/images"); os.makedirs("site/sons"); shutil.copytree("polices", "site/polices")
for f in FICHIERS: shutil.copy(f, "site/" + f)
for f in os.listdir("images"):
    if f.endswith((".webp", ".png")): shutil.copy("images/" + f, "site/images/" + f)
# Illustrations des lieux et des événements (sous-dossiers)
for sd in ["lieux", "evenements", "combat", "blasons", "ligues", "zombies", "icones", "immeuble", "barricades", "feux", "personnages", "folie", "avantposte", "avantposte/secteurs", "avantposte/reperes", "avantposte/sol6", "avantposte/bat4"]:  # AVANT-POSTE : dossier images/avantposte
    if os.path.isdir("images/" + sd):
        os.makedirs("site/images/" + sd)
        for f in os.listdir("images/" + sd):
            if f.endswith(".webp"): shutil.copy("images/" + sd + "/" + f, "site/images/" + sd + "/" + f)
for f in os.listdir("sons"): shutil.copy("sons/" + f, "site/sons/" + f)

# Hébergement o2switch (2026-11-14) : le .htaccess du jeu (https, nom zombria.com, sw.js jamais en cache)
shutil.copy("htaccess-o2switch.txt", "site/.htaccess")
shutil.copy("images/partage.jpg", "site/images/partage.jpg")  # image de partage (réseaux sociaux)
# Le serveur Node.js d'o2switch fait tourner le même code que le Worker Cloudflare : copie à jour
shutil.copy("worker/index.js", "serveur-o2switch/worker.mjs")
shutil.copy("worker/avantposte.mjs", "serveur-o2switch/avantposte.mjs")  # AVANT-POSTE : module de la carte
shutil.copy("worker/compte.mjs", "serveur-o2switch/compte.mjs")  # COMPTES : connexion Google et sauvegarde

# Nouvelle version du cache hors connexion (date + heure)
version = "survival-" + time.strftime("%Y%m%d-%H%M")
sw = open("site/sw.js", encoding="utf-8").read()
sw = re.sub(r'var VERSION = "[^"]*";', 'var VERSION = "' + version + '";', sw)
open("site/sw.js", "w", encoding="utf-8").write(sw)
# Numéro de version sur les scripts et styles de la page (2026-11-16) : le navigateur est obligé de les recharger
# à chaque mise à jour, même s'il garde une vieille copie en mémoire
v = time.strftime("%Y%m%d%H%M")
for page in ("site/index.html",):
    h = open(page, encoding="utf-8").read()
    h = re.sub(r'(src|href)="((?!https?:|//)[^"?]+\.(?:js|css))"', lambda m: m.group(1) + '="' + m.group(2) + '?v=' + v + '"', h)
    open(page, "w", encoding="utf-8").write(h)
print("Dossier site prêt (" + version + ")")
