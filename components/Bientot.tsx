// Etat "bientot" explicite. On l'affiche quand il n'y a rien de teste a montrer.
// Jamais de faux contenu, jamais d'adresse de remplissage.
export default function Bientot({
  titre = "Bientôt",
  children,
}: {
  titre?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-carte border border-dashed border-bord2 bg-sable p-5">
      <p className="surtitre">{titre}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-texte">{children}</p>
    </div>
  );
}
