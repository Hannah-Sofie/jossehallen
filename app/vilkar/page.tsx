import type { Metadata } from "next";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Vilkår",
  description: "Vilkår for deltakelse på kurs og leie av Jossehallen.",
};

export default function VilkarPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Vilkår</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sist oppdatert: {new Date().toLocaleDateString("nb-NO")}
      </p>

      <Prose>
        <p>
          Disse vilkårene gjelder for påmelding til kurs og leie av Jossehallen.
          Ved påmelding eller booking godtar du vilkårene.
        </p>

        <h2>Påmelding og betaling</h2>
        <ul>
          <li>Påmelding er bindende når den er registrert.</li>
          <li>
            Betaling skjer via Vipps eller bankkonto, merket med referansen du får
            ved påmelding. Plassen bekreftes når betalingen er registrert.
          </li>
          <li>
            Er et kurs fullt, kan du settes på venteliste. Du kontaktes hvis en
            plass blir ledig.
          </li>
        </ul>

        <h2>Avbestilling</h2>
        <ul>
          <li>
            Må du avbestille, ta kontakt med oss på e-post eller telefon senest{" "}
            <strong>[X timer/dager]</strong> før kurset eller bookingen starter.
          </li>
          <li>
            Avbestilling innen fristen: <strong>[refusjonsregel — f.eks. full
            refusjon / minus gebyr]</strong>.
          </li>
          <li>
            Ved avbestilling for sent eller manglende oppmøte refunderes ikke
            beløpet.
          </li>
          <li>
            Avlyser vi et kurs (f.eks. ved for få deltakere eller sykdom), får du
            full refusjon eller tilbud om annet kurs.
          </li>
        </ul>

        <h2>Regler i hallen</h2>
        <ul>
          <li>Hunden skal være frisk og vaksinert.</li>
          <li>Plukk opp etter hunden, både ute og inne.</li>
          <li>Du er ansvarlig for egen hund og eventuelle skader den forårsaker.</li>
          <li>Følg anvisninger fra instruktør og eier av hallen.</li>
          <li>
            Ved leie: lås døren etter deg, og forlat hallen slik du fant den.
            PIN-kode til døren finner du på «Min side».
          </li>
        </ul>

        <h2>Ansvar</h2>
        <p>
          Jossehallen er ikke ansvarlig for skader på person, hund eller eiendeler
          som skjer under kurs eller leie, med mindre skaden skyldes grov
          uaktsomhet fra vår side. Deltakelse skjer på eget ansvar.
        </p>

        <h2>Kontakt</h2>
        <p>
          Spørsmål om vilkårene? Kontakt oss på{" "}
          <strong>[e-post]</strong> eller <strong>[telefon]</strong>.
        </p>
      </Prose>
    </div>
  );
}
