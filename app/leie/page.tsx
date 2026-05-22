import type { Metadata } from "next";
import Link from "next/link";
import { CalendarOff, Lock } from "lucide-react";

import { hentKommendeTider } from "@/lib/leie";
import { hentBruker } from "@/lib/auth";
import { leiePris } from "@/lib/betaling";
import { formatDatoLang, formatPris } from "@/lib/format";
import { Button, buttonVariants } from "@/components/ui/button";
import { BookingDialog } from "@/components/leie/BookingDialog";

export const metadata: Metadata = {
  title: "Leie hall",
  description:
    "Book halltid i Jossehallen. Se ledige tider og reserver en time til egen trening.",
};

export default async function LeiePage() {
  const [dager, auth] = await Promise.all([hentKommendeTider(), hentBruker()]);
  const pris = leiePris();

  const profil = auth
    ? {
        fornavn: auth.profil.fornavn,
        etternavn: auth.profil.etternavn,
        telefon: auth.profil.telefon,
        epost: auth.user.email ?? "",
      }
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">Leie hall</h1>
        <p className="mt-4 text-muted-foreground">
          Reserver en time i hallen til egen trening eller lek.
          {pris > 0 ? ` Pris: ${formatPris(pris)} per time.` : ""}
        </p>
        {!auth ? (
          <div className="mt-6 flex items-center gap-3 rounded-lg border bg-muted/40 p-4 text-sm">
            <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              Du må{" "}
              <Link href="/login?retur=/leie" className="font-medium underline">
                logge inn
              </Link>{" "}
              for å booke. PIN-koden til døren vises på Min side.
            </span>
          </div>
        ) : null}
      </div>

      {dager.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-lg border border-dashed py-16 text-center">
          <CalendarOff className="h-10 w-10 text-muted-foreground" aria-hidden />
          <h2 className="mt-4 text-lg font-medium">Ingen ledige tider akkurat nå</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Det er ikke lagt ut tider ennå. Kom tilbake senere, eller ta kontakt.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {dager.map((dag) => (
            <section key={dag.dato}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {formatDatoLang(dag.dato)}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {dag.tider.map((t) => {
                  const label = `${t.start_tid.slice(0, 5)}–${t.slutt_tid.slice(0, 5)}`;
                  const fullLabel = `${formatDatoLang(dag.dato)}, kl ${label}`;

                  if (!t.ledig) {
                    return (
                      <span
                        key={t.id}
                        className="inline-flex items-center rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground line-through"
                      >
                        {label}
                      </span>
                    );
                  }

                  if (!profil) {
                    return (
                      <Link
                        key={t.id}
                        href="/login?retur=/leie"
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        {label}
                      </Link>
                    );
                  }

                  return (
                    <BookingDialog
                      key={t.id}
                      tidId={t.id}
                      tidLabel={fullLabel}
                      profil={profil}
                      trigger={
                        <Button variant="outline" size="sm">
                          {label}
                        </Button>
                      }
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
