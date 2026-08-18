import { cheminPhoto } from "@/lib/types";

// Une photo du dossier public/photos, servie telle quelle : aucune optimisation
// a la volee, les fichiers sont deja compresses par npm run optimiser-images.
// Sans photo, un aplat de couleur neutre prend la place. Rien ne casse jamais.
export default function Photo({
  fichier,
  alt,
  className = "",
  premierEcran = false,
}: {
  fichier: string;
  alt: string;
  className?: string;
  /** true seulement pour une image visible sans defiler. */
  premierEcran?: boolean;
}) {
  const src = cheminPhoto(fichier);

  if (!src) {
    return <div className={`bg-sable ${className}`} role="img" aria-label={alt} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={premierEcran ? "eager" : "lazy"}
      decoding="async"
      className={`object-cover ${className}`}
    />
  );
}
