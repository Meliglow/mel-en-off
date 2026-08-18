"use client";

import { useEntree } from "./useEntree";

/**
 * Apparition au defilement : opacite 0 vers 1, 14 px vers le haut, 550 ms.
 * Le decalage entre voisins se pose avec la prop "rang" (60 ms par rang).
 *
 * Un bloc deja present dans le premier ecran s'affiche sans animer.
 */
export default function Reveal({
  children,
  className = "",
  rang = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Position dans une serie de voisins : 0, 1, 2... 60 ms de decalage par rang. */
  rang?: number;
}) {
  const { ref, etat } = useEntree<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${etat === "visible" ? "visible" : ""} ${
        etat === "immediat" ? "immediat" : ""
      } ${className}`}
      style={rang > 0 ? { transitionDelay: `${rang * 60}ms` } : undefined}
    >
      {children}
    </div>
  );
}
