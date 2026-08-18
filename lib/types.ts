// Le modele d'une adresse. Il colle colonne pour colonne au Google Sheet que Mel
// remplit a la main (voir scripts/sync-adresses.mjs).
export interface Adresse {
  nom: string;
  ville: string;
  pays: string;
  categorie: string;
  zone: string;
  scene: string;
  verdict: string;
  a_savoir_avant: string;
  prix_paye: string;
  /** Format aaaa-mm-jj. Sans elle, l'adresse n'est jamais publiee. */
  date_du_test: string;
  invitee: boolean;
  recalee: boolean;
  slug_page: string;
  /** Nom du fichier seul, jamais une URL. Le site reconstruit le chemin. */
  photo: string;
}

export interface Instantane {
  genere_le: string | null;
  source: string | null;
  adresses: Adresse[];
}

// Minuscules, sans accent, sans espace. Sert aux URL et aux comparaisons.
export function slugifier(valeur: string): string {
  return valeur
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

// "2026-06-12" devient "12 juin 2026". Renvoie la valeur brute si elle n'est pas lisible.
export function formaterDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return iso;
  const jour = Number(m[3]);
  return `${jour} ${MOIS[Number(m[2]) - 1]} ${m[1]}`;
}

// Le chemin d'une photo dans public/photos, ou null si l'adresse n'en a pas.
export function cheminPhoto(photo: string): string | null {
  const fichier = photo.trim();
  if (!fichier) return null;
  return `/photos/${fichier}`;
}
