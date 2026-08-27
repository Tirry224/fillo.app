"use client";

import { useActionState } from "react";
import { Button, PasswordField, Typography } from "@/app/components";
import { resetPasswordAction, type AuthActionState } from "@/lib/actions/auth";

const initialState: AuthActionState = { error: null };

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  return (
    <form className="grid gap-4" action={formAction}>
      <PasswordField
        autoComplete="new-password"
        label="Nouveau mot de passe"
        name="newPassword"
        placeholder="••••••••"
        required
      />
      <PasswordField
        autoComplete="new-password"
        label="Confirmer le nouveau mot de passe"
        name="confirmPassword"
        placeholder="••••••••"
        required
      />
      <Button disabled={pending} fullWidth size="lg" type="submit">
        {pending ? "Enregistrement..." : "Définir le nouveau mot de passe"}
      </Button>
      {state.error ? (
        <Typography component="p" variant="caption2" className="text-[#b33434]">
          {state.error}
        </Typography>
      ) : null}
    </form>
  );
}
