import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createSlug } from "@/lib/utils/slug";
import type { Client, ClientRequest, PublicShop, Sale, Shop, ShopSettings } from "@/lib/types";

export type ShopWorkspace = {
  shop: Shop;
  settings: ShopSettings;
  clients: Client[];
  requests: ClientRequest[];
  sales: Sale[];
};

/**
 * Crée la boutique d'un utilisateur qui n'en a pas encore, à partir du nom
 * saisi lors de l'inscription (stocké dans les métadonnées Supabase Auth).
 * Rattrape le cas où `registerAction` s'est arrêtée avant de créer la
 * boutique (confirmation d'email en attente au moment de l'inscription).
 */
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
 *
 * Sur le chemin nominal (utilisateur déjà membre d'une boutique), on réutilise
 * l'id vérifié par proxy.ts (header interne, jamais falsifiable côté client)
 * au lieu de rappeler supabase.auth.getUser() : ça évite un second aller-retour
 * réseau vers Supabase sur chaque navigation. La sécurité réelle vient des
 * policies RLS scopées sur auth.uid(), pas de cet id ; on retombe donc sur un
 * getUser() authentifiant dès qu'on a besoin des métadonnées utilisateur
 * (création de boutique) ou que le header est absent.
 */
export const requireShopWorkspace = cache(async (): Promise<ShopWorkspace> => {
  const supabase = await createClient();
  const trustedUserId = (await headers()).get("x-fillo-user-id");

  let userId = trustedUserId;
  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect("/login");
    }
    userId = user.id;
  }

  let membership = await fetchMembership(supabase, userId);

  if (!membership) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect("/login");
    }
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
    userId: c.user_id,
  }));

  const requests: ClientRequest[] = (requestsData ?? []).map((r) => ({
    id: r.id,
    shopId: shop.slug,
    clientId: r.client_id,
    title: r.title,
    detail: r.detail,
    message: r.message,
    photos: r.photos ?? [],
  }));

  const sales: Sale[] = (salesData ?? []).map((s) => ({
    id: s.id,
    shopId: shop.slug,
    clientId: s.client_id,
    clientName: s.clients?.name ?? "Client",
    requestId: s.request_id,
    message: s.message,
    status: s.status,
    photos: s.photos ?? [],
    saleNumber: s.sale_number,
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

/**
 * Charge les infos publiques d'une boutique par son slug (page cliente + ses
 * métadonnées de partage). Mise en cache par requête : la page et
 * `generateMetadata` appellent toutes les deux cette fonction pour le même
 * rendu, ça évite un second aller-retour Supabase identique.
 */
export const getPublicShop = cache(
  async (shopSlug: string): Promise<PublicShop | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_public_shop", {
      shop_slug: shopSlug,
    });

    const shopInfo = data?.[0];
    if (error || !shopInfo) {
      return null;
    }

    return { slug: shopSlug, name: shopInfo.name, initial: shopInfo.initial };
  },
);

/**
 * Retrouve la boutique dont `userId` est membre, avec tous ses champs. La
 * policy RLS de `shop_members` garantit qu'un utilisateur ne peut lire que
 * sa propre ligne d'appartenance, donc `null` signifie ici "cet utilisateur
 * n'a encore aucune boutique" plutôt qu'un problème d'accès.
 */
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
