"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Eksempelbilder (bytt ut med egne bilder fra hallen senere).
const bilder = [
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1600&q=80",
];

export function HeroBakgrunn() {
  const [aktiv, setAktiv] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setAktiv((p) => (p + 1) % bilder.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {bilder.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            i === aktiv ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      {/* Mørk overlay så teksten blir lesbar */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />
    </div>
  );
}
