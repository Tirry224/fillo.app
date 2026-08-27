import { createClient } from "@/lib/supabase/server";

export type ShopContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  userEmail: string;
  shopId: string;
};

export type ShopContextResult =
  | { context: ShopContext; error: null }
  | { context: null; error: string };

/**
 * Authentifie l'utilisateur courant et retrouve la boutique dont il est
 * membre. Centralise une vérification répétée dans chaque action serveur
 * qui écrit des données appartenant à une boutique.
 */
export async function requireShopContext(): Promise<ShopContextResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { context: null, error: "Utilisateur non authentifié." };
  }

  const { data: memberData } = await supabase
    .from("shop_members")
    .select("shop_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!memberData) {
    return { context: null, error: "Boutique introuvable." };
  }

  return {
    context: {
      supabase,
      userId: user.id,
      userEmail: user.email,
      shopId: memberData.shop_id,
    },
    error: null,
  };
}
