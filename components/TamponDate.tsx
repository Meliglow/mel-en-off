"use client";

import { formaterDate } from "@/lib/types";
import { useEntree } from "./useEntree";

/**
 * Le tampon dateur d'une fiche d'adresse. Il remplace l'ancienne etiquette de
 * date. Il s'encre quand il entre dans l'ecran : il arrive a 114 % et
 * transparent, il finit a 100 % et 82 % d'opacite, en 500 ms.
 */
export default function TamponDate({ date }: { date: string }) {
  const { ref, etat } = useEntree<HTMLSpanElement>();

  return (
    <span
      ref={ref}
      className={`tampon-date ${etat === "attente" ? "attente" : ""} ${
        etat === "visible" ? "visible" : ""
      } ${etat === "immediat" ? "immediat" : ""}`}
    >
      testé le {formaterDate(date)}
    </span>
  );
}
