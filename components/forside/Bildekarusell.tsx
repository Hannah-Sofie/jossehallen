"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type Bilde = { src: string; alt: string };

/**
 * Bildekarusell for hallen/aktiviteter. Send inn `bilder` når de finnes
 * (f.eks. fra Supabase Storage senere). Uten bilder vises plassholdere.
 */
export function Bildekarusell({ bilder = [] }: { bilder?: Bilde[] }) {
  const slides: (Bilde | null)[] = bilder.length > 0 ? bilder : [null, null, null];

  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {slides.map((b, i) => (
          <CarouselItem key={i} className="sm:basis-1/2 lg:basis-1/3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted-foreground/20">
              {b ? (
                <Image
                  src={b.src}
                  alt={b.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8" aria-hidden />
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
