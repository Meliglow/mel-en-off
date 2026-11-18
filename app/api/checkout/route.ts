import defaults from '@/config/booking-offer.json';
import { offerState } from '@/lib/booking-store';
import { secureJson, safeOrigin, rateLimit, limitedBody } from '@/lib/booking-security';

export const dynamic = 'force-dynamic';

type Option = { id: string; label: string; price: number | null };
type Offer = typeof defaults & { launchEndsAt?: string; packPrice?: number; packOptions?: string[] };

const SITE = (process.env.PUBLIC_SITE_URL || 'https://melnourdi.fr').replace(/\/$/, '');

/**
 * Ouvre une page de paiement Stripe pour le logiciel de réservation.
 * Le prix est toujours recalculé ici, à partir de config/booking-offer.json :
 * le navigateur envoie seulement les options choisies, jamais un montant.
 * Il faut la variable STRIPE_SECRET_KEY sur Railway ; sans elle, la route
 * répond 503 et la page renvoie vers le configurateur.
 */
export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return secureJson({ message: 'Le paiement en ligne n’est pas encore activé.' }, 503);
  if (!safeOrigin(request)) return secureJson({ message: 'Origine refusée.' }, 403);
  if (!rateLimit(request, 'checkout', 20)) return secureJson({ message: 'Trop de tentatives, réessaie dans quelques minutes.' }, 429);

  let body: any;
  try { body = await limitedBody(request); } catch { return secureJson({ message: 'Demande illisible.' }, 400); }

  const { config, launchUsed } = await offerState().catch(() => ({ config: defaults, launchUsed: 0 }));
  const offer = config as Offer;
  const options = offer.options as Option[];

  const ids: string[] = Array.isArray(body?.options) ? [...new Set<string>(body.options.filter((x: unknown) => typeof x === 'string'))] : [];
  if (ids.length > 10 || ids.some(id => !options.some(o => o.id === id))) return secureJson({ message: 'Une option est invalide.' }, 400);

  const endsAt = Date.parse(offer.launchEndsAt || '');
  const launch = launchUsed < offer.launchLimit && (Number.isNaN(endsAt) || Date.now() < endsAt);
  const base = launch ? offer.launchPrice : offer.standardPrice;

  const pack = body?.pack === true && typeof offer.packPrice === 'number';
  const packIds = pack ? offer.packOptions || [] : [];
  const paid = options.filter(o => ids.includes(o.id) && typeof o.price === 'number' && o.price > 0 && !packIds.includes(o.id));

  const items: { name: string; amount: number }[] = [
    { name: `Logiciel de réservation à ton nom${launch ? ' (tarif de lancement)' : ''}`, amount: base },
  ];
  if (pack) {
    const names = options.filter(o => packIds.includes(o.id)).map(o => o.label).join(' + ');
    items.push({ name: `Pack Sérénité : ${names}`, amount: offer.packPrice as number });
  }
  for (const o of paid) items.push({ name: o.label, amount: o.price as number });

  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('locale', 'fr');
  params.set('success_url', `${SITE}/configurer-reservation?paiement=ok&session={CHECKOUT_SESSION_ID}`);
  params.set('cancel_url', `${SITE}/logiciel-reservation#offre`);
  params.set('customer_creation', 'always');
  params.set('billing_address_collection', 'required');
  params.set('phone_number_collection[enabled]', 'true');
  params.set('invoice_creation[enabled]', 'true');
  params.set('metadata[offre]', offer.version);
  params.set('metadata[lancement]', launch ? 'oui' : 'non');
  params.set('metadata[pack]', pack ? 'oui' : 'non');
  params.set('metadata[options]', ids.join(',').slice(0, 450));
  items.forEach((item, i) => {
    params.set(`line_items[${i}][quantity]`, '1');
    params.set(`line_items[${i}][price_data][currency]`, 'eur');
    params.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(item.amount * 100)));
    params.set(`line_items[${i}][price_data][product_data][name]`, item.name.slice(0, 250));
  });

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const session = await response.json();
    if (!response.ok || typeof session?.url !== 'string') {
      console.error('Stripe checkout error', session?.error?.message || response.status);
      return secureJson({ message: 'Le paiement est momentanément indisponible.' }, 502);
    }
    return secureJson({ url: session.url });
  } catch {
    return secureJson({ message: 'Le paiement est momentanément indisponible.' }, 502);
  }
}
