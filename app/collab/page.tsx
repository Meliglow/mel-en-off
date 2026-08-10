import Link from "next/link";
import FormulaireCollab from "@/components/FormulaireCollab";
import PiedDePage from "@/components/PiedDePage";

export const metadata = {
  title: "Collaborations · Mel en off",
  description:
    "Vous tenez un lieu ? Je ne publie que ce que j'ai testé. Écrivez-moi, réponse sous 48h.",
};

export default function CollabPage() {
  return (
    <main className="px-5">
      <div className="flex items-center justify-between pb-2 pt-5">
        <Link href="/" className="btn-rond" aria-label="Retour à l'accueil">
          <span aria-hidden className="text-lg leading-none">
            ←
          </span>
        </Link>
        <span className="surtitre">Carnet nº 07 / Collaborations</span>
        <span className="w-11" aria-hidden />
      </div>

      <div className="filets mt-3" aria-hidden />
      <h1 className="h1 mt-4">Vous tenez un lieu ?</h1>
      <p className="mt-3 text-[16px] leading-relaxed text-texte">
        Je ne publie que ce que j'ai testé, en toute honnêteté. Si votre adresse me plaît, elle a sa
        place dans le carnet.
      </p>
      <p className="mt-2 text-[16px] leading-relaxed text-texte">
        Dites-moi qui vous êtes et ce que vous cherchez. Je réponds vite.
      </p>

      <FormulaireCollab />

      <PiedDePage page={12} />
    </main>
  );
}
