import { Star } from "lucide-react";

// Placeholder-anmeldelser — bytt ut med ekte tilbakemeldinger senere.
const anmeldelser = [
  {
    sitat:
      "Hunden min elsker å komme hit! Flinke instruktører og en super hall å trene i, uansett vær.",
    navn: "Kari Nordmo",
    detalj: "Eier av border collie",
  },
  {
    sitat:
      "Endelig et tørt og varmt sted å trene om vinteren. Valpekurset var midt i blinken for oss.",
    navn: "Ola Berg",
    detalj: "Eier av labrador",
  },
  {
    sitat:
      "Leier hallen fast til egentrening. Enkelt å booke, og alltid rent og ryddig.",
    navn: "Mette Lien",
    detalj: "Eier av schäfer",
  },
];

function initialer(navn: string) {
  return navn
    .split(" ")
    .map((d) => d[0])
    .slice(0, 2)
    .join("");
}

export function Testimonials() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-medium text-primary">Tilbakemeldinger</p>
          <h2 className="mt-2 font-brand text-3xl font-bold tracking-tight sm:text-4xl">
            Det andre sier
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hva hundeeiere mener om Jossehallen.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {anmeldelser.map((a) => (
            <figure
              key={a.navn}
              className="flex flex-col rounded-3xl border bg-card p-8 shadow-sm"
            >
              <div className="flex gap-1 text-primary" aria-label="5 av 5 stjerner">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed">
                «{a.sitat}»
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
                  {initialer(a.navn)}
                </span>
                <span>
                  <span className="block font-medium text-foreground">{a.navn}</span>
                  <span className="block text-sm text-muted-foreground">
                    {a.detalj}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Eksempelanmeldelser – ekte tilbakemeldinger kommer.
        </p>
      </div>
    </section>
  );
}
