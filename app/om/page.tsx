import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Ruler,
  Footprints,
  Dumbbell,
  Boxes,
  Flag,
  Lightbulb,
  Car,
  PawPrint,
  ArrowRight,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hentAlleInstruktorer } from "@/lib/admin/instruktorer";

export const metadata: Metadata = {
  title: "Om hallen",
  description:
    "Om Jossehallen i Moelv — innendørs hundehall for kurs, trening og leie. Møt instruktørene og les hallreglene.",
};

const fasiliteter = [
  { icon: Ruler, tekst: "Romslig hall på ca. 10 × 25 meter" },
  { icon: Footprints, tekst: "Mykt, sklisikkert kunstgress-underlag" },
  {
    icon: Dumbbell,
    tekst:
      "Komplett agility-utstyr: 10 hopphinder, 2 slalåm, 2 tunneller, lengdehopp, mur og vippe",
  },
  { icon: Boxes, tekst: "10 plattformer/dokrakker for trening og lek" },
  { icon: Flag, tekst: "Nummerskilt og sandsekker til oppsett av baner" },
  { icon: Lightbulb, tekst: "God belysning og oppvarming" },
  { icon: Car, tekst: "Parkering og inngang rett ved hallen" },
];

const regler = [
  "Hunden skal være frisk og vaksinert.",
  "Plukk opp etter hunden, ute og inne.",
  "Du er ansvarlig for egen hund.",
  "Følg anvisninger fra instruktør og hallens eier.",
  "Lås døren etter deg ved leie, og rydd opp etter deg.",
];

// Placeholder-team til ekte navn/bilder legges inn (her eller via admin).
const driver = {
  navn: "Hege Waagan",
  rolle: "Driver og daglig leder",
  bio: "Gründer av Jossehallen og den som holder hjulene i gang. Brenner for at hund og eier skal trives og ha det gøy sammen – uansett nivå og erfaring.",
};

const placeholderHjelpere = [
  {
    navn: "Kursinstruktør",
    rolle: "Instruktør",
    bio: "Ansvarlig for kurs og treninger i hallen. Presenteres snart.",
    bilde_url: null as string | null,
  },
  {
    navn: "Medhjelper",
    rolle: "Medhjelper",
    bio: "Bidrar med drift og tilrettelegging i hallen. Presenteres snart.",
    bilde_url: null as string | null,
  },
];

