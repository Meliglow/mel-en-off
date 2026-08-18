import type { Metadata } from "next";
import Bientot from "@/components/Bientot";
import EnTetePage from "@/components/EnTetePage";
import FicheAdresse from "@/components/FicheAdresse";
import GuideGratuit from "@/components/accueil/GuideGratuit";
import NonTeste from "@/components/NonTeste";
import { adressesDeCategorie, nomDeZone, trier, zonesDeCategorie } from "@/lib/adresses";
import { CATEGORIE_SPAS, ZONE_SPAS_PRINCIPALE } from "@/config";

// Pages entierement statiques : seules les zones connues au build existent.
export const dynamicParams = false;

export function generateStaticParams() {
  const zones = zonesDeCategorie(CATEGORIE_SPAS).map((z) => z.slug);
  // La zone principale existe toujours, meme sans adresse : c'est l'aimant du site.
  if (!zones.includes(ZONE_SPAS_PRINCIPALE.slug)) zones.push(ZONE_SPAS_PRINCIPALE.slug);
  return zones.map((zone) => ({ zone }));
}

export function generateMetadata({ params }: { params: { zone: string } }): Metadata {
  const nom = libelleZone(params.zone);
  return {
    title: `Les spas, ${nom} · EN OFF`,
    description: `Les spas testés sur place, ${nom}. Chaque fiche porte la date du test et ce que j'ai payé.`,
  };
}

export default function PageSpas({ params }: { params: { zone: string } }) {
  const nom = libelleZone(params.zone);
  const { recommandees, recalees } = trier(adressesDeCategorie(CATEGORIE_SPAS, params.zone));
  const vide = recommandees.length === 0 && recalees.length === 0;

  return (
    <main>
      <EnTetePage
        surtitre="Les spas"
        titre={`Les spas, ${nom}`}
        chapo="Testés comme une cliente, à mes frais sauf mention contraire. Chaque fiche porte la date du test et ce que j'ai payé."
      />

      <section className="mt-8 px-5">
        {vide ? (
          <Bientot>
            Les premiers spas de cette zone sont en cours de test. Ils sortiront d&apos;abord dans
            la lettre du dimanche.
          </Bientot>
        ) : (
          <>
            {recommandees.length > 0 && (
              <>
                <h2 className="h2">Ceux que je recommande</h2>
                <div className="mt-4 flex flex-col gap-4">
                  {recommandees.map((a) => (
                    <FicheAdresse key={a.slug_page} adresse={a} />
                  ))}
                </div>
              </>
            )}

            {recalees.length > 0 && (
              <div className={recommandees.length > 0 ? "mt-10" : ""}>
                <h2 className="h2">Ceux que j&apos;évite</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-texte2">
                  Testés aussi, et je n&apos;y retourne pas.
                </p>
                <div className="mt-4 flex flex-col gap-4">
                  {recalees.map((a) => (
                    <FicheAdresse key={a.slug_page} adresse={a} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <GuideGratuit />

      <NonTeste sujet={nom} />
    </main>
  );
}

// Le nom lisible d'une zone : celui des donnees si elle en a, sinon celui de config.ts.
function libelleZone(slug: string): string {
  const depuisLesDonnees = nomDeZone(CATEGORIE_SPAS, slug);
  if (depuisLesDonnees) return depuisLesDonnees;
  return slug === ZONE_SPAS_PRINCIPALE.slug ? ZONE_SPAS_PRINCIPALE.nom : slug;
}
