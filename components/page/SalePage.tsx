import { Container } from "@/components";
import { SaleHeader } from "@/components/pagesSections/SalePageSections/SaleHeader";
import { SaleSummary } from "@/components/pagesSections/SalePageSections/SaleSummary";
import type { Sale } from "@/lib/mockData";

export function SalePage({ sale }: { sale: Sale }) {
  return (
    <Container className="gap-8">
      <SaleHeader sale={sale} />
      <SaleSummary sale={sale} />
    </Container>
  );
}
