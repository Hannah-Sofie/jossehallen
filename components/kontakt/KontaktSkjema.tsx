"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";

import { kontaktSchema, type KontaktData } from "@/lib/validation/kontakt";
import { sendKontaktSkjema } from "@/app/kontakt/actions";
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

export function KontaktSkjema() {
  const [pending, startTransition] = useTransition();
  const [sendt, setSendt] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);

  const form = useForm<KontaktData>({
    resolver: zodResolver(kontaktSchema),
    defaultValues: { navn: "", epost: "", telefon: "", melding: "" },
  });

  function onSubmit(values: KontaktData) {
    setFeil(null);
    startTransition(async () => {
      const res = await sendKontaktSkjema(values);
      if (res.ok) {
        setSendt(true);
        form.reset();
      } else {
        setFeil(res.feil);
      }
    });
  }

  if (sendt) {
    return (
      <div className="rounded-3xl border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden />
        <h3 className="mt-4 font-brand text-2xl font-bold tracking-tight">
          Takk for meldingen!
        </h3>
        <p className="mt-2 text-muted-foreground">
          Vi svarer deg så snart vi kan.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-full"
          onClick={() => setSendt(false)}
        >
          Send en ny melding
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="navn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Navn</FormLabel>
              <FormControl>
                <Input autoComplete="name" placeholder="Ditt navn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="epost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-post</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="din@epost.no"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Telefon{" "}
                <span className="font-normal text-muted-foreground">(valgfritt)</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  autoComplete="tel"
                  placeholder="+47 ..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="melding"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Melding</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Hva lurer du på?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {feil ? (
          <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {feil}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full"
          disabled={pending}
        >
          {pending ? (
            "Sender..."
          ) : (
            <>
              Send melding <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
