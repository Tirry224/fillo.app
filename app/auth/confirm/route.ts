import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSafeRedirectPath } from "@/lib/utils/redirect";

/**
 * Point d'entrée des liens envoyés par email par Supabase Auth (réinitialisation
 * de mot de passe, confirmation de changement d'email...). Échange le jeton
 * reçu contre une session valide côté serveur avant de rediriger vers la page
 * de destination.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const requestedNext = searchParams.get("next") ?? "/reinitialiser-mot-de-passe";
  const next = isSafeRedirectPath(requestedNext)
    ? requestedNext
    : "/reinitialiser-mot-de-passe";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=lien-invalide`);
}
