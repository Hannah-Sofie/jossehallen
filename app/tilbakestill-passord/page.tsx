import type { Metadata } from "next";

import { AuthKort } from "@/components/auth/AuthKort";
import { NyttPassordForm } from "@/components/auth/NyttPassordForm";

export const metadata: Metadata = {
  title: "Tilbakestill passord",
  robots: { index: false },
};

export default function TilbakestillPassordPage() {
  return (
    <AuthKort
      brandTittel="Nytt passord"
      brandTekst="Velg et nytt passord, så er du klar til å logge inn igjen."
      tittel="Nytt passord"
      beskrivelse="Velg et nytt passord for kontoen din."
    >
      <NyttPassordForm />
    </AuthKort>
  );
}
