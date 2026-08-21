import { Card, Typography } from "@/components";

const monthlySales = [
  { month: "Jan", successful: 26, lost: 8 },
  { month: "Fév", successful: 31, lost: 6 },
  { month: "Mar", successful: 28, lost: 9 },
  { month: "Avr", successful: 36, lost: 5 },
  { month: "Mai", successful: 41, lost: 7 },
  { month: "Juin", successful: 48, lost: 7 },
];

const maxSales = 50;

export function SalesEvolution() {
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

      <div
        aria-label="Graphique de l'évolution mensuelle des ventes"
        className="grid grid-cols-6 items-end gap-2 border-b border-border px-1 pt-4"
        role="img"
      >
        {monthlySales.map((month) => (
          <div
            className="grid min-w-0 justify-items-center gap-2"
            key={month.month}
          >
            <div className="flex h-40 items-end gap-1">
              <span
                aria-label={`${month.successful} ventes réussies en ${month.month}`}
                className="w-3 rounded-t bg-green"
                style={{ height: `${(month.successful / maxSales) * 100}%` }}
              />
              <span
                aria-label={`${month.lost} ventes perdues en ${month.month}`}
                className="w-3 rounded-t bg-[#c53f3f]"
                style={{ height: `${(month.lost / maxSales) * 100}%` }}
              />
            </div>
            <Typography component="span" variant="caption3">
              {month.month}
            </Typography>
          </div>
        ))}
      </div>
    </Card>
  );
}
