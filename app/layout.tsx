import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Karla, La_Belle_Aurore } from "next/font/google";
import Navigation from "@/components/Navigation";
import PiedDePage from "@/components/PiedDePage";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-karla",
  display: "swap",
});

const belle = La_Belle_Aurore({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-belle",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EN OFF · La lettre du dimanche de Mel Nourdi",
  description:
    "Chaque dimanche, les meilleures et les pires adresses que j'ai testées. Je teste, je note la date, je te dis ce que j'en pense.",
  openGraph: {
    title: "EN OFF",
    description: "La lettre du dimanche de Mel Nourdi. Testé pour de vrai, date à l'appui.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF6EC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${karla.variable} ${belle.variable}`}>
      <head>
        {/* Sans JavaScript, les blocs qui attendent leur entree dans l'ecran
            s'affichent simplement. Rien ne reste invisible. */}
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}.tampon-date{opacity:.82}.trait-trace path{stroke-dashoffset:0}`}</style>
        </noscript>
      </head>
      <body>
        {/* Canevas mobile, dessine a 390px, elargi sur grand ecran */}
        <div className="mx-auto flex min-h-screen w-full max-w-canvas flex-col bg-papier shadow-[0_0_60px_rgba(70,52,30,.06)] md:max-w-large">
          <Navigation />
          <div className="flex-1">{children}</div>
          <PiedDePage />
        </div>
      </body>
    </html>
  );
}
