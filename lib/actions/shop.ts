"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ClientStatus, ShopSettings } from "@/lib/types";
import type { Database } from "@/lib/supabase/database.types";

export type ShopActionResult = { error: string | null };

export async function updateSaleStatusAction(
  saleId: string,
  status: ClientStatus,
): Promise<ShopActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("sales").update({ status }).eq("id", saleId);

  if (error) {
    return { error: "Impossible de mettre à jour le statut de cette vente." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/ventes");
  revalidatePath("/clients");
  revalidatePath(`/ventes/${saleId}`);
  return { error: null };
}

export async function deleteSaleAction(saleId: string): Promise<ShopActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("sales").delete().eq("id", saleId);

  if (error) {
    return { error: "Impossible de supprimer cette vente." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/ventes");
  revalidatePath("/clients");
  return { error: null };
}

export async function updateShopSettingsAction(
  updates: Partial<ShopSettings>,
): Promise<ShopActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Utilisateur non authentifié." };
  }

  const { data: memberData } = await supabase
    .from("shop_members")
    .select("shop_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!memberData) {
    return { error: "Boutique introuvable." };
  }

  const payload: Database["public"]["Tables"]["shops"]["Update"] = {};
  if (updates.shopName !== undefined) {
    payload.name = updates.shopName;
    payload.initial = updates.shopName.trim().charAt(0).toUpperCase() || "F";
  }
  if (updates.phone !== undefined) payload.phone = updates.phone;
  if (updates.location !== undefined) payload.location = updates.location;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.emailNotifications !== undefined) {
    payload.email_notifications = updates.emailNotifications;
  }

  if (Object.keys(payload).length === 0) {
    return { error: null };
  }

  const { error } = await supabase
    .from("shops")
    .update(payload)
    .eq("id", memberData.shop_id);

  if (error) {
    return { error: "Impossible d'enregistrer ces réglages." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/reglages");
  return { error: null };
}

export async function submitShopFeedbackAction(
  message: string,
): Promise<ShopActionResult> {
  const trimmed = message.trim();
  if (!trimmed) {
    return { error: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Utilisateur non authentifié." };
  }

  const { data: memberData } = await supabase
    .from("shop_members")
    .select("shop_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!memberData) {
    return { error: "Boutique introuvable." };
  }

  const { error } = await supabase.from("shop_feedback").insert({
    shop_id: memberData.shop_id,
    user_id: user.id,
    message: trimmed,
  });

  if (error) {
    return { error: "Impossible d'envoyer ce commentaire." };
  }

  return { error: null };
}
