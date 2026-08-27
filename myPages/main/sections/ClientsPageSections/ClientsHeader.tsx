import { Typography } from "@/app/components";

export function ClientsHeader({ clientCount }: { clientCount: number }) {
  return (
    <header>
      <Typography component="h1" variant="h3" className="ml-1">
        Mes clients ({clientCount})
      </Typography>
    </header>
  );
}
