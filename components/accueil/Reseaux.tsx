import TitreSection from "@/components/TitreSection";
import { RESEAUX } from "@/config";

function IconInstagram() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden
    >
      <path d="M14 3v11.4a3.6 3.6 0 1 1-3-3.55" />
      <path d="M14 3c.4 2.6 2.1 4.2 4.7 4.4" />
    </svg>
  );
}

const COMPTES = [
  {
    nom: "Instagram",
    pseudo: "@melenoff",
    lien: RESEAUX.instagram,
    phrase: "Les adresses en stories, et ce qui n'est pas encore écrit.",
    icone: <IconInstagram />,
    inclinaison: "-rotate-1",
  },
  {
    nom: "TikTok",
    pseudo: "@mel_enoff",
    lien: RESEAUX.tiktok,
    phrase: "Les tests en vidéo, sur place, sans montage flatteur.",
    icone: <IconTikTok />,
    inclinaison: "rotate-1",
  },
];

/**
 * On se suit : les deux comptes, poses comme deux fiches epinglees dans le
 * carnet. Le ruban adhesif tient chaque fiche, le pseudo est ecrit a la main.
 *
 * L'animation de la section, c'est le trait sous le titre. Rien d'autre.
 */
export default function Reseaux() {
  return (
    <section className="mt-14 px-5">
      <div className="filets" aria-hidden />
      <TitreSection className="mt-5">On se suit ?</TitreSection>

      <p className="mt-4 max-w-lecture text-[15px] leading-relaxed text-texte">
        Je poste au fil des tests. La lettre reste l&apos;endroit où je dis tout, mais le reste se
        passe là.
      </p>

      <div className="mt-8 grid gap-8 md:max-w-[720px] md:grid-cols-2 md:gap-6">
        {COMPTES.map((c) => (
          <div key={c.nom} className="ruban">
            <a
              href={c.lien}
              target="_blank"
              rel="noopener noreferrer"
              className={`page-cahier lift block ${c.inclinaison} pt-6`}
            >
              <span className="flex items-center gap-2.5 text-terracotta">
                {c.icone}
                <span className="surtitre" style={{ color: "var(--terracotta)" }}>
                  {c.nom}
                </span>
              </span>
              <span className="signature mt-3 block text-[30px] leading-tight text-encre">
                {c.pseudo}
              </span>
              <span className="mt-2 block text-[14px] leading-relaxed text-texte2">{c.phrase}</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
