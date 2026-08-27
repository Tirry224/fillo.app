import { AppNavigation, Container } from "@/app/components";
import { SalesEvolution } from "@/myPages/main/sections/SalesPageSections/SalesEvolution";
import { SalesHeader } from "@/myPages/main/sections/SalesPageSections/SalesHeader";
import { SalesStats } from "@/myPages/main/sections/SalesPageSections/SalesStats";
import { requireShopWorkspace } from "@/lib/data";

export async function SalesPage() {
  const { sales, settings } = await requireShopWorkspace();
  const settingsIncomplete =
    !settings.shopName || !settings.phone || !settings.location || !settings.email;

  return (
    <Container className="gap-8 pb-24">
      <SalesHeader />
      <SalesStats sales={sales} />
      <SalesEvolution sales={sales} />
      <AppNavigation settingsIncomplete={settingsIncomplete} />
    </Container>
  );
}
