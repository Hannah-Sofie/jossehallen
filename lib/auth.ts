import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Brukerprofil, Brukerrolle } from "@/types/database";
import type { User } from "@supabase/supabase-js";

export type AuthState = {
  user: User;
  profil: Brukerprofil;
} | null;

/** Henter innlogget bruker + profil, eller null hvis ikke innlogget. */
export async function hentBruker(): Promise<AuthState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profil } = await supabase
    .from("brukerprofil")
    .select("*")
    .eq("bruker_id", user.id)
    .maybeSingle();

  if (!profil) return null;
  return { user, profil };
}

/** Krev innlogging. Redirecter til /login hvis ikke. */
export async function krevInnlogget(returnTo = "/min-side"): Promise<{
  user: User;
  profil: Brukerprofil;
}> {
  const auth = await hentBruker();
  if (!auth) redirect(`/login?retur=${encodeURIComponent(returnTo)}`);
  return auth;
}

/** Krev en av rollene. Redirecter til /admin/login hvis ikke autorisert. */
export async function krevRolle(
  roller: Brukerrolle[],
  returnTo = "/admin",
): Promise<{ user: User; profil: Brukerprofil }> {
  const auth = await hentBruker();
  if (!auth) redirect(`/admin/login?retur=${encodeURIComponent(returnTo)}`);
  if (!roller.includes(auth.profil.rolle)) redirect("/");
  return auth;
}

export function erAdmin(rolle: Brukerrolle): boolean {
  return rolle === "admin";
}

export function erAdminEllerInstruktor(rolle: Brukerrolle): boolean {
  return rolle === "admin" || rolle === "instruktor";
}
