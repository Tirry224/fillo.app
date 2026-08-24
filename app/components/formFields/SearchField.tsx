import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";

export type SearchFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function SearchField({
  id = "search",
  label = "Rechercher",
  className = "",
  ...props
}: SearchFieldProps) {
  return (
    <div className="grid gap-1.5">
      {label ? (
        <label className="sr-only" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div className="flex min-h-11 items-center rounded-[var(--radius-control)] border border-border bg-surface px-3 focus-within:border-blue">
        <Search aria-hidden="true" className="mr-2 text-ink-muted" size={17} />
        <input
          className={`min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-ink-muted ${className}`}
          id={id}
          type="search"
          {...props}
        />
      </div>
    </div>
  );
}
