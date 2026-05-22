"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { kursSchema, type KursFormData } from "@/lib/validation/kurs";
import { opprettKurs, oppdaterKurs } from "@/lib/admin/kurs";
import type { Kurs, Instruktor } from "@/types/database";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function KursSkjema({
  kurs,
  instruktorer,
}: {
  kurs?: Kurs;
  instruktorer: Instruktor[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const erRedigering = Boolean(kurs);

  const form = useForm<KursFormData>({
    resolver: zodResolver(kursSchema),
    defaultValues: {
      navn: kurs?.navn ?? "",
      beskrivelse: kurs?.beskrivelse ?? "",
      instruktor_id: kurs?.instruktor_id ?? "",
      bilde_url: kurs?.bilde_url ?? "",
      nivaa: kurs?.nivaa ?? "alle",
      sted: kurs?.sted ?? "Jossehallen",
      tidspunkt: kurs?.tidspunkt ?? "",
      hva_laerer: kurs?.hva_laerer ?? "",
      ta_med: kurs?.ta_med ?? "",
      start_dato: kurs?.start_dato ?? "",
      slutt_dato: kurs?.slutt_dato ?? "",
      pris: kurs ? String(kurs.pris) : "0",
      maks_deltakere: kurs ? String(kurs.maks_deltakere) : "10",
      aktiv: kurs?.aktiv ?? true,
    },
  });

  function onSubmit(values: KursFormData) {
    startTransition(async () => {
      const res = kurs
        ? await oppdaterKurs(kurs.id, values)
        : await opprettKurs(values);
      if (res.ok) {
        toast.success(erRedigering ? "Kurs oppdatert" : "Kurs opprettet");
        router.push("/admin/kurs");
        router.refresh();
      } else {
        toast.error(res.feil);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
        <FormField
          control={form.control}
          name="navn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Navn</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="beskrivelse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beskrivelse</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="instruktor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instruktør</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ingen valgt" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Ingen</SelectItem>
                    {instruktorer.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.navn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nivaa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivå</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="nybegynner">Nybegynner</SelectItem>
                    <SelectItem value="viderekomne">Viderekomne</SelectItem>
                    <SelectItem value="avansert">Avansert</SelectItem>
                    <SelectItem value="alle">Alle nivåer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="start_dato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Startdato</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slutt_dato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sluttdato (valgfritt)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tidspunkt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tidspunkt (tekst)</FormLabel>
              <FormControl>
                <Input placeholder="f.eks. Mandager 18:00–19:00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="pris"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pris (kr)</FormLabel>
                <FormControl>
                  <Input inputMode="numeric" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maks_deltakere"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maks deltakere</FormLabel>
                <FormControl>
                  <Input inputMode="numeric" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sted"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sted</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bilde_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bilde-URL (valgfritt)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hva_laerer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hva du lærer (valgfritt)</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ta_med"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ta med (valgfritt)</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aktiv"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="!mt-0 font-normal">
                Aktiv (synlig på nettsiden)
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Lagrer..." : erRedigering ? "Lagre endringer" : "Opprett kurs"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/kurs")}
          >
            Avbryt
          </Button>
        </div>
      </form>
    </Form>
  );
}
