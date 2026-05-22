import Link from "next/link";
import { InstruktorSkjema } from "@/components/admin/InstruktorSkjema";

export default function NyInstruktor() {
  return (
    <div>
      <Link
        href="/admin/instruktorer"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Tilbake til instruktører
      </Link>
      <h2 className="mt-2 text-xl font-semibold">Ny instruktør</h2>
      <div className="mt-6">
        <InstruktorSkjema />
      </div>
    </div>
  );
}
