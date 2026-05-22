import { z } from "zod";

export const kursSchema = z.object({
  navn: z.string().trim().min(1, "Navn er påkrevd").max(120),
  beskrivelse: z.string().trim().max(5000),
  instruktor_id: z.string(), // "" = ingen, ellers uuid
  bilde_url: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https?:\/\/.+/.test(v), "Må være en gyldig URL"),
  nivaa: z.enum(["nybegynner", "viderekomne", "avansert", "alle"]),
  sted: z.string().trim().min(1, "Sted er påkrevd").max(120),
  tidspunkt: z.string().trim().max(120),
  hva_laerer: z.string().trim().max(5000),
  ta_med: z.string().trim().max(2000),
  start_dato: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Velg startdato"),
  slutt_dato: z
    .string()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Ugyldig dato"),
  pris: z.string().regex(/^\d+$/, "Pris må være et heltall (kr)"),
  maks_deltakere: z.string().regex(/^[1-9]\d*$/, "Må være minst 1"),
  aktiv: z.boolean(),
});

export type KursFormData = z.infer<typeof kursSchema>;
