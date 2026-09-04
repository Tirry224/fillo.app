import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type PushSubscriptionRow = Database["public"]["Tables"]["push_subscriptions"]["Row"];

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails("mailto:contact@fillo.app", vapidPublicKey, vapidPrivateKey);
}

export type PushPayload = {
  title: string;
  body: string;
  url: string;
};

/**
 * Notifie l'autre participant d'une conversation qu'un nouveau message est
 * arrivé (best effort : le message lui-même est déjà enregistré avant cet
 * appel, un échec d'envoi push ne doit jamais faire échouer l'action qui a
 * envoyé le message).
 */
export async function sendConversationPushNotification(
  conversationId: string,
  payload: PushPayload,
): Promise<void> {
  if (!vapidPublicKey || !vapidPrivateKey) {
    return;
  }

  const supabase = await createClient();
  const { data: subscriptions, error } = await supabase.rpc(
    "get_recipient_push_subscriptions",
    { target_conversation_id: conversationId },
  );

  if (error || !subscriptions || subscriptions.length === 0) {
    return;
  }

  await Promise.all(
    subscriptions.map((subscription) => sendToSubscription(supabase, subscription, payload)),
  );
}

async function sendToSubscription(
  supabase: Awaited<ReturnType<typeof createClient>>,
  subscription: PushSubscriptionRow,
  payload: PushPayload,
): Promise<void> {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth_key },
      },
      JSON.stringify(payload),
    );
  } catch (err) {
    const statusCode = (err as { statusCode?: number }).statusCode;
    if (statusCode === 404 || statusCode === 410) {
      await supabase.rpc("delete_push_subscription", { target_endpoint: subscription.endpoint });
      return;
    }
    console.error("Échec d'envoi d'une notification push :", err);
  }
}
