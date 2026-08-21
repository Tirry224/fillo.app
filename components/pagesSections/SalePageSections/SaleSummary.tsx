import { Card, StatusSelect, Typography } from "@/components";
import type { Sale } from "@/lib/mockData";

export function SaleSummary({ sale }: { sale: Sale }) {
  return (
    <section className="grid gap-4">
      <div className="h-36 rounded-[var(--radius-card)] bg-gradient-to-r from-orange to-coral" />
      <div className="grid gap-2">
        <Typography component="p" variant="caption2">
          Client : {sale.clientName}
        </Typography>
        <Typography component="h1" variant="h3">
          {sale.product}
        </Typography>
      </div>
      <Card warm className="p-3">
        <Typography component="p" variant="body-sm">
          « {sale.message} »
        </Typography>
      </Card>
      <StatusSelect defaultValue={sale.status} />
    </section>
  );
}
