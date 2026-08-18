import instantane from "@/data/adresses.json";
import { Adresse, Instantane, slugifier } from "./types";

// L'instantane JSON est lu une seule fois, au build. Aucune requete a l'execution.
const DONNEES = instantane as unknown as Instantane;

/**
 * Les adresses publiables.
 * Regle non negociable : une adresse sans date de test ne s'affiche jamais.
 */
export function adresses(): Adresse[] {
  return DONNEES.adresses.filter((a) => a.date_du_test && a.date_du_test.trim() !== "");
}

export function instantaneGenereLe(): string | null {
  return DONNEES.genere_le;
}

// Le compteur de preuve du hero. Ne s'affiche pas si la source est vide.
export function compteurs(): { testees: number; recalees: number } {
  const toutes = adresses();
  return {
    testees: toutes.length,
    recalees: toutes.filter((a) => a.recalee).length,
  };
}

export interface Regroupement {
  nom: string;
  slug: string;
  nb: number;
}

// Toutes les villes qui ont au moins une adresse publiable.
export function villes(): Regroupement[] {
  return regrouper(adresses().map((a) => a.ville));
}

export function adressesDeVille(slugVille: string): Adresse[] {
  return adresses().filter((a) => slugifier(a.ville) === slugVille);
}

export function nomDeVille(slugVille: string): string | null {
  const trouvee = adresses().find((a) => slugifier(a.ville) === slugVille);
  return trouvee ? trouvee.ville : null;
}

// Les zones couvertes pour une categorie donnee, par exemple les zones des spas.
export function zonesDeCategorie(slugCategorie: string): Regroupement[] {
  return regrouper(
    adresses()
      .filter((a) => slugifier(a.categorie) === slugCategorie)
      .map((a) => a.zone)
  );
}

export function adressesDeCategorie(slugCategorie: string, slugZone: string): Adresse[] {
  return adresses().filter(
    (a) => slugifier(a.categorie) === slugCategorie && slugifier(a.zone) === slugZone
  );
}

export function nomDeZone(slugCategorie: string, slugZone: string): string | null {
  const trouvee = adresses().find(
    (a) => slugifier(a.categorie) === slugCategorie && slugifier(a.zone) === slugZone
  );
  return trouvee ? trouvee.zone : null;
}

// Separe les adresses recommandees de celles qui sont recalees.
export function trier(liste: Adresse[]): { recommandees: Adresse[]; recalees: Adresse[] } {
  return {
    recommandees: liste.filter((a) => !a.recalee),
    recalees: liste.filter((a) => a.recalee),
  };
}

function regrouper(valeurs: string[]): Regroupement[] {
  const par: Record<string, Regroupement> = {};
  for (const valeur of valeurs) {
    const nom = valeur.trim();
    if (!nom) continue;
    const slug = slugifier(nom);
    if (!par[slug]) par[slug] = { nom, slug, nb: 0 };
    par[slug].nb += 1;
  }
  return Object.values(par).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
}
