"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Écoute les ventes de la boutique en temps réel et rafraîchit cette page
 * dès qu'une commande arrive ou change de statut, sans rechargement manuel
 * - même pattern que DashboardRealtimeRefresh, dupliqué ici plutôt que
 * partagé car chaque page garde ses propres sections (voir CLAUDE.md).
 */
export function SalesByStatusRealtimeRefresh({ shopId }: { shopId: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`sales-by-status-${shopId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sales",
          filter: `shop_id=eq.${shopId}`,
        },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shopId, router]);

  return null;
}
