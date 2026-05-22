import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Users, CalendarClock, CalendarCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminOversikt() {
  const supabase = await createClient();

  const [kursRes, paamRes, ventRes, tiderRes] = await Promise.all([
    supabase
      .from("kurs")
      .select("id", { count: "exact", head: true })
      .eq("aktiv", true),
    supabase.from("kurspaameldinger").select("id", { count: "exact", head: true }),
    supabase
      .from("kurspaameldinger")
      .select("id", { count: "exact", head: true })
      .eq("status", "venter_betaling"),
    supabase
      .from("tilgjengelige_tider")
      .select("id", { count: "exact", head: true })
      .eq("ledig", true),
  ]);

  const kort = [
    {
      label: "Aktive kurs",
      verdi: kursRes.count ?? 0,
      icon: GraduationCap,
      href: "/admin/kurs",
    },
    {
      label: "Påmeldinger totalt",
      verdi: paamRes.count ?? 0,
      icon: Users,
      href: "/admin/paameldinger",
    },
    {
      label: "Venter betaling",
      verdi: ventRes.count ?? 0,
      icon: CalendarCheck,
      href: "/admin/paameldinger",
    },
    {
      label: "Ledige tider",
      verdi: tiderRes.count ?? 0,
      icon: CalendarClock,
      href: "/admin/tider",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kort.map((k) => (
        <Link key={k.label} href={k.href}>
          <Card className="transition-colors hover:border-primary">
            <CardHeader>
              <k.icon className="h-6 w-6 text-muted-foreground" aria-hidden />
              <CardTitle className="mt-2 text-3xl">{k.verdi}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {k.label}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
