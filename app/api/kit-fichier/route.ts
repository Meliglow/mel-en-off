import { verifierAchat, lireFichier } from "@/lib/kits";
import { rateLimit } from "@/lib/booking-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Téléchargement du kit ou ouverture du guide, après vérification du paiement. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = url.searchParams.get("session") || "";
  const f = url.searchParams.get("f");
  if (!rateLimit(request, "kit-fichier", 60)) return new Response("Trop de demandes, réessaie dans quelques minutes.", { status: 429 });
  const achat = await verifierAchat(session).catch(() => null);
  if (!achat) return new Response("Ce lien ne correspond à aucun achat. Écris à contact@melnourdi.fr.", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });

  const headers: Record<string, string> = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex", "X-Content-Type-Options": "nosniff" };
  try {
    if (f === "guide") {
      const html = await lireFichier(achat.kit.guide);
      return new Response(new Uint8Array(html), { headers: { ...headers, "content-type": "text/html; charset=utf-8" } });
    }
    const zip = await lireFichier(achat.kit.zip);
    return new Response(new Uint8Array(zip), {
      headers: { ...headers, "content-type": "application/zip", "content-disposition": `attachment; filename="${achat.kit.zip}"`, "content-length": String(zip.length) },
    });
  } catch (e) {
    console.error("Fichier de kit introuvable", e);
    return new Response("Fichier momentanément indisponible. Écris à contact@melnourdi.fr.", { status: 500 });
  }
}
