import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container, Typography } from "@/app/components";
import { CommerceEditForm } from "@/myPages/secondary/sections/CommerceEditPageSections/CommerceEditForm";
import { requireShopWorkspace } from "@/lib/data";

export async function CommerceEditPage() {
  const { settings } = await requireShopWorkspace();

  return (
    <Container className="gap-8">
      <Link
        aria-label="Retour aux réglages"
        className="inline-flex items-center gap-2 text-xl leading-none text-navy"
        href="/reglages"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        <span className="text-sm font-bold">Mon commerce</span>
      </Link>
      <Typography component="p" variant="caption2">
        Modifiez les informations de votre commerce.
      </Typography>
      <CommerceEditForm settings={settings} />
    </Container>
  );
}
