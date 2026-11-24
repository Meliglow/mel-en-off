// Compteur de visites maison (24/11/2026) : sans cookie, sans IP, sans identifiant.
// On ne garde que des totaux par jour : pages vues, sources, étapes du parcours.
// Les totaux vivent en mémoire et sont écrits dans un fichier JSON :
// - sur le volume Railway s'il y en a un (RAILWAY_VOLUME_MOUNT_PATH), qui survit aux déploiements ;
// - sinon dans le dossier temporaire du serveur, remis à zéro à chaque déploiement.
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

export const EVENEMENTS = ["vue", "guide_inscrit", "clic_place", "paiement_lance", "paiement_ok"] as const;
export type Evenement = (typeof EVENEMENTS)[number];

type Jour = {
  vues: number; // pages vues
  entrees: number; // arrivées depuis l'extérieur (une visite qui commence)
  pages: Record<string, number>;
  sources: Record<string, number>; // seulement pour les entrées
  campagnes: Record<string, number>; // utm_campaign, seulement pour les entrées
  evenements: Record<string, number>;
  logicielDepuisGuide: number; // vues de la page logiciel juste après le guide
};
type Donnees = { debut: string; jours: Record<string, Jour> };

const MAX_CLES = 60; // au-delà, regroupé dans « autre » pour éviter qu'on remplisse le fichier
const JOURS_GARDES = 400;

export function dossierStats() {
  const volume = process.env.RAILWAY_VOLUME_MOUNT_PATH;
  return volume ? path.join(volume, "stats") : path.join(tmpdir(), "melnourdi-stats");
}
export function stockageDurable() {
  return Boolean(process.env.RAILWAY_VOLUME_MOUNT_PATH);
}

type Etat = { donnees: Donnees | null; chargement: Promise<Donnees> | null; minuteur: ReturnType<typeof setTimeout> | null };
const g = globalThis as typeof globalThis & { __mnStats?: Etat };
const etat: Etat = (g.__mnStats ??= { donnees: null, chargement: null, minuteur: null });

const fichier = () => path.join(dossierStats(), "visites.json");
const aujourdhui = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" }); // AAAA-MM-JJ

async function charger(): Promise<Donnees> {
  if (etat.donnees) return etat.donnees;
  etat.chargement ??= (async () => {
    try {
      const lu = JSON.parse(await readFile(fichier(), "utf8")) as Donnees;
      if (lu && typeof lu === "object" && lu.jours) return lu;
    } catch {}
    return { debut: aujourdhui(), jours: {} };
  })();
  etat.donnees = await etat.chargement;
  return etat.donnees;
}

function planifierEcriture() {
  if (etat.minuteur) return;
  etat.minuteur = setTimeout(async () => {
    etat.minuteur = null;
    if (!etat.donnees) return;
    try {
      await mkdir(dossierStats(), { recursive: true });
      const temp = `${fichier()}.${process.pid}.tmp`;
      await writeFile(temp, JSON.stringify(etat.donnees));
      await rename(temp, fichier());
    } catch (erreur) {
      console.error("Statistiques : écriture impossible.", erreur);
    }
  }, 5000);
}

const ajouter = (table: Record<string, number>, cle: string) => {
  const k = cle in table || Object.keys(table).length < MAX_CLES ? cle : "autre";
  table[k] = (table[k] || 0) + 1;
};

export type Mesure = { evenement: Evenement; page: string; source: string | null; campagne: string | null; depuisGuide: boolean };

export async function enregistrer(m: Mesure) {
  const d = await charger();
  const jour = aujourdhui();
  const j = (d.jours[jour] ??= { vues: 0, entrees: 0, pages: {}, sources: {}, campagnes: {}, evenements: {}, logicielDepuisGuide: 0 });
  ajouter(j.evenements, m.evenement);
  if (m.evenement === "vue") {
    j.vues++;
    ajouter(j.pages, m.page);
    if (m.source) {
      j.entrees++;
      ajouter(j.sources, m.source);
      if (m.campagne) ajouter(j.campagnes, m.campagne);
    }
    if (m.depuisGuide && m.page === "/logiciel-reservation") j.logicielDepuisGuide++;
  }
  const cles = Object.keys(d.jours).sort();
  for (const ancien of cles.slice(0, Math.max(0, cles.length - JOURS_GARDES))) delete d.jours[ancien];
  planifierEcriture();
}

export type Resume = {
  debut: string;
  durable: boolean;
  jours: { date: string; vues: number; entrees: number }[];
  totaux: { vues: number; entrees: number; logicielDepuisGuide: number };
  evenements: Record<string, number>;
  pages: [string, number][];
  sources: [string, number][];
  campagnes: [string, number][];
};

export async function resumer(nbJours: number): Promise<Resume> {
  const d = await charger();
  const dates: string[] = [];
  const base = new Date(`${aujourdhui()}T12:00:00Z`);
  for (let i = nbJours - 1; i >= 0; i--) dates.push(new Date(base.getTime() - i * 86400000).toISOString().slice(0, 10));
  const somme = (cle: "pages" | "sources" | "campagnes" | "evenements") => {
    const t: Record<string, number> = {};
    for (const date of dates) for (const [k, v] of Object.entries(d.jours[date]?.[cle] || {})) t[k] = (t[k] || 0) + v;
    return t;
  };
  const trier = (t: Record<string, number>) => Object.entries(t).sort((a, b) => b[1] - a[1]);
  const jours = dates.map((date) => ({ date, vues: d.jours[date]?.vues || 0, entrees: d.jours[date]?.entrees || 0 }));
  return {
    debut: d.debut,
    durable: stockageDurable(),
    jours,
    totaux: {
      vues: jours.reduce((s, j) => s + j.vues, 0),
      entrees: jours.reduce((s, j) => s + j.entrees, 0),
      logicielDepuisGuide: dates.reduce((s, date) => s + (d.jours[date]?.logicielDepuisGuide || 0), 0),
    },
    evenements: somme("evenements"),
    pages: trier(somme("pages")),
    sources: trier(somme("sources")),
    campagnes: trier(somme("campagnes")),
  };
}
