// Section d'appel a l'abonnement Instagram / TikTok.
// Remplacer les liens par les vrais comptes.
const INSTA = "https://instagram.com/melnourdi";
const TIKTOK = "https://tiktok.com/@melnourdi";

export default function CtaSocial() {
  return (
    <section className="mt-10 px-5">
      <div className="overflow-hidden rounded-carte bg-vert p-6 text-papier shadow-douce">
        <div className="filets-clair" aria-hidden />
        <p className="surtitre mt-3 text-dore">On se suit ?</p>
        <h2 className="h2 mt-1 text-papier">La suite est sur Instagram et TikTok</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-papier/75">
          Les adresses en avant-première, en stories et en vidéo, plus les coulisses de mes tests.
          C'est là que ça se passe vraiment.
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          <a href={INSTA} target="_blank" rel="noopener noreferrer" className="btn btn-terracotta w-full">
            Suivre sur Instagram
          </a>
          <a href={TIKTOK} target="_blank" rel="noopener noreferrer" className="btn btn-contour-clair w-full">
            Suivre sur TikTok
          </a>
        </div>

        <p className="mt-3 text-center text-[12px] text-papier/60">@melnourdi, partout.</p>
      </div>
    </section>
  );
}
