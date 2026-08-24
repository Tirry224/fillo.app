"use client";

import { Container } from "@/app/components";
import { SaleHeader } from "@/myPages/secondary/sections/SalePageSections/SaleHeader";
import { SaleSummary } from "@/myPages/secondary/sections/SalePageSections/SaleSummary";
import { useAppStore } from "@/lib/appStore";

export function SalePage({ saleId }: { saleId: string }) {
  const { sales } = useAppStore();
  const sale = sales.find(
    (item) => item.id.toLowerCase() === saleId.toLowerCase(),
  );

  if (!sale) {
    return (
      <Container className="gap-8">
        <p className="text-sm text-ink-muted">Cette vente est introuvable.</p>
      </Container>
    );
  }

  return (
    <Container className="gap-8">
      <SaleHeader sale={sale} />
      <SaleSummary sale={sale} />
    </Container>
  );
}
