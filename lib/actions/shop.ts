"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireShopContext } from "@/lib/actions/shopContext";
import { formatAuthError } from "@/lib/utils/authErrors";
import { getRequestOrigin } from "@/lib/utils/origin";
import type { ClientStatus, ShopSettings } from "@/lib/types";
import type { Database } from "@/lib/supabase/database.types";

export type ShopActionResult = { error: string | null; info?: string | null };

/**
 * Change le statut d'une vente (ex. "new" -> "pending" -> "completed").
 * Ne vérifie pas explicitement que la vente appartient à la boutique de
 * l'utilisateur connecté : la policy RLS "members can write sales" (voir
 * supabase/migrations/001_initial_schema.sql) l'impose déjà au niveau de la
 * base, donc une vente d'une autre boutique est refusée par Postgres avant
 * même d'atteindre cette fonction.
 */
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

/**
 * Supprime définitivement une vente. Même remarque que pour
 * `updateSaleStatusAction` : la sécurité vient de la policy RLS sur la table
 * `sales`, pas d'une vérification explicite ici.
 */
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

/**
 * Met à jour les réglages de la boutique (nom, téléphone, adresse, email,
 * préférence de notifications). Ne construit que les champs réellement
 * fournis dans `updates`, pour ne jamais écraser les autres colonnes avec
 * `undefined`. Si l'email de connexion change, Supabase Auth envoie un email
 * de confirmation et l'ancien email reste actif tant qu'il n'est pas
 * confirmé : l'utilisateur en est informé via `info` plutôt que par une
 * fausse impression de succès immédiat.
 */
export async function updateShopSettingsAction(
  updates: Partial<ShopSettings>,
): Promise<ShopActionResult> {
  const shopContext = await requireShopContext();

  if (shopContext.error !== null) {
    return { error: shopContext.error };
  }

  const { supabase, shopId, userEmail } = shopContext.context;

  const trimmedEmail = updates.email?.trim();
  const isChangingLoginEmail = Boolean(
    trimmedEmail && trimmedEmail !== userEmail,
  );

  if (isChangingLoginEmail) {
    // Sans `emailRedirectTo` explicite, le lien de confirmation envoyé par
    // Supabase retombe sur le comportement par défaut du projet (souvent la
    // page de réinitialisation de mot de passe, non pertinente ici) : on
    // pointe donc vers `/auth/confirm`, qui échange le jeton reçu contre une
    // session avant de renvoyer vers les réglages du commerce.
    const origin = await getRequestOrigin();
    const { error: authError } = await supabase.auth.updateUser(
      { email: trimmedEmail },
      { emailRedirectTo: `${origin}/auth/confirm?next=/reglages/commerce` },
    );

    if (authError) {
      return { error: formatAuthError(authError.message) };
    }
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

  const { data, error } = await supabase
    .from("shops")
    .update(payload)
    .eq("id", shopId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: "Impossible d'enregistrer ces réglages." };
  }

  if (!data) {
    return {
      error: "Impossible d'enregistrer ces réglages : boutique introuvable ou accès refusé.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/reglages");
  revalidatePath("/reglages/commerce");

  return {
    error: null,
    info: isChangingLoginEmail
      ? "Un email de confirmation a été envoyé à votre nouvelle adresse. Votre email de connexion ne changera qu'après avoir cliqué sur le lien reçu ; utilisez votre ancien email en attendant."
      : null,
  };
}

/**
 * Enregistre un message de feedback envoyé par le commerçant depuis
 * l'application. Un message vide n'est pas considéré comme une erreur : le
 * formulaire appelant peut soumettre silencieusement un champ resté vide.
 */
export async function submitShopFeedbackAction(
  message: string,
): Promise<ShopActionResult> {
  const trimmed = message.trim();
  if (!trimmed) {
    return { error: null };
  }

  const shopContext = await requireShopContext();

  if (shopContext.error !== null) {
    return { error: shopContext.error };
  }

  const { supabase, userId, shopId } = shopContext.context;

  const { error } = await supabase.from("shop_feedback").insert({
    shop_id: shopId,
    user_id: userId,
    message: trimmed,
  });

  if (error) {
    return { error: "Impossible d'envoyer ce commentaire." };
  }

  return { error: null };
}
