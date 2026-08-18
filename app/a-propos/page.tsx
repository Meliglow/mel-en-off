import EnTetePage from "@/components/EnTetePage";

export const metadata = {
  title: "À propos · EN OFF",
  description:
    "Comment je travaille : je teste tout moi-même, je note la date, je dis ce que j'ai payé, et je garde le droit de ne pas publier.",
};

export default function AProposPage() {
  return (
    <main>
      <EnTetePage
        surtitre="La méthode"
        titre="Comment je travaille"
        chapo="Je m'appelle Mel. Je teste des adresses, et je te dis ce que j'en pense, sans arrondir les angles."
      />

      <section className="mt-8 grid gap-3 px-5 md:grid-cols-3">
        <div className="carte p-5">
          <h2 className="h3">Je teste tout moi-même, sur place.</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Je ne reprends pas un avis lu ailleurs, je ne recopie pas une fiche. J'y vais, je
            m'assois, je dors sur place, je commande. Si je n'y suis pas allée, ce n'est pas dans la
            lettre.
          </p>
        </div>

        <div className="carte p-5">
          <h2 className="h3">Chaque adresse porte la date où je l'ai testée.</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Un lieu change, une équipe part, une carte se transforme. La date te dit à quel moment
            mon avis est valable. Un avis sans date ne vaut pas grand-chose.
          </p>
        </div>

        <div className="carte p-5">
          <h2 className="h3">Je dis ce que j'ai payé.</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Le prix fait partie du verdict. Une adresse peut être très bien à quarante euros et
            décevante à cent. Tu vois le montant, tu juges toi-même.
          </p>
        </div>
      </section>

      <section className="mt-8 px-5">
        <div className="filets" aria-hidden />
        <h2 className="h2 mt-4">Le droit de veto</h2>
        <p className="citation mt-4 md:max-w-lecture">
          Une invitation ne change pas le verdict. Si l'adresse ne vaut pas le coup, je ne la publie
          pas. Et quand je suis invitée, c'est écrit.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-texte md:max-w-lecture">
          C'est la seule règle qui rend le reste crédible. Un lieu qui m'invite sait, avant que
          j'arrive, que je peux repartir sans rien publier. Personne ne relit mes textes avant moi,
          et personne ne les valide.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-texte md:max-w-lecture">
          Les adresses que j'écarte comptent autant que celles que je recommande. C'est souvent
          celles-là qui t'évitent une mauvaise soirée.
        </p>
        <p className="signature mt-5 text-[34px] leading-tight text-terracotta">Mel</p>
      </section>
    </main>
  );
}
