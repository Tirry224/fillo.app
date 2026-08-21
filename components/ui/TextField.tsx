import type { InputHTMLAttributes } from "react";
import { uiStyles } from "./Typography";

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
  const fieldId =
    id ??
    (label
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") ||
      "text-field");
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-bold text-text" htmlFor={fieldId}>
        {label}
      </label>
      <input
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        className={`${uiStyles.field} ${uiStyles.controlRadius} border border-border bg-surface text-text placeholder:text-ink-muted focus:border-blue focus:outline-none ${error ? "border-[#c53f3f]" : ""} ${className}`}
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
