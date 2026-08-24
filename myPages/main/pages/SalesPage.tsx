import { AppNavigation, Container } from "@/app/components";
import { SalesEvolution } from "@/myPages/main/sections/SalesPageSections/SalesEvolution";
import { SalesHeader } from "@/myPages/main/sections/SalesPageSections/SalesHeader";
import { SalesStats } from "@/myPages/main/sections/SalesPageSections/SalesStats";

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
