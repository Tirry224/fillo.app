import type { ReactNode } from "react";
import { AppNavigation } from "@/app/components";
import { requireShopWorkspace } from "@/lib/data";

export default async function MainLayout({ children }: { children: ReactNode }) {
  const { settings } = await requireShopWorkspace();
  const settingsIncomplete =
    !settings.shopName || !settings.phone || !settings.location || !settings.email;

  return (
    <>
      {children}
      <AppNavigation settingsIncomplete={settingsIncomplete} />
    </>
  );
}
