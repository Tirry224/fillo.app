"use client";

import { useActionState, useEffect, useState } from "react";
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
  // Change à chaque soumission : sert de `key` pour remonter le message et
  // relancer son délai de disparition, même si le texte affiché est
  // identique à la soumission précédente (ex. renvoyer le même email).
  const [submissionId, setSubmissionId] = useState(0);

  return (
    <form
      className="grid gap-4"
      action={formAction}
      onSubmit={() => setSubmissionId((id) => id + 1)}
    >
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
        <TransientInfo key={submissionId} message={state.info} />
      ) : null}
    </form>
  );
}

/**
 * Message de confirmation qui disparaît de lui-même après 2,5s, comme les
 * autres messages transitoires de l'app (ex. la confirmation de copie du
 * lien client sur le tableau de bord). Remonté via sa `key` à chaque
 * nouvelle soumission pour repartir d'un état visible, sans avoir à
 * réinitialiser un état "caché" depuis un effet.
 */
function TransientInfo({ message }: { message: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const resetTimer = window.setTimeout(() => setHidden(true), 2500);
    return () => window.clearTimeout(resetTimer);
  }, []);

  if (hidden) {
    return null;
  }

  return (
    <Typography
      component="p"
      variant="caption2"
      className="text-center text-green"
    >
      {message}
    </Typography>
  );
}
