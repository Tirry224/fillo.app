import { BrandHeader, Container, Typography } from "@/app/components";
import { ResetPasswordForm } from "@/myPages/secondary/sections/ResetPasswordPageSections/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";

export async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Container>
      <BrandHeader />
      <div className="flex flex-1 flex-col justify-center gap-6 py-4">
        <div className="grid gap-2">
          <Typography component="h1" variant="h2">
            Nouveau mot de passe
          </Typography>
          {user ? (
            <Typography component="p" variant="caption2">
              Choisissez un nouveau mot de passe pour votre compte.
            </Typography>
          ) : (
            <Typography component="p" variant="caption2">
              Ce lien de réinitialisation n&apos;est plus valide ou a expiré.
              Merci d&apos;en demander un nouveau depuis la page de
              connexion.
            </Typography>
          )}
        </div>
        {user ? <ResetPasswordForm /> : null}
      </div>
    </Container>
  );
}
