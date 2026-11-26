import { createHmac, timingSafeEqual } from "node:crypto";
import { verifierAchat, livrer } from "@/lib/kits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Facultatif : si STRIPE_WEBHOOK_SECRET est défini (événement
 * checkout.session.completed vers https://melnourdi.fr/api/kit-webhook),
 * le mail d'accès part même si l'acheteur ferme la page juste après avoir payé.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("non configuré", { status: 404 });
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") || "";
  const parts = Object.fromEntries(sig.split(",").map(x => x.split("=", 2)).filter(x => x.length === 2)) as Record<string, string>;
  const t = parts.t;
  const v1s = sig.split(",").filter(x => x.startsWith("v1=")).map(x => x.slice(3));
  if (!t || !v1s.length || Math.abs(Date.now() / 1000 - Number(t)) > 300) return new Response("signature", { status: 400 });
  const attendu = Buffer.from(createHmac("sha256", secret).update(`${t}.${body}`).digest("hex"));
  if (!v1s.some(v => { const b = Buffer.from(v); return b.length === attendu.length && timingSafeEqual(b, attendu); })) return new Response("signature", { status: 400 });

  let event: any;
  try { event = JSON.parse(body); } catch { return new Response("json", { status: 400 }); }
  if (event?.type === "checkout.session.completed" || event?.type === "checkout.session.async_payment_succeeded") {
    const id = event?.data?.object?.id;
    if (typeof id === "string" && event?.data?.object?.metadata?.kit) {
      const achat = await verifierAchat(id).catch(() => null);
      if (achat) await livrer(achat);
    }
  }
  return new Response("ok");
}
