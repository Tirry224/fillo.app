import { createClient } from "@/lib/supabase/server";
import type { Message, ShopConversation } from "@/lib/types";

/** Liste des conversations d'une boutique, les plus récentes d'abord, avec indicateur de non-lu. */
export async function getShopConversations(shopId: string): Promise<ShopConversation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("id, client_id, last_message_at, shop_last_read_at, clients(name, initials)")
    .eq("shop_id", shopId)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error("Impossible de charger les conversations. Merci de réessayer.");
  }

  return (data ?? []).map((c) => ({
    id: c.id,
    clientId: c.client_id,
    clientName: c.clients?.name ?? "Client",
    clientInitials: c.clients?.initials ?? "?",
    lastMessageAt: c.last_message_at ? new Date(c.last_message_at).getTime() : null,
    unread: Boolean(
      c.last_message_at &&
        (!c.shop_last_read_at || new Date(c.last_message_at) > new Date(c.shop_last_read_at)),
    ),
  }));
}

export type ShopConversationDetail = {
  id: string;
  clientId: string;
  clientName: string;
  clientInitials: string;
  messages: Message[];
};

/**
 * Détail d'une conversation pour la boutique courante (filtrée par `shopId`
 * en plus de la RLS, en défense en profondeur - même principe que
 * `deleteClientAction`). Marque aussi la conversation comme lue côté
 * commerçant.
 */
export async function getShopConversationDetail(
  shopId: string,
  conversationId: string,
): Promise<ShopConversationDetail | null> {
  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, client_id, clients(name, initials)")
    .eq("id", conversationId)
    .eq("shop_id", shopId)
    .maybeSingle();

  if (!conversation) {
    return null;
  }

  const { data: messagesData } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_role, body, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  // "now" (valeur spéciale Postgres, résolue côté serveur) plutôt que
  // new Date() : l'horloge de la machine qui exécute ce code peut dériver de
  // celle du serveur Postgres, ce qui fausserait la comparaison avec
  // last_message_at (lui-même écrit par un trigger via now() côté serveur).
  await supabase
    .from("conversations")
    .update({ shop_last_read_at: "now" })
    .eq("id", conversationId);

  return {
    id: conversation.id,
    clientId: conversation.client_id,
    clientName: conversation.clients?.name ?? "Client",
    clientInitials: conversation.clients?.initials ?? "?",
    messages: (messagesData ?? []).map((m) => ({
      id: m.id,
      conversationId: m.conversation_id,
      senderRole: m.sender_role,
      body: m.body,
      createdAt: new Date(m.created_at).getTime(),
    })),
  };
}
