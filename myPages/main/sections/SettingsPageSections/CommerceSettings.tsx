"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, MessageCircle, Store } from "lucide-react";
import { updateShopSettingsAction } from "@/lib/actions/shop";
import { SettingRow, SettingsGroup } from "./SettingsSection";
import type { ShopSettings } from "@/lib/types";

export function CommerceSettings({ settings }: { settings: ShopSettings }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function requestSetting(
    key: "shopName" | "location" | "email",
    label: string,
    currentValue: string,
  ) {
    const value = window.prompt(label, currentValue);
    if (!value?.trim()) return;
    startTransition(async () => {
      const result = await updateShopSettingsAction({ [key]: value.trim() });
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <SettingsGroup title="Mon commerce">
      <SettingRow
        detail={settings.shopName}
        icon={<Store size={27} strokeWidth={1.8} />}
        label="Nom du commerce"
        onClick={() =>
          requestSetting("shopName", "Nom du commerce", settings.shopName)
        }
      />
      <div className="mx-5 border-t border-border" />
      <SettingRow
        detail={settings.location || "Aucune localisation configurée"}
        icon={<MapPin size={27} strokeWidth={1.8} />}
        label="Localisation"
        onClick={() =>
          requestSetting("location", "Localisation", settings.location)
        }
      />
      <div className="mx-5 border-t border-border" />
      <SettingRow
        detail={settings.phone || "Aucun numéro configuré"}
        icon={<MessageCircle size={27} strokeWidth={1.8} />}
        label="Numéro WhatsApp"
      />
      <div className="mx-5 border-t border-border" />
      <SettingRow
        detail={settings.email || "Aucune adresse configurée"}
        icon={<MessageCircle size={27} strokeWidth={1.8} />}
        label="Email du commerçant"
        onClick={() =>
          requestSetting("email", "Email du commerçant", settings.email)
        }
      />
    </SettingsGroup>
  );
}
