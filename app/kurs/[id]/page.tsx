import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Tag, Users, GraduationCap } from "lucide-react";

import { hentKurs, hentInstruktor, plassStatus, nivaaLabel } from "@/lib/kurs";
import { formatPeriode, formatPris } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PameldingDialog } from "@/components/kurs/PameldingDialog";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const kurs = await hentKurs(id);
  if (!kurs) return { title: "Kurs ikke funnet" };
  return {
    title: kurs.navn,
    description: kurs.beskrivelse || `Kurs i Jossehallen: ${kurs.navn}`,
  };
}

export default async function KursDetalj({ params }: Params) {
  const { id } = await params;
  const kurs = await hentKurs(id);
  if (!kurs || !kurs.aktiv) notFound();

  const instruktor = await hentInstruktor(kurs.instruktor_id);
  const status = plassStatus(kurs.ledige_plasser);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-muted-foreground" aria-label="Brødsmuler">
        <Link href="/" className="hover:text-foreground">
          Hjem
        </Link>
        {" / "}
        <Link href="/kurs" className="hover:text-foreground">
          Kurs
        </Link>
        {" / "}
        <span className="text-foreground">{kurs.navn}</span>
      </nav>

      {/* Hero */}
      <div className="relative mt-6 aspect-[2/1] w-full overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted-foreground/20">
        {kurs.bilde_url ? (
          <Image
            src={kurs.bilde_url}
            alt={kurs.navn}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        ) : null}
        <Badge variant={status.variant} className="absolute right-4 top-4 shadow-sm">
          {status.label}
        </Badge>
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="secondary">{nivaaLabel(kurs.nivaa)}</Badge>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {kurs.navn}
          </h1>
        </div>
        <PameldingDialog
          kursId={kurs.id}
          kursNavn={kurs.navn}
          fullt={status.fullt}
          trigger={
            <Button size="lg" variant={status.fullt ? "secondary" : "default"}>
              {status.fullt ? "Sett på venteliste" : "Meld på"}
            </Button>
          }
        />
      </div>

      {/* Fakta */}
      <dl className="mt-8 grid gap-4 rounded-lg border bg-muted/30 p-5 sm:grid-cols-2">
        <Fakta icon={<CalendarDays className="h-4 w-4" />} label="Når">
          {formatPeriode(kurs.start_dato, kurs.slutt_dato)}
          {kurs.tidspunkt ? ` · ${kurs.tidspunkt}` : ""}
        </Fakta>
        <Fakta icon={<MapPin className="h-4 w-4" />} label="Sted">
          {kurs.sted}
        </Fakta>
        <Fakta icon={<Tag className="h-4 w-4" />} label="Pris">
          {formatPris(kurs.pris)}
        </Fakta>
        <Fakta icon={<Users className="h-4 w-4" />} label="Plasser">
          {status.fullt
            ? "Fullt (venteliste)"
            : `${kurs.ledige_plasser} av ${kurs.maks_deltakere} ledige`}
        </Fakta>
      </dl>

      {/* Beskrivelse */}
      {kurs.beskrivelse ? (
        <Seksjon tittel="Om kurset">
          <p className="whitespace-pre-line">{kurs.beskrivelse}</p>
        </Seksjon>
      ) : null}

      {kurs.hva_laerer ? (
        <Seksjon tittel="Hva du lærer">
          <p className="whitespace-pre-line">{kurs.hva_laerer}</p>
        </Seksjon>
      ) : null}

      {kurs.ta_med ? (
        <Seksjon tittel="Ta med">
          <p className="whitespace-pre-line">{kurs.ta_med}</p>
        </Seksjon>
      ) : null}

      {/* Instruktør */}
      {instruktor ? (
        <Seksjon tittel="Instruktør">
          <div className="flex gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-muted">
              {instruktor.bilde_url ? (
                <Image
                  src={instruktor.bilde_url}
                  alt={instruktor.navn}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <GraduationCap className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">{instruktor.navn}</p>
              {instruktor.bio ? (
                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                  {instruktor.bio}
                </p>
              ) : null}
            </div>
          </div>
        </Seksjon>
      ) : null}

      {/* CTA nederst */}
      <div className="mt-10 flex justify-center border-t pt-8">
        <PameldingDialog
          kursId={kurs.id}
          kursNavn={kurs.navn}
          fullt={status.fullt}
          trigger={
            <Button size="lg" variant={status.fullt ? "secondary" : "default"}>
              {status.fullt ? "Sett på venteliste" : "Meld på kurset"}
            </Button>
          }
        />
      </div>
    </div>
  );
}

function Fakta({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-medium">{children}</dd>
      </div>
    </div>
  );
}

function Seksjon({
  tittel,
  children,
}: {
  tittel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">{tittel}</h2>
      <div className="mt-3 text-muted-foreground">{children}</div>
    </section>
  );
}
