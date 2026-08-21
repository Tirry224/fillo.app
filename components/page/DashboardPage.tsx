import { AppNavigation, Container } from "@/components";
import { DashboardHeader } from "@/components/pagesSections/DashboardPageSections/DashboardHeader";
import { ImmediateRequest } from "@/components/pagesSections/DashboardPageSections/ImmediateRequest";
import { SalesSummary } from "@/components/pagesSections/DashboardPageSections/SalesSummary";

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
