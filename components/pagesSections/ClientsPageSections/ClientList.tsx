import {
  Avatar,
  Card,
  SearchField,
  StatusBadge,
  Typography,
} from "@/components";
import Link from "next/link";

const clients = [
  {
    initials: "MB",
    name: "Mamadou Bah",
    phone: "+224 621 45 89 12",
    status: "new" as const,
    color: "blue" as const,
  },
  {
    initials: "FC",
    name: "Fatoumata Camara",
    phone: "+224 624 11 22 33",
    status: "pending" as const,
    color: "orange" as const,
  },
  {
    initials: "AD",
    name: "Aïssatou Diallo",
    phone: "+224 620 99 88 77",
    status: "completed" as const,
    color: "green" as const,
  },
];

export function ClientList() {
  return (
    <div className="grid gap-4">
      <SearchField placeholder="Rechercher nom ou numéro..." />
      <div className="grid gap-2">
        {clients.map((client) => (
          <Card className="p-3" key={client.phone}>
            <Link
              className="flex items-center gap-3"
              href={`/clients/${client.initials.toLowerCase()}`}
            >
              <Avatar color={client.color} initials={client.initials} />
              <div className="min-w-0 flex-1">
                <Typography component="h2" variant="caption1">
                  {client.name}
                </Typography>
                <Typography component="p" variant="caption2">
                  {client.phone}
                </Typography>
              </div>
              <StatusBadge status={client.status} />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
