"use client";

import { LockKeyhole } from "lucide-react";
import { useAppStore } from "@/lib/appStore";
import { SettingRow, SettingsGroup } from "./SettingsSection";

export function AccountSettings() {
  const { updatePassword } = useAppStore();

  async function handlePasswordChange() {
    const newPassword = window.prompt(
      "Saisissez votre nouveau mot de passe (min. 6 caractères) :",
    );
    if (!newPassword) return;
    if (newPassword.length < 6) {
      window.alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    const result = await updatePassword(newPassword);
    if (result.error) {
      window.alert(`Erreur : ${result.error}`);
    } else {
      window.alert("Votre mot de passe a été mis à jour avec succès.");
    }
  }

  return (
    <SettingsGroup title="Compte">
      <SettingRow
        detail=""
        icon={<LockKeyhole size={27} strokeWidth={1.8} />}
        label="Changer le mot de passe"
        onClick={handlePasswordChange}
      />
    </SettingsGroup>
  );
}
