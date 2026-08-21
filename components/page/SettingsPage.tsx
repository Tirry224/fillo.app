import { AppNavigation, Container, Typography } from "@/components";

export function SettingsPage() {
  return (
    <Container className="gap-8 pb-24">
      <Typography component="h1" variant="h2">
        Réglages
      </Typography>
      <Typography component="p" variant="body-base">
        Les réglages de votre boutique seront disponibles ici.
      </Typography>
      <AppNavigation active="settings" />
    </Container>
  );
}
