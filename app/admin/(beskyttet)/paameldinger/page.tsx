import { hentPaameldinger, endrePaameldingStatus } from "@/lib/admin/paameldinger";
import { formatDato } from "@/lib/format";
import type { PaameldingStatus } from "@/types/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusVelger } from "@/components/admin/StatusVelger";

const STATUS_VALG: { value: PaameldingStatus; label: string }[] = [
  { value: "venter_betaling", label: "Venter betaling" },
  { value: "bekreftet", label: "Bekreftet" },
  { value: "venteliste", label: "Venteliste" },
  { value: "avbrutt", label: "Avbrutt" },
];

export default async function AdminPaameldinger() {
  const paameldinger = await hentPaameldinger();

  return (
    <div>
      <h2 className="text-xl font-semibold">
        Påmeldinger ({paameldinger.length})
      </h2>

      {paameldinger.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Ingen påmeldinger ennå.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Kurs</TableHead>
                <TableHead>Hund</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Dato</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paameldinger.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {p.fornavn} {p.etternavn}
                  </TableCell>
                  <TableCell>{p.kursNavn}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.hund_navn}
                    {p.hund_rase ? ` (${p.hund_rase})` : ""}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>{p.epost}</div>
                    <div>{p.telefon}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDato(p.opprettet)}
                  </TableCell>
                  <TableCell>
                    <StatusVelger<PaameldingStatus>
                      verdi={p.status}
                      valg={STATUS_VALG}
                      endre={endrePaameldingStatus.bind(null, p.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
