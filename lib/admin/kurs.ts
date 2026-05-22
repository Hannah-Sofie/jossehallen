"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { kursSchema } from "@/lib/validation/kurs";
import type { Kurs } from "@/types/database";

export type AdminResultat =
  | { ok: true; id?: string }
  | { ok: false; feil: string };

function tilRad(data: ReturnType<typeof kursSchema.parse>) {
  return {
    navn: data.navn,
    beskrivelse: data.beskrivelse,
    instruktor_id: data.instruktor_id === "" ? null : data.instruktor_id,
    bilde_url: data.bilde_url === "" ? null : data.bilde_url,
    nivaa: data.nivaa,
    sted: data.sted,
    tidspunkt: data.tidspunkt,
    hva_laerer: data.hva_laerer,
    ta_med: data.ta_med,
    start_dato: data.start_dato,
    slutt_dato: data.slutt_dato === "" ? null : data.slutt_dato,
    pris: Number.parseInt(data.pris, 10),
    maks_deltakere: Number.parseInt(data.maks_deltakere, 10),
    aktiv: data.aktiv,
  };
}

export async function opprettKurs(input: unknown): Promise<AdminResultat> {
  const parsed = kursSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kurs")
    .insert(tilRad(parsed.data))
    .select("id")
    .single();

  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/kurs");
  revalidatePath("/kurs");
  return { ok: true, id: data.id };
}

export async function oppdaterKurs(
  id: string,
  input: unknown,
): Promise<AdminResultat> {
  const parsed = kursSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("kurs")
    .update(tilRad(parsed.data))
    .eq("id", id);

  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/kurs");
  revalidatePath("/kurs");
  revalidatePath(`/kurs/${id}`);
  return { ok: true, id };
}

export async function slettKurs(id: string): Promise<AdminResultat> {
  const supabase = await createClient();
  const { error } = await supabase.from("kurs").delete().eq("id", id);
  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/kurs");
  revalidatePath("/kurs");
  return { ok: true };
}

export async function settAktiv(
  id: string,
  aktiv: boolean,
): Promise<AdminResultat> {
  const supabase = await createClient();
  const { error } = await supabase.from("kurs").update({ aktiv }).eq("id", id);
  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/kurs");
  revalidatePath("/kurs");
  return { ok: true };
}

/** Alle kurs (også inaktive) for admin-liste. */
export async function hentAlleKursAdmin(): Promise<Kurs[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("kurs")
    .select("*")
    .order("start_dato", { ascending: false });
  return data ?? [];
}
