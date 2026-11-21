import { NextResponse } from "next/server";
import { EMAIL_CONTACT_PRO } from "@/config";
import { safeOrigin, rateLimit, limitedBody } from "@/lib/booking-security";

// Commande du logiciel de réservation depuis /logiciel-reservation.
// Étape 1 (avant paiement) : coordonnées → email à Mel (Brevo) + page de paiement
//   sécurisée (variable STRIPE_SECRET_KEY sur Railway).
// Étape 2 (après paiement, { questionnaire: true }) : réponses du questionnaire → email à Mel,
//   avec le statut du paiement vérifié auprès de l'organisme de paiement.
// Le prix est fixé ici, jamais par le navigateur. Les moyens de paiement
// proposés (carte, paiement en 3 fois…) sont ceux activés dans le tableau de bord.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRIX_LANCEMENT = Number(process.env.OFFRE_PRIX || 290);
const SITE = (process.env.PUBLIC_SITE_URL || "https://melnourdi.fr").replace(/\/$/, "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TEL = /^[+\d][\d\s().-]{7,24}$/;

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max) : "");

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!safeOrigin(request)) return json({ message: "Origine refusée." }, 403);
  if (!rateLimit(request, "commande", 8)) return json({ message: "Trop de tentatives, réessaie dans quelques minutes." }, 429);

  let body: any;
  try { body = await limitedBody(request); } catch { return json({ message: "Demande illisible." }, 400); }
  if (clean(body?.website)) return json({ ok: true, pending: true });
  if (body?.questionnaire === true) return questionnaire(body);

  const c = body?.contact || {};
  const contact = {
    prenom: clean(c.prenom, 60), nom: clean(c.nom, 80), email: clean(c.email, 254).toLowerCase(),
    tel: clean(c.tel, 30), activite: clean(c.activite, 120), insta: clean(c.insta, 80),
  };
  if (!contact.prenom || !contact.nom || !contact.activite) return json({ message: "Indique ton prénom, ton nom et ton activité." }, 400);
  if (!EMAIL.test(contact.email)) return json({ message: "Vérifie ton adresse email." }, 400);
  if (!TEL.test(contact.tel)) return json({ message: "Vérifie ton numéro de téléphone." }, 400);

  const answers = readAnswers(body);

  // 1. Mel reçoit la demande tout de suite, même si le paiement n'aboutit pas.
  const brevo = process.env.BREVO_API_KEY;
  if (brevo) {
    const lignes = [
      `Prénom : ${contact.prenom}`, `Nom : ${contact.nom}`, `Email : ${contact.email}`, `Téléphone : ${contact.tel}`,
      `Activité : ${contact.activite}`, `Instagram : ${contact.insta || "non précisé"}`, "",
      ...answers.map(([q, r]) => `${q} : ${r}`), "",
      process.env.STRIPE_SECRET_KEY ? "Le client a été envoyé vers la page de paiement. Le questionnaire suivra une fois le paiement fait." : "Paiement en ligne pas encore activé : recontacte ce client.",
    ];
    try {
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { accept: "application/json", "content-type": "application/json", "api-key": brevo },
        body: JSON.stringify({
          sender: { name: "Site melnourdi.fr", email: "contact@melnourdi.fr" },
          to: [{ email: EMAIL_CONTACT_PRO }],
          replyTo: { name: `${contact.prenom} ${contact.nom}`, email: contact.email },
          subject: `Logiciel de réservation, nouvelle commande : ${contact.prenom} ${contact.nom} (${contact.activite})`,
          textContent: lignes.join("\n"),
        }),
      });
    } catch (e) { console.error("Email de commande impossible", e); }
  }

  // 2. Paiement.
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return json({ ok: true, pending: true });

  const p = new URLSearchParams();
  p.set("mode", "payment");
  p.set("locale", "fr");
  p.set("success_url", `${SITE}/logiciel-reservation?paiement=ok&session={CHECKOUT_SESSION_ID}#commande`);
  p.set("cancel_url", `${SITE}/logiciel-reservation?paiement=annule#precommande`);
  p.set("customer_email", contact.email);
  p.set("customer_creation", "always");
  p.set("billing_address_collection", "required");
  p.set("phone_number_collection[enabled]", "true");
  p.set("invoice_creation[enabled]", "true");
  p.set("line_items[0][quantity]", "1");
  p.set("line_items[0][price_data][currency]", "eur");
  p.set("line_items[0][price_data][unit_amount]", String(Math.round(PRIX_LANCEMENT * 100)));
  p.set("line_items[0][price_data][product_data][name]", "Logiciel de réservation à ton nom (tarif de lancement, tout inclus la 1re année)");
  for (const [k, v] of Object.entries(contact)) if (v) p.set(`metadata[${k}]`, v);
  p.set("payment_intent_data[description]", `Logiciel de réservation : ${contact.prenom} ${contact.nom}, ${contact.activite}`.slice(0, 250));

  try {
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: p,
    });
    const s = await r.json();
    if (!r.ok || typeof s?.url !== "string") {
      console.error("Paiement : erreur", s?.error?.message || r.status);
      return json({ ok: true, pending: true });
    }
    return json({ ok: true, url: s.url });
  } catch {
    return json({ ok: true, pending: true });
  }
}

