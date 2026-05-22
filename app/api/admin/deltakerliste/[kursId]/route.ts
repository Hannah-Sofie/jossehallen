import { NextResponse, type NextRequest } from "next/server";
import { hentBruker, erAdminEllerInstruktor } from "@/lib/auth";
import { hentDeltakerliste } from "@/lib/admin/deltakerliste";

export const dynamic = "force-dynamic";

function csvFelt(v: string | number | null | boolean): string {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ kursId: string }> },
) {
  const { kursId } = await params;

  const auth = await hentBruker();
  if (!auth || !erAdminEllerInstruktor(auth.profil.rolle)) {
    return NextResponse.json({ feil: "Unauthorized" }, { status: 401 });
  }

  const data = await hentDeltakerliste(kursId);
  if (!data) return NextResponse.json({ feil: "Fant ikke kurs" }, { status: 404 });

  const headere = [
    "Fornavn",
    "Etternavn",
    "E-post",
    "Telefon",
    "Adresse",
    "Postnr",
    "Poststed",
    "Hund",
    "Alder",
    "Rase",
    "Kastrert",
    "Status",
    "Kommentar/hensyn",
    "Notat",
  ];

  const rader = data.deltakere.map((d) =>
    [
      d.fornavn,
      d.etternavn,
      d.epost,
      d.telefon,
      d.adresse,
      d.postnummer,
      d.poststed,
      d.hund_navn,
      d.hund_alder,
      d.hund_rase,
      d.kastrert ? "Ja" : "Nei",
      d.status,
      d.kommentar,
      d.notat,
    ]
      .map(csvFelt)
      .join(";"),
  );

  // BOM for at Excel skal lese æøå riktig
  const csv = "﻿" + [headere.map(csvFelt).join(";"), ...rader].join("\r\n");
  const filnavn = `deltakerliste-${data.kurs.navn.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filnavn}"`,
    },
  });
}
