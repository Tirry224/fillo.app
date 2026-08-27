"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, PhotoGallery, StatusSelect, Typography } from "@/app/components";
import type { Sale } from "@/lib/types";
import { updateSaleStatusAction } from "@/lib/actions/shop";

export function SaleSummary({ sale }: { sale: Sale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleStatusChange(status: string) {
    startTransition(async () => {
      const result = await updateSaleStatusAction(sale.id, status as Sale["status"]);
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <section className="grid gap-4">
      <PhotoGallery
        alt={`Photo du produit : ${sale.message}`}
        photos={sale.photos}
      />
      <div className="grid gap-2">
        <Typography component="p" variant="caption2">
          Client : {sale.clientName}
        </Typography>
        <Typography
          component="h1"
          variant="caption1"
          className="text-[16px] uppercase tracking-[0.02em] text-ink-muted"
        >
          Détail de la vente
        </Typography>
      </div>
      <Card warm className="p-3">
        <Typography component="p" variant="body-sm">
          « {sale.message} »
        </Typography>
      </Card>
      <StatusSelect
        defaultValue={sale.status}
        disabled={pending}
        onChange={handleStatusChange}
      />
    </section>
  );
}
