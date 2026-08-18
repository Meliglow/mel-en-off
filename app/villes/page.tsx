import Link from "next/link";
import Bientot from "@/components/Bientot";
import EnTetePage from "@/components/EnTetePage";
import { villes } from "@/lib/adresses";

export const metadata = {
  title: "Les villes · EN OFF",
  description: "Les carnets de ville : les adresses testées sur place, avec la date de chaque test.",
};

export default function VillesPage() {
  const liste = villes();

  return (
    <main>
      <EnTetePage
        surtitre="Les carnets"
        titre="Ville par ville"
        chapo="Chaque carnet réunit ce que j'ai testé sur place, avec la date et ce que j'ai payé."
      />

      <section className="mt-8 px-5">
        {liste.length === 0 ? (
          <Bientot>
            Le premier carnet de ville arrive. En attendant, la lettre du dimanche part quand même,
            et c'est là que tout sort en premier.
          </Bientot>
        ) : (
          <ul className="flex flex-col gap-3">
            {liste.map((v) => (
              <li key={v.slug}>
                <Link href={`/villes/${v.slug}`} className="carte lift flex items-center justify-between gap-3 p-4">
                  <span>
                    <span className="h3 block">{v.nom}</span>
                    <span className="mt-1 block text-[12px] font-medium text-texte2">
                      {v.nb} adresse{v.nb > 1 ? "s" : ""} testée{v.nb > 1 ? "s" : ""}
                    </span>
                  </span>
                  <span aria-hidden className="text-terracotta">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
