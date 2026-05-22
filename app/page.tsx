import Link from "next/link";
import { GraduationCap, CalendarDays, Dumbbell, ArrowRight, PawPrint } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { hentAktiveKurs } from "@/lib/kurs";
import { KursKort } from "@/components/kurs/KursKort";
import { Bildekarusell } from "@/components/forside/Bildekarusell";
import { Faq } from "@/components/forside/Faq";
import { HeroBakgrunn } from "@/components/forside/HeroBakgrunn";

export default async function Home() {
  const kommendeKurs = (await hentAktiveKurs()).slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b">
        <HeroBakgrunn />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-28 text-center sm:px-6 sm:py-36 md:py-44">
          <div className="mx-auto max-w-3xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <PawPrint className="h-4 w-4" />
              Innendørs hundehall i Moelv
            </span>
            <h1 className="font-brand mt-6 text-5xl font-bold leading-[1.05] tracking-tight drop-shadow-sm sm:text-6xl md:text-7xl">
              Trening, kurs og lek{" "}
              <span className="text-primary-foreground underline decoration-primary decoration-4 underline-offset-8">
                hele året
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-xl leading-relaxed text-white/95">
              Jossehallen tilbyr kurs og treninger for hund og eier, og utleie av
              hallen til egen trening. Velkommen innom!
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/kurs"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-full px-8 text-base",
                )}
              >
                Se kurs og treninger <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/leie"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 rounded-full border-white bg-white/10 px-8 text-base text-white backdrop-blur hover:bg-white/20 hover:text-white",
                )}
              >
                Leie hall
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-brand text-3xl font-bold tracking-tight sm:text-4xl">
                Om Jossehallen
              </h2>
              <p className="mt-4 text-muted-foreground">
                Jossehallen er en innendørs hundehall som drives av lokale
                entusiaster i Moelv. Hallen er et samlingssted for kurs,
                trening og hyggelig lek — uavhengig av vær og årstid.
              </p>
              <p className="mt-4 text-muted-foreground">
                For spørsmål om kurs, leie eller hallen generelt, ta gjerne
                kontakt via{" "}
                <Link
                  href="/kontakt"
                  className="font-medium text-foreground hover:underline"
                >
                  kontaktsiden
                </Link>
                .
              </p>
              <Link
                href="/om"
                className={cn(buttonVariants({ variant: "outline" }), "mt-6 rounded-full")}
              >
                Les mer om hallen
              </Link>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=900&q=80"
              alt="Hund i aktivitet"
              className="aspect-video w-full rounded-3xl object-cover shadow-sm"
            />
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-brand text-3xl font-bold tracking-tight sm:text-4xl">
            Hva vi tilbyr
          </h2>
          <p className="mt-4 text-muted-foreground">
            Et trygt, tørt og opplyst sted for trening, kurs og lek — uansett vær.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: GraduationCap,
              tittel: "Kurs",
              tekst:
                "Hverdagslydighet, valpekurs, agility og mer. Små grupper med erfarne instruktører.",
              lenke: "/kurs",
              lenketekst: "Se påmelding",
              farge: "bg-primary/10 text-primary",
            },
            {
              icon: CalendarDays,
              tittel: "Leie hall",
              tekst:
                "Hallen kan leies til egen trening, lek eller klubbaktivitet. Reserver en ledig tid.",
              lenke: "/leie",
              lenketekst: "Se ledige tider",
              farge: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
            },
            {
              icon: Dumbbell,
              tittel: "Trening",
              tekst:
                "Velutstyrt hall med hindringsbane, mykt underlag og god plass — uansett årstid.",
              lenke: "/kontakt",
              lenketekst: "Kontakt oss",
              farge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            },
          ].map((k) => (
            <Card
              key={k.tittel}
              className="rounded-3xl transition-transform hover:-translate-y-1"
            >
              <CardHeader>
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl",
                    k.farge,
                  )}
                >
                  <k.icon className="h-7 w-7" aria-hidden />
                </div>
                <CardTitle className="mt-4 text-xl">{k.tittel}</CardTitle>
                <CardDescription>{k.tekst}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={k.lenke}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  {k.lenketekst} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      </section>

      {kommendeKurs.length > 0 ? (
        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-brand text-3xl font-bold tracking-tight sm:text-4xl">
                  Kommende kurs
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Meld deg på et av våre kurs.
                </p>
              </div>
              <Link
                href="/kurs"
                className="hidden shrink-0 items-center text-sm font-medium hover:underline sm:inline-flex"
              >
                Se alle kurs <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {kommendeKurs.map((k) => (
                <KursKort key={k.id} kurs={k} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/kurs"
                className={buttonVariants({ variant: "outline" })}
              >
                Se alle kurs
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-brand text-3xl font-bold tracking-tight sm:text-4xl">
              Fra hallen
            </h2>
            <p className="mt-4 text-muted-foreground">
              Et lite innblikk i trening, kurs og lek hos oss.
            </p>
          </div>
          <div className="mt-10 px-10">
            <Bildekarusell />
          </div>
        </div>
      </section>

      <Faq />
    </>
  );
}
