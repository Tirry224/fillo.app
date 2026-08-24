"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  PasswordField,
  PhoneField,
  Typography,
} from "@/app/components";
import { useAppStore } from "@/lib/appStore";

export function LoginForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { login } = useAppStore();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const authenticated = login(
      String(formData.get("phone") ?? ""),
      String(formData.get("password") ?? ""),
    );
    setError(!authenticated);
    if (!authenticated) return;
    setSubmitted(true);
    router.push("/dashboard");
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
      {error ? (
        <Typography component="p" variant="caption2" className="text-[#b33434]">
          Téléphone ou mot de passe incorrect.
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
