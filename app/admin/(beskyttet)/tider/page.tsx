import { hentTider, slettTid } from "@/lib/admin/tider";
import { formatDato } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TidSkjema } from "@/components/admin/TidSkjema";
import { SlettKnapp } from "@/components/admin/SlettKnapp";

export default async function AdminTider() {
  const tider = await hentTider();

  return (
    <div>
      <h2 className="text-xl font-semibold">Tilgjengelige tider ({tider.length})</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Legg til ledige tider folk kan booke. Gjentakende serier kommer i #19.
      </p>

      <div className="mt-6">
        <TidSkjema />
      </div>

      {tider.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Ingen tider ennå.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dato</TableHead>
                <TableHead>Tid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tider.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{formatDato(t.dato)}</TableCell>
                  <TableCell>
                    {t.start_tid.slice(0, 5)}–{t.slutt_tid.slice(0, 5)}
                  </TableCell>
                  <TableCell>
                    {t.ledig ? (
                      <Badge variant="secondary">Ledig</Badge>
                    ) : (
                      <Badge>Booket</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <SlettKnapp slett={slettTid.bind(null, t.id)} />
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
