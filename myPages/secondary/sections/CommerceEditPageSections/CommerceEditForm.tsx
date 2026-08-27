"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, PhoneField, TextField, Typography } from "@/app/components";
import { updateShopSettingsAction } from "@/lib/actions/shop";
import type { ShopSettings } from "@/lib/types";

export function CommerceEditForm({ settings }: { settings: ShopSettings }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const shopName = String(formData.get("shopName") ?? "").trim();

    if (!shopName) {
      setError("Le nom du commerce est obligatoire.");
      return;
    }

    setError(null);
    setPending(true);

    const result = await updateShopSettingsAction({
      shopName,
      location: String(formData.get("location") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
    });

    if (result.error) {
      setPending(false);
      setError(result.error);
      return;
    }

    router.push("/reglages");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <TextField
        defaultValue={settings.shopName}
        label="Nom du commerce"
        name="shopName"
        required
      />
      <TextField
        defaultValue={settings.location}
        label="Localisation"
        name="location"
      />
      <PhoneField
        defaultValue={settings.phone}
        label="Numéro WhatsApp"
        name="phone"
      />
      <TextField
        defaultValue={settings.email}
        label="Email du commerçant"
        name="email"
        type="email"
      />
      {error ? (
        <Typography component="p" variant="caption2" className="text-[#b33434]">
          {error}
        </Typography>
      ) : null}
      <Button disabled={pending} fullWidth size="lg" type="submit">
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
