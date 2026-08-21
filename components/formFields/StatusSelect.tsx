"use client";

import { useState } from "react";
import type { SelectHTMLAttributes } from "react";
import { Check, ChevronDown } from "lucide-react";

export type StatusOption = {
  value: string;
  label: string;
};

export type StatusSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children" | "onChange"
> & {
  label?: string;
  error?: string;
  options?: StatusOption[];
  onChange?: (value: string) => void;
};

const defaultOptions: StatusOption[] = [
  { value: "new", label: "Nouvelle demande" },
  { value: "pending", label: "En cours" },
  { value: "completed", label: "Vente complétée" },
  { value: "lost", label: "Vente perdue" },
];

const statusColors: Record<string, string> = {
  new: "bg-blue",
  pending: "bg-orange",
  completed: "bg-green",
  lost: "bg-grey",
};

export function StatusSelect({
  id = "status",
  label = "Statut de la demande",
  error,
  options = defaultOptions,
  className = "",
  name = id,
  value,
  defaultValue,
  disabled = false,
  required = false,
  form,
  onChange,
}: StatusSelectProps) {
  const initialValue = String(value ?? defaultValue ?? options[0]?.value ?? "");
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const errorId = error ? `${id}-error` : undefined;
  const currentValue = value === undefined ? selectedValue : String(value);
  const selectedOption =
    options.find((option) => option.value === currentValue) ?? options[0];

  function selectOption(option: StatusOption) {
    setSelectedValue(option.value);
    setOpen(false);
    onChange?.(option.value);
  }

  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-bold text-text" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          form={form}
          name={name}
          required={required}
          type="hidden"
          value={selectedOption?.value ?? ""}
        />
        <button
          aria-controls={`${id}-options`}
          aria-describedby={errorId}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--radius-control)] border bg-surface px-3 text-left text-sm text-text outline-none transition-colors focus:border-blue disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-[#c53f3f]" : "border-border"} ${className}`}
          disabled={disabled}
          id={id}
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${statusColors[selectedOption?.value ?? ""] ?? "bg-grey"}`}
            />
            {selectedOption?.label}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
            size={17}
          />
        </button>

        {open ? (
          <div
            aria-labelledby={id}
            className="absolute inset-x-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-[var(--radius-control)] border border-border bg-surface shadow-[var(--shadow-card)]"
            id={`${id}-options`}
            role="listbox"
          >
            {options.map((option) => {
              const isSelected = option.value === currentValue;

              return (
                <button
                  aria-selected={isSelected}
                  className="flex min-h-11 w-full items-center justify-between border-b border-border px-3 text-left text-sm text-text last:border-b-0 hover:bg-surface-warm"
                  key={option.value}
                  onClick={() => selectOption(option)}
                  role="option"
                  type="button"
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`size-2 rounded-full ${statusColors[option.value] ?? "bg-grey"}`}
                    />
                    {option.label}
                  </span>
                  {isSelected ? (
                    <Check aria-hidden="true" className="text-navy" size={16} />
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs text-[#b33434]" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
