"use client";

import Trombone from "./Trombone";
import { useEntree } from "./useEntree";
import { NOTE_EN_MARGE } from "@/config";

/**
 * Le petit mot griffonne juste sous les photos : une astuce de voyage sur la
 * destination du moment. Fond ligne, filet vertical du cahier, trombone.
 *
 * L'unique animation de ce bloc : le texte s'ecrit de gauche a droite quand il
 * entre dans l'ecran. C'est un clip-path, donc rien ne bouge dans la mise en
 * page, et rien ne s'anime si le bloc est deja visible au chargement.
 *
 * UNE SEULE par page. Le texte vient de config.ts. Texte vide, pas de bloc.
 */
export default function NoteEnMarge() {
  const { ref, etat } = useEntree<HTMLParagraphElement>();
  const texte = NOTE_EN_MARGE.trim();
  if (!texte) return null;

  return (
    <section className="mt-6 px-5">
      <div className="note-marge lignes md:max-w-lecture">
        <Trombone className="absolute -top-4 right-5 h-11 w-5 text-texte3" />
        <p
          ref={ref}
          className={`note-marge-texte ${etat === "attente" ? "attente" : ""} ${
            etat === "visible" ? "visible" : ""
          }`}
        >
          {texte}
        </p>
      </div>
    </section>
  );
}
