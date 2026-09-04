import { MessagingConversationPage } from "@/myPages/secondary/pages/MessagingConversationPage";

export default async function MessagingConversationRoute({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  return <MessagingConversationPage conversationId={conversationId} />;
}
