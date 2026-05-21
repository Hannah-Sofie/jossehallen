import type { Metadata } from "next";
import { GlemtPassordForm } from "@/components/auth/GlemtPassordForm";

export const metadata: Metadata = {
  title: "Glemt passord",
  robots: { index: false },
};

export default function GlemtPassordPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Glemt passord</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Skriv inn e-posten din, så sender vi en lenke for å lage nytt passord.
      </p>
      <div className="mt-8">
        <GlemtPassordForm />
      </div>
    </div>
  );
}
