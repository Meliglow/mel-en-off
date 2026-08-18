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
 * Sans portrait dans config.ts, la colonne de droite n'existe pas et le texte
 * reprend toute la place. Aucun cadre vide.
 */
export default function Hero() {
  const { testees, recalees } = compteurs();
  const portrait = cheminPhoto(PORTRAIT_MEL.fichier) !== null;

  return (
    <section
      className={`mx-auto flex min-h-[calc(100svh-84px)] w-full flex-col justify-center px-5 py-5 md:min-h-0 md:py-14 ${
        portrait ? "carnet:max-w-large" : "md:max-w-canvas"
      }`}
    >
      <div
        className={
          portrait
            ? "grid items-center gap-5 carnet:grid-cols-[1fr_248px] carnet:gap-10"
            : undefined
        }
      >
        {/* Le portrait : au-dessus du texte en dessous de 900 px, a droite au-dela.
            Volontairement petit sur telephone : le champ email doit rester
            visible sans faire defiler, c'est le travail de la page. */}
        {portrait && (
          <div className="mx-auto w-[108px] carnet:order-2 carnet:mx-0 carnet:w-full">
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

        <div className={portrait ? "carnet:order-1 carnet:text-left" : undefined}>
          {/* Avec un portrait, l'enveloppe ferait doublon en haut de page sur
              telephone : elle revient des que la place le permet. */}
          <div className={`flex justify-center carnet:justify-start ${portrait ? "hidden carnet:flex" : ""}`}>
            <IconEnveloppe />
          </div>

          <h1 className={`h1 text-center carnet:text-left ${portrait ? "carnet:mt-3" : "mt-3"}`}>
            EN <span className="surligne">OFF</span>
          </h1>

          <p className="mt-3 text-center text-[15px] leading-relaxed text-texte carnet:text-left">
            Chaque <strong className="font-semibold text-encre">dimanche</strong>, je te donne{" "}
            <strong className="font-semibold text-encre">
              les meilleures et les pires adresses
            </strong>{" "}
            que j&apos;ai testées. Je teste, je note la date, je te dis ce que j&apos;en pense. Tu
            n&apos;as plus qu&apos;à réserver.
          </p>

          <p className="signature mt-3 text-center text-[30px] leading-tight text-terracotta carnet:text-left">
            Écrit à la main par Mel
          </p>

          {/* Le compteur vient des donnees. Source vide, pas de compteur. */}
          {testees > 0 && (
            <p className="surtitre mt-4 text-center carnet:text-left">
              {testees} adresse{testees > 1 ? "s" : ""} testée{testees > 1 ? "s" : ""}
              <span aria-hidden className="mx-1.5 text-bord2">
                ·
              </span>
              {recalees} recalée{recalees > 1 ? "s" : ""}
            </p>
          )}

          <div className="mx-auto mt-5 md:max-w-canvas carnet:mx-0">
            <FormulaireInscription source="lettre" libelleBouton="Recevoir la newsletter →" />
          </div>
        </div>
      </div>
    </section>
  );
}
