import type { HTMLAttributes } from "react";
import { uiStyles } from "./Typography";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  warm?: boolean;
};

export function Card({ warm = false, className = "", ...props }: CardProps) {
  const backgroundClass = warm ? "bg-surface-warm" : "bg-surface";

  return (
    <div
      className={`${uiStyles.cardRadius} border border-border shadow-[var(--shadow-card)] ${backgroundClass} ${className}`}
      {...props}
    />
  );
}
