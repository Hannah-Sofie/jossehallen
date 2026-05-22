import type { Metadata } from "next";
import { NyttPassordForm } from "@/components/auth/NyttPassordForm";

export const metadata: Metadata = {
  title: "Tilbakestill passord",
  robots: { index: false },
};

export default function TilbakestillPassordPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Nytt passord</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Velg et nytt passord for kontoen din.
      </p>
      <div className="mt-8">
        <NyttPassordForm />
      </div>
    </div>
  );
}
