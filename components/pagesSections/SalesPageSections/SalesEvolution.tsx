"use client";

import { Card, Typography } from "@/components";
import { useAppStore } from "@/lib/appStore";

export function SalesEvolution() {
  const { sales } = useAppStore();

  return (
    <Card className="grid gap-5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <Typography component="h2" variant="h4">
            Évolution des ventes
          </Typography>
          <Typography component="p" variant="caption2">
            Historique des six derniers mois
          </Typography>
        </div>
        <div className="grid gap-1 text-right">
          <Typography component="span" variant="caption3">
            <span className="mr-1.5 inline-block size-2 rounded-full bg-green" />
            Réussies
          </Typography>
          <Typography component="span" variant="caption3">
            <span className="mr-1.5 inline-block size-2 rounded-full bg-[#c53f3f]" />
            Perdues
          </Typography>
        </div>
      </div>

      {sales.length === 0 ? (
        <Typography component="p" variant="caption2">
          L&apos;évolution apparaîtra après vos premières ventes.
        </Typography>
      ) : (
        <Typography component="p" variant="caption2">
          {sales.length} vente{sales.length > 1 ? "s" : ""} enregistrée
          {sales.length > 1 ? "s" : ""}.
        </Typography>
      )}
    </Card>
  );
}
