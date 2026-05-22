"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  instruktorSchema,
  type InstruktorFormData,
} from "@/lib/validation/instruktor";
import { opprettInstruktor, oppdaterInstruktor } from "@/lib/admin/instruktorer";
import type { Instruktor } from "@/types/database";
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
import { Button } from "@/components/ui/button";

export function InstruktorSkjema({ instruktor }: { instruktor?: Instruktor }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<InstruktorFormData>({
    resolver: zodResolver(instruktorSchema),
    defaultValues: {
      navn: instruktor?.navn ?? "",
      bio: instruktor?.bio ?? "",
      bilde_url: instruktor?.bilde_url ?? "",
    },
  });

  function onSubmit(values: InstruktorFormData) {
    startTransition(async () => {
      const res = instruktor
        ? await oppdaterInstruktor(instruktor.id, values)
        : await opprettInstruktor(values);
      if (res.ok) {
        toast.success(instruktor ? "Instruktør oppdatert" : "Instruktør opprettet");
        router.push("/admin/instruktorer");
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-5">
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
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <div className="flex gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Lagrer..." : instruktor ? "Lagre" : "Opprett"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/instruktorer")}
          >
            Avbryt
          </Button>
        </div>
      </form>
    </Form>
  );
}
