"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { registrerSchema, type RegistrerData } from "@/lib/validation/auth";
import { registrer } from "@/lib/actions/auth";
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

export function RegistrerForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [bekreftEpost, setBekreftEpost] = useState(false);

  const form = useForm<RegistrerData>({
    resolver: zodResolver(registrerSchema),
    defaultValues: {
      fornavn: "",
      etternavn: "",
      epost: "",
      telefon: "",
      adresse: "",
      postnummer: "",
      poststed: "",
      passord: "",
      passordBekreft: "",
    },
  });

  function onSubmit(values: RegistrerData) {
    startTransition(async () => {
      const res = await registrer(values);
      if (res.ok) {
        if (res.måBekrefteEpost) {
          setBekreftEpost(true);
        } else {
          toast.success("Konto opprettet!");
          router.push("/min-side");
          router.refresh();
        }
      } else {
        toast.error(res.feil);
      }
    });
  }

  if (bekreftEpost) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6 text-center">
        <h2 className="font-medium">Sjekk e-posten din</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Vi har sendt en bekreftelseslenke til{" "}
          <span className="font-medium text-foreground">
            {form.getValues("epost")}
          </span>
          . Klikk på lenken for å aktivere kontoen, og logg deretter inn.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-medium hover:underline"
        >
          Til innlogging
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="fornavn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fornavn</FormLabel>
                <FormControl>
                  <Input autoComplete="given-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="etternavn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etternavn</FormLabel>
                <FormControl>
                  <Input autoComplete="family-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <FormField
          control={form.control}
          name="telefon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input type="tel" autoComplete="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adresse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse (valgfritt)</FormLabel>
              <FormControl>
                <Input autoComplete="street-address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <FormField
            control={form.control}
            name="postnummer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postnr.</FormLabel>
                <FormControl>
                  <Input inputMode="numeric" maxLength={4} autoComplete="postal-code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="poststed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poststed (valgfritt)</FormLabel>
                <FormControl>
                  <Input autoComplete="address-level2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="passord"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passord</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passordBekreft"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gjenta passord</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Oppretter konto..." : "Registrer deg"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Har du allerede konto?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Logg inn
          </Link>
        </p>
      </form>
    </Form>
  );
}
