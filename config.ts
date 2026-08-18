/* =========================================================================
   LE FICHIER DE MEL

   C'est le seul fichier a modifier pour changer les textes qui bougent
   souvent : la ville mise en avant, les titres de la lettre du dimanche,
   les liens des reseaux, l'adresse de contact.

   Regle : on ne change que ce qui est entre guillemets, on ne touche pas
   aux noms a gauche des deux-points, ni aux virgules.

   Les adresses testees, elles, ne vivent PAS ici : elles vivent dans le
   Google Sheet (voir LISEZ-MOI.md).
   ========================================================================= */

/* -------------------------------------------------------------------------
   1. LA VILLE DU MOMENT (bloc 3 de la page d'accueil)

   Une seule ville mise en avant sur la page d'accueil.
   Pour ne mettre aucune ville en avant, remplacer tout le bloc par :
       export const VILLE_DU_MOMENT: VilleDuMoment | null = null;
   Le bloc disparait alors de la page d'accueil, proprement.
   ------------------------------------------------------------------------- */
export interface VilleDuMoment {
  /** Le nom affiche, tel qu'on l'ecrit. */
  nom: string;
  /** L'adresse de la page, en minuscules et sans accent. Doit correspondre
   *  a la ville ecrite dans le Google Sheet (Abidjan donne abidjan). */
  slug: string;
  /** Une seule phrase, celle qui donne envie de cliquer. */
  phrase: string;
  /** Le nom du fichier photo depose dans public/photos/. Laisser "" si
   *  aucune photo n'est prete : un aplat de couleur prend sa place. */
  photo: string;
}

export const VILLE_DU_MOMENT: VilleDuMoment | null = null;

/* Exemple, a recopier en remplacant null ci-dessus quand la ville est prete :

export const VILLE_DU_MOMENT: VilleDuMoment | null = {
  nom: "Abidjan",
  slug: "abidjan",
  phrase: "Trois semaines sur place, et la liste de ce que je referais demain.",
  photo: "abidjan-ville-cocody-20260612.webp",
};

*/

/* -------------------------------------------------------------------------
   2. LES TROIS TITRES DU DIMANCHE (bloc 4 de la page d'accueil)

   Ce sont les trois sujets du prochain envoi. A changer chaque semaine.
   Pour masquer le bloc, laisser la liste vide : []
   ------------------------------------------------------------------------- */
export const TITRES_DU_DIMANCHE: string[] = [];

/* Exemple :

export const TITRES_DU_DIMANCHE: string[] = [
  "Le spa a 90 euros que je ne referai pas",
  "Trois petits dejeuners a Abidjan, un seul vaut le detour",
  "Ce que je regarde avant de reserver un hotel",
];

*/

/* -------------------------------------------------------------------------
   3. LES RESEAUX
   ------------------------------------------------------------------------- */
export const RESEAUX = {
  instagram: "https://instagram.com/melnourdi",
  tiktok: "https://tiktok.com/@melnourdi",
};

/* -------------------------------------------------------------------------
   4. LE PORTRAIT DE MEL (en haut de la page d'accueil)

   Le fichier se depose dans public/photos/, comme les autres.
   Tant que "fichier" est vide, le portrait ne s'affiche pas du tout et la
   page se replie proprement sur une colonne. Aucun cadre vide.
   ------------------------------------------------------------------------- */
export const PORTRAIT_MEL = {
  /** Le nom du fichier seul, par exemple "portrait-mel-20260612.webp". */
  fichier: "",
  /** La legende manuscrite sous la photo, courte. */
  legende: "Ravenne, juillet",
};

/* -------------------------------------------------------------------------
   5. LA PLANCHE DE PHOTOS (bas de la page d'accueil)

   Quatre photos, comme des polaroids poses sur la table.
   Liste vide, ou moins de quatre photos : le bloc entier disparait.
   ------------------------------------------------------------------------- */
