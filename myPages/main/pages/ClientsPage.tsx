import { AppNavigation, Container } from "@/app/components";
import { ClientList } from "@/myPages/main/sections/ClientsPageSections/ClientList";
import { ClientsHeader } from "@/myPages/main/sections/ClientsPageSections/ClientsHeader";
import { requireShopWorkspace } from "@/lib/data";

export async function ClientsPage() {
  const { clients, sales, settings } = await requireShopWorkspace();
  const settingsIncomplete =
    !settings.shopName || !settings.phone || !settings.location || !settings.email;

  return (
    <Container className="gap-8 pb-24">
      <ClientsHeader clientCount={clients.length} />
      <ClientList clients={clients} sales={sales} />
      <AppNavigation settingsIncomplete={settingsIncomplete} />
    </Container>
  );
}
