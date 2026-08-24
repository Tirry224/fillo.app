"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, Container, StatusBadge, Typography } from "@/app/components";
import type { ClientStatus } from "@/lib/mockData";
import { useAppStore } from "@/lib/appStore";

const statusLabels: Record<ClientStatus, string> = {
  new: "Nouvelles demandes",
  pending: "Ventes en cours",
  completed: "Ventes complétées",
  lost: "Ventes perdues",
};

function isClientStatus(value: string): value is ClientStatus {
  return value in statusLabels;
}

export function SalesByStatusPage({ status }: { status: string }) {
  const { sales } = useAppStore();

  if (!isClientStatus(status)) {
    return (
      <Container className="gap-8">
        <p className="text-sm text-ink-muted">Statut inconnu.</p>
      </Container>
    );
  }

  const filteredSales = sales.filter((sale) => sale.status === status);

  return (
    <Container className="gap-8">
      <header className="flex items-center gap-2">
        <Link
          aria-label="Retour au tableau de bord"
          className="inline-flex items-center gap-2 text-navy"
          href="/dashboard"
        >
          <ArrowLeft aria-hidden="true" size={18} />
        </Link>
        <Typography component="h1" variant="h3">
          {statusLabels[status]}
        </Typography>
      </header>
      <div className="grid gap-2">
        {filteredSales.length === 0 ? (
          <Typography component="p" variant="caption2">
            Aucune vente dans cette catégorie pour le moment.
          </Typography>
        ) : (
          filteredSales.map((sale) => (
            <Link href={`/ventes/${sale.id}`} key={sale.id}>
              <Card className="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-surface-warm">
                <div className="grid gap-1">
                  <Typography component="h3" variant="caption1">
                    {sale.product}
                  </Typography>
                  <Typography component="p" variant="caption2">
                    {sale.clientName}
                  </Typography>
                </div>
                <StatusBadge status={sale.status} />
              </Card>
            </Link>
          ))
        )}
      </div>
    </Container>
  );
}
