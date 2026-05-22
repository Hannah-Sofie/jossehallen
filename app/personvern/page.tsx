import type { Metadata } from "next";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Personvern",
  description: "Personvernerklæring for Jossehallen.",
};

export default function PersonvernPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Personvernerklæring</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sist oppdatert: {new Date().toLocaleDateString("nb-NO")}
      </p>

      <Prose>
        <p>
          Jossehallen (<strong>[org.nr / ansvarlig]</strong>) er behandlingsansvarlig
          for personopplysningene vi samler inn via denne nettsiden. Vi behandler
          opplysninger i tråd med personvernforordningen (GDPR).
        </p>

        <h2>Hvilke opplysninger vi samler inn</h2>
        <ul>
          <li>
            <strong>Ved kurspåmelding:</strong> navn, e-post, telefon, adresse,
            samt opplysninger om hunden (navn, alder, rase, kommentar).
          </li>
          <li>
            <strong>Ved booking av hall:</strong> navn, e-post, telefon og formål.
          </li>
          <li>
            <strong>Ved registrering av konto:</strong> navn, kontaktinfo og et
            kryptert passord (vi ser aldri passordet i klartekst).
          </li>
        </ul>

        <h2>Hvorfor vi behandler opplysningene</h2>
        <ul>
          <li>For å administrere påmeldinger, bookinger og betaling.</li>
          <li>For å kontakte deg om kurset eller bookingen din.</li>
          <li>For å oppfylle våre forpliktelser og lovkrav (f.eks. regnskap).</li>
        </ul>

        <h2>Lagring</h2>
        <p>
          Opplysningene lagres så lenge det er nødvendig for formålet, og slettes
          når de ikke lenger trengs. Data lagres hos vår databaseleverandør
          (Supabase) og e-postleverandør (Resend), som behandler data på våre vegne.
        </p>

        <h2>Dine rettigheter</h2>
        <ul>
          <li>Innsyn i hvilke opplysninger vi har om deg.</li>
          <li>Retting av feil, eller sletting av opplysninger.</li>
          <li>Å trekke tilbake samtykke.</li>
          <li>Å klage til Datatilsynet.</li>
        </ul>

        <h2>Informasjonskapsler (cookies)</h2>
        <p>
          Vi bruker kun nødvendige informasjonskapsler for innlogging og
          sikkerhet. Vi bruker <strong>[ingen / GDPR-vennlig]</strong> analyseverktøy
          som krever samtykke.
        </p>

        <h2>Kontakt</h2>
        <p>
          For spørsmål om personvern eller for å bruke rettighetene dine, kontakt
          oss på <strong>[e-post]</strong>.
        </p>
      </Prose>
    </div>
  );
}
