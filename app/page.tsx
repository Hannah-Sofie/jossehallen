import Link from "next/link";
import { GraduationCap, CalendarDays, Dumbbell, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 md:py-32">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Innendørs hundehall
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Trening, kurs og lek <span className="text-muted-foreground">— hele året.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Velkommen til Jossehallen. Vi tilbyr kurs for hunder og eiere i alle aldre,
              og du kan leie hallen til egen trening.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/kurs" className={buttonVariants({ size: "lg" })}>
                Se kurs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/leie"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Bestill hall
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Hva tilbyr vi?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Et trygt, tørt og opplyst sted for å trene og leke med hunden din.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <GraduationCap className="h-8 w-8" aria-hidden />
              <CardTitle className="mt-3">Kurs</CardTitle>
              <CardDescription>
                Hverdagslydighet, valpekurs, agility og mer. Små grupper med erfarne instruktører.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/kurs"
                className="inline-flex items-center text-sm font-medium hover:underline"
              >
                Se påmelding <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CalendarDays className="h-8 w-8" aria-hidden />
              <CardTitle className="mt-3">Leie hall</CardTitle>
              <CardDescription>
                Lei hallen til egen trening, lek eller for klubben din. Reserver en time
                som passer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/leie"
                className="inline-flex items-center text-sm font-medium hover:underline"
              >
                Se ledige tider <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Dumbbell className="h-8 w-8" aria-hidden />
              <CardTitle className="mt-3">Trening</CardTitle>
              <CardDescription>
                Velutstyrt hall med hindringsbane, mykt underlag og god plass — uansett vær.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/kontakt"
                className="inline-flex items-center text-sm font-medium hover:underline"
              >
                Kontakt oss <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Om Jossehallen
              </h2>
              <p className="mt-4 text-muted-foreground">
                Jossehallen er en innendørs hundehall som drives av lokale entusiaster.
                Vi er et samlingssted for kurs, trening og hyggelig lek — uavhengig av
                vær og årstid.
              </p>
              <p className="mt-4 text-muted-foreground">
                Har du spørsmål? Send oss en melding på{" "}
                <Link href="/kontakt" className="font-medium text-foreground hover:underline">
                  kontakt-siden
                </Link>
                .
              </p>
            </div>
            <div className="aspect-video rounded-lg bg-gradient-to-br from-muted to-muted-foreground/20" />
          </div>
        </div>
      </section>
    </>
  );
}
