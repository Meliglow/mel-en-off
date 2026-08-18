"use client";

import { useEntree } from "./useEntree";

/**
 * Un titre de section, avec le trait irregulier qui se dessine dessous quand il
 * entre dans l'ecran. Le trait fait exactement la largeur du titre : le bloc est
 * en ligne, et le trace s'etire avec lui.
 *
 * pathLength="1" laisse le CSS travailler en fractions, quelle que soit la
 * longueur reelle du trace.
 */
export default function TitreSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, etat } = useEntree<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`trait-trace inline-block ${etat === "visible" ? "visible" : ""} ${
        etat === "immediat" ? "immediat" : ""
      } ${className}`}
    >
      <h2 className="h2">{children}</h2>
      <svg
        viewBox="0 0 400 11"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
        className="mt-1.5 block h-[9px] w-full overflow-visible text-terracotta"
      >
        <path
          d="M2 7C70 2 140 10 210 5S340 3 398 6"
          pathLength={1}
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
