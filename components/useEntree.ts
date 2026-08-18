"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Etat d'entree d'un element dans l'ecran.
 *
 *   attente   : pas encore vu, l'animation l'attend
 *   visible   : vient d'entrer, l'animation part
 *   immediat  : deja dans le premier ecran au chargement, on affiche sans animer
 *
 * Le troisieme cas est la regle du carnet : rien ne bouge dans le premier ecran.
 * Le calcul se fait avant le premier affichage, donc rien ne clignote et rien
 * ne decale la mise en page.
 */
export type Entree = "attente" | "visible" | "immediat";

// useLayoutEffect cote navigateur, useEffect cote serveur (ou il n'a pas lieu d'etre).
const avantAffichage = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useEntree<T extends Element>() {
  const ref = useRef<T>(null);
  const [etat, setEtat] = useState<Entree>("attente");

  avantAffichage(() => {
    const el = ref.current;
    if (!el) return;

    if (el.getBoundingClientRect().top < window.innerHeight) {
      setEtat("immediat");
      return;
    }

    const obs = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setEtat("visible");
          obs.disconnect();
          return;
        }
        // Deja passe au-dessus de l'ecran sans avoir ete vu : defilement rapide,
        // retour en arriere, lien d'ancre. On l'affiche tel quel plutot que de
        // le laisser invisible pour toujours.
        if (entree.boundingClientRect.bottom < 0) {
          setEtat("immediat");
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, etat };
}
