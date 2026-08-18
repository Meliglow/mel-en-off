import { TITRES_DU_DIMANCHE } from "@/config";

// Bloc 4 : les trois titres du prochain envoi.
// Ils viennent de config.ts, Mel les change chaque semaine sans toucher au code.
export default function CeDimanche() {
  const titres = TITRES_DU_DIMANCHE.filter((t) => t.trim() !== "");
  if (titres.length === 0) return null;

  return (
    <section className="mt-10 px-5">
      <div className="filets" aria-hidden />
      <h2 className="h2 mt-4">Dans EN OFF ce dimanche</h2>

      <ul className="mt-4 flex flex-col gap-3">
        {titres.map((titre) => (
          <li key={titre} className="carte p-4">
            <p className="text-[16px] leading-relaxed text-texte">{titre}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
