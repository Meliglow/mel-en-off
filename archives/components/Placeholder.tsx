// Emplacement photo clairement identifie : role + ratio.
// Aucune image generee. Deposer les vraies photos dans /public et remplacer.
export default function Placeholder({
  label,
  ratio,
  className = "",
  rounded = "rounded-[14px]",
}: {
  label: string;
  ratio?: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 border border-dashed border-bord2 bg-sable px-3 text-center ${rounded} ${className}`}
      role="img"
      aria-label={`Emplacement photo : ${label}`}
    >
      <span aria-hidden className="text-base leading-none text-terracotta">
        ✦
      </span>
      <span className="surtitre">{label}</span>
      {ratio && <span className="text-[10px] font-medium text-texte3">Photo {ratio}</span>}
    </div>
  );
}
