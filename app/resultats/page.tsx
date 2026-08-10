import { Suspense } from "react";
import ResultatsClient from "./ResultatsClient";

export const metadata = {
  title: "Le carnet · Mel en off",
  description: "Toutes les adresses testées, filtrables par ville, catégorie et budget.",
};

export default function ResultatsPage() {
  return (
    <Suspense fallback={<div className="px-5 py-10 text-texte2">Chargement du carnet...</div>}>
      <ResultatsClient />
    </Suspense>
  );
}
