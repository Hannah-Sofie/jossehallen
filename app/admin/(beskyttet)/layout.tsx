import { krevRolle } from "@/lib/auth";

export default async function BeskyttetAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Kun admin/instruktør. proxy.ts har sjekket innlogging; her sjekkes rollen.
  // /admin/login ligger utenfor denne gruppen og rammes ikke.
  await krevRolle(["admin", "instruktor"]);
  return <>{children}</>;
}