function readAnswers(body: any): [string, string][] {
  return Array.isArray(body?.answers)
    ? body.answers.slice(0, 20).map((r: unknown) => (Array.isArray(r) ? [clean(r[0], 80), clean(r[1], 400)] : ["", ""])).filter((r: string[]) => r[0])
    : [];
}

async function questionnaire(body: any) {
  const answers = readAnswers(body);
  if (!answers.length) return json({ message: "Réponds au moins à une question." }, 400);
  const c = body?.contact || {};
  let who = [clean(c.prenom, 60), clean(c.nom, 80)].filter(Boolean).join(" ");
  let email = clean(c.email, 254).toLowerCase();
  let tel = clean(c.tel, 30);
  let paiement = "non vérifié";
  const session = clean(body?.session, 200);
  const key = process.env.STRIPE_SECRET_KEY;
  if (key && /^cs_[A-Za-z0-9_]+$/.test(session)) {
    try {
      const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${session}`, { headers: { Authorization: `Bearer ${key}` } });
      const s = await r.json();
      if (r.ok) {
        paiement = s.payment_status === "paid" ? "payé ✔" : `statut : ${s.payment_status}`;
        const d = s.customer_details || {};
        who = d.name || who; email = (d.email || email).toLowerCase(); tel = d.phone || tel;
      }
    } catch { /* on envoie quand même les réponses */ }
  }
  const brevo = process.env.BREVO_API_KEY;
  if (!brevo) return json({ message: "L'envoi est momentanément indisponible." }, 503);
  const lignes = [
    `Client : ${who || "non précisé"}`, `Email : ${email || "non précisé"}`, `Téléphone : ${tel || "non précisé"}`,
    `Activité : ${clean(c.activite, 120) || "non précisée"}`, `Paiement : ${paiement}`, "",
    ...answers.map(([q, r]) => `${q} : ${r}`),
  ];
  try {
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json", "api-key": brevo },
      body: JSON.stringify({
        sender: { name: "Site melnourdi.fr", email: "contact@melnourdi.fr" },
        to: [{ email: EMAIL_CONTACT_PRO }],
        ...(EMAIL.test(email) ? { replyTo: { name: who || email, email } } : {}),
        subject: `Logiciel de réservation, questionnaire : ${who || email || "client"} (${paiement})`,
        textContent: lignes.join("\n"),
      }),
    });
    if (!r.ok) throw new Error(String(r.status));
  } catch (e) {
    console.error("Email du questionnaire impossible", e);
    return json({ message: "L'envoi n'a pas pu partir." }, 502);
  }
  return json({ ok: true });
}
