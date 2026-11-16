# Réservation — version du 16 novembre 2026

## Décisions de Mel

- Domaine conservé : melnourdi.fr. Aucune modification OVH.
- Offre finale : 290 € TTC pour les cinq premières commandes validées, puis 420 € TTC.
- Page de vente en AIDA, nourrie par les principes du document « Lancement accéléré » fourni par Mel : résultat désiré, problème concret, bénéfices, offre et appel à l’action. Aucun résultat, témoignage, garantie ou délai de l’auteur transposé à Mel.
- Démo principale Lodyva : institut fictif ongles, cils et massages ; vue cliente et vue professionnelle, avec acompte simulé et suivi du solde.
- Mobile prioritaire, visuel clair. Ne pas afficher les noms des fournisseurs ou des outils de création dans le parcours commercial. Google Agenda reste une fonctionnalité client explicite.

## Sources et routes

- `reservation-v2.html`, `offer-v2.js/css`, `deposit.css`, `mobile-polish.css` : `/logiciel-reservation`.
- `lodyva.html/css/js`, `lodyva-schedule.mjs` : `/demo-lodyva`, avec accès direct professionnel par `#gestion`.
- `configurer.html/css/js` : `/configurer-reservation`.
- `administration.html/css/js` : `/administration-reservations` (coquille de connexion publique, données protégées par API).
- `config/booking-offer.json` : prix, options, textes et conditions par défaut.
- Les trois anciennes démos restent accessibles aux routes `/demos/specialiste`, `/demos/institut`, `/demos/maquillage`. Lodyva propose également trois styles.
- Sorties `public/melnourdi/` générées au build ; ne pas les modifier directement.

## Démonstration et mobile

Le calendrier utilise la date courante en Europe/Paris. Mardi à samedi, 9 h–13 h et 14 h–18 h, pauses de 15 minutes, durées de 30 à 90 minutes, quatre semaines. Les créneaux occupés sont exclus. Réservation simulée avec acompte de 30 %, puis ajout dans l’agenda et la fiche cliente. Déplacement, annulation et ajout depuis l’agenda. La journée est la vue par défaut sur téléphone ; la semaine reste disponible.

Profils fictifs et adresses `example.test` uniquement. Aucune carte, requête de paiement, email, stockage navigateur ou écriture réseau dans Lodyva. Les modifications disparaissent au rechargement. Photos d’illustration existantes ; portrait réel fourni de Mel. Voir RESERVATION.md pour les sources des photos.

## Demandes et administration : état réel

Configurateur en sept étapes, options décochées, pays sans défaut, questions conditionnelles, retour sans perte, récapitulatif et export texte. Le sous-total chiffré est distinct des options sur proposition ; aucun montant incomplet n’est encaissé.

API de demandes préparée : validation côté serveur, identifiants uniques, dédoublonnage, stockage chiffré AES-256-GCM avec verrou et écriture atomique, sauvegarde précédente chiffrée. Administration : authentification, cookie HttpOnly limité à huit heures, dossiers, filtres, notes, checklist, statut, export, paramètres, référence de visio et validation finale. Attribution atomique des cinq tarifs de lancement uniquement après confirmation manuelle d’une commande réelle par Mel.

**Production non activée pour la collecte.** Un volume a été créé sur le service Railway existant (`f81627d8-ce15-4c87-a62d-ad704e38ad76`, montage `/data`). La configuration des clés et du mot de passe a été refusée par le contrôle automatique faute d’autorisation explicite. Le script `configure-booking-storage.mjs` n’a pas été exécuté. Ne pas le relancer sans cet accord. Le formulaire propose le téléchargement et l’envoi manuel par email ; l’envoi direct reste désactivé.

Emails automatiques désactivés (`emailEnabled: false`). Le test Brevo antérieur et le test de panier OVH avaient été refusés ; ne pas les contourner. Pas de paiement des commandes Melnourdi connecté, pas de recherche de domaine automatique. Aucun envoi de message effectué par l’agent. Compatibilité Google et encaissement des acomptes à configurer pour chaque futur institut.

Avant ouverture complète : accès et chiffrement autorisés/configurés, expéditeur vérifié et emails testés avec autorisation, paiement et conditions contractuelles finalisés, identité légale existante complétée. Ne pas annoncer ces connexions comme actives. L’email manuel permet de préparer une proposition.

## Vérifications

- `node scripts/check-booking-core.mjs` : horaires, jours fermés, pause déjeuner, durées et buffers, déplacement/annulation, tarifs, frontière cinq commandes, acompte à chiffrer, validations.
- `node scripts/check-booking-api.mjs` : serveur local isolé uniquement, dossiers et identifiants synthétiques éphémères. Authentification, origine, stockage chiffré, dédoublonnage, compteur réel et passage à 420 €, données privées, emails désactivés et validation finale.
- `npm run build` : compilation Next/TypeScript.
- Contrôle navigateur : réservation mobile, acompte, report dans agenda, modification/annulation, fiches clientes ; configurateur complet sans envoi ; ordinateur et petits écrans. Aucun vrai dossier de cliente créé.

La synchronisation éditoriale des adresses garde son avertissement historique (variable de Sheet absente) ; elle ne concerne pas cette offre.

## Mise en scène et lancement — 16 novembre 2026

Hero sans photo générique : illustration HTML du parcours cliente, planning et Google Agenda. Séquence au défilement en trois vues, navigation accessible et adaptation mobile ; version statique avec préférence de mouvements réduits. Données fictives et connexion optionnelle explicitement indiquées. Offre destinée aux cinq premières commandes validées, sans faux compteur.

Choix de règlement de la création : 1 fois ou 3 fois, conservé dans le configurateur, le récapitulatif et les données validées côté serveur. Lancement : 96,67 € + 96,67 € + 96,66 € = 290 € TTC ; standard : 3 × 140 € = 420 € TTC. Hors options et fonctionnement. Dates confirmées dans la proposition ; aucun paiement connecté ni encaissement effectué. Les blocages de production décrits plus haut restent inchangés.
