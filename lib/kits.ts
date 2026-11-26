import { readFile } from "node:fs/promises";
import path from "node:path";
import { EMAIL_CONTACT_PRO } from "@/config";

/**
 * Vente des kits (26/11/2026).
 * Parcours : bouton « Je prends le kit » → /api/kit-achat → page de paiement
 * → /kit/acces?session=… (vérifiée auprès de l'organisme de paiement à chaque
 * visite) → téléchargement via /api/kit-fichier.
 * Les fichiers vivent dans private/kits/ : jamais dans public/, donc aucune
 * adresse publique devinable. Le lien d'accès contient l'identifiant de la
 * session de paiement (long et aléatoire), revérifié à chaque téléchargement.
 *
 * Variables Railway : STRIPE_KITS_SECRET_KEY (compte Mel Nourdi ; à défaut STRIPE_SECRET_KEY), BREVO_API_KEY (mails),
 * STRIPE_WEBHOOK_SECRET (facultatif : livraison même si l'acheteur ferme la page).
 */

export type KitId = "avis" | "devis";
export type Kit = {
  id: KitId;
  nom: string;
  prix: number; // en centimes, TTC
  page: string;
  zip: string;
  guide: string;
  phrase: string; // ce que l'acheteur écrit à Claude pour lancer l'installation
  duree: string;
};

export const KITS: Record<KitId, Kit> = {
  avis: {
    id: "avis",
    nom: "Kit avis Google",
    prix: 6700,
    page: "/kit-avis-google",
    zip: "kit-avis-google.zip",
    guide: "guide-kit-avis-google.html",
    phrase: "Installe mon kit avis",
    duree: "20 minutes",
  },
  devis: {
    id: "devis",
    nom: "Kit devis pro",
    prix: 6700,
    page: "/kit-devis-pro",
    zip: "kit-devis-pro.zip",
    guide: "guide-kit-devis-pro.html",
    phrase: "Installe mon kit devis",
    duree: "20 minutes",
  },
};

export const SITE = (process.env.PUBLIC_SITE_URL || "https://melnourdi.fr").replace(/\/$/, "");
export const STRIPE_VERSION = "2025-09-30.clover";
export const SESSION_RE = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

export function isKitId(v: unknown): v is KitId {
  return v === "avis" || v === "devis";
}

/** Compte de paiement « Mel Nourdi » pour les kits, séparé de celui du logiciel. */
export function kitsKey() {
  return process.env.STRIPE_KITS_SECRET_KEY || process.env.STRIPE_SECRET_KEY || "";
}

