import type { ReactNode } from "react";
import { MainShell } from "@/app/components";
import { requireShopWorkspace } from "@/lib/data";

export default async function MainLayout({ children }: { children: ReactNode }) {
  const { shop, settings } = await requireShopWorkspace();
  const settingsIncomplete =
    !settings.shopName || !settings.phone || !settings.location || !settings.email;

  return (
    <MainShell
      settingsIncomplete={settingsIncomplete}
      shopId={shop.id}
      soundNotificationsEnabled={settings.emailNotifications}
    >
      {children}
    </MainShell>
  );
}
