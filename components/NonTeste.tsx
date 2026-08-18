// Ce que je n'ai pas teste. Dit noir sur blanc ce que cette page ne couvre pas,
// plutot que de laisser croire qu'elle fait le tour de la question.
export default function NonTeste({ complement }: { complement?: string }) {
  return (
    <section className="mt-10 px-5">
      <div className="filets" aria-hidden />
      <h2 className="h2 mt-4">Ce que je n&apos;ai pas testé{complement ? ` ${complement}` : ""}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-texte md:max-w-canvas">
        Tout ce qui n&apos;est pas sur cette page, je n&apos;y suis pas allée. Je ne recopie pas les
        avis des autres, et je ne remplis pas une liste pour faire nombre.
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-texte md:max-w-canvas">
        Si tu veux que j&apos;aille voir un endroit précis, réponds à la lettre du dimanche, je lis
        tout.
      </p>
    </section>
  );
}
