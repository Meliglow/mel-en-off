/* ===== Logiciel de réservation (démo interactive) =====
   Un seul état partagé : la vue client et la vue pro lisent et écrivent le même état.
   Tout est simulé dans le navigateur : aucun paiement, aucun envoi, aucune donnée transmise. */
const LV=(()=>{
const IMG=window.LV_IMG||{};
const ACT={
  esthetique:{label:'Institut de beauté',name:'Maison Éclat',tag:'Institut de beauté',img:'visage',theme:['#7A8B6F','#E6EBDF','#F7F8F4','#1F2A1C'],
    cats:[['visage','Soins du visage','visage','Éclat, hydratation, peeling'],['epil','Épilation définitive','epil','Laser, électrolyse'],['regard','Cils & sourcils','cils','Rehaussement, restructuration'],['corps','Massages','massage','Détente, dos et nuque'],['mains','Mains & pieds','ongles','Semi-permanent, beauté des pieds']],
    team:[['awa','Awa','#C98B6B','Soins visage · Massages','t_awa',['visage','corps']],['ines','Inès','#7FA56F','Épilation définitive','t_ines',['epil','visage']],['priya','Priya','#8C86C9','Cils · Ongles','t_priya',['regard','mains']]],
    svc:[['eclat','Soin visage éclat',60,65,'Nettoyage, gommage, masque et massage du visage.','visage'],['hydra','Soin hydratation intense',75,80,'Pour les peaux qui tiraillent.','visage'],['peel','Peeling doux',45,55,'Grain de peau affiné, sans éviction sociale.','visage'],
      ['electro15','Électrolyse 15 min',15,25,'Petites zones : lèvre, sourcils.','epil'],['electro30','Électrolyse 30 min',30,45,'Poil par poil, définitif : menton, joues.','epil'],['laserv','Laser visage',20,49,'Lèvre et menton, séance par zone.','epil'],['lasera','Laser aisselles',20,59,'Séance laser, peau rasée la veille.','epil'],
      ['rehaus','Rehaussement de cils',60,55,'Une courbure naturelle pour 6 à 8 semaines.','regard'],['sourcils','Restructuration sourcils',30,25,'Épilation et mise en forme.','regard'],
      ['massage','Massage relaxant',60,70,'Tout le corps, pression douce.','corps'],['dos','Dos & nuque',30,40,'Pour relâcher les tensions.','corps'],
      ['semi','Semi-permanent mains',45,35,'Mise en forme, cuticules et couleur.','mains'],['pieds','Beauté des pieds',60,45,'Soin complet et semi-permanent.','mains']],
    q:[['Première visite chez nous ?',['Oui','Non']],['Peau sensible ou allergie ?',['Non','Oui, je préciserai']],['Comment nous as-tu connus ?',['Instagram','Bouche-à-oreille','Google','Autre']]]},
  ongles:{label:'Ongles',name:'Studio Nacre',tag:'Prothésiste ongulaire',img:'ongles',theme:['#B07A6E','#F3E2DC','#FCF7F5','#2E1E1B'],
    team:[['priya','Priya','#B07A6E'],['lou','Lou','#7FA56F']],
    svc:[['semi','Semi-permanent mains',45,35,'Mise en forme, cuticules et couleur.'],['gel','Pose gel complète',90,60,'Forme et longueur au choix.'],['rempl','Remplissage gel',60,45,'Jusqu’à 4 semaines après la pose.'],['pieds','Beauté des pieds',60,45,'Soin complet et semi-permanent.']],
    q:[['Dépose à prévoir ?',['Non','Oui, chez moi','Oui, d’ailleurs']],['Forme souhaitée',['Amande','Carrée','Ronde','Je ne sais pas']]]},
  cils:{label:'Cils & sourcils',name:'L’Atelier Regard',tag:'Cils · Sourcils',img:'cils',theme:['#9A6B4F','#EFE1D6','#FBF6F1','#2B1D15'],
    team:[['nora','Nora','#9A6B4F'],['sami','Sami','#7C8FB0']],
    svc:[['rehaus','Rehaussement + teinture',60,55,'Une courbure naturelle pour 6 à 8 semaines.'],['ext','Extensions cil à cil',120,90,'Une pose sur mesure.'],['remp','Remplissage extensions',60,50,'Entre 2 et 3 semaines après la pose.'],['sourcils','Restructuration sourcils',30,25,'Épilation et mise en forme.']],
    q:[['Tu portes des lentilles ?',['Oui','Non']],['Déjà fait ce soin ?',['Oui','Non']]]},
  epil:{label:'Épilation & électrolyse',name:'Cabinet Lisse',tag:'Électrolyse · Épilation',img:'epil',theme:['#5E8A82','#DCEBE8','#F5F9F8','#16302C'],
    team:[['clara','Clara','#5E8A82'],['yasmine','Yasmine','#C98B6B']],
    svc:[['electro15','Électrolyse 15 min',15,25,'Pour les petites zones.'],['electro30','Électrolyse 30 min',30,45,'Menton, lèvre, sourcils…'],['jambes','Épilation jambes complètes',45,38,'À la cire tiède.'],['maillot','Épilation maillot',30,30,'Simple, échancré ou intégral.']],
    q:[['Première séance ?',['Oui','Non']],['Zone à traiter',['Menton','Lèvre','Sourcils','Corps'],1],['Peau sensible ?',['Oui','Non','Je ne sais pas']]]},
  massage:{label:'Massage',name:'Respire',tag:'Massages · Bien-être',img:'massage',theme:['#8A7552','#EEE5D3','#FAF7F0','#2A2316'],
    team:[['tom','Tom','#8A7552'],['maya','Maya','#7FA56F']],
    svc:[['relax','Massage relaxant',60,70,'Tout le corps, pression douce.'],['dos','Dos & nuque',30,40,'Pour relâcher les tensions.'],['pierres','Pierres chaudes',90,95,'Un moment de chaleur profonde.'],['reflexo','Réflexologie plantaire',45,55,'Détente par les pieds.']],
    q:[['Pression préférée',['Douce','Moyenne','Appuyée']],['Zone à éviter ?',['Aucune','Dos','Jambes','Je préciserai']]]},
  coiffure:{label:'Coiffure',name:'Boucles & Co',tag:'Coiffure · Cheveux texturés',img:'coiffure',theme:['#A4664A','#F1E0D5','#FBF6F2','#2C1A12'],
    team:[['lucia','Lucia','#A4664A'],['dina','Dina','#7C8FB0']],
    svc:[['coupe','Coupe + coiffage',60,55,'Coupe adaptée à ta texture.'],['soin','Soin profond',45,40,'Hydratation des longueurs.'],['coloration','Coloration',120,85,'Diagnostic inclus.'],['tresses','Tresses',180,120,'Prévoir tes mèches si besoin.']],
    q:[['Ton type de cheveux',['Raides','Ondulés','Bouclés','Crépus']],['Longueur',['Courts','Mi-longs','Longs']]]},
  barbier:{label:'Barbier',name:'Le Comptoir',tag:'Barbier · Coupe homme',img:'barbier',theme:['#5C6B4E','#E3E8DC','#F6F7F3','#1A2014'],
    team:[['karim','Karim','#5C6B4E'],['jules','Jules','#B07A6E']],
    svc:[['coupe','Coupe homme',30,25,'Shampoing et coiffage inclus.'],['barbe','Taille de barbe',20,18,'Contours au rasoir.'],['combo','Coupe + barbe',45,38,'La formule complète.'],['rasage','Rasage traditionnel',30,30,'Serviette chaude.']],
    q:[['Dernière coupe',['Moins d’un mois','1 à 3 mois','Plus']],['Style souhaité',['Comme d’habitude','Dégradé','Je montrerai une photo']]]},
  coaching:{label:'Coaching sportif',name:'Move Studio',tag:'Coaching sportif privé',img:'coaching',theme:['#4F6E8A','#DDE6EE','#F5F8FA','#132331'],
    team:[['mei','Mei','#4F6E8A'],['bastien','Bastien','#C98B6B']],
    svc:[['seance','Séance individuelle',60,60,'Programme adapté à ton objectif.'],['duo','Séance duo',60,80,'À deux, même prix partagé.'],['bilan','Bilan de départ',45,40,'Objectifs, mesures, plan.'],['express','Séance express',30,35,'Pour les journées chargées.']],
    q:[['Ton objectif',['Remise en forme','Perte de poids','Force','Mobilité']],['Ton niveau',['Débutant','Intermédiaire','Confirmé']],['Blessure à signaler ?',['Non','Oui, je préciserai']]]},
  tatouage:{label:'Tatouage',name:'Atelier Encre',tag:'Tatouage fine line',img:'tatouage',theme:['#3F3F46','#E5E5E7','#F7F7F8','#111114'],
    team:[['alex','Alex','#3F3F46']],
    svc:[['rdvprojet','Rendez-vous projet',30,0,'On parle de ton idée.'],['petit','Petit tatouage',60,90,'Jusqu’à 5 cm.'],['moyen','Tatouage moyen',120,180,'Jusqu’à 12 cm.'],['retouche','Retouche',30,0,'Dans les 3 mois.']],
    q:[['Zone',['Bras','Jambe','Dos','Autre']],['Premier tatouage ?',['Oui','Non']]]},
  yoga:{label:'Yoga & bien-être',name:'Shanti',tag:'Yoga privé · Respiration',img:'yoga',theme:['#7E6A9A','#E9E3F1','#F9F7FC','#231B30'],
    team:[['anika','Anika','#7E6A9A']],
    svc:[['prive','Cours privé',60,55,'Adapté à ton niveau.'],['respi','Séance respiration',45,40,'Pour apaiser le stress.'],['decouverte','Séance découverte',45,30,'Ta première séance.'],['duo','Cours duo',60,75,'À deux.']],
    q:[['Ton niveau',['Jamais pratiqué','Débutant','Régulier']],['Ce que tu cherches',['Souplesse','Détente','Énergie'],1]]}
};
const SIMG={
  esthetique:{eclat:['visage',1,50,35],hydra:['visage',1,50,70],peel:['visage',1,30,90],electro15:['epil',1,50,25],electro30:['epil',1,50,50],laserv:['epil',1,50,75],lasera:['epil',1,50,95],rehaus:['cils',1,50,40],sourcils:['cils',1,50,80],massage:['massage',1,50,70],dos:['massage',1,50,30],semi:['ongles',1,50,55],pieds:['ongles',1,50,95]},
  ongles:{semi:['ongles',1,50,60],gel:['ongles',1,40,85],rempl:['ongles',1,70,70],pieds:['studio',1,30,60]},
  cils:{rehaus:['cils',1,50,50],ext:['cils',1,45,55],remp:['cils',1,60,35],sourcils:['cils',1,35,45]},
  epil:{electro15:['epil',1,50,45],electro30:['epil',1,55,45],jambes:['studio',1,50,50],maillot:['epil',1,40,80]},
  massage:{relax:['massage',1,50,60],dos:['massage',1,40,70],pierres:['massage',1,70,40],reflexo:['studio',1,70,60]},
  coiffure:{coupe:['coiffure',1,50,40],soin:['coiffure',1,60,45],coloration:['coiffure',1,30,30],tresses:['coiffure',1,60,65]},
  barbier:{coupe:['barbier',1,50,45],barbe:['barbier',1,70,60],combo:['barbier',1,40,40],rasage:['barbier',1,75,70]},
  coaching:{seance:['coaching',1,30,55],duo:['coaching',1,50,50],bilan:['coaching',1,75,45],express:['coaching',1,30,85]},
  tatouage:{rdvprojet:['tatouage',1,35,30],petit:['tatouage',1,50,80],moyen:['tatouage',1,50,55],retouche:['tatouage',1,65,70]},
  yoga:{prive:['yoga',1,75,60],respi:['yoga',1,25,35],decouverte:['yoga',1,50,50],duo:['yoga',1,50,60]}};
function sImg(x,cls){const m=(SIMG[S.act]||{})[x.id]||[(catBy(x.cat)||[])[2]||ACT[S.act].img,1,50,50];return `<span class="${cls}"><img src="${x.img||IMG[m[0]]||''}" alt="" style="object-position:${m[2]}% ${m[3]}%;transform:scale(${m[1]});transform-origin:${m[2]}% ${m[3]}%"></span>`}
const ORDER=['esthetique','ongles','cils','epil','coiffure','barbier','massage','coaching','tatouage','yoga'];
const SWATCH=[null,['#B5735A','#EAD3C6','#FBF6F2','#2A1E1A'],['#5E7D6A','#D5E2D6','#F5F8F4','#1D2A22'],['#C77D93','#F2D9E0','#FCF6F8','#3A1F28'],['#B08D57','#EDE3D0','#F7F4EE','#141414'],['#4F6E8A','#DDE6EE','#F5F8FA','#132331']];
const FIRST=['Camille','Nora','Julie','Sonia','Aya','Manon','Rania','Chloé','Fatou','Emma','Zoé','Lina','Hugo','Yanis','Léna','Sarah','Maël','Inès','Adam','Lou'];
const pad=n=>String(n).padStart(2,'0');
const key=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const toMin=t=>{const [h,m]=t.split(':').map(Number);return h*60+m};
const toT=m=>`${Math.floor(m/60)}:${pad(m%60)}`;
const eur=n=>{const r=Math.round(n*100)/100;return r===0?'Gratuit':r.toLocaleString('fr-FR',{minimumFractionDigits:r%1?2:0,maximumFractionDigits:2})+' €'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const OPEN0=[[9*60,13*60],[14*60,19*60]];
const today=new Date();today.setHours(0,0,0,0);
const DAYS=[...Array(14)].map((_,i)=>{const d=new Date(today);d.setDate(d.getDate()+i);return d});
const fmtDay=(d,o)=>d.toLocaleDateString('fr-FR',o);
function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}

const S={act:'esthetique',acompte:30,closed:new Set([0]),swatch:0,listeners:new Set(),feed:[],lastNew:null};
function setup(act){
  const A=ACT[act];S.act=act;S.swatch=0;
  S.team=A.team.map(([id,n,c,role,ph,sk])=>({id,n,c,role,ph,sk,on:true}));
  S.svc=A.svc.map(([id,n,d,p,desc,cat])=>({id,n,d,p,desc,cat,on:true,prep:null,pros:null}));S.gap=10;S.goal=12000;
  if(act==='esthetique'){S.svc.forEach(x=>{if(x.id==='laserv'||x.id==='lasera'){x.pros=['ines'];x.prep=15}if(x.id==='massage')x.prep=15})}
  const e=new Date(today);e.setDate(e.getDate()+40);
  S.promo={on:true,svcs:[S.svc[0].id],pct:20,txt:'Offre de fin d’année : -20 % sur le soin éclat',end:key(e)};
  S.color=null;S.logo=null;S.hero=null;S.hours={o:540,c:1140,pause:true};
  S.gcal={on:true,cal:'Agenda pro',block:true,add:true};S.notif={conf:true,rappel:true,avis:false};
  const o1=new Date(today);o1.setDate(o1.getDate()+9);const o2=new Date(today);o2.setDate(o2.getDate()+12);const o3=new Date(today);o3.setDate(o3.getDate()+34);const o4=new Date(today);o4.setDate(o4.getDate()+35);
  S.off=A.team.length>2?[{who:A.team[2][0],from:key(o1),to:key(o2),why:'Congés'},{who:'all',from:key(o3),to:key(o4),why:'Fermeture de l’institut'}]:[];
  S.closed=new Set([0,1]);
  S.feed=[];S.lastNew=null;
  // rendez-vous fictifs déjà présents
  S.book=[];S.clients=[];
  DAYS.forEach((d,i)=>{if(S.closed.has(d.getDay()))return;S.team.forEach((p,j)=>{
    const h=hash(key(d)+p.id+act);const n=2+(h%3);
    if(i>0&&hash(key(d)+act)%6===2){for(let m=9*60;m<19*60;m+=30){const s=S.svc[0];if(free(key(d),m,s.d,p.id))S.book.push({date:key(d),t:m,pro:p.id,svc:s.id,cl:FIRST[(h+m)%FIRST.length]+' '+String.fromCharCode(65+(h+m)%26)+'.',paid:s.p*S.acompte/100})}return}
    for(let k=0;k<n;k++){const s=S.svc[(h>>>(k*3))%S.svc.length];const start=[9*60,10*60+30,14*60,15*60+30,17*60][(h>>>(k*4+2))%5];
      if(free(key(d),start,s.d,p.id))S.book.push({date:key(d),t:start,pro:p.id,svc:s.id,cl:FIRST[(h>>>(k*5))%FIRST.length]+' '+String.fromCharCode(65+(h>>>k)%26)+'.',paid:s.p*S.acompte/100})}})});
  for(let i=14;i<60;i++){const d=new Date(today);d.setDate(d.getDate()+i);if(S.closed.has(d.getDay()))continue;const k=key(d);S.team.forEach(p=>{const h=hash(k+p.id+'f'+act),n=Math.max(0,3-Math.floor(i/15))+(h%2);for(let j=0;j<n;j++){const x=S.svc[(h>>>(j*3))%S.svc.length];if(!elig(x).some(y=>y.id===p.id))continue;const st=[570,630,690,840,900,960,1020][(h>>>(j*4+1))%7];if(free(k,st,x.d,p.id,pp(x)))S.book.push({date:k,t:st,pro:p.id,svc:x.id,cl:'',paid:x.p*S.acompte/100})}})}
  const deacc=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  S.clients=[...Array(36)].map((_,i)=>{const f=FIRST[i%FIRST.length],h=hash('cl'+i+act),L=String.fromCharCode(65+h%26),t='06 '+[1,2,3,4].map(k=>pad((h>>>(k*6))%100)).join(' ');return {n:f+' '+L+'.',email:deacc(f)+'.'+L.toLowerCase()+(h%90+10)+'@exemple.fr',tel:t,visits:0,fav:null,last:null}});
  S.book.forEach(b=>{b.cl=S.clients[hash(b.date+b.t+b.pro)%S.clients.length].n});
  const W=[5,3,2,3,2,2,1,4,2,3,2,3,1];S.hist=[];
  for(let i=0;i<=190;i++){const d=new Date(today);d.setDate(d.getDate()-i);if(S.closed.has(d.getDay()))continue;const k=key(d);
    S.team.forEach(p=>{if(offOn(k,p.id))return;const pool=S.svc.filter(x=>elig(x).some(y=>y.id===p.id));if(!pool.length)return;const tot=pool.reduce((t,x)=>t+(W[S.svc.indexOf(x)]||1),0);
      const h=hash(k+p.id+'h'),n=Math.max(1,Math.round((2+h%4)*(0.78+(190-i)/700)));
      for(let j=0;j<n;j++){const hh=hash(k+p.id+'r'+j);let r=hh%tot,x=pool[0];for(const y of pool){r-=(W[S.svc.indexOf(y)]||1);if(r<0){x=y;break}}
        const c=S.clients[(hh>>>7)%S.clients.length];S.hist.push({date:k,t:[570,630,690,840,900,960,1020][(hh>>>3)%7],pro:p.id,svc:x.id,p:x.p,cl:c.n})}})}
  S.clients.forEach(c=>{const H=S.hist.filter(b=>b.cl===c.n);c.visits=H.length;c.last=H.length?H[0].date:null;const cnt={};H.forEach(b=>cnt[b.svc]=(cnt[b.svc]||0)+1);c.fav=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0]||null});
  S.clients.sort((a,b)=>(b.last||'').localeCompare(a.last||''));
  emit();
}
function theme(){if(S.color){const c=S.color;return `--a:${c};--soft:color-mix(in srgb,${c} 18%,#fff);--abg:color-mix(in srgb,${c} 5%,#fff);--aink:color-mix(in srgb,${c} 25%,#151515)`}const t=S.swatch?SWATCH[S.swatch]:ACT[S.act].theme;return `--a:${t[0]};--soft:${t[1]};--abg:${t[2]};--aink:${t[3]}`}
function logo(A){return S.logo?`<span class="lc-logo img"><img src="${S.logo}" alt=""></span>`:`<span class="lc-logo">${A.name[0]}</span>`}
function av(p,st=''){return IMG[p.ph]?`<span class="lc-av ph" style="${st}"><img src="${IMG[p.ph]}" alt=""></span>`:`<span class="lc-av" style="background:${p.c};${st}">${p.n[0]}</span>`}
function skilled(cat){const cs=(Array.isArray(cat)?cat:[cat]).filter(Boolean);const r=S.team.filter(p=>p.on&&(!p.sk||cs.every(c=>p.sk.includes(c))));return r.length?r:S.team.filter(p=>p.on)}
function catBy(id){return (ACT[S.act].cats||[]).find(c=>c[0]===id)}
function svcBy(id){return S.svc.find(s=>s.id===id)}
function proBy(id){return S.team.find(p=>p.id===id)}
function promoOk(){return S.promo.on&&(!S.promo.end||key(today)<=S.promo.end)}
function price(s){if(s.ids&&s.ids.length>1)return s.ids.reduce((t,id)=>t+price(svcBy(id)),0);return promoOk()&&S.promo.svcs.includes(s.id)?s.p*(1-S.promo.pct/100):s.p}
function offOn(date,pro){return (S.off||[]).some(o=>(o.who==='all'||o.who===pro)&&date>=o.from&&date<=o.to)}
function openR(){const h=S.hours||{o:540,c:1140,pause:true};return h.pause?[[h.o,780],[840,h.c]]:[[h.o,h.c]]}
function bd(b){return b.d||(svcBy(b.svc)||{d:30}).d}
function bn(b){return b.n||(svcBy(b.svc)||{n:''}).n}
function pp(s){return s&&s.prep!=null?s.prep:(S.gap!=null?S.gap:10)}
function bp(b){return b.prep!=null?b.prep:pp(svcBy(b.svc))}
function elig(s){const L=(s.ids||[s.id]).map(svcBy).filter(Boolean);const r=S.team.filter(p=>p.on&&L.every(x=>x.pros&&x.pros.length?x.pros.includes(p.id):(!p.sk||!x.cat||p.sk.includes(x.cat))));return r.length?r:(L.some(x=>x.pros&&x.pros.length)?[]:S.team.filter(p=>p.on))}
function free(date,start,dur,pro,prep){if(prep==null)prep=pp(null);return !offOn(date,pro)&&openR().some(([a,b])=>start>=a&&start+dur<=b)&&!S.book.some(b=>b.date===date&&b.pro===pro&&start<b.t+bd(b)+bp(b)&&b.t<start+dur+prep)}
function slots(date,dur,pra,cat){const res=[];const now=new Date();const isToday=date===key(today);
  const R0=openR();for(let m=R0[0][0];m<R0[R0.length-1][1];m+=30){if(isToday&&m<now.getHours()*60+now.getMinutes()+60)continue;
    const ob=cat&&typeof cat==='object'&&!Array.isArray(cat);const pros=pra==='any'?(ob?elig(cat):skilled(cat)).map(p=>p.id):[pra];const p=pros.find(id=>free(date,m,dur,id,ob?pp(cat):null));if(p)res.push([m,p])}return res}
function emit(){S.listeners.forEach(f=>f())}
function on(f){S.listeners.add(f)}

/* ---------- Vue client ---------- */
function client(el,opt={}){
  const U={svcs:[],cat:null,month:null,part:'all',step:0,svc:null,pra:null,date:null,t:null,ans:{},info:{prenom:'',nom:'',email:'',tel:''},gcal:false};
  const cur=()=>{const L=U.svcs.map(svcBy).filter(Boolean);if(!L.length)return null;if(L.length===1)return Object.assign({},L[0],{ids:[L[0].id],cats:[L[0].cat]});return {id:L[0].id,ids:L.map(x=>x.id),n:L.map(x=>x.n).join(' + '),d:L.reduce((t,x)=>t+x.d,0),p:L.reduce((t,x)=>t+x.p,0),cat:L[0].cat,cats:[...new Set(L.map(x=>x.cat))],desc:'',multi:true,prep:pp(L[L.length-1])}};
  const setS=a=>{U.svcs=a;U.svc=a[0]||null};
  const firstOpenDay=()=>{const s=cur();const d=DAYS.find(d=>!S.closed.has(d.getDay())&&(!s||slots(key(d),s.d,U.pra||'any',s).length));return key(d||DAYS[0])};
  const ok=()=>{switch(U.step){case 0:return true;case 1:return U.svcs.length>0&&elig(cur()).length>0;case 2:return !!U.pra;case 3:return U.t!=null;case 4:return ACT[S.act].q.every((q,i)=>(U.ans[i]||[]).length);case 5:return U.info.prenom.trim().length>1&&U.info.nom.trim().length>0&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(U.info.email.trim())&&U.info.tel.replace(/\D/g,'').length>=6;default:return true}};
  const go=d=>{if(d>0&&!ok())return;
    if(U.step===1&&d>0&&elig(cur()).length===1){U.pra=elig(cur())[0].id;U.step=3}
    else if(U.step===3&&d<0&&elig(cur()).length===1){U.step=1}
    else if(U.step===1&&d<0&&U.cat&&ACT[S.act].cats){U.cat=null}
    else if(U.step===6&&d>0){confirm();return}
    else if(U.step===7){Object.assign(U,{step:0,cat:null,svc:null,svcs:[],pra:null,t:null,ans:{},gcal:false});}
    else U.step=Math.max(0,U.step+d);
    if(U.step===3&&(!U.date||!slots(U.date,cur().d,U.pra,cur()).length)){U.date=firstOpenDay();U.month=null}
    render();el.querySelector('.lv-scroll')?.scrollTo(0,0)};
  function confirm(){const s=cur();const sl=slots(U.date,s.d,U.pra,s).find(x=>x[0]===U.t);const pro=sl?sl[1]:U.pra;
    const nm=(U.info.prenom.trim()||'Client')+' '+(U.info.nom.trim()[0]||'').toUpperCase()+'. (toi)';
    const b={date:U.date,t:U.t,pro,svc:s.id,svcs:s.ids,n:s.n,d:s.d,cl:nm,prep:pp(s),paid:price(s)*S.acompte/100,ans:ACT[S.act].q.map((q,i)=>[q[0],(U.ans[i]||[]).join(', ')]),isNew:true};
    S.book.forEach(x=>x.isNew=false);S.book.push(b);S.lastNew=b;
    S.clients.unshift({n:nm,visits:1,last:U.date,fav:s.id,isNew:true,ans:b.ans,tel:U.info.tel,email:U.info.email});
    const d=new Date(U.date+'T00:00');
    S.feed.unshift(['+','Nouvelle réservation',`${s.n} · ${fmtDay(d,{weekday:'short',day:'numeric',month:'short'})} à ${toT(U.t)} · ${proBy(pro).n}`],['€',`Acompte reçu · ${eur(b.paid)}`,'Versé directement sur ton compte'],['✓','Ajouté à Google Agenda','Email de confirmation envoyé au client']);
    U.step=7;emit();opt.onBook&&opt.onBook(b)}
  function render(){
    const A=ACT[S.act];el.setAttribute('style',theme());
    if(U.step<7){const k=U.svcs.filter(id=>svcBy(id)&&svcBy(id).on);if(k.length!==U.svcs.length){setS(k);if(!k.length&&U.step>1)U.step=1}}
    if(U.pra&&U.pra!=='any'&&(!proBy(U.pra)||!proBy(U.pra).on)&&U.step<7){U.pra=null;U.t=null;U.step=Math.min(U.step,2)}
    if(U.date&&S.closed.has(new Date(U.date+'T00:00').getDay())&&U.step<7){U.date=firstOpenDay();U.t=null}
    const s=cur();
    let h=`<div class="lc-top ${opt.inset?'inset':''}">${U.step>0&&U.step<7?'<button class="lc-back" data-a="back" aria-label="Retour">←</button>':''}<div class="lc-brand">${logo(A)}<div style="min-width:0"><div class="lc-name">${esc(A.name)}</div><div class="lc-sub">${esc(A.tag)}</div></div></div></div>`;
    if(U.step>0&&U.step<7)h+=`<div class="lc-dots">${[1,2,3,4,5,6].map(i=>`<i class="${i<=U.step?'on':''}"></i>`).join('')}</div>`;
    h+='<div class="lv-scroll">';
    if(U.step===0){
      
      h+=`<div class="lc-hero"><img src="${S.hero||IMG[A.img]||''}" alt=""><div class="ov"><h3>Réserve en 1 minute.</h3><p>Choisis ta prestation et ton créneau : c’est confirmé tout de suite.</p></div></div><div class="lc-body">`;
      if(promoOk()&&S.promo.svcs.length)h+=`<div class="lc-promo"><b>-${S.promo.pct} %</b><span>${esc(S.promo.txt||'Offre du moment')}${S.promo.end?`<small>Jusqu’au ${fmtDay(new Date(S.promo.end+'T00:00'),{day:'numeric',month:'long'})}</small>`:''}</span></div>`;
      h+=`<div class="lc-info"><span>⏱ Réponse immédiate</span><span>🔒 Acompte sécurisé</span></div><div class="lc-lbl">Nos prestations</div>`+(A.cats?A.cats.filter(c=>S.svc.some(x=>x.on&&x.cat===c[0])).map(c=>catCard(c)).join(''):S.svc.filter(x=>x.on).slice(0,3).map(x=>svcCard(x)).join(''))+`</div>`;
    }else if(U.step===1){
      h+=`<div class="lc-body"><div class="lc-h">${U.cat&&A.cats?esc(catBy(U.cat)[1]):'Que veux-tu réserver ?'}</div>`+(A.cats&&!U.cat?`<p class="lc-note" style="text-align:left;margin:-4px 0 2px">Choisis une catégorie.</p>`+A.cats.filter(c=>S.svc.some(x=>x.on&&x.cat===c[0])).map(c=>catCard(c,1)).join(''):(A.cats?`<p class="lc-note" style="text-align:left;margin:-4px 0 2px">${U.svcs.length&&!elig(cur()).length?'<b style="color:#B04A3A">Ces prestations sont faites par des personnes différentes : réserve-les en deux fois.</b>':'Tu peux en ajouter plusieurs, même dans d’autres catégories.'}</p><div class="lc-crumbs">`+A.cats.filter(c=>S.svc.some(x=>x.on&&x.cat===c[0])).map(c=>`<button class="lc-crumb" data-cat="${c[0]}" aria-pressed="${U.cat===c[0]}">${esc(c[1])}</button>`).join('')+`</div>`:'')+S.svc.filter(x=>x.on&&(!U.cat||x.cat===U.cat)).map(x=>svcCard(x,1)).join(''))+`</div>`;
    }else if(U.step===2){
      h+=`<div class="lc-body"><div class="lc-h">Avec qui ?</div><button class="lc-pro" data-pra="any" aria-pressed="${U.pra==='any'}"><span class="lc-av" style="background:#9A958A">★</span><span><b>Peu importe</b><small>Le premier créneau libre</small></span></button>`+elig(s).map(p=>`<button class="lc-pro" data-pra="${p.id}" aria-pressed="${U.pra===p.id}">${av(p)}<span><b>${esc(p.n)}</b><small>${esc(p.role||A.label)}</small></span></button>`).join('')+`</div>`;
    }else if(U.step===3){
      const sel=new Date(U.date+'T00:00');if(!U.month)U.month=new Date(sel.getFullYear(),sel.getMonth(),1);
      const M=U.month,first=(M.getDay()+6)%7,nd=new Date(M.getFullYear(),M.getMonth()+1,0).getDate();
      const lim=new Date(today);lim.setDate(lim.getDate()+60);
      const minM=new Date(today.getFullYear(),today.getMonth(),1),canPrev=M>minM,canNext=new Date(M.getFullYear(),M.getMonth()+1,1)<=lim;
      let cal=`<div class="lc-cal"><div class="lc-cal-h"><button data-a="mprev" aria-label="Mois précédent" ${canPrev?'':'disabled'}>‹</button><b>${fmtDay(M,{month:'long',year:'numeric'})}</b><button data-a="mnext" aria-label="Mois suivant" ${canNext?'':'disabled'}>›</button></div><div class="lc-cal-g">`+['L','M','M','J','V','S','D'].map(x=>`<span class="wd">${x}</span>`).join('')+'<span></span>'.repeat(first);
      for(let n=1;n<=nd;n++){const d=new Date(M.getFullYear(),M.getMonth(),n),k=key(d);let st='avail';
        if(d<today||d>lim||S.closed.has(d.getDay())||offOn(k,'__all'))st='off';else if(!slots(k,s.d,U.pra,s).length)st='full';
        cal+=`<button class="cd ${st} ${k===key(today)?'today':''}" ${st==='avail'?`data-date="${k}"`:'disabled'} aria-pressed="${U.date===k}" aria-label="${fmtDay(d,{weekday:'long',day:'numeric',month:'long'})}${st==='full'?', complet':st==='off'?', fermé':''}">${n}</button>`}
      cal+=`</div><div class="lc-leg"><span><i class="avail"></i>Disponible</span><span><i class="full"></i>Complet</span><span><i class="off"></i>Fermé</span></div></div>`;
      const all=slots(U.date,s.d,U.pra,s),sl=all.filter(([m])=>U.part==='all'||(U.part==='am'?m<13*60:m>=13*60));
      const pro=U.pra==='any'?'la première personne libre':(proBy(U.pra)||{}).n;
      h+=`<div class="lc-body"><div class="lc-h">Choisis ton créneau</div><div class="lc-pick">${cal}<div class="lc-right"><div class="lc-dayh"><b>${fmtDay(sel,{weekday:'long',day:'numeric',month:'long'})}</b><small>Avec ${esc(pro||'')}</small></div><div class="lc-seg" role="group" aria-label="Moment de la journée">`+[['all','Tous'],['am','Matin'],['pm','Après-midi']].map(([k,l])=>`<button data-part="${k}" aria-pressed="${U.part===k}" ${k!=='all'&&!all.some(([m])=>k==='am'?m<13*60:m>=13*60)?'disabled':''}>${l}</button>`).join('')+`</div>`;
      h+=`<div class="lc-slotbox"><b>Créneaux disponibles</b>`+(sl.length?`<div class="lc-slots">`+sl.map(([m])=>`<button class="lc-slot" data-t="${m}" aria-pressed="${U.t===m}">${toT(m).replace(':','h')}</button>`).join('')+`</div>`:`<p class="lc-empty">Plus de créneau sur ce moment. Essaie un autre jour.</p>`)+`</div></div></div><p class="lc-note">Les créneaux tiennent compte de la durée de la prestation (${s.d} min) et de l’agenda.</p></div>`;
    }else if(U.step===4){
      h+=`<div class="lc-body"><div class="lc-h">Avant ton rendez-vous</div><p class="lc-note" style="text-align:left;margin:-4px 0 2px">Quelques questions pour bien te recevoir.</p>`+A.q.map((q,i)=>`<div class="lc-q"><b>${esc(q[0])}</b><div class="lc-chips">${q[1].map(o=>`<button class="lc-chip" data-q="${i}" data-m="${q[2]?1:0}" data-v="${esc(o)}" aria-pressed="${(U.ans[i]||[]).includes(o)}">${esc(o)}</button>`).join('')}</div></div>`).join('')+`</div>`;
    }else if(U.step===5){
      h+=`<div class="lc-body"><div class="lc-h">Tes coordonnées</div><div class="lc-2col"><div class="lc-field"><label for="${el.id}-prenom">Prénom</label><input id="${el.id}-prenom" data-f="prenom" value="${esc(U.info.prenom)}" autocomplete="off" placeholder="Ton prénom"></div><div class="lc-field"><label for="${el.id}-nom">Nom</label><input id="${el.id}-nom" data-f="nom" value="${esc(U.info.nom)}" autocomplete="off" placeholder="Ton nom"></div></div><div class="lc-field"><label for="${el.id}-email">Email</label><input id="${el.id}-email" data-f="email" type="email" inputmode="email" value="${esc(U.info.email)}" autocomplete="off" placeholder="ton@email.fr"></div><div class="lc-field"><label for="${el.id}-tel">Téléphone</label><input id="${el.id}-tel" data-f="tel" inputmode="tel" value="${esc(U.info.tel)}" autocomplete="off" placeholder="06 12 34 56 78"></div><p class="lc-note" style="text-align:left">Ta confirmation arrive par email.</p><p class="lc-note" style="text-align:left">Démo : rien n’est enregistré ni envoyé.</p></div>`;
    }else if(U.step===6){
      const pr=price(s),a=pr*S.acompte/100,d=new Date(U.date+'T00:00'),sl=slots(U.date,s.d,U.pra,s).find(x=>x[0]===U.t),pro=proBy(sl?sl[1]:U.pra);
      h+=`<div class="lc-body"><div class="lc-h">Ton acompte</div><div class="lc-sum"><div><span>${esc(s.n)}</span><b>${eur(pr)}</b></div><div><span>Le</span><span>${fmtDay(d,{weekday:'short',day:'numeric',month:'short'})} à ${toT(U.t)}</span></div><div><span>Avec</span><span>${esc(pro?pro.n:'')}</span></div><div class="t"><span>À payer maintenant (${S.acompte} %)</span><span>${eur(a)}</span></div><div style="opacity:.6"><span>Reste sur place</span><span>${eur(pr-a)}</span></div></div><div class="lc-card"><div class="ln">4242 4242 4242 4242</div><div class="row"><div class="ln">12/29</div><div class="ln">123</div></div></div><div class="lc-secure">🔒 Paiement sécurisé · simulation</div></div>`;
    }else{
      const b=S.lastNew&&S.lastNew.cl.includes('(toi)')?S.lastNew:null,d=new Date(U.date+'T00:00');
      h+=`<div class="lc-body"><div class="lc-ok"><span class="c"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></span><div class="lc-h">C’est réservé, ${esc(U.info.prenom.trim())} !</div><p style="margin:0;opacity:.7;font-size:12px">${esc(s.n)}<br>${fmtDay(d,{weekday:'long',day:'numeric',month:'long'})} à ${toT(U.t)}</p></div><div class="lc-sum"><div><span>Acompte payé</span><b>${b?eur(b.paid):''}</b></div><div><span>Confirmation</span><span>Envoyée par email</span></div></div><button class="lc-gcal ${U.gcal?'done':''}" data-a="gcal">${U.gcal?'✓ Ajouté à ton agenda':'＋ Ajouter à mon agenda'}</button>${opt.hint?`<p class="lc-note">${opt.hint}</p>`:''}</div>`;
    }
    h+='</div>';
    const labels=['Réserver','Continuer','Continuer','Continuer','Continuer','Continuer',`Payer ${s?eur(price(s)*S.acompte/100):''}`,'Nouvelle réservation'];
    if(((U.step>=3&&U.step<=6)||U.step===1)&&s)h+=`<div class="lc-foot split"><div class="lc-fsum"><small>${U.svcs.length>1?U.svcs.length+' prestations':esc(s.n)} · ${dur(s.d)}</small><b>${eur(price(s))}</b></div><button class="lc-cta" data-a="next" aria-disabled="${!ok()}">${labels[U.step]} →</button></div>`;
    else if(U.step!==1&&U.step!==2)h+=`<div class="lc-foot"><button class="lc-cta" data-a="next" aria-disabled="${!ok()}">${labels[U.step]}</button></div>`;
    el.innerHTML=h;
  }
  function dur(m){return m<60?m+' min':Math.floor(m/60)+' h'+(m%60?' '+String(m%60).padStart(2,'0'):'')}
  function catCard(c,big){const n=S.svc.filter(x=>x.on&&x.cat===c[0]),min=Math.min(...n.map(x=>price(x)));return `<button class="lc-svc lc-cat ${big?'big':''}" data-cat="${c[0]}">${big?`<span class="ph"><img src="${IMG[c[2]]||''}" alt=""></span><span class="tx"><span><b>${esc(c[1])}</b><small>${esc(c[3])} · ${n.length} prestation${n.length>1?'s':''}</small></span><span class="pr"><small>dès</small>${eur(min)}</span></span>`:`<span class="th"><img src="${IMG[c[2]]||''}" alt=""></span><span><b>${esc(c[1])}</b><small>${esc(c[3])}</small></span><span class="pr"><small>dès</small>${eur(min)} ›</span>`}</button>`}
  function svcCard(x,big){const pr=price(x),promo=pr!==x.p;return big?`<button class="lc-svc big" data-svc="${x.id}" aria-pressed="${U.svcs.includes(x.id)}">${sImg(x,'ph')}<span class="addb">${U.svcs.includes(x.id)?'✓ Ajouté':'＋ Ajouter'}</span>${promo?`<span class="tagp">-${S.promo.pct} %</span>`:''}<span class="tx"><span><b>${esc(x.n)}</b><small>${x.d} min · ${esc(x.desc)}</small></span><span class="pr">${promo?`<s>${eur(x.p)}</s>`:''}${eur(pr)}</span></span></button>`:`<button class="lc-svc" data-svc="${x.id}" aria-pressed="${U.svcs.includes(x.id)}">${sImg(x,'th')}<span><b>${esc(x.n)}</b><small>${x.d} min · ${esc(x.desc)}</small></span><span class="pr">${promo?`<s>${eur(x.p)}</s>`:''}${eur(pr)}</span></button>`}
  el.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!el.contains(t))return;
    if(t.dataset.a==='back')return go(-1);
    if(t.dataset.a==='next'){if(U.step===0){U.step=1;render();return}return go(1)}
    if(t.dataset.a==='gcal'){U.gcal=true;render();return}
    if(t.dataset.cat){U.cat=t.dataset.cat;if(U.step===0)U.step=1;render();el.querySelector('.lv-scroll')?.scrollTo(0,0);return}
    if(t.dataset.svc){const id=t.dataset.svc;setS(U.svcs.includes(id)?U.svcs.filter(x=>x!==id):[...U.svcs,id]);U.t=null;U.pra=null;if(U.step===0)U.step=1;render();return}
    if(t.dataset.pra){U.pra=t.dataset.pra;U.t=null;render();setTimeout(()=>go(1),220);return}
    if(t.dataset.date){U.date=t.dataset.date;U.t=null;U.part='all';render();return}
    if(t.dataset.a==='mprev'||t.dataset.a==='mnext'){U.month=new Date(U.month.getFullYear(),U.month.getMonth()+(t.dataset.a==='mnext'?1:-1),1);render();return}
    if(t.dataset.part){U.part=t.dataset.part;U.t=null;render();return}
    if(t.dataset.t){U.t=+t.dataset.t;render();return}
    if(t.dataset.q!=null){const i=t.dataset.q,v=t.dataset.v,m=t.dataset.m==='1';let a=U.ans[i]||[];a=m?(a.includes(v)?a.filter(x=>x!==v):[...a,v]):[v];U.ans[i]=a;render();return}
  });
  el.addEventListener('input',e=>{const f=e.target.dataset.f;if(!f)return;U.info[f]=e.target.value;const c=el.querySelector('.lc-cta');if(c)c.setAttribute('aria-disabled',!ok())});
  on(render);render();
  return {reset(){Object.assign(U,{step:0,cat:null,svc:null,svcs:[],pra:null,t:null,ans:{},gcal:false});render()}};
}

