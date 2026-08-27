import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createSlug } from "@/lib/utils/slug";
import type { Client, ClientRequest, Sale, Shop, ShopSettings } from "@/lib/types";

export type ShopWorkspace = {
  shop: Shop;
  settings: ShopSettings;
  clients: Client[];
  requests: ClientRequest[];
  sales: Sale[];
};

async function ensureShopExists(
  supabase: Awaited<ReturnType<typeof createClient>>,
  shopNameHint: string | undefined,
) {
  const shopName = shopNameHint?.trim() || "Ma boutique";
  const slug = createSlug(shopName);
  await supabase.rpc("register_shop", { shop_name: shopName, shop_slug: slug });
}

/**
 * Charge les données de la boutique de l'utilisateur connecté. Si l'inscription
 * s'est arrêtée après signUp (confirmation d'email en attente), la boutique
 * est créée ici à la première visite authentifiée, à partir du nom stocké
 * dans les métadonnées utilisateur lors de l'inscription.
 *
 * Mise en cache par requête (React `cache`) : plusieurs appels dans le même
 * rendu (layout + page) ne déclenchent qu'un seul aller-retour Supabase.
 */
export const requireShopWorkspace = cache(async (): Promise<ShopWorkspace> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let membership = await fetchMembership(supabase, user.id);

  if (!membership) {
    const shopNameHint = user.user_metadata?.shop_name as string | undefined;
    await ensureShopExists(supabase, shopNameHint);
    membership = await fetchMembership(supabase, user.id);
  }

  if (!membership) {
    redirect("/register");
  }

  const shop = membership;

  const [{ data: clientsData, error: clientsError }, { data: requestsData, error: requestsError }, { data: salesData, error: salesError }] =
    await Promise.all([
      supabase.from("clients").select("*").eq("shop_id", shop.id),
      supabase.from("client_requests").select("*").eq("shop_id", shop.id),
      supabase
        .from("sales")
        .select("*, clients(name)")
        .eq("shop_id", shop.id)
        .order("created_at", { ascending: false }),
    ]);

  if (clientsError || requestsError || salesError) {
    throw new Error(
      "Impossible de charger les données de la boutique. Merci de réessayer.",
    );
  }

  const clients: Client[] = (clientsData ?? []).map((c) => ({
    id: c.id,
    shopId: shop.slug,
    initials: c.initials,
    name: c.name,
    phone: c.phone,
    color: c.color,
  }));

  const requests: ClientRequest[] = (requestsData ?? []).map((r) => ({
    id: r.id,
    shopId: shop.slug,
    clientId: r.client_id,
    title: r.title,
    detail: r.detail,
    message: r.message,
    photo: r.photo_path ?? undefined,
  }));

  const sales: Sale[] = (salesData ?? []).map((s) => ({
    id: s.id,
    shopId: shop.slug,
    clientId: s.client_id,
    clientName: s.clients?.name ?? "Client",
    requestId: s.request_id,
    product: s.product,
    message: s.message,
    status: s.status,
    photo: s.photo_path ?? undefined,
    createdAt: new Date(s.created_at).getTime(),
  }));

  return {
    shop: {
      id: shop.id,
      slug: shop.slug,
      name: shop.name,
      initial: shop.initial,
    },
    settings: {
      shopName: shop.name,
      phone: shop.phone ?? "",
      location: shop.location ?? "",
      email: shop.email ?? "",
      emailNotifications: shop.email_notifications ?? true,
    },
    clients,
    requests,
    sales,
  };
});

async function fetchMembership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data } = await supabase
    .from("shop_members")
    .select(
      "shop_id, shops(id, slug, name, initial, phone, location, email, email_notifications)",
    )
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  return data?.shops ?? null;
}
