import { z } from "zod";

export const pinkodeSchema = z.object({
  kode: z
    .string()
    .trim()
    .regex(/^\d{4,8}$/, "Koden må være 4–8 siffer"),
  notat: z.string().trim().max(200),
});

export type PinkodeFormData = z.infer<typeof pinkodeSchema>;
