import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Typography } from "@/app/components";
import { MessageList } from "@/myPages/secondary/sections/ClientConversationDetailPageSections/MessageList";
import { MessageForm } from "@/myPages/secondary/sections/ClientConversationDetailPageSections/MessageForm";
import { requireClientWorkspace, getClientConversationDetail } from "@/lib/clientData";

export async function ClientConversationDetailPage({
  conversationId,
}: {
  conversationId: string;
}) {
  await requireClientWorkspace();
  const conversation = await getClientConversationDetail(conversationId);

  if (!conversation) {
    notFound();
  }

  return (
    <Container className="gap-3">
      <Link
        aria-label="Retour à mes conversations"
        className="inline-flex items-center gap-2 text-navy"
        href="/mes-conversations"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        <Typography component="span" variant="body-base" className="font-bold">
          {conversation.shopName}
        </Typography>
      </Link>
      <MessageList messages={conversation.messages} />
      <MessageForm conversationId={conversation.id} />
    </Container>
  );
}
