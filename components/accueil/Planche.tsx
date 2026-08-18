import Polaroid from "@/components/Polaroid";
import Reveal from "@/components/Reveal";
import { PHOTOS_PLANCHE, RESEAUX } from "@/config";

/**
 * La planche de photos, comme des polaroids poses sur la table.
 *
 * Sans photo, le bloc entier disparait : pas de cadre vide, pas d'aplat gris.
 */
export default function Planche() {
  const photos = PHOTOS_PLANCHE.filter((p) => p.fichier.trim() !== "");
  if (photos.length === 0) return null;

  return (
    <section className="mt-12 px-5">
      <div className="filets" aria-hidden />
      <h2 className="h2 mt-4">Ce que je rapporte</h2>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
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

      <p className="mt-8 text-center text-[14px] text-texte2">
        La suite en images sur{" "}
        <a href={RESEAUX.instagram} target="_blank" rel="noopener noreferrer" className="underline">
          Instagram
        </a>{" "}
        et{" "}
        <a href={RESEAUX.tiktok} target="_blank" rel="noopener noreferrer" className="underline">
          TikTok
        </a>
        .
      </p>
    </section>
  );
}
