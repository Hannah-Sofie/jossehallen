import { format } from "date-fns";
import { nb } from "date-fns/locale";

export function formatDato(iso: string): string {
  return format(new Date(iso), "d. MMM yyyy", { locale: nb });
}

export function formatDatoLang(iso: string): string {
  return format(new Date(iso), "EEEE d. MMMM yyyy", { locale: nb });
}

export function formatPeriode(start: string, slutt: string | null): string {
  if (!slutt) return formatDato(start);
  return `${formatDato(start)} – ${formatDato(slutt)}`;
}

export function formatPris(nok: number): string {
  if (nok === 0) return "Gratis";
  return `${nok.toLocaleString("nb-NO")} kr`;
}
