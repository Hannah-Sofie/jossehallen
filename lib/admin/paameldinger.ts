"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Kurspaamelding, PaameldingStatus } from "@/types/database";

export type PaameldingMedKurs = Kurspaamelding & { kursNavn: string };

export async function hentPaameldinger(): Promise<PaameldingMedKurs[]> {
  const supabase = await createClient();
  const [paamRes, kursRes] = await Promise.all([
    supabase
      .from("kurspaameldinger")
      .select("*")
      .order("opprettet", { ascending: false }),
    supabase.from("kurs").select("*"),
  ]);

  const kursMap = new Map((kursRes.data ?? []).map((k) => [k.id, k.navn]));
  return (paamRes.data ?? []).map((p) => ({
    ...p,
    kursNavn: kursMap.get(p.kurs_id) ?? "—",
  }));
}

export async function endrePaameldingStatus(
  id: string,
  status: PaameldingStatus,
): Promise<{ ok: true } | { ok: false; feil: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("kurspaameldinger")
    .update({ status })
    .eq("id", id);
  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/paameldinger");
  revalidatePath("/kurs");
  return { ok: true };
}
