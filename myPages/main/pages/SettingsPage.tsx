import { AppNavigation, Container, Typography } from "@/app/components";
import { uiStyles } from "@/app/components/ui/Typography";
import { AccountSettings } from "@/myPages/main/sections/SettingsPageSections/AccountSettings";
import { CommerceSettings } from "@/myPages/main/sections/SettingsPageSections/CommerceSettings";
import { NotificationSettings } from "@/myPages/main/sections/SettingsPageSections/NotificationSettings";
import { SettingsFeedback } from "@/myPages/main/sections/SettingsPageSections/SettingsFeedback";
import { SettingsLogout } from "@/myPages/main/sections/SettingsPageSections/SettingsLogout";
import { requireShopWorkspace } from "@/lib/data";

export async function SettingsPage() {
  const { settings } = await requireShopWorkspace();
  const settingsIncomplete =
    !settings.shopName || !settings.phone || !settings.location || !settings.email;

  return (
    <Container className={`${uiStyles.sectionGap} pb-24`}>
      <Typography component="h1" variant="h2" className="ml-1 mt-1">
        Réglages
      </Typography>

      <div className="space-y-8">
        <CommerceSettings settings={settings} />
        <NotificationSettings enabled={settings.emailNotifications} />
        <AccountSettings />
        <SettingsFeedback />
        <SettingsLogout />
      </div>

      <AppNavigation settingsIncomplete={settingsIncomplete} />
    </Container>
  );
}
