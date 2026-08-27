import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proxy a déjà vérifié l'utilisateur auprès de Supabase Auth ; on transmet son id
  // via un header interne pour éviter un second aller-retour réseau identique dans
  // requireShopWorkspace(). Le header est toujours écrasé ici, donc jamais falsifiable
  // par le client. La sécurité réelle des données reste portée par les policies RLS
  // (scopées sur auth.uid() côté base), pas par ce header : il n'est qu'un raccourci
  // pour éviter un getUser() redondant sur le chemin nominal.
  if (user) {
    request.headers.set("x-fillo-user-id", user.id);
  } else {
    request.headers.delete("x-fillo-user-id");
  }

  const refreshedCookies = response.cookies.getAll();
  response = NextResponse.next({ request: { headers: request.headers } });
  refreshedCookies.forEach((cookie) => response.cookies.set(cookie));

  return { user, response };
}
