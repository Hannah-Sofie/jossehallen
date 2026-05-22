import Link from "next/link";
import { hentAlleInstruktorer } from "@/lib/admin/instruktorer";
import { egetInstruktorId } from "@/lib/admin/kurs";
import { hentBruker } from "@/lib/auth";
import { KursSkjema } from "@/components/admin/KursSkjema";

export default async function NyttKurs() {
  const [instruktorer, auth, egetId] = await Promise.all([
    hentAlleInstruktorer(),
    hentBruker(),
    egetInstruktorId(),
  ]);
  const erAdmin = auth?.profil.rolle === "admin";

  return (
    <div>
      <Link href="/admin/kurs" className="text-sm text-muted-foreground hover:underline">
        ← Tilbake til kurs
      </Link>
      <h2 className="mt-2 text-xl font-semibold">Nytt kurs</h2>
      <div className="mt-6">
        <KursSkjema
          instruktorer={instruktorer}
          erAdmin={erAdmin}
          egetInstruktorId={egetId}
        />
      </div>
    </div>
  );
}
