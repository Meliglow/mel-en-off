import { withStore,storageReady } from '@/lib/booking-store';
import { secureJson,safeOrigin,isAdmin,limitedBody } from '@/lib/booking-security';
import { STATUSES } from '@/lib/booking-validation.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:Request){if(!isAdmin(request))return secureJson({message:'Connexion requise.'},401);if(!storageReady())return secureJson({message:'Stockage à configurer.'},503);try{return await withStore(store=>secureJson({config:store.config,launchUsed:store.launchUsed,statuses:STATUSES,requests:store.requests.map(({fingerprint,idempotencyKey,...record})=>record),integrations:{storage:true,email:store.config.emailEnabled,payment:false,domainSearch:false}}),false);}catch{return secureJson({message:'Lecture impossible.'},503);}}
export async function PATCH(request:Request){
  if(!safeOrigin(request)||!isAdmin(request))return secureJson({message:'Accès refusé.'},403);
  try{const body=await limitedBody(request);return await withStore(store=>{
    if(body.action==='settings'){
      const next=structuredClone(store.config);for(const key of ['launchPrice','standardPrice'] as const){if(typeof body[key]!=='number'||!Number.isFinite(body[key])||body[key]<0||body[key]>10000)return secureJson({message:'Prix invalide.'},400);next[key]=body[key];}
      for(const key of ['headline','intro','deliveryTerms','maintenanceTerms','accessTerms'] as const){if(typeof body[key]==='string'&&body[key].trim())next[key]=body[key].trim().slice(0,1000);}
      for(const key of ['notificationEmail','senderEmail'] as const){if(typeof body[key]==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body[key]))next[key]=body[key].slice(0,250);}
      if(Array.isArray(body.options)){for(const option of next.options){const update=body.options.find((o:any)=>o.id===option.id);if(!update)continue;if(update.price!==null&&(typeof update.price!=='number'||!Number.isFinite(update.price)||update.price<0||update.price>10000))return secureJson({message:'Supplément invalide.'},400);option.price=update.price;}}
      next.version=new Date().toISOString();store.config=next;return secureJson({ok:true});
    }
    const record=store.requests.find(item=>item.reference===body.reference);if(!record)return secureJson({message:'Dossier introuvable.'},404);
    if(!STATUSES.includes(body.status))return secureJson({message:'Statut invalide.'},400);
    if(typeof body.meetingUrl==='string'&&body.meetingUrl&&!/^https:\/\/(meet\.google\.com|[a-z0-9.-]*zoom\.us|teams\.microsoft\.com)\//i.test(body.meetingUrl))return secureJson({message:'Utilise un lien HTTPS Google Meet, Zoom ou Teams.'},400);
    if(['Validée','Publiée'].includes(body.status)&&body.finalValidation!==true&&!record.finalValidation)return secureJson({message:'La validation finale de la cliente doit être confirmée.'},400);
    const progressing=['Commandée','En préparation','Aperçu prêt','Ajustements','Validée','Publiée'].includes(body.status);
    if(progressing&&!record.orderValidated){
      if(body.orderConfirmed!==true)return secureJson({message:'Confirme la proposition acceptée, le prix complet et la validation réelle de la commande.'},400);
      const base=store.launchUsed<store.config.launchLimit?store.config.launchPrice:store.config.standardPrice;
      const currentKnown=base+store.config.options.filter(o=>record.options.includes(o.id)).reduce((n,o)=>n+(o.price??0),0);
      if(record.basePrice!==base){record.basePrice=base;record.knownSubtotal=currentKnown;record.history.push({at:new Date().toISOString(),event:'Tarif actualisé ; nouvelle validation de la proposition nécessaire'});return secureJson({message:'Le tarif a changé. Le dossier est actualisé : fais confirmer le nouveau montant avant de valider la commande.'},409);}
      if(typeof body.agreedTotal!=='number'||!Number.isFinite(body.agreedTotal)||body.agreedTotal<currentKnown)return secureJson({message:'Indique le montant complet accepté, au moins égal au sous-total chiffré.'},400);
      record.agreedTotal=body.agreedTotal;record.orderValidated=true;record.orderValidatedAt=new Date().toISOString();if(store.launchUsed<store.config.launchLimit){record.launchAllocated=true;store.launchUsed++;}
    }
    if(['Validée','Publiée'].includes(body.status)&&body.finalValidation!==true&&!record.finalValidation)return secureJson({message:'La validation finale de la cliente doit être confirmée.'},400);
    const previous=record.status;record.status=body.status;record.notes=typeof body.notes==='string'?body.notes.slice(0,5000):record.notes;
    if(typeof body.finalValidation==='boolean'&&body.finalValidation&&!record.finalValidation){record.finalValidation=true;record.finalValidationAt=new Date().toISOString();}
    if(Array.isArray(body.completedItems))record.completedItems=body.completedItems.filter((v:unknown)=>typeof v==='string'&&record.missingItems.includes(v));
    if(typeof body.meetingUrl==='string'){if(body.meetingUrl&&!/^https:\/\/(meet\.google\.com|[a-z0-9.-]*zoom\.us|teams\.microsoft\.com)\//i.test(body.meetingUrl))return secureJson({message:'Utilise un lien HTTPS Google Meet, Zoom ou Teams.'},400);record.meeting.url=body.meetingUrl.slice(0,500);}
    record.history.push({at:new Date().toISOString(),event:`Dossier actualisé : ${previous} → ${record.status}`});return secureJson({ok:true});
  });}catch{return secureJson({message:'Mise à jour impossible.'},400);}
}
