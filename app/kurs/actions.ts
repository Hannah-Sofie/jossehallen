"use server";

import { createClient } from "@/lib/supabase/server";
import { hentKurs } from "@/lib/kurs";
import { paameldingSchema } from "@/lib/validation/paamelding";
import { lagBetalingsinfo, type Betalingsinfo } from "@/lib/betaling";
import { sendKursBekreftelse } from "@/lib/email/send";

export type PaameldingResultat =
  | { ok: true; venteliste: boolean; betaling: Betalingsinfo }
  | { ok: false; feil: string };

export async function meldPaaKurs(
  formData: unknown,
): Promise<PaameldingResultat> {
  const parsed = paameldingSchema.safeParse(formData);
  if (!parsed.success) {
    return { ok: false, feil: "Skjemaet inneholder feil. Sjekk feltene." };
  }
  const d = parsed.data;

  // Hent kurs + ledige plasser fra view (anon-trygg)
  const kurs = await hentKurs(d.kurs_id);
  if (!kurs || !kurs.aktiv) {
    return { ok: false, feil: "Fant ikke kurset, eller det er ikke åpent." };
  }

  const venteliste = kurs.ledige_plasser <= 0;

  const supabase = await createClient();
  const { data: rad, error } = await supabase
    .from("kurspaameldinger")
    .insert({
      kurs_id: d.kurs_id,
      fornavn: d.fornavn,
      etternavn: d.etternavn,
      epost: d.epost.toLowerCase(),
      telefon: d.telefon.replace(/\s+/g, ""),
      adresse: d.adresse,
      postnummer: d.postnummer,
      poststed: d.poststed,
      hund_navn: d.hund_navn,
      hund_alder: d.hund_alder === "" ? null : Number.parseInt(d.hund_alder, 10),
      hund_rase: d.hund_rase,
      kastrert: d.kastrert,
      kommentar: d.kommentar,
      status: venteliste ? "venteliste" : "venter_betaling",
      vilkar_godtatt_dato: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !rad) {
    return {
      ok: false,
      feil: "Noe gikk galt ved lagring. Prøv igjen, eller kontakt oss.",
    };
  }

  const betaling = lagBetalingsinfo(rad.id, kurs.pris);

  // Send bekreftelse — feiler aldri hardt (påmelding er allerede lagret).
  await sendKursBekreftelse(d.epost.toLowerCase(), {
    fornavn: d.fornavn,
    kursNavn: kurs.navn,
    startDato: kurs.start_dato,
    sluttDato: kurs.slutt_dato,
    tidspunkt: kurs.tidspunkt,
    sted: kurs.sted,
    venteliste,
    betaling,
  });

  return { ok: true, venteliste, betaling };
}
