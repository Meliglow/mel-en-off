import { NextResponse } from "next/server";
import { LISTE_BREVO_NEWSLETTER, EMAIL_CONTACT_PRO } from "@/config";

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

  // Mel reçoit aussi chaque inscription dans sa boîte mail (sans bloquer l'inscription).
  await prevenirMel(cle, email, prenom, source);

  return NextResponse.json({ ok: true });
}

/** Nom lisible de l'endroit où la personne s'est inscrite. */
function provenance(source: string) {
  const kits: Record<string, string> = {
    avis: "Kit avis Google", devis: "Kit devis pro", impayes: "Kit fini les impayés",
    lapins: "Kit fini les lapins", hub: "Hub bureau en ordre",
  };
  const m = source.match(/^attente-kit-([a-z]+)$/);
  if (m) return `liste d'attente ${kits[m[1]] || m[1]}`;
  if (/guide/.test(source)) return "guide gratuit";
  if (/lettre|newsletter/.test(source)) return "newsletter";
  return source;
}

async function prevenirMel(cle: string, email: string, prenom: string, source: string) {
  const ou = provenance(source);
  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json", "api-key": cle },
      body: JSON.stringify({
        sender: { name: "Site melnourdi.fr", email: "contact@melnourdi.fr" },
        to: [{ email: EMAIL_CONTACT_PRO }],
        replyTo: { email },
        subject: `📩 Nouvelle inscription : ${email} (${ou})`,
        textContent: [
          `Email : ${email}`,
          prenom ? `Prénom : ${prenom}` : "",
          `Inscrit depuis : ${ou}`,
          `Date : ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`,
          "",
          "Le contact est aussi dans ta liste Brevo.",
        ].filter(Boolean).join("\n"),
      }),
      cache: "no-store",
    });
  } catch (e) {
    console.error("Email d'inscription à Mel impossible", e);
  }
}

function echec(message: string, statut: number) {
  return NextResponse.json({ ok: false, message }, { status: statut });
}
