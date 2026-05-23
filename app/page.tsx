import Link from "next/link";
import Image from "next/image";
import { GraduationCap, CalendarDays, Dumbbell, ArrowRight, PawPrint } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { hentAktiveKurs } from "@/lib/kurs";
import { KursKort } from "@/components/kurs/KursKort";
import { Bildekarusell } from "@/components/forside/Bildekarusell";
import { Testimonials } from "@/components/forside/Testimonials";
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
            <h1 className="font-brand text-5xl font-bold leading-[1.05] tracking-tight drop-shadow-sm sm:text-7xl md:text-8xl">
              Trening, kurs og lek{" "}
              <span className="underline decoration-primary decoration-[6px] underline-offset-[10px]">
                hele året
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-2xl leading-relaxed text-white/95">
              Jossehallen er en innendørs hundehall i Moelv. Vi tilbyr kurs og
              treninger for hund og eier, og utleie av hallen til egen trening —
              velkommen innom!
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
              <p className="font-medium text-primary">Hvem vi er</p>
              <h2 className="mt-2 font-brand text-3xl font-bold tracking-tight sm:text-4xl">
                Om Jossehallen
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Jossehallen er en innendørs hundehall i Moelv, drevet av lokale
                hundeentusiaster. Hos oss kan du gå på kurs, trene eller leie
                hallen til egen aktivitet — på mykt kunstgress, tørt og opplyst,
                uansett vær og årstid.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Har du spørsmål om kurs, leie eller hallen generelt? Ta gjerne
                kontakt via{" "}
                <Link
                  href="/kontakt"
                  className="font-medium text-foreground hover:underline"
                >
                  kontaktsiden
                </Link>
                .
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Vil du vite mer om utstyr, regler og hvordan hallen fungerer? Les
                mer på{" "}
                <Link
                  href="/om"
                  className="font-medium text-foreground hover:underline"
                >
                  Om oss
                </Link>
                .
              </p>
            </div>
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 translate-x-4 translate-y-4 rounded-tl-[3.5rem] rounded-tr-xl rounded-br-[3.5rem] rounded-bl-xl bg-primary/15"
              />
              <div className="relative aspect-video w-full overflow-hidden rounded-tl-[3.5rem] rounded-tr-xl rounded-br-[3.5rem] rounded-bl-xl shadow-sm">
                <Image
                  src="/bilder/hall-utvendig.jpg"
                  alt="Jossehallen sett utenfra"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t bg-primary/5">
        <PawPrint
          aria-hidden
          className="pointer-events-none absolute -left-6 top-12 h-28 w-28 -rotate-12 text-primary/10"
        />
        <PawPrint
          aria-hidden
          className="pointer-events-none absolute -right-4 bottom-10 h-20 w-20 rotate-12 text-primary/10"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-medium text-primary">Tjenester</p>
          <h2 className="mt-2 font-brand text-3xl font-bold tracking-tight sm:text-4xl">
            Hva vi tilbyr
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
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
              farge: "bg-primary/20 text-primary",
              kortFarge: "bg-primary/10",
            },
            {
              icon: CalendarDays,
              tittel: "Leie hall",
              tekst:
                "Hallen kan leies til egen trening, lek eller klubbaktivitet. Reserver en ledig tid.",
              lenke: "/leie",
              lenketekst: "Se ledige tider",
              farge: "bg-sky-500/20 text-sky-600 dark:text-sky-400",
              kortFarge: "bg-sky-500/10",
            },
            {
              icon: Dumbbell,
              tittel: "Trening",
              tekst:
                "Velutstyrt hall med hindringsbane, mykt underlag og god plass — uansett årstid.",
              lenke: "/kontakt",
              lenketekst: "Kontakt oss",
              farge: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
              kortFarge: "bg-emerald-500/10",
            },
          ].map((k) => (
            <Card
              key={k.tittel}
              className={cn(
                "gap-6 rounded-3xl py-8 ring-0 transition-transform hover:-translate-y-1",
                k.kortFarge,
              )}
            >
              <CardHeader className="gap-3 px-8">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl",
                    k.farge,
                  )}
                >
                  <k.icon className="h-7 w-7" aria-hidden />
                </div>
                <CardTitle className="mt-4 text-xl">{k.tittel}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {k.tekst}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8">
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
                <p className="font-medium text-primary">Kurs</p>
                <h2 className="mt-2 font-brand text-3xl font-bold tracking-tight sm:text-4xl">
                  Kommende kurs
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
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

      <section className="relative overflow-hidden border-t bg-muted/30">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-16 h-56 w-56 rounded-full bg-primary/5"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-medium text-primary">Galleri</p>
            <h2 className="mt-2 font-brand text-3xl font-bold tracking-tight sm:text-4xl">
              Fra hallen
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Et lite innblikk i trening, kurs og lek hos oss.
            </p>
          </div>
          <div className="mt-10 px-10">
            <Bildekarusell />
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 sm:px-12 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10"
            />
            <PawPrint
              aria-hidden
              className="pointer-events-none absolute -bottom-6 right-8 h-32 w-32 rotate-12 text-white/10"
            />
            <div className="relative grid items-center gap-8 md:grid-cols-2">
              <div className="text-primary-foreground">
                <p className="font-medium text-primary-foreground/80">Velkommen innom</p>
                <h2 className="mt-2 font-brand text-3xl font-bold tracking-tight sm:text-4xl">
                  Klar for å gi hunden en aktiv hverdag?
                </h2>
                <p className="mt-4 text-lg text-primary-foreground/90">
                  Meld deg på et kurs eller lei hallen til egen trening — uansett
                  vær og årstid.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/kurs"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-12 rounded-full bg-white px-8 text-base text-primary hover:bg-white/90",
                    )}
                  >
                    Se kurs <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/leie"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "outline" }),
                      "h-12 rounded-full border-white bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white",
                    )}
                  >
                    Leie hall
                  </Link>
                </div>
              </div>
              <div className="relative hidden aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg md:block">
                <Image
                  src="/bilder/agility.jpg"
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 768px) 0px, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Faq />
    </>
  );
}
