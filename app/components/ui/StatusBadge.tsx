import type { HTMLAttributes } from "react";
import type { ClientStatus } from "@/lib/types";

const statusStyles: Record<ClientStatus, string> = {
  new: "bg-[#e8f4ff] text-blue",
  pending: "bg-[#fff4df] text-orange",
  completed: "bg-[#e8f5e9] text-green",
  lost: "bg-[#f0efed] text-grey",
};

const statusLabels: Record<ClientStatus, string> = {
  new: "Nouvelle",
  pending: "En cours",
  completed: "Complétée",
  lost: "Vente perdue",
};

export type StatusBadgeProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  status: ClientStatus;
  label?: string;
};

export function StatusBadge({
  status,
  label = statusLabels[status],
  className = "",
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-bold ${statusStyles[status]} ${className}`}
      {...props}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
