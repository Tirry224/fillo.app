"use client";

import { LockKeyhole } from "lucide-react";
import { SettingRow, SettingsGroup } from "./SettingsSection";

export function AccountSettings() {
  return (
    <SettingsGroup title="Compte">
      <SettingRow
        detail=""
        icon={<LockKeyhole size={27} strokeWidth={1.8} />}
        label="Changer le mot de passe"
      />
    </SettingsGroup>
  );
}
