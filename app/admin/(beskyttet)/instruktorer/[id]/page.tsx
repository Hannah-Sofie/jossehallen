import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InstruktorSkjema } from "@/components/admin/InstruktorSkjema";

export default async function RedigerInstruktor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: instruktor } = await supabase
    .from("instruktorer")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!instruktor) notFound();

  return (
    <div>
      <Link
        href="/admin/instruktorer"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Tilbake til instruktører
      </Link>
      <h2 className="mt-2 text-xl font-semibold">Rediger: {instruktor.navn}</h2>
      <div className="mt-6">
        <InstruktorSkjema instruktor={instruktor} />
      </div>
    </div>
  );
}
