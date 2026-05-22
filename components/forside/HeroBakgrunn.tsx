"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Eksempelbilder (bytt ut med egne bilder fra hallen senere).
const bilder = [
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1600&q=80",
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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
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
