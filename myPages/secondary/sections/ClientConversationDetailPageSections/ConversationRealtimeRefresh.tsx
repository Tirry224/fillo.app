"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Écoute les nouveaux messages de cette conversation en temps réel
 * (Supabase Realtime) et rafraîchit la page dès qu'un message arrive, sans
 * que le client ait à recharger manuellement (même pattern que
 * DashboardRealtimeRefresh côté commerçant).
 */
export function ConversationRealtimeRefresh({ conversationId }: { conversationId: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`client-conversation-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, router]);

  return null;
}
