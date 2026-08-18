"use client";

import { useState } from "react";
import { bascule } from "@/archives/lib/filtres";

const TYPES_LIEU = ["Restaurant", "Spa", "Hôtel ou maison d'hôtes", "Activité"];
const SOUHAITS = [
  "Séjour ou table testée",
  "Contenu à réutiliser (UGC)",
  "Mise en avant dans les coups de cœur",
  "Ouverture ou événement",
];

export default function FormulaireCollab() {
  const [types, setTypes] = useState<string[]>([]);
  const [souhaits, setSouhaits] = useState<string[]>([]);
  const [ville, setVille] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [envoye, setEnvoye] = useState(false);

  if (envoye) {
    return (
      <div className="carte mt-6 p-5" role="status">
        <p className="font-serif text-[24px] text-encre">Message bien reçu.</p>
        <p className="mt-2 text-[15px] leading-relaxed text-texte">
          Je lis tout moi-même et je vous réponds sous 48h. À très vite.
        </p>
        <p className="signature mt-3 text-[30px] text-terracotta">Mel</p>
      </div>
    );
  }

  return (
    <form
      className="mt-6 flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        setEnvoye(true);
      }}
    >
      {/* Type de lieu, puces cumulables */}
      <fieldset>
        <legend className="surtitre">Votre lieu</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TYPES_LIEU.map((t) => (
            <button key={t} type="button" className={`puce ${types.includes(t) ? "active" : ""}`} aria-pressed={types.includes(t)} onClick={() => setTypes((v) => bascule(v, t))}>
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Ce que le pro souhaite, puces cumulables */}
      <fieldset>
        <legend className="surtitre">Ce que vous cherchez</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {SOUHAITS.map((s) => (
            <button key={s} type="button" className={`puce ${souhaits.includes(s) ? "active" : ""}`} aria-pressed={souhaits.includes(s)} onClick={() => setSouhaits((v) => bascule(v, s))}>
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="collab-ville" className="surtitre">
            Ville
          </label>
          <input id="collab-ville" className="champ mt-2" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="La ville de votre établissement" />
        </div>
        <div>
          <label htmlFor="collab-nom" className="surtitre">
            Nom du lieu
          </label>
          <input id="collab-nom" className="champ mt-2" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Le nom de votre établissement" />
        </div>
        <div>
          <label htmlFor="collab-email" className="surtitre">
            E-mail
          </label>
          <input id="collab-email" type="email" required className="champ mt-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@votrelieu.fr" />
        </div>
        <div>
          <label htmlFor="collab-message" className="surtitre">
            Votre message
          </label>
          <textarea
            id="collab-message"
            className="champ mt-2"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Dites-moi tout : vos dates, votre budget, ce que vous attendez."
          />
        </div>
      </div>

      <div>
        <button type="submit" className="btn btn-terracotta w-full">
          Envoyer ma demande
        </button>
        <p className="mt-2 text-center text-[13px] text-texte2">Réponse sous 48h, par mes soins.</p>
      </div>
    </form>
  );
}
