import { hentBookinger, endreBookingStatus } from "@/lib/admin/bookinger";
import { formatDato } from "@/lib/format";
import type { BookingStatus } from "@/types/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusVelger } from "@/components/admin/StatusVelger";

const STATUS_VALG: { value: BookingStatus; label: string }[] = [
  { value: "venter_betaling", label: "Venter betaling" },
  { value: "bekreftet", label: "Bekreftet" },
  { value: "avbrutt", label: "Avbrutt" },
];

export default async function AdminBookinger() {
  const bookinger = await hentBookinger();

  return (
    <div>
      <h2 className="text-xl font-semibold">Bookinger ({bookinger.length})</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Hall-bookinger. Selve booking-flyten bygges i #4.
      </p>

      {bookinger.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Ingen bookinger ennå.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Tid</TableHead>
                <TableHead>Formål</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookinger.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">
                    {b.fornavn} {b.etternavn}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {b.dato ? formatDato(b.dato) : "—"}
                    {b.start_tid
                      ? ` ${b.start_tid.slice(0, 5)}–${b.slutt_tid?.slice(0, 5)}`
                      : ""}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {b.formaal || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>{b.epost}</div>
                    <div>{b.telefon}</div>
                  </TableCell>
                  <TableCell>
                    <StatusVelger<BookingStatus>
                      verdi={b.status}
                      valg={STATUS_VALG}
                      endre={endreBookingStatus.bind(null, b.id)}
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
