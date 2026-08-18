import EnTetePage from "@/components/EnTetePage";
import TroisQuestions from "@/components/TroisQuestions";

export const metadata = {
  title: "Merci · EN OFF",
  description: "Ton inscription à EN OFF est enregistrée.",
  robots: { index: false, follow: true },
};

export default function MerciPage() {
  return (
    <main>
      <EnTetePage
        surtitre="C'est fait"
        titre="Bienvenue en off."
        chapo="Ton inscription est enregistrée. La prochaine lettre part dimanche."
      />

      <section className="mt-6 px-5">
        <p className="citation">
          Va vérifier ta boîte mail : un premier message t&apos;attend. S&apos;il n&apos;y est pas,
          regarde dans les indésirables, et fais-le glisser dans ta boîte de réception. Ça évitera
          que les suivants s&apos;y perdent aussi.
        </p>
      </section>

      <TroisQuestions />
    </main>
  );
}
