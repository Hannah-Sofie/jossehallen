import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createServiceRoleClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Kalt fra Server Component — middleware refresher session, så det er ok.
          }
        },
      },
    },
  );
}

/**
 * Service-role-klient. Omgår RLS — kun brukes server-side for privilegerte
 * operasjoner (f.eks. transaksjonell booking-validering, admin-skripts).
 *
 * NB: Bruker SUPABASE_SERVICE_ROLE_KEY som aldri må eksponeres til klient.
 */
export function createAdminClient() {
  return createServiceRoleClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
