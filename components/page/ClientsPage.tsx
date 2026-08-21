import { AppNavigation, Container } from "@/components";
import { ClientList } from "@/components/pagesSections/ClientsPageSections/ClientList";
import { ClientsHeader } from "@/components/pagesSections/ClientsPageSections/ClientsHeader";

export function ClientsPage() {
  return (
    <Container className="gap-8 pb-24">
      <ClientsHeader />
      <ClientList />
      <AppNavigation active="clients" />
    </Container>
  );
}
