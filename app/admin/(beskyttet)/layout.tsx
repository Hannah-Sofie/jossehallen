import { krevRolle } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function BeskyttetAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Kun admin/instruktør. proxy.ts har sjekket innlogging; her sjekkes rollen.
  // /admin/login ligger utenfor denne gruppen og rammes ikke.
  const { profil } = await krevRolle(["admin", "instruktor"]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-brand text-2xl font-extrabold tracking-wide">
          ADMIN
        </h1>
        <p className="text-sm text-muted-foreground">
          {profil.fornavn} {profil.etternavn} · {profil.rolle}
        </p>
      </div>
      <div className="mt-4">
        <AdminNav />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
