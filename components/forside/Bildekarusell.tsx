"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type Bilde = { src: string; alt: string };

// Eksempelbilder (bytt ut med egne via `bilder`-prop / Supabase Storage senere).
const eksempel: Bilde[] = [
  {
    src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    alt: "Hund som leker",
  },
  {
    src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    alt: "Hund i trening",
  },
  {
    src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    alt: "Hunder på tur",
  },
  {
    src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    alt: "Hundetrening",
  },
];

export function Bildekarusell({ bilder }: { bilder?: Bilde[] }) {
  const slides = bilder && bilder.length > 0 ? bilder : eksempel;

  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {slides.map((b, i) => (
          <CarouselItem key={i} className="sm:basis-1/2 lg:basis-1/3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.src}
                alt={b.alt}
                className="h-full w-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
