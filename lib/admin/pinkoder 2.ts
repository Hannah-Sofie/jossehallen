"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { pinkodeSchema } from "@/lib/validation/pinkode";
import type { Pinkode } from "@/types/database";

export type AdminResultat = { ok: true } | { ok: false; feil: string };

export async function hentPinkoder(): Promise<Pinkode[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pinkoder")
    .select("*")
    .order("gyldig_fra", { ascending: false });
  return data ?? [];
}

export async function settNyPinkode(input: unknown): Promise<AdminResultat> {
  const parsed = pinkodeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Koden må være 4–8 siffer." };

  const supabase = await createClient();
  const naa = new Date().toISOString();

  // Lukk forrige åpne kode
  await supabase
    .from("pinkoder")
    .update({ gyldig_til: naa })
    .is("gyldig_til", null);

  const { error } = await supabase.from("pinkoder").insert({
    kode: parsed.data.kode,
    notat: parsed.data.notat,
    gyldig_fra: naa,
  });
  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/pin");
  return { ok: true };
}
