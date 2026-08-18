// En-tete commune a toutes les pages : le double filet du carnet, le titre,
// et une phrase de contexte facultative.
export default function EnTetePage({
  surtitre,
  titre,
  chapo,
}: {
  surtitre?: string;
  titre: string;
  chapo?: React.ReactNode;
}) {
  return (
    <header className="px-5 pt-6">
      <div className="filets" aria-hidden />
      {surtitre && <p className="surtitre mt-3">{surtitre}</p>}
      <h1 className="h1 mt-3">{titre}</h1>
      {chapo && (
        <p className="mt-3 text-[16px] leading-relaxed text-texte md:max-w-canvas">{chapo}</p>
      )}
    </header>
  );
}
