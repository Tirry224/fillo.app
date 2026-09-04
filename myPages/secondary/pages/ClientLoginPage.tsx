import { BrandHeader, Container, Typography } from "@/app/components";
import { ClientLoginForm } from "@/myPages/secondary/sections/ClientLoginPageSections/ClientLoginForm";

export function ClientLoginPage() {
  return (
    <Container>
      <BrandHeader />
      <div className="flex flex-1 flex-col justify-center gap-6 py-4">
        <div className="grid gap-1">
          <Typography component="h1" variant="h3">
            Vos conversations Fillo
          </Typography>
          <Typography component="p" variant="body-base">
            Connectez-vous avec votre numéro de téléphone et votre mot de passe.
          </Typography>
        </div>
        <ClientLoginForm />
      </div>
    </Container>
  );
}