export const PHOTOS_PLANCHE: { fichier: string; legende: string }[] = [];

/* Exemple, quand les photos sont pretes :

export const PHOTOS_PLANCHE = [
  { fichier: "abidjan-spa-hammam-20260612.webp", legende: "le hammam, 14 h" },
  { fichier: "abidjan-marche-pagne-20260610.webp", legende: "le pagne, marché" },
  { fichier: "abidjan-petit-dejeuner-noom-20260609.webp", legende: "petit déj, Noom" },
  { fichier: "abidjan-activite-atelier-20260608.webp", legende: "l'atelier" },
];

*/

/* -------------------------------------------------------------------------
   6. LA NOTE EN MARGE (page d'accueil, juste sous les photos)

   Le petit mot griffonne a cote des tirages : une astuce de voyage sur la
   destination du moment. Courte, pratique, du vecu, jamais un slogan.
   UNE SEULE par page, jamais deux. Deux ou trois lignes maximum.
   Texte vide : la note ne s'affiche pas du tout.
   ------------------------------------------------------------------------- */
export const NOTE_EN_MARGE =
  "À Abidjan, le prix du taxi se fixe avant de monter, jamais en arrivant. " +
  "Trois fois sur quatre, ça divise la course par deux.";

/* -------------------------------------------------------------------------
   7. LA LISTE EN OFF (MailerLite)

   Les identifiants de groupe se trouvent dans MailerLite, dans l'adresse de
   la page du groupe : app.mailerlite.com/subscribers/groups/XXXXXXXX
   C'est le nombre XXXXXXXX qu'on recopie ici, entre guillemets.

   Tant qu'un identifiant est vide, l'inscription fonctionne quand meme :
   la personne entre dans la liste avec son etiquette de source, sans groupe.

   La cle d'API, elle, ne vit PAS ici : elle est dans les variables
   d'environnement de Vercel (MAILERLITE_API_KEY), pour rester secrete.
   ------------------------------------------------------------------------- */
export const GROUPES_MAILERLITE: Record<string, string> = {
  // Le formulaire du haut de la page d'accueil
  lettre: "",
  // Le formulaire du guide gratuit, en bas de la page d'accueil
  "guide-spas-idf": "",
};

/* -------------------------------------------------------------------------
   8. LES DESTINATIONS PROPOSEES APRES L'INSCRIPTION (page /merci)

   La premiere des trois questions demande ou la lectrice part en premier.
   Ce sont des destinations possibles, pas des villes deja testees : on peut
   tres bien y mettre des villes ou Mel n'est jamais allee, c'est meme le but,
   ca dit ce qu'il faudra aller tester.
   Laisser "Je ne sais pas encore" en derniere position.
   ------------------------------------------------------------------------- */
export const DESTINATIONS_PROPOSEES: string[] = [
  "Abidjan",
  "Paris",
  "Marseille",
  "Lyon",
  "Dakar",
  "Londres",
  "Je ne sais pas encore",
];

/* -------------------------------------------------------------------------
   9. LE CONTACT PROFESSIONNEL (page Collaborations)

   L'adresse qui recoit les demandes des hotels, spas et restaurants.
   ------------------------------------------------------------------------- */
export const EMAIL_CONTACT_PRO = "contact@melnourdi.fr";

/* -------------------------------------------------------------------------
  10. REGLAGES DU SITE (a ne changer qu'en connaissance de cause)
   ------------------------------------------------------------------------- */

/** L'adresse publique du site, utilisee pour les liens partages. */
export const URL_SITE = "https://melnourdi.fr";

/** La categorie du Google Sheet qui alimente les pages /spas/...
 *  Autrement dit : ce qu'il faut ecrire dans la colonne "categorie". */
export const CATEGORIE_SPAS = "spa";

/** La zone mise en avant dans la navigation, pour la page /spas/... */
export const ZONE_SPAS_PRINCIPALE = { nom: "Île-de-France", slug: "ile-de-france" };
