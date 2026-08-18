"use client";

import { useEntree } from "./useEntree";

/**
 * Le trait irregulier sous un titre de section. Il se dessine de gauche a
 * droite en 1 s quand le titre entre dans l'ecran.
 *
 * pathLength="1" laisse le CSS travailler en fractions : le trait se dessine
 * exactement, quelle que soit la longueur reelle du trace.
 */
export default function TraitTrace({ className = "" }: { className?: string }) {
  const { ref, etat } = useEntree<SVGSVGElement>();

  return (
    <svg
      ref={ref}
      viewBox="0 0 96 8"
      fill="none"
      aria-hidden
      className={`trait-trace ${etat === "visible" ? "visible" : ""} ${
        etat === "immediat" ? "immediat" : ""
      } ${className}`}
    >
      <path
        d="M2 5.4c11-2.4 21 1.2 32-.6 10-1.7 19 2.5 29 .3 8-1.7 21-2.9 31-2.2"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
