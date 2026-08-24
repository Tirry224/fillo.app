import { AppNavigation, Container } from "@/app/components";
import { ClientList } from "@/myPages/main/sections/ClientsPageSections/ClientList";
import { ClientsHeader } from "@/myPages/main/sections/ClientsPageSections/ClientsHeader";

export function ClientsPage() {
  return (
    <Container className="gap-8 pb-24">
      <ClientsHeader />
      <ClientList />
      <AppNavigation />
    </Container>
  );
}
