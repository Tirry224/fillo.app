import { SalesByStatusPage } from "@/myPages/secondary/pages/SalesByStatusPage";

export default async function SalesByStatusRoute({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const { status } = await params;
  return <SalesByStatusPage status={status} />;
}
