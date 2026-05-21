"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registrerSchema,
  glemtPassordSchema,
  nyttPassordSchema,
} from "@/lib/validation/auth";

type Resultat<T = object> = ({ ok: true } & T) | { ok: false; feil: string };

export async function loggInn(
  data: unknown,
  retur?: string,
): Promise<Resultat<{ redirect: string }>> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.epost.toLowerCase(),
    password: parsed.data.passord,
  });
  if (error) return { ok: false, feil: "Feil e-post eller passord." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let mål = retur || "/min-side";
  if (!retur && user) {
    const { data: profil } = await supabase
      .from("brukerprofil")
      .select("rolle")
      .eq("bruker_id", user.id)
      .maybeSingle();
    if (profil?.rolle === "admin" || profil?.rolle === "instruktor") {
      mål = "/admin";
    }
  }
  return { ok: true, redirect: mål };
}

export async function registrer(
  data: unknown,
): Promise<Resultat<{ måBekrefteEpost: boolean }>> {
  const parsed = registrerSchema.safeParse(data);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };
  const d = parsed.data;

  const supabase = await createClient();
  const { data: result, error } = await supabase.auth.signUp({
    email: d.epost.toLowerCase(),
    password: d.passord,
    options: {
      data: {
        fornavn: d.fornavn,
        etternavn: d.etternavn,
        telefon: d.telefon.replace(/\s+/g, ""),
        adresse: d.adresse,
        postnummer: d.postnummer,
        poststed: d.poststed,
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already"))
      return { ok: false, feil: "Det finnes allerede en konto med denne e-posten." };
    return { ok: false, feil: "Noe gikk galt ved registrering. Prøv igjen." };
  }

  // Hvis e-postbekreftelse er på, har bruker ingen aktiv session ennå.
  const måBekrefteEpost = !result.session;
  return { ok: true, måBekrefteEpost };
}

export async function loggUt(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function sendGlemtPassord(data: unknown): Promise<Resultat> {
  const parsed = glemtPassordSchema.safeParse(data);
  if (!parsed.success) return { ok: false, feil: "Ugyldig e-post." };

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await supabase.auth.resetPasswordForEmail(parsed.data.epost.toLowerCase(), {
    redirectTo: `${siteUrl}/tilbakestill-passord`,
  });
  // Returner ok uansett — ikke avslør om e-posten finnes (sikkerhet)
  return { ok: true };
}

export async function settNyttPassord(data: unknown): Promise<Resultat> {
  const parsed = nyttPassordSchema.safeParse(data);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.passord,
  });
  if (error)
    return { ok: false, feil: "Kunne ikke oppdatere passord. Lenken kan være utløpt." };
  return { ok: true };
}
