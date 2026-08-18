import Link from "next/link";

export const metadata = {
  title: "Merci · EN OFF",
  description: "Ton inscription à la lettre du dimanche est enregistrée.",
  robots: { index: false, follow: true },
};

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

// Une page de confirmation, rien d'autre. Meme habillage que l'accueil :
// l'enveloppe, le titre a la main, le texte, la signature.
export default function MerciPage() {
  return (
    <main className="px-5 pb-6 pt-5 carnet:pt-10">
      <IconEnveloppe />

      <h1 className="mt-2 font-main text-[40px] leading-[1.15] text-encre carnet:mt-3 carnet:text-[58px]">
        Bienvenue en <span className="surligne-main">off</span>
      </h1>

      <p className="mt-3 max-w-lecture text-[15px] leading-relaxed text-texte carnet:mt-4">
        Tu as rejoint la lettre du dimanche. Le prochain envoi part{" "}
        <strong className="font-semibold text-encre">dimanche</strong>, avec les adresses que
        j&apos;ai testées, ce que j&apos;ai payé dans chacune et la date où j&apos;y suis allée.
      </p>

      <p className="mt-3 max-w-lecture text-[15px] leading-relaxed text-texte">
        Va vérifier ta boîte mail, un premier message t&apos;attend. S&apos;il n&apos;y est pas,
        regarde dans les indésirables et fais-le glisser dans ta boîte de réception. Ça évitera que
        les suivants s&apos;y perdent aussi.
      </p>

      <p className="signature mt-4 text-[28px] leading-tight text-terracotta carnet:text-[30px]">
        Mel
      </p>

      <div className="mt-8 max-w-canvas">
        <Link href="/" className="btn btn-contour w-full">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
