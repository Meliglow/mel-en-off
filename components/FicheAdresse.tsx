import Photo from "./Photo";
import TamponDate from "./TamponDate";
import { Adresse, formaterDate } from "@/lib/types";

// Le gabarit d'une adresse, partage par les pages categorie et les pages ville.
// Une adresse sans date de test n'arrive jamais jusqu'ici : elle est ecartee
// en amont, dans lib/adresses.ts. C'est la seule donnee non negociable.
export default function FicheAdresse({ adresse }: { adresse: Adresse }) {
  const date = formaterDate(adresse.date_du_test);
  const contour = adresse.recalee ? "border-dashed" : "border-solid";

  return (
    <article className={`carte overflow-hidden border ${contour}`}>
      <Photo
        fichier={adresse.photo}
        alt={`${adresse.nom}, ${adresse.ville}`}
        className="aspect-[4/5] w-full"
      />

      <div className="p-4">
        <h3 className="h3">{adresse.nom}</h3>

        {adresse.categorie && (
          <p className="mt-1 text-[12px] font-medium text-texte2">
            {adresse.categorie}
            {adresse.ville && ` · ${adresse.ville}`}
          </p>
        )}

        {adresse.scene && (
          <p className="mt-3 text-[15px] leading-relaxed text-texte">{adresse.scene}</p>
        )}

        {adresse.verdict && <p className="citation mt-3">{adresse.verdict}</p>}

        {adresse.a_savoir_avant && (
          <div className="mt-3">
            <p className="surtitre">À savoir avant d&apos;y aller</p>
            <p className="mt-1 text-[15px] leading-relaxed text-texte">{adresse.a_savoir_avant}</p>
          </div>
        )}

        {/* L'animation de la fiche, c'est le tampon qui s'encre. Rien d'autre. */}
        <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2">
          <TamponDate date={adresse.date_du_test} />
          {adresse.prix_paye && (
            <span className="puce-contour">
              payé {adresse.prix_paye} le {date}
            </span>
          )}
          {adresse.invitee && <span className="puce-contour">invitée, signalé</span>}
        </div>
      </div>
    </article>
  );
}
