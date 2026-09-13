import { NextResponse } from "next/server";
import { LISTE_BREVO_NEWSLETTER } from "@/config";

// Seule fonction serveur du site avec le contact professionnel.
// Node, jamais edge : les fonctions edge sont exclues.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BREVO = "https://api.brevo.com/v3/contacts";

// Validation volontairement simple, la meme des deux cotes.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Corps {
  prenom?: string;
  email?: string;
  consentement?: boolean;
  source?: string;
  /** Reponses facultatives posees sur la page /merci. */
  destination?: string;
  compagnie?: string;
  intention?: string;
}

export async function POST(requete: Request) {
  let corps: Corps;
  try {
    corps = await requete.json();
  } catch {
    return echec("Requête illisible.", 400);
  }

  const email = (corps.email || "").trim().toLowerCase();
  const prenom = (corps.prenom || "").trim();
  const source = (corps.source || "").trim() || "inconnue";

  if (!EMAIL.test(email)) {
    return echec("Cette adresse email ne semble pas valide.", 400);
  }

  // La case de consentement est obligatoire. Elle n'est jamais pre-cochee,
  // et le serveur refuse quand meme si elle n'est pas cochee.
  if (corps.consentement !== true) {
    return echec("Il faut cocher la case pour recevoir la lettre.", 400);
  }

  const cle = process.env.BREVO_API_KEY;
  if (!cle) {
    console.error("BREVO_API_KEY absente : inscription impossible.");
    return echec("L'inscription est momentanément indisponible.", 503);
  }

  const attributes: Record<string, string> = {};
  if (prenom) attributes.PRENOM = prenom;

  // Brevo cree le contact ou met a jour l'adresse deja connue, puis l'ajoute
  // a la liste Mel Nourdi · Newsletter.
  const reponse = await fetch(API_BREVO, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "api-key": cle,
    },
    body: JSON.stringify({
      email,
      attributes,
      listIds: [LISTE_BREVO_NEWSLETTER],
      updateEnabled: true,
    }),
    cache: "no-store",
  });

  if (!reponse.ok) {
    const detail = await reponse.text();
    console.error(`Brevo a repondu ${reponse.status} : ${detail.slice(0, 300)}`);
    return echec("L'inscription n'a pas pu aboutir. Réessaie dans un instant.", 502);
  }

  return NextResponse.json({ ok: true });
}

function echec(message: string, statut: number) {
  return NextResponse.json({ ok: false, message }, { status: statut });
}
