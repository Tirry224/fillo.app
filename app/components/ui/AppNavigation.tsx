"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import {
  LayoutDashboard,
  Settings,
  ShoppingBag,
  UsersRound,
} from "lucide-react";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} strokeWidth={1.8} />,
  },
  {
    label: "Clients",
    href: "/clients",
    icon: <UsersRound size={18} strokeWidth={1.8} />,
  },
  {
    label: "Ventes",
    href: "/ventes",
    icon: <ShoppingBag size={18} strokeWidth={1.8} />,
  },
  {
    label: "Réglages",
    href: "/reglages",
    icon: <Settings size={18} strokeWidth={1.8} />,
  },
];

export type AppNavigationProps = {
  settingsIncomplete?: boolean;
  newRequestBadge?: boolean;
};

function withDot(icon: ReactNode) {
  return (
    <span className="relative">
      {icon}
      <span className="absolute -right-1 -top-1 size-2 rounded-full bg-[#c53f3f]" />
    </span>
  );
}

export function AppNavigation({
  settingsIncomplete = false,
  newRequestBadge = false,
}: AppNavigationProps) {
  const pathname = usePathname();

  return (
    <BottomNavigation
      items={navigationItems.map((item) => {
        const showDot =
          (item.href === "/reglages" && settingsIncomplete) ||
          (item.href === "/dashboard" && newRequestBadge);

        return {
          ...item,
          icon: showDot ? withDot(item.icon) : item.icon,
          active: pathname === item.href || pathname.startsWith(`${item.href}/`),
        };
      })}
    />
  );
}
