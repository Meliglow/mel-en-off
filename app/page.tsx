import CarrouselCoupsDeCoeur from "@/components/CarrouselCoupsDeCoeur";
import CtaSocial from "@/components/CtaSocial";
import EcranRecherche from "@/components/EcranRecherche";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import PiedDePage from "@/components/PiedDePage";
import Reveal from "@/components/Reveal";
import { LIEUX } from "@/lib/data";

export default function Accueil() {
  return (
    <main>
      <Hero />
      <Reveal>
        <CarrouselCoupsDeCoeur lieux={LIEUX} />
      </Reveal>
      <Reveal>
        <EcranRecherche />
      </Reveal>
      <Reveal>
        <CtaSocial />
      </Reveal>
      <Reveal>
        <Newsletter />
      </Reveal>
      <PiedDePage page={1} />
    </main>
  );
}
