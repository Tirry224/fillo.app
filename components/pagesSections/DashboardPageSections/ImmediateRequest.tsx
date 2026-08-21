import { Card, StatusBadge, Typography } from "@/components";
import Link from "next/link";

export function ImmediateRequest() {
  return (
    <section className="grid gap-3">
      <div className="flex items-center gap-2">
        <Typography component="h2" variant="h4">
          À traiter immédiatement
        </Typography>
        <span className="flex size-5 items-center justify-center rounded bg-[#c53f3f] text-[11px] font-bold text-white">
          2
        </span>
      </div>
      <Link href="/clients/mb">
        <Card className="grid gap-3 p-3 transition-colors hover:bg-surface-warm">
          <div className="flex items-start justify-between gap-3">
            <div className="grid gap-1">
              <Typography component="h3" variant="caption1">
                Mamadou Bah
              </Typography>
              <Typography component="p" variant="caption2">
                Bazin riche VIP - 2 pièces
              </Typography>
            </div>
            <StatusBadge status="new" />
          </div>
          <Typography component="p" variant="caption2">
            Reçu il y a 10 min par WhatsApp
          </Typography>
        </Card>
      </Link>
    </section>
  );
}
