import Link from "next/link";
import { hentAlleKursAdmin } from "@/lib/admin/kurs";
import { formatPeriode, formatPris } from "@/lib/format";
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
import { KursHandlinger } from "@/components/admin/KursHandlinger";

export default async function AdminKurs() {
  const kurs = await hentAlleKursAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Kurs ({kurs.length})</h2>
        <Link href="/admin/kurs/ny" className={buttonVariants({ size: "sm" })}>
          + Nytt kurs
        </Link>
      </div>

      {kurs.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Ingen kurs ennå. Klikk «Nytt kurs» for å opprette det første.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Pris</TableHead>
                <TableHead>Plasser</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kurs.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.navn}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatPeriode(k.start_dato, k.slutt_dato)}
                  </TableCell>
                  <TableCell>{formatPris(k.pris)}</TableCell>
                  <TableCell>{k.maks_deltakere}</TableCell>
                  <TableCell>
                    {k.aktiv ? (
                      <Badge>Aktiv</Badge>
                    ) : (
                      <Badge variant="secondary">Skjult</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <KursHandlinger id={k.id} navn={k.navn} aktiv={k.aktiv} />
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
