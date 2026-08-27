import { Container } from "@/app/components";
import { ClientList } from "@/myPages/main/sections/ClientsPageSections/ClientList";
import { ClientsHeader } from "@/myPages/main/sections/ClientsPageSections/ClientsHeader";
import { requireShopWorkspace } from "@/lib/data";

export async function ClientsPage() {
  const { clients, sales } = await requireShopWorkspace();

  return (
    <Container className="gap-8 pb-[calc(var(--nav-height)+env(safe-area-inset-bottom))]">
      <ClientsHeader clientCount={clients.length} />
      <ClientList clients={clients} sales={sales} />
    </Container>
  );
}
