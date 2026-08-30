import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Client Supabase pour le serveur (Server Components, Server Actions, Route
 * Handlers). Lit/écrit la session via les cookies de la requête en cours,
 * ce qui permet à `supabase.auth.getUser()` de savoir qui est connecté.
 * `setAll` peut échouer silencieusement : un Server Component ne peut pas
 * toujours écrire de cookies (seules les Server Actions et Route Handlers
 * le peuvent) ; la session est de toute façon rafraîchie dans `proxy.ts`
 * à chaque requête, donc cet échec ponctuel n'a pas de conséquence.
 */
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
            // Server Components cannot always write cookies.
          }
        },
      },
    },
  );
}
