export type Categorie = "restaurant" | "spa" | "hotel" | "activite";

export type Verdict = "coup de coeur" | "correct" | "a eviter";

export type Budget = "€" | "€€" | "€€€";

export interface Lieu {
  id: string;
  name: string;
  city: string;
  country: string;
  cat: Categorie;
  verdict: Verdict;
  budget: Budget;
  tags: string[];
  reasons: string[]; // motifs, uniquement pour les lieux "a eviter"
  note: string; // avis perso, texte long
  accroche: string; // phrase courte pour les cartes du carrousel
  sponsored: boolean;
  quartier?: string;
  reservation?: string;
  horaires?: string; // ex "Tous les jours, 19h-23h"
  adresse?: string; // ex "Rue de la Kasbah, Marrakech"
  tel?: string; // ex "+212 524 00 12 34"
  site?: string; // lien du site officiel, ex "https://riadyasmine.com"
  photos?: string[]; // chemins dans /public, ex ["/lieux/riad-1.jpg"]. Si vide, emplacement affiche.
  video?: string; // chemin d'une video dans /public, ex "/lieux/riad.mp4"
}

export interface Filtres {
  country: string[];
  city: string[];
  cat: Categorie[];
  budget: Budget[];
  tags: string[];
}

export const CATEGORIES: { value: Categorie; label: string; labelSing: string }[] = [
  { value: "restaurant", label: "Restaurants", labelSing: "Restaurant" },
  { value: "spa", label: "Spas", labelSing: "Spa" },
  { value: "hotel", label: "Hôtels & maisons d'hôtes", labelSing: "Hôtel ou maison d'hôtes" },
  { value: "activite", label: "Activités", labelSing: "Activité" },
];

// Hierarchie pays -> villes
export const PAYS = ["Maroc", "France", "Portugal", "Indonésie", "Belgique"];

export const VILLES_PAR_PAYS: Record<string, string[]> = {
  Maroc: ["Marrakech"],
  France: ["Paris"],
  Portugal: ["Lisbonne"],
  Indonésie: ["Bali"],
  Belgique: ["Bruxelles"],
};

export const VILLES = Object.values(VILLES_PAR_PAYS).flat();

export const BUDGETS: Budget[] = ["€", "€€", "€€€"];

// Filtre "avec qui" : ce sont des tags dedies.
export const AUDIENCES: { tag: string; label: string }[] = [
  { tag: "entre amis", label: "Entre amis" },
  { tag: "en famille", label: "En famille" },
  { tag: "en couple", label: "En couple" },
];

export const AUDIENCE_TAGS = AUDIENCES.map((a) => a.tag);

// Renvoie les villes disponibles pour une selection de pays (toutes si aucun pays).
export function villesPour(pays: string[]): string[] {
  if (pays.length === 0) return VILLES;
  return pays.flatMap((p) => VILLES_PAR_PAYS[p] ?? []);
}

export function labelCategorie(cat: Categorie): string {
  return CATEGORIES.find((c) => c.value === cat)?.labelSing ?? cat;
}

export function labelVerdict(v: Verdict): string {
  if (v === "coup de coeur") return "Coup de cœur";
  if (v === "a eviter") return "À éviter";
  return "Correct";
}
