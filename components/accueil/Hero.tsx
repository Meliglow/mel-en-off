import FormulaireInscription from "@/components/FormulaireInscription";
import Polaroid from "@/components/Polaroid";
import { compteurs } from "@/lib/adresses";
import { cheminPhoto } from "@/lib/types";
import { NOMBRE_INSCRITS, PORTRAIT_MEL } from "@/config";

function IconEnveloppe() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-terracotta"
      aria-hidden
    >
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M3 6.5l9 6 9-6" />
    </svg>
  );
}

/**
 * Le premier ecran. RIEN ne s'anime ici : titre, promesse et formulaire
 * s'affichent d'un coup. Le portrait ne bouge qu'au survol.
 *
 * Sur telephone, le portrait se pose a droite du titre : on le voit tout de
 * suite, et il ne coute presque rien en hauteur, donc le champ email reste
 * visible sans faire defiler. C'est le seul travail de cette page.
 *
 * A partir de 900 px, il passe en grand dans la colonne de droite.
 *
 * Sans portrait dans config.ts, ni la vignette ni la colonne n'existent.
 */
export default function Hero() {
  const { testees, recalees } = compteurs();
  const portrait = cheminPhoto(PORTRAIT_MEL.fichier) !== null;

  const photo = (grand: boolean) => (
    <div className="ruban">
      <Polaroid
        className={grand ? "" : "polaroid-mini"}
        fichier={PORTRAIT_MEL.fichier}
        legende={PORTRAIT_MEL.legende}
        alt="Portrait de Mel Nourdi"
        inclinaison="droite"
        premierEcran={!grand}
      />
    </div>
  );

  return (
    <section className="px-5 pb-6 pt-5 carnet:pb-8 carnet:pt-10">
      <div
        className={
          portrait
            ? "grid items-center gap-10 carnet:grid-cols-[1.05fr_.95fr] carnet:gap-14"
            : undefined
        }
      >
        <div>
          {/* Sur telephone, la vignette flotte a droite : le titre et le texte
              coulent a cote, puis reprennent toute la largeur en dessous. On
              voit la photo tout de suite sans sacrifier la lecture. */}
          {portrait && (
            <div className="float-right ml-4 mb-2 w-[150px] carnet:hidden">{photo(false)}</div>
          )}

          <IconEnveloppe />

          {/* Meme ecriture que la legende des polaroids. En minuscules, pas en
              capitales : c'est ce qui la rend lisible. Le surlignage a son
              propre reglage, cale sur les metriques de cette police. */}
          <h1 className="mt-2 font-main text-[40px] leading-[1.15] text-encre carnet:mt-3 carnet:text-[58px]">
            La <span className="surligne-main">lettre</span>
          </h1>

          <p className="mt-3 max-w-lecture text-[15px] leading-relaxed text-texte carnet:mt-4">
            Chaque <strong className="font-semibold text-encre">dimanche</strong>, je te donne{" "}
            <strong className="font-semibold text-encre">
              les meilleures et les pires adresses
            </strong>{" "}
            que j&apos;ai testées. Je teste, je note la date, je te dis ce que j&apos;en pense. Tu
            n&apos;as plus qu&apos;à réserver.
          </p>

          <div className="clear-both" aria-hidden />

          {/* La signature ferme le texte, comme au bas d'une lettre. Le nombre
              d'inscrits se pose au bout de la meme ligne, en petit. */}
          <div className="mt-4 flex max-w-canvas items-baseline justify-between gap-3">
            <p className="signature text-[28px] leading-tight text-terracotta carnet:text-[30px]">
              Mel
            </p>
            {NOMBRE_INSCRITS.trim() !== "" && (
              <p className="text-[13px] font-bold text-encre">{NOMBRE_INSCRITS}</p>
            )}
          </div>

          {/* Le compteur vient des donnees. Source vide, pas de compteur. */}
          {testees > 0 && (
            <p className="surtitre mt-4">
              {testees} adresse{testees > 1 ? "s" : ""} testée{testees > 1 ? "s" : ""}
              <span aria-hidden className="mx-1.5 text-bord2">
                ·
              </span>
              {recalees} recalée{recalees > 1 ? "s" : ""}
            </p>
          )}

          <div className="mt-5 max-w-canvas">
            <FormulaireInscription source="lettre" libelleBouton="Recevoir la newsletter →" />
          </div>
        </div>

        {/* A partir de 900 px seulement : le grand portrait, a droite. */}
        {portrait && (
          <div className="hidden w-full max-w-[330px] carnet:block">{photo(true)}</div>
        )}
      </div>
    </section>
  );
}
