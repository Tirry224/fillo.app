import type { HTMLAttributes } from "react";
import type { ClientStatus } from "@/lib/types";
import { statusStyles } from "./statusStyles";

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  initials: string;
  /** Statut de la commande la plus pertinente du client : l'avatar reprend la même couleur que son StatusBadge, pour rester cohérent partout dans l'app. */
  status?: ClientStatus;
};

export function Avatar({
  initials,
  status = "new",
  className = "",
  ...props
}: AvatarProps) {
  return (
    <div
      aria-label={`Avatar de ${initials}`}
      className={`flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] font-display text-base font-bold ${statusStyles[status]} ${className}`}
      role="img"
      {...props}
    >
      {initials}
    </div>
  );
}
