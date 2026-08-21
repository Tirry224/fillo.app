import { SalePage } from "@/components/page/SalePage";
import { getSaleById } from "@/lib/mockData";
import { notFound } from "next/navigation";

export default async function SaleRoute({
  params,
}: {
  params: Promise<{ saleId: string }>;
}) {
  const { saleId } = await params;
  const sale = getSaleById(saleId);

  if (!sale) {
    notFound();
  }

  return <SalePage sale={sale} />;
}
