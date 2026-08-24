import { SalePage } from "@/myPages/secondary/pages/SalePage";

export default async function SaleRoute({
  params,
}: {
  params: Promise<{ saleId: string }>;
}) {
  const { saleId } = await params;
  return <SalePage saleId={saleId} />;
}
