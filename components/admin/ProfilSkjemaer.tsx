"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  profilSchema,
  byttPassordSchema,
  type ProfilData,
  type ByttPassordData,
} from "@/lib/validation/profil";
import { instruktorSchema, type InstruktorFormData } from "@/lib/validation/instruktor";
import {
  oppdaterEgenProfil,
  oppdaterEgenInstruktorProfil,
  byttPassord,
} from "@/lib/admin/profil";
import type { Brukerprofil, Instruktor } from "@/types/database";
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

export function ProfilSkjemaer({
  profil,
  instruktor,
}: {
  profil: Brukerprofil;
  instruktor: Instruktor | null;
}) {
  return (
    <div className="max-w-xl space-y-12">
      <KontaktForm profil={profil} />
      {instruktor ? <InstruktorForm instruktor={instruktor} /> : null}
      <PassordForm />
    </div>
  );
}

function KontaktForm({ profil }: { profil: Brukerprofil }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<ProfilData>({
    resolver: zodResolver(profilSchema),
    defaultValues: {
      fornavn: profil.fornavn,
      etternavn: profil.etternavn,
      telefon: profil.telefon,
      adresse: profil.adresse,
      postnummer: profil.postnummer,
      poststed: profil.poststed,
    },
  });

  function onSubmit(values: ProfilData) {
    startTransition(async () => {
      const res = await oppdaterEgenProfil(values);
      if (res.ok) {
        toast.success("Profil oppdatert");
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  return (
    <section>
      <h2 className="text-lg font-semibold">Kontaktinfo</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Felt form={form} name="fornavn" label="Fornavn" />
            <Felt form={form} name="etternavn" label="Etternavn" />
          </div>
          <Felt form={form} name="telefon" label="Telefon" />
          <Felt form={form} name="adresse" label="Adresse" />
          <div className="grid grid-cols-[1fr_2fr] gap-3">
            <Felt form={form} name="postnummer" label="Postnr." />
            <Felt form={form} name="poststed" label="Poststed" />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Lagrer..." : "Lagre kontaktinfo"}
          </Button>
        </form>
      </Form>
    </section>
  );
}

function InstruktorForm({ instruktor }: { instruktor: Instruktor }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<InstruktorFormData>({
    resolver: zodResolver(instruktorSchema),
    defaultValues: {
      navn: instruktor.navn,
      bio: instruktor.bio,
      bilde_url: instruktor.bilde_url ?? "",
    },
  });

  function onSubmit(values: InstruktorFormData) {
    startTransition(async () => {
      const res = await oppdaterEgenInstruktorProfil(values);
      if (res.ok) {
        toast.success("Instruktørprofil oppdatert");
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  return (
    <section>
      <h2 className="text-lg font-semibold">Instruktørprofil (vises offentlig)</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <Felt form={form} name="navn" label="Visningsnavn" />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio / erfaring</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Felt form={form} name="bilde_url" label="Bilde-URL" />
          <Button type="submit" disabled={pending}>
            {pending ? "Lagrer..." : "Lagre instruktørprofil"}
          </Button>
        </form>
      </Form>
    </section>
  );
}

function PassordForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<ByttPassordData>({
    resolver: zodResolver(byttPassordSchema),
    defaultValues: { passord: "", passordBekreft: "" },
  });

  function onSubmit(values: ByttPassordData) {
    startTransition(async () => {
      const res = await byttPassord(values);
      if (res.ok) {
        toast.success("Passord endret");
        form.reset();
      } else toast.error(res.feil);
    });
  }

  return (
    <section>
      <h2 className="text-lg font-semibold">Bytt passord</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="passord"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nytt passord</FormLabel>
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
                  <FormLabel>Gjenta</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Lagrer..." : "Bytt passord"}
          </Button>
        </form>
      </Form>
    </section>
  );
}

// Liten hjelper for enkle tekstfelt
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Felt({ form, name, label }: { form: any; name: string; label: string }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: { field: object }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
