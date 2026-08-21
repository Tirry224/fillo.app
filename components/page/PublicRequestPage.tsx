import { Container } from "@/components";
import { PublicBrandHeader } from "@/components/pagesSections/PublicRequestPageSections/PublicBrandHeader";
import { PublicRequestForm } from "@/components/pagesSections/PublicRequestPageSections/PublicRequestForm";
import type { Shop } from "@/lib/mockData";

export function PublicRequestPage({ shop }: { shop: Shop }) {
  return (
    <Container className="gap-8">
      <PublicBrandHeader shop={shop} />
      <PublicRequestForm shopSlug={shop.slug} />
    </Container>
  );
}
