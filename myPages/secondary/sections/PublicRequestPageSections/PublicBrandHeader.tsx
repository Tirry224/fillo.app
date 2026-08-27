import { Typography } from "@/app/components";
import type { PublicShop } from "@/lib/types";

export function PublicBrandHeader({ shop }: { shop: PublicShop }) {
  return (
    <header className="grid justify-items-center gap-3 text-center">
      <span className="flex size-10 items-center justify-center rounded-[var(--radius-control)] bg-navy font-display text-xl font-bold text-white">
        {shop.initial}
      </span>
      <div className="grid gap-1">
        <Typography component="h1" variant="h4">
          {shop.name}
        </Typography>
        <Typography component="p" variant="caption2">
          Envoyez votre demande directement au vendeur
        </Typography>
      </div>
    </header>
  );
}
