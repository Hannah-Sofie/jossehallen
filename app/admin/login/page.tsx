import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hentBruker, erAdminEllerInstruktor } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Admin-innlogging",
  robots: { index: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ retur?: string }>;
}) {
  const { retur } = await searchParams;
  const auth = await hentBruker();
  if (auth && erAdminEllerInstruktor(auth.profil.rolle)) {
    redirect(retur || "/admin");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Admin-innlogging</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        For administratorer og instruktører.
      </p>
      <div className="mt-8">
        <LoginForm retur={retur || "/admin"} admin />
      </div>
    </div>
  );
}
