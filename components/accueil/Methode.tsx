import TitreSection from "@/components/TitreSection";

// Bloc 2 : comment je travaille, ecrit comme une liste dans un carnet.
const LIGNES = [
  "Je teste tout moi-même, sur place.",
  "Chaque adresse porte la date où je l'ai testée.",
  "Je dis ce que j'ai payé.",
];

export default function Methode() {
  return (
    <section className="mt-14 px-5">
      <div className="filets" aria-hidden />
      {/* L'animation de cette section, c'est le trait sous le titre. Rien d'autre. */}
      <TitreSection className="mt-5">Comment je travaille</TitreSection>

      {/* Une page de cahier : les filets, l'ecriture posee dessus, et le tiret
          de terracotta devant chaque ligne. */}
      <div className="page-cahier lignes mt-6 max-w-lecture">
        <ul className="flex flex-col">
          {LIGNES.map((ligne) => (
            <li key={ligne} className="ecriture flex gap-2.5">
              <span aria-hidden className="shrink-0 text-terracotta">
                —
              </span>
              <span>{ligne}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 max-w-lecture text-[14px] italic leading-relaxed text-texte2">
        Une invitation ne change pas le verdict. Si l&apos;adresse ne vaut pas le coup, je ne la
        publie pas. Et quand je suis invitée, c&apos;est écrit.
      </p>
    </section>
  );
}
