import { formatKonto, type Betalingsinfo } from "@/lib/betaling";
import { formatPris } from "@/lib/format";

export function BetalingsInfo({ info }: { info: Betalingsinfo }) {
  if (info.belop === 0) return null;
  const harBetaling = info.vipps || info.konto;

  return (
    <div className="rounded-lg border bg-muted/40 p-4 text-sm">
      <p className="font-medium">Betaling</p>
      <dl className="mt-2 space-y-1">
        <Rad label="Beløp" verdi={formatPris(info.belop)} />
        {info.vipps ? <Rad label="Vipps" verdi={info.vipps} /> : null}
        {info.konto ? (
          <Rad label="Kontonummer" verdi={formatKonto(info.konto)} />
        ) : null}
        <Rad label="Merk betalingen" verdi={info.referanse} />
      </dl>
      {harBetaling ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Betal til Vipps eller konto, og merk betalingen med referansen over.
          Påmeldingen bekreftes når betalingen er registrert.
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          Betalingsinfo kommer på e-post / fra oss.
        </p>
      )}
    </div>
  );
}

function Rad({ label, verdi }: { label: string; verdi: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{verdi}</dd>
    </div>
  );
}
