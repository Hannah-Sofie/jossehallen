import { krevRolle } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProfilSkjemaer } from "@/components/admin/ProfilSkjemaer";

export default async function AdminProfil() {
  const { user, profil } = await krevRolle(["admin", "instruktor"]);

  const supabase = await createClient();
  const { data: instruktor } = await supabase
    .from("instruktorer")
    .select("*")
    .eq("bruker_id", user.id)
    .maybeSingle();

  return (
    <div>
      <h2 className="text-xl font-semibold">Min profil</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Oppdater kontaktinfo, {instruktor ? "instruktørprofil " : ""}og passord.
      </p>
      <div className="mt-6">
        <ProfilSkjemaer profil={profil} instruktor={instruktor} />
      </div>
    </div>
  );
}
