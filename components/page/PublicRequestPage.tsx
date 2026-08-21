import { Container } from "@/components";
import { PublicBrandHeader } from "@/components/pagesSections/PublicRequestPageSections/PublicBrandHeader";
import { PublicRequestForm } from "@/components/pagesSections/PublicRequestPageSections/PublicRequestForm";

export function PublicRequestPage() {
  return (
    <Container className="gap-8">
      <PublicBrandHeader />
      <PublicRequestForm />
    </Container>
  );
}
