"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { hentBruker } from "@/lib/auth";
import { instruktorSchema } from "@/lib/validation/instruktor";
import { instruktorBrukerSchema } from "@/lib/validation/instruktorBruker";
import type { Instruktor } from "@/types/database";

export type AdminResultat =
  | { ok: true; id?: string }
  | { ok: false; feil: string };

export async function hentAlleInstruktorer(): Promise<Instruktor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("instruktorer")
    .select("*")
    .order("navn");
  return data ?? [];
}

export async function opprettInstruktor(input: unknown): Promise<AdminResultat> {
  const parsed = instruktorSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("instruktorer")
    .insert({
      navn: parsed.data.navn,
      bio: parsed.data.bio,
      bilde_url: parsed.data.bilde_url === "" ? null : parsed.data.bilde_url,
    })
    .select("id")
    .single();
  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/instruktorer");
  return { ok: true, id: data.id };
}

export async function oppdaterInstruktor(
  id: string,
  input: unknown,
): Promise<AdminResultat> {
  const parsed = instruktorSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("instruktorer")
    .update({
      navn: parsed.data.navn,
      bio: parsed.data.bio,
      bilde_url: parsed.data.bilde_url === "" ? null : parsed.data.bilde_url,
    })
    .eq("id", id);
  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/instruktorer");
  return { ok: true, id };
}

export async function slettInstruktor(id: string): Promise<AdminResultat> {
  const supabase = await createClient();
  // Finn evt. tilknyttet bruker
  const { data: instr } = await supabase
    .from("instruktorer")
    .select("bruker_id")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("instruktorer").delete().eq("id", id);
  if (error) return { ok: false, feil: error.message };

  // Slett tilknyttet auth-bruker (cascade fjerner brukerprofil)
  if (instr?.bruker_id) {
    const admin = createAdminClient();
    await admin.auth.admin.deleteUser(instr.bruker_id);
  }

  revalidatePath("/admin/instruktorer");
  return { ok: true };
}

/**
 * Oppretter en instruktør MED innlogging: lager auth-bruker, setter rolle,
 * og kobler en instruktør-profil. Kun admin.
 */
export async function opprettInstruktorBruker(
  input: unknown,
): Promise<AdminResultat> {
  const auth = await hentBruker();
  if (!auth || auth.profil.rolle !== "admin")
    return { ok: false, feil: "Kun admin kan opprette instruktører." };

  const parsed = instruktorBrukerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };
  const d = parsed.data;

  const admin = createAdminClient();
  const { data: created, error } = await admin.auth.admin.createUser({
    email: d.epost.toLowerCase(),
    password: d.passord,
    email_confirm: true,
    user_metadata: { fornavn: d.fornavn, etternavn: d.etternavn },
  });
  if (error || !created.user) {
    if (error?.message.toLowerCase().includes("already"))
      return { ok: false, feil: "Det finnes allerede en bruker med denne e-posten." };
    return { ok: false, feil: "Kunne ikke opprette bruker." };
  }

  const userId = created.user.id;

  // Sett rolle = instruktor (trigger har laget profil med rolle 'bruker')
  await admin
    .from("brukerprofil")
    .update({ rolle: "instruktor", fornavn: d.fornavn, etternavn: d.etternavn })
    .eq("bruker_id", userId);

  // Opprett tilknyttet instruktør-profil
  const { error: insErr } = await admin.from("instruktorer").insert({
    navn: `${d.fornavn} ${d.etternavn}`.trim(),
    bio: d.bio,
    bruker_id: userId,
  });
  if (insErr) {
    // Rull tilbake brukeren hvis profilen feilet
    await admin.auth.admin.deleteUser(userId);
    return { ok: false, feil: "Kunne ikke opprette instruktør-profil." };
  }

  revalidatePath("/admin/instruktorer");
  return { ok: true, id: userId };
}
