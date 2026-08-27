import { Container } from "@/app/components";
import { DashboardHeader } from "@/myPages/main/sections/DashboardPageSections/DashboardHeader";
import { ImmediateRequest } from "@/myPages/main/sections/DashboardPageSections/ImmediateRequest";
import { SalesSummary } from "@/myPages/main/sections/DashboardPageSections/SalesSummary";
import { requireShopWorkspace } from "@/lib/data";

export async function DashboardPage() {
  const { shop, settings, sales, requests } = await requireShopWorkspace();

  return (
    <Container className="pb-[calc(var(--nav-height)+env(safe-area-inset-bottom))]">
      <DashboardHeader shop={shop} emailNotifications={settings.emailNotifications} />
      <div className="grid flex-1 content-start gap-8 py-8">
        <SalesSummary sales={sales} />
        <ImmediateRequest requests={requests} sales={sales} />
      </div>
    </Container>
  );
}
