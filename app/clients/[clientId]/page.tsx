import { ClientDetailPage } from "@/components/page/ClientDetailPage";

export default async function ClientDetailRoute({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  return <ClientDetailPage clientId={clientId} />;
}
