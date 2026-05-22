"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { glemtPassordSchema, type GlemtPassordData } from "@/lib/validation/auth";
import { sendGlemtPassord } from "@/lib/actions/auth";
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

export function GlemtPassordForm() {
  const [pending, startTransition] = useTransition();
  const [sendt, setSendt] = useState(false);

  const form = useForm<GlemtPassordData>({
    resolver: zodResolver(glemtPassordSchema),
    defaultValues: { epost: "" },
  });

  function onSubmit(values: GlemtPassordData) {
    startTransition(async () => {
      await sendGlemtPassord(values);
      setSendt(true);
    });
  }

  if (sendt) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm">
        <p>
          Hvis det finnes en konto med denne e-posten, har vi sendt en lenke for
          å tilbakestille passordet. Sjekk innboksen.
        </p>
        <Link href="/login" className="mt-4 inline-block font-medium hover:underline">
          Til innlogging
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="epost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-post</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sender..." : "Send tilbakestillingslenke"}
        </Button>
      </form>
    </Form>
  );
}
