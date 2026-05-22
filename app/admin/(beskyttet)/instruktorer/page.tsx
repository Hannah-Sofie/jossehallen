import Link from "next/link";
import { hentAlleInstruktorer } from "@/lib/admin/instruktorer";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InstruktorHandlinger } from "@/components/admin/InstruktorHandlinger";

export default async function AdminInstruktorer() {
  const instruktorer = await hentAlleInstruktorer();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Instruktører ({instruktorer.length})
        </h2>
        <Link
          href="/admin/instruktorer/ny"
          className={buttonVariants({ size: "sm" })}
        >
          + Ny instruktør
        </Link>
      </div>

      {instruktorer.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Ingen instruktører ennå.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead className="text-right">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instruktorer.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.navn}</TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {i.bio || "—"}
                  </TableCell>
                  <TableCell>
                    <InstruktorHandlinger id={i.id} navn={i.navn} />
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
