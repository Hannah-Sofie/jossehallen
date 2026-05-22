import { z } from "zod";

export const tidSchema = z
  .object({
    dato: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Velg dato"),
    start_tid: z.string().regex(/^\d{2}:\d{2}$/, "Velg starttid"),
    slutt_tid: z.string().regex(/^\d{2}:\d{2}$/, "Velg sluttid"),
  })
  .refine((d) => d.start_tid < d.slutt_tid, {
    message: "Sluttid må være etter starttid",
    path: ["slutt_tid"],
  });

export type TidFormData = z.infer<typeof tidSchema>;
