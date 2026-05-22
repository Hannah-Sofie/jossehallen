"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, UserRound, LogIn } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LoggUtKnapp } from "@/components/auth/LoggUtKnapp";
import { cn } from "@/lib/utils";
import type { Brukerrolle } from "@/types/database";

const nav = [
  { href: "/kurs", label: "Kurs og treninger" },
  { href: "/om", label: "Om hallen" },
  { href: "/om#instruktorer", label: "Om oss" },
  { href: "/kontakt", label: "Kontakt" },
];

export type HeaderBruker = {
  fornavn: string;
  rolle: Brukerrolle;
} | null;

export function Header({ bruker }: { bruker: HeaderBruker }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const erAdminEllerInstr =
    bruker?.rolle === "admin" || bruker?.rolle === "instruktor";

  function erAktiv(href: string) {
    const sti = href.split("#")[0];
    if (sti === "/") return pathname === "/";
    return pathname === sti || pathname.startsWith(`${sti}/`);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
          aria-label="Jossehallen – til forsiden"
        >
          <Image
            src="/logo.png"
            alt=""
            width={64}
            height={64}
            priority
            className="h-14 w-14"
          />
          <span className="font-brand text-xl font-bold uppercase tracking-wide">
            Jossehallen
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-aktiv={erAktiv(item.href) ? "" : undefined}
              className={cn(
                "relative py-1 text-lg font-semibold text-foreground transition-colors hover:text-primary",
                "after:absolute after:-bottom-0.5 after:left-0 after:h-[3px] after:w-0 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                "data-[aktiv]:text-primary data-[aktiv]:after:w-full",
              )}
            >
              {item.label}
            </Link>
          ))}

          {bruker ? (
            <div className="ml-2 flex items-center gap-4">
              <Link
                href={erAdminEllerInstr ? "/admin" : "/min-side"}
                className="inline-flex items-center gap-1.5 text-lg font-medium hover:underline"
              >
                <UserRound className="h-5 w-5" />
                {bruker.fornavn || "Min side"}
              </Link>
              <LoggUtKnapp />
            </div>
          ) : (
            <div className="ml-4 flex items-center gap-3">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 rounded-full px-5 text-base font-semibold",
                )}
              >
                <LogIn className="mr-1.5 h-4 w-4" />
                Logg inn
              </Link>
              <Link
                href="/leie"
                className={cn(
                  buttonVariants(),
                  "h-11 rounded-full px-5 text-base font-semibold",
                )}
              >
                Leie hall
              </Link>
            </div>
          )}
        </nav>

        <button
          type="button"
          aria-label={open ? "Lukk meny" : "Åpne meny"}
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className={cn("border-t lg:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2.5 text-lg hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {bruker ? (
            <>
              <Link
                href={erAdminEllerInstr ? "/admin" : "/min-side"}
                className="rounded-md px-3 py-2.5 text-lg hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                {erAdminEllerInstr ? "Admin" : "Min side"}
              </Link>
              <div className="px-3 py-2" onClick={() => setOpen(false)}>
                <LoggUtKnapp />
              </div>
            </>
          ) : (
            <div className="mt-2 flex flex-col gap-2 px-3">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
                onClick={() => setOpen(false)}
              >
                Logg inn
              </Link>
              <Link
                href="/leie"
                className={cn(buttonVariants(), "rounded-full")}
                onClick={() => setOpen(false)}
              >
                Leie hall
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
