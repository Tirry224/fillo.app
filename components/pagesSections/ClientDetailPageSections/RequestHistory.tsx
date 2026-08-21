import { Card, StatusBadge, Typography } from "@/components";
import Link from "next/link";

const requests = [
  {
    title: "Bazin riche VIP (2 pièces)",
    detail: "Demandé hier à 14h30",
    status: "new" as const,
  },
  {
    title: "Tissu wax hollandais",
    detail: "Livré le 10 avril",
    status: "completed" as const,
  },
];

export function RequestHistory() {
  return (
    <section className="grid gap-3">
      <Typography component="h2" variant="h4">
        Historique des demandes (2)
      </Typography>
      <div className="grid gap-2">
        {requests.map((request) => (
          <Link href="/ventes/FL-892" key={request.title}>
            <Card className="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-surface-warm">
              <div className="grid gap-1">
                <Typography component="h3" variant="caption1">
                  {request.title}
                </Typography>
                <Typography component="p" variant="caption2">
                  {request.detail}
                </Typography>
              </div>
              <StatusBadge status={request.status} />
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
