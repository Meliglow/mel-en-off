import { offerState,storageReady } from '@/lib/booking-store';
import { secureJson } from '@/lib/booking-security';
export const dynamic='force-dynamic';
export async function GET(){try{const {config,launchUsed}=await offerState();const {notificationEmail,senderEmail,emailEnabled,termsApproved,...publicConfig}=config;return secureJson({...publicConfig,currentPrice:launchUsed<config.launchLimit?config.launchPrice:config.standardPrice,launchAvailable:launchUsed<config.launchLimit,requestsReady:storageReady(),paymentReady:false,domainSearchReady:false});}catch{return secureJson({message:'L’offre est momentanément indisponible.'},503);}}
