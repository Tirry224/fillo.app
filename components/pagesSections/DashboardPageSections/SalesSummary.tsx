import { Card, Typography } from "@/components";

const metrics = [
  { label: "En cours", value: "5", color: "text-orange" },
  { label: "Complétées", value: "18", color: "text-green" },
];

export function SalesSummary() {
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
