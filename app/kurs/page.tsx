import type { Metadata } from "next";
import Link from "next/link";
import { CalendarOff } from "lucide-react";

import { hentAktiveKurs } from "@/lib/kurs";
import { KursKort } from "@/components/kurs/KursKort";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Kurs",
  description:
    "Kurs for hund og eier i Jossehallen — valpekurs, lydighet, agility og mer. Meld deg på.",
};

export default async function KursPage() {
  const kurs = await hentAktiveKurs();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">Kurs</h1>
        <p className="mt-4 text-muted-foreground">
          Jossehallen tilbyr kurs for hund og eier i alle nivåer. Meld deg på
          under — har du spørsmål, ta kontakt.
        </p>
      </div>

      {kurs.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-lg border border-dashed py-16 text-center">
          <CalendarOff className="h-10 w-10 text-muted-foreground" aria-hidden />
          <h2 className="mt-4 text-lg font-medium">Ingen kurs ute akkurat nå</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Vi planlegger nye kurs. Kom tilbake snart, eller ta kontakt så gir
            vi deg beskjed når noe nytt legges ut.
          </p>
          <Link
            href="/kontakt"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Kontakt oss
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kurs.map((k) => (
            <KursKort key={k.id} kurs={k} />
          ))}
        </div>
      )}
    </div>
  );
}
