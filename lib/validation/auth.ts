import { z } from "zod";

const telefonRegex = /^(?:\+47\s?)?(?:\d\s?){8}$/;
const postnummerRegex = /^\d{4}$/;

export const loginSchema = z.object({
  epost: z.string().trim().email("Ugyldig e-postadresse"),
  passord: z.string().min(1, "Passord er påkrevd"),
});
export type LoginData = z.infer<typeof loginSchema>;

export const registrerSchema = z
  .object({
    fornavn: z.string().trim().min(1, "Fornavn er påkrevd").max(80),
    etternavn: z.string().trim().min(1, "Etternavn er påkrevd").max(80),
    epost: z.string().trim().email("Ugyldig e-postadresse"),
    telefon: z.string().trim().regex(telefonRegex, "Telefon må være 8 siffer"),
    adresse: z.string().trim().max(120),
    postnummer: z
      .string()
      .trim()
      .regex(postnummerRegex, "Postnummer må være 4 siffer")
      .or(z.literal("")),
    poststed: z.string().trim().max(80),
    passord: z.string().min(8, "Passord må være minst 8 tegn").max(72),
    passordBekreft: z.string(),
  })
  .refine((d) => d.passord === d.passordBekreft, {
    message: "Passordene er ikke like",
    path: ["passordBekreft"],
  });
export type RegistrerData = z.infer<typeof registrerSchema>;

export const glemtPassordSchema = z.object({
  epost: z.string().trim().email("Ugyldig e-postadresse"),
});
export type GlemtPassordData = z.infer<typeof glemtPassordSchema>;

export const nyttPassordSchema = z
  .object({
    passord: z.string().min(8, "Passord må være minst 8 tegn").max(72),
    passordBekreft: z.string(),
  })
  .refine((d) => d.passord === d.passordBekreft, {
    message: "Passordene er ikke like",
    path: ["passordBekreft"],
  });
export type NyttPassordData = z.infer<typeof nyttPassordSchema>;
