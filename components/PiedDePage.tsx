import Link from "next/link";
import SepFleur from "./SepFleur";

export default function PiedDePage({ page = 1 }: { page?: number }) {
  return (
    <footer className="mt-12 px-5 pb-10">
      <SepFleur />
      <p className="mt-4 text-center font-serif text-[22px] text-encre">Mel en off</p>
      <p className="mt-1 text-center text-[12px] text-texte2">
        Le carnet d'adresses de Mel Nourdi. Testé pour de vrai.
      </p>
      <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] font-semibold text-texte2">
        <Link href="/resultats">Le carnet</Link>
        <span aria-hidden className="text-bord2">
          ·
        </span>
        <Link href="/collab">Collaborations</Link>
        <span aria-hidden className="text-bord2">
          ·
        </span>
        <Link href="/#lettre">La lettre</Link>
      </nav>
      <div className="mt-5 flex items-center justify-between text-[11px] text-texte3">
        <span>Carnet nº 07</span>
        <span>© {new Date().getFullYear()} Mel en off</span>
        <span>p. {page}</span>
      </div>
    </footer>
  );
}
