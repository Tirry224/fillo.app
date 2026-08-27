import { notFound } from "next/navigation";
import { PublicRequestPage } from "@/myPages/secondary/pages/PublicRequestPage";
import { createClient } from "@/lib/supabase/server";

export default async function PublicRequestRoute({
  params,
}: {
  params: Promise<{ shopSlug: string }>;
}) {
  const { shopSlug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_shop", {
    shop_slug: shopSlug,
  });

  const shopInfo = data?.[0];
  if (error || !shopInfo) {
    notFound();
  }

  return (
    <PublicRequestPage
      shop={{ slug: shopSlug, name: shopInfo.name, initial: shopInfo.initial }}
    />
  );
}
