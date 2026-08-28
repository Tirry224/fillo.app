import { Container } from "@/app/components";
import { ClientList } from "@/myPages/main/sections/ClientsPageSections/ClientList";
import { ClientsHeader } from "@/myPages/main/sections/ClientsPageSections/ClientsHeader";
import { requireShopWorkspace } from "@/lib/data";

export async function ClientsPage() {
  const { clients, sales } = await requireShopWorkspace();

  return (
    <Container className="gap-8">
      <ClientsHeader clientCount={clients.length} />
      <ClientList clients={clients} sales={sales} />
    </Container>
  );
}
