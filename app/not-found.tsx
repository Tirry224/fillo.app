import Link from "next/link";
import { BrandHeader, Container, Typography } from "@/app/components";

export default function NotFound() {
  return (
    <Container>
      <BrandHeader />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
        <Typography component="h1" variant="h3">
          Page introuvable
        </Typography>
        <Typography component="p" variant="body-base">
          Cette page n&apos;existe pas ou n&apos;est plus disponible.
        </Typography>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] bg-navy px-5 text-sm font-bold text-white hover:bg-[#1f2a46]"
          href="/"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </Container>
  );
}
