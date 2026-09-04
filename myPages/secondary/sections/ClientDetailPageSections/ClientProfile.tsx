"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Avatar, Button, Card, PhoneField, TextField, Typography } from "@/app/components";
import {
  deleteClientAction,
  resetClientPasswordAction,
  updateClientAction,
} from "@/lib/actions/clients";
import type { Client, Sale } from "@/lib/types";
import { getClientStatus } from "@/lib/utils/clientStatus";
import { normalizePhone } from "@/lib/utils/phone";

export function ClientProfile({
  client,
  sales,
}: {
  client: Client;
  sales: Sale[];
}) {
  const router = useRouter();
  const whatsappNumber = `224${normalizePhone(client.phone)}`;
  const status = getClientStatus(client.id, sales);

  const [mode, setMode] = useState<"idle" | "edit" | "delete" | "reset-password">(
    "idle",
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(
    null,
  );

  function closeDialog() {
    setMode("idle");
    setError(null);
    setTemporaryPassword(null);
  }

  async function handleResetPassword() {
    setPending(true);
    setError(null);
    const result = await resetClientPasswordAction(client.id);
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setTemporaryPassword(result.temporaryPassword ?? null);
  }

  async function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    if (!name || !phone) {
      setError("Le nom et le numéro sont obligatoires.");
      return;
    }

    setPending(true);
    setError(null);
    const result = await updateClientAction(client.id, name, phone);
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMode("idle");
    router.refresh();
  }

  async function handleDeleteConfirm() {
    setPending(true);
    setError(null);
    const result = await deleteClientAction(client.id);

    if (result.error) {
      setPending(false);
      setError(result.error);
      return;
    }

    router.push("/clients");
    router.refresh();
  }

  return (
    <div className="relative">
      <section className="grid justify-items-center gap-3 text-center">
        <Avatar
          initials={client.initials}
          status={status}
          className="size-14 text-xl"
        />
        <div className="grid gap-1">
          <Typography component="h1" variant="h3">
            {client.name}
          </Typography>
          <Typography component="p" variant="caption2">
            {client.phone}
          </Typography>
        </div>
        <Link
          className="w-full"
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour ${client.name}, je reviens vers vous concernant votre demande.`)}`}
          target="_blank"
        >
          <Button fullWidth variant="success">
            Discuter sur WhatsApp
          </Button>
        </Link>
        <div className="grid w-full grid-cols-2 gap-3">
          <Button
            fullWidth
            variant="secondary"
            onClick={() => setMode("edit")}
          >
            Modifier
          </Button>
          <Button fullWidth variant="danger" onClick={() => setMode("delete")}>
            Supprimer
          </Button>
        </div>
        {client.userId ? (
          <Button
            fullWidth
            variant="secondary"
            onClick={() => setMode("reset-password")}
          >
            Réinitialiser l&apos;accès Fillo
          </Button>
        ) : null}
      </section>

      {mode === "edit" ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <Card className="grid w-full max-w-sm gap-4 p-5 shadow-lg" warm>
            <Typography component="p" variant="h4" className="text-center">
              Modifier le client
            </Typography>
            <form className="grid gap-4" onSubmit={handleEditSubmit}>
              <TextField
                defaultValue={client.name}
                label="Nom complet"
                name="name"
                required
              />
              <PhoneField
                defaultValue={client.phone}
                label="Numéro WhatsApp"
                name="phone"
                required
              />
              {error ? (
                <Typography component="p" variant="caption2" className="text-[#b33434]">
                  {error}
                </Typography>
              ) : null}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  disabled={pending}
                  onClick={closeDialog}
                  type="button"
                  variant="secondary"
                >
                  Annuler
                </Button>
                <Button disabled={pending} type="submit">
                  {pending ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}

      {mode === "delete" ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <Card className="grid w-full max-w-sm gap-3 p-5 text-center shadow-lg" warm>
            <Typography component="p" variant="h4">
              Supprimer ce client ?
            </Typography>
            <Typography component="p" variant="body-base">
              {client.name} · {client.phone}
            </Typography>
            <Typography component="p" variant="caption2">
              Cette action est définitive et supprimera aussi tout l&apos;historique
              de demandes et de ventes de ce client.
            </Typography>
            {error ? (
              <Typography component="p" variant="caption2" className="text-[#b33434]">
                {error}
              </Typography>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <Button
                disabled={pending}
                onClick={closeDialog}
                type="button"
                variant="secondary"
              >
                Annuler
              </Button>
              <Button
                disabled={pending}
                onClick={handleDeleteConfirm}
                type="button"
                variant="danger"
              >
                {pending ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {mode === "reset-password" ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <Card className="grid w-full max-w-sm gap-3 p-5 text-center shadow-lg" warm>
            {temporaryPassword ? (
              <>
                <Typography component="p" variant="h4">
                  Mot de passe temporaire
                </Typography>
                <Typography component="p" variant="body-base">
                  Communiquez-le vous-même à {client.name}, par exemple sur
                  WhatsApp. Il devra le changer dès sa prochaine connexion.
                </Typography>
                <Typography
                  component="p"
                  variant="h3"
                  className="rounded-lg bg-white/60 py-2 font-mono tracking-widest"
                >
                  {temporaryPassword}
                </Typography>
                <Button onClick={closeDialog} type="button">
                  Fermer
                </Button>
              </>
            ) : (
              <>
                <Typography component="p" variant="h4">
                  Réinitialiser l&apos;accès Fillo de {client.name} ?
                </Typography>
                <Typography component="p" variant="caption2">
                  Un mot de passe temporaire sera généré. Vous devrez vous-même
                  le transmettre au client ; il ne sera pas envoyé
                  automatiquement.
                </Typography>
                {error ? (
                  <Typography component="p" variant="caption2" className="text-[#b33434]">
                    {error}
                  </Typography>
                ) : null}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    disabled={pending}
                    onClick={closeDialog}
                    type="button"
                    variant="secondary"
                  >
                    Annuler
                  </Button>
                  <Button
                    disabled={pending}
                    onClick={handleResetPassword}
                    type="button"
                  >
                    {pending ? "Génération..." : "Réinitialiser"}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
}
