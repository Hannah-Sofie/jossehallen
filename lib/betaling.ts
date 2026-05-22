/** Betalingsinfo som vises til kunde og i e-post. */

export type Betalingsinfo = {
  vipps: string | null;
  konto: string | null;
  belop: number;
  referanse: string;
};

/**
 * Bygger betalingsinfo. Referanse = kort, lesbar kode kunden oppgir ved betaling
 * (f.eks. "KURS-AB12CD" / "LEIE-AB12CD"). Basert på rad-id.
 */
export function lagBetalingsinfo(
  id: string,
  belop: number,
  prefiks: "KURS" | "LEIE" = "KURS",
): Betalingsinfo {
  const kort = id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return {
    vipps: process.env.NEXT_PUBLIC_VIPPS_NUMBER || null,
    konto: process.env.NEXT_PUBLIC_ACCOUNT_NUMBER || null,
    belop,
    referanse: `${prefiks}-${kort}`,
  };
}

/** Pris for å leie hallen (1 time), fra env. */
export function leiePris(): number {
  const raw = process.env.NEXT_PUBLIC_LEIE_PRIS;
  const n = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

export function formatKonto(konto: string): string {
  // 11 siffer → xxxx.xx.xxxxx
  const d = konto.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6)}`;
  return konto;
}
