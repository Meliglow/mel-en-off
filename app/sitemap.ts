import type { MetadataRoute } from "next";

// Plan du site pour Google : uniquement les pages publiques de melnourdi.fr.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://melnourdi.fr";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/logiciel-reservation`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/kit-avis-google`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
    { url: `${base}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
  ];
}
