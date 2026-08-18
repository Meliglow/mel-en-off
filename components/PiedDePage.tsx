import { Fragment } from "react";
import Link from "next/link";
import SepFleur from "./SepFleur";
import { RESEAUX, ZONE_SPAS_PRINCIPALE } from "@/config";

// Les pages de contenu ne sont plus dans la navigation du haut : elles restent
// accessibles ici, et donc trouvables par les moteurs de recherche.
const PAGES = [
  { href: `/spas/${ZONE_SPAS_PRINCIPALE.slug}`, label: "Les spas" },
  { href: "/villes", label: "Les villes" },
  { href: "/collaborations", label: "Collaborations" },
  { href: "/a-propos", label: "À propos" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
];

function Point() {
  return (
    <span aria-hidden className="text-bord2">
      ·
    </span>
  );
}

export default function PiedDePage() {
  return (
    <footer className="mt-12 px-5 pb-10">
      <SepFleur />
      <p className="mt-4 text-center font-serif text-[22px] text-encre">Mel en off</p>
      <p className="mt-1 text-center text-[12px] text-texte2">
        La lettre du dimanche de Mel Nourdi. Testé pour de vrai.
      </p>

      <nav
        aria-label="Pied de page"
        className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] font-semibold text-texte2"
      >
        {PAGES.map((p, i) => (
          <Fragment key={p.href}>
            {i > 0 && <Point />}
            <Link href={p.href} className="lien-trait">{p.label}</Link>
          </Fragment>
        ))}
        <Point />
        <a href={RESEAUX.instagram} target="_blank" rel="noopener noreferrer" className="lien-trait">
          Instagram
        </a>
        <Point />
        <a href={RESEAUX.tiktok} target="_blank" rel="noopener noreferrer" className="lien-trait">
          TikTok
        </a>
      </nav>

      <p className="mt-5 text-center text-[11px] text-texte3">
        © {new Date().getFullYear()} Mel en off
      </p>
    </footer>
  );
}
