import { z } from "zod";

const telefonRegex = /^(?:\+47\s?)?(?:\d\s?){8}$/;

export const profilSchema = z.object({
  fornavn: z.string().trim().min(1, "Fornavn er påkrevd").max(80),
  etternavn: z.string().trim().min(1, "Etternavn er påkrevd").max(80),
  telefon: z
    .string()
    .trim()
    .regex(telefonRegex, "Telefon må være 8 siffer")
    .or(z.literal("")),
  adresse: z.string().trim().max(120),
  postnummer: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Postnummer må være 4 siffer")
    .or(z.literal("")),
  poststed: z.string().trim().max(80),
});
export type ProfilData = z.infer<typeof profilSchema>;

export const byttPassordSchema = z
  .object({
    passord: z.string().min(8, "Minst 8 tegn").max(72),
    passordBekreft: z.string(),
  })
  .refine((d) => d.passord === d.passordBekreft, {
    message: "Passordene er ikke like",
    path: ["passordBekreft"],
  });
export type ByttPassordData = z.infer<typeof byttPassordSchema>;
