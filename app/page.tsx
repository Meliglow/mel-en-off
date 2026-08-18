import CeDimanche from "@/components/accueil/CeDimanche";
import GuideGratuit from "@/components/accueil/GuideGratuit";
import Hero from "@/components/accueil/Hero";
import Methode from "@/components/accueil/Methode";
import VilleDuMoment from "@/components/accueil/VilleDuMoment";
import Reveal from "@/components/Reveal";

// La page d'accueil n'a qu'un seul travail : collecter des emails pour EN OFF.
// Le hero vend la lettre, le bloc de fin vend le guide, rien d'autre.
export default function Accueil() {
  return (
    <main>
      <Hero />
      <Reveal>
        <Methode />
      </Reveal>
      <Reveal>
        <VilleDuMoment />
      </Reveal>
      <Reveal>
        <CeDimanche />
      </Reveal>
      <Reveal>
        <GuideGratuit />
      </Reveal>
    </main>
  );
}
