import Link from "next/link";
import { Plus } from "lucide-react";
import { Typography } from "@/app/components";

export function ClientsHeader({ clientCount }: { clientCount: number }) {
  return (
    <header className="flex items-center justify-between">
      <Typography component="h1" variant="h3" className="ml-1">
        Mes clients ({clientCount})
      </Typography>
      <Link
        aria-label="Ajouter un client"
        className="flex size-9 items-center justify-center rounded-[var(--radius-control)] bg-navy text-white"
        href="/clients/nouveau"
      >
        <Plus aria-hidden="true" size={18} />
      </Link>
    </header>
  );
}
