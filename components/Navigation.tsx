import Link from "next/link";

// Une seule entree en haut : le contact professionnel. Le reste du site se
// parcourt depuis la page d'accueil et le pied de page.
export default function Navigation() {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-5">
      <Link href="/" className="font-serif text-[22px] leading-none text-encre">
        Mel en off
      </Link>
      <nav aria-label="Navigation principale">
        <Link
          href="/collaborations"
          className="inline-flex min-h-[44px] items-center text-[13px] font-semibold text-texte2"
        >
          Me contacter
        </Link>
      </nav>
    </div>
  );
}
