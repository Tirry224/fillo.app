"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, BellOff } from "lucide-react";
import {
  savePushSubscriptionAction,
  removePushSubscriptionAction,
} from "@/lib/actions/pushSubscriptions";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type Status = "checking" | "unsupported" | "denied" | "subscribed" | "unsubscribed";

/**
 * Bouton d'activation des notifications push, utilisable aussi bien côté
 * client (`/mes-conversations`) que côté commerçant (`/messagerie`) : la
 * logique d'abonnement navigateur et les actions serveur associées sont
 * identiques pour les deux, seul l'utilisateur Supabase Auth connecté change.
 * Reprend le style du bouton d'action rond des en-têtes de page (voir
 * `ClientsHeader`) plutôt qu'un bouton texte, pour rester cohérent avec le
 * reste de l'application.
 */
export function PushNotificationToggle() {
  const [status, setStatus] = useState<Status>("checking");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function checkSubscription() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        if (!cancelled) setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        if (!cancelled) setStatus("denied");
        return;
      }
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (!cancelled) setStatus(subscription ? "subscribed" : "unsubscribed");
      } catch {
        if (!cancelled) setStatus("unsupported");
      }
    }

    void checkSubscription();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleEnable() {
    startTransition(async () => {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });

      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
        return;
      }

      const result = await savePushSubscriptionAction({
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        authKey: json.keys.auth,
      });

      setStatus(result.error ? "unsubscribed" : "subscribed");
    });
  }

  function handleDisable() {
    startTransition(async () => {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        await removePushSubscriptionAction(endpoint);
      }
      setStatus("unsubscribed");
    });
  }

  if (status === "checking" || status === "unsupported") {
    return null;
  }

  const subscribed = status === "subscribed";
  const denied = status === "denied";

  return (
    <button
      aria-label={
        denied
          ? "Notifications bloquées par le navigateur"
          : subscribed
            ? "Désactiver les notifications"
            : "Activer les notifications"
      }
      title={
        denied
          ? "Autorisez les notifications dans les réglages du navigateur pour être prévenu des nouveaux messages."
          : undefined
      }
      className="flex size-9 items-center justify-center rounded-[var(--radius-control)] bg-navy text-white disabled:opacity-40"
      disabled={isPending || denied}
      onClick={subscribed ? handleDisable : handleEnable}
      type="button"
    >
      {subscribed ? <Bell aria-hidden="true" size={18} /> : <BellOff aria-hidden="true" size={18} />}
    </button>
  );
}
