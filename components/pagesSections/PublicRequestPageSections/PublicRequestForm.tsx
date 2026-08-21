"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  PhotoUpload,
  PhoneField,
  TextField,
  Typography,
} from "@/components";

export function PublicRequestForm({ shopSlug }: { shopSlug: string }) {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sent) {
      return;
    }

    const resetTimer = window.setTimeout(() => {
      setSent(false);
    }, 5000);

    return () => window.clearTimeout(resetTimer);
  }, [sent]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="relative">
      <form
        className={`grid gap-4 transition-opacity duration-300 ${
          sent ? "pointer-events-none opacity-40" : "opacity-100"
        }`}
        action={`/${shopSlug}`}
        method="post"
        onSubmit={handleSubmit}
      >
        <TextField
          label="Votre nom complet"
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
          label="Que recherchez-vous ?"
          name="request"
          placeholder="Ex. Tissu bazin bleu, 3 pièces"
          required
        />
        <PhotoUpload label="Photo du produit (optionnel)" name="photo" />
        <Button fullWidth size="lg" type="submit">
          Envoyer ma demande
        </Button>
        <Typography component="p" variant="caption2" className="text-center">
          Votre demande sera envoyée directement à la boutique.
        </Typography>
      </form>

      {sent ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <Card
            aria-live="polite"
            className="grid w-full max-w-sm gap-2 p-5 text-center shadow-lg"
            role="status"
            warm
          >
            <Typography component="p" variant="h4" className="text-green">
              Demande envoyée
            </Typography>
            <Typography component="p" variant="body-base">
              Merci. La boutique a bien reçu votre demande et vous répondra
              bientôt.
            </Typography>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
