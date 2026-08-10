import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Karla, La_Belle_Aurore } from "next/font/google";
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
  title: "Mel en off · Le carnet d'adresses de Mel Nourdi",
  description:
    "Je teste, je trie, je vous dis tout. Restaurants, spas, hôtels et activités testés pour de vrai, et les adresses à éviter, ville par ville.",
  openGraph: {
    title: "Mel en off",
    description: "Le carnet d'adresses de voyage de Mel Nourdi. Testé pour de vrai.",
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
      <body>
        {/* Canevas mobile, dessine a 390px, elargi sur grand ecran */}
        <div className="mx-auto min-h-screen w-full max-w-canvas bg-papier shadow-[0_0_60px_rgba(70,52,30,.06)] md:max-w-large">
          {children}
        </div>
      </body>
    </html>
  );
}
