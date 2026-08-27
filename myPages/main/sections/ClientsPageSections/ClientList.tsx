"use client";

import { useState } from "react";
import {
  Avatar,
  Card,
  SearchField,
  StatusBadge,
  Typography,
} from "@/app/components";
import Link from "next/link";
import type { Client, Sale } from "@/lib/types";

export function ClientList({ clients, sales }: { clients: Client[]; sales: Sale[] }) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(normalizedSearch) ||
      client.phone.toLowerCase().includes(normalizedSearch),
  );

  return (
    <div className="grid gap-4">
      <SearchField
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher nom ou numéro..."
        value={search}
      />
      <div className="grid gap-2">
        {filteredClients.map((client) => (
          <Card className="p-3" key={client.phone}>
            <Link
              className="flex items-center gap-3"
              href={`/clients/${client.id}`}
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
              <StatusBadge
                status={
                  sales.find((sale) => sale.clientId === client.id)?.status ??
                  "new"
                }
              />
            </Link>
          </Card>
        ))}
        {filteredClients.length === 0 ? (
          <Typography component="p" variant="caption2">
            Aucun client trouvé.
          </Typography>
        ) : null}
      </div>
    </div>
  );
}
