"use client";

import Link from "next/link";
import { Container, Typography } from "@/app/components";
import { ClientProfile } from "@/myPages/secondary/sections/ClientDetailPageSections/ClientProfile";
import { RequestHistory } from "@/myPages/secondary/sections/ClientDetailPageSections/RequestHistory";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "@/lib/appStore";

export function ClientDetailPage({ clientId }: { clientId: string }) {
  const { clients } = useAppStore();
  const client = clients.find((item) => item.id === clientId);

  if (!client) {
    return (
      <Container className="gap-8">
        <Link
          aria-label="Retour aux clients"
          className="inline-flex items-center gap-2 text-xl leading-none text-navy"
          href="/clients"
        >
          <ArrowLeft aria-hidden="true" size={18} />
          <span className="text-sm font-bold">Retour aux clients</span>
        </Link>
        <Typography component="p" variant="body-base">
          Ce client n&apos;existe plus ou n&apos;est pas disponible.
        </Typography>
      </Container>
    );
  }

  return (
    <Container className="gap-8">
      <Link
        aria-label="Retour aux clients"
        className="inline-flex items-center gap-2 text-xl leading-none text-navy"
        href="/clients"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        <span className="text-sm font-bold">Fiche client</span>
      </Link>
      <ClientProfile client={client} />
      <RequestHistory clientId={client.id} />
    </Container>
  );
}
