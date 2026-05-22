import { z } from "zod";

export const instruktorBrukerSchema = z.object({
  fornavn: z.string().trim().min(1, "Fornavn er påkrevd").max(80),
  etternavn: z.string().trim().min(1, "Etternavn er påkrevd").max(80),
  epost: z.string().trim().email("Ugyldig e-postadresse"),
  passord: z.string().min(8, "Midlertidig passord må være minst 8 tegn").max(72),
  bio: z.string().trim().max(3000),
});

export type InstruktorBrukerData = z.infer<typeof instruktorBrukerSchema>;
