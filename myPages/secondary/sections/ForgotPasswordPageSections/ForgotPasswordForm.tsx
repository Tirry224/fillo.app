"use client";

import { useActionState } from "react";
import { Button, TextField, Typography } from "@/app/components";
import {
  requestPasswordResetAction,
  type AuthActionState,
} from "@/lib/actions/auth";

const initialState: AuthActionState = { error: null };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <form className="grid gap-4" action={formAction}>
      <TextField
        autoComplete="email"
        label="Adresse email"
        name="email"
        placeholder="vous@exemple.com"
        type="email"
        required
      />
      <Button disabled={pending} fullWidth size="lg" type="submit">
        {pending ? "Envoi..." : "Envoyer le lien de réinitialisation"}
      </Button>
      {state.error ? (
        <Typography component="p" variant="caption2" className="text-[#b33434]">
          {state.error}
        </Typography>
      ) : null}
      {state.info ? (
        <Typography component="p" variant="caption2" className="text-green">
          {state.info}
        </Typography>
      ) : null}
    </form>
  );
}
