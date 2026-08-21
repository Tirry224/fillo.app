import Link from "next/link";
import { Typography } from "@/components";
import { Bell, Share2 } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="-mx-4 -mt-6 grid gap-5 rounded-b-[var(--radius-card)] bg-navy px-4 pb-5 pt-6 text-white sm:-mx-6 sm:-mt-8 sm:px-6">
      <div className="flex items-start justify-between">
        <div className="grid gap-1">
          <Typography component="h1" variant="h4" className="text-white">
            Boutique Diallo
          </Typography>
          <Typography
            component="p"
            variant="caption3"
            className="text-white/70"
          >
            Tableau de bord
          </Typography>
        </div>
        <div className="flex gap-2" aria-label="Actions du tableau de bord">
          <button
            aria-label="Notifications"
            className="flex size-9 items-center justify-center rounded-[var(--radius-control)] bg-white/10 text-sm"
            type="button"
          >
            <Bell aria-hidden="true" size={17} />
          </button>
          <button
            aria-label="Partager le lien client"
            className="flex size-9 items-center justify-center rounded-[var(--radius-control)] bg-white/10 text-sm"
            type="button"
          >
            <Share2 aria-hidden="true" size={17} />
          </button>
        </div>
      </div>

      <div className="grid gap-2 rounded-[var(--radius-control)] bg-white/10 p-3">
        <Typography component="p" variant="caption3" className="text-orange">
          Votre lien client
        </Typography>
        <div className="flex items-center justify-between gap-3">
          <Link
            aria-label="Ouvrir le formulaire public de la boutique"
            className="min-w-0 truncate"
            href="/diallo-tissus"
          >
            <Typography
              component="span"
              variant="caption1"
              className="text-white underline"
            >
              fillo.app/diallo-tissus
            </Typography>
          </Link>
          <button
            className="shrink-0 rounded-[var(--radius-control)] bg-orange px-3 py-2 text-xs font-bold text-navy"
            type="button"
          >
            Copier
          </button>
        </div>
      </div>
    </header>
  );
}
