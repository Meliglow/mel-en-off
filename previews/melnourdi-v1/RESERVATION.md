# Offre logiciel de réservation beauté

Demande de Mel du 16 novembre 2026 : ajouter la prestation de création au site existant, avec trois modèles testables. Conserver la marque Melnourdi et distinguer prestation et formation.

## Routes et comportement

- `/logiciel-reservation` : présentation, modèles, comparaison, calculateur annuel, tarif et FAQ.
- `/demos/specialiste` : Signature, parcours guidé et récapitulatif inspirés du site OJ Clinic consulté.
- `/demos/institut` : Douceur, prestations cumulables (prix et durée additionnés).
- `/demos/maquillage` : Studio, mise en beauté, soirée et essai mariée.

Les trois modèles possèdent des univers visuels distincts. Ils partagent un moteur de démonstration : prestation, jour/heure, coordonnées fictives et confirmation simulée. Noms, couleurs et photo peuvent être essayés dans la page. La photo est un object URL local, révoqué au remplacement ; aucune écriture réseau, aucun stockage persistant, aucune authentification Google. Les créneaux commencent au lendemain du jour courant en Europe/Paris, sur quatre semaines simulées. Le dimanche illustre un jour sans disponibilité.

Le devis par email est la sortie commerciale actuelle. Aucun bouton de paiement factice. Les tarifs demandés sont 395 € de création au lancement et 455 € prévus ensuite ; aucun délai ou nombre de places inventé. Le tarif concerne l’adaptation d’un modèle, pas un développement illimité. Les frais de fonctionnement, options et modalités fiscales sont à détailler dans la proposition avant commande. La question sur la prise en charge de l’hébergement et de la maintenance reste ouverte ; aucun abonnement supplémentaire chiffré n’est inventé.

## Sources vérifiées le 16 novembre 2026

- Treatwell : https://www.treatwell.fr/partenaires/tarifs/ — 25 % nouveau client, 0 % clients fidélisés, 2 % prépaiements ; prix/commissions assujettis à la TVA ; pas de montant mensuel affiché.
- Planity : https://info.planity.com/tarifs — montant auprès d’un conseiller ; FAQ : abonnement fixe, sans commission sur les rendez-vous ; site sur mesure en option.
- Référence de parcours : https://ojclinic.com/reserver — étapes et récapitulatif latéral. Aucun code, clientèle ou donnée de réservation repris.

Pas de moyenne concurrente chiffrée : les pages publiques ne la permettent pas. Le calculateur multiplie uniquement le montant saisi par douze, sans prétendre mesurer une économie totale.

## Visuels d’illustration

Photos Unsplash vérifiées puis téléchargées localement ; elles ne représentent pas des établissements ou clientes de Mel. Marques et prestations des démos fictives.

- `assets/specialiste.jpg` : https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85
- `assets/institut.jpg` : https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85
- `assets/maquillage.jpg` : https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85

## Vérification

`npm run build` (avec `NEXT_TELEMETRY_DISABLED=1` dans le bac à sable Windows). Le build utilise l’instantané existant des adresses faute de `SHEET_ADRESSES_CSV_URL`, comme avant la modification.

`scripts/check-reservation.playwright.cjs` s’exécute avec `playwright-cli run-code --filename=...` contre le serveur local de production sur le port 4181. Il vérifie six routes à 320/390/768/1024/1440 px, les trois parcours, la personnalisation du nom/couleur/photo et sa réinitialisation, les prix et durées cumulés, le dimanche fermé, les créneaux indisponibles, le changement de semaine, la validation email/prénom/consentement, l’échappement du texte saisi, la remise à zéro, l’absence de stockage et de requêtes d’écriture. Contrôle visuel des captures ordinateur et téléphone. Aucune erreur JavaScript dans ces parcours. Le favicon manquant est une 404 préexistante du site.
