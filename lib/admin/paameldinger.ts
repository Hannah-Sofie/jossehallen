"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { lagBetalingsinfo } from "@/lib/betaling";
import { sendKursBekreftelse } from "@/lib/email/send";
import type { Kurspaamelding, PaameldingStatus } from "@/types/database";

export type PaameldingMedKurs = Kurspaamelding & {
  kursNavn: string;
  ventelistePosisjon: number | null;
};

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
  const alle = paamRes.data ?? [];

  // Beregn ventelisteposisjon (FIFO per kurs, eldste først = posisjon 1)
  const posisjon = new Map<string, number>();
  const venteliste = alle
    .filter((p) => p.status === "venteliste")
    .sort((a, b) => a.opprettet.localeCompare(b.opprettet));
  const teller = new Map<string, number>();
  for (const p of venteliste) {
    const n = (teller.get(p.kurs_id) ?? 0) + 1;
    teller.set(p.kurs_id, n);
    posisjon.set(p.id, n);
  }

  return alle.map((p) => ({
    ...p,
    kursNavn: kursMap.get(p.kurs_id) ?? "—",
    ventelistePosisjon: posisjon.get(p.id) ?? null,
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

/**
 * Forfrem en person fra venteliste til vanlig plass (venter_betaling).
 * Sender bekreftelse med betalingsinfo. Resten av ventelisten rykker opp
 * automatisk (posisjon beregnes på nytt ut fra opprettet-rekkefølge).
 */
export async function forfremFraVenteliste(
  id: string,
): Promise<{ ok: true } | { ok: false; feil: string }> {
  const supabase = await createClient();

  const { data: paam, error: hentFeil } = await supabase
    .from("kurspaameldinger")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (hentFeil || !paam) return { ok: false, feil: "Fant ikke påmeldingen." };

  const { error } = await supabase
    .from("kurspaameldinger")
    .update({ status: "venter_betaling", venteliste_posisjon: null })
    .eq("id", id);
  if (error) return { ok: false, feil: error.message };

  // Send bekreftelse med betalingsinfo (graceful)
  const { data: kurs } = await supabase
    .from("kurs")
    .select("*")
    .eq("id", paam.kurs_id)
    .maybeSingle();
  if (kurs) {
    await sendKursBekreftelse(paam.epost, {
      fornavn: paam.fornavn,
      kursNavn: kurs.navn,
      startDato: kurs.start_dato,
      sluttDato: kurs.slutt_dato,
      tidspunkt: kurs.tidspunkt,
      sted: kurs.sted,
      venteliste: false,
      betaling: lagBetalingsinfo(paam.id, kurs.pris),
    });
  }

  revalidatePath("/admin/paameldinger");
  revalidatePath("/kurs");
  return { ok: true };
}
