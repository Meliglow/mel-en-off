import FormulaireInscription from "@/components/FormulaireInscription";
import Polaroid from "@/components/Polaroid";
import { compteurs } from "@/lib/adresses";
import { cheminPhoto } from "@/lib/types";
import { PORTRAIT_MEL } from "@/config";

function IconEnveloppe() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-terracotta"
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
 * Le portrait passe a droite du texte a partir de 900 px. En dessous, il se
 * range sous le formulaire : le champ email doit rester visible sans faire
 * defiler, c'est le seul travail de cette page.
 *
 * Sans portrait dans config.ts, la colonne de droite n'existe pas.
 */
export default function Hero() {
  const { testees, recalees } = compteurs();
  const portrait = cheminPhoto(PORTRAIT_MEL.fichier) !== null;

  return (
    <section className="px-5 pb-4 pt-6 carnet:pb-6 carnet:pt-10">
      <div
        className={
          portrait
            ? "grid items-center gap-8 carnet:grid-cols-[1.05fr_.95fr] carnet:gap-14"
            : undefined
        }
      >
        <div>
          <IconEnveloppe />

          {/* Meme ecriture que la legende des polaroids. En minuscules, pas en
              capitales : c'est ce qui la rend lisible. Le surlignage a son
              propre reglage, cale sur les metriques de cette police. */}
          <h1 className="mt-3 font-main text-[46px] leading-[1.2] text-encre carnet:text-[58px]">
            La <span className="surligne-main">lettre</span>
          </h1>

          <p className="mt-4 max-w-lecture text-[15px] leading-relaxed text-texte">
            Chaque <strong className="font-semibold text-encre">dimanche</strong>, je te donne{" "}
            <strong className="font-semibold text-encre">
              les meilleures et les pires adresses
            </strong>{" "}
            que j&apos;ai testées. Je teste, je note la date, je te dis ce que j&apos;en pense. Tu
            n&apos;as plus qu&apos;à réserver.
          </p>

          <p className="signature mt-3 text-[30px] leading-tight text-terracotta">Mel</p>

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

        {portrait && (
          <div className="mx-auto w-full max-w-[330px] carnet:mx-0">
            <div className="ruban">
              <Polaroid
                fichier={PORTRAIT_MEL.fichier}
                legende={PORTRAIT_MEL.legende}
                alt="Portrait de Mel Nourdi"
                inclinaison="droite"
                premierEcran
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
