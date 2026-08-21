import { BottomNavigation } from "./BottomNavigation";
import {
  LayoutDashboard,
  Settings,
  ShoppingBag,
  UsersRound,
} from "lucide-react";

type NavigationKey = "dashboard" | "clients" | "sales" | "settings";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} strokeWidth={1.8} />,
    key: "dashboard",
  },
  {
    label: "Clients",
    href: "/clients",
    icon: <UsersRound size={18} strokeWidth={1.8} />,
    key: "clients",
  },
  {
    label: "Ventes",
    href: "/ventes",
    icon: <ShoppingBag size={18} strokeWidth={1.8} />,
    key: "sales",
  },
  {
    label: "Réglages",
    href: "/reglages",
    icon: <Settings size={18} strokeWidth={1.8} />,
    key: "settings",
  },
];

export type AppNavigationProps = {
  active: NavigationKey;
};

export function AppNavigation({ active }: AppNavigationProps) {
  return (
    <BottomNavigation
      items={navigationItems.map(({ key, ...item }) => ({
        ...item,
        active: key === active,
      }))}
    />
  );
}
