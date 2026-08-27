import { Card, Typography } from "@/app/components";
import type { Sale } from "@/lib/types";

function getLastSixMonths() {
  const now = new Date();
  return Array.from(
    { length: 6 },
    (_, index) => new Date(now.getFullYear(), now.getMonth() - (5 - index), 1),
  );
}

export function SalesEvolution({ sales }: { sales: Sale[] }) {
  const monthlyData = getLastSixMonths().map((month) => {
    const monthSales = sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      return (
        saleDate.getFullYear() === month.getFullYear() &&
        saleDate.getMonth() === month.getMonth() &&
        (sale.status === "completed" || sale.status === "lost")
      );
    });
    const completed = monthSales.filter(
      (sale) => sale.status === "completed",
    ).length;
    const lost = monthSales.filter((sale) => sale.status === "lost").length;
    const total = completed + lost;

    return {
      label: month.toLocaleDateString("fr-FR", { month: "short" }),
      completedPct: total > 0 ? (completed / total) * 100 : 0,
      lostPct: total > 0 ? (lost / total) * 100 : 0,
    };
  });

  return (
    <Card className="grid gap-5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <Typography component="h2" variant="h4">
            Évolution des ventes
          </Typography>
          <Typography component="p" variant="caption2">
            Historique des six derniers mois
          </Typography>
        </div>
        <div className="grid gap-1 text-right">
          <Typography component="span" variant="caption3">
            <span className="mr-1.5 inline-block size-2 rounded-full bg-green" />
            Réussies
          </Typography>
          <Typography component="span" variant="caption3">
            <span className="mr-1.5 inline-block size-2 rounded-full bg-[#c53f3f]" />
            Perdues
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-6 items-end gap-2 px-1 pt-2">
        {monthlyData.map((month) => (
          <div className="grid justify-items-center gap-2" key={month.label}>
            <div className="flex h-32 w-full items-end justify-center gap-1 rounded-[var(--radius-control)] bg-surface-warm px-1">
              <div
                className="w-3 rounded-t-[var(--radius-control)] bg-green"
                style={{ height: `${month.completedPct}%` }}
              />
              <div
                className="w-3 rounded-t-[var(--radius-control)] bg-[#c53f3f]"
                style={{ height: `${month.lostPct}%` }}
              />
            </div>
            <Typography component="p" variant="caption4" className="capitalize">
              {month.label}
            </Typography>
          </div>
        ))}
      </div>
    </Card>
  );
}
