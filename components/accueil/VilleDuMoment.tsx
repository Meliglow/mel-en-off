import Link from "next/link";
import Photo from "@/components/Photo";
import { VILLE_DU_MOMENT } from "@/config";

// Bloc 3 : une seule ville mise en avant, pilotee par config.ts.
// Aucune ville configuree, le bloc ne s'affiche pas.
export default function VilleDuMoment() {
  const ville = VILLE_DU_MOMENT;
  if (!ville) return null;

  return (
    <section className="mt-10 px-5">
      <div className="filets" aria-hidden />
      <p className="surtitre mt-3">La ville du moment</p>

      {/* Photo au-dessus sur mobile, photo a gauche des qu'il y a la place. */}
      <div className="carte mt-3 grid overflow-hidden md:grid-cols-2 md:items-center">
        <Photo
          fichier={ville.photo}
          alt={`${ville.nom}, la ville du moment`}
          className="aspect-[4/5] w-full md:h-full"
        />
        <div className="p-4 md:p-6">
          <h2 className="h2">{ville.nom}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">{ville.phrase}</p>
          <Link href={`/villes/${ville.slug}`} className="btn btn-contour mt-4 w-full">
            Voir le carnet
          </Link>
        </div>
      </div>
    </section>
  );
}
