import { Verdict, labelVerdict } from "@/archives/lib/types";

const STYLES: Record<Verdict, string> = {
  "coup de coeur": "bg-vert text-papier",
  correct: "bg-carte text-texte border border-bord2",
  "a eviter": "bg-brique text-white",
};

export default function PastilleVerdict({
  verdict,
  className = "",
}: {
  verdict: Verdict;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] shadow-douce ${STYLES[verdict]} ${className}`}
    >
      {labelVerdict(verdict)}
      {verdict === "coup de coeur" && <span aria-hidden>♡</span>}
    </span>
  );
}
