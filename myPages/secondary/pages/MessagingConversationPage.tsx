import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Typography } from "@/app/components";
import { MessageList } from "@/myPages/secondary/sections/MessagingConversationPageSections/MessageList";
import { MessageForm } from "@/myPages/secondary/sections/MessagingConversationPageSections/MessageForm";
import { requireShopWorkspace } from "@/lib/data";
import { getShopConversationDetail } from "@/lib/shopMessaging";

export async function MessagingConversationPage({
  conversationId,
}: {
  conversationId: string;
}) {
  const { shop } = await requireShopWorkspace();
  const conversation = await getShopConversationDetail(shop.id, conversationId);

  if (!conversation) {
    notFound();
  }

  return (
    <Container className="gap-3">
      <Link
        aria-label="Retour à la messagerie"
        className="inline-flex items-center gap-2 text-navy"
        href="/messagerie"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        <Typography component="span" variant="body-base" className="font-bold">
          {conversation.clientName}
        </Typography>
      </Link>
      <MessageList messages={conversation.messages} />
      <MessageForm conversationId={conversation.id} />
    </Container>
  );
}
