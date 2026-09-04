import { ClientConversationDetailPage } from "@/myPages/secondary/pages/ClientConversationDetailPage";

export default async function ClientConversationDetailRoute({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  return <ClientConversationDetailPage conversationId={conversationId} />;
}
