import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { hentBruker } from "@/lib/auth";
import { AuthKort } from "@/components/auth/AuthKort";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Logg inn",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ retur?: string }>;
}) {
  const { retur } = await searchParams;
  if (await hentBruker()) redirect(retur || "/min-side");

  return (
    <AuthKort
      brandTittel="Velkommen tilbake!"
      brandTekst="Logg inn for å melde på kurs raskere og booke halltid i hallen."
      tittel="Logg inn"
      beskrivelse="Logg inn for å melde på kurs raskere og booke halltid."
    >
      <LoginForm retur={retur} />
    </AuthKort>
  );
}
