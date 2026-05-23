"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Bilder fra Jossehallen.
const bilder = [
  "/bilder/agility.jpg",
  "/bilder/trening.jpg",
  "/bilder/tur.jpg",
];

export function HeroBakgrunn() {
  const [aktiv, setAktiv] = useState(0);
  const n = bilder.length;

  const gaaTil = useCallback((i: number) => setAktiv(((i % n) + n) % n), [n]);

  useEffect(() => {
    const t = setInterval(() => setAktiv((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {bilder.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          fetchPriority={i === 0 ? "high" : "auto"}
          className={cn(
            "object-cover transition-opacity duration-1000",
            i === aktiv ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />

      {/* Piler */}
      <button
        type="button"
        aria-label="Forrige bilde"
        onClick={() => gaaTil(aktiv - 1)}
        className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/35 sm:left-6"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Neste bilde"
        onClick={() => gaaTil(aktiv + 1)}
        className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/35 sm:right-6"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Prikker */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
        {bilder.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Gå til bilde ${i + 1}`}
            onClick={() => gaaTil(i)}
            className={cn(
              "h-2.5 rounded-full transition-all",
              i === aktiv ? "w-7 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </div>
  );
}
