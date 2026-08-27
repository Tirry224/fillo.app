import { Card, Typography } from "@/app/components";
import type { Sale } from "@/lib/types";

export function SalesStats({ sales }: { sales: Sale[] }) {
  const stats = [
    {
      label: "Ventes réussies",
      value: sales.filter((sale) => sale.status === "completed").length,
      detail: "",
      valueClass: "text-green",
    },
    {
      label: "Ventes perdues",
      value: sales.filter((sale) => sale.status === "lost").length,
      detail: "",
      valueClass: "text-[#c53f3f]",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3" aria-label="Résumé des ventes">
      {stats.map((stat) => (
        <Card className="grid gap-2 p-4" key={stat.label}>
          <Typography component="p" variant="caption2">
            {stat.label}
          </Typography>
          <Typography component="p" variant="h2" className={stat.valueClass}>
            {stat.value}
          </Typography>
          <Typography component="p" variant="caption3">
            {stat.detail}
          </Typography>
        </Card>
      ))}
    </section>
  );
}
