import { LogOut } from "lucide-react";

export function SettingsLogout() {
  return (
    <button
      className="flex min-h-12 w-full items-center justify-center gap-2 text-[20px] font-bold text-coral transition-colors hover:text-[#c6523b]"
      type="button"
    >
      <LogOut size={21} strokeWidth={2} />
      Se déconnecter
    </button>
  );
}
