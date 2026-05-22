"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { pinkodeSchema, type PinkodeFormData } from "@/lib/validation/pinkode";
import { settNyPinkode } from "@/lib/admin/pinkoder";
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

export function PinkodeSkjema() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<PinkodeFormData>({
    resolver: zodResolver(pinkodeSchema),
    defaultValues: { kode: "", notat: "" },
  });

  function onSubmit(values: PinkodeFormData) {
    startTransition(async () => {
      const res = await settNyPinkode(values);
      if (res.ok) {
        toast.success("Ny PIN-kode satt");
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
          name="kode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ny kode (4–8 siffer)</FormLabel>
              <FormControl>
                <Input inputMode="numeric" placeholder="1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notat"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Notat (valgfritt)</FormLabel>
              <FormControl>
                <Input placeholder="f.eks. byttet lås 5. juni" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Lagrer..." : "Sett ny kode"}
        </Button>
      </form>
    </Form>
  );
}
