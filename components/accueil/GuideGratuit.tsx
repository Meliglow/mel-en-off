import FormulaireInscription from "@/components/FormulaireInscription";

// Bloc 5 : le guide gratuit, en fin de page. La seule autre offre du site,
// et elle vit ici, jamais dans le meme bloc que la lettre.
export default function GuideGratuit() {
  return (
    <section className="mt-12 px-5">
      <div className="rounded-carte border border-bord bg-sable p-5 text-center shadow-douce md:p-8">
        <p className="surtitre">Guide gratuit</p>
        <h2 className="h2 mt-2">Les 5 meilleurs spas d&apos;Île-de-France</h2>
        <p className="mx-auto mt-2 text-[15px] leading-relaxed text-texte md:max-w-canvas">
          Testés, notés, avec ce que j&apos;ai payé dans chacun et la date. Plus ceux que j&apos;ai
          écartés.
        </p>

        {/* Le formulaire garde la largeur de lecture, il ne s'etire pas. */}
        <div className="mx-auto mt-5 text-left md:max-w-canvas">
          <FormulaireInscription
            source="guide-spas-idf"
            libelleBouton="Recevoir mon guide gratuit →"
          />
        </div>
      </div>
    </section>
  );
}
