import AComplete from "@/components/AComplete";
import EnTetePage from "@/components/EnTetePage";
import { EMAIL_CONTACT_PRO, URL_SITE } from "@/config";

export const metadata = {
  title: "Mentions légales · EN OFF",
  description: "Mentions légales du site melnourdi.fr.",
};

export default function MentionsLegalesPage() {
  return (
    <main>
      <EnTetePage titre="Mentions légales" />

      <section className="mt-8 flex flex-col gap-8 px-5">
        <div>
          <h2 className="h3">Éditrice du site</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Le site {URL_SITE} est édité par Mel Nourdi.
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-[15px] leading-relaxed text-texte">
            <li>
              Nom et prénom de l&apos;éditrice : <AComplete>nom complet à l&apos;état civil</AComplete>
            </li>
            <li>
              Statut : <AComplete>micro-entreprise, société, ou autre</AComplete>
            </li>
            <li>
              Adresse : <AComplete>adresse de l&apos;entreprise</AComplete>
            </li>
            <li>
              Numéro SIRET : <AComplete>numéro SIRET</AComplete>
            </li>
            <li>
              Numéro de TVA intracommunautaire, le cas échéant :{" "}
              <AComplete>numéro de TVA, ou mention de la franchise en base</AComplete>
            </li>
            <li>Email : {EMAIL_CONTACT_PRO}</li>
          </ul>
        </div>

        <div>
          <h2 className="h3">Directrice de la publication</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            <AComplete>nom de la directrice de la publication</AComplete>
          </p>
        </div>

        <div>
          <h2 className="h3">Hébergement</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
            États-Unis. Site : vercel.com
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-texte2">
            <AComplete>
              vérifier l&apos;adresse de l&apos;hébergeur sur vercel.com/legal avant publication
            </AComplete>
          </p>
        </div>

        <div>
          <h2 className="h3">Propriété intellectuelle</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Les textes et les photographies publiés sur ce site sont l&apos;œuvre de Mel Nourdi,
            sauf mention contraire. Toute reproduction, même partielle, est soumise à autorisation
            écrite préalable.
          </p>
        </div>

        <div>
          <h2 className="h3">Transparence des publications</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Chaque adresse publiée porte la date à laquelle elle a été testée. Lorsqu&apos;un
            séjour, un repas ou une prestation a été offert, la mention « invitée, signalé »
            apparaît sur la fiche concernée. Une invitation ne conditionne jamais le contenu du
            verdict.
          </p>
        </div>

        <div>
          <h2 className="h3">Données personnelles</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Le traitement des données est décrit sur la page Confidentialité.
          </p>
        </div>
      </section>
    </main>
  );
}
