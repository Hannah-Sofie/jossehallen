"use server";

import { createClient } from "@/lib/supabase/server";
import { hentBruker } from "@/lib/auth";
import { bookingSchema } from "@/lib/validation/booking";
import { lagBetalingsinfo, leiePris, type Betalingsinfo } from "@/lib/betaling";
import { sendBookingBekreftelse } from "@/lib/email/send";

export type BookingResultat =
  | { ok: true; betaling: Betalingsinfo }
  | { ok: false; feil: string };

export async function bookTid(input: unknown): Promise<BookingResultat> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Sjekk feltene." };
  const d = parsed.data;

  const auth = await hentBruker();
  if (!auth) return { ok: false, feil: "Du må være innlogget for å booke." };

  const supabase = await createClient();

  // Atomisk booking via security-definer-funksjon (hindrer dobbelbooking)
  const { data: bookingId, error } = await supabase.rpc("book_tid", {
    p_tid_id: d.tid_id,
    p_fornavn: d.fornavn,
    p_etternavn: d.etternavn,
    p_epost: d.epost.toLowerCase(),
    p_telefon: d.telefon.replace(/\s+/g, ""),
    p_formaal: d.formaal,
  });

  if (error) {
    if (error.code === "P0001")
      return { ok: false, feil: "Tiden ble nettopp booket av noen andre. Velg en annen." };
    if (error.code === "28000")
      return { ok: false, feil: "Du må være innlogget for å booke." };
    return { ok: false, feil: "Noe gikk galt. Prøv igjen." };
  }

  const betaling = lagBetalingsinfo(String(bookingId), leiePris(), "LEIE");

  // Hent tid-detaljer til e-post
  const { data: tid } = await supabase
    .from("tilgjengelige_tider")
    .select("*")
    .eq("id", d.tid_id)
    .maybeSingle();

  if (tid) {
    await sendBookingBekreftelse(d.epost.toLowerCase(), {
      fornavn: d.fornavn,
      dato: tid.dato,
      startTid: tid.start_tid,
      sluttTid: tid.slutt_tid,
      sted: "Jossehallen",
      betaling,
    });
  }

  return { ok: true, betaling };
}
