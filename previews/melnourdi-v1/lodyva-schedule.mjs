export const services = [
  {id:'semi',category:'Ongles',name:'Manucure & semi-permanent',duration:60,price:40,description:'Mise en forme, soin des cuticules et pose de couleur.'},
  {id:'gel',category:'Ongles',name:'Pose de gel',duration:90,price:65,description:'Une pose complète, avec la forme et la couleur de ton choix.'},
  {id:'lash',category:'Cils',name:'Rehaussement & teinture',duration:75,price:60,description:'Une courbure naturelle et un regard souligné.'},
  {id:'extension',category:'Cils',name:'Extensions cil à cil',duration:90,price:80,description:'Une pose personnalisée pour dessiner ton regard.'},
  {id:'relax',category:'Massages',name:'Massage relaxant',duration:60,price:70,description:'Une heure de détente, des épaules jusqu’au bout des pieds.'},
  {id:'back',category:'Massages',name:'Massage dos & nuque',duration:30,price:35,description:'Une pause ciblée pour relâcher les tensions du quotidien.'}
];
export const clients = [{id:'camille',name:'Camille Martin',email:'camille@example.test',visits:4},{id:'sarah',name:'Sarah Diallo',email:'sarah@example.test',visits:2},{id:'lina',name:'Lina Bernard',email:'lina@example.test',visits:6},{id:'ines',name:'Inès Moreau',email:'ines@example.test',visits:1},{id:'emma',name:'Emma Laurent',email:'emma@example.test',visits:0}];
export const money = n => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(n);
export const toTime = m => String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
export const fromTime = t => Number(t.split(':')[0])*60+Number(t.split(':')[1]);
export function todayKey(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function addDays(key,n){const d=new Date(key+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function dayLabel(key,options={weekday:'long',day:'numeric',month:'long'}){return new Intl.DateTimeFormat('fr-FR',{...options,timeZone:'UTC'}).format(new Date(key+'T12:00:00Z'));}
export function isOpen(key){return ![0,1].includes(new Date(key+'T12:00:00Z').getUTCDay());}
export function slots(key,duration,appointments=[],ignoreId='',now=new Date()){
  if(!isOpen(key)||key<todayKey(now)||duration<=0)return [];
  const today=todayKey(now);const parts=new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);const current=Number(parts.find(p=>p.type==='hour').value)*60+Number(parts.find(p=>p.type==='minute').value);
  const busy=appointments.filter(a=>a.date===key&&a.status!=='cancelled'&&a.id!==ignoreId);const result=[];
  for(const [start,end] of [[540,780],[840,1080]])for(let m=start;m+duration<=end;m+=15){if(key===today&&m<current+30)continue;if(busy.some(a=>m<a.start+a.duration+15&&m+duration+15>a.start))continue;result.push(toTime(m));}
  return result;
}
export function seedAppointments(base){const result=[];for(let i=1;i<21;i++){const date=addDays(base,i);if(!isOpen(date))continue;for(const [j,start] of [570,855,975].entries()){const service=services[(i+j)%services.length];const client=clients[(i+j)%clients.length];result.push({id:`seed-${i}-${j}`,date,start,duration:service.duration,service:service.id,price:service.price,client:client.id,status:'confirmed',deposit:Math.round(service.price*.3*100)/100,payment:'paid'});}}return result;}
