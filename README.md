# Mel en off ✦

Le carnet d'adresses de voyage de **Mel Nourdi**. Restaurants, spas, hôtels et activités testés pour de vrai, avec les coups de cœur et les adresses à éviter, ville par ville.

Application **Next.js (App Router) + TypeScript + Tailwind**, pensée mobile d'abord (dessinée à 390px), le desktop est un simple élargissement.

> L'ancienne landing statique reste dans le repo sous `index.html` (sauvegarde). Vercel déploie désormais l'app Next.js.

## Lancer en local

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # build de production
```

## Structure

```
app/
  layout.tsx            polices (Cormorant, Karla, La Belle Aurore) + canevas mobile
  page.tsx              accueil : Hero, coups de cœur, recherche, newsletter
  resultats/            le carnet filtrable (état des filtres dans l'URL)
  lieux/[id]/           fiche d'un lieu (galerie, avis, similaires)
  collab/               formulaire de collaboration
  globals.css          design system (couleurs, typo, vocabulaire carnet)
components/             Hero, CarrouselCoupsDeCoeur, CarteLieu, Puce, PastilleVerdict,
                        BarreFiltres, PanneauFiltres, BlocAEviter, Newsletter, FormulaireCollab...
lib/
  types.ts             types + libellés (Categorie, Verdict, Budget, Filtres)
  data.ts              LIEUX : le tableau des adresses (à éditer)
  filtres.ts           lecture/écriture des filtres dans l'URL + application
```

## Ajouter ou modifier une adresse

Tout se passe dans **`lib/data.ts`**. Chaque lieu suit ce format :

```ts
{
  id: "slug-unique",
  name: "Nom du lieu",
  city: "Marrakech",           // doit exister dans VILLES (lib/types.ts)
  country: "Maroc",
  cat: "restaurant",           // restaurant | spa | hotel | activite
  verdict: "coup de coeur",    // coup de coeur | correct | a eviter
  budget: "€€",                // € | €€ | €€€
  tags: ["rooftop", "local"],  // ambiance, alimente les filtres
  reasons: [],                 // motifs, seulement si verdict = "a eviter"
  accroche: "Une phrase courte pour le carrousel.",
  note: "Mon avis long, à la première personne.",
  sponsored: false,            // true = badge doré « Mise en avant »
  quartier: "Kasbah",
  reservation: "Conseillée le soir",
}
```

Pour ajouter une **ville** ou une **catégorie** de filtre : `VILLES` / `CATEGORIES` dans `lib/types.ts`.

## Photos (à remplacer)

Le site utilise des **emplacements** clairement étiquetés (rôle + ratio), pas de photos générées. Pour mettre les vraies images :

1. Déposer les fichiers dans **`public/`** (ex. `public/portrait-mel.jpg`).
2. Remplacer le composant `Placeholder` par une image aux endroits voulus.

Emplacements prévus :

| Où | Rôle | Ratio conseillé |
| --- | --- | --- |
| `components/Hero.tsx` | **Portrait de Mel** (le tirage incliné du hero) | vertical 132×172, idéalement une photo portrait |
| `components/CarteLieu.tsx` | Photo de couverture (carrousel 16:9, résultats 3:2) | paysage |
| `app/lieux/[id]/FicheClient.tsx` | Galerie de la fiche (3 photos) | 4:5 |

Exemple de remplacement du portrait dans `Hero.tsx` :

```tsx
import Image from "next/image";
// ...
<Image src="/portrait-mel.jpg" alt="Mel" width={132} height={172}
       className="h-[172px] w-[132px] rounded-[2px] object-cover" />
```

## Déploiement

Vercel (projet `mel-en-off`, domaine `melnourdi.fr`). Vercel détecte Next.js automatiquement, aucun réglage à changer. Le déploiement se fait au push sur `main`.

## Contact / collabs

**contact@melnourdi.fr**
