import { hentPinkoder } from "@/lib/admin/pinkoder";
import { formatDatoLang } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PinkodeSkjema } from "@/components/admin/PinkodeSkjema";

export default async function AdminPin() {
  const koder = await hentPinkoder();

  return (
    <div>
      <h2 className="text-xl font-semibold">PIN-kode for hall-låsen</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Sett gjeldende kode når du bytter låsen. Brukere med booking ser koden på
        Min side fra 15 min før til 15 min etter sin tid.
      </p>

      <div className="mt-6">
        <PinkodeSkjema />
      </div>

      {koder.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Ingen koder satt ennå.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Gyldig fra</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {koder.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-mono font-medium">{k.kode}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDatoLang(k.gyldig_fra)}
                  </TableCell>
                  <TableCell>
                    {k.gyldig_til === null ? (
                      <Badge>Gjeldende</Badge>
                    ) : (
                      <Badge variant="secondary">Utløpt</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {k.notat || "—"}
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
