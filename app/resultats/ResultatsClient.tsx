"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import BarreFiltres from "@/components/BarreFiltres";
import BlocAEviter from "@/components/BlocAEviter";
import CarteLieu from "@/components/CarteLieu";
import PanneauFiltres from "@/components/PanneauFiltres";
import PiedDePage from "@/components/PiedDePage";
import { LIEUX } from "@/lib/data";
import {
  appliquer,
  ecrireFiltres,
  filtrageSuffisant,
  lireFiltres,
  nbFiltresActifs,
} from "@/lib/filtres";
import { Filtres } from "@/lib/types";

function normaliser(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function ResultatsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [panneau, setPanneau] = useState(false);

  const filtres: Filtres = useMemo(
    () => lireFiltres(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const appliquerFiltres = (f: Filtres) => {
    router.replace(`/resultats${ecrireFiltres(f)}`, { scroll: false });
    setPanneau(false);
  };

  const parFiltres = appliquer(LIEUX, filtres);
  const q = normaliser(query.trim());
  const parTexte = q
    ? parFiltres.filter(
        (l) => normaliser(l.name).includes(q) || normaliser(l.city).includes(q)
      )
    : parFiltres;

  const suffisant = filtrageSuffisant(filtres);
  const aEviter = parTexte.filter((l) => l.verdict === "a eviter");
  const liste = suffisant ? parTexte.filter((l) => l.verdict !== "a eviter") : parTexte;

  const cible = filtres.city.length === 1 ? `à ${filtres.city[0]}` : "dans votre sélection";
  const nbActifs = nbFiltresActifs(filtres);

  return (
    <main>
      {/* En-tete de page */}
      <div className="flex items-center justify-between px-5 pb-2 pt-5">
        <Link href="/" className="btn-rond" aria-label="Retour à l'accueil">
          <span aria-hidden className="text-lg leading-none">
            ←
          </span>
        </Link>
        <span className="surtitre">Carnet nº 07 / Le carnet</span>
        <span className="w-11" aria-hidden />
      </div>

      <BarreFiltres
        query={query}
        onQuery={setQuery}
        nbActifs={nbActifs}
        onOuvrir={() => setPanneau(true)}
        total={liste.length}
      />

      <div className="px-5 pt-4">
        {liste.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {liste.map((l) => (
              <li key={l.id}>
                <CarteLieu lieu={l} variante="liste" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="carte p-6 text-center">
            <p className="font-serif text-[22px] text-encre">Aucun lieu ne correspond.</p>
            <p className="mt-2 text-[14px] text-texte2">
              Essayez d'élargir votre recherche ou repartez de zéro.
            </p>
            <button
              type="button"
              className="btn btn-contour mt-4"
              onClick={() => {
                setQuery("");
                appliquerFiltres({ country: [], city: [], cat: [], budget: [], tags: [] });
              }}
            >
              Réinitialiser
            </button>
          </div>
        )}

        {/* Ce que je ne recommande pas : seulement apres un filtrage suffisant */}
        {suffisant && <BlocAEviter lieux={aEviter} cible={cible} />}
      </div>

      <PiedDePage page={2} />

      {panneau && (
        <PanneauFiltres initial={filtres} onApply={appliquerFiltres} onClose={() => setPanneau(false)} />
      )}
    </main>
  );
}
