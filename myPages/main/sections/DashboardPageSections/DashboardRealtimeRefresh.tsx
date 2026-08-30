"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Écoute les ventes de la boutique en temps réel (Supabase Realtime) et
 * rafraîchit le tableau de bord dès qu'une commande arrive ou change de
 * statut, sans que le commerçant ait à recharger la page manuellement. Ne
 * rend rien à l'écran : composant purement fonctionnel.
 */
export function DashboardRealtimeRefresh({ shopId }: { shopId: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`dashboard-sales-${shopId}`)
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
