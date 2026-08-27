"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { updateShopSettingsAction } from "@/lib/actions/shop";
import { SettingRow, SettingsGroup } from "./SettingsSection";

export function NotificationSettings({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await updateShopSettingsAction({
        emailNotifications: !enabled,
      });
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <SettingsGroup title="Notifications">
      <SettingRow
        detail="Aucune adresse configurée"
        icon={<Mail size={27} strokeWidth={1.8} />}
        label="Email à chaque nouvelle demande"
        trailing={
          <span
            aria-hidden="true"
            className={`relative block h-9 w-[70px] rounded-full p-1 transition-colors ${
              enabled ? "bg-navy" : "bg-[#d8d1c5]"
            } ${pending ? "opacity-60" : ""}`}
          >
            <span
              className={`block size-7 rounded-full bg-surface shadow-sm transition-transform ${
                enabled ? "translate-x-8" : "translate-x-0"
              }`}
            />
          </span>
        }
        onClick={handleToggle}
      />
    </SettingsGroup>
  );
}
