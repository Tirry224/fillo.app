import { Card, Typography } from "@/components";

const stats = [
  {
    label: "Ventes réussies",
    value: "48",
    detail: "+12% ce mois",
    valueClass: "text-green",
  },
  {
    label: "Ventes perdues",
    value: "7",
    detail: "-3% ce mois",
    valueClass: "text-[#c53f3f]",
  },
];

export function SalesStats() {
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
