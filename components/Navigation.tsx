import Link from "next/link";
import { ZONE_SPAS_PRINCIPALE } from "@/config";

// Trois entrees, en ligne, sans menu deroulant et sans hamburger.
// Les reseaux vivent uniquement dans le pied de page.
const LIENS = [
  { href: `/spas/${ZONE_SPAS_PRINCIPALE.slug}`, label: "Spas" },
  { href: "/villes", label: "Villes" },
  { href: "/en-off", label: "En off" },
];

export default function Navigation() {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-5">
      <Link href="/" className="font-serif text-[22px] leading-none text-encre">
        Mel en off
      </Link>
      <nav aria-label="Navigation principale">
        <ul className="flex items-center gap-x-4 text-[13px] font-semibold text-texte2">
          {LIENS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="inline-flex min-h-[44px] items-center">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
