import { randomBytes } from 'node:crypto';
import { withStore,storageReady } from '@/lib/booking-store';
import { validateRequest,RequestValidationError } from '@/lib/booking-validation.mjs';
import { secureJson,safeOrigin,rateLimit,limitedBody,digest } from '@/lib/booking-security';
import { notifyRequest } from '@/lib/booking-email';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(request:Request){
  if(!safeOrigin(request))return secureJson({message:'Origine non autorisée.'},403);
  if(!rateLimit(request,'request:',5))return secureJson({message:'Tu as envoyé plusieurs demandes. Réessaie dans quinze minutes.'},429);
  if(!storageReady())return secureJson({message:'L’enregistrement est en cours de configuration. Tu peux télécharger ton récapitulatif ou écrire à contact@melnourdi.fr.'},503);
  try{
    const body=await limitedBody(request);
    if(typeof body.idempotencyKey!=='string'||!/^[a-zA-Z0-9-]{20,80}$/.test(body.idempotencyKey))return secureJson({message:'Recharge le formulaire pour créer une nouvelle référence.'},400);
    const saved=await withStore(store=>{
      const validated=validateRequest(body,store.config,store.launchUsed);
      const hash=digest(JSON.stringify({fields:validated.fields,options:validated.options,consent:true}));
      const existing=store.requests.find(item=>item.idempotencyKey===body.idempotencyKey || (item.fingerprint===hash && Date.now()-Date.parse(item.createdAt)<86400000));
      if(existing){if(existing.fingerprint!==hash)throw new RequestValidationError('Cette demande existe déjà avec d’autres réponses. Crée une nouvelle demande.');return {record:existing,config:store.config,duplicate:true};}
      const reference=`MN-${new Date().getUTCFullYear()}-${randomBytes(5).toString('hex').toUpperCase()}`;
      const record={...validated,reference,idempotencyKey:body.idempotencyKey,fingerprint:hash,createdAt:new Date().toISOString(),status:'Nouvelle',notes:'',history:[{at:new Date().toISOString(),event:'Demande reçue'}],email:{receipt:{status:'pending'},notification:{status:'pending'}},connections:{google:'À configurer',payment:'À étudier',email:validated.emailSetup},meeting:{status:'Non planifiée',url:''},finalValidation:false,launchAllocated:false};
      store.requests.push(record);return {record,config:store.config,duplicate:false};
    });
    if(!saved.duplicate){const email=await notifyRequest(saved.config,saved.record);await withStore(store=>{const item=store.requests.find(item=>item.reference===saved.record.reference);if(item)item.email=email;});}
    return secureJson({ok:true,reference:saved.record.reference,knownSubtotal:saved.record.knownSubtotal,toQuote:saved.record.toQuote,message:'Ta demande est enregistrée. Mel doit confirmer le périmètre et le tarif avant toute commande.'});
  }catch(error){if(error instanceof RequestValidationError)return secureJson({message:error.message},400);return secureJson({message:'L’enregistrement n’a pas pu être confirmé. Réessaie sans fermer cette page ; une demande déjà reçue ne sera pas créée en double.'},503);}
}
