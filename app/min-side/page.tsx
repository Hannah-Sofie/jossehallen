import type { Metadata } from "next";
import { GraduationCap, CalendarDays, KeyRound } from "lucide-react";
import { krevInnlogget } from "@/lib/auth";
import { hentMinePaameldinger, hentMineBookinger } from "@/lib/minside";
import { formatDato, formatDatoLang } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import type { PaameldingStatus, BookingStatus } from "@/types/database";

export const metadata: Metadata = { title: "Min side", robots: { index: false } };

const STATUS: Record<
  PaameldingStatus | BookingStatus,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  venter_betaling: { label: "Venter betaling", variant: "secondary" },
  bekreftet: { label: "Bekreftet", variant: "default" },
  venteliste: { label: "Venteliste", variant: "secondary" },
  avbrutt: { label: "Avbrutt", variant: "destructive" },
};

export default async function MinSide() {
  const { profil } = await krevInnlogget();
  const [paameldinger, bookinger] = await Promise.all([
    hentMinePaameldinger(),
    hentMineBookinger(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Min side</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Hei, {profil.fornavn || "der"}!
      </p>

      {/* Kurspåmeldinger */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <GraduationCap className="h-5 w-5" /> Mine kurspåmeldinger
        </h2>
        {paameldinger.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Du har ingen kurspåmeldinger ennå.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {paameldinger.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{p.kursNavn}</p>
                  <p className="text-sm text-muted-foreground">
                    Hund: {p.hund_navn} · meldt på {formatDato(p.opprettet)}
                  </p>
                </div>
                <Badge variant={STATUS[p.status].variant}>
                  {STATUS[p.status].label}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bookinger */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <CalendarDays className="h-5 w-5" /> Mine hall-bookinger
        </h2>
        {bookinger.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Du har ingen bookinger ennå.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {bookinger.map((b) => (
              <li key={b.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {b.dato ? formatDatoLang(b.dato) : "—"}
                      {b.start_tid
                        ? ` · ${b.start_tid.slice(0, 5)}–${b.slutt_tid?.slice(0, 5)}`
                        : ""}
                    </p>
                    {b.formaal ? (
                      <p className="text-sm text-muted-foreground">{b.formaal}</p>
                    ) : null}
                  </div>
                  <Badge variant={STATUS[b.status].variant}>
                    {STATUS[b.status].label}
                  </Badge>
                </div>
                {b.pin ? (
                  <div className="mt-3 flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm">
                    <KeyRound className="h-4 w-4 text-primary" />
                    <span>
                      PIN-kode til døren: <strong className="font-mono">{b.pin}</strong>
                    </span>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Avbestilling */}
      <section className="mt-10 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Må du avbestille?</p>
        <p className="mt-1">
          Ta kontakt med oss på{" "}
          <a href="/kontakt" className="underline">
            kontaktsiden
          </a>{" "}
          i god tid før kurset eller bookingen, så ordner vi avbestillingen for deg.
        </p>
      </section>
    </div>
  );
}
