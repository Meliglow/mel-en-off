import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Point de bascule propre au carnet : au-dela, le portrait du hero passe
      // a droite du texte. En dessous, il reste au-dessus.
      screens: {
        carnet: "900px",
      },
      colors: {
        papier: "#FBF6EC",
        carte: "#FFFDFA",
        sable: "#F6EFE5",
        bord: "#E9DDCC",
        bord2: "#DCC9AC",
        terracotta: "#C0755A",
        vert: "#23483C",
        brique: "#A34F3C",
        dore: "#E3CFA8",
        dore2: "#8C6A3F",
        encre: "#241E1A",
        texte: "#4A403A",
        texte2: "#8C7F73",
        texte3: "#9C8768",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-karla)", "system-ui", "sans-serif"],
        main: ["var(--font-belle)", "cursive"],
      },
      borderRadius: {
        carte: "20px",
        champ: "16px",
      },
      boxShadow: {
        douce: "0 8px 20px rgba(70,52,30,.05)",
        tirage: "0 10px 24px rgba(70,52,30,.14)",
      },
      maxWidth: {
        canvas: "440px",
        large: "760px",
      },
    },
  },
  plugins: [],
};

export default config;
