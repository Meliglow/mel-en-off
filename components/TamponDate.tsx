"use client";

import { useEntree } from "./useEntree";

/**
 * Le tampon dateur d'une fiche : le mois et l'annee du test.
 * La date complete reste sur l'etiquette, juste en dessous.
 *
 * Il s'encre quand il entre dans l'ecran : il arrive a 114 % et transparent,
 * il finit a 100 % et 82 % d'opacite, en 500 ms.
 */
export default function TamponDate({ date }: { date: string }) {
  const { ref, etat } = useEntree<HTMLSpanElement>();

  return (
    <span
      ref={ref}
      className={`tampon-date ${etat === "visible" ? "visible" : ""} ${
        etat === "immediat" ? "immediat" : ""
      }`}
    >
      Testé en
      <b>{moisEtAnnee(date)}</b>
    </span>
  );
}

// "2026-06-12" devient "06.26".
function moisEtAnnee(iso: string): string {
  const m = /^(\d{4})-(\d{2})-\d{2}$/.exec(iso.trim());
  if (!m) return iso;
  return `${m[2]}.${m[1].slice(2)}`;
}
