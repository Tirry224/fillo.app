import type { InputHTMLAttributes } from "react";

export type PhoneFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  prefix?: string;
  error?: string;
};

export function PhoneField({
  id = "phone",
  label = "Numéro de téléphone",
  prefix = "GN +224",
  error,
  className = "",
  ...props
}: PhoneFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-bold text-text" htmlFor={id}>
        {label}
      </label>
      <div
        className={`flex min-h-11 overflow-hidden rounded-[var(--radius-control)] border border-border bg-surface focus-within:border-blue ${error ? "border-[#c53f3f]" : ""}`}
      >
        <span className="flex items-center border-r border-border bg-surface-warm px-3 text-xs font-bold text-text">
          {prefix}
        </span>
        <input
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className={`min-w-0 flex-1 bg-transparent px-3 text-sm text-text outline-none placeholder:text-ink-muted ${className}`}
          id={id}
          inputMode="tel"
          type="tel"
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-[#b33434]" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
