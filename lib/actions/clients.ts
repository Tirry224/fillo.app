"use server";

import { revalidatePath } from "next/cache";
import { requireShopContext } from "@/lib/actions/shopContext";
import { normalizePhone } from "@/lib/utils/phone";

export type AddClientResult = { error: string | null; clientId?: string };

/**
 * Ajoute un client manuellement depuis l'espace commerçant (formulaire
 * "Nouveau client"), avec sa première demande. Si un client existant a déjà
 * le même numéro de téléphone (normalisé), la nouvelle demande lui est
 * rattachée au lieu de créer un doublon. Crée aussi une vente au statut
 * "new" pour que la demande apparaisse immédiatement dans le suivi des
 * ventes, comme une demande reçue via la page publique.
 */
export async function addClientAction(
  name: string,
  phone: string,
  message: string,
): Promise<AddClientResult> {
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || !trimmedPhone || !trimmedMessage) {
    return { error: "Le nom, le numéro et la demande sont obligatoires." };
  }

  const shopContext = await requireShopContext();

  if (shopContext.error !== null) {
    return { error: shopContext.error };
  }

  const { supabase, shopId } = shopContext.context;
  const normalizedPhone = normalizePhone(trimmedPhone);

  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("shop_id", shopId)
    .eq("normalized_phone", normalizedPhone)
    .maybeSingle();

  let clientId = existingClient?.id;

  if (!clientId) {
    const initials = trimmedName.replace(/\s+/g, "").slice(0, 2).toUpperCase();
    const { data: newClient, error: clientError } = await supabase
      .from("clients")
      .insert({
        shop_id: shopId,
        name: trimmedName,
        phone: trimmedPhone,
        normalized_phone: normalizedPhone,
        initials,
        color: "blue",
      })
      .select("id")
      .single();

    if (clientError) {
      return { error: "Impossible d'ajouter ce client." };
    }

    clientId = newClient.id;
  }

  const { data: newRequest, error: requestError } = await supabase
    .from("client_requests")
    .insert({
      shop_id: shopId,
      client_id: clientId,
      title: trimmedMessage,
      detail: "Ajouté manuellement par le commerçant",
      message: trimmedMessage,
      photos: [],
    })
    .select("id")
    .single();

  if (requestError) {
    return { error: "Impossible d'enregistrer cette demande." };
  }

  const { error: saleError } = await supabase.from("sales").insert({
    shop_id: shopId,
    client_id: clientId,
    request_id: newRequest.id,
    message: trimmedMessage,
    status: "new",
    photos: [],
  });

  if (saleError) {
    return { error: "Impossible d'enregistrer cette demande." };
  }

  revalidatePath("/clients");
  revalidatePath("/dashboard");
  revalidatePath("/ventes");
  revalidatePath(`/clients/${clientId}`);
  return { error: null, clientId };
}

export type UpdateClientResult = { error: string | null };

/**
 * Modifie le nom et le téléphone d'un client existant. Refuse la mise à jour
 * si un autre client de la même boutique utilise déjà ce numéro (normalisé),
 * pour éviter que deux fiches distinctes partagent le même contact.
 */
export async function updateClientAction(
  clientId: string,
  name: string,
  phone: string,
): Promise<UpdateClientResult> {
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();

  if (!trimmedName || !trimmedPhone) {
    return { error: "Le nom et le numéro sont obligatoires." };
  }

  const shopContext = await requireShopContext();

  if (shopContext.error !== null) {
    return { error: shopContext.error };
  }

  const { supabase, shopId } = shopContext.context;
  const normalizedPhone = normalizePhone(trimmedPhone);

  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("shop_id", shopId)
    .eq("normalized_phone", normalizedPhone)
    .neq("id", clientId)
    .maybeSingle();

  if (existingClient) {
    return { error: "Ce numéro est déjà utilisé par un autre client." };
  }

  const initials = trimmedName.replace(/\s+/g, "").slice(0, 2).toUpperCase();
  const { error: updateError } = await supabase
    .from("clients")
    .update({
      name: trimmedName,
      phone: trimmedPhone,
      normalized_phone: normalizedPhone,
      initials,
    })
    .eq("id", clientId)
    .eq("shop_id", shopId);

  if (updateError) {
    return { error: "Impossible de modifier ce client." };
  }

  revalidatePath("/clients");
  revalidatePath("/dashboard");
  revalidatePath("/ventes");
  revalidatePath(`/clients/${clientId}`);
  return { error: null };
}

export type DeleteClientResult = { error: string | null };

/**
 * Supprime un client. Le filtre `eq("shop_id", shopId)` empêche un
 * commerçant de supprimer la fiche d'un client appartenant à une autre
 * boutique, même s'il en devinait l'identifiant.
 */
export async function deleteClientAction(
  clientId: string,
): Promise<DeleteClientResult> {
  const shopContext = await requireShopContext();

  if (shopContext.error !== null) {
    return { error: shopContext.error };
  }

  const { supabase, shopId } = shopContext.context;

  const { error: deleteError } = await supabase
    .from("clients")
    .delete()
    .eq("id", clientId)
    .eq("shop_id", shopId);

  if (deleteError) {
    return { error: "Impossible de supprimer ce client." };
  }

  revalidatePath("/clients");
  revalidatePath("/dashboard");
  revalidatePath("/ventes");
  return { error: null };
}
