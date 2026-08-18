import FormulaireInscription from "@/components/FormulaireInscription";
import { compteurs } from "@/lib/adresses";

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

export default function Hero() {
  const { testees, recalees } = compteurs();

  return (
    // Sur grand ecran, le hero reste sur la largeur de lecture du carnet et se
    // centre, au lieu d'etirer les champs sur toute la page.
    <section className="mx-auto flex min-h-[calc(100svh-84px)] w-full flex-col justify-center px-5 py-8 md:min-h-0 md:max-w-canvas md:py-14">
      <div className="flex justify-center">
        <IconEnveloppe />
      </div>

      <h1 className="h1 mt-4 text-center">
        EN <span className="surligne">OFF</span>
      </h1>

      <p className="mt-4 text-center text-[15px] leading-relaxed text-texte">
        Chaque <strong className="font-semibold text-encre">dimanche</strong>, je te donne{" "}
        <strong className="font-semibold text-encre">
          les meilleures et les pires adresses
        </strong>{" "}
        que j&apos;ai testées. Je teste, je note la date, je te dis ce que j&apos;en pense. Tu
        n&apos;as plus qu&apos;à réserver.
      </p>

      <p className="signature mt-3 text-center text-[30px] leading-tight text-terracotta">
        Écrit à la main par Mel
      </p>

      {/* Le compteur vient des donnees. Source vide, pas de compteur. */}
      {testees > 0 && (
        <p className="surtitre mt-4 text-center">
          {testees} adresse{testees > 1 ? "s" : ""} testée{testees > 1 ? "s" : ""}
          <span aria-hidden className="mx-1.5 text-bord2">
            ·
          </span>
          {recalees} recalée{recalees > 1 ? "s" : ""}
        </p>
      )}

      <div className="mt-6">
        <FormulaireInscription source="lettre" libelleBouton="Recevoir EN OFF →" />
      </div>
    </section>
  );
}
