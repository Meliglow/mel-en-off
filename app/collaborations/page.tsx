import EnTetePage from "@/components/EnTetePage";
import FormulaireContactPro from "@/components/FormulaireContactPro";

// Attention : cette page est la seule du site au vouvoiement. Elle s'adresse a
// un hotel, un spa, un restaurant ou un office de tourisme, pas a une lectrice.
// Aucun formulaire de newsletter ici, et aucun chiffre d'audience.
export const metadata = {
  title: "Travailler avec moi · EN OFF",
  description:
    "Je teste des adresses et je les raconte à des voyageuses qui préparent un séjour. Voilà comment je travaille.",
};

const FORMATS = [
  {
    titre: "Une série d'épisodes tournée sur place.",
    texte:
      "Je viens, je teste comme une cliente, et je publie une suite de vidéos sur Instagram et TikTok.",
  },
  {
    titre: "Une fiche dans le carnet.",
    texte:
      "Votre adresse rejoint le carnet de la ville, avec la date du test. Elle reste en ligne et se retrouve dans les recherches.",
  },
  {
    titre: "Un passage dans EN OFF.",
    texte:
      "Ma lettre du dimanche, envoyée à des personnes qui préparent un voyage ou une sortie.",
  },
];

export default function CollaborationsPage() {
  return (
    <main>
      <EnTetePage
        surtitre="Professionnels"
        titre="Travailler avec moi"
        chapo="Je teste des adresses et je les raconte à des voyageuses qui préparent un séjour. Si vous tenez un lieu et que vous pensez qu'il mérite d'être vu, voilà comment je travaille."
      />

      <section className="mt-8 px-5">
        <h2 className="h2">Ce que je propose</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {FORMATS.map((f) => (
            <div key={f.titre} className="carte p-4">
              <h3 className="h3">{f.titre}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-texte">{f.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Le bloc central de la page : la methode, et le droit de veto. */}
      <section className="mt-10 px-5">
        <div className="rounded-carte bg-vert p-6 text-papier shadow-douce md:p-8">
          <div className="filets-clair" aria-hidden />
          <p className="surtitre mt-3 text-dore">Comment je travaille</p>
          <p className="mt-3 font-serif text-[24px] leading-tight text-papier">
            Je viens tester comme une cliente, pas en visite de presse.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-papier/75">
            Chaque publication indique la date du test et ce que vous m&apos;avez offert, le cas
            échéant. C&apos;est une obligation légale, et c&apos;est aussi ce qui rend ma
            recommandation crédible.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-papier/75">
            Je garde le droit de dire ce que je n&apos;ai pas aimé. Si votre adresse ne convainc
            pas, je ne la publie pas plutôt que d&apos;en dire du bien. Vous le savez avant que je
            vienne.
          </p>
        </div>
      </section>

      <section className="mt-10 px-5">
        <div className="filets" aria-hidden />
        <h2 className="h2 mt-4">Avec qui je travaille, et avec qui non</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="carte p-4">
            <p className="text-[15px] leading-relaxed text-texte">
              <strong className="font-semibold text-encre">Ce n&apos;est pas pour vous si</strong>{" "}
              vous cherchez une publication validée à l&apos;avance, un texte écrit par vos soins,
              ou la garantie d&apos;un avis positif.
            </p>
          </div>

          <div className="carte p-4">
            <p className="text-[15px] leading-relaxed text-texte">
              <strong className="font-semibold text-encre">C&apos;est pour vous si</strong> vous
              êtes convaincu de la qualité de votre lieu et que vous voulez qu&apos;on le voie tel
              qu&apos;il est.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 px-5">
        <div className="filets" aria-hidden />
        <h2 className="h2 mt-4">Écrivez-moi</h2>
        {/* Le formulaire garde la largeur de lecture, il ne s'etire pas sur grand ecran. */}
        <div className="md:max-w-canvas">
          <FormulaireContactPro />
        </div>
      </section>

      <section className="mt-10 px-5">
        <p className="text-center text-[14px] text-texte2">
          Tarifs communiqués sur demande, selon le format et la ville.
        </p>
      </section>
    </main>
  );
}
