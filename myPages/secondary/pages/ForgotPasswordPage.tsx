import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandHeader, Container, Typography } from "@/app/components";
import { ForgotPasswordForm } from "@/myPages/secondary/sections/ForgotPasswordPageSections/ForgotPasswordForm";

export function ForgotPasswordPage() {
  return (
    <Container>
      <BrandHeader />
      <div className="flex flex-1 flex-col justify-center gap-6 py-4">
        <div className="grid gap-2">
          <Link
            aria-label="Retour à la connexion"
            className="inline-flex items-center gap-2 text-navy"
            href="/login"
          >
            <ArrowLeft aria-hidden="true" size={18} />
            <span className="text-sm font-bold">Connexion</span>
          </Link>
          <Typography component="h1" variant="h2" className="mt-2">
            Mot de passe oublié
          </Typography>
          <Typography component="p" variant="caption2">
            Saisissez votre adresse email : si un compte existe, vous
            recevrez un lien pour définir un nouveau mot de passe.
          </Typography>
        </div>
        <ForgotPasswordForm />
      </div>
    </Container>
  );
}
