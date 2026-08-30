import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicRequestPage } from "@/myPages/secondary/pages/PublicRequestPage";
import { getPublicShop } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shopSlug: string }>;
}): Promise<Metadata> {
  const { shopSlug } = await params;
  const shop = await getPublicShop(shopSlug);

  if (!shop) {
    return {};
  }

  const title = `${shop.name} sur Fillo`;
  const description = `Envoyez votre demande directement à ${shop.name}`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function PublicRequestRoute({
  params,
}: {
  params: Promise<{ shopSlug: string }>;
}) {
  const { shopSlug } = await params;
  const shop = await getPublicShop(shopSlug);

  if (!shop) {
    notFound();
  }

  return <PublicRequestPage shop={shop} />;
}
