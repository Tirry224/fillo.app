import { Typography } from "@/app/components";

export function ClientsHeader({ clientCount }: { clientCount: number }) {
  return (
    <header>
      <Typography component="h1" variant="h3">
        Mes clients ({clientCount})
      </Typography>
    </header>
  );
}
