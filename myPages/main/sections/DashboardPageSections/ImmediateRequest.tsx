"use client";

import { Card, StatusBadge, Typography } from "@/app/components";
import Link from "next/link";
import { useAppStore } from "@/lib/appStore";

export function ImmediateRequest() {
  const { requests } = useAppStore();
  const pendingRequests = requests.filter(
    (request) => request.status !== "completed",
  );

  return (
    <section className="grid gap-3">
      <div className="flex items-center gap-2">
        <Typography component="h2" variant="h4">
          À traiter immédiatement
        </Typography>
        <span className="flex size-5 items-center justify-center rounded bg-[#c53f3f] text-[11px] font-bold text-white">
          {pendingRequests.length}
        </span>
      </div>
      {pendingRequests.map((request) => (
        <Link href={`/clients/${request.clientId}`} key={request.clientId}>
          <Card className="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-surface-warm">
            <div className="grid gap-1">
              <Typography component="h3" variant="caption1">
                {request.title}
              </Typography>
              <Typography component="p" variant="caption2">
                {request.detail}
              </Typography>
            </div>
            <StatusBadge className="shrink-0" status={request.status} />
          </Card>
        </Link>
      ))}
    </section>
  );
}
