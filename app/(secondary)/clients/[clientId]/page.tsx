import { ClientDetailPage } from "@/myPages/secondary/pages/ClientDetailPage";

export default async function ClientDetailRoute({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  return <ClientDetailPage clientId={clientId} />;
}
