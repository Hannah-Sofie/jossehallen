"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { serieSchema } from "@/lib/validation/oekt";
import type { KursOekt, OektStatus } from "@/types/database";

export type AdminResultat = { ok: true; antall?: number } | { ok: false; feil: string };

export async function hentOekterForKurs(kursId: string): Promise<KursOekt[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("kurs_oekter")
    .select("*")
    .eq("kurs_id", kursId)
    .order("dato", { ascending: true })
    .order("start_tid", { ascending: true });
  return data ?? [];
}

/** Legger til 'dager' dager på en YYYY-MM-DD-streng (UTC-trygt). */
function leggTilDager(iso: string, dager: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dager);
  return d.toISOString().slice(0, 10);
}

export async function genererSerie(
  kursId: string,
  input: unknown,
): Promise<AdminResultat> {
  const parsed = serieSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };
  const d = parsed.data;
  const uker = Number.parseInt(d.antall_uker, 10);

  const rader = Array.from({ length: uker }, (_, i) => ({
    kurs_id: kursId,
    dato: leggTilDager(d.start_dato, i * 7),
    start_tid: d.start_tid,
    slutt_tid: d.slutt_tid,
  }));

  const supabase = await createClient();
  const { error } = await supabase.from("kurs_oekter").insert(rader);
  if (error) return { ok: false, feil: error.message };

  revalidatePath(`/admin/kurs/${kursId}`);
  revalidatePath("/leie");
  return { ok: true, antall: rader.length };
}

export async function settOektStatus(
  id: string,
  status: OektStatus,
  kursId: string,
): Promise<AdminResultat> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("kurs_oekter")
    .update({ status })
    .eq("id", id);
  if (error) return { ok: false, feil: error.message };
  revalidatePath(`/admin/kurs/${kursId}`);
  revalidatePath("/leie");
  return { ok: true };
}

export async function slettOekt(
  id: string,
  kursId: string,
): Promise<AdminResultat> {
  const supabase = await createClient();
  const { error } = await supabase.from("kurs_oekter").delete().eq("id", id);
  if (error) return { ok: false, feil: error.message };
  revalidatePath(`/admin/kurs/${kursId}`);
  revalidatePath("/leie");
  return { ok: true };
}
