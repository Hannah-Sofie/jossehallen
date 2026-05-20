import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leie hall",
  description: "Bestill halltid i Jossehallen — booking åpner snart.",
};

export default function LeiePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Leie hall</h1>
      <p className="mt-4 text-muted-foreground">
        Booking-systemet er under utvikling. Ta kontakt så avtaler vi tid.
      </p>
    </div>
  );
}
