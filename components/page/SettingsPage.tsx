"use client";

import { AppNavigation, Container, Typography } from "@/components";
import { uiStyles } from "@/components/ui/Typography";
import { AccountSettings } from "@/components/pagesSections/SettingsPageSections/AccountSettings";
import { CommerceSettings } from "@/components/pagesSections/SettingsPageSections/CommerceSettings";
import { NotificationSettings } from "@/components/pagesSections/SettingsPageSections/NotificationSettings";
import { SettingsFeedback } from "@/components/pagesSections/SettingsPageSections/SettingsFeedback";
import { SettingsLogout } from "@/components/pagesSections/SettingsPageSections/SettingsLogout";
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
