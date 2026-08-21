import { Card, StatusSelect, Typography } from "@/components";

export function SaleSummary() {
  return (
    <section className="grid gap-4">
      <div className="h-36 rounded-[var(--radius-card)] bg-gradient-to-r from-orange to-coral" />
      <div className="grid gap-2">
        <Typography component="p" variant="caption2">
          Client : Mamadou Bah
        </Typography>
        <Typography component="h1" variant="h3">
          Bazin riche (couleur bleue)
        </Typography>
      </div>
      <Card warm className="p-3">
        <Typography component="p" variant="body-sm">
          « Je cherche ce modèle précis, 2 pièces, pour un mariage vendredi. »
        </Typography>
      </Card>
      <StatusSelect />
    </section>
  );
}
