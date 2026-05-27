import type { Metadata } from "next";

import { AuthKort } from "@/components/auth/AuthKort";
import { GlemtPassordForm } from "@/components/auth/GlemtPassordForm";

export const metadata: Metadata = {
  title: "Glemt passord",
  robots: { index: false },
};

export default function GlemtPassordPage() {
  return (
    <AuthKort
      brandTittel="Glemt passord?"
      brandTekst="Ingen fare – skriv inn e-posten din, så sender vi deg en lenke for å lage et nytt."
      tittel="Glemt passord"
      beskrivelse="Skriv inn e-posten din, så sender vi en lenke for å lage nytt passord."
    >
      <GlemtPassordForm />
    </AuthKort>
  );
}
