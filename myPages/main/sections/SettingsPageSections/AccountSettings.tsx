"use client";

import { LockKeyhole } from "lucide-react";
import { updatePasswordAction } from "@/lib/actions/auth";
import { SettingRow, SettingsGroup } from "./SettingsSection";

export function AccountSettings() {
  async function handlePasswordChange() {
    const currentPassword = window.prompt("Saisissez votre mot de passe actuel :");
    if (!currentPassword) return;
    const newPassword = window.prompt(
      "Saisissez votre nouveau mot de passe (min. 6 caractères) :",
    );
    if (!newPassword) return;

    const formData = new FormData();
    formData.set("currentPassword", currentPassword);
    formData.set("newPassword", newPassword);
    const result = await updatePasswordAction({ error: null }, formData);

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
