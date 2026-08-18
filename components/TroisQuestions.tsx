"use client";

import { useEffect, useState } from "react";
import { DESTINATIONS_PROPOSEES } from "@/config";

// Trois questions facultatives. Elles posent des etiquettes supplementaires sur
// le contact, via la meme route que le formulaire d'inscription.
// Personne n'est bloque ici : sans reponse, l'inscription reste valable.

const COMPAGNIES = ["Seule", "Avec une amie ou ma sœur", "En couple", "En famille"];

const INTENTIONS = ["Bien manger", "Bien dormir", "Me faire du bien", "Rapporter quelque chose"];

export default function TroisQuestions() {
  const [email, setEmail] = useState<string | null>(null);
  const [destination, setDestination] = useState("");
  const [compagnie, setCompagnie] = useState("");
  const [intention, setIntention] = useState("");
  const [etat, setEtat] = useState<"repos" | "envoi" | "envoye">("repos");

  useEffect(() => {
    try {
      setEmail(sessionStorage.getItem("en-off-email"));
    } catch {
      setEmail(null);
    }
  }, []);

  // Visite directe de la page, sans inscription : rien a demander.
  if (!email) return null;

  async function envoyer() {
    if (!destination && !compagnie && !intention) return;
    setEtat("envoi");
    try {
      await fetch("/api/inscription", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          consentement: true,
          source: "merci",
          destination,
          compagnie,
          intention,
        }),
      });
    } catch {
      // Une reponse perdue ne doit rien casser : la personne reste inscrite.
    }
    setEtat("envoye");
  }

  if (etat === "envoye") {
    return (
      <div className="carte mt-8 p-5" role="status">
        <p className="h3">Merci, c&apos;est noté.</p>
        <p className="mt-2 text-[15px] leading-relaxed text-texte md:max-w-lecture">
          Je t&apos;enverrai en priorité ce qui correspond à ce que tu prépares.
        </p>
      </div>
    );
  }

  const enCours = etat === "envoi";

  return (
    <section className="mt-10 px-5">
      <div className="filets" aria-hidden />
      <h2 className="h2 mt-4">Trois questions, si tu as trente secondes</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-texte md:max-w-lecture">
        Pour t&apos;envoyer ce qui te sert vraiment. Tu peux aussi ne rien répondre, ton
        inscription est déjà valable.
      </p>

      <Question
        titre="Tu pars où en premier ?"
        options={DESTINATIONS_PROPOSEES}
        valeur={destination}
        surChoix={setDestination}
        desactive={enCours}
      />
      <Question
        titre="Tu pars avec qui ?"
        options={COMPAGNIES}
        valeur={compagnie}
        surChoix={setCompagnie}
        desactive={enCours}
      />
      <Question
        titre="Ce qui compte le plus pour toi ?"
        options={INTENTIONS}
        valeur={intention}
        surChoix={setIntention}
        desactive={enCours}
      />

      <button
        type="button"
        className="btn btn-vert mt-6 w-full disabled:opacity-60"
        onClick={envoyer}
        disabled={enCours || (!destination && !compagnie && !intention)}
      >
        {enCours ? "Un instant..." : "Envoyer mes réponses"}
      </button>
    </section>
  );
}

function Question({
  titre,
  options,
  valeur,
  surChoix,
  desactive,
}: {
  titre: string;
  options: string[];
  valeur: string;
  surChoix: (v: string) => void;
  desactive: boolean;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="surtitre">{titre}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`puce ${valeur === o ? "active" : ""}`}
            aria-pressed={valeur === o}
            onClick={() => surChoix(valeur === o ? "" : o)}
            disabled={desactive}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
