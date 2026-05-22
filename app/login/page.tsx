import type { Metadata } from "next";
import { hentBruker } from "@/lib/auth";
import { redirect } from "next/navigation";
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
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Logg inn</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Logg inn for å melde på kurs raskere og booke halltid.
      </p>
      <div className="mt-8">
        <LoginForm retur={retur} />
      </div>
    </div>
  );
}
