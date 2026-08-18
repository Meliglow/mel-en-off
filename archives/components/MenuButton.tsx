"use client";

import Link from "next/link";
import { useState } from "react";

const LIENS = [
  { href: "/resultats", label: "Le carnet" },
  { href: "/#coups", label: "Mes coups de cœur" },
  { href: "/collab", label: "Collaborations" },
  { href: "/#lettre", label: "La lettre du mois" },
];

export default function MenuButton() {
  const [ouvert, setOuvert] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn-rond"
        aria-label="Ouvrir le menu"
        aria-expanded={ouvert}
        onClick={() => setOuvert(true)}
      >
        <span aria-hidden className="flex flex-col gap-[4px]">
          <span className="block h-[2px] w-[18px] bg-encre" />
          <span className="block h-[2px] w-[18px] bg-encre" />
          <span className="block h-[2px] w-[18px] bg-encre" />
        </span>
      </button>

      {ouvert && (
        <div className="fixed inset-0 z-50 flex justify-center bg-encre/40 px-5 py-6" onClick={() => setOuvert(false)}>
          <nav
            className="carte h-fit w-full max-w-canvas p-5"
            onClick={(e) => e.stopPropagation()}
            aria-label="Navigation principale"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-serif text-[22px] text-encre">Mel en off</span>
              <button
                type="button"
                className="btn-rond"
                aria-label="Fermer le menu"
                onClick={() => setOuvert(false)}
              >
                <span aria-hidden className="text-lg leading-none">
                  ✕
                </span>
              </button>
            </div>
            <div className="filets mb-2" aria-hidden />
            <ul className="flex flex-col">
              {LIENS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex min-h-[52px] items-center justify-between border-b border-bord text-[17px] text-texte"
                    onClick={() => setOuvert(false)}
                  >
                    {l.label}
                    <span aria-hidden className="text-terracotta">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
