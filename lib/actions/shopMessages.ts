"use server";

import { revalidatePath } from "next/cache";
import { requireShopContext } from "@/lib/actions/shopContext";
import { sendConversationPushNotification } from "@/lib/push";

export type SendShopMessageState = {
  error: string | null;
  /** Change à chaque envoi réussi : sert de `key` au formulaire pour le vider sans effet. */
  sentAt?: number;
};

/**
 * Envoie un message dans une conversation, du point de vue de la boutique.
 * La policy RLS "participants can send messages" vérifie déjà que
 * l'appelant est membre de la boutique propriétaire de cette conversation.
 */
export async function sendShopMessageAction(
  _prevState: SendShopMessageState,
  formData: FormData,
): Promise<SendShopMessageState> {
  const conversationId = String(formData.get("conversationId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!conversationId || !body) {
    return { error: "Merci de saisir un message." };
  }

  const shopContext = await requireShopContext();
  if (shopContext.error !== null) {
    return { error: shopContext.error };
  }

  const { supabase, userId } = shopContext.context;

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_role: "shop",
    sender_user_id: userId,
    body,
  });

  if (error) {
    return { error: "Impossible d'envoyer le message." };
  }

  revalidatePath(`/messagerie/${conversationId}`);

  await sendConversationPushNotification(conversationId, {
    title: "Nouveau message",
    body: body.slice(0, 120),
    url: `/mes-conversations/${conversationId}`,
  });

  return { error: null, sentAt: Date.now() };
}

export type StartShopConversationResult = {
  error: string | null;
  conversationId?: string;
};

/**
 * Démarre - ou rouvre - une conversation avec un client déjà connu de la
 * boutique (parcours "Rechercher un client par numéro" de la messagerie).
 */
export async function startShopConversationAction(
  clientId: string,
): Promise<StartShopConversationResult> {
  const shopContext = await requireShopContext();
  if (shopContext.error !== null) {
    return { error: shopContext.error };
  }

  const { supabase, shopId } = shopContext.context;

  const insertConv = await supabase
    .from("conversations")
    .insert({ shop_id: shopId, client_id: clientId })
    .select("id")
    .single();

  let conversationId: string | null = null;

  if (insertConv.error) {
    if (insertConv.error.code !== "23505") {
      return { error: "Impossible de démarrer la conversation." };
    }
    const existing = await supabase
      .from("conversations")
      .select("id")
      .eq("shop_id", shopId)
      .eq("client_id", clientId)
      .single();
    conversationId = existing.data?.id ?? null;
  } else {
    conversationId = insertConv.data.id;
  }

  if (!conversationId) {
    return { error: "Impossible de démarrer la conversation." };
  }

  return { error: null, conversationId };
}
