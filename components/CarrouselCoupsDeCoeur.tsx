"use client";

import { useEffect, useRef, useState } from "react";
import { Categorie, CATEGORIES, Lieu } from "@/lib/types";
import CarteLieu from "./CarteLieu";
import Puce from "./Puce";

type FiltreCat = "tout" | Categorie;

const ONGLETS: { value: FiltreCat; label: string }[] = [
  { value: "tout", label: "Tout" },
  ...CATEGORIES.map((c) => ({ value: c.value as FiltreCat, label: c.label })),
];

export default function CarrouselCoupsDeCoeur({ lieux }: { lieux: Lieu[] }) {
  const [cat, setCat] = useState<FiltreCat>("tout");
  const scroller = useRef<HTMLDivElement>(null);
  const pauseJusqua = useRef(0);

  const coups = lieux.filter((l) => l.verdict === "coup de coeur");
  const visibles = cat === "tout" ? coups : coups.filter((l) => l.cat === cat);

  // Defilement automatique en boucle, en pause quand on interagit.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pas = () => {
      const premiere = el.firstElementChild as HTMLElement | null;
      return premiere ? premiere.offsetWidth + 12 : 242;
    };

    const id = window.setInterval(() => {
      if (Date.now() < pauseJusqua.current) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: pas(), behavior: "smooth" });
      }
    }, 3200);

    return () => window.clearInterval(id);
  }, [visibles.length]);

  const suspendre = () => {
    pauseJusqua.current = Date.now() + 6000;
  };

  return (
    <section id="coups" className="mt-10 scroll-mt-4 bg-sable py-8">
      <div className="px-5">
        <div className="filets" aria-hidden />
        <h2 className="h2 mt-3">
          <span className="text-terracotta">♡</span> Mes coups de cœur
        </h2>
        <p className="mt-1 text-[14px] text-texte2">Les adresses que je recommande les yeux fermés.</p>

        {/* Puces de categorie qui filtrent le carrousel */}
        <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
          {ONGLETS.map((o) => (
            <div key={o.value} className="shrink-0">
              <Puce label={o.label} active={cat === o.value} onClick={() => setCat(o.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* Carrousel horizontal qui defile */}
      <div
        ref={scroller}
        onPointerDown={suspendre}
        onTouchStart={suspendre}
        className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1"
      >
        {visibles.map((l) => (
          <CarteLieu key={l.id} lieu={l} variante="carrousel" />
        ))}
        {visibles.length === 0 && (
          <p className="py-6 text-[14px] text-texte2">Rien dans cette catégorie pour le moment.</p>
        )}
      </div>

      {/* Mention de transparence */}
      <p className="mt-3 px-5 text-[12px] leading-snug text-texte2">
        Certains lieux sont mis en avant par des partenaires. Je les teste comme les autres, et je
        les retire dès que ça ne suit plus.
      </p>
    </section>
  );
}
