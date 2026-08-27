import { Typography } from "@/app/components";

export function SalesHeader() {
  return (
    <header className="ml-1 grid gap-1">
      <Typography component="h1" variant="h2">
        Mes ventes
      </Typography>
      <Typography component="p" variant="caption2">
        Suivez l&apos;évolution de votre activité mois après mois.
      </Typography>
    </header>
  );
}