/* ---------- Vue pro ---------- */
const ICO={today:'<path d="M3 12l9-8 9 8"/><path d="M5 10v10h14V10"/>',agenda:'<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/>',svc:'<path d="M4 6h16M4 12h16M4 18h10"/>',team:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.3"/>',clients:'<circle cx="12" cy="8" r="3.5"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/>',promo:'<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="8" cy="8" r="1.5"/>',set:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.8 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 13.8H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.8 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.8H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'};
ICO.off='<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2v4M16 2v4M3 10h18M9 14l6 5M15 14l-6 5"/>';
ICO.today='<path d="M4 20V11M10 20V5M16 20v-6M21 20H3"/>';ICO.resa='<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/>';
ICO.help='<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>';
function admin(el,opt={}){
  const U={av:'day',ap:'all',tab:'today',per:'month',rf:'up',rp:'all',q:'',rq:'',day:null,sel:null,offF:{who:'all',from:'',to:'',why:'Congés'},msg:{sub:'Bug',txt:'',sent:false},pctC:false};
  const tg=(k,v,l)=>`<button class="la-tgl" role="switch" aria-checked="${v}" data-tg="${k}" aria-label="${esc(l)}"><i></i></button>`;
  const z=v=>eur(v).replace('Gratuit','0 €');
  const hm=m=>String(Math.floor(m/60)).padStart(2,'0')+'h'+(m%60?String(m%60).padStart(2,'0'):'');
  const swRow=(lbl,sub,k,v)=>`<div class="la-row"><div class="grow"><b>${lbl}</b><small>${sub}</small></div>${tg(k,v,lbl)}</div>`;
  const upl=(k,txt,img)=>`<label class="la-up">${img?`<img src="${img}" alt="">`:''}<span>${txt}</span><input type="file" accept="image/*" data-up="${k}"></label>`;
  const who=w=>w==='all'?'Tout l’institut':(proBy(w)||{n:'?'}).n;
  const dRange=o=>{const f=new Date(o.from+'T00:00'),t=new Date(o.to+'T00:00'),O={day:'numeric',month:'short'};return o.from===o.to?fmtDay(f,O):'Du '+fmtDay(f,O)+' au '+fmtDay(t,O)};
  function render(){
    const A=ACT[S.act];el.setAttribute('style',theme());
    const openDays=DAYS.filter(d=>!S.closed.has(d.getDay()));
    if(!U.day)U.day=key(openDays[0]||DAYS[0]);
    const nav=[['today','Tableau de bord'],['resa','Réservations'],['agenda','Agenda'],['svc','Prestations'],['team','Équipe'],['off','Congés'],['clients','Clients'],['promo','Promotions'],['set','Réglages'],['help','Nous contacter']];
    let h=`<div class="la"><nav class="la-side" aria-label="Menu"><div class="la-brand">${logo(A)}<span class="lc-name">${esc(A.name)}</span></div>`+nav.map(([k,l])=>`<button class="la-nav ${U.tab===k?'on':''} ${k==='help'?'la-nhelp':''}" data-tab="${k}"><svg viewBox="0 0 24 24">${ICO[k]}</svg>${l}${k==='today'&&S.feed.length?`<span class="bdg">${S.feed.length/3}</span>`:''}</button>`).join('')+`</nav><div class="la-main">`;
    const tk=key(today);
    if(U.tab==='today'){
      const wk=S.book.filter(b=>b.date>=tk&&b.date<=key(DAYS[6]));
      h+=`<div class="la-h"><h4>Bonjour ${esc(S.team[0].n)}</h4><small>${fmtDay(today,{weekday:'long',day:'numeric',month:'long'})}</small></div>`;
      const st=stats(U.per),dl=st.prev?Math.round((st.cur-st.prev)/st.prev*100):0;
      h+=`<div class="la-card la-rev"><div class="la-rev-h"><div><small>Chiffre d’affaires · ${st.lbl}</small><b class="big">${z(st.cur)}</b><span class="dl ${dl>=0?'up':'down'}">${dl>=0?'▲':'▼'} ${Math.abs(dl)} %</span> <small>${st.vs} (${z(st.prev)})</small></div><div class="la-seg">${[['day','Jour'],['week','Semaine'],['month','Mois']].map(([k,l])=>`<button data-per="${k}" class="${U.per===k?'on':''}">${l}</button>`).join('')}</div></div>${chart(st.series)}<div class="la-kpis"><div class="la-kpi"><b>${st.n}</b><small>rendez-vous</small></div><div class="la-kpi"><b>${z(st.n?st.cur/st.n:0)}</b><small>panier moyen</small></div><div class="la-kpi"><b>${wk.length}</b><small>RDV à venir (7 j)</small></div></div></div>`;
      const mt=stats('month').cur,pc=Math.min(100,Math.round(mt/S.goal*100)),fut=S.book.filter(b=>b.date>tk&&b.date.slice(0,7)===tk.slice(0,7)).reduce((t,b)=>t+bpr(b),0);
      h+=`<div class="la-2c"><div class="la-card"><h5>Objectif du mois</h5><div class="la-goal"><b>${z(mt)}</b><small>sur <input class="la-in" type="number" min="0" step="100" data-goal value="${S.goal}"> €</small></div><div class="la-bar"><i style="width:${pc}%"></i></div><small class="la-help">${pc} % atteint · ${z(fut)} déjà réservés d’ici la fin du mois</small></div>`;
      const D=donut();h+=`<div class="la-card"><h5>Prestations les plus réservées <small class="la-cnt">30 derniers jours</small></h5><div class="la-donut">${D.svg}<div class="la-leg">${D.leg}</div></div></div></div>`;
      if(S.feed.length)h+=`<div class="la-card la-feed"><h5>Nouveau</h5><div class="la-list">`+S.feed.slice(0,6).map(f=>`<div class="la-row new"><span class="la-ic">${f[0]}</span><div class="grow"><b>${esc(f[1])}</b><small>${esc(f[2])}</small></div></div>`).join('')+`</div></div>`;
      else h+=`<p class="la-tip">Fais une réservation côté client : tu la verras arriver ici, avec l’acompte et les réponses au questionnaire.</p>`;
      const up=(S.off||[]).filter(o=>o.to>=tk).sort((a,b)=>a.from.localeCompare(b.from))[0];
      if(up)h+=`<p class="la-tip">🌴 Prochaine absence : <b>${esc(who(up.who))}</b>, ${dRange(up).toLowerCase()} (${esc(up.why)}). Les créneaux sont déjà bloqués.</p>`;
    }else if(U.tab==='resa'){
      const up=S.book.filter(b=>b.date>=tk).sort((a,b)=>(b.isNew-a.isNew)||a.date.localeCompare(b.date)||a.t-b.t),past=S.hist.filter(b=>b.date<tk).slice(0,40);
      const L=(U.rf==='up'?up:past).filter(b=>U.rp==='all'||b.pro===U.rp);
      h+=`<div class="la-h"><h4>Réservations</h4><small>${up.length} à venir</small></div><div class="la-bar2"><div class="la-seg">${[['up','À venir'],['past','Passées']].map(([k,l])=>`<button data-rf="${k}" class="${U.rf===k?'on':''}">${l}</button>`).join('')}</div><div class="la-seg">${[['all','Tout le monde'],...S.team.map(p=>[p.id,p.n])].map(([k,l])=>`<button data-rp="${k}" class="${U.rp===k?'on':''}">${esc(l)}</button>`).join('')}</div></div><input class="la-text la-search" type="search" data-rsearch placeholder="Rechercher un client ou une prestation" value="${esc(U.rq)}">`;
      h+=`<div class="la-list" data-flist>`+L.map(b=>{const d=new Date(b.date+'T00:00'),pr=proBy(b.pro)||{n:'?',c:'#999'};return `<div class="la-row la-res ${b.isNew?'new':''}" data-s="${esc((b.cl+' '+bn(b)).toLowerCase())}"><span class="la-dt"><b>${fmtDay(d,{day:'numeric'})}</b><small>${fmtDay(d,{month:'short'}).replace('.','')}</small></span><div class="grow"><b>${esc(b.cl)}</b><small>${toT(b.t)} · ${esc(bn(b))} · ${dur(bd(b))}</small></div><span class="la-who">${av(pr,'width:26px;height:26px;font-size:10px')}<span>${esc(pr.n)}</span></span><span class="la-st ${U.rf==='up'?(b.isNew?'new':''):'done'}">${U.rf==='up'?(b.isNew?'Nouvelle':'Confirmée'):'Terminée'}</span><b class="la-amt">${z(U.rf==='up'?bpr(b):b.p)}</b></div>`}).join('')+`</div><p class="la-tip" data-fnone hidden>Aucune réservation trouvée.</p>`;
    }else if(U.tab==='agenda'){
      const D0=new Date(U.day+'T00:00'),pros=S.team.filter(p=>U.ap==='all'||p.id===U.ap);
      const mon=add(D0,-((D0.getDay()+6)%7));
      const lbl=U.av==='day'?fmtDay(D0,{weekday:'long',day:'numeric',month:'long'}):U.av==='week'?'Du '+fmtDay(mon,{day:'numeric',month:'short'})+' au '+fmtDay(add(mon,6),{day:'numeric',month:'short'}):fmtDay(D0,{month:'long',year:'numeric'});
      h+=`<div class="la-h"><h4>Agenda</h4><small>${S.gcal.on?'Synchronisé avec Google Agenda':''}</small></div>`;
      h+=`<div class="la-agbar"><div class="la-seg">${[['day','Jour'],['week','Semaine'],['month','Mois']].map(([k,l])=>`<button data-av="${k}" class="${U.av===k?'on':''}">${l}</button>`).join('')}</div><div class="la-agnav"><button data-agn="-1" aria-label="Précédent">‹</button><b>${lbl}</b><button data-agn="1" aria-label="Suivant">›</button><button class="la-tdy" data-agn="0">Aujourd’hui</button></div></div>`;
      h+=`<div class="la-seg la-pf">${[['all','Toute l’équipe'],...S.team.map(p=>[p.id,p.n])].map(([k,l])=>{const p=proBy(k);return `<button data-ap="${k}" class="${U.ap===k?'on':''}">${p?`<i style="background:${p.c}"></i>`:''}${esc(l)}</button>`}).join('')}</div>`;
      const R0=openR(),H0=Math.floor(R0[0][0]/60)*60,H1=Math.ceil(R0[R0.length-1][1]/60)*60,px=U.av==='week'?.8:.9;
      const hrs=`<div>`+[...Array((H1-H0)/60)].map((_,i)=>`<div class="la-hr" style="height:${60*px}px">${H0/60+i}h</div>`).join('')+`</div>`;
      const evB=(b,p,k,lane,nl)=>{const d=bd(b),st=`top:${(b.t-H0)*px}px;height:${Math.max(d*px-2,14)}px;background:${p.c}2E;border-left:3px solid ${p.c};`+(nl>1?`left:calc(${lane/nl*100}% + 2px);right:auto;width:calc(${100/nl}% - 4px);`:'');const q=bp(b);
        return `<button class="la-ev ${b.isNew?'new':''} ${d*px<38?'sm':''}" data-ev="${k}" style="${st}" title="${toT(b.t)} · ${esc(bn(b))} · ${esc(b.cl)} · ${esc(p.n)}"><b>${toT(b.t)}${nl>1?'':' '+esc(bn(b))}</b><span>${esc(nl>1?b.cl.split(' ')[0]:b.cl)}</span></button>`+(q&&nl<2?`<div class="la-prep" style="top:${(b.t+d-H0)*px}px;height:${q*px}px;${nl>1?`left:calc(${lane/nl*100}% + 2px);right:auto;width:calc(${100/nl}% - 4px);`:''}"></div>`:'')};
      const offFor=(k,pid)=>(S.off||[]).find(o=>(o.who==='all'||o.who===pid)&&k>=o.from&&k<=o.to);
      if(U.av==='day'){const k=U.day,cl=S.closed.has(D0.getDay());
        h+=`<div class="la-cal"><div class="la-cal-h" style="grid-template-columns:38px repeat(${pros.length},1fr)"><span></span>`+pros.map(p=>`<span>${av(p,'width:22px;height:22px;font-size:10px')}${esc(p.n)} <small>${evs(k,p.id).length} RDV</small></span>`).join('')+`</div><div class="la-cal-b" style="grid-template-columns:38px repeat(${pros.length},1fr);height:${(H1-H0)*px}px">${hrs}`;
        pros.forEach(p=>{h+=`<div class="la-col">`;const of=offFor(k,p.id);
          if(cl)h+=`<div class="la-off">Fermé</div>`;else if(!p.on)h+=`<div class="la-off">Absent</div>`;else if(of)h+=`<div class="la-off">${esc(of.why)}</div>`;
          else{if(S.hours.pause)h+=`<div class="la-pause" style="top:${(780-H0)*px}px;height:${60*px}px">Pause</div>`;evs(k,p.id).forEach(([b,id])=>h+=evB(b,p,id,0,1))}
          h+=`</div>`});h+=`</div></div>`}
      else if(U.av==='week'){const ds=[...Array(7)].map((_,i)=>add(mon,i));
        h+=`<div class="la-cal la-wk"><div class="la-cal-h" style="grid-template-columns:34px repeat(7,1fr)"><span></span>`+ds.map(d=>`<button data-gday="${key(d)}" class="${key(d)===key(today)?'td':''}"><small>${fmtDay(d,{weekday:'short'}).replace('.','')}</small><b>${d.getDate()}</b></button>`).join('')+`</div><div class="la-cal-b" style="grid-template-columns:34px repeat(7,1fr);height:${(H1-H0)*px}px">${hrs}`;
        ds.forEach(d=>{const k=key(d);h+=`<div class="la-col">`;if(S.closed.has(d.getDay())||offFor(k,'__all'))h+=`<div class="la-off">Fermé</div>`;
          else pros.forEach((p,lane)=>{if(offFor(k,p.id)){if(pros.length===1)h+=`<div class="la-off">${esc(offFor(k,p.id).why)}</div>`;return}evs(k,p.id).forEach(([b,id])=>h+=evB(b,p,id,lane,pros.length))});h+=`</div>`});
        h+=`</div></div>`}
      else{const f=new Date(D0.getFullYear(),D0.getMonth(),1),st=(f.getDay()+6)%7,nd=new Date(D0.getFullYear(),D0.getMonth()+1,0).getDate();
        h+=`<div class="la-mo">`+['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(x=>`<span class="wd">${x}</span>`).join('')+'<span class="pad"></span>'.repeat(st);
        for(let i=1;i<=nd;i++){const d=new Date(f.getFullYear(),f.getMonth(),i),k=key(d),cl=S.closed.has(d.getDay())||offFor(k,'__all');
          const L=cl?[]:pros.flatMap(p=>evs(k,p.id).map(([b])=>[b,p])).sort((a,b)=>a[0].t-b[0].t);
          h+=`<button class="la-md ${cl?'cl':''} ${k===key(today)?'td':''}" data-gday="${k}"><b>${i}</b>`+(cl?`<small>Fermé</small>`:L.slice(0,3).map(([b,p])=>`<span class="ln"><i style="background:${p.c}"></i>${toT(b.t)} <em>${esc(bn(b))}</em></span>`).join('')+(L.length>3?`<small>+${L.length-3} autres</small>`:'')+(L.length?`<span class="cnt">${L.length}</span>`:''))+`</button>`}
        h+=`</div>`}
      if(U.sel!=null){const b=U.sel[0]==='h'?S.hist[+U.sel.slice(1)]:S.book[+U.sel.slice(1)];if(b)h+=detail(b)}
    
}else if(U.tab==='svc'){
      h+=`<div class="la-h"><h4>Prestations</h4><small>Photo, nom, durée, prix : tout se change ici</small></div>`;
      (A.cats||[[null,'Prestations']]).forEach(c=>{const L=S.svc.map((s,i)=>[s,i]).filter(([s])=>!c[0]||s.cat===c[0]);
        h+=`<div class="la-card"><h5>${esc(c[1])} <small class="la-cnt">${L.length}</small></h5><div class="la-list">`+L.map(([s,i])=>`<div class="la-row la-svc"><label class="la-thumb" title="Changer la photo">${sImg(s,'im')}<span>Photo</span><input type="file" accept="image/*" data-up="svc:${i}"></label><div class="grow"><input class="la-name" data-name="${i}" value="${esc(s.n)}" aria-label="Nom de la prestation"><small>${esc(s.desc)}</small></div><div class="la-ctl"><select class="la-sel" data-dur="${i}" aria-label="Durée">${[15,20,30,45,60,75,90,120,180].map(d=>`<option ${d===s.d?'selected':''} value="${d}">${d} min</option>`).join('')}</select><span class="la-eur"><input class="la-in" data-price="${i}" type="number" min="0" step="1" value="${s.p}" aria-label="Prix en euros"> €</span>${tg('svc:'+i,s.on,'En ligne')}</div><div class="la-svc-x"><span class="la-mini">Réalisée par</span><div class="la-chips sm">${S.team.map(p=>`<button data-sp="${i}:${p.id}" aria-pressed="${canDo(s,p)}">${av(p,'width:20px;height:20px;font-size:9px')}${esc(p.n)}</button>`).join('')}</div><label class="la-mini">Temps de préparation après<select class="la-sel" data-prep="${i}">${[0,5,10,15,20,30,45].map(v=>`<option value="${v}" ${pp(s)===v?'selected':''}>${v?v+' min':'Aucun'}</option>`).join('')}</select></label></div></div>`).join('')+`</div><button class="la-add" data-a="addsvc" data-c="${c[0]||''}">＋ Ajouter une prestation${c[0]?' dans « '+esc(c[1])+' »':''}</button></div>`});
      h+=`<p class="la-tip">Clique sur une photo pour mettre la tienne. Choisis qui réalise chaque prestation : ton client ne verra que ces personnes. Le temps de préparation (nettoyage, changement de salle) bloque l’agenda après le rendez-vous.</p>`;
    }else if(U.tab==='team'){
      h+=`<div class="la-h"><h4>Équipe</h4><small>Chacun son agenda et ses prestations</small></div><div class="la-list">`+S.team.map((p,i)=>`<div class="la-row"><label class="la-thumb round" title="Changer la photo">${av(p,'width:44px;height:44px')}<input type="file" accept="image/*" data-up="team:${i}"></label><div class="grow"><b>${esc(p.n)}</b><small>${esc(p.role||'')}${p.role?' · ':''}${p.on?'Disponible':'Masqué côté client'}</small></div>${tg('team:'+i,p.on,'Disponible')}</div>`).join('')+`</div><button class="la-add" data-a="addteam">＋ Ajouter une personne</button><p class="la-tip">Pour des vacances, passe par l’onglet <b>Congés</b> : les créneaux se bloquent seulement sur les dates choisies.</p>`;
    }else if(U.tab==='off'){
      const L=(S.off||[]).slice().sort((a,b)=>a.from.localeCompare(b.from));const f=U.offF;
      h+=`<div class="la-h"><h4>Congés & fermetures</h4><small>Les créneaux se bloquent automatiquement côté client</small></div>`;
      h+=`<div class="la-card"><h5>Ajouter une absence</h5><div class="la-form"><label>Qui ?<select class="la-sel" data-off="who"><option value="all" ${f.who==='all'?'selected':''}>Tout l’institut (fermeture)</option>${S.team.map(p=>`<option value="${p.id}" ${f.who===p.id?'selected':''}>${esc(p.n)}</option>`).join('')}</select></label><div class="la-2"><label>Du<input class="la-date" type="date" data-off="from" min="${tk}" value="${f.from}"></label><label>Au<input class="la-date" type="date" data-off="to" min="${f.from||tk}" value="${f.to}"></label></div><label>Motif<select class="la-sel" data-off="why">${['Congés','Fermeture de l’institut','Formation','Jour férié','Maladie','Autre'].map(w=>`<option ${f.why===w?'selected':''}>${w}</option>`).join('')}</select></label><button class="la-btn" data-a="addoff" ${f.from?'':'disabled'}>Bloquer ces dates</button></div></div>`;
      h+=`<div class="la-card"><h5>Absences prévues</h5><div class="la-list">`+(L.length?L.map(o=>`<div class="la-row"><span class="la-ic">${o.who==='all'?'🔒':'🌴'}</span><div class="grow"><b>${esc(who(o.who))}</b><small>${dRange(o)} · ${esc(o.why)}</small></div><button class="la-x" data-deloff="${S.off.indexOf(o)}" aria-label="Supprimer">Supprimer</button></div>`).join(''):`<p class="la-tip">Aucune absence prévue.</p>`)+`</div></div>`;
    }else if(U.tab==='clients'){
      h+=`<div class="la-h"><h4>Clients</h4><small>${S.clients.length} fiches</small></div><input class="la-text la-search" type="search" data-csearch placeholder="Rechercher par prénom, email ou téléphone" value="${esc(U.q)}"><div class="la-list" data-flist>`+S.clients.map(c=>{const f=c.fav&&svcBy(c.fav);return `<div class="la-row ${c.isNew?'new':''}" data-s="${esc((c.n+' '+(c.email||'')).toLowerCase())}" data-tel="${(c.tel||'').replace(/\D/g,'')}"><span class="lc-av" style="background:${c.isNew?'var(--aink)':'#C9C3B7'}">${esc(c.n[0])}</span><div class="grow"><b>${esc(c.n)}</b><small>${c.email?esc(c.email):''}${c.tel?' · '+esc(c.tel):''}</small><small>${c.visits} visite${c.visits>1?'s':''}${f?' · aime : '+esc(f.n):''}${c.last?' · dernière : '+fmtDay(new Date(c.last+'T00:00'),{day:'numeric',month:'short'}):''}</small>${c.ans?`<small>${c.ans.map(a=>esc(a[0])+' : '+esc(a[1])).join(' · ')}</small>`:''}</div></div>`}).join('')+`</div><p class="la-tip" data-fnone hidden>Aucun client trouvé.</p>`;
    }else if(U.tab==='promo'){
      const P=S.promo;
      h+=`<div class="la-h"><h4>Promotions</h4><small>Affichée en haut de ta page de réservation</small></div>${swRow('Promo en ligne',promoOk()?'Visible par tes clients':'Masquée','promo',P.on)}`;
      h+=`<div class="la-card"><h5>Ton message</h5><input class="la-text" data-ptxt maxlength="80" value="${esc(P.txt)}" placeholder="Ex. Offre de Noël : -20 % sur les soins visage"><small class="la-help">80 caractères max. C’est le texte que voient tes clients.</small></div>`;
      h+=`<div class="la-card"><h5>Prestations concernées <small class="la-cnt">${P.svcs.length}</small></h5><div class="la-chips">`+S.svc.map(s=>`<button data-psvc="${s.id}" aria-pressed="${P.svcs.includes(s.id)}">${P.svcs.includes(s.id)?'✓ ':''}${esc(s.n)}</button>`).join('')+`</div><div class="la-seg"><button data-a="pall">Tout sélectionner</button><button data-a="pnone">Tout retirer</button></div></div>`;
      const std=[10,15,20,30,50];h+=`<div class="la-card"><h5>Réduction</h5><div class="la-seg">${std.map(v=>`<button data-pct="${v}" class="${P.pct===v&&!U.pctC?'on':''}">-${v} %</button>`).join('')}<button data-a="pctc" class="${U.pctC||!std.includes(P.pct)?'on':''}">Autre</button></div>${U.pctC||!std.includes(P.pct)?`<label class="la-inl">-<input class="la-in" type="number" min="1" max="90" data-pctv value="${P.pct}"> %</label>`:''}</div>`;
      h+=`<div class="la-card"><h5>Fin de l’offre</h5><input class="la-date" type="date" data-pend min="${tk}" value="${P.end||''}"><small class="la-help">La promo disparaît toute seule après cette date.</small></div>`;
    }else if(U.tab==='set'){
      const H=S.hours,G=S.gcal,N=S.notif,cur=S.color||(S.swatch?SWATCH[S.swatch]:A.theme)[0];
      h+=`<div class="la-h"><h4>Réglages</h4><small>Tout est modifiable, à tout moment</small></div>`;
      h+=`<div class="la-card"><h5>Ton image</h5><div class="la-ups">${upl('logo','Ton logo',S.logo)}${upl('hero','Photo d’accueil',S.hero||IMG[A.img])}</div><small class="la-help">Remplace par tes vraies photos, en un clic.</small></div>`;
      h+=`<div class="la-card"><h5>Ta couleur</h5><div class="la-sw">${SWATCH.map((t,i)=>{const c=(t||A.theme)[0];return `<button data-sw="${i}" class="${!S.color&&S.swatch===i?'on':''}" style="background:${c}" aria-label="Couleur ${i+1}"></button>`}).join('')}<label class="la-pick ${S.color?'on':''}" title="Choisir n’importe quelle couleur"><input type="color" data-color value="${cur}"><span>🎨</span></label></div><small class="la-help">N’importe quelle couleur, par exemple celle de ton logo.</small></div>`;
      h+=`<div class="la-card la-g"><h5><span class="gdot"></span>Google Agenda</h5>${swRow('Synchronisation',G.on?'Connecté · mise à jour en continu':'Déconnecté','g:on',G.on)}${G.on?`<label class="la-lbl">Agenda utilisé<select class="la-sel" data-gcal>${['Agenda pro','Agenda perso','Maison Éclat'].map(c=>`<option ${G.cal===c?'selected':''}>${c}</option>`).join('')}</select></label>${swRow('Bloquer mes indisponibilités','Un RDV perso dans ton agenda ferme le créneau','g:block',G.block)}${swRow('Ajouter chaque réservation','Le RDV apparaît dans ton agenda avec les infos du client','g:add',G.add)}`:''}</div>`;
      h+=`<div class="la-card"><h5>Emails automatiques aux clients</h5>${swRow('Confirmation','Dès la réservation','n:conf',N.conf)}${swRow('Rappel','24 h avant le rendez-vous','n:rappel',N.rappel)}${swRow('Demande d’avis','Le lendemain du rendez-vous','n:avis',N.avis)}</div>`;
      const opts=(a,b,v)=>{let o='';for(let m=a;m<=b;m+=30)o+=`<option value="${m}" ${m===v?'selected':''}>${hm(m)}</option>`;return o};
      h+=`<div class="la-card"><h5>Horaires</h5><div class="la-2"><label class="la-lbl">Ouverture<select class="la-sel" data-hr="o">${opts(420,720,H.o)}</select></label><label class="la-lbl">Fermeture<select class="la-sel" data-hr="c">${opts(900,1320,H.c)}</select></label></div>${swRow('Pause déjeuner','13h – 14h, aucun RDV','pause',H.pause)}</div>`;
      h+=`<div class="la-card"><h5>Temps entre deux rendez-vous</h5><div class="la-seg">${[0,5,10,15,20,30].map(v=>`<button data-gap="${v}" class="${S.gap===v?'on':''}">${v?v+' min':'Aucun'}</button>`).join('')}</div><small class="la-help">Pour préparer, nettoyer ou changer de salle. Réglable aussi prestation par prestation.</small></div>`;
      h+=`<div class="la-card"><h5>Jours d’ouverture</h5><div class="la-chips">${[1,2,3,4,5,6,0].map(d=>`<button data-tg="day:${d}" aria-pressed="${!S.closed.has(d)}">${['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][d]}</button>`).join('')}</div></div>`;
      h+=`<div class="la-card"><h5>Acompte demandé</h5><div class="la-seg">${[0,20,30,50].map(v=>`<button data-acpt="${v}" class="${S.acompte===v?'on':''}">${v?v+' %':'Aucun'}</button>`).join('')}</div><small class="la-help">Versé directement sur ton compte. Fini les lapins.</small></div>`;
    }else if(U.tab==='help'){
      const M=U.msg;
      h+=`<div class="la-h"><h4>Nous contacter</h4><small>Un bug, une question, une modification ? On s’en occupe.</small></div>`;
      if(M.sent)h+=`<div class="la-card la-sent"><b>✓ Message envoyé</b><small>Réponse par email sous 24 h (jours ouvrés). Démo : rien n’est réellement envoyé.</small><button class="la-btn ghost" data-a="newmsg">Écrire un autre message</button></div>`;
      else h+=`<div class="la-card"><div class="la-form"><label>Sujet<div class="la-seg">${['Bug','Question','Modification'].map(s=>`<button data-sub="${s}" class="${M.sub===s?'on':''}">${s}</button>`).join('')}</div></label><label>Ton message<textarea class="la-text" rows="4" data-msg placeholder="${M.sub==='Bug'?'Explique ce qui se passe, sur quelle page…':M.sub==='Modification'?'Ex. changer une photo, ajouter une prestation…':'Pose ta question…'}">${esc(M.txt)}</textarea></label><label class="la-up small"><span>📎 Ajouter une capture d’écran</span><input type="file" accept="image/*"></label><button class="la-btn" data-a="send" ${M.txt.trim()?'':'disabled'}>Envoyer</button></div></div><p class="la-tip">Réponse sous 24 h (jours ouvrés), directement par email.</p>`;
    }
    h+='</div></div>';el.innerHTML=h;filt();
  }
  function evs(k,pid){return k>=key(today)?S.book.map((b,i)=>[b,'b'+i]).filter(([b])=>b.date===k&&b.pro===pid):S.hist.map((b,i)=>[b,'h'+i]).filter(([b])=>b.date===k&&b.pro===pid)}
  function bpr(b){return (b.svcs||[b.svc]).reduce((t,id)=>t+((svcBy(id)||{}).p||0),0)}
  function canDo(s,p){return s.pros&&s.pros.length?s.pros.includes(p.id):(!p.sk||!s.cat||p.sk.includes(s.cat))}
  function dur(m){return m<60?m+' min':Math.floor(m/60)+' h'+(m%60?' '+String(m%60).padStart(2,'0'):'')}
  function revB(a,b){const A=key(a),B=key(b);let t=0,n=0;S.hist.forEach(x=>{if(x.date>=A&&x.date<=B){t+=x.p;n++}});return [t,n]}
  const add=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
  function stats(per){const T=today,ser=[];let c,pv,lbl,vs;
    if(per==='day'){c=revB(T,T);pv=revB(add(T,-7),add(T,-7));lbl='aujourd’hui';vs='vs même jour la semaine dernière';for(let i=13;i>=0;i--){const d=add(T,-i);ser.push([fmtDay(d,{day:'numeric'}),revB(d,d)[0],S.closed.has(d.getDay())])}}
    else if(per==='week'){const m=add(T,-((T.getDay()+6)%7));c=revB(m,T);pv=revB(add(m,-7),add(T,-7));lbl='cette semaine';vs='vs même période semaine dernière';for(let i=11;i>=0;i--){const a=add(m,-7*i);ser.push([fmtDay(a,{day:'numeric',month:'numeric'}),revB(a,i?add(a,6):T)[0]])}}
    else{const f=new Date(T.getFullYear(),T.getMonth(),1),pf=new Date(T.getFullYear(),T.getMonth()-1,1),pe=new Date(T.getFullYear(),T.getMonth()-1,Math.min(T.getDate(),new Date(T.getFullYear(),T.getMonth(),0).getDate()));c=revB(f,T);pv=revB(pf,pe);lbl=fmtDay(T,{month:'long'});vs='vs même période le mois dernier';for(let i=5;i>=0;i--){const a=new Date(T.getFullYear(),T.getMonth()-i,1),e=i?new Date(T.getFullYear(),T.getMonth()-i+1,0):T;ser.push([fmtDay(a,{month:'short'}).replace('.',''),revB(a,e)[0]])}}
    return {cur:c[0],n:c[1],prev:pv[0],lbl,vs,series:ser}}
  function chart(ser){const W=600,H=150,n=ser.length,mx=Math.max(1,...ser.map(x=>x[1])),bw=W/n;
    return `<svg class="la-chart" viewBox="0 0 ${W} ${H+22}" preserveAspectRatio="none" role="img" aria-label="Chiffre d’affaires">`+[.25,.5,.75,1].map(f=>`<line x1="0" x2="${W}" y1="${H-H*f}" y2="${H-H*f}" class="gl"/>`).join('')+ser.map(([l,v,off],i)=>{const hh=Math.max(v?3:0,v/mx*(H-10));return `<g><title>${l} : ${z(v)}</title><rect x="${i*bw+bw*.18}" y="${H-hh}" width="${bw*.64}" height="${hh}" rx="5" class="${i===n-1?'cur':''}"/><text x="${i*bw+bw/2}" y="${H+16}" text-anchor="middle">${l}</text></g>`}).join('')+`</svg>`}
  function donut(){const lim=key(add(today,-30)),cnt={};let tot=0;S.hist.forEach(x=>{if(x.date>=lim){cnt[x.svc]=(cnt[x.svc]||0)+1;tot++}});
    const ks=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]),top=ks.slice(0,5).map(k=>[(svcBy(k)||{n:k}).n,cnt[k]]),rest=ks.slice(5).reduce((t,k)=>t+cnt[k],0);if(rest)top.push(['Autres',rest]);
    const C=['var(--a)','#C98B6B','#8C86C9','#5E8A82','#D9B44A','#CFC9BD'];let off=0;
    const svg=`<svg viewBox="0 0 42 42" class="la-dn"><circle cx="21" cy="21" r="15.915" fill="none" stroke="#EEE" stroke-width="7"/>`+top.map(([l,v],i)=>{const pc=v/tot*100,el=`<circle cx="21" cy="21" r="15.915" fill="none" stroke="${C[i]}" stroke-width="7" stroke-dasharray="${pc} ${100-pc}" stroke-dashoffset="${25-off}"><title>${esc(l)} : ${Math.round(pc)} %</title></circle>`;off+=pc;return el}).join('')+`<text x="21" y="20.5" text-anchor="middle" class="t1">${tot}</text><text x="21" y="26" text-anchor="middle" class="t2">RDV</text></svg>`;
    return {svg,leg:top.map(([l,v],i)=>`<div><i style="background:${C[i]}"></i><span>${esc(l)}</span><b>${Math.round(v/tot*100)} %</b></div>`).join('')}}
  function filt(){const box=el.querySelector('[data-flist]');if(!box)return;const raw=(U.tab==='clients'?U.q:U.rq).trim().toLowerCase(),dg=raw.replace(/\D/g,'');let k=0;
    box.querySelectorAll('[data-s]').forEach(r=>{const okk=!raw||r.dataset.s.includes(raw)||(dg.length>=2&&(r.dataset.tel||'').includes(dg));r.hidden=!okk;if(okk)k++});const nn=el.querySelector('[data-fnone]');if(nn)nn.hidden=k>0}
  function row(b){const d=new Date(b.date+'T00:00');return `<div class="la-row ${b.isNew?'new':''}">${av(proBy(b.pro)||{n:'?',c:'#999'},'width:30px;height:30px;font-size:11px')}<div class="grow"><b>${toT(b.t)} · ${esc(bn(b))}</b><small>${fmtDay(d,{weekday:'short',day:'numeric'})} · ${esc(b.cl)} · acompte ${z(b.paid)}</small></div></div>`}
  function detail(b){const ids=b.svcs||[b.svc],tot=b.p!=null?b.p:ids.reduce((t,id)=>t+price(svcBy(id)||{p:0}),0),paid=b.paid!=null?b.paid:tot;return `<div class="la-detail"><button class="x" data-a="close" aria-label="Fermer">×</button><b>${esc(b.cl)}</b><small>${esc(bn(b))} · ${toT(b.t)} – ${toT(b.t+bd(b))} · avec ${esc(proBy(b.pro).n)}</small><small>${b.paid!=null?`Acompte reçu : ${z(paid)} · reste ${z(tot-paid)}`:`Payé : ${z(tot)}`}</small>${b.ans?b.ans.map(a=>`<small>${esc(a[0])} : <b style="display:inline">${esc(a[1])}</b></small>`).join(''):'<small style="opacity:.6">Questionnaire rempli à la réservation</small>'}</div>`}
  el.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!el.contains(t))return;
    if(t.dataset.tab){U.tab=t.dataset.tab;U.sel=null;render();el.querySelector('.la-main')?.scrollTo(0,0);return}
    if(t.dataset.day){U.day=t.dataset.day;U.sel=null;render();return}
    if(t.dataset.ev!=null){U.sel=t.dataset.ev;render();return}
    if(t.dataset.av){U.av=t.dataset.av;U.sel=null;render();return}
    if(t.dataset.ap){U.ap=t.dataset.ap;render();return}
    if(t.dataset.gday){U.day=t.dataset.gday;U.av='day';U.sel=null;render();return}
    if(t.dataset.agn!=null){const n=+t.dataset.agn,D=new Date(U.day+'T00:00');U.sel=null;
      if(!n)U.day=key(today);else if(U.av==='day'){let x=add(D,n);for(let g=0;g<7&&S.closed.has(x.getDay());g++)x=add(x,n);U.day=key(x)}else if(U.av==='week')U.day=key(add(D,7*n));else U.day=key(new Date(D.getFullYear(),D.getMonth()+n,1));render();return}
    if(t.dataset.a==='close'){U.sel=null;render();return}
    if(t.dataset.tg){const [k,i]=t.dataset.tg.split(':');
      if(k==='svc'){const s=S.svc[i];if(s.on&&S.svc.filter(x=>x.on).length===1)return;s.on=!s.on}
      if(k==='team'){const p=S.team[i];if(p.on&&S.team.filter(x=>x.on).length===1)return;p.on=!p.on}
      if(k==='promo')S.promo.on=!S.promo.on;
      if(k==='pause')S.hours.pause=!S.hours.pause;
      if(k==='g')S.gcal[i]=!S.gcal[i];
      if(k==='n')S.notif[i]=!S.notif[i];
      if(k==='day'){const d=+i;if(!S.closed.has(d)&&7-S.closed.size===1)return;S.closed.has(d)?S.closed.delete(d):S.closed.add(d)}
      emit();return}
    if(t.dataset.per){U.per=t.dataset.per;render();return}
    if(t.dataset.rf){U.rf=t.dataset.rf;render();return}
    if(t.dataset.rp){U.rp=t.dataset.rp;render();return}
    if(t.dataset.gap!=null){S.gap=+t.dataset.gap;emit();return}
    if(t.dataset.sp){const [i,pid]=t.dataset.sp.split(':'),x=S.svc[i];let L=x.pros&&x.pros.length?[...x.pros]:S.team.filter(p=>canDo(x,p)).map(p=>p.id);L=L.includes(pid)?L.filter(y=>y!==pid):[...L,pid];if(!L.length)return;x.pros=L;emit();return}
    if(t.dataset.pct){S.promo.pct=+t.dataset.pct;U.pctC=false;emit();return}
    if(t.dataset.a==='pctc'){U.pctC=true;render();return}
    if(t.dataset.psvc){const id=t.dataset.psvc,L=S.promo.svcs;S.promo.svcs=L.includes(id)?L.filter(x=>x!==id):[...L,id];emit();return}
    if(t.dataset.a==='pall'){S.promo.svcs=S.svc.map(s=>s.id);emit();return}
    if(t.dataset.a==='pnone'){S.promo.svcs=[];emit();return}
    if(t.dataset.acpt!=null){S.acompte=+t.dataset.acpt;emit();return}
    if(t.dataset.sw!=null){S.swatch=+t.dataset.sw;S.color=null;emit();return}
    if(t.dataset.a==='addsvc'){const c=t.dataset.c||(S.svc[0]||{}).cat;S.svc.push({id:'new'+S.svc.length,n:'Nouvelle prestation',d:45,p:40,desc:'Ajoutée depuis ton admin.',on:true,cat:c});emit();return}
    if(t.dataset.a==='addteam'){const n=['Sacha','Nina','Malik','Jade'][S.team.length%4];S.team.push({id:'p'+S.team.length,n,c:['#C98B6B','#7FA56F','#8C86C9','#5E8A82'][S.team.length%4],role:'Toutes prestations',on:true});emit();return}
    if(t.dataset.a==='addoff'){const f=U.offF;if(!f.from)return;const to=f.to&&f.to>=f.from?f.to:f.from;S.off.push({who:f.who,from:f.from,to,why:f.why});U.offF={who:'all',from:'',to:'',why:'Congés'};emit();return}
    if(t.dataset.deloff!=null){S.off.splice(+t.dataset.deloff,1);emit();return}
    if(t.dataset.sub){U.msg.sub=t.dataset.sub;render();return}
    if(t.dataset.a==='send'){if(!U.msg.txt.trim())return;U.msg.sent=true;render();return}
    if(t.dataset.a==='newmsg'){U.msg={sub:'Bug',txt:'',sent:false};render();return}
  });
  el.addEventListener('input',e=>{const t=e.target;
    if(t.dataset.csearch!=null){U.q=t.value;filt()}
    if(t.dataset.rsearch!=null){U.rq=t.value;filt()}
    if(t.dataset.msg!=null){U.msg.txt=t.value;const b=el.querySelector('[data-a="send"]');if(b)b.disabled=!t.value.trim()}
    if(t.dataset.ptxt!=null){S.promo.txt=t.value;emit()}
    if(t.dataset.color!=null){S.color=t.value;emit()}
    if(t.dataset.name!=null){S.svc[t.dataset.name].n=t.value||'Prestation';emit()}
  });
  el.addEventListener('change',e=>{const t=e.target;
    if(t.dataset.up){const f=t.files&&t.files[0];if(!f)return;const u=URL.createObjectURL(f);const [k,i]=t.dataset.up.split(':');
      if(k==='logo')S.logo=u;if(k==='hero')S.hero=u;if(k==='svc')S.svc[i].img=u;if(k==='team'){IMG['up'+i]=u;S.team[i].ph='up'+i}
      emit();render();return}
    if(t.dataset.dur!=null){S.svc[t.dataset.dur].d=+t.value;emit()}
    if(t.dataset.price!=null){S.svc[t.dataset.price].p=Math.max(0,+t.value||0);emit()}
    if(t.dataset.pctv!=null){S.promo.pct=Math.min(90,Math.max(1,+t.value||10));emit()}
    if(t.dataset.prep!=null){S.svc[t.dataset.prep].prep=+t.value;emit()}
    if(t.dataset.goal!=null){S.goal=Math.max(100,+t.value||S.goal);emit();render()}
    if(t.dataset.pend!=null){S.promo.end=t.value;emit()}
    if(t.dataset.gcal!=null){S.gcal.cal=t.value;emit()}
    if(t.dataset.hr){S.hours[t.dataset.hr]=+t.value;if(S.hours.c-S.hours.o<120)S.hours.c=S.hours.o+120;emit();render()}
    if(t.dataset.off){U.offF[t.dataset.off]=t.value;if(t.dataset.off==='from'&&(!U.offF.to||U.offF.to<t.value))U.offF.to=t.value;render()}
    if(t.dataset.color!=null||t.dataset.ptxt!=null||t.dataset.name!=null)render();
  });
  on(()=>{const f=document.activeElement;if(f&&el.contains(f)&&(f.tagName==='INPUT'||f.tagName==='TEXTAREA'))return;render()});render();
  return {tab(t){U.tab=t;render()}};
}
setup('esthetique');
return {client,admin,setup,ACT,ORDER,state:S};
})();
