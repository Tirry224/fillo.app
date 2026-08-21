import { Container } from "@/components";
import { SaleHeader } from "@/components/pagesSections/SalePageSections/SaleHeader";
import { SaleSummary } from "@/components/pagesSections/SalePageSections/SaleSummary";

export function SalePage() {
  return (
    <Container className="gap-8">
      <SaleHeader />
      <SaleSummary />
    </Container>
  );
}
