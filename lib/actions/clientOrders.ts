"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendConversationPushNotification } from "@/lib/push";

export type CreateClientOrderResult = { error: string | null };

/**
 * Permet à un client de soumettre une nouvelle commande directement depuis
 * une conversation déjà ouverte (bouton dans l'en-tête de la conversation),
 * sans repasser par le formulaire public : nom/téléphone/boutique sont déjà
 * connus via le compte et la conversation. Le RPC `submit_client_conversation_order`
 * crée la fiche client_requests + la vente "nouveau" ; le texte de la
 * commande est aussi posté comme message du chat pour rester visible dans la
 * conversation, comme n'importe quel autre message.
 */
export async function createClientOrderAction(
  conversationId: string,
  requestText: string,
  photos: string[],
): Promise<CreateClientOrderResult> {
  const trimmed = requestText.trim();
  if (!trimmed) {
    return { error: "Merci de décrire votre commande." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Utilisateur non authentifié." };
  }

  const { error: rpcError } = await supabase.rpc("submit_client_conversation_order", {
    target_conversation_id: conversationId,
    request_text: trimmed,
    request_photos: photos,
  });

  if (rpcError) {
    return { error: "Impossible d'envoyer votre commande." };
  }

  await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_role: "client",
    sender_user_id: user.id,
    body: trimmed,
  });

  revalidatePath(`/mes-conversations/${conversationId}`);

  await sendConversationPushNotification(conversationId, {
    title: "Nouvelle commande",
    body: trimmed.slice(0, 120),
    url: `/messagerie/${conversationId}`,
  });

  return { error: null };
}
