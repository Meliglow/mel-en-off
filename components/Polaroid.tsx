import { cheminPhoto } from "@/lib/types";

/**
 * Une photo posee comme un polaroid : ratio 4:5, cadre blanc epais en bas,
 * legende manuscrite, inclinaison de 2 degres.
 *
 * La prop "note" ecrit quelques mots de plus sur le cadre blanc, sous la
 * legende, comme on griffonne au dos d'un tirage. Une seule par page.
 *
 * Sans photo, le composant ne rend RIEN. Jamais de rectangle gris, jamais de
 * silhouette : la mise en page se replie autour.
 */
export default function Polaroid({
  fichier,
  legende,
  alt,
  note,
  inclinaison = "gauche",
  className = "",
  premierEcran = false,
}: {
  fichier: string;
  legende: string;
  alt: string;
  note?: string;
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
        // React 18 ne transmet pas fetchPriority en camelCase : on passe
        // l attribut HTML tel quel.
        {...{ fetchpriority: premierEcran ? "high" : "auto" }}
        decoding="async"
      />
      <figcaption>
        {legende}
        {note && <span className="polaroid-note">{note}</span>}
      </figcaption>
    </figure>
  );
}
