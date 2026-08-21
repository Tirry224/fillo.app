import Link from "next/link";
import { Container } from "@/components";
import { ClientProfile } from "@/components/pagesSections/ClientDetailPageSections/ClientProfile";
import { RequestHistory } from "@/components/pagesSections/ClientDetailPageSections/RequestHistory";
import { ArrowLeft } from "lucide-react";

export function ClientDetailPage() {
  return (
    <Container className="gap-8">
      <Link
        aria-label="Retour aux clients"
        className="text-xl text-navy"
        href="/clients"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        <span className="text-sm font-bold">Fiche client</span>
      </Link>
      <ClientProfile />
      <RequestHistory />
    </Container>
  );
}
