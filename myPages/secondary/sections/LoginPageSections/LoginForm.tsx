"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, PasswordField, TextField, Typography } from "@/app/components";
import { loginAction, type AuthActionState } from "@/lib/actions/auth";
import { isSafeRedirectPath } from "@/lib/utils/redirect";

function getSafeNextUrl(nextParam: string | null): string | null {
  if (!nextParam) return null;
  return isSafeRedirectPath(nextParam) ? nextParam : null;
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = getSafeNextUrl(searchParams.get("next"));
  const resetSucceeded = searchParams.get("reset") === "success";
  const linkInvalid = searchParams.get("error") === "lien-invalide";

  const initialState: AuthActionState = {
    error: linkInvalid
      ? "Ce lien n'est plus valide ou a expiré. Merci d'en demander un nouveau."
      : null,
    info: resetSucceeded
      ? "Votre mot de passe a été mis à jour. Connectez-vous avec votre nouveau mot de passe."
      : null,
  };
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form className="grid gap-4" action={formAction}>
      <input type="hidden" name="next" value={next ?? "/dashboard"} />
      <TextField
        autoComplete="email"
        label="Adresse email"
        name="email"
        placeholder="vous@exemple.com"
        type="email"
        required
      />
      <div className="grid gap-1.5">
        <PasswordField
          autoComplete="current-password"
          name="password"
          placeholder="••••••••"
          required
        />
        <Link
          className="justify-self-end text-xs font-bold text-navy underline"
          href={next ? `/mot-de-passe-oublie?next=${encodeURIComponent(next)}` : "/mot-de-passe-oublie"}
        >
          Mot de passe oublié ?
        </Link>
      </div>
      <Button disabled={pending} fullWidth size="lg" type="submit">
        {pending ? "Connexion..." : "Se connecter"}
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
      <Typography component="p" className="text-center" variant="caption2">
        <span>Pas encore de compte ? </span>
        <Link
          className="font-bold text-navy underline"
          href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"}
        >
          Créer un compte
        </Link>
      </Typography>
    </form>
  );
}
