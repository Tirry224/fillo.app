"use client";

import { Button } from "@/app/components";
import { logoutClientAction } from "@/lib/actions/clientAuth";

export function ClientLogoutButton() {
  return (
    <Button
      fullWidth
      onClick={() => {
        void logoutClientAction();
      }}
      type="button"
      variant="secondary"
    >
      Se déconnecter
    </Button>
  );
}
