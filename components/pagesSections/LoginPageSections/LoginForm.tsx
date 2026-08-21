"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { Button, PasswordField, PhoneField, Typography } from "@/components";

export function LoginForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
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
      {submitted ? (
        <Typography component="p" variant="caption2" className="text-green">
          Connexion prête à être traitée.
        </Typography>
      ) : null}
      <Typography component="p" className="text-center" variant="caption2">
        <span>Pas encore de compte ? </span>
        <Link className="font-bold text-navy underline" href="/register">
          Créer un compte
        </Link>
      </Typography>
    </form>
  );
}
