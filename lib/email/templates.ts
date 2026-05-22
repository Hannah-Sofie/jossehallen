import { formatKonto, type Betalingsinfo } from "@/lib/betaling";
import { formatPeriode, formatDatoLang } from "@/lib/format";

export type KursBekreftelseData = {
  fornavn: string;
  kursNavn: string;
  startDato: string;
  sluttDato: string | null;
  tidspunkt: string;
  sted: string;
  venteliste: boolean;
  betaling: Betalingsinfo;
};

const BRAND = "#C2410C";

export function kursBekreftelseEmne(d: KursBekreftelseData): string {
  return d.venteliste
    ? `Venteliste: ${d.kursNavn} – Jossehallen`
    : `Påmelding bekreftet: ${d.kursNavn} – Jossehallen`;
}

export function kursBekreftelseHtml(d: KursBekreftelseData): string {
  const rad = (label: string, verdi: string) =>
    verdi
      ? `<tr><td style="padding:4px 12px 4px 0;color:#666">${label}</td><td style="padding:4px 0;font-weight:600">${verdi}</td></tr>`
      : "";

  const betalingsblokk =
    !d.venteliste && d.betaling.belop > 0
      ? `
      <h2 style="font-size:16px;margin:24px 0 8px">Betaling</h2>
      <table style="font-size:14px;border-collapse:collapse">
        ${rad("Beløp", `${d.betaling.belop.toLocaleString("nb-NO")} kr`)}
        ${d.betaling.vipps ? rad("Vipps", d.betaling.vipps) : ""}
        ${d.betaling.konto ? rad("Kontonummer", formatKonto(d.betaling.konto)) : ""}
        ${rad("Merk betalingen", d.betaling.referanse)}
      </table>
      <p style="font-size:13px;color:#666;margin-top:8px">
        Betal til Vipps eller konto og merk betalingen med referansen over.
        Påmeldingen bekreftes når betalingen er registrert.
      </p>`
      : "";

  const intro = d.venteliste
    ? `Kurset er dessverre fullt, men du er nå satt på <strong>venteliste</strong>. Vi kontakter deg om en plass blir ledig.`
    : `Takk for påmeldingen! Her er detaljene.`;

  return `<!doctype html>
<html lang="nb"><body style="margin:0;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif;color:#111">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #eee">
      <p style="font-weight:800;letter-spacing:1px;color:${BRAND};margin:0 0 16px">JOSSEHALLEN</p>
      <p style="font-size:15px">Hei ${d.fornavn || "der"},</p>
      <p style="font-size:15px">${intro}</p>

      <h2 style="font-size:16px;margin:24px 0 8px">${d.kursNavn}</h2>
      <table style="font-size:14px;border-collapse:collapse">
        ${rad("Når", formatPeriode(d.startDato, d.sluttDato) + (d.tidspunkt ? ` · ${d.tidspunkt}` : ""))}
        ${rad("Sted", d.sted)}
      </table>

      ${betalingsblokk}

      <p style="font-size:13px;color:#666;margin-top:24px">
        Har du spørsmål, bare svar på denne e-posten.
      </p>
      <p style="font-size:13px;color:#999;margin-top:16px">Vennlig hilsen<br>Jossehallen</p>
    </div>
  </div>
</body></html>`;
}

export type BookingBekreftelseData = {
  fornavn: string;
  dato: string;
  startTid: string;
  sluttTid: string;
  sted: string;
  betaling: Betalingsinfo;
};

export function bookingBekreftelseEmne(): string {
  return "Booking bekreftet – Jossehallen";
}

export function bookingBekreftelseHtml(d: BookingBekreftelseData): string {
  const rad = (label: string, verdi: string) =>
    verdi
      ? `<tr><td style="padding:4px 12px 4px 0;color:#666">${label}</td><td style="padding:4px 0;font-weight:600">${verdi}</td></tr>`
      : "";

  const betalingsblokk =
    d.betaling.belop > 0
      ? `
      <h2 style="font-size:16px;margin:24px 0 8px">Betaling</h2>
      <table style="font-size:14px;border-collapse:collapse">
        ${rad("Beløp", `${d.betaling.belop.toLocaleString("nb-NO")} kr`)}
        ${d.betaling.vipps ? rad("Vipps", d.betaling.vipps) : ""}
        ${d.betaling.konto ? rad("Kontonummer", formatKonto(d.betaling.konto)) : ""}
        ${rad("Merk betalingen", d.betaling.referanse)}
      </table>
      <p style="font-size:13px;color:#666;margin-top:8px">
        Betal til Vipps eller konto og merk betalingen med referansen over.
      </p>`
      : "";

  return `<!doctype html>
<html lang="nb"><body style="margin:0;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif;color:#111">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #eee">
      <p style="font-weight:800;letter-spacing:1px;color:${BRAND};margin:0 0 16px">JOSSEHALLEN</p>
      <p style="font-size:15px">Hei ${d.fornavn || "der"},</p>
      <p style="font-size:15px">Din booking av hallen er registrert. Her er detaljene:</p>
      <table style="font-size:14px;border-collapse:collapse;margin-top:8px">
        ${rad("Dato", formatDatoLang(d.dato))}
        ${rad("Tid", `${d.startTid.slice(0, 5)}–${d.sluttTid.slice(0, 5)}`)}
        ${rad("Sted", d.sted)}
      </table>
      ${betalingsblokk}
      <p style="font-size:13px;color:#666;margin-top:24px">
        PIN-kode til døren ser du på «Min side» rundt booking-tidspunktet. Har du
        spørsmål, bare svar på denne e-posten.
      </p>
      <p style="font-size:13px;color:#999;margin-top:16px">Vennlig hilsen<br>Jossehallen</p>
    </div>
  </div>
</body></html>`;
}
