"use client";

import { useMemo, useState } from "react";
import { LIEUX } from "@/archives/lib/data";
import { appliquer, bascule, FILTRES_VIDES } from "@/archives/lib/filtres";
import {
  AUDIENCE_TAGS,
  AUDIENCES,
  Budget,
  BUDGETS,
  Categorie,
  CATEGORIES,
  Filtres,
  PAYS,
  villesPour,
} from "@/archives/lib/types";

export default function PanneauFiltres({
  initial,
  onApply,
  onClose,
}: {
  initial: Filtres;
  onApply: (f: Filtres) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Filtres>(initial);

  // Ambiance = tous les tags sauf ceux reserves au bloc "Avec qui".
  const tagsAmbiance = useMemo(
    () =>
      Array.from(new Set(LIEUX.flatMap((l) => l.tags)))
        .filter((t) => !AUDIENCE_TAGS.includes(t))
        .sort((a, b) => a.localeCompare(b, "fr")),
    []
  );

  const villesDispo = villesPour(draft.country);
  const n = appliquer(LIEUX, draft).length;

  const setCountry = (v: string) =>
    setDraft((d) => {
      const country = bascule(d.country, v);
      const permises = villesPour(country);
      return { ...d, country, city: d.city.filter((c) => permises.includes(c)) };
    });
  const setCity = (v: string) => setDraft((d) => ({ ...d, city: bascule(d.city, v) }));
  const setCat = (v: Categorie) => setDraft((d) => ({ ...d, cat: bascule(d.cat, v) }));
  const setBudget = (v: Budget) => setDraft((d) => ({ ...d, budget: bascule(d.budget, v) }));
  const setTag = (v: string) => setDraft((d) => ({ ...d, tags: bascule(d.tags, v) }));

  const Bloc = ({ titre, children }: { titre: string; children: React.ReactNode }) => (
    <div className="border-t border-bord px-5 py-4 first:border-t-0">
      <p className="surtitre">{titre}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-encre/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Filtres"
    >
      <div
        className="max-h-[88vh] w-full max-w-canvas overflow-y-auto rounded-t-[24px] bg-papier"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-papier px-5 pb-2 pt-4">
          <h2 className="font-serif text-[24px] text-encre">Filtres</h2>
          <button type="button" className="btn-rond" aria-label="Fermer les filtres" onClick={onClose}>
            <span aria-hidden className="text-lg leading-none">
              ✕
            </span>
          </button>
        </div>

        <Bloc titre="Pays">
          {PAYS.map((p) => (
            <button key={p} type="button" className={`puce ${draft.country.includes(p) ? "active" : ""}`} aria-pressed={draft.country.includes(p)} onClick={() => setCountry(p)}>
              {p}
            </button>
          ))}
        </Bloc>

        <Bloc titre="Ville">
          {villesDispo.map((v) => (
            <button key={v} type="button" className={`puce ${draft.city.includes(v) ? "active" : ""}`} aria-pressed={draft.city.includes(v)} onClick={() => setCity(v)}>
              {v}
            </button>
          ))}
        </Bloc>

        <Bloc titre="Catégorie">
          {CATEGORIES.map((c) => (
            <button key={c.value} type="button" className={`puce ${draft.cat.includes(c.value) ? "active" : ""}`} aria-pressed={draft.cat.includes(c.value)} onClick={() => setCat(c.value)}>
              {c.label}
            </button>
          ))}
        </Bloc>

        <Bloc titre="Avec qui">
          {AUDIENCES.map((a) => (
            <button key={a.tag} type="button" className={`puce ${draft.tags.includes(a.tag) ? "active" : ""}`} aria-pressed={draft.tags.includes(a.tag)} onClick={() => setTag(a.tag)}>
              {a.label}
            </button>
          ))}
        </Bloc>

        <Bloc titre="Budget">
          {BUDGETS.map((b) => (
            <button key={b} type="button" className={`puce ${draft.budget.includes(b) ? "active" : ""}`} aria-pressed={draft.budget.includes(b)} onClick={() => setBudget(b)}>
              {b}
            </button>
          ))}
        </Bloc>

        <Bloc titre="Ambiance">
          {tagsAmbiance.map((t) => (
            <button key={t} type="button" className={`puce ${draft.tags.includes(t) ? "active" : ""}`} aria-pressed={draft.tags.includes(t)} onClick={() => setTag(t)}>
              {t}
            </button>
          ))}
        </Bloc>

        <div className="sticky bottom-0 flex items-center gap-3 border-t border-bord bg-papier px-5 py-4">
          <button type="button" className="min-h-[48px] shrink-0 text-[14px] font-semibold text-texte2 underline underline-offset-4" onClick={() => setDraft(FILTRES_VIDES)}>
            Réinitialiser
          </button>
          <button type="button" className="btn btn-vert flex-1" onClick={() => onApply(draft)}>
            Voir {n} résultat{n > 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
