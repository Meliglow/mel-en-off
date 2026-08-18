import { cheminPhoto } from "@/lib/types";

/**
 * Une photo posee comme un polaroid : ratio 4:5, cadre blanc epais en bas,
 * legende manuscrite, inclinaison de 2 degres.
 *
 * Sans photo, le composant ne rend RIEN. Jamais de rectangle gris, jamais de
 * silhouette : la mise en page se replie autour.
 */
export default function Polaroid({
  fichier,
  legende,
  alt,
  inclinaison = "gauche",
  className = "",
  premierEcran = false,
}: {
  fichier: string;
  legende: string;
  alt: string;
  inclinaison?: "gauche" | "droite";
  className?: string;
  premierEcran?: boolean;
}) {
  const src = cheminPhoto(fichier);
  if (!src) return null;

  return (
    <figure
      className={`polaroid ${inclinaison === "droite" ? "polaroid-droite" : ""} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={premierEcran ? "eager" : "lazy"}
        decoding="async"
      />
      <figcaption>{legende}</figcaption>
    </figure>
  );
}
