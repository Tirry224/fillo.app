import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/appStore";

export function SettingsLogout() {
  const router = useRouter();
  const { logout } = useAppStore();

  return (
    <button
      className="flex min-h-12 w-full items-center justify-center gap-2 text-[20px] font-bold text-coral transition-colors hover:text-[#c6523b]"
      onClick={async () => {
        await logout();
        router.push("/login");
      }}
      type="button"
    >
      <LogOut size={21} strokeWidth={2} />
      Se déconnecter
    </button>
  );
}
