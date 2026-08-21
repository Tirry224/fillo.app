"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  Button,
  PasswordField,
  PhoneField,
  TextField,
  Typography,
} from "@/components";

export function RegisterForm() {
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
      <TextField
        autoComplete="organization"
        label="Nom de la boutique"
        name="shopName"
        placeholder="Ex. Boutique Diallo Tissus"
        required
      />
      <PasswordField
        autoComplete="new-password"
        name="password"
        placeholder="••••••••"
        required
      />
      <Button fullWidth size="lg" type="submit">
        Continuer
      </Button>
      {submitted ? (
        <Typography component="p" variant="caption2" className="text-green">
          Votre boutique est prête à être créée.
        </Typography>
      ) : null}
      <Typography component="p" className="text-center" variant="caption2">
        <Link className="font-bold text-navy" href="/login">
          <span>Déjà un compte ? </span>
          <span className="underline">Se connecter</span>
        </Link>
      </Typography>
    </form>
  );
}
