import AComplete from "@/components/AComplete";
import EnTetePage from "@/components/EnTetePage";
import { EMAIL_CONTACT_PRO } from "@/config";

export const metadata = {
  title: "Confidentialité · Melnourdi",
  description: "Les données utilisées pour tes demandes de projet et les services Melnourdi.",
};

export default function ConfidentialitePage() {
  return (
    <main>
      <EnTetePage
        titre="Confidentialité"
        chapo="Ce que je collecte, pourquoi, et comment tu peux repartir avec tes données."
      />

      <section className="mt-8 grid gap-8 px-5 md:grid-cols-2 md:gap-x-8">
        <div className="md:col-span-2">
          <h2 className="h3">Ton projet de logiciel de réservation</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Le configurateur recueille tes coordonnées professionnelles, les informations sur ton
            activité et les options choisies pour étudier ta demande et préparer une proposition.
            Le brouillon reste en mémoire dans la page jusqu’à son envoi ; recharger ou fermer
            la page l’efface. Une demande enregistrée reçoit une référence et est conservée dans
            l’espace privé de Mel, sur le stockage du site Railway. Elle ne t’inscrit pas à une newsletter.
            N’indique aucun mot de passe, numéro de carte, dossier ou donnée de santé d’une cliente.
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            Les demandes sont utilisées pour préparer le projet demandé et suivre les échanges.
            Tu peux demander leur accès, correction ou suppression à contact@melnourdi.fr.
            Si les notifications email sont activées, Brevo traite les messages nécessaires au suivi.
            Les demandes ne sont pas vendues ou utilisées pour créer des audiences publicitaires.
          </p>
        </div>
        <div className="md:col-span-2">
          <h2 className="h3">La démonstration Lodyva</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            La démonstration utilise uniquement des profils et rendez-vous fictifs. Elle ne transmet
            aucune réservation, ne réalise aucun paiement et n’envoie aucun email. Les modifications
            restent en mémoire dans la page et disparaissent au rechargement. L’administration privée
            de Melnourdi utilise un cookie de connexion nécessaire, limité à huit heures.
          </p>
        </div>
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
            Quand tu t&apos;inscris à ma newsletter ou demandes le guide offert : ton email, et ton prénom si tu le donnes. Rien d&apos;autre.
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
            Pour te donner accès au guide offert et t&apos;envoyer ma newsletter et mes emails. La base légale est ton consentement, donné en
            cochant la case du formulaire. Tu peux le retirer à tout moment.
          </p>
        </div>

        <div>
          <h2 className="h3">Qui d&apos;autre y a accès</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-texte">
            La lettre est envoyée avec Brevo, qui héberge la liste des inscrites pour mon
            compte. Le site est hébergé par Railway. Personne d&apos;autre. Je ne vends ni ne loue
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
            Les brouillons du configurateur et les simulations restent uniquement en mémoire dans
            la page ouverte. Le cookie de connexion de l’administration est réservé à cet espace privé.
          </p>
        </div>
      </section>
    </main>
  );
}
