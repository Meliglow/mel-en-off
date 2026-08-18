import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EnTetePage from "@/components/EnTetePage";
import FicheAdresse from "@/components/FicheAdresse";
import FormulaireInscription from "@/components/FormulaireInscription";
import NonTeste from "@/components/NonTeste";
import { adressesDeVille, nomDeVille, trier, villes } from "@/lib/adresses";
import { slugifier } from "@/lib/types";

// Ajouter une ville se fait en ajoutant des lignes au Google Sheet.
// Aucun fichier a creer ici.
export const dynamicParams = false;

export function generateStaticParams() {
  return villes().map((v) => ({ ville: v.slug }));
}

export function generateMetadata({ params }: { params: { ville: string } }): Metadata {
  const nom = nomDeVille(params.ville);
  if (!nom) return { title: "Carnet introuvable · EN OFF" };
  return {
    title: `${nom}, le carnet · EN OFF`,
    description: `Les adresses que j'ai testées à ${nom}, avec la date de chaque test et ce que j'ai payé.`,
  };
}

export default function PageVille({ params }: { params: { ville: string } }) {
  const nom = nomDeVille(params.ville);
  if (!nom) notFound();

  const { recommandees, recalees } = trier(adressesDeVille(params.ville));

  return (
    <main>
      <EnTetePage
        surtitre="Le carnet"
        titre={nom}
        chapo="Ce que j'ai testé ici, sur place, avec la date de chaque test et ce que j'ai payé."
      />

      {/* Ce qui n'a pas marche, en haut : c'est ce qui evite une mauvaise soiree. */}
      {recalees.length > 0 && (
        <section className="mt-6 px-5">
          <div className="rounded-carte border border-bord bg-sable p-5">
            <p className="surtitre">Ce qui n&apos;a pas marché</p>
            <p className="mt-2 text-[15px] leading-relaxed text-texte">
              {recalees.length} adresse{recalees.length > 1 ? "s" : ""} que j&apos;ai testée
              {recalees.length > 1 ? "s" : ""} ici et où je ne retourne pas :{" "}
              {recalees.map((a) => a.nom).join(", ")}. Le détail est plus bas.
            </p>
          </div>
        </section>
      )}

      <section className="mt-8 px-5">
        {recommandees.length > 0 && (
          <>
            <h2 className="h2">Ce que je recommande</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {recommandees.map((a) => (
                <FicheAdresse key={a.slug_page} adresse={a} />
              ))}
            </div>
          </>
        )}

        {recalees.length > 0 && (
          <div className={recommandees.length > 0 ? "mt-10" : ""}>
            <h2 className="h2">Les recalées</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {recalees.map((a) => (
                <FicheAdresse key={a.slug_page} adresse={a} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mt-12 px-5">
        <div className="rounded-carte border border-bord bg-sable p-5">
          <p className="surtitre">La lettre du dimanche</p>
          <h2 className="h2 mt-2">{nom}, avant tout le monde</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Les nouvelles adresses testées ici partent d&apos;abord dans EN OFF, avec ce que
            j&apos;ai payé et la date.
          </p>
          <div className="mt-5 md:max-w-canvas">
            <FormulaireInscription
              source={`carnet-${slugifier(nom)}`}
              libelleBouton="Recevoir la newsletter →"
            />
          </div>
        </div>
      </section>

      <NonTeste complement={`à ${nom}`} />
    </main>
  );
}
