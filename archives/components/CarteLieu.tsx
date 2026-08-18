import Link from "next/link";
import { Lieu, labelCategorie } from "@/archives/lib/types";
import Placeholder from "./Placeholder";
import PastilleVerdict from "./PastilleVerdict";

function PastilleCat({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-carte/95 px-2.5 py-1 text-[11px] font-semibold text-texte shadow-douce">
      {label}
    </span>
  );
}

function BadgeMiseEnAvant() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-dore2/40 bg-dore px-2.5 py-1 text-[11px] font-bold text-dore2">
      ✦ Mise en avant
    </span>
  );
}

// Rend la photo si elle existe, sinon un emplacement etiquete.
function Cover({ lieu, ratio, className }: { lieu: Lieu; ratio: string; className: string }) {
  if (lieu.photos && lieu.photos[0]) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={lieu.photos[0]} alt={lieu.name} loading="lazy" className={`${className} object-cover`} />
    );
  }
  return <Placeholder label={lieu.name} ratio={ratio} className={className} rounded="rounded-none" />;
}

// Variante "carrousel" : carte compacte 230px pour les coups de coeur.
function CarteCarrousel({ lieu }: { lieu: Lieu }) {
  return (
    <Link
      href={`/lieux/${lieu.id}`}
      className="carte lift block w-[230px] shrink-0 snap-start overflow-hidden"
    >
      <div className="relative">
        <Cover lieu={lieu} ratio="16:9" className="h-[130px] w-full" />
        <div className="absolute left-2.5 top-2.5">
          <PastilleCat label={labelCategorie(lieu.cat)} />
        </div>
        {lieu.sponsored && (
          <div className="absolute right-2.5 top-2.5">
            <BadgeMiseEnAvant />
          </div>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="h3 text-[19px]">{lieu.name}</h3>
        <p className="mt-1 text-[12px] font-medium text-texte2">
          {lieu.city} · {labelCategorie(lieu.cat)} · {lieu.budget}
        </p>
        <p className="mt-2 text-[13px] leading-snug text-texte">{lieu.accroche}</p>
      </div>
    </Link>
  );
}

// Variante "liste" : fiche pleine largeur pour les resultats.
function CarteListe({ lieu }: { lieu: Lieu }) {
  return (
    <Link href={`/lieux/${lieu.id}`} className="carte lift block overflow-hidden">
      <div className="relative">
        <Cover lieu={lieu} ratio="3:2" className="h-[180px] w-full" />
        <div className="absolute left-3 top-3">
          <PastilleVerdict verdict={lieu.verdict} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="h3">{lieu.name}</h3>
          <span className="shrink-0 text-[15px] font-semibold text-texte2">{lieu.budget}</span>
        </div>
        <p className="mt-1 text-[12px] font-medium text-texte2">
          {lieu.city}, {lieu.country} · {labelCategorie(lieu.cat)}
        </p>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-texte">{lieu.note}</p>
        {lieu.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {lieu.tags.map((t) => (
              <span key={t} className="puce-contour">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function CarteLieu({
  lieu,
  variante = "liste",
}: {
  lieu: Lieu;
  variante?: "liste" | "carrousel";
}) {
  return variante === "carrousel" ? <CarteCarrousel lieu={lieu} /> : <CarteListe lieu={lieu} />;
}
