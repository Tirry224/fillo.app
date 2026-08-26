"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  PasswordField,
  PhoneField,
  TextField,
  Typography,
} from "@/app/components";
import { useAppStore } from "@/lib/appStore";

export function RegisterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { register } = useAppStore();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const success = await register(
      String(formData.get("phone") ?? ""),
      String(formData.get("shopName") ?? ""),
      String(formData.get("password") ?? ""),
    );
    setLoading(false);
    if (!success) {
      setError("Erreur lors de la création du compte.");
      return;
    }
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
      <Button disabled={loading} fullWidth size="lg" type="submit">
        {loading ? "Création..." : "Continuer"}
      </Button>
      {error ? (
        <Typography component="p" variant="caption2" className="text-[#b33434]">
          {error}
        </Typography>
      ) : null}
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
