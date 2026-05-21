import { z } from "zod";

// Skjemaet holdes "rent": input === output (ingen .transform/.default som endrer
// type), slik at react-hook-form + zodResolver typer seg riktig.
// Normalisering (trim av telefon, parsing av alder) gjøres i server action.

export const paameldingSchema = z.object({
  kurs_id: z.string().uuid(),
  fornavn: z.string().trim().min(1, "Fornavn er påkrevd").max(80),
  etternavn: z.string().trim().min(1, "Etternavn er påkrevd").max(80),
  epost: z.string().trim().email("Ugyldig e-postadresse"),
  telefon: z
    .string()
    .trim()
    .regex(/^(?:\+47\s?)?(?:\d\s?){8}$/, "Telefon må være 8 siffer"),
  adresse: z.string().trim().min(1, "Adresse er påkrevd").max(120),
  postnummer: z.string().trim().regex(/^\d{4}$/, "Postnummer må være 4 siffer"),
  poststed: z.string().trim().min(1, "Poststed er påkrevd").max(80),
  hund_navn: z.string().trim().min(1, "Hundens navn er påkrevd").max(80),
  hund_alder: z
    .string()
    .trim()
    .regex(/^(?:\d{1,2})?$/, "Må være et tall (0–30)"),
  hund_rase: z.string().trim().max(80),
  kommentar: z.string().trim().max(1000),
  kastrert: z.boolean(),
  vilkar: z.boolean().refine((v) => v === true, "Du må godta vilkårene"),
});

export type PaameldingData = z.infer<typeof paameldingSchema>;