export function stripeFetch(p: string, init: RequestInit = {}) {
  const key = kitsKey();
  if (!key) throw new Error("STRIPE_KITS_SECRET_KEY manquante");
  return fetch(`${process.env.STRIPE_API_BASE || "https://api.stripe.com"}/v1/${p}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Stripe-Version": STRIPE_VERSION,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
}

export type Achat = {
  session: string;
  kit: Kit;
  email: string;
  prenom: string;
  nom: string;
  tel: string;
  montant: number;
  paymentIntent: string | null;
  livre: boolean;
};

/** Renvoie l'achat seulement si la session existe, est payée et correspond à un kit. */
export async function verifierAchat(session: string): Promise<Achat | null> {
  if (!SESSION_RE.test(session)) return null;
  const r = await stripeFetch(`checkout/sessions/${session}?expand[]=payment_intent`);
  if (!r.ok) return null;
  const s = await r.json();
  if (s?.payment_status !== "paid" || s?.status !== "complete") return null;
  const id = s?.metadata?.kit;
  if (!isKitId(id)) return null;
  const pi = s.payment_intent && typeof s.payment_intent === "object" ? s.payment_intent : null;
  const ind = s?.collected_information?.individual_name || s?.customer_details?.individual_name || s?.customer_details?.name || "";
  const champs: Record<string, string> = {};
  for (const f of s?.custom_fields || []) champs[f.key] = f?.text?.value || "";
  const prenom = champs.prenom || String(ind).split(" ")[0] || "";
  const nom = champs.nom || String(ind).split(" ").slice(1).join(" ") || "";
  return {
    session,
    kit: KITS[id],
    email: s?.customer_details?.email || "",
    prenom,
    nom,
    tel: s?.customer_details?.phone || "",
    montant: s?.amount_total || 0,
    paymentIntent: pi?.id || (typeof s.payment_intent === "string" ? s.payment_intent : null),
    livre: pi?.metadata?.kit_livre === "oui",
  };
}

export function lienAcces(session: string) {
  return `${SITE}/kit/acces?session=${encodeURIComponent(session)}`;
}

const esc = (v: string) => v.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

/**
 * Envoie (une seule fois par paiement) le mail d'accès à l'acheteur et la
 * notification de vente à Mel. Le drapeau « kit_livre » est posé sur le
 * paiement, donc rafraîchir la page ou recevoir le webhook ne renvoie rien.
 */
export async function livrer(a: Achat) {
  if (a.livre || !a.paymentIntent) return;
  const marque = await stripeFetch(`payment_intents/${a.paymentIntent}`, {
    method: "POST",
    body: new URLSearchParams({ "metadata[kit_livre]": "oui", "metadata[kit]": a.kit.id }),
  }).catch(() => null);
  if (!marque || !marque.ok) return;

  const brevo = process.env.BREVO_API_KEY;
  if (!brevo) return;
  const lien = lienAcces(a.session);
  const prenom = a.prenom ? ` ${a.prenom}` : "";
  const send = (payload: unknown) =>
    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json", "api-key": brevo },
      body: JSON.stringify(payload),
    }).catch(e => console.error("Email kit impossible", e));

  if (a.email) {
    await send({
      sender: { name: "Mel Nourdi", email: "contact@melnourdi.fr" },
      to: [{ email: a.email, name: `${a.prenom} ${a.nom}`.trim() || undefined }],
      replyTo: { name: "Mel Nourdi", email: "contact@melnourdi.fr" },
      subject: `Ton ${a.kit.nom} est prêt à télécharger`,
      htmlContent: `<!doctype html><html><body style="margin:0;background:#F9F7F2;font-family:Manrope,Arial,sans-serif;color:#161616">
<div style="max-width:520px;margin:0 auto;padding:28px 20px">
<p style="font-size:16px;line-height:1.55;margin:0 0 14px">Coucou${esc(prenom)},</p>
<p style="font-size:16px;line-height:1.55;margin:0 0 14px">Merci pour ton achat ! Ton <b>${esc(a.kit.nom)}</b> t'attend. Tu y trouves le fichier à importer dans Claude et le guide d'installation pas à pas.</p>
<p style="margin:22px 0"><a href="${lien}" style="display:inline-block;background:#161616;color:#fff;text-decoration:none;font-weight:800;padding:14px 24px;border-radius:999px">Télécharger mon kit</a></p>
<p style="font-size:14px;line-height:1.55;color:#6F6A62;margin:0 0 14px">Garde ce mail : le lien marche à chaque fois que tu en as besoin. Il est personnel, ne le partage pas.</p>
<p style="font-size:16px;line-height:1.55;margin:0 0 14px">Une fois le kit importé, écris simplement à Claude : <b>« ${esc(a.kit.phrase)} »</b>. Il te pose ses questions, tu cliques tes réponses.</p>
<p style="font-size:16px;line-height:1.55;margin:0">Un souci ? Réponds simplement à ce mail.<br>Mel</p>
</div></body></html>`,
    });
  }

  await send({
    sender: { name: "Site melnourdi.fr", email: "contact@melnourdi.fr" },
    to: [{ email: EMAIL_CONTACT_PRO }],
    replyTo: a.email ? { email: a.email } : undefined,
    subject: `💰 Vente ${a.kit.nom} : ${(a.montant / 100).toFixed(2).replace(".", ",")} €, ${a.prenom} ${a.nom}`.trim(),
    textContent: [
      `Kit : ${a.kit.nom}`,
      `Montant : ${(a.montant / 100).toFixed(2).replace(".", ",")} €`,
      `Prénom : ${a.prenom}`,
      `Nom : ${a.nom}`,
      `Email : ${a.email}`,
      `Téléphone : ${a.tel}`,
      "",
      `Son lien d'accès : ${lien}`,
    ].join("\n"),
  });
}

const DOSSIER = path.join(process.cwd(), "private", "kits");
export function lireFichier(nom: string) {
  return readFile(path.join(DOSSIER, path.basename(nom)));
}
