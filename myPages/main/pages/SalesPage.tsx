import { Container } from "@/app/components";
import { SalesEvolution } from "@/myPages/main/sections/SalesPageSections/SalesEvolution";
import { SalesHeader } from "@/myPages/main/sections/SalesPageSections/SalesHeader";
import { SalesStats } from "@/myPages/main/sections/SalesPageSections/SalesStats";
import { requireShopWorkspace } from "@/lib/data";

export async function SalesPage() {
  const { sales } = await requireShopWorkspace();

  return (
    <Container className="gap-8 pb-[calc(var(--nav-height)+env(safe-area-inset-bottom))]">
      <SalesHeader />
      <SalesStats sales={sales} />
      <SalesEvolution sales={sales} />
    </Container>
  );
}
