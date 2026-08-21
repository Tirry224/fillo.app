import { AppNavigation, Container } from "@/components";
import { SalesEvolution } from "@/components/pagesSections/SalesPageSections/SalesEvolution";
import { SalesHeader } from "@/components/pagesSections/SalesPageSections/SalesHeader";
import { SalesStats } from "@/components/pagesSections/SalesPageSections/SalesStats";

export function SalesPage() {
  return (
    <Container className="gap-8 pb-24">
      <SalesHeader />
      <SalesStats />
      <SalesEvolution />
      <AppNavigation />
    </Container>
  );
}
