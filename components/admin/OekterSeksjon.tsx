"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { serieSchema, type SerieFormData } from "@/lib/validation/oekt";
import { genererSerie, settOektStatus, slettOekt } from "@/lib/admin/oekter";
import type { KursOekt } from "@/types/database";
import { formatDato } from "@/lib/format";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function OekterSeksjon({
  kursId,
  oekter,
}: {
  kursId: string;
  oekter: KursOekt[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<SerieFormData>({
    resolver: zodResolver(serieSchema),
    defaultValues: {
      start_dato: "",
      start_tid: "",
      slutt_tid: "",
      antall_uker: "8",
    },
  });

  function generer(values: SerieFormData) {
    startTransition(async () => {
      const res = await genererSerie(kursId, values);
      if (res.ok) {
        toast.success(`${res.antall} økter opprettet`);
        form.reset({ start_dato: "", start_tid: "", slutt_tid: "", antall_uker: "8" });
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  function toggleStatus(o: KursOekt) {
    startTransition(async () => {
      const ny = o.status === "avlyst" ? "planlagt" : "avlyst";
      const res = await settOektStatus(o.id, ny, kursId);
      if (res.ok) router.refresh();
      else toast.error(res.feil);
    });
  }

  function slett(id: string) {
    startTransition(async () => {
      const res = await slettOekt(id, kursId);
      if (res.ok) {
        toast.success("Økt slettet");
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-lg font-semibold">Økter</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Generer en ukentlig serie. Øktene blokkerer utleie-kalenderen. Du kan
        avlyse enkeltuker uten å slette dem.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(generer)}
          className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border bg-muted/30 p-4"
        >
          <FormField
            control={form.control}
            name="start_dato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Første dato</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_tid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fra</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slutt_tid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Til</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="antall_uker"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Antall uker</FormLabel>
                <FormControl>
                  <Input inputMode="numeric" className="w-24" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={pending}>
            Generer serie
          </Button>
        </form>
      </Form>

      {oekter.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Ingen økter ennå.
        </p>
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
              {oekter.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{formatDato(o.dato)}</TableCell>
                  <TableCell>
                    {o.start_tid.slice(0, 5)}–{o.slutt_tid.slice(0, 5)}
                  </TableCell>
                  <TableCell>
                    {o.status === "avlyst" ? (
                      <Badge variant="destructive">Avlyst</Badge>
                    ) : o.status === "gjennomfort" ? (
                      <Badge variant="secondary">Gjennomført</Badge>
                    ) : (
                      <Badge>Planlagt</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(o)}
                      disabled={pending}
                    >
                      {o.status === "avlyst" ? "Gjenåpne" : "Avlys"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => slett(o.id)}
                      disabled={pending}
                    >
                      Slett
                    </Button>
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
