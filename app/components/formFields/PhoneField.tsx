"use client";

import { useState, type ChangeEvent, type InputHTMLAttributes } from "react";

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
  onChange,
  value,
  defaultValue,
  ...props
}: PhoneFieldProps) {
  const [formattedValue, setFormattedValue] = useState(() =>
    formatPhone(String(value ?? defaultValue ?? "")),
  );
  const errorId = error ? `${id}-error` : undefined;
  const displayedValue =
    value === undefined ? formattedValue : formatPhone(String(value));

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = formatPhone(event.target.value);
    setFormattedValue(nextValue);
    event.target.value = nextValue;
    onChange?.(event);
  }

  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-bold text-text" htmlFor={id}>
        {label}
      </label>
      <div
        className={`flex min-h-11 overflow-hidden rounded-[var(--radius-control)] border border-border bg-surface shadow-sm transition-shadow focus-within:border-blue focus-within:shadow-[var(--shadow-focus)] ${error ? "border-[#c53f3f]" : ""}`}
      >
        <span className="flex items-center border-r border-border bg-surface-warm px-3 text-xs font-bold text-text">
          {prefix}
        </span>
        <input
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className={`min-w-0 flex-1 bg-transparent px-3 text-sm text-text outline-none focus-visible:shadow-none placeholder:text-ink-muted ${className}`}
          id={id}
          inputMode="tel"
          onChange={handleChange}
          value={displayedValue}
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

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^224/, "").slice(0, 9);
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}
