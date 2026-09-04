"use server";

import { createClient } from "@/lib/supabase/server";

export type PushSubscriptionState = { error: string | null };

export type SavePushSubscriptionInput = {
  endpoint: string;
  p256dh: string;
  authKey: string;
};

/**
 * Enregistre (ou met à jour) l'abonnement push de l'appareil courant pour
 * l'utilisateur connecté - commerçant ou client, les deux sont de simples
 * utilisateurs Supabase Auth. `endpoint` est unique : un ré-abonnement sur le
 * même navigateur met simplement à jour la ligne existante.
 */
export async function savePushSubscriptionAction(
  input: SavePushSubscriptionInput,
): Promise<PushSubscriptionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Utilisateur non authentifié." };
  }

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint: input.endpoint,
      p256dh: input.p256dh,
      auth_key: input.authKey,
    },
    { onConflict: "endpoint" },
  );

  if (error) {
    return { error: "Impossible d'activer les notifications." };
  }

  return { error: null };
}

export async function removePushSubscriptionAction(endpoint: string): Promise<PushSubscriptionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Utilisateur non authentifié." };
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Impossible de désactiver les notifications." };
  }

  return { error: null };
}
