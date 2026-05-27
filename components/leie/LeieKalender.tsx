"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays, GraduationCap } from "lucide-react";

import type { DagMedTider } from "@/lib/leie";
import { formatDatoLang } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { BookingDialog } from "@/components/leie/BookingDialog";

type Profil = {
  fornavn: string;
  etternavn: string;
  telefon: string;
  epost: string;
};

const UKEDAGER = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export function LeieKalender({
  dager,
  profil,
}: {
  dager: DagMedTider[];
  profil: Profil | null;
}) {
  const datoMap = useMemo(
    () => new Map(dager.map((d) => [d.dato, d.slots])),
    [dager],
  );

  // Start på første dag med ledig tid (ellers første dag med tider, ellers i dag).
  const førsteLedige =
    dager.find((d) => d.slots.some((s) => s.type === "ledig")) ?? dager[0];
  const startDato = førsteLedige ? parseISO(førsteLedige.dato) : new Date();

  const [visMåned, setVisMåned] = useState(() => startOfMonth(startDato));
  const [valgtDato, setValgtDato] = useState<string | null>(
    førsteLedige?.dato ?? null,
  );

  const rutenett = useMemo(() => {
    const start = startOfWeek(startOfMonth(visMåned), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(visMåned), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [visMåned]);

  const kanGåTilbake = !isSameMonth(visMåned, startOfMonth(new Date()))
    ? visMåned > startOfMonth(new Date())
    : false;

  const valgteSlots = valgtDato ? (datoMap.get(valgtDato) ?? []) : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      {/* Kalender */}
      <div className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-brand text-xl font-bold capitalize tracking-tight">
            {format(visMåned, "LLLL yyyy", { locale: nb })}
          </h2>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Forrige måned"
              disabled={!kanGåTilbake}
              onClick={() => setVisMåned((m) => addMonths(m, -1))}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Neste måned"
              onClick={() => setVisMåned((m) => addMonths(m, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1">
          {UKEDAGER.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}

          {rutenett.map((dag) => {
            const iso = format(dag, "yyyy-MM-dd");
            const slots = datoMap.get(iso) ?? [];
            const harLedig = slots.some((s) => s.type === "ledig");
            const harSlots = slots.length > 0;
            const iMåned = isSameMonth(dag, visMåned);
            const erValgt = iso === valgtDato;
            const erIdag = isToday(dag);

            return (
              <button
                key={iso}
                type="button"
                disabled={!harSlots}
                aria-label={formatDatoLang(iso)}
                aria-pressed={erValgt}
                onClick={() => setValgtDato(iso)}
                className={cn(
                  "relative flex aspect-square items-center justify-center rounded-xl text-sm transition-colors",
                  !iMåned && "text-muted-foreground/40",
                  erValgt
                    ? "bg-primary font-semibold text-primary-foreground"
                    : harLedig
                      ? "bg-primary/10 font-medium text-foreground hover:bg-primary/20"
                      : harSlots
                        ? "text-foreground hover:bg-muted"
                        : "cursor-default text-muted-foreground/50",
                  erIdag && !erValgt && "ring-1 ring-primary/50",
                )}
              >
                {format(dag, "d")}
                {harLedig && !erValgt ? (
                  <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Tegnforklaring */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Ledige tider
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full ring-1 ring-primary/50" /> I dag
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" /> Ingen tider
          </span>
        </div>
      </div>

      {/* Dagspanel */}
      <div className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6">
        {valgtDato ? (
          <>
            <p className="font-medium text-primary">Ledige tider</p>
            <h3 className="mt-1 font-brand text-lg font-bold tracking-tight first-letter:uppercase">
              {formatDatoLang(valgtDato)}
            </h3>
            <div className="mt-5 space-y-2">
              {valgteSlots.map((s) => {
                const label = `${s.start_tid.slice(0, 5)}–${s.slutt_tid.slice(0, 5)}`;

                if (s.type === "kurs") {
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground"
                    >
                      <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                      <span className="font-medium text-foreground">{label}</span>
                      <span className="ml-auto">{s.kursNavn}</span>
                    </div>
                  );
                }

                if (s.type === "booket") {
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground"
                    >
                      <span className="font-medium line-through">{label}</span>
                      <span className="ml-auto">Opptatt</span>
                    </div>
                  );
                }

                // Ledig
                if (!profil) {
                  return (
                    <Link
                      key={s.id}
                      href="/login?retur=/leie"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-between rounded-xl",
                      )}
                    >
                      <span className="font-medium">{label}</span>
                      <span className="text-muted-foreground">Logg inn</span>
                    </Link>
                  );
                }

                return (
                  <BookingDialog
                    key={s.id}
                    tidId={s.id}
                    tidLabel={`${formatDatoLang(valgtDato)}, kl ${label}`}
                    profil={profil}
                    trigger={
                      <Button
                        variant="outline"
                        className="w-full justify-between rounded-xl"
                      >
                        <span className="font-medium">{label}</span>
                        <span className="text-primary">Book →</span>
                      </Button>
                    }
                  />
                );
              })}

              {valgteSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Ingen tider denne dagen.
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            <CalendarDays className="h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm text-muted-foreground">
              Velg en dag i kalenderen for å se ledige tider.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
