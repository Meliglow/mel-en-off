import Link from "next/link";
import { Lieu, labelCategorie } from "@/archives/lib/types";

// Bloc sur fond encre. N'est rendu qu'apres un filtrage suffisant (voir ResultatsClient).
export default function BlocAEviter({
  lieux,
  cible,
}: {
  lieux: Lieu[];
  cible: string;
}) {
  return (
    <section className="mt-6 rounded-carte bg-encre p-5 text-papier">
      <div className="filets-clair" aria-hidden />
      <p className="surtitre mt-3 text-dore">Je ne recommande pas</p>
      <h2 className="h2 mt-1 text-papier">À éviter {cible}</h2>
      <p className="mt-2 text-[14px] leading-relaxed text-papier/70">
        Je ne cherche à démolir personne. Je vous dis juste ce qui n'a pas été, pour vous éviter la
        même déception.
      </p>

      {lieux.length === 0 ? (
        <p className="mt-4 rounded-champ border border-papier/20 bg-papier/5 p-4 text-[15px] text-papier/85">
          Rien à signaler ici, bonne nouvelle.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {lieux.map((l) => (
            <li key={l.id}>
              <Link
                href={`/lieux/${l.id}`}
                className="block rounded-champ border border-papier/15 bg-papier/[0.04] p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-[21px] leading-tight text-papier">{l.name}</h3>
                  <span className="shrink-0 text-[13px] text-papier/60">{l.budget}</span>
                </div>
                <p className="mt-1 text-[12px] font-medium text-papier/60">
                  {l.city} · {labelCategorie(l.cat)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {l.reasons.map((r) => (
                    <span key={r} className="puce-brique">
                      {r}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
