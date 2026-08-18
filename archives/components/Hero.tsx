import Link from "next/link";
import MenuButton from "./MenuButton";
import Placeholder from "./Placeholder";
import SepFleur from "./SepFleur";

// Pour mettre la vraie photo de Mel : deposer le fichier dans /public
// (ex. public/portrait-mel.jpg) puis renseigner le chemin ci-dessous.
const PORTRAIT = ""; // ex: "/portrait-mel.jpg"

export default function Hero() {
  return (
    <header className="px-5 pt-5">
      {/* Barre legere : juste le menu rond a droite (le nom vit dans la signature orange) */}
      <div className="anim-hero flex items-center justify-end">
        <MenuButton />
      </div>

      <div className="anim-hero filets mt-4" aria-hidden />
      <p className="anim-hero surtitre mt-3">
        Carnet nº 07 <span className="mx-1 text-bord2">/</span> Testé pour de vrai
      </p>

      {/* Deux colonnes : titre a gauche, portrait tirage a droite */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="anim-hero anim-d1 pt-1">
          <h1 className="h1">
            Je teste,
            <br />
            je trie,
            <br />
            je vous dis tout.
          </h1>
          <div className="trait-anim mt-4 h-[3px] w-14 rounded-full bg-terracotta" aria-hidden />
          <p className="signature mt-1 text-[34px] leading-tight text-terracotta">Mel en off</p>
        </div>

        <div className="anim-hero anim-d2 relative shrink-0 pr-2 pt-4">
          <div className="tirage tirage-droite w-[150px]">
            {PORTRAIT ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={PORTRAIT}
                alt="Portrait de Mel"
                className="h-[172px] w-[132px] rounded-[2px] object-cover"
              />
            ) : (
              <Placeholder
                label="Portrait de Mel"
                ratio="132×172"
                className="h-[172px] w-[132px]"
                rounded="rounded-[2px]"
              />
            )}
            <p className="signature mt-2 text-center text-[19px] text-texte2">Ravenne, juillet</p>
          </div>
          <div className="tampon absolute -left-5 -top-4">
            Testé
            <br />
            sur place
            <br />
            2026
          </div>
        </div>
      </div>

      {/* Phrase de contexte en citation a filet gauche */}
      <p className="anim-hero anim-d3 citation mt-7">
        Je note tout ici : les adresses qui valent le détour, et celles qu'il vaut mieux zapper. Rien
        que je n'aie testé moi-même.
      </p>

      {/* Une seule action : ouvrir le carnet (Collab vit dans le menu et le pied de page) */}
      <div className="anim-hero anim-d4 mt-5">
        <Link href="/resultats" className="btn btn-vert w-full">
          Ouvrir le carnet
        </Link>
      </div>

      <SepFleur className="mt-8" />
    </header>
  );
}
