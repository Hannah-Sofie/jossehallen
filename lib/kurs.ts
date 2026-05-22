import { createClient } from "@/lib/supabase/server";
import type {
  KursOffentlig,
  Instruktor,
  Nivaa,
  KursOekt,
} from "@/types/database";

/** Aktive kurs sortert etter startdato, med ledige plasser. */
export async function hentAktiveKurs(): Promise<KursOffentlig[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kurs_offentlig")
    .select("*")
    .eq("aktiv", true)
    .order("start_dato", { ascending: true });
  if (error) throw new Error(`Kunne ikke hente kurs: ${error.message}`);
  return data ?? [];
}

/** Ett kurs (uansett aktiv-status) for detaljside. */
export async function hentKurs(id: string): Promise<KursOffentlig | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kurs_offentlig")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function hentInstruktor(
  id: string | null,
): Promise<Instruktor | null> {
  if (!id) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("instruktorer")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return null;
  return data;
}

/** Planlagte økter for et kurs (offentlig — RLS tillater select). */
export async function hentKursOekter(kursId: string): Promise<KursOekt[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("kurs_oekter")
    .select("*")
    .eq("kurs_id", kursId)
    .eq("status", "planlagt")
    .order("dato", { ascending: true })
    .order("start_tid", { ascending: true });
  return data ?? [];
}

export type PlassStatus = {
  label: string;
  variant: "default" | "secondary" | "destructive";
  fullt: boolean;
};

/** Avgjør status-badge ut fra ledige plasser. */
export function plassStatus(ledige: number): PlassStatus {
  if (ledige <= 0)
    return { label: "Fullt – venteliste", variant: "destructive", fullt: true };
  if (ledige <= 3)
    return {
      label: `Få plasser (${ledige} igjen)`,
      variant: "secondary",
      fullt: false,
    };
  return { label: "Ledige plasser", variant: "default", fullt: false };
}

const NIVAA_LABEL: Record<Nivaa, string> = {
  nybegynner: "Nybegynner",
  viderekomne: "Viderekomne",
  avansert: "Avansert",
  alle: "Alle nivåer",
};

export function nivaaLabel(nivaa: Nivaa): string {
  return NIVAA_LABEL[nivaa] ?? nivaa;
}
