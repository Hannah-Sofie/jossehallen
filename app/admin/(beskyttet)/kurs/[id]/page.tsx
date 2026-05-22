import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hentAlleInstruktorer } from "@/lib/admin/instruktorer";
import { KursSkjema } from "@/components/admin/KursSkjema";

export default async function RedigerKurs({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: kurs }, instruktorer] = await Promise.all([
    supabase.from("kurs").select("*").eq("id", id).maybeSingle(),
    hentAlleInstruktorer(),
  ]);

  if (!kurs) notFound();

  return (
    <div>
      <Link href="/admin/kurs" className="text-sm text-muted-foreground hover:underline">
        ← Tilbake til kurs
      </Link>
      <h2 className="mt-2 text-xl font-semibold">Rediger: {kurs.navn}</h2>
      <div className="mt-6">
        <KursSkjema kurs={kurs} instruktorer={instruktorer} />
      </div>
    </div>
  );
}
