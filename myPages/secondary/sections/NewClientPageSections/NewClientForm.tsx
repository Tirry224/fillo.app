"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  PhoneField,
  TextField,
  Typography,
} from "@/app/components";
import { addClientAction } from "@/lib/actions/clients";

type PendingClient = { name: string; phone: string; message: string };

export function NewClientForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingClient, setPendingClient] = useState<PendingClient | null>(
    null,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !phone || !message) {
      setError("Le nom, le numéro et la demande sont obligatoires.");
      return;
    }

    setError(null);
    setPendingClient({ name, phone, message });
  }

  async function handleConfirm() {
    if (!pendingClient) {
      return;
    }

    setPending(true);
    const result = await addClientAction(
      pendingClient.name,
      pendingClient.phone,
      pendingClient.message,
    );

    if (result.error) {
      setPending(false);
      setPendingClient(null);
      setError(result.error);
      return;
    }

    router.push(`/clients/${result.clientId}`);
    router.refresh();
  }

  return (
    <div className="relative">
      <form
        className={`grid gap-4 transition-opacity duration-300 ${
          pendingClient ? "pointer-events-none opacity-40" : "opacity-100"
        }`}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Nom complet"
          name="name"
          placeholder="Ex. Mariam Camara"
          required
        />
        <PhoneField
          label="Numéro WhatsApp"
          name="phone"
          placeholder="624 6xx xx xx xx"
          required
        />
        <TextField
          label="Demande du client"
          name="message"
          placeholder="Ex. Tissu bazin bleu, 3 pièces"
          required
        />
        {error ? (
          <Typography component="p" variant="caption2" className="text-[#b33434]">
            {error}
          </Typography>
        ) : null}
        <Button fullWidth size="lg" type="submit">
          Ajouter le client
        </Button>
      </form>

      {pendingClient ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <Card
            className="grid w-full max-w-sm gap-3 p-5 text-center shadow-lg"
            warm
          >
            <Typography component="p" variant="h4">
              Ajouter ce client ?
            </Typography>
            <Typography component="p" variant="body-base">
              {pendingClient.name} · {pendingClient.phone}
            </Typography>
            <Typography component="p" variant="caption2">
              Si ce numéro correspond déjà à un client existant, la demande
              sera ajoutée à sa fiche au lieu de créer un doublon.
            </Typography>
            <div className="grid grid-cols-2 gap-3">
              <Button
                disabled={pending}
                onClick={() => setPendingClient(null)}
                type="button"
                variant="secondary"
              >
                Annuler
              </Button>
              <Button disabled={pending} onClick={handleConfirm} type="button">
                {pending ? "Ajout..." : "Confirmer"}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
