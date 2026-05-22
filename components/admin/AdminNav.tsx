"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const lenker = [
  { href: "/admin", label: "Oversikt", exact: true },
  { href: "/admin/kurs", label: "Kurs" },
  { href: "/admin/instruktorer", label: "Instruktører" },
  { href: "/admin/paameldinger", label: "Påmeldinger" },
  { href: "/admin/tider", label: "Tider" },
  { href: "/admin/bookinger", label: "Bookinger" },
  { href: "/admin/pin", label: "PIN" },
  { href: "/admin/profil", label: "Min profil" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-px">
      {lenker.map((l) => {
        const aktiv = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-t-md border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              aktiv
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
