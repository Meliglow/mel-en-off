# Melnourdi — accueil V1

Design créé le 12 novembre 2026, validé par Mel. Le 14 novembre, ajout du portrait fourni et autorisation explicite de mise en ligne. Ce dossier conserve la maquette ; `scripts/prepare-site.mjs` en produit la version publique sans formulaires de démonstration. Voir le README principal pour le déploiement.

Lancer depuis le projet : `node previews/melnourdi-v1/server.mjs`, puis ouvrir http://127.0.0.1:4173.

## Périmètre
- Accueil responsive ivoire/noir/citron, deux parcours apprendre/déléguer.
- Portrait fourni par Mel, compressé en WebP, sur l’accueil et la page de liens.
- Photo authentique de l’atelier d’Abidjan uniquement dans la présentation personnelle.
- Formation en préparation, liste d’attente, offre sur mesure, présentation et FAQ.
- Navigation par ancres, fenêtres accessibles, FAQ, formulaires avec validation native.
- Les formulaires sont strictement démonstratifs : aucun stockage, aucune requête ni aucun envoi.
- Pas de faux guide, de prix, de programme, de témoignage ou de démonstration produit.
- Les liens juridiques et l’espace élève expliquent leur état non connecté.

## À valider ou fournir avant intégration
Guide réel (titre validé : « 7 choses à faire pour vendre ton offre ») ; programme, format, prérequis, prix et date ; démonstration réelle ; périmètre des prestations ; raccordement des nouvelles inscriptions email ; informations contractuelles.

## Étape suivante après validation
Développer les pages de vente et la liaison choisie à Systeme.io/Stripe, puis raccorder les nouvelles inscriptions email. L’intégration publique actuelle conserve les anciennes routes Next.js et sert la version validée via des réécritures.

Manrope : police open source de Google Fonts (SIL Open Font License), fichiers auto-hébergés. Les ressources sont locales et le serveur écoute uniquement sur 127.0.0.1.

## Vérification effectuée
Chromium : 320, 390, 768, 1024 et 1440 pixels, sans débordement horizontal. Photo et police chargées. Ancres internes valides, champs étiquetés. FAQ fermée au chargement puis ouverture/fermeture vérifiée. Fenêtres : ouverture, Échap, retour du focus, lien vers la liste d’attente. Formulaires : refus des champs obligatoires vides, simulation de validation, aucun envoi externe. Mouvement réduit respecté. Aucune erreur JavaScript observée. Syntaxe des deux scripts vérifiée avec Node.

Les sites de référence ont été consultés pour la place du créateur, la simplicité des entrées et la présentation des offres. Leurs résultats, prix, témoignages et affirmations ne sont pas repris.

## Page de liens
`http://127.0.0.1:4173/liens.html` : page indépendante de type lien en bio, publiée sur `/liens`. Ordre demandé : site, guide gratuit, communauté email, logiciel de réservation. Le guide conserve exactement le titre validé « 7 choses à faire pour vendre ton offre ». Sa couverture s’anime deux fois à l’ouverture (4,4 secondes au total) ; animation supprimée avec la préférence de mouvement réduit. Le portrait fourni remplace le monogramme.

Le guide n’est pas encore disponible en téléchargement. « Rejoindre la communauté » ouvre un formulaire email de démonstration distinct de la liste d’attente de la formation. La saisie n’est ni stockée ni envoyée. Les inscriptions réelles nécessiteront le branchement au service email retenu. Les deux autres liens ouvrent l’accueil local et sa section formation.
