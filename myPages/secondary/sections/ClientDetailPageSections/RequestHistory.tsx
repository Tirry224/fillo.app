import { Card, StatusBadge, Typography } from "@/app/components";
import Link from "next/link";
import { useAppStore } from "@/lib/appStore";

export function RequestHistory({ clientId }: { clientId: string }) {
  const { requests, sales } = useAppStore();
  const clientRequests = requests.filter(
    (request) => request.clientId === clientId,
  );
  const clientSales = sales.filter((sale) => sale.clientId === clientId);

  return (
    <section className="grid gap-3">
      <Typography component="h2" variant="h4">
        Historique des demandes ({clientRequests.length})
      </Typography>
      <div className="grid gap-2">
        {clientRequests.length === 0 ? (
          <Typography component="p" variant="caption2">
            Aucune demande pour le moment.
          </Typography>
        ) : null}
        {clientRequests.map((request) => {
          const sale = clientSales.find(
            (item) => item.requestId === request.id,
          );

          return (
            <Link href={sale ? `/ventes/${sale.id}` : "#"} key={request.id}>
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
          );
        })}
      </div>
    </section>
  );
}
