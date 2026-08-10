"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LIEUX } from "@/lib/data";
import { appliquer, bascule, ecrireFiltres } from "@/lib/filtres";
import {
  AUDIENCES,
  Budget,
  BUDGETS,
  Categorie,
  CATEGORIES,
  Filtres,
  PAYS,
  villesPour,
} from "@/lib/types";

const RECENTES: { label: string; filtres: Filtres }[] = [
  {
    label: "Restaurants à Lisbonne",
    filtres: { country: ["Portugal"], city: ["Lisbonne"], cat: ["restaurant"], budget: [], tags: [] },
  },
  {
    label: "Spas, budget €€€",
    filtres: { country: [], city: [], cat: ["spa"], budget: ["€€€"], tags: [] },
  },
];

export default function EcranRecherche() {
  const router = useRouter();
  const [country, setCountry] = useState<string[]>([]);
  const [city, setCity] = useState<string[]>([]);
  const [cat, setCat] = useState<Categorie[]>([]);
  const [budget, setBudget] = useState<Budget[]>([]);
  const [avec, setAvec] = useState<string[]>([]);

  const villesDispo = villesPour(country);

  const toggleCountry = (p: string) => {
    setCountry((prev) => {
      const next = bascule(prev, p);
      // Retire les villes qui ne sont plus dans les pays choisis.
      const permises = villesPour(next);
      setCity((c) => c.filter((v) => permises.includes(v)));
      return next;
    });
  };

  const filtres: Filtres = { country, city, cat, budget, tags: avec };
  const n = appliquer(LIEUX, filtres).length;

  const reinit = () => {
    setCountry([]);
    setCity([]);
    setCat([]);
    setBudget([]);
    setAvec([]);
  };

  return (
    <section className="mt-10 px-5">
      <div className="filets" aria-hidden />
      <h2 className="h2 mt-3">Que cherchez-vous ?</h2>
      <p className="mt-1 text-[14px] text-texte2">
        Un pays, une ville, une envie. Cumulez ce que vous voulez.
      </p>

      <div className="carte mt-4 overflow-hidden">
        {/* Pays */}
        <div className="p-4">
          <p className="surtitre">Pays</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PAYS.map((p) => (
              <button
                key={p}
                type="button"
                className={`puce ${country.includes(p) ? "active" : ""}`}
                aria-pressed={country.includes(p)}
                onClick={() => toggleCountry(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-4 filets" aria-hidden />

        {/* Ville (dependante des pays choisis) */}
        <div className="p-4">
          <p className="surtitre">Ville</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {villesDispo.map((v) => (
              <button
                key={v}
                type="button"
                className={`puce ${city.includes(v) ? "active" : ""}`}
                aria-pressed={city.includes(v)}
                onClick={() => setCity((c) => bascule(c, v))}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-4 filets" aria-hidden />

        {/* Vous cherchez */}
        <div className="p-4">
          <p className="surtitre">Vous cherchez</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`puce ${cat.includes(c.value) ? "active" : ""}`}
                aria-pressed={cat.includes(c.value)}
                onClick={() => setCat((v) => bascule(v, c.value))}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-4 filets" aria-hidden />

        {/* Avec qui */}
        <div className="p-4">
          <p className="surtitre">Avec qui</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <button
                key={a.tag}
                type="button"
                className={`puce ${avec.includes(a.tag) ? "active" : ""}`}
                aria-pressed={avec.includes(a.tag)}
                onClick={() => setAvec((v) => bascule(v, a.tag))}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-4 filets" aria-hidden />

        {/* Budget */}
        <div className="p-4">
          <p className="surtitre">Budget</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                className={`puce ${budget.includes(b) ? "active" : ""}`}
                aria-pressed={budget.includes(b)}
                onClick={() => setBudget((v) => bascule(v, b))}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton bas de carte, compteur en direct */}
        <div className="border-t border-bord p-4">
          <button
            type="button"
            className="btn btn-vert w-full"
            onClick={() => router.push(`/resultats${ecrireFiltres(filtres)}`)}
          >
            Voir {n} résultat{n > 1 ? "s" : ""}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[14px] font-semibold">
        <button type="button" className="min-h-[44px] text-texte2 underline underline-offset-4" onClick={reinit}>
          Réinitialiser
        </button>
        <Link href="/resultats" className="flex min-h-[44px] items-center text-vert">
          Tout parcourir →
        </Link>
      </div>

      {/* Dernieres recherches */}
      <p className="surtitre mt-6">Dernières recherches</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {RECENTES.map((r) => (
          <Link key={r.label} href={`/resultats${ecrireFiltres(r.filtres)}`} className="carte lift flex items-center gap-2 p-3">
            <span aria-hidden className="text-terracotta">
              ↻
            </span>
            <span className="text-[13px] font-semibold leading-tight text-texte">{r.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
