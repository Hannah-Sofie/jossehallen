"use server";

import { kontaktSchema } from "@/lib/validation/kontakt";
import { sendKontaktMelding } from "@/lib/email/send";

export type KontaktResultat = { ok: true } | { ok: false; feil: string };

export async function sendKontaktSkjema(
  formData: unknown,
): Promise<KontaktResultat> {
  const parsed = kontaktSchema.safeParse(formData);
  if (!parsed.success) {
    return { ok: false, feil: "Skjemaet inneholder feil. Sjekk feltene." };
  }
  const d = parsed.data;

  const res = await sendKontaktMelding({
    navn: d.navn,
    epost: d.epost.toLowerCase(),
    telefon: d.telefon || undefined,
    melding: d.melding,
  });

  if (!res.sendt) {
    return {
      ok: false,
      feil:
        "Kunne ikke sende meldingen akkurat nå. Ring oss eller send e-post direkte – så hjelper vi deg.",
    };
  }
  return { ok: true };
}
