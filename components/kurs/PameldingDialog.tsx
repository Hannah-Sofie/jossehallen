"use client";

import { useState, useTransition, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

import {
  paameldingSchema,
  type PaameldingData,
} from "@/lib/validation/paamelding";
import { meldPaaKurs } from "@/app/kurs/actions";
import { BetalingsInfo } from "@/components/BetalingsInfo";
import type { Betalingsinfo } from "@/lib/betaling";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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

type Props = {
  kursId: string;
  kursNavn: string;
  fullt: boolean;
  trigger: ReactElement;
};

type Suksess = { venteliste: boolean; betaling: Betalingsinfo };

export function PameldingDialog({ kursId, kursNavn, fullt, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [suksess, setSuksess] = useState<Suksess | null>(null);
  const [pending, startTransition] = useTransition();

  const form = useForm<PaameldingData>({
    resolver: zodResolver(paameldingSchema),
    defaultValues: {
      kurs_id: kursId,
      fornavn: "",
      etternavn: "",
      epost: "",
      telefon: "",
      adresse: "",
      postnummer: "",
      poststed: "",
      hund_navn: "",
      hund_alder: "",
      hund_rase: "",
      kastrert: false,
      kommentar: "",
      vilkar: false,
    },
  });

  function håndterÅpning(nyTilstand: boolean) {
    setOpen(nyTilstand);
    if (!nyTilstand) {
      // Nullstill når dialogen lukkes
      setTimeout(() => {
        setSuksess(null);
        form.reset();
      }, 150);
    }
  }

  function onSubmit(values: PaameldingData) {
    startTransition(async () => {
      const res = await meldPaaKurs(values);
      if (res.ok) {
        setSuksess({ venteliste: res.venteliste, betaling: res.betaling });
        toast.success(
          res.venteliste ? "Du er satt på venteliste." : "Påmelding registrert!",
        );
      } else {
        toast.error(res.feil);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={håndterÅpning}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {suksess ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                {suksess.venteliste ? "På venteliste" : "Påmelding registrert"}
              </DialogTitle>
              <DialogDescription>
                {suksess.venteliste
                  ? "Kurset er fullt, men du står nå på venteliste. Vi kontakter deg om en plass blir ledig. Du har også fått en e-post."
                  : "Takk! Vi har sendt en bekreftelse på e-post. Fullfør betalingen for å sikre plassen."}
              </DialogDescription>
            </DialogHeader>

            {!suksess.venteliste ? (
              <div className="mt-2">
                <BetalingsInfo info={suksess.betaling} />
              </div>
            ) : null}

            <DialogFooter>
              <DialogClose render={<Button>Lukk</Button>} />
            </DialogFooter>
          </>
        ) : (
          <>
        <DialogHeader>
          <DialogTitle>
            {fullt ? "Sett på venteliste" : "Meld på"}: {kursNavn}
          </DialogTitle>
          <DialogDescription>
            {fullt
              ? "Kurset er fullt. Fyll ut så setter vi deg på venteliste."
              : "Fyll ut skjemaet for å melde på deg og hunden din."}
          </DialogDescription>
        </DialogHeader>

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
                      <Input {...field} autoComplete="given-name" />
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
                      <Input {...field} autoComplete="family-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="epost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-post</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} autoComplete="email" />
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
                      <Input type="tel" {...field} autoComplete="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="street-address" />
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
                      <Input {...field} inputMode="numeric" maxLength={4} autoComplete="postal-code" />
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
                    <FormLabel>Poststed</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="address-level2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <FormField
                control={form.control}
                name="hund_navn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hundens navn</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hund_alder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alder (år)</FormLabel>
                    <FormControl>
                      <Input {...field} inputMode="numeric" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hund_rase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rase</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kastrert"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0 font-normal">
                    Hunden er kastrert/sterilisert
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kommentar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kommentar / hensyn (valgfritt)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Allergier, redsler, annet vi bør vite..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vilkar"
              render={({ field }) => (
                <FormItem className="flex items-start gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="!mt-0 font-normal">
                      Jeg godtar{" "}
                      <Link href="/vilkar" target="_blank" className="underline">
                        vilkårene
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending
                  ? "Sender..."
                  : fullt
                    ? "Sett meg på venteliste"
                    : "Send påmelding"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
