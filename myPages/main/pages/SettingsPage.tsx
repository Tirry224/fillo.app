"use client";

import { AppNavigation, Container, Typography } from "@/app/components";
import { uiStyles } from "@/app/components/ui/Typography";
import { AccountSettings } from "@/myPages/main/sections/SettingsPageSections/AccountSettings";
import { CommerceSettings } from "@/myPages/main/sections/SettingsPageSections/CommerceSettings";
import { NotificationSettings } from "@/myPages/main/sections/SettingsPageSections/NotificationSettings";
import { SettingsFeedback } from "@/myPages/main/sections/SettingsPageSections/SettingsFeedback";
import { SettingsLogout } from "@/myPages/main/sections/SettingsPageSections/SettingsLogout";
import { useAppStore } from "@/lib/appStore";

export function SettingsPage() {
  const { settings, updateSettings } = useAppStore();

  return (
    <Container className={`${uiStyles.sectionGap} pb-24`}>
      <Typography component="h1" variant="h2" className="mt-1">
        Réglages
      </Typography>

      <div className="space-y-8">
        <CommerceSettings />
        <NotificationSettings
          enabled={settings.emailNotifications}
          onToggle={() =>
            updateSettings({ emailNotifications: !settings.emailNotifications })
          }
        />
        <AccountSettings />
        <SettingsFeedback />
        <SettingsLogout />
      </div>

      <AppNavigation />
    </Container>
  );
}
