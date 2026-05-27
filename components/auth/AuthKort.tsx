import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PawPrint } from "lucide-react";

/** Delt split-kort for auth-sider: terracotta merkevarepanel + skjema-panel. */
export function AuthKort({
  brandTittel,
  brandTekst,
  tittel,
  beskrivelse,
  children,
}: {
  brandTittel: string;
  brandTekst: string;
  tittel: string;
  beskrivelse: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="overflow-hidden rounded-3xl border bg-card shadow-sm md:grid md:grid-cols-2">
        {/* Merkevarepanel (skjult på mobil) */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground md:flex">
          <PawPrint
            aria-hidden
            className="pointer-events-none absolute -bottom-8 -right-6 h-44 w-44 rotate-12 text-white/10"
          />
          <Link
            href="/"
            className="relative flex items-center gap-3"
            aria-label="Jossehallen – til forsiden"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1">
              <Image src="/logo.png" alt="" width={48} height={48} className="h-10 w-10" />
            </span>
            <span className="font-brand text-lg font-bold uppercase tracking-wide">
              Jossehallen
            </span>
          </Link>
          <div className="relative">
            <h2 className="font-brand text-3xl font-bold tracking-tight">
              {brandTittel}
            </h2>
            <p className="mt-3 max-w-xs text-primary-foreground/90">{brandTekst}</p>
          </div>
        </div>

        {/* Skjema-panel */}
        <div className="p-8 sm:p-10">
          <Link
            href="/"
            className="mb-6 flex items-center gap-2 md:hidden"
            aria-label="Jossehallen – til forsiden"
          >
            <Image src="/logo.png" alt="" width={40} height={40} className="h-10 w-10" />
            <span className="font-brand text-base font-bold uppercase tracking-wide">
              Jossehallen
            </span>
          </Link>

          <h1 className="font-brand text-2xl font-bold tracking-tight">{tittel}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{beskrivelse}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
