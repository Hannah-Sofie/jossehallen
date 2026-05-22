import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hentAlleInstruktorer } from "@/lib/admin/instruktorer";
import { hentOekterForKurs } from "@/lib/admin/oekter";
import { egetInstruktorId } from "@/lib/admin/kurs";
import { hentBruker } from "@/lib/auth";
import { KursSkjema } from "@/components/admin/KursSkjema";
import { OekterSeksjon } from "@/components/admin/OekterSeksjon";
import { buttonVariants } from "@/components/ui/button";

export default async function RedigerKurs({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: kurs }, instruktorer, oekter, auth, egetId] =
    await Promise.all([
      supabase.from("kurs").select("*").eq("id", id).maybeSingle(),
      hentAlleInstruktorer(),
      hentOekterForKurs(id),
      hentBruker(),
      egetInstruktorId(),
    ]);

  if (!kurs) notFound();
  const erAdmin = auth?.profil.rolle === "admin";

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/kurs" className="text-sm text-muted-foreground hover:underline">
          ← Tilbake til kurs
        </Link>
        <Link
          href={`/admin/kurs/${kurs.id}/deltakerliste`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Deltakerliste
        </Link>
      </div>
      <h2 className="mt-2 text-xl font-semibold">Rediger: {kurs.navn}</h2>
      <div className="mt-6">
        <KursSkjema
          kurs={kurs}
          instruktorer={instruktorer}
          erAdmin={erAdmin}
          egetInstruktorId={egetId}
        />
      </div>

      <OekterSeksjon kursId={kurs.id} oekter={oekter} />
    </div>
  );
}
