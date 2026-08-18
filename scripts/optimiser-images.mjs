#!/usr/bin/env node
/**
 * Parcourt public/photos, convertit toutes les images en WebP, les redimensionne
 * a 1200 px de large au maximum, et remplace les fichiers d'origine.
 *
 *   npm run optimiser-images
 *
 * A lancer en local, jamais au build : les photos livrees sont deja optimisees,
 * l'hebergeur ne fait aucun traitement d'image (c'est ce qui coute cher).
 *
 * Objectif : sortir sous 200 Ko par photo. Le script baisse la qualite par
 * paliers jusqu'a y arriver.
 */

import { readdirSync, statSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, basename } from "node:path";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOSSIER = join(RACINE, "public", "photos");

const LARGEUR_MAX = 1200;
const CIBLE_OCTETS = 200 * 1024;
const PALIERS_QUALITE = [80, 72, 64, 56, 48];
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"];

// Nommage impose : [ville]-[categorie]-[nom-du-lieu]-[aaaammjj].webp
const NOMMAGE = /^[a-z0-9]+(-[a-z0-9]+)+-\d{8}\.webp$/;

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.log("");
  console.log("sharp n'est pas installe. Lancer d'abord : npm install");
  console.log("");
  process.exit(1);
}

if (!existsSync(DOSSIER)) {
  console.log("");
  console.log("Le dossier public/photos n'existe pas encore, rien a optimiser.");
  console.log("");
  process.exit(0);
}

const fichiers = lister(DOSSIER);
if (fichiers.length === 0) {
  console.log("");
  console.log("Aucune photo dans public/photos, rien a optimiser.");
  console.log("");
  process.exit(0);
}

console.log("");
console.log(fichiers.length + " photo(s) a traiter.");
console.log("");

let gagne = 0;
const tropLourdes = [];
const malNommees = [];

for (const chemin of fichiers) {
  const avant = statSync(chemin).size;
  const cible = join(dirname(chemin), basename(chemin, extname(chemin)) + ".webp");

  let sortie = null;
  for (const qualite of PALIERS_QUALITE) {
    sortie = await sharp(chemin)
      .rotate()
      .resize({ width: LARGEUR_MAX, withoutEnlargement: true })
      .webp({ quality: qualite })
      .toBuffer();
    if (sortie.length <= CIBLE_OCTETS) break;
  }

  writeFileSync(cible, sortie);
  if (cible !== chemin) unlinkSync(chemin);

  const apres = statSync(cible).size;
  gagne += avant - apres;

  const nom = basename(cible);
  console.log("  " + nom + " : " + ko(avant) + " -> " + ko(apres));

  if (apres > CIBLE_OCTETS) tropLourdes.push(nom);
  if (!NOMMAGE.test(nom)) malNommees.push(nom);
}

console.log("");
console.log("Termine. " + ko(gagne) + " economises au total.");

if (tropLourdes.length > 0) {
  console.log("");
  console.log("Encore au-dessus de 200 Ko malgre la compression :");
  for (const n of tropLourdes) console.log("  - " + n);
  console.log("  Recadrer la photo, ou en choisir une moins chargee.");
}

if (malNommees.length > 0) {
  console.log("");
  console.log("Nommage a corriger, attendu [ville]-[categorie]-[nom-du-lieu]-[aaaammjj].webp :");
  for (const n of malNommees) console.log("  - " + n);
  console.log("  En minuscules, sans accent et sans espace.");
}

console.log("");

function lister(dossier) {
  const trouves = [];
  for (const entree of readdirSync(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, entree.name);
    if (entree.isDirectory()) trouves.push(...lister(chemin));
    else if (EXTENSIONS.includes(extname(entree.name).toLowerCase())) trouves.push(chemin);
  }
  return trouves;
}

function ko(octets) {
  return Math.round(octets / 1024) + " Ko";
}
