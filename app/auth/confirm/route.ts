import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSafeRedirectPath } from "@/lib/utils/redirect";

/**
 * Point d'entrée des liens envoyés par email par Supabase Auth (réinitialisation
 * de mot de passe, confirmation de changement d'email...). Les clients Supabase
 * de ce projet utilisent le flux PKCE (flowType "pkce", imposé par
 * @supabase/ssr) : le lien contient donc un paramètre "code" à échanger
 * contre une session via exchangeCodeForSession, pas un "token_hash"/"type"
 * à vérifier via verifyOtp (l'autre flux, celui des clients Supabase
 * classiques sans PKCE, qui ne s'applique pas ici).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/reinitialiser-mot-de-passe";
  const next = isSafeRedirectPath(requestedNext)
    ? requestedNext
    : "/reinitialiser-mot-de-passe";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=lien-invalide`);
}
