import { BrandHeader, Container, Typography } from "@/app/components";
import { ConversationList } from "@/myPages/secondary/sections/ClientConversationsPageSections/ConversationList";
import { ClientLogoutButton } from "@/myPages/secondary/sections/ClientConversationsPageSections/ClientLogoutButton";
import { requireClientWorkspace, getClientConversations } from "@/lib/clientData";

export async function ClientConversationsPage() {
  await requireClientWorkspace();
  const conversations = await getClientConversations();

  return (
    <Container className="gap-6">
      <BrandHeader />
      <Typography component="h1" variant="h3">
        Mes conversations
      </Typography>
      <ConversationList conversations={conversations} />
      <ClientLogoutButton />
    </Container>
  );
}
