"use client";

import { useState, useTransition, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { bookingSchema, type BookingData } from "@/lib/validation/booking";
import { bookTid } from "@/app/leie/actions";
import { BetalingsInfo } from "@/components/BetalingsInfo";
import type { Betalingsinfo } from "@/lib/betaling";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

type Profil = {
  fornavn: string;
  etternavn: string;
  telefon: string;
  epost: string;
};

export function BookingDialog({
  tidId,
  tidLabel,
  profil,
  trigger,
}: {
  tidId: string;
  tidLabel: string;
  profil: Profil;
  trigger: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [betaling, setBetaling] = useState<Betalingsinfo | null>(null);
  const [pending, startTransition] = useTransition();

  const form = useForm<BookingData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tid_id: tidId,
      fornavn: profil.fornavn,
      etternavn: profil.etternavn,
      epost: profil.epost,
      telefon: profil.telefon,
      formaal: "",
      vilkar: false,
    },
  });

  function håndterÅpning(ny: boolean) {
    setOpen(ny);
    if (!ny) setTimeout(() => setBetaling(null), 150);
  }

  function onSubmit(values: BookingData) {
    startTransition(async () => {
      const res = await bookTid(values);
      if (res.ok) {
        setBetaling(res.betaling);
        toast.success("Booking registrert!");
      } else {
        toast.error(res.feil);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={håndterÅpning}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        {betaling ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Booking registrert
              </DialogTitle>
              <DialogDescription>
                {tidLabel}. Du har fått en bekreftelse på e-post. PIN-kode til
                døren vises på Min side rundt booking-tidspunktet.
              </DialogDescription>
            </DialogHeader>
            <BetalingsInfo info={betaling} />
            <DialogFooter>
              <DialogClose render={<Button>Lukk</Button>} />
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Book hallen</DialogTitle>
              <DialogDescription>{tidLabel}</DialogDescription>
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

                <div className="grid grid-cols-2 gap-3">
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
                    name="telefon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="formaal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formål (valgfritt)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder="f.eks. egentrening, lek, klubbøkt"
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
                    {pending ? "Booker..." : "Bekreft booking"}
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
