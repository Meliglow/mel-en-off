// Marqueur visible pour les mentions que Mel doit completer elle-meme.
// Volontairement voyant : tant qu'il reste sur la page, elle est incomplete.
export default function AComplete({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded-[4px] border border-dashed border-bord2 bg-sable px-1.5 py-0.5 text-[13px] font-semibold text-brique">
      à compléter : {children}
    </mark>
  );
}
