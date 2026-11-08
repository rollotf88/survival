var $=function(i){return document.getElementById(i)};
var R=function(a,b){return a+Math.floor(Math.random()*(b-a+1))};
/* ===== DONNÉES ===== */
var IT={
eau:["Bidon d’eau","💧",2,{eau:2},"2 jours d’eau pour la famille"],
conserves:["Conserves","🥫",2,{nour:2},"2 jours de vivres"],
riz:["Sac de riz","🍚",2,{nour:3},"3 jours de vivres"],
biscuits:["Biscuits secs","🍪",1,{nour:1},"1 jour de vivres"],
soins:["Trousse de soins","🩹",1,{soins:2},"2 soins"],
antibio:["Antibiotiques","💊",1,{soins:3},"3 soins"],
hache:["Hache","🪓",2,{def:3},"Défense +3"],
batte:["Batte","🏏",2,{def:2},"Défense +2"],
couteau:["Couteau","🔪",1,{def:1},"Défense +1"],
outils:["Boîte à outils","🧰",2,{},"Ouvre les portes verrouillées"],
couv:["Couverture","🧣",1,{chaleur:1},"Nuits supportables"],
briquet:["Briquet","🔥",1,{chaleur:1},"Chaleur + lueur de secours"],
lampe:["Lampe torche","🔦",1,{piles:3},"Éclaire les lieux sombres (3 piles)"],
radio:["Radio","📻",1,{moral:1},"Révèle le danger des lieux"],
peluche:["Peluche d’Emma","🧸",1,{moral:2},"Moral +2"],
photo:["Photo de famille","🖼️",1,{moral:1},"Moral +1"],
cartes:["Jeu de cartes","🃏",1,{moral:1},"Moral +1"]};
var HS=[
{n:"Pavillon",e:"🏡",cap:10,it:{eau:2,conserves:2,biscuits:2,soins:1,antibio:1,couteau:1,couv:2,lampe:1,radio:1,peluche:1,photo:1,cartes:1,outils:1,briquet:1}},
{n:"Ferme",e:"🚜",cap:10,it:{riz:2,conserves:1,eau:3,hache:1,batte:1,outils:1,couv:2,briquet:1,soins:1,peluche:1,photo:1}},
{n:"Appart",e:"🏢",cap:8,it:{eau:2,conserves:2,biscuits:3,soins:1,antibio:2,couteau:1,couv:1,lampe:1,radio:1,cartes:1,photo:1,peluche:1,batte:1}}];
var FAM=[["👨","Papa"],["👩","Maman"],["👦","Léo"],["👧","Emma"]];
var LC=[
{n:"Maison voisine",e:"🏠",c:[],d:.2,l:{nour:[2,4],eau:[1,3],bois:[1,3]}},
{n:"Supermarché",e:"🛒",c:["sombre"],d:.4,l:{nour:[4,7],eau:[3,5]}},
{n:"Hôpital",e:"🏥",c:["sombre"],d:.6,l:{soins:[1,3],eau:[0,2]}},
{n:"Quincaillerie",e:"🔧",c:["verrouillé"],d:.35,l:{piles:[1,3],def:[0,1],bois:[2,4]}},
{n:"Zone industrielle",e:"🏭",c:["sombre","verrouillé"],d:.55,u:4,l:{nour:[3,6],soins:[1,2],bois:[3,6],def:[0,1]}},
{n:"Centre commercial",e:"🏬",c:["sombre"],d:.7,u:8,l:{nour:[6,10],eau:[4,7],soins:[1,3],piles:[1,2]}}];
var LB={nour:"🥫 vivres",eau:"💧 eau",bois:"🪵 bois",soins:"🩹 soins",piles:"🔋 piles",def:"🛡️ arme"};
/* ===== ÉTAT ===== */
var TL=60;var G={ph:"pick",h:R(0,2),pack:{},tl:TL,info:"Touche un objet pour le prendre, touche le sac pour le retirer."};
function used(){var u=0;for(var k in G.pack)u+=IT[k][2]*G.pack[k];return u}
function tot(){var t={eau:0,nour:0,soins:0,def:0,chaleur:0,moral:0,piles:0};for(var k in G.pack)for(var s in IT[k][3])t[s]+=IT[k][3][s]*G.pack[k];return t}
function lv(v){return v<35?"lo":v<70?"mid":""}
function bar(l,v){v=Math.max(0,Math.min(100,v));return'<div class="b"><span>'+l+'</span><div class="bar"><i class="'+lv(v)+'" style="width:'+v+'%"></i></div></div>'}
function has(k){return G.pack[k]>0}
/* ===== DÉPART ===== */
function rPick(){var H=HS[G.h],u=used(),free=cap()-u,cells="",tiles="";
for(var k in G.pack)for(var i=0;i<G.pack[k];i++){cells+='<button class="cell f" data-act="rem" data-id="'+k+'" aria-label="Retirer '+IT[k][0]+'">'+IT[k][1]+'</button>';if(IT[k][2]==2)cells+='<button class="cell f s" data-act="rem" data-id="'+k+'" aria-label="Retirer '+IT[k][0]+'">'+IT[k][1]+'</button>'}
for(var i=u;i<cap();i++)cells+='<div class="cell"></div>';
for(var k in H.it){var c=G.pack[k]||0,can=c<H.it[k]&&free>=IT[k][2];
tiles+='<button class="tile'+(can?"":" off")+'" data-act="add" data-id="'+k+'" aria-label="Prendre '+IT[k][0]+'">'+(c?'<span class="n">'+c+'</span>':"")+IT[k][1]+'<small>'+IT[k][2]+' pl.</small></button>'}
var tabs=HS.map(function(x,j){return'<button class="tab'+(j===G.h?" on":"")+'" data-act="house" data-id="'+j+'">'+x.e+' '+x.n+'<small>'+x.cap+' places</small></button>'}).join("");var tm=Math.max(0,G.tl),pc=Math.min(100,Math.round(tm/TL*100));
$("app").innerHTML='<div class="row"><h1>Jour 0</h1><span class="pill" id="tsec">⏱ '+Math.ceil(tm)+' s</span></div><div class="timer"><i id="tbar" class="'+(pc<30?"lo":"")+'" style="width:'+pc+'%"></i></div><div class="tabs">'+tabs+'</div>'
+'<div class="pk"><p class="sub" style="grid-area:sub">Ils arrivent ! Choisis ce que la famille emporte avant la fin du compte à rebours.</p>'
+'<div style="grid-area:bag"><div class="row"><b>Le sac</b><span class="pill">'+u+' / '+cap()+'</span></div><div class="bag">'+cells+'</div></div>'
+'<div class="stage" style="grid-area:tiles"><div class="tiles">'+tiles+'</div></div>'
+'<div class="sub" style="grid-area:info;min-height:34px"><b>'+G.info+'</b></div>'
+'<div class="row" style="grid-area:go"><button class="btn alt" style="flex:0 0 auto" data-act="adstart"'+(G.adS?" disabled":"")+'>📺 Bonus (pub)</button><button class="btn" data-act="start">Fermer la porte et partir</button></div></div>'}
function start(){var t=tot();G.ph="game";G.day=1;G.eau=t.eau*4;G.nour=t.nour*4;G.soins=t.soins;G.def=t.def;G.piles=t.piles;G.chaleur=t.chaleur;G.moral=Math.min(100,40+15*t.moral);G.nm=t.moral;G.sel=[];G.bois=0;G.ref={barr:0,eau:0,pot:0};G.ads=0;G.ls=LC.map(function(){return 100});G.lost=0;G.dd=[];
G.m=FAM.map(function(f){return{e:f[0],n:f[1],al:true,hp:100,faim:Math.min(100,50+10*t.nour),soif:Math.min(100,50+10*t.eau),went:false}})}
/* ===== JEU ===== */
function alive(){return G.m.filter(function(x){return x.al})}
function rGame(){var mo=G.moral>60?"😀":G.moral>30?"😐":"😟";
var m=G.m.map(function(x,i){var on=G.sel.indexOf(i)>=0,st=!x.al?"💀 Mort":x.went?"Rentré épuisé":on?"✔ Part fouiller":"Au refuge";
return'<div class="mc'+(on?" on":"")+(x.al?"":" dead")+'" data-act="sel" data-id="'+i+'" tabindex="0"><div><span class="em">'+x.e+'</span><b>'+x.n+'</b></div><small>'+st+'</small>'+bar("❤️",x.hp)+bar("🍽️",x.faim)+bar("💧",x.soif)+(x.al&&G.soins>0&&x.hp<100?'<button class="heal" data-act="heal" data-id="'+i+'">🩹 Soigner</button>':"")+'</div>'}).join("");
$("app").innerHTML='<div class="row"><h1>Jour '+G.day+'</h1><div class="chips"><span class="chip">💧 '+G.eau+'</span><span class="chip">🥫 '+G.nour+'</span><span class="chip">🩹 '+G.soins+'</span><span class="chip">🪵 '+G.bois+'</span>'+(has("lampe")?'<span class="chip">🔋 '+G.piles+'</span>':"")+'<span class="chip">🛡️ '+G.def+'</span><span class="chip">'+mo+' '+Math.round(G.moral)+'</span></div></div>'
+'<div class="stage"><div class="grid2">'+m+'</div><p class="sub">Touche 1 ou 2 membres pour les envoyer fouiller. Une ration d’eau et de vivres par personne et par jour.</p><button class="btn alt" style="width:100%;flex:none" data-act="ad"'+(G.ads>=2||!G.m.some(function(x){return x.al&&x.went})?" disabled":"")+'>📺 Expédition en plus ('+(2-G.ads)+' restantes)</button></div>'
+'<div class="row"><button class="btn" data-act="fouille"'+(G.sel.length?"":" disabled")+'>🔍 Fouiller'+(G.sel.length?" ("+G.sel.length+")":"")+'</button><button class="btn alt" data-act="refuge">🔨 Refuge</button><button class="btn alt" data-act="endday">🌙 Fin du jour</button></div>'}
function show(h){$("sheet").innerHTML=h;$("modal").style.display="flex"}
function hide(){$("modal").style.display="none"}
function openLoc(){var h='<h2>Où envoyer l’équipe ?</h2>';
LC.forEach(function(l,i){if(l.u&&G.day<l.u)return;var cd=l.c.map(function(c){return c==="sombre"?(has("lampe")&&G.piles>0?"🔦 lampe prête":has("briquet")?"🔥 lueur faible":"⚠️ dans le noir"):(has("outils")?"🧰 outils prêts":"⚠️ porte à forcer")}).join(" · ")||"Accès libre";
var dg=has("radio")?(l.d<.3?"Danger faible":l.d<.5?"Danger moyen":"Danger élevé"):"Danger inconnu";
h+='<button class="loc" data-act="loc" data-id="'+i+'"><b>'+l.e+' '+l.n+'</b> <span class="pill">'+G.ls[i]+' %</span><small>'+cd+' · '+dg+'</small></button>'});
show(h+'<button class="btn alt" style="width:100%" data-act="close">Annuler</button>')}
function hurt(x,d,n,c){x.hp-=d;if(x.hp<=0){x.hp=0;x.al=false;G.moral=Math.max(0,G.moral-25);n.push(["b2","💀 "+x.n+" est mort"+(c?" : "+c:"")+"."]);G.lost++;G.dd.push({n:x.n,c:c||"cause inconnue",j:G.day})}}
function loc(i){var L=LC[i],team=G.sel.map(function(j){return G.m[j]}),mult=1,d=L.d,n=[],lo={};
if(L.c.indexOf("sombre")>=0){if(has("lampe")&&G.piles>0){G.piles--;n.push(["g2","🔦 La lampe éclaire les lieux."])}else if(has("briquet")){mult*=.7;d+=.1;n.push(["","🔥 Le briquet donne une lueur faible."])}else{mult*=.5;d+=.25;n.push(["b2","🌑 Fouille à tâtons dans le noir."])}}
if(L.c.indexOf("verrouillé")>=0){if(has("outils"))n.push(["g2","🧰 Porte ouverte proprement."]);else{mult*=.5;d+=.15;n.push(["b2","🔒 Porte forcée à la brute, ça fait du bruit."])}}
if(G.moral<25){mult*=.75;n.push(["b2","😟 Moral bas : l’équipe fouille mal."])}
if(team.some(function(x){return x.n==="Léo"}))mult*=1.25;d+=Math.min(.3,G.day*.01);mult*=G.ls[i]/100;if(G.ls[i]<40)n.push(["b2","📭 Le lieu est presque vidé."]);G.ls[i]=Math.max(0,G.ls[i]-35);
if(Math.random()<d){var z=R(1,4+Math.floor(G.day/5)),p=G.def+team.length+(team.some(function(x){return x.n==="Papa"})?1:0);
if(p>=z){n.push(["g2","🧟 Un zombie surgit : abattu !"]);hurt(team[R(0,team.length-1)],R(0,8),n,"achevé par les blessures d’un combat contre un zombie")}
else{mult*=.5;n.push(["b2","🧟 Un zombie trop fort : fuite en urgence !"]);hurt(team[R(0,team.length-1)],R(20,40),n,"dévoré par un zombie pendant la fuite")}}
var g=[];for(var k in L.l){var q=Math.round(R(L.l[k][0],L.l[k][1])*mult);if(!q)continue;g.push(LB[k]+" +"+q);if(k==="nour")G.nour+=q;if(k==="eau")G.eau+=q;if(k==="soins")G.soins+=q;if(k==="piles")G.piles+=q;if(k==="def")G.def+=q;if(k==="bois")G.bois+=q}
team.forEach(function(x){x.went=true});G.sel=[];
var h='<h2>'+L.e+' '+L.n+'</h2><ul>'+n.map(function(a){return'<li class="'+a[0]+'">'+a[1]+'</li>'}).join("")+'</ul><p><b>'+(g.length?"Butin : "+g.join(", "):"Les mains vides.")+'</b></p><button class="btn" style="width:100%" data-act="close">Retour au refuge</button>';
render();show(h);if(!alive().length)over()}
function endday(){var n=[];
alive().forEach(function(x){x.faim-=30;x.soif-=30;x.went=false;
if(G.nour>0){G.nour--;x.faim+=30}else n.push(["b2",x.n+" n’a rien à manger."]);
if(G.eau>0){G.eau--;x.soif+=30}else n.push(["b2",x.n+" n’a rien à boire."]);
x.faim=Math.max(0,Math.min(100,x.faim));x.soif=Math.max(0,Math.min(100,x.soif));
if(x.faim<=0||x.soif<=0)hurt(x,20,n,x.soif<=0?"mort de soif":"mort de faim");else if(x.hp>0&&x.hp<100)x.hp=Math.min(100,x.hp+5);
if(!G.chaleur&&x.al)hurt(x,5,n,"mort de froid")});
if(!G.chaleur)n.push(["b2","🥶 Nuit glaciale, personne n’a de couverture."]);
if(Math.random()<Math.min(.8,.25+G.day*.02)){var s=1+Math.floor(G.day/4)+R(0,2),df=G.def+G.ref.barr*2;if(df>=s)n.push(["g2","🧟 Attaque de nuit repoussée (force "+s+")."]);else{var v=Math.min(G.nour,R(2,5));G.nour-=v;var al=alive();if(al.length)hurt(al[R(0,al.length-1)],R(15,35),n,"tué pendant l’attaque de nuit");n.push(["b2","🧟 Attaque de nuit (force "+s+") : "+v+" vivres perdus."])}}G.eau+=G.ref.eau*2;G.nour+=G.ref.pot*2;G.ls=G.ls.map(function(w){return Math.min(100,w+3)});if(false){var v=0;G.nour-=v;n.push(["b2","🕵️ Des pillards ont volé "+v+" vivres pendant la nuit."])}
G.moral=Math.max(0,Math.min(100,G.moral-7+2*G.nm));G.day++;G.ads=0;G.sel=[];
if(!n.length)n.push(["g2","Nuit calme."]);
render();show('<h2>Fin du jour '+(G.day-1)+'</h2><ul>'+n.map(function(a){return'<li class="'+a[0]+'">'+a[1]+'</li>'}).join("")+'</ul><button class="btn" style="width:100%" data-act="morning">Jour '+G.day+'</button>');
if(!alive().length)over()}
function over(){var d=G.day-1;if(d>BEST)BEST=d;var lv=G.ref.barr+G.ref.eau+G.ref.pot;show('<h2>Votre famille n’est plus</h2><p>Elle a tenu <b>'+d+' jour'+(d>1?"s":"")+'</b>.</p><ul>'+G.dd.map(function(z){return'<li>💀 '+z.n+' : '+z.c+' (jour '+z.j+')</li>'}).join("")+'<li>🔨 Améliorations du refuge : '+lv+'</li><li>🏆 Record : '+BEST+' jour'+(BEST>1?"s":"")+'</li></ul><button class="btn" style="width:100%" data-act="again">Nouvelle famille</button>')}
var BEST=0;var AD=null;
function equip(){var NC={eau:1,conserves:1,riz:1,biscuits:1,soins:1,antibio:1},h="",pd=0;
for(var k in G.pack){var it=IT[k];if(it[3].def)pd+=it[3].def*G.pack[k];if(NC[k])continue;var st=k==="lampe"?"🔋 "+G.piles+" pile"+(G.piles>1?"s":""):it[4];
h+='<div class="eq"><span class="em">'+it[1]+'</span><span><b>'+it[0]+(G.pack[k]>1?" ×"+G.pack[k]:"")+'</b><small>'+st+'</small></span></div>'}
var fd=G.def-pd;
return'<b>Équipement</b><div class="eqs">'+(h||'<small>Rien d’autre que vos mains.</small>')+'</div><p class="sub">🛡️ Défense : '+G.def+(G.ref.barr?' (+'+G.ref.barr*2+' la nuit grâce à la barricade)':'')+(fd>0?' · '+fd+' arme'+(fd>1?'s':'')+' trouvée'+(fd>1?'s':''):'')+'</p><b>Améliorations</b>'}
function cap(){return HS[G.h].cap+(G.cb||0)}
function openAd(kind){AD={k:kind,s:5};var tm=setInterval(function(){AD.s--;var b=$("adb"),t=$("adt");if(t)t.textContent=AD.s>0?"Pub en cours… "+AD.s+" s":"Récompense prête !";if(AD.s<=0){clearInterval(tm);if(b)b.disabled=false}},1000);
show('<h2>📺 Publicité (simulation)</h2><p class="sub">Ici s’affichera plus tard une vraie pub récompensée.</p><p id="adt"><b>Pub en cours… 5 s</b></p><button class="btn" id="adb" style="width:100%" disabled data-act="adok">Récupérer la récompense</button>')}
function tick(){if(G.ph!=="pick"||$("modal").style.display==="flex")return;G.tl-=.25;var tm=Math.max(0,G.tl),pc=Math.min(100,Math.round(tm/TL*100)),s=$("tsec"),b=$("tbar");if(s)s.textContent="⏱ "+Math.ceil(tm)+" s";if(b){b.style.width=pc+"%";b.className=pc<30?"lo":""}
if(G.tl<=0){start();render();show('<h2>Trop tard !</h2><p>Les zombies enfoncent la porte. Vous fuyez avec ce qu’il y a dans le sac.</p><button class="btn" style="width:100%" data-act="close">Courir</button>')}}
setInterval(tick,250);
var REF={barr:["🧱","Barricade",5,4,3,"Défense +2 la nuit par niveau"],eau:["🪣","Récupérateur d’eau",8,0,2,"+2 eau par jour"],pot:["🥕","Potager",10,0,2,"+2 vivres par jour"]};
function openRef(){var h='<h2>Le refuge</h2><p class="sub">Matériaux : 🪵 '+G.bois+'</p>'+equip();
for(var k in REF){var r=REF[k],l=G.ref[k],c=r[2]+r[3]*l,mx=l>=r[4];
h+='<button class="loc" data-act="build" data-id="'+k+'"'+(mx||G.bois<c?' style="opacity:.45"':"")+'><b>'+r[0]+' '+r[1]+' (niv. '+l+'/'+r[4]+')</b><small>'+r[5]+' · '+(mx?"Niveau max":"Coût : "+c+" 🪵")+'</small></button>'}
show(h+'<button class="btn alt" style="width:100%" data-act="close">Fermer</button>')}
var EV=[
{t:"🚪 Un survivant blessé",x:"Un inconnu frappe à la porte, il saigne. Il supplie qu’on le soigne.",c:[["Le soigner (−1 soin)",function(){if(G.soins<1)return"Vous n’avez plus de soins. Il repart en titubant.";G.soins--;G.nour+=4;return"Il guérit et vous laisse 4 vivres avant de repartir. 🥫"}],["Le chasser",function(){G.moral=Math.max(0,G.moral-10);return"Vous fermez la porte. Ses cris résonnent longtemps. Moral −10."}]]},
{t:"🧔 Un marchand louche",x:"Il propose 3 soins contre 6 vivres. Son sac est trop lourd pour être honnête.",c:[["Accepter",function(){if(G.nour<6)return"Vous n’avez pas assez de vivres, il s’en va.";G.nour-=6;G.soins+=3;return"Marché conclu : −6 vivres, +3 soins. 🩹"}],["Refuser",function(){return"Il hausse les épaules et disparaît dans la nuit."}]]},
{t:"🧸 Emma a peur",x:"Elle n’arrive pas à dormir et réclame une part en plus.",c:[["Lui donner une ration (−1 vivre)",function(){if(G.nour<1)return"Il ne reste rien à donner.";G.nour--;G.moral=Math.min(100,G.moral+10);return"Elle s’endort enfin. Moral +10."}],["La rassurer sans rien donner",function(){G.moral=Math.max(0,G.moral-6);return"Elle pleure longtemps. Moral −6."}]]},
{t:"💧 Voisins assoiffés",x:"Une famille voisine demande de l’eau. Ils ont l’air épuisés.",c:[["Donner 4 eau",function(){if(G.eau<4)return"Vous n’avez pas assez d’eau.";G.eau-=4;G.moral=Math.min(100,G.moral+8);return"Ils vous remercient. Moral +8."}],["Refuser",function(){return"Ils repartent sans un mot."}],["Les piller",function(){G.nour+=3;G.moral=Math.max(0,G.moral-15);var n=[],al=alive();if(Math.random()<.4)hurt(al[R(0,al.length-1)],R(15,30),n,"tué en pillant des voisins");return"Vous prenez 3 vivres. Moral −15."+(n.length?" Un des vôtres est blessé.":"")}]]}
];
function openEvent(){G.ev=EV[R(0,EV.length-1)];var h='<h2>'+G.ev.t+'</h2><p>'+G.ev.x+'</p>';G.ev.c.forEach(function(c,i){h+='<button class="loc" data-act="ev" data-id="'+i+'"><b>'+c[0]+'</b></button>'});show(h)}
function render(){G.ph==="pick"?rPick():rGame()}
document.addEventListener("click",function(e){var b=e.target.closest("[data-act]");if(!b||b.disabled)return;
var a=b.getAttribute("data-act"),id=b.getAttribute("data-id"),i=+id;
if(a==="add"){var H=HS[G.h],c=G.pack[id]||0;if(c<H.it[id]&&cap()-used()>=IT[id][2])G.pack[id]=c+1;G.info=IT[id][1]+" "+IT[id][0]+" : "+IT[id][4]}
else if(a==="rem"){G.pack[id]--;if(!G.pack[id])delete G.pack[id]}
else if(a==="house"){if(i!==G.h){G.h=i;G.pack={};G.info="Tu as changé de maison : le sac est vidé."}}
else if(a==="start")start();
else if(a==="sel"){var x=G.m[i];if(x.al&&!x.went){var p=G.sel.indexOf(i);if(p>=0)G.sel.splice(p,1);else if(G.sel.length<2)G.sel.push(i)}}
else if(a==="heal"){var y=G.m[i];if(G.soins>0&&y.al){G.soins--;y.hp=Math.min(100,y.hp+(y.n==="Maman"?60:40))}}
else if(a==="fouille"){openLoc();return}
else if(a==="loc"){hide();loc(i);return}
else if(a==="endday"){endday();return}
else if(a==="close"){hide();return}
else if(a==="refuge"){openRef();return}
else if(a==="adstart"){if(!G.adS){G.adS=true;openAd("start")}return}
else if(a==="ad"){if(G.ads<2)openAd("exp");return}
else if(a==="adok"){if(AD.k==="start"){show('<h2>Choisis ta récompense</h2><button class="loc" data-act="adr" data-id="cap"><b>🎒 +1 place dans le sac</b></button><button class="loc" data-act="adr" data-id="time"><b>⏱ +20 secondes</b></button>')}else{G.ads++;G.m.forEach(function(x){x.went=false});hide();render()}return}
else if(a==="adr"){if(id==="cap")G.cb=(G.cb||0)+1;else G.tl+=20;hide();render();return}
else if(a==="build"){var r=REF[id],l=G.ref[id],c=r[2]+r[3]*l;if(l<r[4]&&G.bois>=c){G.bois-=c;G.ref[id]++}render();openRef();return}
else if(a==="morning"){if(Math.random()<.6)openEvent();else hide();return}
else if(a==="ev"){var rs=G.ev.c[i][1]();G.ev=null;render();show('<h2>Résultat</h2><p>'+rs+'</p><button class="btn" style="width:100%" data-act="close">Continuer</button>');if(!alive().length)over();return}
else if(a==="again"){hide();G={ph:"pick",h:R(0,2),pack:{},tl:TL,info:"Touche un objet pour le prendre."}}
render()});
render();
