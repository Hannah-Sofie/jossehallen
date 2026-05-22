import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { hentAlleInstruktorer } from "@/lib/admin/instruktorer";

export const metadata: Metadata = {
  title: "Om hallen",
  description:
    "Om Jossehallen i Moelv — innendørs hundehall for kurs, trening og leie. Møt instruktørene og les hallreglene.",
};

export default async function OmPage() {
  const instruktorer = await hentAlleInstruktorer();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <nav className="text-sm text-muted-foreground" aria-label="Brødsmuler">
        <Link href="/" className="hover:text-foreground">
          Hjem
        </Link>
        {" / "}
        <span className="text-foreground">Om hallen</span>
      </nav>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Om Jossehallen</h1>

      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          Jossehallen er en innendørs hundehall i Moelv, drevet av lokale
          entusiaster. Vi er et samlingssted for kurs, trening og hyggelig lek
          – uavhengig av vær og årstid. <strong>[Fyll inn mer om historien og
          hvem dere er.]</strong>
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">Utstyr og fasiliteter</h2>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-muted-foreground">
          <li>Stor hall med mykt, sklisikkert underlag</li>
          <li>Agility-utstyr og hindringer</li>
          <li>God belysning og oppvarming</li>
          <li>Parkering og inngang rett ved hallen</li>
          <li><strong>[Juster listen etter hva dere faktisk har.]</strong></li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">Regler i hallen</h2>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-muted-foreground">
          <li>Hunden skal være frisk og vaksinert.</li>
          <li>Plukk opp etter hunden, ute og inne.</li>
          <li>Du er ansvarlig for egen hund.</li>
          <li>Følg anvisninger fra instruktør og hallens eier.</li>
          <li>Lås døren etter deg ved leie, og rydd opp etter deg.</li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Se også våre{" "}
          <Link href="/vilkar" className="underline">
            vilkår
          </Link>
          .
        </p>
      </section>

      {instruktorer.length > 0 ? (
        <section id="instruktorer" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight">Om oss – instruktørene</h2>
          <div className="mt-6 space-y-6">
            {instruktorer.map((i) => (
              <div key={i.id} className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-muted">
                  {i.bilde_url ? (
                    <Image
                      src={i.bilde_url}
                      alt={i.navn}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <GraduationCap className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{i.navn}</p>
                  {i.bio ? (
                    <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                      {i.bio}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
