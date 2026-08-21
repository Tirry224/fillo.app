"use client";

import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";

export type PasswordFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function PasswordField({
  id,
  label = "Mot de passe",
  error,
  className = "",
  ...props
}: PasswordFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = error ? `${fieldId}-error` : undefined;
  const [visible, setVisible] = useState(false);

  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-bold text-text" htmlFor={fieldId}>
        {label}
      </label>
      <div
        className={`flex min-h-11 items-center rounded-[var(--radius-control)] border border-border bg-surface focus-within:border-blue ${error ? "border-[#c53f3f]" : ""}`}
      >
        <input
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className={`min-w-0 flex-1 bg-transparent px-3 text-sm text-text outline-none placeholder:text-ink-muted ${className}`}
          id={fieldId}
          type={visible ? "text" : "password"}
          {...props}
        />
        <button
          aria-label={
            visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
          className="px-3 text-xs font-bold text-ink-muted hover:text-navy"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? "Masquer" : "Afficher"}
        </button>
      </div>
      {error ? (
        <p className="text-xs text-[#b33434]" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
