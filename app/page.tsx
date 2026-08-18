import CeDimanche from "@/components/accueil/CeDimanche";
import GuideGratuit from "@/components/accueil/GuideGratuit";
import Hero from "@/components/accueil/Hero";
import Methode from "@/components/accueil/Methode";
import Planche from "@/components/accueil/Planche";
import Reseaux from "@/components/accueil/Reseaux";
import VilleDuMoment from "@/components/accueil/VilleDuMoment";
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
//   reseaux      le trait qui se dessine sous le titre
//   guide        l'apparition
export default function Accueil() {
  return (
    <main>
      <Hero />

      <Methode />

      <VilleDuMoment />

      <CeDimanche />

      <Planche />

      <Reseaux />

      <Reveal>
        <GuideGratuit />
      </Reveal>
    </main>
  );
}
