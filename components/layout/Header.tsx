"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, UserRound, CalendarDays } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LoggUtKnapp } from "@/components/auth/LoggUtKnapp";
import { cn } from "@/lib/utils";
import type { Brukerrolle } from "@/types/database";

const nav = [
  { href: "/kurs", label: "Kurs" },
  { href: "/om", label: "Om oss" },
  { href: "/kontakt", label: "Kontakt" },
];

export type HeaderBruker = {
  fornavn: string;
  rolle: Brukerrolle;
} | null;

export function Header({ bruker }: { bruker: HeaderBruker }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const erAdminEllerInstr =
    bruker?.rolle === "admin" || bruker?.rolle === "instruktor";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function erAktiv(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const navLenke = (href: string, label: string, stor = false) => {
    const aktiv = erAktiv(href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={aktiv ? "page" : undefined}
        onClick={() => setOpen(false)}
        className={cn(
          "rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          stor ? "px-4 py-3 text-2xl" : "px-3.5 py-2 text-base",
          aktiv
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:bg-muted hover:text-primary",
        )}
      >
        {label}
      </Link>
    );
  };

  const logo = (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:justify-self-start"
      onClick={() => setOpen(false)}
      aria-label="Jossehallen – til forsiden"
    >
      <Image
        src="/logo.png"
        alt=""
        width={64}
        height={64}
        priority
        className={cn("transition-all", scrolled ? "h-11 w-11" : "h-14 w-14")}
      />
      <span className="font-brand text-xl font-bold uppercase tracking-wide">
        Jossehallen
      </span>
    </Link>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur transition-shadow",
        scrolled && "shadow-md",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-[height] duration-300 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]",
          scrolled ? "h-16" : "h-20",
        )}
      >
        {logo}

        {/* Midten: meny (eksakt sentrert via grid) */}
        <nav className="hidden items-center gap-2 lg:flex lg:justify-self-center">
          {nav.map((item) => navLenke(item.href, item.label))}
        </nav>

        {/* Høyre: handlinger */}
        {bruker ? (
          <div className="hidden shrink-0 items-center gap-4 lg:flex lg:justify-self-end">
            <Link
              href={erAdminEllerInstr ? "/admin" : "/min-side"}
              className="inline-flex items-center gap-1.5 font-semibold hover:text-primary"
            >
              <UserRound className="h-5 w-5" />
              {bruker.fornavn || "Min side"}
            </Link>
            <LoggUtKnapp />
          </div>
        ) : (
          <div className="hidden shrink-0 items-center gap-5 lg:flex lg:justify-self-end">
            <Link
              href="/login"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              Logg inn
            </Link>
            <Link
              href="/leie"
              className={cn(
                buttonVariants(),
                "h-11 rounded-full px-5 text-base font-semibold",
              )}
            >
              <CalendarDays className="mr-1.5 h-4 w-4" />
              Leie hall
            </Link>
          </div>
        )}

        <button
          type="button"
          aria-label="Åpne meny"
          aria-expanded={open}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Fullskjerm mobilmeny */}
      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6">
            {logo}
            <button
              type="button"
              aria-label="Lukk meny"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-2 px-4 py-6 sm:px-6">
            {nav.map((item) => navLenke(item.href, item.label, true))}

            <div className="mt-6 flex flex-col gap-3 border-t pt-6">
              {bruker ? (
                <>
                  <Link
                    href={erAdminEllerInstr ? "/admin" : "/min-side"}
                    className="px-4 py-3 text-2xl font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    {erAdminEllerInstr ? "Admin" : "Min side"}
                  </Link>
                  <div className="px-4" onClick={() => setOpen(false)}>
                    <LoggUtKnapp />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-3 text-2xl font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    Logg inn
                  </Link>
                  <Link
                    href="/leie"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "mx-4 mt-2 rounded-full text-base font-semibold",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <CalendarDays className="mr-1.5 h-5 w-5" />
                    Leie hall
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
