import Reveal from "./Reveal";
import Trombone from "./Trombone";
import { NOTE_EN_MARGE } from "@/config";

/**
 * Le petit mot griffonne dans la marge : fond ligne, filet vertical du cahier,
 * trombone en haut a droite, texte manuscrit.
 *
 * UNE SEULE par page. Le texte vient de config.ts, Mel le change sans toucher
 * au code. Texte vide, ni le bloc ni son espacement n'existent.
 */
export default function NoteEnMarge() {
  const texte = NOTE_EN_MARGE.trim();
  if (!texte) return null;

  return (
    <section className="mt-6 px-5">
      <Reveal>
        <div className="note-marge lignes md:max-w-lecture">
          <Trombone className="absolute -top-4 right-5 h-11 w-5 text-texte3" />
          <p className="note-marge-texte">{texte}</p>
        </div>
      </Reveal>
    </section>
  );
}
