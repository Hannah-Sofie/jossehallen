import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { hentBruker } from "@/lib/auth";
import { AuthKort } from "@/components/auth/AuthKort";
import { RegistrerForm } from "@/components/auth/RegistrerForm";

export const metadata: Metadata = {
  title: "Registrer konto",
  robots: { index: false },
};

export default async function RegistrerPage() {
  if (await hentBruker()) redirect("/min-side");

  return (
    <AuthKort
      brandTittel="Bli med i Jossehallen"
      brandTekst="Med en konto slipper du å fylle ut info på nytt, og du kan booke halltid."
      tittel="Registrer konto"
      beskrivelse="Med en konto slipper du å fylle ut info på nytt, og du kan booke halltid."
    >
      <RegistrerForm />
    </AuthKort>
  );
}
