import Link from "next/link";
import { Button, PasswordField, PhoneField, Typography } from "@/components";

export function LoginForm() {
  return (
    <form className="grid gap-4" action="/login" method="post">
      <PhoneField
        autoComplete="tel"
        name="phone"
        placeholder="620 45 89 12"
        required
      />
      <PasswordField
        autoComplete="current-password"
        name="password"
        placeholder="••••••••"
        required
      />
      <Button fullWidth size="lg" type="submit">
        Se connecter
      </Button>
      <Typography component="p" className="text-center" variant="caption2">
        <span>Pas encore de compte ? </span>
        <Link className="font-bold text-navy underline" href="/register">
          Créer un compte
        </Link>
      </Typography>
    </form>
  );
}
