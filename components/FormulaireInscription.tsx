"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent, useId, useState } from "react";

// Meme formulaire partout, seule l'etiquette de source change :
//   hero de l'accueil     -> lettre
//   guide gratuit         -> guide-spas-idf
//   page d'une ville      -> carnet-[slug-ville]
export default function FormulaireInscription({
  source,
  libelleBouton,
}: {
  source: string;
  libelleBouton: string;
}) {
  const router = useRouter();
  const id = useId();
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [etat, setEtat] = useState<"repos" | "envoi">("repos");
  const [erreur, setErreur] = useState("");

  async function envoyer(e: FormEvent) {
    e.preventDefault();
    setErreur("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setErreur("Cette adresse email ne semble pas valide.");
      return;
    }
    if (!consentement) {
      setErreur("Il faut cocher la case pour recevoir la lettre.");
      return;
    }

    setEtat("envoi");
    try {
      const reponse = await fetch("/api/inscription", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prenom, email, consentement, source }),
      });
      const donnees = await reponse.json().catch(() => ({}));

      if (!reponse.ok) {
        setErreur(donnees.message || "L'inscription n'a pas pu aboutir. Réessaie dans un instant.");
        setEtat("repos");
        return;
      }

      // Sert uniquement aux trois questions de la page /merci.
      try {
        sessionStorage.setItem("en-off-email", email.trim().toLowerCase());
      } catch {
        // Navigation privee : ce n'est pas grave, les questions seront masquees.
      }
      router.push("/merci");
    } catch {
      setErreur("La connexion a échoué. Réessaie dans un instant.");
      setEtat("repos");
    }
  }

  const enCours = etat === "envoi";

  return (
    <form className="flex flex-col gap-2.5" onSubmit={envoyer} noValidate>
      <label htmlFor={`${id}-prenom`} className="sr-only">
        Ton prénom
      </label>
      <input
        id={`${id}-prenom`}
        name="prenom"
        type="text"
        autoComplete="given-name"
        className="champ"
        placeholder="Ton prénom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        disabled={enCours}
      />

      <label htmlFor={`${id}-email`} className="sr-only">
        Ton email
      </label>
      <input
        id={`${id}-email`}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        className="champ"
        placeholder="Ton email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={enCours}
      />

      <label htmlFor={`${id}-consentement`} className="mt-1 flex items-start gap-2.5 text-[13px] leading-snug text-texte">
        <input
          id={`${id}-consentement`}
          name="consentement"
          type="checkbox"
          required
          className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--vert)]"
          checked={consentement}
          onChange={(e) => setConsentement(e.target.checked)}
          disabled={enCours}
        />
        <span>
          Je souhaite recevoir EN OFF et les emails de Mel. Je peux me désinscrire à tout moment.
        </span>
      </label>

      <p className="text-[12px] leading-snug text-texte2">
        Tes données servent uniquement à t&apos;envoyer la lettre et mes emails.{" "}
        <Link href="/confidentialite" className="underline">
          En savoir plus
        </Link>
      </p>

      {erreur && (
        <p className="text-[13px] font-semibold text-brique" role="alert">
          {erreur}
        </p>
      )}

      <button type="submit" className="btn btn-vert w-full disabled:opacity-60" disabled={enCours}>
        {enCours ? "Un instant..." : libelleBouton}
      </button>
    </form>
  );
}
