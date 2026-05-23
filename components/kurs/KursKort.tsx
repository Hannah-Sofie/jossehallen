import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Tag } from "lucide-react";

import type { KursOffentlig } from "@/types/database";
import { plassStatus, nivaaLabel } from "@/lib/kurs";
import { formatPeriode, formatPris } from "@/lib/format";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { BildeFallback } from "@/components/BildeFallback";
import { PameldingDialog } from "@/components/kurs/PameldingDialog";

export function KursKort({ kurs }: { kurs: KursOffentlig }) {
  const status = plassStatus(kurs.ledige_plasser, kurs.maks_deltakere);

  return (
    <Card className="flex flex-col overflow-hidden pt-0">
      <div className="relative aspect-video w-full overflow-hidden">
        {kurs.bilde_url ? (
          <Image
            src={kurs.bilde_url}
            alt={kurs.navn}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <BildeFallback />
        )}
        <Badge className={`${status.badgeClass} absolute right-3 top-3 shadow-sm`}>
          {status.label}
        </Badge>
      </div>

      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{nivaaLabel(kurs.nivaa)}</Badge>
        </div>
        <CardTitle className="mt-1">
          <Link
            href={`/kurs/${kurs.id}`}
            className="transition-colors hover:text-primary"
          >
            {kurs.navn}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" aria-hidden />
          {formatPeriode(kurs.start_dato, kurs.slutt_dato)}
          {kurs.tidspunkt ? ` · ${kurs.tidspunkt}` : ""}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4" aria-hidden />
          {kurs.sted}
        </p>
        <p className="flex items-center gap-2">
          <Tag className="h-4 w-4" aria-hidden />
          {formatPris(kurs.pris)}
        </p>
      </CardContent>

      <CardFooter className="gap-2">
        <Link
          href={`/kurs/${kurs.id}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Les mer
        </Link>
        <PameldingDialog
          kursId={kurs.id}
          kursNavn={kurs.navn}
          fullt={status.fullt}
          trigger={
            <Button size="sm" variant={status.fullt ? "secondary" : "default"}>
              {status.fullt ? "Venteliste" : "Meld på"}
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
