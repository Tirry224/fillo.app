import Link from "next/link";
import type { ReactNode } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
};

export type BottomNavigationProps = {
  items: NavItem[];
  ariaLabel?: string;
};

export function BottomNavigation({
  items,
  ariaLabel = "Navigation principale",
}: BottomNavigationProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface px-3 pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_3px_rgb(39_52_82_/_5%)]"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              aria-current={item.active ? "page" : undefined}
              className={`flex min-h-[68px] flex-col items-center justify-center gap-1 px-1 text-[11px] font-bold transition-colors ${
                item.active ? "text-navy" : "text-ink-muted hover:text-navy"
              }`}
              href={item.href}
            >
              <span aria-hidden="true" className="text-lg leading-none">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
