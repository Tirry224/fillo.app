import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSafeRedirectPath } from "@/lib/utils/redirect";

function getSafeNextUrl(nextParam: string | null): string | null {
  if (!nextParam || !isSafeRedirectPath(nextParam)) {
    return null;
  }
  return nextParam;
}

/**
 * Équivalent du "middleware" Next.js classique (renommé "proxy" dans cette
 * version de Next.js). S'exécute avant les pages listées dans `config.matcher`
 * ci-dessous, pour deux choses : rafraîchir la session Supabase (voir
 * `updateSession`) et rediriger selon l'état de connexion — un utilisateur
 * déjà connecté qui arrive sur /login ou /register est envoyé vers son
 * tableau de bord, un visiteur non connecté qui tente une page protégée est
 * envoyé vers /login avec un paramètre "next" pour y revenir après
 * connexion. Ce n'est qu'un routage pratique : la vraie protection des
 * données reste assurée par les policies RLS côté base (voir
 * supabase/migrations/), jamais par ce fichier seul.
 */
export async function proxy(request: NextRequest) {
  const { user, response } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/ventes") ||
    pathname.startsWith("/messagerie") ||
    pathname.startsWith("/reglages");

  if (user && isAuthPage) {
    const rawNext = request.nextUrl.searchParams.get("next");
    const safeNext = getSafeNextUrl(rawNext);
    const url = request.nextUrl.clone();
    url.pathname = safeNext || "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const targetPath = `${pathname}${request.nextUrl.search}`;
    url.searchParams.set("next", targetPath);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/ventes/:path*",
    "/messagerie/:path*",
    "/reglages/:path*",
    "/login",
    "/register",
  ],
};
