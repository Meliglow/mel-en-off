import { NextResponse } from "next/server";
import { safeOrigin, rateLimit } from "@/lib/booking-security";
import { KITS, SITE, isKitId, stripeFetch } from "@/lib/kits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Bouton « Je prends le kit » (formulaire HTML, marche même sans JavaScript).
 * Le prix vient de lib/kits.ts, jamais du navigateur. Les moyens de paiement
 * proposés (carte, paiement en 3 fois…) sont ceux activés dans le tableau de
 * bord de paiement de Mel.
 */
export async function POST(request: Request) {
  let kitId: unknown = null;
  try {
    const type = request.headers.get("content-type") || "";
    if (type.includes("application/json")) kitId = (await request.json())?.kit;
    else kitId = (await request.formData()).get("kit");
  } catch { /* formulaire illisible */ }
  if (!isKitId(kitId)) return NextResponse.redirect(`${SITE}/#kits`, 303);
  const kit = KITS[kitId];
  const retour = (code: string) => NextResponse.redirect(`${SITE}${kit.page}?achat=${code}#acheter`, 303);

  if (!safeOrigin(request)) return retour("erreur");
  if (!rateLimit(request, "kit-achat", 15)) return retour("attente");
  if (!process.env.STRIPE_SECRET_KEY) return retour("bientot");

  const p = new URLSearchParams();
  p.set("mode", "payment");
  p.set("locale", "fr");
  p.set("success_url", `${SITE}/kit/acces?session={CHECKOUT_SESSION_ID}`);
  p.set("cancel_url", `${SITE}${kit.page}?achat=annule#acheter`);
  p.set("customer_creation", "always");
  p.set("phone_number_collection[enabled]", "true");
  p.set("invoice_creation[enabled]", "true");
  p.set("custom_fields[0][key]", "prenom");
  p.set("custom_fields[0][label][type]", "custom");
  p.set("custom_fields[0][label][custom]", "Prénom");
  p.set("custom_fields[0][type]", "text");
  p.set("custom_fields[0][text][maximum_length]", "60");
  p.set("custom_fields[1][key]", "nom");
  p.set("custom_fields[1][label][type]", "custom");
  p.set("custom_fields[1][label][custom]", "Nom");
  p.set("custom_fields[1][type]", "text");
  p.set("custom_fields[1][text][maximum_length]", "60");
  p.set("metadata[kit]", kit.id);
  p.set("payment_intent_data[metadata][kit]", kit.id);
  p.set("payment_intent_data[description]", kit.nom);
  p.set("line_items[0][quantity]", "1");
  p.set("line_items[0][price_data][currency]", "eur");
  p.set("line_items[0][price_data][unit_amount]", String(kit.prix));
  p.set("line_items[0][price_data][product_data][name]", kit.nom);
  p.set("line_items[0][price_data][product_data][description]", "Kit à importer dans Claude, téléchargeable tout de suite après le paiement.");

  try {
    const r = await stripeFetch("checkout/sessions", { method: "POST", body: p });
    const s = await r.json();
    if (!r.ok || typeof s?.url !== "string") {
      console.error("Paiement kit indisponible", s?.error?.message || r.status);
      return retour("erreur");
    }
    return NextResponse.redirect(s.url, 303);
  } catch {
    return retour("erreur");
  }
}
