import TitreSection from "@/components/TitreSection";
import { TITRES_DU_DIMANCHE } from "@/config";

// Bloc 4 : les trois titres du prochain envoi.
// Ils viennent de config.ts, Mel les change chaque semaine sans toucher au code.
export default function CeDimanche() {
  const titres = TITRES_DU_DIMANCHE.filter((t) => t.trim() !== "");
  if (titres.length === 0) return null;

  return (
    <section className="mt-14 px-5">
      <div className="filets" aria-hidden />
      <TitreSection className="mt-5">Dans EN OFF ce dimanche</TitreSection>

      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {titres.map((titre) => (
          <li key={titre} className="carte p-5">
            <p className="text-[16px] leading-relaxed text-texte">{titre}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
