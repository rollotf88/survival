# preparer-site.py : refait le dossier « site » (la version installable du jeu
# hébergée sur Netlify) à partir des fichiers du jeu, et change la version de
# sw.js pour que les téléphones prennent la nouvelle version.
# Utilisation : python preparer-site.py
import os, shutil, re, time

ici = os.path.dirname(os.path.abspath(__file__))
os.chdir(ici)
FICHIERS = ["index.html", "style.css", "data.js", "icones.js", "logique.js", "ui.js", "guide.js", "piece.js", "manifest.json", "sw.js"]

if os.path.isdir("site"): shutil.rmtree("site")
os.makedirs("site/images"); os.makedirs("site/sons")
for f in FICHIERS: shutil.copy(f, "site/" + f)
for f in os.listdir("images"):
    if f.endswith((".webp", ".png")): shutil.copy("images/" + f, "site/images/" + f)
for f in os.listdir("sons"): shutil.copy("sons/" + f, "site/sons/" + f)

# Nouvelle version du cache hors connexion (date + heure)
version = "survival-" + time.strftime("%Y%m%d-%H%M")
sw = open("site/sw.js", encoding="utf-8").read()
sw = re.sub(r'var VERSION = "[^"]*";', 'var VERSION = "' + version + '";', sw)
open("site/sw.js", "w", encoding="utf-8").write(sw)
print("Dossier site prêt (" + version + ")")
