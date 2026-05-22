import { z } from "zod";

export const instruktorSchema = z.object({
  navn: z.string().trim().min(1, "Navn er påkrevd").max(120),
  bio: z.string().trim().max(3000),
  bilde_url: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https?:\/\/.+/.test(v), "Må være en gyldig URL"),
});

export type InstruktorFormData = z.infer<typeof instruktorSchema>;
