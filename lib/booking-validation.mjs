export class RequestValidationError extends Error {}
export const STATUSES = ['Nouvelle', 'À étudier', 'Proposition envoyée', 'Commandée', 'En préparation', 'Aperçu prêt', 'Ajustements', 'Validée', 'Publiée', 'Archivée'];
export const COUNTRIES = 'AF AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UM UY UZ VU VE VN VG VI WF EH YE ZM ZW'.split(' ');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function validateRequest(input, config, launchUsed = 0) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new RequestValidationError('Demande illisible.');
  if (input.website) throw new RequestValidationError('Demande refusée.');
  const fieldNames = ['country','team','teamCount','location','locationCount','cities','domainOwned','domain','existingSite','domainHelp','businessName','desiredDomain','softwareUsed','softwareName','migration','businessEmail','professionalEmail','usesGoogle','googleEmail','paymentProvider','paymentProviderOther','paymentMode','reminderWhen','followupType','questionnaireInfo','questionnaireServices','firstName','lastName','phone','contactPreference','comment','serviceCount'];
  const fields = {};
  for (const name of fieldNames) { const value = input.fields?.[name]; fields[name] = typeof value === 'string' ? value.trim().slice(0, ['comment','migration','questionnaireInfo'].includes(name) ? 1500 : 250) : ''; }
  const required = (name, message) => { if (!fields[name]) throw new RequestValidationError(message); };
  const choice = (name, values, message) => { if (!values.includes(fields[name])) throw new RequestValidationError(message); };
  choice('country', COUNTRIES, 'Choisis ton pays dans les suggestions.');
  choice('team', ['solo','team'], 'Précise le nombre de professionnelles.');
  choice('location', ['salon','home','both','multi'], 'Précise où tu exerces.');
  choice('domainOwned', ['yes','no'], 'Précise si tu possèdes un domaine.');
  choice('softwareUsed', ['yes','no'], 'Précise si tu utilises un logiciel.');
  if (fields.team === 'team' && (!/^\d+$/.test(fields.teamCount) || +fields.teamCount < 2 || +fields.teamCount > 100)) throw new RequestValidationError('Indique un effectif entre 2 et 100.');
  if (fields.location === 'multi') { required('cities','Indique les villes de tes établissements.'); if (!/^\d+$/.test(fields.locationCount) || +fields.locationCount < 2 || +fields.locationCount > 100) throw new RequestValidationError('Indique le nombre d’établissements.'); }
  if (fields.domainOwned === 'yes') { required('domain','Indique ton domaine.'); choice('existingSite',['yes','no'],'Précise si un site existe déjà.'); } else choice('domainHelp',['yes','no'],'Précise si tu souhaites de l’aide pour le domaine.');
  required('businessName','Indique le nom de ton activité.');
  if (fields.softwareUsed === 'yes') required('softwareName','Indique le nom de ton logiciel actuel.');
  if (!emailPattern.test(fields.businessEmail)) throw new RequestValidationError('Indique un email professionnel valide.');
  if (fields.professionalEmail && !['yes','no'].includes(fields.professionalEmail)) throw new RequestValidationError('Choix d’adresse professionnelle invalide.');
  required('firstName','Indique ton prénom.'); required('lastName','Indique ton nom.');
  if (!/^\+[\d\s().-]{7,24}$/.test(fields.phone)) throw new RequestValidationError('Indique ton téléphone avec l’indicatif du pays, par exemple +33.');
  choice('contactPreference',['email','whatsapp'],'Choisis ton contact préféré.');
  if (input.consent !== true) throw new RequestValidationError('Confirme l’utilisation de tes réponses pour préparer ta proposition.');
  const ids = Array.isArray(input.options) ? [...new Set(input.options)] : [];
  if (ids.some(id => typeof id !== 'string' || !config.options.some(option => option.id === id))) throw new RequestValidationError('Une option est invalide.');
  if (ids.includes('google')) { choice('usesGoogle',['yes','no'],'Précise si tu utilises Google Agenda.'); if (fields.googleEmail && !emailPattern.test(fields.googleEmail)) throw new RequestValidationError('L’adresse Google n’est pas valide.'); }
  if (ids.includes('payment')) { choice('paymentProvider',['stripe','paypal','other','none'],'Choisis ta solution de paiement.'); choice('paymentMode',['deposit','full','discuss'],'Choisis acompte, paiement total ou à définir.'); }
  if (ids.includes('reminder')) choice('reminderWhen',['24h','48h','discuss'],'Choisis le moment du rappel.');
  if (ids.includes('questionnaire')) { required('questionnaireInfo','Décris les informations à recueillir, sans dossier réel de cliente.'); required('questionnaireServices','Précise les prestations concernées.'); }
  if (ids.includes('followup')) required('followupType','Précise le type d’email après rendez-vous.');
  if (!/^\d+$/.test(fields.serviceCount) || +fields.serviceCount < 1 || +fields.serviceCount > 500) throw new RequestValidationError('Indique le nombre de prestations, entre 1 et 500.');
  const launchEligible = launchUsed < config.launchLimit;
  const basePrice = launchEligible ? config.launchPrice : config.standardPrice;
  const options = config.options.filter(option => ids.includes(option.id));
  const toQuote = options.filter(option => option.price === null).map(option => option.label);
  if (fields.team === 'team') toQuote.push('Équipe de plusieurs professionnelles');
  if (fields.location === 'multi' || fields.location === 'both' || fields.location === 'home') toQuote.push('Organisation des lieux et déplacements');
  if (+fields.serviceCount > config.maxServices) toQuote.push(`Plus de ${config.maxServices} prestations`);
  if (fields.professionalEmail === 'yes') toQuote.push('Adresse email professionnelle');
  if (fields.migration) toQuote.push('Étude de reprise des données');
  const knownSubtotal = basePrice + options.reduce((sum, option) => sum + (option.price ?? 0), 0);
  const missingItems = ['Logo ou identité visuelle', 'Photos autorisées', 'Liste détaillée des prestations, prix et durées', 'Horaires, pauses et indisponibilités', 'Comptes fournisseurs au nom de la cliente'];
  if (ids.includes('google')) missingItems.push('Autorisation sécurisée Google Agenda');
  if (ids.includes('payment')) missingItems.push('Compatibilité du compte de paiement');
  missingItems.push('Conditions de livraison, maintenance et remise des accès');
  return { fields, options: ids, basePrice, knownSubtotal, launchEligible, toQuote: [...new Set(toQuote)], missingItems, consentAt: new Date().toISOString(), pricingVersion: config.version, taxLabel: config.taxLabel, currency: config.currency, emailSetup: /@(gmail|outlook|hotmail|live|yahoo|icloud)\./i.test(fields.businessEmail) ? 'Configuration d’envoi à prévoir' : 'Expéditeur à vérifier' };
}
