/** Betalingsinfo som vises til kunde og i e-post. */

export type Betalingsinfo = {
  vipps: string | null;
  konto: string | null;
  belop: number;
  referanse: string;
};

/**
 * Bygger betalingsinfo. Referanse = kort, lesbar kode kunden oppgir ved betaling
 * (f.eks. "KURS-AB12CD"). Basert på påmeldings-id.
 */
export function lagBetalingsinfo(
  paameldingId: string,
  belop: number,
): Betalingsinfo {
  const kort = paameldingId.replace(/-/g, "").slice(0, 6).toUpperCase();
  return {
    vipps: process.env.NEXT_PUBLIC_VIPPS_NUMBER || null,
    konto: process.env.NEXT_PUBLIC_ACCOUNT_NUMBER || null,
    belop,
    referanse: `KURS-${kort}`,
  };
}

export function formatKonto(konto: string): string {
  // 11 siffer → xxxx.xx.xxxxx
  const d = konto.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6)}`;
  return konto;
}
