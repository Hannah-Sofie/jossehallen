import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurs",
  description: "Kurs for hund og eier — påmelding kommer snart.",
};

export default function KursPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Kurs</h1>
      <p className="mt-4 text-muted-foreground">
        Vi jobber med kursprogrammet. Påmelding åpner snart — kom tilbake!
      </p>
    </div>
  );
}
