import { Budget, Categorie, Filtres, Lieu } from "./types";

export const FILTRES_VIDES: Filtres = { country: [], city: [], cat: [], budget: [], tags: [] };

// Lit l'etat des filtres depuis les query params de l'URL.
export function lireFiltres(sp: URLSearchParams): Filtres {
  const split = (v: string | null) =>
    v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
  return {
    country: split(sp.get("pays")),
    city: split(sp.get("city")),
    cat: split(sp.get("cat")) as Categorie[],
    budget: split(sp.get("budget")) as Budget[],
    tags: split(sp.get("tags")),
  };
}

// Serialise l'etat des filtres en query string pour l'URL.
export function ecrireFiltres(f: Filtres): string {
  const p = new URLSearchParams();
  if (f.country.length) p.set("pays", f.country.join(","));
  if (f.city.length) p.set("city", f.city.join(","));
  if (f.cat.length) p.set("cat", f.cat.join(","));
  if (f.budget.length) p.set("budget", f.budget.join(","));
  if (f.tags.length) p.set("tags", f.tags.join(","));
  const s = p.toString();
  return s ? `?${s}` : "";
}

// Bascule une valeur dans un tableau (ajoute si absente, retire si presente).
export function bascule<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function nbFiltresActifs(f: Filtres): number {
  return f.country.length + f.city.length + f.cat.length + f.budget.length + f.tags.length;
}

// Applique les filtres a une liste de lieux (OU dans une categorie, ET entre categories).
export function appliquer(lieux: Lieu[], f: Filtres): Lieu[] {
  return lieux.filter((l) => {
    if (f.country.length && !f.country.includes(l.country)) return false;
    if (f.city.length && !f.city.includes(l.city)) return false;
    if (f.cat.length && !f.cat.includes(l.cat)) return false;
    if (f.budget.length && !f.budget.includes(l.budget)) return false;
    if (f.tags.length && !f.tags.some((t) => l.tags.includes(t))) return false;
    return true;
  });
}

// Le bloc "a eviter" ne s'affiche qu'apres un vrai filtrage :
// au moins un pays ou une ville, et au moins une categorie.
export function filtrageSuffisant(f: Filtres): boolean {
  return (f.country.length > 0 || f.city.length > 0) && f.cat.length > 0;
}
