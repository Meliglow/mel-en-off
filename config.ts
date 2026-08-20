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
   3 bis. LE NOMBRE D'INSCRITS (sous la promesse du hero)

   S'affiche en gras juste sous le texte. Laisser vide pour ne rien afficher.
   A ne renseigner que si le chiffre est vrai : tout le site repose sur le
   fait que ce qui est ecrit est verifie.
   ------------------------------------------------------------------------- */
export const NOMBRE_INSCRITS = "+600 inscrits";

/* -------------------------------------------------------------------------
   4. LE PORTRAIT DE MEL (en haut de la page d'accueil)

   Le fichier se depose dans public/photos/, comme les autres.
   Tant que "fichier" est vide, le portrait ne s'affiche pas du tout et la
   page se replie proprement sur une colonne. Aucun cadre vide.
   ------------------------------------------------------------------------- */
export const PORTRAIT_MEL = {
  /** Le nom du fichier seul, par exemple "portrait-mel-20260612.webp". */
  fichier: "abidjan-atelier-pagne.webp",
  /** La legende manuscrite sous la photo, courte. */
  legende: "Atelier de pagne à Abidjan",
};

/* -------------------------------------------------------------------------
   5. LA PLANCHE DE PHOTOS (bas de la page d'accueil, "En ce moment")

   Les dernieres photos, posees comme des polaroids sur la table.
   Quatre, c'est la bonne mesure, mais le bloc s'adapte : avec une seule
   photo elle reste a sa taille, elle ne s'etale pas sur toute la largeur.
   Liste vide : le bloc entier disparait.
   ------------------------------------------------------------------------- */
export const PHOTOS_PLANCHE: { fichier: string; legende: string }[] = [
  { fichier: "abidjan-atelier-pagne.webp", legende: "Atelier de pagne à Abidjan" },
];

/* Exemple, quand les photos sont pretes :

export const PHOTOS_PLANCHE = [
  { fichier: "abidjan-spa-hammam-20260612.webp", legende: "le hammam, 14 h" },
  { fichier: "abidjan-marche-pagne-20260610.webp", legende: "le pagne, marché" },
  { fichier: "abidjan-petit-dejeuner-noom-20260609.webp", legende: "petit déj, Noom" },
  { fichier: "abidjan-activite-atelier-20260608.webp", legende: "l'atelier" },
];

*/

/* -------------------------------------------------------------------------
   6. LA NOTE DU CARNET (ecrite sur le premier polaroid)

   Le petit mot ecrit sur le cadre blanc du premier polaroid, sous sa
   legende : une astuce de voyage sur la destination du moment. Courte,
   pratique, du vecu, jamais un slogan. Deux ou trois lignes maximum.
   UNE SEULE par page. Texte vide : rien ne s'affiche.
   ------------------------------------------------------------------------- */
export const NOTE_EN_MARGE =
  "Si on ne peut partir qu'une fois, c'est décembre ou janvier. Mai, juin et " +
  "juillet reçoivent plus d'eau que toute la saison sèche réunie.";

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
  // Le formulaire du haut de la page d'accueil, celui qui vend la lettre
  lettre: "",
  // Le formulaire du guide gratuit, en bas de l'accueil et sur la page Spas
  "guide-spas-idf": "",

  // Les carnets de ville envoient aussi leur propre etiquette, par exemple
  // "carnet-abidjan". Pour les separer aussi dans MailerLite, ajouter une
  // ligne par ville, sur ce modele :
  //   "carnet-abidjan": "123456",
};

/* -------------------------------------------------------------------------
   8. LE CONTACT PROFESSIONNEL (page Collaborations)

   L'adresse qui recoit les demandes des hotels, spas et restaurants.
   ------------------------------------------------------------------------- */
export const EMAIL_CONTACT_PRO = "contact@melnourdi.fr";

/* -------------------------------------------------------------------------
   9. REGLAGES DU SITE (a ne changer qu'en connaissance de cause)
   ------------------------------------------------------------------------- */

/** L'adresse publique du site, utilisee pour les liens partages. */
export const URL_SITE = "https://melnourdi.fr";

/** La categorie du Google Sheet qui alimente les pages /spas/...
 *  Autrement dit : ce qu'il faut ecrire dans la colonne "categorie". */
export const CATEGORIE_SPAS = "spa";

/** La zone mise en avant dans la navigation, pour la page /spas/... */
export const ZONE_SPAS_PRINCIPALE = { nom: "Île-de-France", slug: "ile-de-france" };
