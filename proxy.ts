import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function getSafeNextUrl(nextParam: string | null): string | null {
  if (!nextParam) return null;
  if (
    !nextParam.startsWith("/") ||
    nextParam.startsWith("//") ||
    nextParam.startsWith("/\\")
  ) {
    return null;
  }
  return nextParam;
}

export async function proxy(request: NextRequest) {
  const { user, response } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/ventes") ||
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
    "/reglages/:path*",
    "/login",
    "/register",
  ],
};
