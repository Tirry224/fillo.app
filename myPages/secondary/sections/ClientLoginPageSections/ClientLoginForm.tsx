"use client";

import { useActionState } from "react";
import { Button, PhoneField, PasswordField, Typography } from "@/app/components";
import { loginClientAction, type ClientAuthActionState } from "@/lib/actions/clientAuth";

const initialState: ClientAuthActionState = { error: null };

export function ClientLoginForm() {
  const [state, formAction, pending] = useActionState(loginClientAction, initialState);

  return (
    <form className="grid gap-4" action={formAction}>
      <PhoneField label="Numéro de téléphone" name="phone" placeholder="624 6xx xx xx xx" required />
      <PasswordField autoComplete="current-password" name="password" placeholder="••••••••" required />
      <Button disabled={pending} fullWidth size="lg" type="submit">
        {pending ? "Connexion..." : "Se connecter"}
      </Button>
      {state.error ? (
        <Typography component="p" variant="caption2" className="text-[#b33434]">
          {state.error}
        </Typography>
      ) : null}
    </form>
  );
}
