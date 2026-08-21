import { ClientDetailPage } from "@/components/page/ClientDetailPage";
import { getClientById } from "@/lib/mockData";
import { notFound } from "next/navigation";

export default async function ClientDetailRoute({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = getClientById(clientId);

  if (!client) {
    notFound();
  }

  return <ClientDetailPage client={client} />;
}
