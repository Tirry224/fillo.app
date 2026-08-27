import { AppNavigation, Container } from "@/app/components";
import { DashboardHeader } from "@/myPages/main/sections/DashboardPageSections/DashboardHeader";
import { ImmediateRequest } from "@/myPages/main/sections/DashboardPageSections/ImmediateRequest";
import { SalesSummary } from "@/myPages/main/sections/DashboardPageSections/SalesSummary";
import { requireShopWorkspace } from "@/lib/data";

export async function DashboardPage() {
  const { shop, settings, sales, requests } = await requireShopWorkspace();
  const settingsIncomplete =
    !settings.shopName || !settings.phone || !settings.location || !settings.email;

  return (
    <Container className="pb-24">
      <DashboardHeader shop={shop} emailNotifications={settings.emailNotifications} />
      <div className="grid flex-1 content-start gap-8 py-8">
        <SalesSummary sales={sales} />
        <ImmediateRequest requests={requests} sales={sales} />
      </div>
      <AppNavigation settingsIncomplete={settingsIncomplete} />
    </Container>
  );
}
