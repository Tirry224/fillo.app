import type { HTMLAttributes } from "react";

const statusStyles = {
  new: "bg-[#e8f4ff] text-blue",
  pending: "bg-[#fff4df] text-[#a86b00]",
  completed: "bg-[#e8f5e9] text-green",
  lost: "bg-[#f0efed] text-[#6f7075]",
} as const;

const statusLabels = {
  new: "Nouvelle",
  pending: "En cours",
  completed: "Complétée",
  lost: "Vente perdue",
} as const;

type Status = keyof typeof statusStyles;

export type StatusBadgeProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  status: Status;
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
