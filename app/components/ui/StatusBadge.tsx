import type { HTMLAttributes } from "react";
import type { ClientStatus } from "@/lib/types";
import { statusLabels, statusStyles } from "./statusStyles";

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
