// Reçoit les mesures du compteur maison (mn-stats.js). Aucune IP ni identifiant n'est gardé.
import { EVENEMENTS, KITS, enregistrer, type Evenement, type Kit } from "@/lib/stats-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROBOTS = /bot|crawl|spider|slurp|facebookexternalhit|headless|lighthouse|pingdom|uptime|monitor|preview|curl|wget|python|node-fetch/i;
const HOTES_SITE = new Set(["melnourdi.fr", "www.melnourdi.fr", "localhost", "127.0.0.1"]);

const SOURCES: [RegExp, string][] = [
  [/tiktok|musically/, "TikTok"],
  [/instagram|^ig$/, "Instagram"],
  [/facebook|^fb$|fb\.com/, "Facebook"],
  [/youtube|youtu\.be/, "YouTube"],
  [/google/, "Google"],
  [/bing/, "Bing"],
  [/snapchat/, "Snapchat"],
  [/pinterest/, "Pinterest"],
  [/linkedin|lnkd/, "LinkedIn"],
  [/whatsapp|wa\.me/, "WhatsApp"],
  [/brevo|sendibt|sendinblue|^email$|^mail$|newsletter/, "Email"],
  [/chatgpt|openai|perplexity|claude|gemini|copilot/, "Assistants IA"],
];
const nommer = (brut: string) => {
  const s = brut.toLowerCase().slice(0, 80);
  for (const [motif, nom] of SOURCES) if (motif.test(s)) return nom;
  return s.replace(/^www\./, "").replace(/[^a-z0-9.\-]/g, "") || "Autre";
};
const hote = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === "android-app:" ? u.hostname || u.pathname.replace(/^\/\//, "").split("/")[0] : u.hostname;
  } catch {
    return "";
  }
};
const chemin = (p: unknown) => {
  const s = typeof p === "string" ? p.split("?")[0].split("#")[0] : "";
  if (s === "/" || /^\/[a-z0-9\-]{1,40}(\/[a-z0-9\-]{1,40})?$/.test(s)) return s;
  if (s.startsWith("/melnourdi/")) return s.replace(/^\/melnourdi\/(index)?/, "/").replace(/\.html$/, "");
  return "autre";
};
const texte = (v: unknown, max = 60) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const ok = () => new Response(null, { status: 204 });
  try {
    if (ROBOTS.test(request.headers.get("user-agent") || "")) return ok();
    const origine = request.headers.get("origin") || request.headers.get("referer") || "";
    if (!HOTES_SITE.has(hote(origine))) return new Response(null, { status: 403 });
    const brut = await request.text();
    if (brut.length > 2000) return new Response(null, { status: 413 });
    const m = JSON.parse(brut) as Record<string, unknown>;
    let evenement = texte(m.e, 30) as Evenement;
    let kit: Kit | null = KITS.includes(texte(m.k, 20) as Kit) ? (texte(m.k, 20) as Kit) : null;
    // L'accueil envoie déjà « attente_kit-xxx » après un « Préviens-moi » réussi.
    const attente = /^attente_(kit-[a-z]+)$/.exec(evenement);
    if (attente && KITS.includes(attente[1] as Kit)) { evenement = "kit_attente"; kit = attente[1] as Kit; }
    if (!EVENEMENTS.includes(evenement)) return new Response(null, { status: 400 });
    if (evenement.startsWith("kit_") && !kit) return new Response(null, { status: 400 });
    const page = chemin(m.p);
    const referent = texte(m.r, 300);
    const hoteReferent = hote(referent);
    // Le retour depuis la page de paiement n'est pas une nouvelle visite.
    const interne = HOTES_SITE.has(hoteReferent) || /(^|\.)(stripe\.com|klarna\.com)$/.test(hoteReferent);
    const utmSource = texte(m.us);
    // Une « entrée » = une arrivée depuis l'extérieur du site (pas une page vue en naviguant dedans).
    let source: string | null = null;
    if (!interne) {
      if (utmSource) source = nommer(utmSource);
      else if (hoteReferent) source = nommer(hoteReferent);
      else if (texte(m.ac) === "email") source = "Email";
      else source = "Direct ou appli";
    }
    let depuisGuide = false;
    if (interne) {
      try { depuisGuide = new URL(referent).pathname.startsWith("/guide-gratuit"); } catch {}
    }
    await enregistrer({ evenement, page, source, campagne: source ? texte(m.uc, 60).toLowerCase() || null : null, depuisGuide, kit });
    return ok();
  } catch {
    return new Response(null, { status: 400 });
  }
}
