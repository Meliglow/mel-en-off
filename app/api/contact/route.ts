import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { EMAIL_CONTACT_PRO } from "@/config";

// Le formulaire professionnel de /collaborations.
// Il envoie un email et n'ecrit JAMAIS dans MailerLite : un hotel qui nous
// ecrit ne doit pas atterrir dans la liste des lectrices.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Limite de frequence simple, en memoire : trois envois par quart d'heure et
// par adresse IP. L'instance serveur peut redemarrer, c'est un garde-fou, pas
// un verrou. Il tient les robots basiques a distance sans service tiers.
const FENETRE_MS = 15 * 60 * 1000;
const MAX_ENVOIS = 3;
const historique = new Map<string, number[]>();

interface Corps {
  nom?: string;
  etablissement?: string;
  ville?: string;
  type_de_lieu?: string;
  email?: string;
  recherche?: string;
  periode?: string;
  consentement?: boolean;
  /** Champ piege : invisible pour un humain, rempli par les robots. */
  site_web?: string;
}

export async function POST(requete: Request) {
  let corps: Corps;
  try {
    corps = await requete.json();
  } catch {
    return echec("Requête illisible.", 400);
  }

  // Piege a robots : on repond comme si tout allait bien, sans rien envoyer.
  if (corps.site_web && corps.site_web.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0].trim() || "inconnue";
  if (tropDEnvois(ip)) {
    return echec("Vous avez déjà envoyé plusieurs messages. Réessayez dans un quart d'heure.", 429);
  }

  const nom = (corps.nom || "").trim();
  const email = (corps.email || "").trim().toLowerCase();
  const etablissement = (corps.etablissement || "").trim();

  if (!nom || !etablissement) {
    return echec("Merci d'indiquer votre nom et celui de votre établissement.", 400);
  }
  if (!EMAIL.test(email)) {
    return echec("Cette adresse email ne semble pas valide.", 400);
  }
  if (corps.consentement !== true) {
    return echec("Merci de cocher la case avant d'envoyer.", 400);
  }

  const hote = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const utilisateur = process.env.SMTP_USER;
  const motDePasse = process.env.SMTP_PASSWORD;

  if (!utilisateur || !motDePasse) {
    console.error("SMTP_USER ou SMTP_PASSWORD absente : envoi impossible.");
    return echec("L'envoi est momentanément indisponible.", 503);
  }

  const lignes = [
    `Nom : ${nom}`,
    `Établissement : ${etablissement}`,
    `Ville : ${corps.ville?.trim() || "non précisée"}`,
    `Type de lieu : ${corps.type_de_lieu?.trim() || "non précisé"}`,
    `Email : ${email}`,
    `Période envisagée : ${corps.periode?.trim() || "non précisée"}`,
    "",
    "Ce qu'ils cherchent :",
    corps.recherche?.trim() || "(rien de précisé)",
  ];

  try {
    const transport = nodemailer.createTransport({
      host: hote,
      port,
      secure: port === 465,
      auth: { user: utilisateur, pass: motDePasse },
    });

    await transport.sendMail({
      from: `"Site melnourdi.fr" <${utilisateur}>`,
      to: EMAIL_CONTACT_PRO,
      replyTo: `"${nom}" <${email}>`,
      subject: `Collaboration : ${etablissement}${corps.ville ? `, ${corps.ville.trim()}` : ""}`,
      text: lignes.join("\n"),
    });
  } catch (erreur) {
    console.error("Envoi du message professionnel impossible :", erreur);
    return echec("Le message n'a pas pu partir. Réessayez dans un instant.", 502);
  }

  enregistrer(ip);
  return NextResponse.json({ ok: true });
}

function tropDEnvois(ip: string): boolean {
  const maintenant = Date.now();
  const recents = (historique.get(ip) || []).filter((t) => maintenant - t < FENETRE_MS);
  historique.set(ip, recents);
  return recents.length >= MAX_ENVOIS;
}

function enregistrer(ip: string) {
  const recents = historique.get(ip) || [];
  recents.push(Date.now());
  historique.set(ip, recents);
}

function echec(message: string, statut: number) {
  return NextResponse.json({ ok: false, message }, { status: statut });
}
