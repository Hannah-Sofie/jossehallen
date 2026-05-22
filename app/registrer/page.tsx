import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hentBruker } from "@/lib/auth";
import { RegistrerForm } from "@/components/auth/RegistrerForm";

export const metadata: Metadata = {
  title: "Registrer konto",
  robots: { index: false },
};

export default async function RegistrerPage() {
  if (await hentBruker()) redirect("/min-side");

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Registrer konto</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Med en konto slipper du å fylle ut info på nytt, og du kan booke halltid.
      </p>
      <div className="mt-8">
        <RegistrerForm />
      </div>
    </div>
  );
}
