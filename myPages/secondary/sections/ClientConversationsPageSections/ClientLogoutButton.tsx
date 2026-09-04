"use client";

import { LogOut } from "lucide-react";
import { logoutClientAction } from "@/lib/actions/clientAuth";

export function ClientLogoutButton() {
  return (
    <button
      className="flex min-h-12 w-full items-center justify-center gap-2 text-[20px] font-bold text-coral transition-colors hover:text-[#c6523b]"
      onClick={() => {
        void logoutClientAction();
      }}
      type="button"
    >
      <LogOut size={21} strokeWidth={2} />
      Se déconnecter
    </button>
  );
}
