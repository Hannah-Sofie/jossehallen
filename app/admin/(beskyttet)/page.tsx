import type { Metadata } from "next";
import { hentBruker } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

export default async function AdminDashboard() {
  const auth = await hentBruker();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Innlogget som {auth?.profil.fornavn} {auth?.profil.etternavn} (
          {auth?.profil.rolle})
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <p>Admin-dashbordet bygges i #6.</p>
        <p className="mt-1 text-sm">
          Kurs, påmeldinger, bookinger og tider kommer her.
        </p>
      </div>
    </div>
  );
}
