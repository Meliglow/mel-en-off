"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import PastilleVerdict from "@/components/PastilleVerdict";
import Placeholder from "@/components/Placeholder";
import PiedDePage from "@/components/PiedDePage";
import SepFleur from "@/components/SepFleur";
import { Lieu, labelCategorie } from "@/lib/types";

type Slide =
  | { type: "video"; src: string }
  | { type: "photo"; src: string }
  | { type: "vide"; i: number };

export default function FicheClient({ lieu, similaires }: { lieu: Lieu; similaires: Lieu[] }) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [aime, setAime] = useState(false);
  const galerie = useRef<HTMLDivElement>(null);

  // Construit les diapos : video puis photos si fournies, sinon des emplacements.
  const slides: Slide[] = [];
  if (lieu.video) slides.push({ type: "video", src: lieu.video });
  (lieu.photos ?? []).forEach((p) => slides.push({ type: "photo", src: p }));
  if (slides.length === 0) {
    for (let i = 0; i < 3; i++) slides.push({ type: "vide", i });
  }
  const nb = slides.length;

  const onScroll = () => {
    const el = galerie.current;
    if (!el) return;
    setIdx(Math.round(el.scrollLeft / el.clientWidth));
  };

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${lieu.name} ${lieu.city}`
  )}`;

  return (
    <main>
      {/* Galerie plein cadre */}
      <div className="relative">
        <div
          ref={galerie}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        >
          {slides.map((s, i) => {
            const cls = "aspect-[4/5] w-full shrink-0 snap-center object-cover";
            if (s.type === "video") {
              return (
                <video key={i} src={s.src} controls playsInline preload="metadata" className={`${cls} bg-encre`} />
              );
            }
            if (s.type === "photo") {
              // eslint-disable-next-line @next/next/no-img-element
              return <img key={i} src={s.src} alt={`${lieu.name}, photo ${i + 1}`} className={cls} />;
            }
            return (
              <Placeholder
                key={i}
                label={`${lieu.name}, photo ${s.i + 1}`}
                ratio="4:5"
                className="aspect-[4/5] w-full shrink-0 snap-center"
                rounded="rounded-none"
              />
            );
          })}
        </div>

        {/* Boutons ronds 44px */}
        <div className="absolute left-4 top-4">
          <button type="button" className="btn-rond shadow-douce" aria-label="Retour" onClick={() => router.back()}>
            <span aria-hidden className="text-lg leading-none">
              ←
            </span>
          </button>
        </div>
        <div className="absolute right-4 top-4">
          <button
            type="button"
            className="btn-rond shadow-douce"
            aria-label={aime ? "Retirer des favoris" : "Ajouter aux favoris"}
            aria-pressed={aime}
            onClick={() => setAime((v) => !v)}
          >
            <span aria-hidden className={`text-lg leading-none ${aime ? "text-terracotta" : "text-encre"}`}>
              {aime ? "♥" : "♡"}
            </span>
          </button>
        </div>

        {/* Points de pagination */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, i) => (
            <span
              key={i}
              aria-hidden
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-papier" : "w-1.5 bg-papier/60"}`}
            />
          ))}
        </div>

        <div className="absolute bottom-4 left-4">
          <PastilleVerdict verdict={lieu.verdict} />
        </div>
      </div>

      {/* Corps */}
      <div className="px-5 pt-5">
        <h1 className="font-serif text-[34px] leading-[1.05] text-encre">{lieu.name}</h1>
        <p className="mt-1.5 text-[13px] font-medium text-texte2">
          {lieu.city}, {lieu.country} · {labelCategorie(lieu.cat)} · {lieu.budget}
        </p>

        {lieu.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {lieu.tags.map((t) => (
              <span key={t} className="puce-contour">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Avis long, signe */}
        <div className="mt-5">
          <p className="surtitre">Mon avis</p>
          <p className="mt-2 whitespace-pre-line text-[16px] leading-relaxed text-texte">{lieu.note}</p>
          <p className="signature mt-3 text-[30px] text-terracotta">Mel</p>
        </div>

        {/* Motifs si a eviter */}
        {lieu.verdict === "a eviter" && lieu.reasons.length > 0 && (
          <div className="mt-5 rounded-champ bg-encre p-4">
            <p className="surtitre text-dore">Pourquoi j'évite</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lieu.reasons.map((r) => (
                <span key={r} className="puce-brique">
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Infos pratiques */}
        <div className="mt-5">
          <p className="surtitre">Infos pratiques</p>
          <div className="carte mt-2 divide-y divide-bord">
            {lieu.horaires && (
              <div className="flex items-start justify-between gap-4 px-4 py-3">
                <span className="shrink-0 text-[13px] font-semibold text-texte2">Horaires</span>
                <span className="text-right text-[15px] text-texte">{lieu.horaires}</span>
              </div>
            )}
            <div className="flex items-start justify-between gap-4 px-4 py-3">
              <span className="shrink-0 text-[13px] font-semibold text-texte2">Adresse</span>
              <span className="text-right text-[15px] text-texte">
                {lieu.adresse ?? lieu.quartier ?? "Non précisé"}
              </span>
            </div>
            {lieu.tel && (
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="shrink-0 text-[13px] font-semibold text-texte2">Téléphone</span>
                <a href={`tel:${lieu.tel.replace(/\s+/g, "")}`} className="text-[15px] text-vert underline underline-offset-2">
                  {lieu.tel}
                </a>
              </div>
            )}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px] font-semibold text-texte2">Budget</span>
              <span className="text-[15px] text-texte">{lieu.budget}</span>
            </div>
            {lieu.reservation && (
              <div className="flex items-start justify-between gap-4 px-4 py-3">
                <span className="shrink-0 text-[13px] font-semibold text-texte2">Réservation</span>
                <span className="text-right text-[15px] text-texte">{lieu.reservation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions pratiques */}
        <div className="mt-4 flex flex-col gap-2.5">
          {lieu.site && (
            <a href={lieu.site} target="_blank" rel="noopener noreferrer" className="btn btn-vert w-full">
              Visiter le site
            </a>
          )}
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-contour w-full">
            Voir sur la carte
          </a>
          {lieu.tel && (
            <a href={`tel:${lieu.tel.replace(/\s+/g, "")}`} className="btn btn-contour w-full">
              Appeler
            </a>
          )}
        </div>

        {/* Aussi a {ville} */}
        {similaires.length > 0 && (
          <div className="mt-8">
            <SepFleur />
            <h2 className="h2 mt-4">Aussi à {lieu.city}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {similaires.map((s) => (
                <Link key={s.id} href={`/lieux/${s.id}`} className="carte overflow-hidden">
                  <Placeholder label={s.name} ratio="1:1" className="h-[110px] w-full" rounded="rounded-none" />
                  <div className="p-3">
                    <h3 className="font-serif text-[17px] leading-tight text-encre">{s.name}</h3>
                    <p className="mt-1 text-[11px] font-medium text-texte2">
                      {labelCategorie(s.cat)} · {s.budget}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <PiedDePage page={7} />
    </main>
  );
}
