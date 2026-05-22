import { createClient } from "@/lib/supabase/server";
import type { Kurspaamelding, Booking } from "@/types/database";

export type MinPaamelding = Pick<
  Kurspaamelding,
  "id" | "kurs_id" | "status" | "hund_navn" | "opprettet"
> & { kursNavn: string };

export type MinBooking = Pick<
  Booking,
  "id" | "status" | "formaal" | "opprettet"
> & {
  dato: string | null;
  start_tid: string | null;
  slutt_tid: string | null;
  pin: string | null;
};

export async function hentMinePaameldinger(): Promise<MinPaamelding[]> {
  const supabase = await createClient();
  // RLS filtrerer til brukerens egne (matchet på e-post)
  const [paamRes, kursRes] = await Promise.all([
    supabase
      .from("kurspaameldinger")
      .select("id, kurs_id, status, hund_navn, opprettet")
      .order("opprettet", { ascending: false }),
    supabase.from("kurs").select("id, navn"),
  ]);
  const kursMap = new Map((kursRes.data ?? []).map((k) => [k.id, k.navn]));
  return (paamRes.data ?? []).map((p) => ({
    ...p,
    kursNavn: kursMap.get(p.kurs_id) ?? "—",
  }));
}

export async function hentMineBookinger(): Promise<MinBooking[]> {
  const supabase = await createClient();
  // RLS filtrerer til brukerens egne (bruker_id = auth.uid())
  const [bookingRes, tiderRes] = await Promise.all([
    supabase
      .from("bookinger")
      .select("id, tid_id, status, formaal, opprettet")
      .order("opprettet", { ascending: false }),
    supabase.from("tilgjengelige_tider").select("*"),
  ]);

  const tidMap = new Map((tiderRes.data ?? []).map((t) => [t.id, t]));

  const resultat: MinBooking[] = [];
  for (const b of bookingRes.data ?? []) {
    const tid = tidMap.get(b.tid_id);
    // PIN vises kun ±15 min rundt tiden (server-side sjekk i funksjonen)
    let pin: string | null = null;
    if (b.status !== "avbrutt") {
      const { data } = await supabase.rpc("min_pinkode", { p_booking_id: b.id });
      pin = data ?? null;
    }
    resultat.push({
      id: b.id,
      status: b.status,
      formaal: b.formaal,
      opprettet: b.opprettet,
      dato: tid?.dato ?? null,
      start_tid: tid?.start_tid ?? null,
      slutt_tid: tid?.slutt_tid ?? null,
      pin,
    });
  }
  return resultat;
}
