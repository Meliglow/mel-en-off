#!/usr/bin/env node
/**
 * Recupere le Google Sheet publie au format CSV, valide chaque ligne, et
 * reecrit l'instantane data/adresses.json.
 *
 *   npm run sync-adresses
 *       synchronisation manuelle. Echoue si le Sheet est injoignable, pour
 *       qu'on le voie tout de suite.
 *
 *   npm run sync-adresses -- --build
 *       mode build. N'echoue jamais : si le Sheet est injoignable ou malforme,
 *       on garde le dernier instantane valide et on affiche un avertissement.
 *
 * L'adresse du Sheet vit dans la variable d'environnement SHEET_ADRESSES_CSV_URL.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const FICHIER_INSTANTANE = join(RACINE, "data", "adresses.json");
const DOSSIER_PHOTOS = join(RACINE, "public", "photos");

const MODE_BUILD = process.argv.includes("--build");
const URL_CSV = process.env.SHEET_ADRESSES_CSV_URL || "";

const COLONNES = [
  "nom",
  "ville",
  "pays",
  "categorie",
  "zone",
  "scene",
  "verdict",
  "a_savoir_avant",
  "prix_paye",
  "date_du_test",
  "invitee",
  "recalee",
  "slug_page",
  "photo",
];

main();

async function main() {
  if (!URL_CSV) {
    return abandonner(
      "SHEET_ADRESSES_CSV_URL n'est pas definie, aucune synchronisation possible.",
      "Publier le Sheet au format CSV, puis coller son adresse dans cette variable."
    );
  }

  let csv;
  try {
    const reponse = await fetch(URL_CSV, { redirect: "follow" });
    if (!reponse.ok) throw new Error("reponse HTTP " + reponse.status);
    csv = await reponse.text();
  } catch (erreur) {
    return abandonner("le Google Sheet est injoignable (" + erreur.message + ").");
  }

  let lignes;
  try {
    lignes = analyserCsv(csv);
  } catch (erreur) {
    return abandonner("le CSV recu est illisible (" + erreur.message + ").");
  }

  if (lignes.length === 0) {
    return abandonner("le CSV recu est vide, meme pas une ligne d'en-tete.");
  }

  const entetes = lignes[0].map(normaliserEntete);
  const manquantes = ["nom", "date_du_test"].filter((c) => !entetes.includes(c));
  if (manquantes.length > 0) {
    return abandonner(
      "le CSV n'a pas les colonnes attendues (il manque " + manquantes.join(", ") + ").",
      "Colonnes lues : " + entetes.join(", ")
    );
  }

  const photosPresentes = listerPhotos();
  const adresses = [];
  const rejetees = [];
  const photosIntrouvables = [];

  for (let i = 1; i < lignes.length; i++) {
    const brut = {};
    entetes.forEach((entete, colonne) => {
      brut[entete] = (lignes[i][colonne] || "").trim();
    });

    // Ligne entierement vide : on passe sans rien signaler.
    if (COLONNES.every((c) => !brut[c])) continue;

    const nom = brut.nom;
    if (!nom) {
      rejetees.push({ ligne: i + 1, nom: "(sans nom)", motif: "pas de nom" });
      continue;
    }

    const date = normaliserDate(brut.date_du_test);
    if (!date) {
      rejetees.push({
        ligne: i + 1,
        nom: nom,
        motif: brut.date_du_test
          ? 'date du test illisible ("' + brut.date_du_test + '")'
          : "pas de date de test",
      });
      continue;
    }

    const photo = brut.photo || "";
    if (photo && !photosPresentes.has(photo.toLowerCase())) {
      photosIntrouvables.push({ nom: nom, photo: photo });
    }

    adresses.push({
      nom: nom,
      ville: brut.ville || "",
      pays: brut.pays || "",
      categorie: brut.categorie || "",
      zone: brut.zone || "",
      scene: brut.scene || "",
      verdict: brut.verdict || "",
      a_savoir_avant: brut.a_savoir_avant || "",
      prix_paye: brut.prix_paye || "",
      date_du_test: date,
      invitee: estVrai(brut.invitee),
      recalee: estVrai(brut.recalee),
      slug_page: brut.slug_page ? slugifier(brut.slug_page) : slugifier(nom),
      photo: photo,
    });
  }

  const instantane = {
    genere_le: new Date().toISOString(),
    source: "google-sheet",
    adresses: adresses,
  };
  writeFileSync(FICHIER_INSTANTANE, JSON.stringify(instantane, null, 2) + "\n", "utf8");

  console.log("");
  console.log("Instantane mis a jour : " + adresses.length + " adresse(s) publiable(s).");

  if (rejetees.length > 0) {
    console.log("");
    console.log(rejetees.length + " ligne(s) ecartee(s) :");
    for (const r of rejetees) {
      console.log('  - ligne ' + r.ligne + ', "' + r.nom + '" : ' + r.motif);
    }
    console.log("  Une adresse sans date de test ne peut pas etre publiee.");
  }

  if (photosIntrouvables.length > 0) {
    console.log("");
    console.log(
      photosIntrouvables.length + " photo(s) annoncee(s) mais absente(s) de public/photos :"
    );
    for (const p of photosIntrouvables) {
      console.log('  - "' + p.nom + '" attend le fichier ' + p.photo);
    }
    console.log("  Ces adresses s'affichent quand meme, avec un aplat de couleur.");
  }

  console.log("");
}

/** Sort proprement, en gardant l'instantane deja en place. */
function abandonner(raison, conseil) {
  const nb = compterInstantane();
  console.log("");
  if (MODE_BUILD) {
    console.log("AVERTISSEMENT : " + raison);
    console.log(
      "  Le site est construit avec le dernier instantane valide (" + nb + " adresse(s))."
    );
  } else {
    console.log("ECHEC : " + raison);
    console.log("  L'instantane n'a pas ete touche (" + nb + " adresse(s)).");
  }
  if (conseil) console.log("  " + conseil);
  console.log("");
  process.exit(MODE_BUILD ? 0 : 1);
}

