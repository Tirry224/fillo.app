"use client";

import { useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import { Button, Card, PasswordField, Typography } from "@/app/components";
import { updatePasswordAction } from "@/lib/actions/auth";
import { SettingRow, SettingsGroup } from "./SettingsSection";

export function AccountSettings() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function closeDialog() {
    setOpen(false);
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setError(null);
    setPending(true);
    const result = await updatePasswordAction(
      { error: null },
      formData,
    );
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    event.currentTarget.reset();
    setSuccess(true);
  }

  return (
    <>
      <SettingsGroup title="Compte">
        <SettingRow
          detail=""
          icon={<LockKeyhole size={27} strokeWidth={1.8} />}
          label="Changer le mot de passe"
          onClick={() => setOpen(true)}
        />
      </SettingsGroup>

      {open ? (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <Card className="grid w-full max-w-sm gap-4 p-5 shadow-lg" warm>
            <Typography component="p" variant="h4" className="text-center">
              Changer le mot de passe
            </Typography>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <PasswordField
                autoComplete="current-password"
                label="Mot de passe actuel"
                name="currentPassword"
                placeholder="••••••••"
                required
              />
              <PasswordField
                autoComplete="new-password"
                label="Nouveau mot de passe"
                name="newPassword"
                placeholder="••••••••"
                required
              />
              <PasswordField
                autoComplete="new-password"
                label="Confirmer le nouveau mot de passe"
                name="confirmPassword"
                placeholder="••••••••"
                required
              />
              {error ? (
                <Typography component="p" variant="caption2" className="text-[#b33434]">
                  {error}
                </Typography>
              ) : null}
              {success ? (
                <Typography component="p" variant="caption2" className="text-green">
                  Mot de passe mis à jour avec succès.
                </Typography>
              ) : null}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  disabled={pending}
                  onClick={closeDialog}
                  type="button"
                  variant="secondary"
                >
                  {success ? "Fermer" : "Annuler"}
                </Button>
                <Button disabled={pending} type="submit">
                  {pending ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </>
  );
}
