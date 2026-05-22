"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { tidSchema, type TidFormData } from "@/lib/validation/tid";
import { opprettTid } from "@/lib/admin/tider";
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

export function TidSkjema() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<TidFormData>({
    resolver: zodResolver(tidSchema),
    defaultValues: { dato: "", start_tid: "", slutt_tid: "" },
  });

  function onSubmit(values: TidFormData) {
    startTransition(async () => {
      const res = await opprettTid(values);
      if (res.ok) {
        toast.success("Tid lagt til");
        form.reset();
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/30 p-4"
      >
        <FormField
          control={form.control}
          name="dato"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dato</FormLabel>
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
        <Button type="submit" disabled={pending}>
          {pending ? "Legger til..." : "Legg til tid"}
        </Button>
      </form>
    </Form>
  );
}
