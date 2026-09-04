"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Rafraîchit la liste des conversations dès qu'un nouveau message arrive
 * dans l'une d'elles (aperçu du dernier message à jour sans recharger).
 * Pas de filtre par conversation ici (contrairement à
 * ConversationRealtimeRefresh) : un client a des conversations avec
 * plusieurs boutiques différentes, donc plusieurs client_id - la RLS sur
 * `messages` (can_access_conversation) reste la vraie limite de ce que cet
 * abonnement reçoit réellement, même sans filtre explicite.
 */
export function ConversationListRealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("client-conversations-list")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
