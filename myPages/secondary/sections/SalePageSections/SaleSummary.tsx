"use client";

import { Card, StatusSelect, Typography } from "@/app/components";
import type { Sale } from "@/lib/mockData";
import { useAppStore } from "@/lib/appStore";

export function SaleSummary({ sale }: { sale: Sale }) {
  const { updateSaleStatus } = useAppStore();

  return (
    <section className="grid gap-4">
      {sale.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`Photo du produit : ${sale.product}`}
          className="h-36 w-full rounded-[var(--radius-card)] object-cover"
          src={sale.photo}
        />
      ) : (
        <div className="flex h-36 items-center justify-center rounded-[var(--radius-card)] bg-gradient-to-r from-orange to-coral">
          <Typography component="p" variant="caption2" className="text-white">
            Aucune photo disponible
          </Typography>
        </div>
      )}
      <div className="grid gap-2">
        <Typography component="p" variant="caption2">
          Client : {sale.clientName}
        </Typography>
        <Typography component="h1" variant="h3">
          {sale.product}
        </Typography>
      </div>
      <Card warm className="p-3">
        <Typography component="p" variant="body-sm">
          « {sale.message} »
        </Typography>
      </Card>
      <StatusSelect
        defaultValue={sale.status}
        onChange={(status) =>
          updateSaleStatus(sale.id, status as Sale["status"])
        }
      />
    </section>
  );
}
