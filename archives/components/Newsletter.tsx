"use client";

import { useState } from "react";

// Icones dessinees (aucun emoji).
function IconAvion({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function IconGlobe({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.7 2.5 15.3 0 18" />
      <path d="M12 3c-2.5 2.7-2.5 15.3 0 18" />
    </svg>
  );
}

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(false);

  return (
    <section id="lettre" className="mt-10 scroll-mt-4 px-5">
      <div className="relative overflow-hidden rounded-carte border border-dashed border-bord2 bg-carte p-5 shadow-douce">
        {/* Bandeau "par avion" */}
        <div
          aria-hidden
          className="-mx-5 -mt-5 mb-4 h-2.5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--terracotta) 0 8px, transparent 8px 16px, var(--vert) 16px 24px, transparent 24px 32px)",
          }}
        />

        {/* En-tete carte postale : mention + timbre */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-terracotta">
            <IconAvion className="h-5 w-5" />
            <span className="surtitre" style={{ color: "var(--terracotta)" }}>
              Par avion
            </span>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-[6px] border-2 border-dashed border-bord2 text-texte3">
            <IconGlobe className="h-6 w-6" />
          </div>
        </div>

        {/* Ligne de vol pointillee */}
        <div className="mt-3 flex items-center gap-2" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-terracotta" />
          <span className="flex-1 border-t border-dashed border-bord2" />
          <IconAvion className="h-4 w-4 text-terracotta" />
        </div>

        <h2 className="h2 mt-4">La lettre du mois</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-texte">
          Une fois par mois, mes dernières trouvailles et les adresses à fuir, direct dans votre
          boîte. Rien d'autre.
        </p>

        {envoye ? (
          <p className="mt-4 rounded-champ border border-dashed border-vert/40 bg-sable p-4 text-[15px] text-vert" role="status">
            C'est noté, merci ! La prochaine lettre part bientôt.
          </p>
        ) : (
          <form
            className="mt-4 flex flex-col gap-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setEnvoye(true);
            }}
          >
            <label htmlFor="nl-email" className="sr-only">
              Votre e-mail
            </label>
            <input
              id="nl-email"
              type="email"
              required
              className="champ"
              placeholder="votre@email.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn-terracotta w-full">
              <IconAvion className="h-4 w-4" />
              Je m'embarque
            </button>
          </form>
        )}

        <p className="mt-2 text-[12px] text-texte2">
          Désinscription en un clic, à tout moment. Vos données restent entre nous.
        </p>
      </div>
    </section>
  );
}
