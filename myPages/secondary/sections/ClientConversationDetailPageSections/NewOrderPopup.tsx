"use client";

import { useState, type FormEvent } from "react";
import { Button, Card, PhotoUpload, TextAreaField, Typography } from "@/app/components";
import { createClientOrderAction } from "@/lib/actions/clientOrders";

function readAsDataUrl(file: File): Promise<string | undefined> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => resolve(undefined);
    reader.readAsDataURL(file);
  });
}

export function NewOrderPopup({
  conversationId,
  onClose,
}: {
  conversationId: string;
  onClose: () => void;
}) {
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const requestText = String(formData.get("requestText") ?? "");
    const photos = (await Promise.all(photoFiles.map(readAsDataUrl))).filter(
      (photo): photo is string => Boolean(photo),
    );

    const result = await createClientOrderAction(conversationId, requestText, photos);
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
      <Card className="grid w-full max-w-sm gap-4 p-5 shadow-lg" warm>
        <Typography component="p" variant="h4" className="text-center">
          Nouvelle commande
        </Typography>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <TextAreaField
            label="Que recherchez-vous ?"
            name="requestText"
            placeholder="Ex. Tissu bazin bleu, 3 pièces"
            required
            rows={3}
          />
          <PhotoUpload
            label="Photos du produit (optionnel, 3 max)"
            onFilesChange={setPhotoFiles}
          />

          {error ? (
            <Typography component="p" variant="caption2" className="text-[#b33434]">
              {error}
            </Typography>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <Button disabled={pending} onClick={onClose} type="button" variant="secondary">
              Annuler
            </Button>
            <Button disabled={pending} type="submit">
              {pending ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
