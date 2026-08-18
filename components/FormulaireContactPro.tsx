"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

// Formulaire professionnel. Il envoie un email, il n'inscrit personne a la
// lettre. Vouvoiement, comme toute la page /collaborations.
const TYPES_DE_LIEU = ["Hôtel", "Spa", "Restaurant", "Office de tourisme", "Autre"];

export default function FormulaireContactPro() {
  const [etat, setEtat] = useState<"repos" | "envoi" | "envoye">("repos");
  const [erreur, setErreur] = useState("");

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");

    const donnees = Object.fromEntries(new FormData(e.currentTarget).entries());
    const charge = {
      nom: String(donnees.nom || ""),
      etablissement: String(donnees.etablissement || ""),
      ville: String(donnees.ville || ""),
      type_de_lieu: String(donnees.type_de_lieu || ""),
      email: String(donnees.email || ""),
      recherche: String(donnees.recherche || ""),
      periode: String(donnees.periode || ""),
      consentement: donnees.consentement === "on",
      site_web: String(donnees.site_web || ""),
    };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(charge.email)) {
      setErreur("Cette adresse email ne semble pas valide.");
      return;
    }
    if (!charge.consentement) {
      setErreur("Merci de cocher la case avant d'envoyer.");
      return;
    }

    setEtat("envoi");
    try {
      const reponse = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(charge),
      });
      const retour = await reponse.json().catch(() => ({}));
      if (!reponse.ok) {
        setErreur(retour.message || "Le message n'a pas pu partir. Réessayez dans un instant.");
        setEtat("repos");
        return;
      }
      setEtat("envoye");
    } catch {
      setErreur("La connexion a échoué. Réessayez dans un instant.");
      setEtat("repos");
    }
  }

  if (etat === "envoye") {
    return (
      <div className="carte mt-6 p-5" role="status">
        <p className="h3">Votre message est parti.</p>
        <p className="mt-2 text-[15px] leading-relaxed text-texte">
          Je lis tout moi-même. Vous recevrez une réponse à l&apos;adresse que vous avez indiquée.
        </p>
      </div>
    );
  }

  const enCours = etat === "envoi";

  return (
    <form className="mt-6 flex flex-col gap-3" onSubmit={envoyer} noValidate>
      {/* Champ piege : invisible pour un humain, rempli par les robots. */}
      <div aria-hidden className="hidden">
        <label htmlFor="pro-site-web">Ne remplissez pas ce champ</label>
        <input id="pro-site-web" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Champ id="pro-nom" nom="nom" libelle="Votre nom" autoComplete="name" desactive={enCours} />
      <Champ
        id="pro-etablissement"
        nom="etablissement"
        libelle="Votre établissement"
        autoComplete="organization"
        desactive={enCours}
      />
      <Champ id="pro-ville" nom="ville" libelle="Ville" desactive={enCours} />

      <div>
        <label htmlFor="pro-type" className="surtitre">
          Type de lieu
        </label>
        <select id="pro-type" name="type_de_lieu" className="champ mt-2" disabled={enCours}>
          {TYPES_DE_LIEU.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <Champ
        id="pro-email"
        nom="email"
        libelle="Votre email"
        type="email"
        autoComplete="email"
        desactive={enCours}
      />

      <div>
        <label htmlFor="pro-recherche" className="surtitre">
          Ce que vous cherchez
        </label>
        <textarea
          id="pro-recherche"
          name="recherche"
          rows={5}
          className="champ mt-2"
          placeholder="Le format qui vous intéresse, ce que vous attendez, vos contraintes."
          disabled={enCours}
        />
      </div>

      <Champ
        id="pro-periode"
        nom="periode"
        libelle="Période envisagée"
        desactive={enCours}
      />

      <label
        htmlFor="pro-consentement"
        className="mt-1 flex items-start gap-2.5 text-[13px] leading-snug text-texte"
      >
        <input
          id="pro-consentement"
          name="consentement"
          type="checkbox"
          required
          className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--vert)]"
          disabled={enCours}
        />
        <span>
          J&apos;accepte que ces informations servent à répondre à ma demande. Elles ne sont pas
          utilisées à d&apos;autres fins et ne rejoignent aucune liste de diffusion.
        </span>
      </label>

      <p className="text-[12px] leading-snug text-texte2">
        <Link href="/confidentialite" className="underline">
          Comment vos données sont traitées
        </Link>
      </p>

      {erreur && (
        <p className="text-[13px] font-semibold text-brique" role="alert">
          {erreur}
        </p>
      )}

      <button type="submit" className="btn btn-vert mt-1 w-full disabled:opacity-60" disabled={enCours}>
        {enCours ? "Un instant..." : "Envoyer"}
      </button>
    </form>
  );
}

function Champ({
  id,
  nom,
  libelle,
  type = "text",
  autoComplete,
  desactive,
}: {
  id: string;
  nom: string;
  libelle: string;
  type?: string;
  autoComplete?: string;
  desactive: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="surtitre">
        {libelle}
      </label>
      <input
        id={id}
        name={nom}
        type={type}
        autoComplete={autoComplete}
        className="champ mt-2"
        disabled={desactive}
      />
    </div>
  );
}
