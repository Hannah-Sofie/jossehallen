import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Health check — bekrefter at appen kan snakke med Supabase og at miljøvariabler er satt.
 * Brukes til debug/feilsøking. Trygg å la stå i prod (returnerer ingen sensitive data).
 */
export async function GET() {
  const env = {
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    service: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  try {
    const supabase = await createClient();
    const [kursRes, tiderRes, instruktorRes] = await Promise.all([
      supabase.from("kurs").select("id", { count: "exact", head: true }),
      supabase
        .from("tilgjengelige_tider")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("instruktorer")
        .select("id", { count: "exact", head: true }),
    ]);

    const errors = [kursRes.error, tiderRes.error, instruktorRes.error].filter(
      Boolean,
    );
    if (errors.length > 0) {
      return NextResponse.json(
        { ok: false, env, errors: errors.map((e) => e?.message) },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      env,
      counts: {
        kurs: kursRes.count,
        tilgjengelige_tider: tiderRes.count,
        instruktorer: instruktorRes.count,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, env, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
