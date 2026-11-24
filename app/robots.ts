import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/guide-gratuit", "/administration-reservations", "/configurer-reservation", "/stats"] }],
    sitemap: "https://melnourdi.fr/sitemap.xml",
  };
}
