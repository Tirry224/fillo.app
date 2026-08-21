import { PublicRequestPage } from "@/components/page/PublicRequestPage";
import { getShopBySlug } from "@/lib/mockData";
import { notFound } from "next/navigation";

export default async function PublicRequestRoute({
  params,
}: {
  params: Promise<{ shopSlug: string }>;
}) {
  const { shopSlug } = await params;
  const shop = getShopBySlug(shopSlug);

  if (!shop) {
    notFound();
  }

  return <PublicRequestPage shop={shop} />;
}
