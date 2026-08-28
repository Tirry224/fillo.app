import Link from "next/link";
import { Typography } from "@/app/components";
import { ChevronRight, SquarePen } from "lucide-react";
import type { ReactNode } from "react";

type SettingRowProps = {
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
  trailing = onClick ? <ChevronRight size={22} strokeWidth={1.8} /> : null,
}: SettingRowProps) {
  const content = (
    <>
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
    </>
  );

  if (!onClick) {
    return (
      <div className="flex min-h-[72px] w-full items-center gap-4 px-5">
        {content}
      </div>
    );
  }

  return (
    <button
      className="flex min-h-[72px] w-full items-center gap-4 px-5 text-left transition-colors hover:bg-surface-warm focus-visible:relative"
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
}

export function SettingsGroup({
  title,
  editHref,
  children,
}: {
  title: string;
  editHref?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="ml-1 flex items-center justify-between gap-2">
        <Typography
          component="h2"
          variant="caption1"
          className="text-[16px] uppercase tracking-[0.02em] text-ink-muted"
        >
          {title}
        </Typography>
        {editHref ? (
          <Link
            aria-label={`Modifier ${title}`}
            className="flex size-8 items-center justify-center text-ink-muted transition-colors hover:text-navy"
            href={editHref}
          >
            <SquarePen aria-hidden="true" size={18} strokeWidth={1.8} />
          </Link>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-[22px] border-2 border-border bg-surface">
        {children}
      </div>
    </section>
  );
}