function initialer(navn: string) {
  return navn
    .split(" ")
    .map((d) => d[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({
  navn,
  bilde,
  storrelse,
}: {
  navn: string;
  bilde: string | null;
  storrelse: string;
}) {
  if (bilde) {
    return (
      <div className={`relative ${storrelse} shrink-0 overflow-hidden rounded-full`}>
        <Image src={bilde} alt={navn} fill className="object-cover" sizes="96px" />
      </div>
    );
  }
  const harNavn = navn.trim().includes(" ");
  return (
    <div
      className={`flex ${storrelse} shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary`}
      aria-hidden
    >
      {harNavn ? initialer(navn) : <PawPrint className="h-6 w-6" />}
    </div>
  );
}

export default async function OmPage() {
  const instruktorer = await hentAlleInstruktorer();

  const hjelpere =
    instruktorer.length > 0
      ? instruktorer.map((i) => ({
          navn: i.navn,
          rolle: "Instruktør",
          bio: i.bio || "",
          bilde_url: i.bilde_url,
        }))
      : placeholderHjelpere;

  return (
    <div className="relative overflow-hidden">
      <PawPrint
        aria-hidden
        className="pointer-events-none absolute -right-8 top-28 h-32 w-32 rotate-12 text-primary/10"
      />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <nav className="text-sm text-muted-foreground" aria-label="Brødsmuler">
          <Link href="/" className="hover:text-foreground">
            Hjem
          </Link>
          {" / "}
          <span className="text-foreground">Om hallen</span>
        </nav>

        {/* Hero: tekst + bilde */}
        <div className="mt-6 grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="font-medium text-primary">Om oss</p>
            <h1 className="mt-2 font-brand text-4xl font-bold tracking-tight sm:text-5xl">
              Om Jossehallen
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Jossehallen er en innendørs hundehall i Moelv som åpnet mot
              slutten av 2024. Hallen drives av Hege Waagan og er et
              samlingssted for kurs, trening og hyggelig lek – uavhengig av vær
              og årstid.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Du finner oss i Kinnevegen 62, 2390 Moelv. Hallen har mykt
              kunstgress-underlag, god belysning og oppvarming – og er åpen alle
              dager fra 09 til 22.
            </p>
          </div>
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-tl-[3.5rem] rounded-tr-xl rounded-br-[3.5rem] rounded-bl-xl bg-primary/15"
            />
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-tl-[3.5rem] rounded-tr-xl rounded-br-[3.5rem] rounded-bl-xl shadow-sm">
              <Image
                src="/bilder/agility-bane.jpg"
                alt="Agility-bane satt opp i Jossehallen"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Utstyr og fasiliteter */}
        <section className="mt-16">
          <p className="font-medium text-primary">Fasiliteter</p>
          <h2 className="mt-2 font-brand text-3xl font-bold tracking-tight">
            Utstyr og fasiliteter
          </h2>
          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {fasiliteter.map((f) => (
              <div key={f.tekst} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="pt-2 text-base text-muted-foreground">{f.tekst}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Regler i hallen */}
        <section className="mt-16">
          <p className="font-medium text-primary">Godt å vite</p>
          <h2 className="mt-2 font-brand text-3xl font-bold tracking-tight">
            Regler i hallen
          </h2>
          <div className="mt-8 rounded-3xl border bg-card p-8 shadow-sm">
            <ul className="space-y-4">
              {regler.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span className="text-base text-muted-foreground">{r}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t pt-4 text-sm text-muted-foreground">
              Se også våre{" "}
              <Link href="/vilkar" className="font-medium text-foreground hover:underline">
                vilkår
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Driver og instruktører */}
        <section id="instruktorer" className="mt-16 scroll-mt-24">
          <p className="font-medium text-primary">Hvem vi er</p>
          <h2 className="mt-2 font-brand text-3xl font-bold tracking-tight">
            Driver og instruktører
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Menneskene bak Jossehallen.
          </p>

          {/* Driver – fremhevet */}
          <div className="mt-8 flex flex-col gap-5 rounded-3xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-8">
            <Avatar navn={driver.navn} bilde={null} storrelse="h-24 w-24 text-2xl" />
            <div>
              <p className="font-brand text-xl font-bold tracking-tight">
                {driver.navn}
              </p>
              <p className="text-sm font-medium text-primary">{driver.rolle}</p>
              <p className="mt-2 text-muted-foreground">{driver.bio}</p>
            </div>
          </div>

          {/* Instruktører og medhjelpere */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {hjelpere.map((p) => (
              <div
                key={p.navn}
                className="flex gap-4 rounded-3xl border bg-card p-6 shadow-sm"
              >
                <Avatar navn={p.navn} bilde={p.bilde_url} storrelse="h-16 w-16 text-lg" />
                <div>
                  <p className="font-medium">{p.navn}</p>
                  <p className="text-sm font-medium text-primary">{p.rolle}</p>
                  {p.bio ? (
                    <p className="mt-1 text-sm whitespace-pre-line text-muted-foreground">
                      {p.bio}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Bilder og presentasjoner oppdateres fortløpende.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-10 text-center sm:px-12 sm:py-12">
            <PawPrint
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -right-4 h-28 w-28 rotate-12 text-white/10"
            />
            <h2 className="relative font-brand text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
              Vil du bli med?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-primary-foreground/90">
              Meld deg på et kurs, eller ta kontakt om du lurer på noe om hallen.
            </p>
            <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
                href="/kontakt"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 rounded-full border-white bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white",
                )}
              >
                Ta kontakt
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
