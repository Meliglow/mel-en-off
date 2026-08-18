import CeDimanche from "@/components/accueil/CeDimanche";
import GuideGratuit from "@/components/accueil/GuideGratuit";
import Hero from "@/components/accueil/Hero";
import Methode from "@/components/accueil/Methode";
import Planche from "@/components/accueil/Planche";
import VilleDuMoment from "@/components/accueil/VilleDuMoment";
import NoteEnMarge from "@/components/NoteEnMarge";
import Reveal from "@/components/Reveal";

// La page d'accueil n'a qu'un seul travail : collecter des emails pour EN OFF.
// Le hero vend la lettre, le bloc de fin vend le guide.
//
// Une seule animation par section :
//   hero         rien, c'est le premier ecran
//   methode      le trait qui se dessine sous le titre
//   ville        l'apparition
//   ce dimanche  le trait qui se dessine sous le titre
//   planche      l'apparition, en cascade de 60 ms
//   note         l'apparition
//   guide        l'apparition
export default function Accueil() {
  return (
    <main>
      <Hero />

      <Methode />

      <VilleDuMoment />

      <CeDimanche />

      <Planche />

      {/* La note en marge se pose juste sous les photos : un mot rapide sur la
          destination du moment, comme griffonne a cote des tirages. */}
      <NoteEnMarge />

      <Reveal>
        <GuideGratuit />
      </Reveal>
    </main>
  );
}
