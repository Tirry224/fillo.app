"use client";

import { Typography } from "@/components";
import { useAppStore } from "@/lib/appStore";

export function ClientsHeader() {
  const { clients } = useAppStore();

  return (
    <header>
      <Typography component="h1" variant="h3">
        Mes clients ({clients.length})
      </Typography>
    </header>
  );
}
