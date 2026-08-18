import { NextResponse } from "next/server";
import { GROUPES_MAILERLITE } from "@/config";

// Seule fonction serveur du site avec le contact professionnel.
// Node, jamais edge : les fonctions edge sont exclues.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_MAILERLITE = "https://connect.mailerlite.com/api/subscribers";

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

  const cle = process.env.MAILERLITE_API_KEY;
  if (!cle) {
    console.error("MAILERLITE_API_KEY absente : inscription impossible.");
    return echec("L'inscription est momentanément indisponible.", 503);
  }

  const groupe = GROUPES_MAILERLITE[source];
  const champs: Record<string, string> = { source };
  if (prenom) champs.name = prenom;
  if (corps.destination) champs.destination = corps.destination;
  if (corps.compagnie) champs.compagnie = corps.compagnie;
  if (corps.intention) champs.intention = corps.intention;

  const base: Record<string, unknown> = { email };
  if (groupe) base.groups = [groupe];

  // MailerLite cree ou met a jour l'abonne sur cette meme route :
  // une adresse deja inscrite n'est donc pas une erreur.
  let reponse = await envoyer(cle, { ...base, fields: champs });

  // Si un champ personnalise n'existe pas encore dans MailerLite, on
  // reessaie sans les champs : l'inscription passe quand meme.
  if (reponse.status === 422) {
    reponse = await envoyer(cle, base);
  }

  if (!reponse.ok) {
    const detail = await reponse.text();
    console.error(`MailerLite a repondu ${reponse.status} : ${detail}`);
    return echec("L'inscription n'a pas pu aboutir. Réessaie dans un instant.", 502);
  }

  return NextResponse.json({ ok: true });
}

function envoyer(cle: string, charge: Record<string, unknown>) {
  return fetch(API_MAILERLITE, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${cle}`,
    },
    body: JSON.stringify(charge),
    cache: "no-store",
  });
}

function echec(message: string, statut: number) {
  return NextResponse.json({ ok: false, message }, { status: statut });
}
