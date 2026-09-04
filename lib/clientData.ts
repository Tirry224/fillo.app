import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ClientConversation, Message } from "@/lib/types";

export type ClientWorkspace = {
  userId: string;
  /** Numéro de téléphone connu pour ce client (repris de sa première fiche liée), pour affichage seulement. */
  phone: string | null;
};

/**
 * Authentifie le client courant. Contrairement à `requireShopWorkspace`, ne
 * redirige jamais vers l'espace commerçant : un compte client et un compte
 * boutique sont deux identités Supabase Auth distinctes (voir
 * `clients.user_id` vs `shop_members.user_id`), ce n'est pas parce qu'une
 * session existe qu'elle correspond à un client.
 */
export const requireClientWorkspace = cache(async (): Promise<ClientWorkspace> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/mes-conversations/connexion");
  }

  const { data } = await supabase
    .from("clients")
    .select("phone")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  return { userId: user.id, phone: data?.phone ?? null };
});

/** Liste des conversations du client courant, les plus récentes d'abord. */
export async function getClientConversations(): Promise<ClientConversation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("id, last_message_at, shops(name, initial)")
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error("Impossible de charger vos conversations. Merci de réessayer.");
  }

  return (data ?? []).map((c) => ({
    id: c.id,
    shopName: c.shops?.name ?? "Boutique",
    shopInitial: c.shops?.initial ?? "?",
    lastMessageAt: c.last_message_at ? new Date(c.last_message_at).getTime() : null,
  }));
}

export type ClientConversationDetail = {
  id: string;
  shopName: string;
  shopInitial: string;
  messages: Message[];
};

/**
 * Détail d'une conversation (RLS garantit qu'elle appartient bien au client
 * courant - `null` si introuvable ou pas la sienne, sans distinguer les deux
 * cas pour ne rien révéler sur l'existence d'une conversation d'un tiers).
 * Marque aussi la conversation comme lue par le client.
 */
export async function getClientConversationDetail(
  conversationId: string,
): Promise<ClientConversationDetail | null> {
  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, shops(name, initial)")
    .eq("id", conversationId)
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
    .update({ client_last_read_at: "now" })
    .eq("id", conversationId);

  return {
    id: conversation.id,
    shopName: conversation.shops?.name ?? "Boutique",
    shopInitial: conversation.shops?.initial ?? "?",
    messages: (messagesData ?? []).map((m) => ({
      id: m.id,
      conversationId: m.conversation_id,
      senderRole: m.sender_role,
      body: m.body,
      createdAt: new Date(m.created_at).getTime(),
    })),
  };
}
