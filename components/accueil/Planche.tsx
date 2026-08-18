import Polaroid from "@/components/Polaroid";
import Reveal from "@/components/Reveal";
import TitreSection from "@/components/TitreSection";
import { PHOTOS_PLANCHE } from "@/config";

/**
 * En ce moment : les dernieres photos, posees comme des polaroids sur la table.
 * Deux par ligne sur telephone, quatre des qu'il y a la place.
 *
 * Sans photo, le bloc entier disparait : pas de cadre vide, pas d'aplat gris.
 */
export default function Planche() {
  const photos = PHOTOS_PLANCHE.filter((p) => p.fichier.trim() !== "");
  if (photos.length === 0) return null;

  return (
    <section className="mt-14 px-5">
      <TitreSection>En ce moment</TitreSection>

      <p className="mt-4 max-w-lecture text-[15px] leading-relaxed text-texte">
        Je publie mes tests au fur et à mesure. Les adresses finissent toujours dans la lettre.
      </p>

      {/* La grille s'adapte au nombre de photos : une seule ne s'etale pas sur
          toute la largeur, quatre tiennent sur une ligne. */}
      <div className={`mt-6 grid gap-4 md:gap-5 ${grille(photos.length)}`}>
        {photos.map((p, i) => (
          <Reveal key={p.fichier} rang={i}>
            <Polaroid
              fichier={p.fichier}
              legende={p.legende}
              alt={p.legende}
              inclinaison={i % 2 === 0 ? "gauche" : "droite"}
            />
          </Reveal>
        ))}
      </div>

      <p className="mt-6 max-w-lecture text-[15px] italic leading-relaxed text-texte2">
        Mais tout ne passe pas sur les réseaux. Le carnet complet est dans la lettre.
      </p>
    </section>
  );
}

function grille(nombre: number): string {
  if (nombre === 1) return "max-w-[300px]";
  if (nombre === 2) return "grid-cols-2 md:max-w-[620px]";
  if (nombre === 3) return "grid-cols-2 md:grid-cols-3";
  return "grid-cols-2 md:grid-cols-4";
}
