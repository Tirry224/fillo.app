import { Container } from "@/app/components";
import { PublicBrandHeader } from "@/myPages/secondary/sections/PublicRequestPageSections/PublicBrandHeader";
import { PublicRequestForm } from "@/myPages/secondary/sections/PublicRequestPageSections/PublicRequestForm";
import type { PublicShop } from "@/lib/types";

export function PublicRequestPage({ shop }: { shop: PublicShop }) {
  return (
    <Container className="gap-8">
      <PublicBrandHeader shop={shop} />
      <PublicRequestForm shopSlug={shop.slug} />
    </Container>
  );
}
