"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { instruktorSchema } from "@/lib/validation/instruktor";
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
  const { error } = await supabase.from("instruktorer").delete().eq("id", id);
  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/instruktorer");
  return { ok: true };
}
