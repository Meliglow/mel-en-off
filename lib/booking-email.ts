import type { OfferConfig, BookingRecord } from './booking-store';
export async function sendTransactional(config:OfferConfig, to:string, subject:string, content:string) {
  if(!config.emailEnabled || !process.env.BREVO_API_KEY) return {status:'not_configured',at:new Date().toISOString()};
  const headers={'api-key':process.env.BREVO_API_KEY,'content-type':'application/json'};
  try {
    const check=await fetch('https://api.brevo.com/v3/senders',{headers,cache:'no-store',signal:AbortSignal.timeout(8000)});
    if(!check.ok)return {status:'sender_unverified',at:new Date().toISOString()};
    const data=await check.json();if(!data.senders?.some((sender:any)=>sender.email===config.senderEmail && sender.active))return {status:'sender_unverified',at:new Date().toISOString()};
    const response=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers,body:JSON.stringify({sender:{name:'Mel Nourdi',email:config.senderEmail},to:[{email:to}],subject,textContent:content}),signal:AbortSignal.timeout(10000)});
    return {status:response.ok?'sent':'failed',at:new Date().toISOString()};
  }catch{return {status:'failed',at:new Date().toISOString()};}
}
export async function notifyRequest(config:OfferConfig, record:BookingRecord) {
  const receipt=await sendTransactional(config,record.fields.businessEmail,`Ta demande ${record.reference} — Melnourdi`,`Bonjour ${record.fields.firstName},\n\nTa demande ${record.reference} pour ${record.fields.businessName} est enregistrée.\nMontant connu : ${record.knownSubtotal} € TTC, hors frais fournisseurs et éléments à chiffrer. Cette demande n’est pas une commande et ne réserve pas un tarif de lancement.\n\nMel revient vers toi avec la proposition et les éventuels points à préciser. Aucun paiement n’a été effectué.\n\nMel — contact@melnourdi.fr`);
  const notification=await sendTransactional(config,config.notificationEmail,`Nouvelle demande ${record.reference}`,`Une nouvelle demande pour ${record.fields.businessName} est disponible dans ton administration : https://melnourdi.fr/administration-reservations\nRéférence : ${record.reference}\nMontant connu : ${record.knownSubtotal} € TTC\nÉléments à chiffrer : ${record.toQuote.join(', ') || 'compatibilité et frais fournisseurs à confirmer'}`);
  return {receipt,notification};
}
