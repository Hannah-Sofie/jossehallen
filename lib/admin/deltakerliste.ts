"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendMassEpostMelding } from "@/lib/email/send";
import type { Kurspaamelding, Kurs } from "@/types/database";

export type DeltakerlisteResultat = {
  kurs: Kurs;
  deltakere: Kurspaamelding[];
} | null;

export async function hentDeltakerliste(
  kursId: string,
): Promise<DeltakerlisteResultat> {
  const supabase = await createClient();
  const [{ data: kurs }, { data: paam }] = await Promise.all([
    supabase.from("kurs").select("*").eq("id", kursId).maybeSingle(),
    supabase
      .from("kurspaameldinger")
      .select("*")
      .eq("kurs_id", kursId)
      .order("status")
      .order("opprettet"),
  ]);
  if (!kurs) return null;
  return { kurs, deltakere: paam ?? [] };
}

export async function lagreNotat(
  paameldingId: string,
  notat: string,
): Promise<{ ok: true } | { ok: false; feil: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("kurspaameldinger")
    .update({ notat })
    .eq("id", paameldingId);
  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/paameldinger");
  return { ok: true };
}

export async function sendMassEpost(
  kursId: string,
  emne: string,
  melding: string,
): Promise<{ ok: true; antall: number } | { ok: false; feil: string }> {
  if (!emne.trim() || !melding.trim())
    return { ok: false, feil: "Emne og melding er påkrevd." };

  const supabase = await createClient();
  const { data: kurs } = await supabase
    .from("kurs")
    .select("navn")
    .eq("id", kursId)
    .maybeSingle();
  if (!kurs) return { ok: false, feil: "Fant ikke kurset." };

  // Mottakere: bekreftede + venter_betaling (ikke avbrutt/venteliste)
  const { data: deltakere } = await supabase
    .from("kurspaameldinger")
    .select("epost, fornavn")
    .eq("kurs_id", kursId)
    .in("status", ["venter_betaling", "bekreftet"]);

  const mottakere = [...new Set((deltakere ?? []).map((d) => d.epost))];
  if (mottakere.length === 0)
    return { ok: false, feil: "Ingen aktive deltakere å sende til." };

  let sendt = 0;
  for (const epost of mottakere) {
    const res = await sendMassEpostMelding(epost, emne, melding, kurs.navn);
    if (res.sendt) sendt++;
  }
  return { ok: true, antall: sendt };
}
