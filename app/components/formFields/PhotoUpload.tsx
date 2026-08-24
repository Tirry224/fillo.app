import type { InputHTMLAttributes } from "react";
import { Upload } from "lucide-react";

export type PhotoUploadProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function PhotoUpload({
  id = "photo",
  label = "Photo du produit",
  hint = "Prendre une photo ou choisir",
  error,
  className = "",
  ...props
}: PhotoUploadProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-bold text-text" htmlFor={id}>
        {label}
      </label>
      <label
        className={`flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--radius-control)] border border-dashed border-border-strong bg-surface px-3 text-center hover:bg-surface-warm ${error ? "border-[#c53f3f]" : ""} ${className}`}
        htmlFor={id}
      >
        <Upload aria-hidden="true" className="text-navy" size={18} />
        <span className="text-xs font-bold text-navy">{hint}</span>
        <input
          accept="image/*"
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className="sr-only"
          id={id}
          type="file"
          {...props}
        />
      </label>
      {error ? (
        <p className="text-xs text-[#b33434]" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
