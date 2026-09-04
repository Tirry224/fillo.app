import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ClientWorkspace = {
  userId: string;
  /** Numéro de téléphone connu pour ce client (repris de sa première fiche liée), pour affichage seulement. */
  phone: string | null;
};

/**
 * Authentifie le client courant. Contrairement à `requireShopWorkspace`, ne
 * redirige jamais vers l'espace commerçant : un compte client et un compte
 * boutique sont deux identités Supabase Auth distinctes (voir
 * `clients.user_id` vs `shop_members.user_id`), ce n'est pas parce qu'une
 * session existe qu'elle correspond à un client.
 */
export const requireClientWorkspace = cache(async (): Promise<ClientWorkspace> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/mes-conversations/connexion");
  }

  const { data } = await supabase
    .from("clients")
    .select("phone")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  return { userId: user.id, phone: data?.phone ?? null };
});
