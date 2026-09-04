"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendConversationPushNotification } from "@/lib/push";

export type SendMessageState = {
  error: string | null;
  /** Change à chaque envoi réussi : sert de `key` au formulaire pour le vider sans effet. */
  sentAt?: number;
};

/**
 * Envoie un message dans une conversation, du point de vue du client. La
 * policy RLS "participants can send messages" vérifie déjà que ce client est
 * bien rattaché à cette conversation ; on ne fait ici que fournir des
 * données cohérentes (sender_role/sender_user_id corrects).
 */
export async function sendClientMessageAction(
  _prevState: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const conversationId = String(formData.get("conversationId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!conversationId || !body) {
    return { error: "Merci de saisir un message." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Utilisateur non authentifié." };
  }

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_role: "client",
    sender_user_id: user.id,
    body,
  });

  if (error) {
    return { error: "Impossible d'envoyer le message." };
  }

  revalidatePath(`/mes-conversations/${conversationId}`);

  await sendConversationPushNotification(conversationId, {
    title: "Nouveau message",
    body: body.slice(0, 120),
    url: `/messagerie/${conversationId}`,
  });

  return { error: null, sentAt: Date.now() };
}
