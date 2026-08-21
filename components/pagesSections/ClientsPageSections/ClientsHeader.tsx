import { Typography } from "@/components";
import { clients } from "@/lib/mockData";

export function ClientsHeader() {
  return (
    <header>
      <Typography component="h1" variant="h3">
        Mes clients ({clients.length})
      </Typography>
    </header>
  );
}
