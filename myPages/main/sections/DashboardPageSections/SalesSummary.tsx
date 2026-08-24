"use client";

import Link from "next/link";
import { Card, Typography } from "@/app/components";
import { useAppStore } from "@/lib/appStore";

export function SalesSummary() {
  const { sales } = useAppStore();
  const metrics = [
    {
      status: "new",
      label: "Nouvelles",
      value: sales.filter((sale) => sale.status === "new").length,
      color: "text-blue",
    },
    {
      status: "pending",
      label: "En cours",
      value: sales.filter((sale) => sale.status === "pending").length,
      color: "text-orange",
    },
    {
      status: "completed",
      label: "Complétées",
      value: sales.filter((sale) => sale.status === "completed").length,
      color: "text-green",
    },
    {
      status: "lost",
      label: "Perdues",
      value: sales.filter((sale) => sale.status === "lost").length,
      color: "text-[#c53f3f]",
    },
  ];

  return (
    <section className="grid gap-3">
      <Typography component="h2" variant="h4">
        Résumé de vos ventes
      </Typography>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <Link href={`/ventes/statut/${metric.status}`} key={metric.status}>
            <Card className="grid justify-items-center gap-1 p-4 text-center transition-colors hover:bg-surface-warm">
              <Typography component="p" variant="caption2">
                {metric.label}
              </Typography>
              <Typography component="p" variant="h3" className={metric.color}>
                {metric.value}
              </Typography>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
