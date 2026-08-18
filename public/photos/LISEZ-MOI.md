# Les photos du site

Depose tes photos **ici**, directement depuis GitHub sur ton telephone : tu ouvres ce
dossier sur github.com, tu appuies sur **Add file**, puis **Upload files**, et tu deposes
tes fichiers. Le site se republie tout seul.

## Le nom du fichier

Toujours le meme format, le meme que tes dossiers de rushes :

```
[ville]-[categorie]-[nom-du-lieu]-[aaaammjj].webp
```

Un exemple : `abidjan-petit-dejeuner-noom-20260612.webp`

En minuscules, sans accent, sans espace. Les espaces deviennent des tirets.

## Dans le tableau

Dans la colonne `photo` de ton Google Sheet, tu ecris **seulement le nom du fichier** :

```
abidjan-petit-dejeuner-noom-20260612.webp
```

Jamais une adresse internet, jamais un lien Google Drive. Le site retrouve la photo tout
seul.

## Si tu oublies une photo

Ce n'est pas grave. L'adresse s'affiche quand meme, avec un aplat de couleur a la place.
Rien ne casse.

## Avant de deposer, allege tes photos

Une photo de telephone pese souvent 4 Mo. Sur le site, il en faut moins de 200 Ko, sinon
la page met trop longtemps a s'ouvrir sur mobile. Une seule commande s'en occupe, a lancer
depuis l'ordinateur :

```
npm run optimiser-images
```

Elle convertit tout en WebP, redimensionne, et remplace les fichiers d'origine.
