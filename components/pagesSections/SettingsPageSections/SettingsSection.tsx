"use client";

import { Typography } from "@/components";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export type SettingRowProps = {
  icon: ReactNode;
  label: string;
  detail: string;
  onClick?: () => void;
  trailing?: ReactNode;
};

export function SettingRow({
  icon,
  label,
  detail,
  onClick,
  trailing = <ChevronRight size={22} strokeWidth={1.8} />,
}: SettingRowProps) {
  return (
    <button
      className="flex min-h-[72px] w-full items-center gap-4 px-5 text-left transition-colors hover:bg-surface-warm focus-visible:relative"
      onClick={onClick}
      type="button"
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#f2ecdf] text-[#302d27]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[18px] font-bold leading-tight text-text">
          {label}
        </span>
        <span className="mt-1 block text-[16px] leading-tight text-ink-muted">
          {detail}
        </span>
      </span>
      <span className="shrink-0 text-ink-muted" aria-hidden="true">
        {trailing}
      </span>
    </button>
  );
}

export function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <Typography
        component="h2"
        variant="caption1"
        className="text-[16px] uppercase tracking-[0.02em] text-ink-muted"
      >
        {title}
      </Typography>
      <div className="overflow-hidden rounded-[22px] border-2 border-border bg-surface">
        {children}
      </div>
    </section>
  );
}
