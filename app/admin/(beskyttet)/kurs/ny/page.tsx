import Link from "next/link";
import { hentAlleInstruktorer } from "@/lib/admin/instruktorer";
import { KursSkjema } from "@/components/admin/KursSkjema";

export default async function NyttKurs() {
  const instruktorer = await hentAlleInstruktorer();

  return (
    <div>
      <Link href="/admin/kurs" className="text-sm text-muted-foreground hover:underline">
        ← Tilbake til kurs
      </Link>
      <h2 className="mt-2 text-xl font-semibold">Nytt kurs</h2>
      <div className="mt-6">
        <KursSkjema instruktorer={instruktorer} />
      </div>
    </div>
  );
}
