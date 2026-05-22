"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  instruktorBrukerSchema,
  type InstruktorBrukerData,
} from "@/lib/validation/instruktorBruker";
import { opprettInstruktorBruker } from "@/lib/admin/instruktorer";
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

export function InstruktorBrukerSkjema() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<InstruktorBrukerData>({
    resolver: zodResolver(instruktorBrukerSchema),
    defaultValues: {
      fornavn: "",
      etternavn: "",
      epost: "",
      passord: "",
      bio: "",
    },
  });

  function onSubmit(values: InstruktorBrukerData) {
    startTransition(async () => {
      const res = await opprettInstruktorBruker(values);
      if (res.ok) {
        toast.success("Instruktør opprettet med innlogging");
        form.reset();
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border bg-muted/30 p-4"
      >
        <p className="text-sm font-medium">Opprett instruktør med innlogging</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fornavn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fornavn</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="epost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-post</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passord"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Midlertidig passord</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio (valgfritt)</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Oppretter..." : "Opprett instruktør"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Instruktøren logger inn med e-post + det midlertidige passordet, og kan
          endre passord på sin egen profil.
        </p>
      </form>
    </Form>
  );
}
