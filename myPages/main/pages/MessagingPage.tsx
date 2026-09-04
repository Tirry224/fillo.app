import { Container, Typography } from "@/app/components";
import { ConversationList } from "@/myPages/main/sections/MessagingPageSections/ConversationList";
import { NewConversationSearch } from "@/myPages/main/sections/MessagingPageSections/NewConversationSearch";
import { ConversationListRealtimeRefresh } from "@/myPages/main/sections/MessagingPageSections/ConversationListRealtimeRefresh";
import { requireShopWorkspace } from "@/lib/data";
import { getShopConversations } from "@/lib/shopMessaging";

export async function MessagingPage() {
  const { shop, clients } = await requireShopWorkspace();
  const conversations = await getShopConversations(shop.id);

  return (
    <Container className="gap-6">
      <Typography component="h1" variant="h3">
        Messagerie
      </Typography>
      <NewConversationSearch
        clients={clients}
        existingConversationClientIds={conversations.map((c) => c.clientId)}
      />
      <ConversationList conversations={conversations} />
      <ConversationListRealtimeRefresh />
    </Container>
  );
}
