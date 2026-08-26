"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  PasswordField,
  PhoneField,
  Typography,
} from "@/app/components";
import { useAppStore } from "@/lib/appStore";

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

export function LoginForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAppStore();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await login(
      String(formData.get("phone") ?? ""),
      String(formData.get("password") ?? ""),
    );
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
    const nextParam = getSafeNextUrl(searchParams.get("next"));
    router.push(safeNextTarget(nextParam));
  }

  function safeNextTarget(nextParam: string | null) {
    return nextParam || "/dashboard";
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
      <Button disabled={loading} fullWidth size="lg" type="submit">
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
      {submitted ? (
        <Typography component="p" variant="caption2" className="text-green">
          Connexion prête à être traitée.
        </Typography>
      ) : null}
      {error ? (
        <Typography component="p" variant="caption2" className="text-[#b33434]">
          {error}
        </Typography>
      ) : null}
      <Typography component="p" className="text-center" variant="caption2">
        <span>Pas encore de compte ? </span>
        <Link
          className="font-bold text-navy underline"
          href={
            getSafeNextUrl(searchParams.get("next"))
              ? `/register?next=${encodeURIComponent(
                  getSafeNextUrl(searchParams.get("next"))!,
                )}`
              : "/register"
          }
        >
          Créer un compte
        </Link>
      </Typography>
    </form>
  );
}
