"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, PasswordField, TextField, Typography } from "@/app/components";
import { registerAction, type AuthActionState } from "@/lib/actions/auth";
import { isSafeRedirectPath } from "@/lib/utils/redirect";

function getSafeNextUrl(nextParam: string | null): string | null {
  if (!nextParam) return null;
  return isSafeRedirectPath(nextParam) ? nextParam : null;
}

const initialState: AuthActionState = { error: null };

export function RegisterForm() {
  const searchParams = useSearchParams();
  const next = getSafeNextUrl(searchParams.get("next"));
  const [state, formAction, pending] = useActionState(registerAction, initialState);

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
      <TextField
        autoComplete="organization"
        label="Nom de la boutique"
        name="shopName"
        placeholder="Ex. Ma boutique de tissus"
        required
      />
      <PasswordField
        autoComplete="new-password"
        name="password"
        placeholder="••••••••"
        required
      />
      <Button disabled={pending} fullWidth size="lg" type="submit">
        {pending ? "Création..." : "Continuer"}
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
        <Link
          className="font-bold text-navy"
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
        >
          <span>Déjà un compte ? </span>
          <span className="underline">Se connecter</span>
        </Link>
      </Typography>
    </form>
  );
}
