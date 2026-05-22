import { createClient } from "@/lib/supabase/server";
import type { TilgjengeligTid } from "@/types/database";

export type DagMedTider = {
  dato: string;
  tider: TilgjengeligTid[];
};

/**
 * Kommende tider (i dag og fremover), gruppert per dato.
 * Inkluderer både ledige og bookede (bookede vises som opptatt).
 */
export async function hentKommendeTider(): Promise<DagMedTider[]> {
  const supabase = await createClient();
  const iDag = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("tilgjengelige_tider")
    .select("*")
    .gte("dato", iDag)
    .order("dato", { ascending: true })
    .order("start_tid", { ascending: true });

  const grupper = new Map<string, TilgjengeligTid[]>();
  for (const t of data ?? []) {
    const liste = grupper.get(t.dato) ?? [];
    liste.push(t);
    grupper.set(t.dato, liste);
  }

  return Array.from(grupper.entries()).map(([dato, tider]) => ({ dato, tider }));
}
