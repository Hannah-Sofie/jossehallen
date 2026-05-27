import type { Metadata } from "next";
import Link from "next/link";
import { CalendarOff, Lock, PawPrint } from "lucide-react";

import { hentKommendeTider } from "@/lib/leie";
import { hentBruker } from "@/lib/auth";
import { leiePris } from "@/lib/betaling";
import { formatPris } from "@/lib/format";
import { LeieKalender } from "@/components/leie/LeieKalender";

export const metadata: Metadata = {
  title: "Leie hall",
  description:
    "Book halltid i Jossehallen. Se ledige tider i kalenderen og reserver en time til egen trening.",
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
    <div className="relative overflow-hidden">
      <PawPrint
        aria-hidden
        className="pointer-events-none absolute -right-6 top-20 h-28 w-28 rotate-12 text-primary/10"
      />
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="font-medium text-primary">Leie hall</p>
          <h1 className="mt-2 font-brand text-4xl font-bold tracking-tight sm:text-5xl">
            Book halltid
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Reserver en time i hallen til egen trening eller lek.
            {pris > 0 ? ` Pris: ${formatPris(pris)} per time.` : ""}
          </p>
          {!auth ? (
            <div className="mt-6 flex items-center gap-3 rounded-xl border bg-muted/40 p-4 text-sm">
              <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>
                Du må{" "}
                <Link
                  href="/login?retur=/leie"
                  className="font-medium text-foreground underline"
                >
                  logge inn
                </Link>{" "}
                for å booke.
              </span>
            </div>
          ) : null}
        </div>

        {dager.length === 0 ? (
          <div className="mt-12 flex flex-col items-center rounded-3xl border border-dashed py-16 text-center">
            <CalendarOff className="h-10 w-10 text-muted-foreground" aria-hidden />
            <h2 className="mt-4 text-lg font-medium">
              Ingen ledige tider akkurat nå
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Det er ikke lagt ut tider ennå. Kom tilbake senere, eller ta
              kontakt.
            </p>
          </div>
        ) : (
          <div className="mt-10">
            <LeieKalender dager={dager} profil={profil} />
          </div>
        )}
      </div>
    </div>
  );
}
