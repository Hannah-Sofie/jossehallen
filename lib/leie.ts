import { createClient } from "@/lib/supabase/server";

export type LeieSlot = {
  type: "ledig" | "booket" | "kurs";
  id: string;
  start_tid: string;
  slutt_tid: string;
  kursNavn?: string;
};

export type DagMedTider = {
  dato: string;
  slots: LeieSlot[];
};

/**
 * Kommende tider (i dag og fremover), gruppert per dato.
 * Slår sammen utleietider (ledig/booket) og kursøkter (opptatt av kurs).
 */
export async function hentKommendeTider(): Promise<DagMedTider[]> {
  const supabase = await createClient();
  const iDag = new Date().toISOString().slice(0, 10);

  const [tiderRes, oekterRes, kursRes] = await Promise.all([
    supabase
      .from("tilgjengelige_tider")
      .select("*")
      .gte("dato", iDag),
    supabase
      .from("kurs_oekter")
      .select("*")
      .eq("status", "planlagt")
      .gte("dato", iDag),
    supabase.from("kurs").select("id, navn"),
  ]);

  const kursMap = new Map((kursRes.data ?? []).map((k) => [k.id, k.navn]));
  const grupper = new Map<string, LeieSlot[]>();

  for (const t of tiderRes.data ?? []) {
    const liste = grupper.get(t.dato) ?? [];
    liste.push({
      type: t.ledig ? "ledig" : "booket",
      id: t.id,
      start_tid: t.start_tid,
      slutt_tid: t.slutt_tid,
    });
    grupper.set(t.dato, liste);
  }

  for (const o of oekterRes.data ?? []) {
    const liste = grupper.get(o.dato) ?? [];
    liste.push({
      type: "kurs",
      id: o.id,
      start_tid: o.start_tid,
      slutt_tid: o.slutt_tid,
      kursNavn: kursMap.get(o.kurs_id) ?? "Kurs",
    });
    grupper.set(o.dato, liste);
  }

  return Array.from(grupper.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dato, slots]) => ({
      dato,
      slots: slots.sort((a, b) => a.start_tid.localeCompare(b.start_tid)),
    }));
}
