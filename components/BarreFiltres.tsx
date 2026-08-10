"use client";

export default function BarreFiltres({
  query,
  onQuery,
  nbActifs,
  onOuvrir,
  total,
}: {
  query: string;
  onQuery: (v: string) => void;
  nbActifs: number;
  onOuvrir: () => void;
  total: number;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-bord bg-papier/95 px-5 py-3 backdrop-blur">
      <label htmlFor="recherche-nom" className="sr-only">
        Rechercher un lieu
      </label>
      <div className="relative">
        <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-texte3">
          ⌕
        </span>
        <input
          id="recherche-nom"
          type="search"
          className="champ pl-10"
          placeholder="Un nom, une ville..."
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <button type="button" className="puce" onClick={onOuvrir} aria-label="Ouvrir les filtres">
          <span aria-hidden>☰</span> Filtres
          {nbActifs > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-bold text-white">
              {nbActifs}
            </span>
          )}
        </button>
        <span className="text-[13px] font-semibold text-texte2">
          {total} lieu{total > 1 ? "x" : ""}
        </span>
      </div>
    </div>
  );
}
