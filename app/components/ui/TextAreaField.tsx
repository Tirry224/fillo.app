import type { TextareaHTMLAttributes } from "react";
import { uiStyles } from "./Typography";

export type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function TextAreaField({
  id,
  label,
  error,
  className = "",
  rows = 3,
  ...props
}: TextAreaFieldProps) {
  const fieldId =
    id ??
    (label
      .normalize("NFKD")
      .replace(new RegExp("[\u0300-\u036f]", "g"), "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") ||
      "textarea-field");
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-bold text-text" htmlFor={fieldId}>
        {label}
      </label>
      <textarea
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        className={`${uiStyles.controlRadius} resize-none overflow-y-auto border border-border bg-surface px-3 py-2 text-base text-text shadow-sm transition-shadow placeholder:text-ink-muted focus:border-blue focus:outline-none focus:shadow-[var(--shadow-focus)] ${error ? "border-[#c53f3f]" : ""} ${className}`}
        id={fieldId}
        rows={rows}
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
