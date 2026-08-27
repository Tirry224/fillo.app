"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

export function SettingsLogout() {
  return (
    <button
      className="flex min-h-12 w-full items-center justify-center gap-2 text-[20px] font-bold text-coral transition-colors hover:text-[#c6523b]"
      onClick={() => {
        void logoutAction();
      }}
      type="button"
    >
      <LogOut size={21} strokeWidth={2} />
      Se déconnecter
    </button>
  );
}
