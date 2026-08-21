"use client";

import { Mail } from "lucide-react";
import { SettingRow, SettingsGroup } from "./SettingsSection";

type NotificationSettingsProps = {
  enabled: boolean;
  onToggle: () => void;
};

export function NotificationSettings({
  enabled,
  onToggle,
}: NotificationSettingsProps) {
  return (
    <SettingsGroup title="Notifications">
      <SettingRow
        detail="diallo.tissus@gmail.com"
        icon={<Mail size={27} strokeWidth={1.8} />}
        label="Email à chaque nouvelle demande"
        trailing={
          <span
            aria-hidden="true"
            className={`relative block h-9 w-[70px] rounded-full p-1 transition-colors ${
              enabled ? "bg-navy" : "bg-[#d8d1c5]"
            }`}
          >
            <span
              className={`block size-7 rounded-full bg-surface shadow-sm transition-transform ${
                enabled ? "translate-x-8" : "translate-x-0"
              }`}
            />
          </span>
        }
        onClick={onToggle}
      />
    </SettingsGroup>
  );
}
