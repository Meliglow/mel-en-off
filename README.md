# EN OFF, melnourdi.fr

La page d'accueil a un seul travail : collecter des emails pour la lettre **EN OFF**. Le
reste du site, ce sont les pages de contenu qui donnent envie de s'inscrire.

---

# Partie 1, pour Mel

## Ajouter ou modifier une adresse

1. Ouvre ton **Google Sheet**, ajoute ta ligne, ou corrige celle qui existe.
2. Ouvre le **lien de republication** (voir plus bas), le site se remet à jour tout seul en
   une minute environ.

Tu n'as jamais besoin de toucher au code pour ça.

### Les colonnes du tableau, dans l'ordre

| Colonne | Ce qu'on y met |
|---|---|
| `nom` | le nom du lieu |
| `ville` | la ville, écrite pareil à chaque fois |
| `pays` | le pays |
| `categorie` | `spa`, `restaurant`, `hotel`, `petit-dejeuner`... écris `spa` pour que ça remonte dans la page Spas |
| `zone` | la région ou le quartier, par exemple `Île-de-France` |
| `scene` | la scène, ce qu'on voit et ce qu'on ressent en arrivant |
| `verdict` | ton verdict, en une ou deux phrases |
| `a_savoir_avant` | ce qu'il faut savoir avant d'y aller |
| `prix_paye` | ce que tu as payé, par exemple `90 EUR` |
| `date_du_test` | **obligatoire**, format `2026-06-12` ou `12/06/2026` |
| `invitee` | `oui` si tu as été invitée, sinon `non` |
| `recalee` | `oui` si tu ne recommandes pas, sinon `non` |
| `slug_page` | à laisser vide, il se remplit tout seul |
| `photo` | le nom du fichier photo, rien d'autre |

**La seule règle qui ne se négocie pas** : une adresse **sans date de test ne s'affiche
jamais**. Ce n'est pas un bug, c'est le principe du site.

## Ajouter une photo

Tout est expliqué dans [`public/photos/LISEZ-MOI.md`](public/photos/LISEZ-MOI.md). En
résumé : tu déposes le fichier dans `public/photos/` depuis GitHub, tu le nommes
`[ville]-[categorie]-[nom-du-lieu]-[aaaammjj].webp`, et tu recopies ce nom dans la colonne
`photo`.

Une adresse sans photo s'affiche quand même, avec un aplat de couleur. Rien ne casse.

## Changer les textes de la page d'accueil

Tout se passe dans **un seul fichier**, [`config.ts`](config.ts), commenté ligne à ligne :

- la **ville du moment** mise en avant
- les **trois titres du dimanche**, à changer chaque semaine
- les **liens Instagram et TikTok**
- les **identifiants de groupes MailerLite**
- l'**adresse de contact** des professionnels
- les **destinations proposées** après l'inscription

Tu modifies, tu enregistres sur GitHub, le site se republie seul.

---

# Partie 2, technique

## La stack

Next.js 14 (App Router) + TypeScript + Tailwind. Trois dépendances de production : `next`,
`react`, `react-dom`, plus `nodemailer` pour le formulaire professionnel. Aucun CMS, aucune
base de données, aucun ORM, aucun script de mesure d'audience.

## Les commandes

```bash
npm install
npm run dev                 # http://localhost:3000
npm run build               # build de production, synchronise le Sheet avant
npm run sync-adresses       # récupère le Sheet, valide, réécrit l'instantané
npm run optimiser-images    # convertit public/photos en WebP sous 200 Ko
```

## D'où viennent les adresses

1. La source de vérité est un **Google Sheet publié au format CSV**, dont l'adresse vit
   dans `SHEET_ADRESSES_CSV_URL`.
2. Il est lu **au build**, jamais à la visite.
3. `data/adresses.json` est l'**instantané versionné**. Si le Sheet est injoignable ou
   malformé au build, le site se construit quand même avec le dernier instantané valide et
   affiche un avertissement.
4. `npm run sync-adresses` fait le tour complet : récupération, validation ligne à ligne,
   réécriture de l'instantané. Toute ligne sans `date_du_test` est écartée et nommée dans
   la sortie, comme les photos annoncées mais absentes.

## Les variables d'environnement

À créer sur Vercel, pour les trois environnements (Production, Preview, Development).

| Variable | À quoi elle sert |
|---|---|
| `SHEET_ADRESSES_CSV_URL` | l'adresse du Google Sheet publié en CSV |
| `MAILERLITE_API_KEY` | la clé d'API MailerLite, **jamais** dans le code client |
| `SMTP_USER` | l'adresse Google Workspace qui envoie les messages professionnels |
| `SMTP_PASSWORD` | son mot de passe d'application |
| `SMTP_HOST` | facultatif, `smtp.gmail.com` par défaut |
| `SMTP_PORT` | facultatif, `465` par défaut |

Les identifiants de groupes MailerLite, eux, sont dans `config.ts` : ils ne sont pas
secrets, et Mel doit pouvoir les changer sans toucher aux réglages de l'hébergeur.

## Le coût, c'est une contrainte de conception

- **Génération statique uniquement.** Toutes les pages de contenu sont construites au
  build. Les seules fonctions serveur sont `/api/inscription` et `/api/contact`.
- **Aucune optimisation d'image à la volée** (`images.unoptimized`). Les photos sont
  pré-compressées par `npm run optimiser-images` et servies en statique.
- **Aucun middleware, aucune fonction edge.**
- **Polices auto-hébergées** : `next/font` télécharge les fichiers au build et les sert
  depuis le domaine. Aucun appel à un service externe au chargement de la page.
- **Aucun module payant de l'hébergeur**, aucun add-on, aucun pixel, aucune bannière de
  cookies.

## L'identité visuelle

Le design system vit dans [`app/globals.css`](app/globals.css) et
[`tailwind.config.ts`](tailwind.config.ts) : couleurs, typographies, arrondis, ombres,
espacements. **On n'y ajoute pas de valeur.** Un nouveau bloc se compose à partir de ce qui
existe déjà.

## Les archives

[`archives/`](archives/) garde les composants de l'ancien concept d'annuaire (recherche,
filtres, carrousel). Ils ne sont plus montés sur le site et sont **exclus de la
compilation** : ils dépendent de l'ancien modèle de données.
