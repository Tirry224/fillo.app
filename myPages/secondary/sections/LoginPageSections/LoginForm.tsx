"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, PasswordField, TextField, Typography } from "@/app/components";
import { loginAction, type AuthActionState } from "@/lib/actions/auth";

function getSafeNextUrl(nextParam: string | null): string | null {
  if (!nextParam) return null;
  if (
    !nextParam.startsWith("/") ||
    nextParam.startsWith("//") ||
    nextParam.startsWith("/\\")
  ) {
    return null;
  }
  return nextParam;
}

const initialState: AuthActionState = { error: null };

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = getSafeNextUrl(searchParams.get("next"));
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
      <PasswordField
        autoComplete="current-password"
        name="password"
        placeholder="••••••••"
        required
      />
      <Button disabled={pending} fullWidth size="lg" type="submit">
        {pending ? "Connexion..." : "Se connecter"}
      </Button>
      {state.error ? (
        <Typography component="p" variant="caption2" className="text-[#b33434]">
          {state.error}
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
