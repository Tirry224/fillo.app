import Link from "next/link";
import { Container } from "@/components";
import { ClientProfile } from "@/components/pagesSections/ClientDetailPageSections/ClientProfile";
import { RequestHistory } from "@/components/pagesSections/ClientDetailPageSections/RequestHistory";
import { ArrowLeft } from "lucide-react";
import type { Client } from "@/lib/mockData";

export function ClientDetailPage({ client }: { client: Client }) {
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
      <RequestHistory />
    </Container>
  );
}
