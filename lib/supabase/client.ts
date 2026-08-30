import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Client Supabase pour le navigateur (Client Components). Utilise la clé
 * publique "anon" : sans danger à exposer côté client, la vraie protection
 * des données vient des policies RLS côté base, pas de cette clé. Pour un
 * Server Component ou une Server Action, utiliser `lib/supabase/server.ts`
 * à la place (gère les cookies de session différemment).
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
