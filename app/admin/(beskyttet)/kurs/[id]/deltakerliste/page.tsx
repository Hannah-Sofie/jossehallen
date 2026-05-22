import Link from "next/link";
import { notFound } from "next/navigation";
import { hentDeltakerliste } from "@/lib/admin/deltakerliste";
import { formatPeriode } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NotatFelt } from "@/components/admin/NotatFelt";
import { MassEpostSkjema } from "@/components/admin/MassEpostSkjema";
import { UtskriftKnapp } from "@/components/admin/UtskriftKnapp";

export default async function Deltakerliste({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await hentDeltakerliste(id);
  if (!data) notFound();
  const { kurs, deltakere } = data;

  const aktive = deltakere.filter(
    (d) => d.status === "venter_betaling" || d.status === "bekreftet",
  );

  return (
    <div>
      <div className="print:hidden">
        <Link
          href={`/admin/kurs/${id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Tilbake til kurs
        </Link>
      </div>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Deltakerliste: {kurs.navn}</h2>
          <p className="text-sm text-muted-foreground">
            {formatPeriode(kurs.start_dato, kurs.slutt_dato)} · {aktive.length}{" "}
            aktive av {kurs.maks_deltakere} plasser
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <a
            href={`/api/admin/deltakerliste/${id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Last ned CSV
          </a>
          <UtskriftKnapp />
        </div>
      </div>

      {deltakere.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Ingen påmeldinger ennå.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Hund</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hensyn/kommentar</TableHead>
                <TableHead className="print:hidden">Internt notat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deltakere.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">
                    {d.fornavn} {d.etternavn}
                    <div className="text-xs text-muted-foreground">{d.epost}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {d.hund_navn}
                    {d.hund_alder ? `, ${d.hund_alder} år` : ""}
                    {d.hund_rase ? `, ${d.hund_rase}` : ""}
                    {d.kastrert ? " (kastrert)" : ""}
                  </TableCell>
                  <TableCell>{d.telefon}</TableCell>
                  <TableCell>
                    {d.status === "bekreftet" ? (
                      <Badge>Bekreftet</Badge>
                    ) : d.status === "venteliste" ? (
                      <Badge variant="secondary">Venteliste</Badge>
                    ) : d.status === "avbrutt" ? (
                      <Badge variant="destructive">Avbrutt</Badge>
                    ) : (
                      <Badge variant="secondary">Venter betaling</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs text-sm text-muted-foreground">
                    {d.kommentar || "—"}
                  </TableCell>
                  <TableCell className="print:hidden">
                    <NotatFelt paameldingId={d.id} start={d.notat} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-10 max-w-xl print:hidden">
        <MassEpostSkjema kursId={id} />
      </div>
    </div>
  );
}
