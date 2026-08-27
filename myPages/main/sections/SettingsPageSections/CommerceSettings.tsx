import { MapPin, MessageCircle, Store } from "lucide-react";
import { SettingRow, SettingsGroup } from "./SettingsSection";
import type { ShopSettings } from "@/lib/types";

export function CommerceSettings({ settings }: { settings: ShopSettings }) {
  return (
    <SettingsGroup editHref="/reglages/commerce" title="Mon commerce">
      <SettingRow
        detail={settings.shopName}
        icon={<Store size={27} strokeWidth={1.8} />}
        label="Nom du commerce"
      />
      <div className="mx-5 border-t border-border" />
      <SettingRow
        detail={settings.location || "Aucune localisation configurée"}
        icon={<MapPin size={27} strokeWidth={1.8} />}
        label="Localisation"
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
      />
    </SettingsGroup>
  );
}
