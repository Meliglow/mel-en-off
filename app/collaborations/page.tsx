import EnTetePage from "@/components/EnTetePage";
import FormulaireContactPro from "@/components/FormulaireContactPro";
import TitreSection from "@/components/TitreSection";
import Trombone from "@/components/Trombone";

// Attention : cette page est la seule du site au vouvoiement. Elle s'adresse a
// un hotel, un spa, un restaurant ou un office de tourisme, pas a une lectrice.
// Aucun formulaire de newsletter ici, et aucun chiffre d'audience.
//
// Meme matiere que le reste du carnet : des fiches de papier posees, du ruban
// adhesif, un trombone. L'ecriture a la main sert d'accent, jamais pour le
// corps du texte : ici on doit rester lisible du premier coup d'oeil.
export const metadata = {
  title: "Travailler avec moi · EN OFF",
  description:
    "Je teste des adresses et je les raconte à des voyageuses qui préparent un séjour. Voilà comment je travaille.",
};

const FORMATS = [
  {
    numero: "1",
    titre: "Une série d'épisodes tournée sur place.",
    texte:
      "Je viens, je teste comme une cliente, et je publie une suite de vidéos sur Instagram et TikTok.",
    inclinaison: "-rotate-1",
  },
  {
    numero: "2",
    titre: "Une fiche dans le carnet.",
    texte:
      "Votre adresse rejoint le carnet de la ville, avec la date du test. Elle reste en ligne et se retrouve dans les recherches.",
    inclinaison: "rotate-1",
  },
  {
    numero: "3",
    titre: "Un passage dans EN OFF.",
    texte:
      "Ma lettre du dimanche, envoyée à des personnes qui préparent un voyage ou une sortie.",
    inclinaison: "-rotate-1",
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

      <section className="mt-12 px-5">
        <TitreSection>Ce que je propose</TitreSection>

        <div className="mt-8 grid gap-7 md:grid-cols-3 md:gap-6">
          {FORMATS.map((f) => (
            <div key={f.numero} className="ruban">
              <div className={`page-cahier tenue ${f.inclinaison} pt-7 hover:rotate-0 hover:-translate-y-1`}>
                <p className="signature text-[30px] leading-none text-terracotta">{f.numero}</p>
                <h3 className="h3 mt-3">{f.titre}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-texte">{f.texte}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Le bloc central de la page : la methode, et le droit de veto. */}
      <section className="mt-14 px-5">
        <div className="relative rounded-[3px] bg-vert p-6 text-papier shadow-tirage md:p-9">
          <Trombone className="absolute -top-4 right-6 h-11 w-5 text-dore/70" />
          <div className="filets-clair" aria-hidden />
          <p className="surtitre mt-4 text-dore">Comment je travaille</p>
          <p className="mt-3 max-w-lecture font-serif text-[26px] leading-tight text-papier">
            Je viens tester comme une cliente, pas en visite de presse.
          </p>
          <p className="mt-5 max-w-lecture text-[15px] leading-relaxed text-papier/75">
            Chaque publication indique la date du test et ce que vous m&apos;avez offert, le cas
            échéant. C&apos;est une obligation légale, et c&apos;est aussi ce qui rend ma
            recommandation crédible.
          </p>
          <p className="mt-3 max-w-lecture text-[15px] leading-relaxed text-papier/75">
            Je garde le droit de dire ce que je n&apos;ai pas aimé. Si votre adresse ne convainc
            pas, je ne la publie pas plutôt que d&apos;en dire du bien. Vous le savez avant que je
            vienne.
          </p>
        </div>
      </section>

      <section className="mt-14 px-5">
        <TitreSection>Avec qui je travaille, et avec qui non</TitreSection>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="page-cahier lignes">
            <p className="surtitre text-brique">Ce n&apos;est pas pour vous si</p>
            <p className="ecriture mt-2">
              vous cherchez une publication validée à l&apos;avance, un texte écrit par vos soins,
              ou la garantie d&apos;un avis positif.
            </p>
          </div>

          <div className="page-cahier lignes">
            <p className="surtitre text-vert">C&apos;est pour vous si</p>
            <p className="ecriture mt-2">
              vous êtes convaincu de la qualité de votre lieu et que vous voulez qu&apos;on le voie
              tel qu&apos;il est.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14 px-5">
        <TitreSection>Écrivez-moi</TitreSection>
        {/* Le formulaire garde la largeur de lecture, il ne s'etire pas. */}
        <div className="md:max-w-canvas">
          <FormulaireContactPro />
        </div>
      </section>

      <section className="mt-12 px-5">
        <p className="signature text-center text-[24px] leading-snug text-texte2">
          Tarifs communiqués sur demande, selon le format et la ville.
        </p>
      </section>
    </main>
  );
}
