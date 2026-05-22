"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { hentBruker } from "@/lib/auth";
import { profilSchema, byttPassordSchema } from "@/lib/validation/profil";
import { instruktorSchema } from "@/lib/validation/instruktor";

export type Resultat = { ok: true } | { ok: false; feil: string };

export async function oppdaterEgenProfil(input: unknown): Promise<Resultat> {
  const parsed = profilSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };

  const auth = await hentBruker();
  if (!auth) return { ok: false, feil: "Ikke innlogget." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("brukerprofil")
    .update({ ...parsed.data, oppdatert: new Date().toISOString() })
    .eq("bruker_id", auth.user.id);
  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/profil");
  return { ok: true };
}

export async function oppdaterEgenInstruktorProfil(
  input: unknown,
): Promise<Resultat> {
  const parsed = instruktorSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };

  const auth = await hentBruker();
  if (!auth) return { ok: false, feil: "Ikke innlogget." };

  const supabase = await createClient();
  // RLS (instruktorer_egen_update) sikrer at kun egen rad oppdateres
  const { error } = await supabase
    .from("instruktorer")
    .update({
      navn: parsed.data.navn,
      bio: parsed.data.bio,
      bilde_url: parsed.data.bilde_url === "" ? null : parsed.data.bilde_url,
    })
    .eq("bruker_id", auth.user.id);
  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/profil");
  revalidatePath("/om");
  return { ok: true };
}

export async function byttPassord(input: unknown): Promise<Resultat> {
  const parsed = byttPassordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.passord,
  });
  if (error) return { ok: false, feil: "Kunne ikke endre passord." };
  return { ok: true };
}
