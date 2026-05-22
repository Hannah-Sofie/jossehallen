import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendKursPaaminnelse,
  sendBookingPaaminnelse,
} from "@/lib/email/send";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Dato i morgen (Europe/Oslo), som YYYY-MM-DD. */
function imorgenOslo(): string {
  const idag = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Oslo",
  }).format(new Date());
  const d = new Date(`${idag}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  // Sikre at kun cron (med riktig secret) kan kjøre dette
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, feil: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const imorgen = imorgenOslo();
  let kursSendt = 0;
  let bookingSendt = 0;

  async function alleredeSendt(
    type: "kurs" | "booking",
    refId: string,
  ): Promise<boolean> {
    const { data } = await supabase
      .from("paaminnelse_logg")
      .select("id")
      .eq("type", type)
      .eq("ref_id", refId)
      .eq("for_dato", imorgen)
      .maybeSingle();
    return Boolean(data);
  }

  async function markerSendt(type: "kurs" | "booking", refId: string) {
    await supabase
      .from("paaminnelse_logg")
      .upsert(
        { type, ref_id: refId, for_dato: imorgen },
        { onConflict: "type,ref_id,for_dato", ignoreDuplicates: true },
      );
  }

  // ---- Booking-påminnelser ----
  const { data: tider } = await supabase
    .from("tilgjengelige_tider")
    .select("*")
    .eq("dato", imorgen);
  const tidMap = new Map((tider ?? []).map((t) => [t.id, t]));
  const tidIds = (tider ?? []).map((t) => t.id);

  if (tidIds.length > 0) {
    const { data: bookinger } = await supabase
      .from("bookinger")
      .select("*")
      .in("tid_id", tidIds)
      .in("status", ["venter_betaling", "bekreftet"]);

    for (const b of bookinger ?? []) {
      const tid = tidMap.get(b.tid_id);
      if (!tid) continue;
      if (await alleredeSendt("booking", b.id)) continue;
      const res = await sendBookingPaaminnelse(b.epost, {
        fornavn: b.fornavn,
        dato: tid.dato,
        startTid: tid.start_tid,
        sluttTid: tid.slutt_tid,
        sted: "Jossehallen",
      });
      if (res.sendt) {
        await markerSendt("booking", b.id);
        bookingSendt++;
      }
    }
  }

  // ---- Kurs-påminnelser (basert på økter i morgen) ----
  const { data: oekter } = await supabase
    .from("kurs_oekter")
    .select("*")
    .eq("dato", imorgen)
    .eq("status", "planlagt");

  if (oekter && oekter.length > 0) {
    const kursIds = [...new Set(oekter.map((o) => o.kurs_id))];
    const { data: kursListe } = await supabase
      .from("kurs")
      .select("*")
      .in("id", kursIds);
    const kursMap = new Map((kursListe ?? []).map((k) => [k.id, k]));

    for (const o of oekter) {
      const kurs = kursMap.get(o.kurs_id);
      if (!kurs) continue;
      const { data: paameldinger } = await supabase
        .from("kurspaameldinger")
        .select("*")
        .eq("kurs_id", o.kurs_id)
        .in("status", ["venter_betaling", "bekreftet"]);

      for (const p of paameldinger ?? []) {
        if (await alleredeSendt("kurs", p.id)) continue;
        const res = await sendKursPaaminnelse(p.epost, {
          fornavn: p.fornavn,
          kursNavn: kurs.navn,
          dato: o.dato,
          startTid: o.start_tid,
          sluttTid: o.slutt_tid,
          sted: kurs.sted,
        });
        if (res.sendt) {
          await markerSendt("kurs", p.id);
          kursSendt++;
        }
      }
    }
  }

  return NextResponse.json({
    ok: true,
    dato: imorgen,
    kursPaaminnelser: kursSendt,
    bookingPaaminnelser: bookingSendt,
  });
}
