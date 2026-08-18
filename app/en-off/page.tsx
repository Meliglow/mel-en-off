import EnTetePage from "@/components/EnTetePage";

export const metadata = {
  title: "EN OFF, la lettre du dimanche",
  description:
    "Chaque dimanche, les meilleures et les pires adresses que j'ai testées, avec la date et ce que j'ai payé.",
};

export default function EnOffPage() {
  return (
    <main>
      <EnTetePage
        surtitre="La lettre"
        titre="EN OFF, le dimanche"
        chapo="Une lettre par semaine, écrite à la main, sur ce que j'ai testé pour de vrai."
      />

      <section className="mt-8 grid gap-3 px-5 md:grid-cols-3">
        <div className="carte p-5">
          <h2 className="h3">Ce qu'il y a dedans</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Les adresses qui valent le coup, celles qui ne le valent pas, ce que j'ai payé dans
            chacune, et la date où j'y suis allée. Rien d'autre. Pas de promotion déguisée, pas de
            liste recopiée ailleurs.
          </p>
        </div>

        <div className="carte p-5">
          <h2 className="h3">À quel rythme</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Le dimanche. Une seule lettre, et les emails que je t'envoie quand j'ai quelque chose à
            te dire. Tu peux te désinscrire en un clic, à tout moment.
          </p>
        </div>

        <div className="carte p-5">
          <h2 className="h3">Pour qui</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Pour toi qui prépares un voyage ou une sortie, et qui n'as pas envie de passer deux
            heures à trier des avis anonymes. Je teste, je note la date, je te dis ce que j'en
            pense. Tu n'as plus qu'à réserver.
          </p>
        </div>
      </section>
    </main>
  );
}
