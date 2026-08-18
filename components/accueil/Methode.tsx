import TitreSection from "@/components/TitreSection";

// Bloc 2 : comment je travaille. Trois lignes, chacune dans son encadre.
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

      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {LIGNES.map((ligne) => (
          <li key={ligne} className="carte p-5 text-[16px] leading-relaxed text-texte">
            {ligne}
          </li>
        ))}
      </ul>

      <p className="mt-5 max-w-lecture text-[14px] italic leading-relaxed text-texte2">
        Une invitation ne change pas le verdict. Si l&apos;adresse ne vaut pas le coup, je ne la
        publie pas. Et quand je suis invitée, c&apos;est écrit.
      </p>
    </section>
  );
}
