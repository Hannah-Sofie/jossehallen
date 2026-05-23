import { z } from "zod";

// Rent skjema (input === output) for react-hook-form + zodResolver.
export const kontaktSchema = z.object({
  navn: z.string().trim().min(1, "Navn er påkrevd").max(80),
  epost: z.string().trim().email("Ugyldig e-postadresse"),
  telefon: z
    .string()
    .trim()
    .max(20)
    .refine(
      (v) => v === "" || /^(?:\+47\s?)?(?:\d\s?){8}$/.test(v),
      "Telefon må være 8 siffer (eller la stå tomt)",
    ),
  melding: z.string().trim().min(5, "Skriv en kort melding").max(2000),
});

export type KontaktData = z.infer<typeof kontaktSchema>;
