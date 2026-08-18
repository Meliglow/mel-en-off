import AComplete from "@/components/AComplete";
import EnTetePage from "@/components/EnTetePage";
import { EMAIL_CONTACT_PRO } from "@/config";

export const metadata = {
  title: "Confidentialité · EN OFF",
  description: "Ce que deviennent tes données quand tu t'inscris à EN OFF.",
};

export default function ConfidentialitePage() {
  return (
    <main>
      <EnTetePage
        titre="Confidentialité"
        chapo="Ce que je collecte, pourquoi, et comment tu peux repartir avec tes données."
      />

      <section className="mt-8 grid gap-8 px-5 md:grid-cols-2 md:gap-x-8">
        <div>
          <h2 className="h3">Qui traite tes données</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Mel Nourdi, <AComplete>statut, adresse et numéro SIRET</AComplete>. Pour toute question,
            écris à {EMAIL_CONTACT_PRO}.
          </p>
        </div>

        <div>
          <h2 className="h3">Ce que je collecte</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Quand tu t&apos;inscris à la lettre : ton prénom et ton email. Rien d&apos;autre.
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Quand un professionnel écrit depuis la page Collaborations : son nom, son
            établissement, sa ville, son email et son message. Ces informations servent uniquement à
            répondre, et ne rejoignent aucune liste de diffusion.
          </p>
        </div>

        <div>
          <h2 className="h3">Pourquoi</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Pour t&apos;envoyer la lettre EN OFF et mes emails, et pour t&apos;envoyer en priorité
            ce qui correspond à ce que tu prépares. La base légale est ton consentement, donné en
            cochant la case du formulaire. Tu peux le retirer à tout moment.
          </p>
        </div>

        <div>
          <h2 className="h3">Qui d&apos;autre y a accès</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            La lettre est envoyée avec MailerLite, qui héberge la liste des inscrites pour mon
            compte. Le site est hébergé par Vercel. Personne d&apos;autre. Je ne vends ni ne loue
            aucune donnée, jamais.
          </p>
        </div>

        <div>
          <h2 className="h3">Combien de temps</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Tes données restent dans la liste tant que tu y es inscrite. Après désinscription,
            elles sont supprimées sous{" "}
            <AComplete>durée retenue, par exemple trois mois</AComplete>. Les messages
            professionnels sont conservés le temps d&apos;échanger, puis supprimés.
          </p>
        </div>

        <div>
          <h2 className="h3">Tes droits</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Tu peux demander à consulter tes données, à les corriger, à les faire supprimer, ou à
            les récupérer. Un email à {EMAIL_CONTACT_PRO} suffit, je réponds moi-même. Si ma réponse
            ne te convient pas, tu peux saisir la CNIL, cnil.fr.
          </p>
        </div>

        <div>
          <h2 className="h3">Te désinscrire</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Chaque email contient un lien de désinscription. Un clic, et c&apos;est fait, sans avoir
            à me le justifier.
          </p>
        </div>

        <div>
          <h2 className="h3">Cookies et mesure d&apos;audience</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Ce site ne dépose aucun cookie publicitaire, n&apos;utilise aucun outil de mesure
            d&apos;audience et n&apos;embarque aucun script tiers. C&apos;est pour ça qu&apos;il n&apos;y
            a pas de bandeau à accepter.
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Ton navigateur ne garde rien non plus : aucune donnée n&apos;est stockée sur ton
            appareil par ce site.
          </p>
        </div>
      </section>
    </main>
  );
}