function compterInstantane() {
  try {
    const contenu = JSON.parse(readFileSync(FICHIER_INSTANTANE, "utf8"));
    return Array.isArray(contenu.adresses) ? contenu.adresses.length : 0;
  } catch {
    return 0;
  }
}

function listerPhotos() {
  const noms = new Set();
  if (!existsSync(DOSSIER_PHOTOS)) return noms;
  const parcourir = (dossier) => {
    for (const entree of readdirSync(dossier, { withFileTypes: true })) {
      if (entree.isDirectory()) parcourir(join(dossier, entree.name));
      else noms.add(entree.name.toLowerCase());
    }
  };
  parcourir(DOSSIER_PHOTOS);
  return noms;
}

/** Analyseur CSV : gere les guillemets, le separateur et les retours a la ligne. */
function analyserCsv(texte) {
  const contenu = texte.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const separateur = devinerSeparateur(contenu);
  const lignes = [];
  let champs = [];
  let champ = "";
  let dansGuillemets = false;

  for (let i = 0; i < contenu.length; i++) {
    const c = contenu[i];
    if (dansGuillemets) {
      if (c === '"') {
        if (contenu[i + 1] === '"') {
          champ += '"';
          i++;
        } else {
          dansGuillemets = false;
        }
      } else {
        champ += c;
      }
    } else if (c === '"') {
      dansGuillemets = true;
    } else if (c === separateur) {
      champs.push(champ);
      champ = "";
    } else if (c === "\n") {
      champs.push(champ);
      lignes.push(champs);
      champs = [];
      champ = "";
    } else {
      champ += c;
    }
  }
  if (champ !== "" || champs.length > 0) {
    champs.push(champ);
    lignes.push(champs);
  }
  return lignes;
}

/** Google Sheets exporte en virgule, un export local peut sortir en point-virgule. */
function devinerSeparateur(contenu) {
  const premiere = contenu.split("\n")[0] || "";
  const pv = (premiere.match(/;/g) || []).length;
  const v = (premiere.match(/,/g) || []).length;
  return pv > v ? ";" : ",";
}

function normaliserEntete(valeur) {
  return sansAccent(valeur)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/** Accepte aaaa-mm-jj et jj/mm/aaaa. Renvoie aaaa-mm-jj, ou null. */
function normaliserDate(valeur) {
  const v = (valeur || "").trim();
  if (!v) return null;

  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(v);
  if (m) return validerDate(m[1], m[2], m[3]);

  m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(v);
  if (m) return validerDate(m[3], m[2], m[1]);

  return null;
}

function validerDate(annee, mois, jour) {
  const a = Number(annee);
  const mo = Number(mois);
  const j = Number(jour);
  if (mo < 1 || mo > 12 || j < 1 || j > 31) return null;
  const d = new Date(Date.UTC(a, mo - 1, j));
  if (d.getUTCMonth() !== mo - 1 || d.getUTCDate() !== j) return null;
  return a + "-" + String(mo).padStart(2, "0") + "-" + String(j).padStart(2, "0");
}

function estVrai(valeur) {
  const v = (valeur || "").trim().toLowerCase();
  return ["oui", "o", "yes", "y", "vrai", "true", "x", "1"].includes(v);
}

function sansAccent(valeur) {
  return valeur.normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]", "g"), "");
}

function slugifier(valeur) {
  return sansAccent(valeur)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
