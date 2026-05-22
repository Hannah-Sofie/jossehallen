"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Booking, BookingStatus } from "@/types/database";

export type BookingMedTid = Booking & {
  dato: string | null;
  start_tid: string | null;
  slutt_tid: string | null;
};

export async function hentBookinger(): Promise<BookingMedTid[]> {
  const supabase = await createClient();
  const [bookingRes, tiderRes] = await Promise.all([
    supabase
      .from("bookinger")
      .select("*")
      .order("opprettet", { ascending: false }),
    supabase.from("tilgjengelige_tider").select("*"),
  ]);

  const tidMap = new Map((tiderRes.data ?? []).map((t) => [t.id, t]));
  return (bookingRes.data ?? []).map((b) => {
    const tid = tidMap.get(b.tid_id);
    return {
      ...b,
      dato: tid?.dato ?? null,
      start_tid: tid?.start_tid ?? null,
      slutt_tid: tid?.slutt_tid ?? null,
    };
  });
}

export async function endreBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<{ ok: true } | { ok: false; feil: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookinger")
    .update({ status })
    .eq("id", id);
  if (error) return { ok: false, feil: error.message };
  revalidatePath("/admin/bookinger");
  return { ok: true };
}
