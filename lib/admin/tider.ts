"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { tidSchema } from "@/lib/validation/tid";
import type { TilgjengeligTid } from "@/types/database";

export type AdminResultat = { ok: true } | { ok: false; feil: string };

export async function hentTider(): Promise<TilgjengeligTid[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tilgjengelige_tider")
    .select("*")
    .order("dato", { ascending: true })
    .order("start_tid", { ascending: true });
  return data ?? [];
}

export async function opprettTid(input: unknown): Promise<AdminResultat> {
  const parsed = tidSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };

  const supabase = await createClient();
  const { error } = await supabase.from("tilgjengelige_tider").insert({
    dato: parsed.data.dato,
    start_tid: parsed.data.start_tid,
    slutt_tid: parsed.data.slutt_tid,
  });
  if (error) {
    if (error.code === "23505")
      return { ok: false, feil: "Denne tiden finnes allerede." };
    return { ok: false, feil: error.message };
  }
  revalidatePath("/admin/tider");
  revalidatePath("/leie");
  return { ok: true };
}

export async function slettTid(id: string): Promise<AdminResultat> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tilgjengelige_tider")
    .delete()
    .eq("id", id);
  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/tider");
  revalidatePath("/leie");
  return { ok: true };
}
