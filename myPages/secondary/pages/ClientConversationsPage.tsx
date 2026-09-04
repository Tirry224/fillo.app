import { BrandHeader, Container, Typography } from "@/app/components";
import { ClientLogoutButton } from "@/myPages/secondary/sections/ClientConversationsPageSections/ClientLogoutButton";
import { requireClientWorkspace } from "@/lib/clientData";

export async function ClientConversationsPage() {
  const { phone } = await requireClientWorkspace();

  return (
    <Container className="gap-8">
      <BrandHeader />
      <div className="grid gap-2">
        <Typography component="h1" variant="h3">
          Mes conversations
        </Typography>
        <Typography component="p" variant="body-base">
          {phone
            ? `Connecté avec le numéro ${phone}.`
            : "Connecté."}{" "}
          Vos conversations avec les boutiques apparaîtront bientôt ici.
        </Typography>
      </div>
      <ClientLogoutButton />
    </Container>
  );
}
