import { scryptSync,timingSafeEqual } from 'node:crypto';
import { secureJson,safeOrigin,limitedBody,rateLimit,adminToken,isAdmin } from '@/lib/booking-security';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:Request){return secureJson({authenticated:isAdmin(request),configured:Boolean(process.env.BOOKING_ADMIN_PASSWORD_HASH)});}
export async function POST(request:Request){
  if(!safeOrigin(request))return secureJson({message:'Origine refusée.'},403);
  if(!rateLimit(request,'admin-login:',5))return secureJson({message:'Réessaie dans quinze minutes.'},429);
  try{const {password}=await limitedBody(request);const [salt,expected]=String(process.env.BOOKING_ADMIN_PASSWORD_HASH||'').split(':');if(!salt||!expected)return secureJson({message:'Accès administrateur en cours de configuration.'},503);if(typeof password!=='string'||password.length>200)return secureJson({message:'Accès refusé.'},401);const actual=scryptSync(password,salt,64),target=Buffer.from(expected,'hex');if(actual.length!==target.length||!timingSafeEqual(actual,target))return secureJson({message:'Accès refusé.'},401);const response=secureJson({ok:true});response.cookies.set('mn_admin',adminToken(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/api/booking/admin',maxAge:8*3600});return response;}catch{return secureJson({message:'Connexion impossible.'},400);}
}
export async function DELETE(request:Request){if(!safeOrigin(request))return secureJson({message:'Origine refusée.'},403);const response=secureJson({ok:true});response.cookies.set('mn_admin','',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/api/booking/admin',maxAge:0});return response;}
