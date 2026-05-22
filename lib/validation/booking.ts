import { z } from "zod";

const telefonRegex = /^(?:\+47\s?)?(?:\d\s?){8}$/;

export const bookingSchema = z.object({
  tid_id: z.string().uuid(),
  fornavn: z.string().trim().min(1, "Fornavn er påkrevd").max(80),
  etternavn: z.string().trim().min(1, "Etternavn er påkrevd").max(80),
  epost: z.string().trim().email("Ugyldig e-postadresse"),
  telefon: z.string().trim().regex(telefonRegex, "Telefon må være 8 siffer"),
  formaal: z.string().trim().max(500),
  vilkar: z.boolean().refine((v) => v === true, "Du må godta vilkårene"),
});

export type BookingData = z.infer<typeof bookingSchema>;
