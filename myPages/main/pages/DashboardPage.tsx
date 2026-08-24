import { AppNavigation, Container } from "@/app/components";
import { DashboardHeader } from "@/myPages/main/sections/DashboardPageSections/DashboardHeader";
import { ImmediateRequest } from "@/myPages/main/sections/DashboardPageSections/ImmediateRequest";
import { SalesSummary } from "@/myPages/main/sections/DashboardPageSections/SalesSummary";

export function DashboardPage() {
  return (
    <Container className="pb-24">
      <DashboardHeader />
      <div className="grid flex-1 content-start gap-8 py-8">
        <SalesSummary />
        <ImmediateRequest />
      </div>
      <AppNavigation />
    </Container>
  );
}
