# Archives

Composants de l'ancien concept d'annuaire (moteur de recherche, filtres cumulables,
carrousel de coups de coeur, fiche de lieu). Ils ne sont plus montes sur le site.

Ils sont gardes ici parce qu'ils sont reutilisables, mais ils sont **exclus de la
compilation** (voir "exclude" dans tsconfig.json) : ils s'appuient sur l'ancien modele de
donnees, qui n'existe plus. Pour en remettre un en service, il faut d'abord l'adapter au
modele actuel (lib/adresses.ts).

Aucune adresse de demonstration ne subsiste ici : seuls les composants d'affichage ont ete
conserves, les donnees ont ete supprimees.
