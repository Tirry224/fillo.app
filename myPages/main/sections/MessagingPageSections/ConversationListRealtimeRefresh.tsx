"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Rafraîchit la liste des conversations de la boutique dès qu'un nouveau
 * message arrive (aperçu du dernier message et pastille non-lu à jour sans
 * recharger). Pas de filtre par conversation_id : `messages` n'a pas de
 * colonne shop_id directement, la RLS (can_access_conversation) reste la
 * vraie limite de ce que cet abonnement reçoit réellement.
 */
export function ConversationListRealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("shop-conversations-list")
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
