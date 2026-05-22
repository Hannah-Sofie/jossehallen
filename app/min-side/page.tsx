import type { Metadata } from "next";
import { krevInnlogget } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Min side",
  robots: { index: false },
};

export default async function MinSide() {
  const { profil } = await krevInnlogget();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Min side</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hei, {profil.fornavn || "der"}!
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <p>Dine påmeldinger, bookinger og PIN-koder kommer her (#13).</p>
      </div>
    </div>
  );
}
