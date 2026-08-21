"use client";

import { Card, Typography } from "@/components";
import { useAppStore } from "@/lib/appStore";

export function SalesSummary() {
  const { sales } = useAppStore();
  const metrics = [
    {
      label: "En cours",
      value: sales.filter(
        (sale) => sale.status === "new" || sale.status === "pending",
      ).length,
      color: "text-orange",
    },
    {
      label: "Complétées",
      value: sales.filter((sale) => sale.status === "completed").length,
      color: "text-green",
    },
  ];

  return (
    <section className="grid gap-3">
      <Typography component="h2" variant="h4">
        Résumé de vos ventes
      </Typography>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <Card className="grid gap-1 p-4 text-center" key={metric.label}>
            <Typography component="p" variant="caption2">
              {metric.label}
            </Typography>
            <Typography component="p" variant="h3" className={metric.color}>
              {metric.value}
            </Typography>
          </Card>
        ))}
      </div>
    </section>
  );
}
