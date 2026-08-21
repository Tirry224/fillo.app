import type { InputHTMLAttributes } from "react";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function TextField({
  id,
  label,
  error,
  className = "",
  ...props
}: TextFieldProps) {
  const fieldId = id ?? label.toLowerCase().replaceAll(" ", "-");
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-bold text-text" htmlFor={fieldId}>
        {label}
      </label>
      <input
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        className={`min-h-11 rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-text placeholder:text-ink-muted focus:border-blue focus:outline-none ${error ? "border-[#c53f3f]" : ""} ${className}`}
        id={fieldId}
        {...props}
      />
      {error ? (
        <p className="text-xs text-[#b33434]" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
