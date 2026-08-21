"use client";

import { MapPin, MessageCircle, Store } from "lucide-react";
import { SettingRow, SettingsGroup } from "./SettingsSection";

export function CommerceSettings() {
  return (
    <SettingsGroup title="Mon commerce">
      <SettingRow
        detail="Boutique Diallo Tissus"
        icon={<Store size={27} strokeWidth={1.8} />}
        label="Nom du commerce"
      />
      <div className="mx-5 border-t border-border" />
      <SettingRow
        detail="Conakry, Madina"
        icon={<MapPin size={27} strokeWidth={1.8} />}
        label="Localisation"
      />
      <div className="mx-5 border-t border-border" />
      <SettingRow
        detail="+224 621 45 89 12"
        icon={<MessageCircle size={27} strokeWidth={1.8} />}
        label="Numéro WhatsApp"
      />
    </SettingsGroup>
  );
}
