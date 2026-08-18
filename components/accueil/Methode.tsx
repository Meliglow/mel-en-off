import TraitTrace from "@/components/TraitTrace";
// Bloc 2 : comment je travaille. Trois lignes, chacune dans son encadre.
const LIGNES = [
  "Je teste tout moi-même, sur place.",
  "Chaque adresse porte la date où je l'ai testée.",
  "Je dis ce que j'ai payé.",
];

export default function Methode() {
  return (
    <section className="mt-10 px-5">
      <div className="filets" aria-hidden />
      <h2 className="h2 mt-4">Comment je travaille</h2>
      {/* L'animation de cette section, c'est ce trait. Rien d'autre ne bouge ici. */}
      <TraitTrace className="mt-2" />

      {/* Empilees sur mobile, cote a cote des qu'il y a la place. */}
      <ul className="mt-4 grid gap-3 md:grid-cols-3">
        {LIGNES.map((ligne) => (
          <li key={ligne} className="carte p-4 text-[16px] leading-relaxed text-texte">
            {ligne}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[14px] italic leading-relaxed text-texte2 md:max-w-canvas">
        Une invitation ne change pas le verdict. Si l&apos;adresse ne vaut pas le coup, je ne la
        publie pas. Et quand je suis invitée, c&apos;est écrit.
      </p>
    </section>
  );
}
