"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type Bilde = { src: string; alt: string };

// Bilder fra Jossehallen (bytt ut / suppler via `bilder`-prop senere).
const eksempel: Bilde[] = [
  { src: "/bilder/hall-utvendig.jpg", alt: "Jossehallen sett utenfra" },
  { src: "/bilder/hall-innvendig.jpg", alt: "Innvendig oversikt over hallen" },
  { src: "/bilder/agility-bane.jpg", alt: "Agility-bane satt opp på kunstgresset" },
  { src: "/bilder/agility.jpg", alt: "Hund hopper hinder under agility i hallen" },
  { src: "/bilder/trening.jpg", alt: "Gruppetrening med hunder på kunstgresset" },
  { src: "/bilder/i-hallen.jpg", alt: "I den åpne treningshallen" },
  { src: "/bilder/sosial-sone.jpg", alt: "Sosial sone inne i hallen" },
  { src: "/bilder/tur.jpg", alt: "Hundetur i skogen om våren" },
];

export function Bildekarusell({ bilder }: { bilder?: Bilde[] }) {
  const slides = bilder && bilder.length > 0 ? bilder : eksempel;

  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {slides.map((b, i) => (
          <CarouselItem key={i} className="sm:basis-1/2 lg:basis-1/3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
              <Image
                src={b.src}
                alt={b.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
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
