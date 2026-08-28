"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppNavigation } from "./AppNavigation";
import { createClient } from "@/lib/supabase/client";
import { playNotificationSound } from "@/lib/utils/notificationSound";

export type MainShellProps = {
  children: ReactNode;
  shopId: string;
  settingsIncomplete: boolean;
  soundNotificationsEnabled: boolean;
};

export function MainShell({
  children,
  shopId,
  settingsIncomplete,
  soundNotificationsEnabled,
}: MainShellProps) {
  const pathname = usePathname();
  const [hasNewRequest, setHasNewRequest] = useState(false);
  const [seenPathname, setSeenPathname] = useState(pathname);

  if (pathname !== seenPathname) {
    setSeenPathname(pathname);
    if (pathname === "/dashboard") {
      setHasNewRequest(false);
    }
  }

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`sales-inserts-${shopId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sales",
          filter: `shop_id=eq.${shopId}`,
        },
        () => {
          setHasNewRequest(true);
          if (soundNotificationsEnabled) {
            playNotificationSound();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shopId, soundNotificationsEnabled]);

  return (
    <>
      {children}
      <AppNavigation
        newRequestBadge={hasNewRequest}
        settingsIncomplete={settingsIncomplete}
      />
    </>
  );
}
