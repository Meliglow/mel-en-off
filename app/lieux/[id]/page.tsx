import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLieu, LIEUX } from "@/lib/data";
import FicheClient from "./FicheClient";

export function generateStaticParams() {
  return LIEUX.map((l) => ({ id: l.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const lieu = getLieu(params.id);
  if (!lieu) return { title: "Lieu introuvable · Mel en off" };
  return {
    title: `${lieu.name}, ${lieu.city} · Mel en off`,
    description: lieu.accroche || lieu.note.slice(0, 140),
  };
}

export default function FichePage({ params }: { params: { id: string } }) {
  const lieu = getLieu(params.id);
  if (!lieu) notFound();

  const similaires = LIEUX.filter((l) => l.city === lieu.city && l.id !== lieu.id).slice(0, 2);

  return <FicheClient lieu={lieu} similaires={similaires} />;
}
