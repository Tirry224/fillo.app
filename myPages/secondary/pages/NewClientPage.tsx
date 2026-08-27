import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container, Typography } from "@/app/components";
import { NewClientForm } from "@/myPages/secondary/sections/NewClientPageSections/NewClientForm";

export function NewClientPage() {
  return (
    <Container className="gap-8">
      <Link
        aria-label="Retour aux clients"
        className="inline-flex items-center gap-2 text-xl leading-none text-navy"
        href="/clients"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        <span className="text-sm font-bold">Nouveau client</span>
      </Link>
      <Typography component="p" variant="caption2">
        Ajoutez un client manuellement, par exemple s&apos;il vous contacte en dehors de Fillo.
      </Typography>
      <NewClientForm />
    </Container>
  );
}
