import Link from "next/link";
import { hentAlleInstruktorer } from "@/lib/admin/instruktorer";
import { hentBruker } from "@/lib/auth";
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
import { InstruktorHandlinger } from "@/components/admin/InstruktorHandlinger";
import { InstruktorBrukerSkjema } from "@/components/admin/InstruktorBrukerSkjema";

export default async function AdminInstruktorer() {
  const [instruktorer, auth] = await Promise.all([
    hentAlleInstruktorer(),
    hentBruker(),
  ]);
  const erAdmin = auth?.profil.rolle === "admin";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Instruktører ({instruktorer.length})
        </h2>
        <Link
          href="/admin/instruktorer/ny"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          + Profil uten innlogging
        </Link>
      </div>

      {erAdmin ? (
        <div className="mt-6">
          <InstruktorBrukerSkjema />
        </div>
      ) : null}

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
                <TableHead>Innlogging</TableHead>
                <TableHead>Bio</TableHead>
                {erAdmin ? <TableHead className="text-right">Handlinger</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {instruktorer.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.navn}</TableCell>
                  <TableCell>
                    {i.bruker_id ? (
                      <Badge>Ja</Badge>
                    ) : (
                      <Badge variant="secondary">Nei</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {i.bio || "—"}
                  </TableCell>
                  {erAdmin ? (
                    <TableCell>
                      <InstruktorHandlinger id={i.id} navn={i.navn} />
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
