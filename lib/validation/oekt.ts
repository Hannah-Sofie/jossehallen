import { z } from "zod";

export const serieSchema = z
  .object({
    start_dato: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Velg startdato"),
    start_tid: z.string().regex(/^\d{2}:\d{2}$/, "Velg starttid"),
    slutt_tid: z.string().regex(/^\d{2}:\d{2}$/, "Velg sluttid"),
    antall_uker: z.string().regex(/^([1-9]|[1-4]\d|5[0-2])$/, "1–52 uker"),
  })
  .refine((d) => d.start_tid < d.slutt_tid, {
    message: "Sluttid må være etter starttid",
    path: ["slutt_tid"],
  });

export type SerieFormData = z.infer<typeof serieSchema>;
