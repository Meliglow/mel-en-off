/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Aucune optimisation d'image a la volee : c'est le poste qui fait exploser
  // la facture sur ce genre de site. Les photos sont pre-compressees par
  // npm run optimiser-images et servies telles quelles, en statique.
  images: { unoptimized: true },

  // Redirections des anciennes adresses. Elles sont traitees par le routage de
  // l'hebergeur, sans middleware ni fonction edge.
  async redirects() {
    return [
      { source: "/collab", destination: "/collaborations", permanent: true },
      { source: "/resultats", destination: "/", permanent: true },
      { source: "/lieux/:id", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
