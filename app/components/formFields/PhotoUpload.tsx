"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import { Upload, X } from "lucide-react";
import { MAX_REQUEST_PHOTOS } from "@/lib/types";

export type PhotoUploadProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "multiple"
> & {
  label?: string;
  hint?: string;
  error?: string;
  onFilesChange?: (files: File[]) => void;
};

export function PhotoUpload({
  id = "photo",
  label = "Photos du produit",
  hint = "Prendre une photo ou choisir",
  error,
  className = "",
  onFilesChange,
  ...props
}: PhotoUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [limitError, setLimitError] = useState<string | null>(null);
  const errorId = error || limitError ? `${id}-error` : undefined;

  const previewUrls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  function updateFiles(nextFiles: File[]) {
    setFiles(nextFiles);
    onFilesChange?.(nextFiles);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);

    if (selected.length > MAX_REQUEST_PHOTOS) {
      setLimitError(`Vous pouvez joindre au maximum ${MAX_REQUEST_PHOTOS} photos.`);
      updateFiles(selected.slice(0, MAX_REQUEST_PHOTOS));
      return;
    }

    setLimitError(null);
    updateFiles(selected);
  }

  function removeFile(index: number) {
    setLimitError(null);
    updateFiles(files.filter((_, i) => i !== index));
  }

  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-bold text-text" htmlFor={id}>
        {label}
      </label>
      <label
        className={`flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--radius-control)] border border-dashed border-border-strong bg-surface px-3 text-center hover:bg-surface-warm ${error || limitError ? "border-[#c53f3f]" : ""} ${className}`}
        htmlFor={id}
      >
        <Upload aria-hidden="true" className="text-navy" size={18} />
        <span className="text-xs font-bold text-navy">{hint}</span>
        <input
          accept="image/*"
          aria-describedby={errorId}
          aria-invalid={Boolean(error || limitError)}
          className="sr-only"
          id={id}
          multiple
          onChange={handleChange}
          type="file"
          {...props}
        />
      </label>
      {files.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, index) => (
            <div
              className="relative aspect-square overflow-hidden rounded-[var(--radius-control)]"
              key={`${file.name}-${file.lastModified}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`Aperçu ${index + 1}`}
                className="size-full object-cover"
                src={previewUrls[index]}
              />
              <button
                aria-label="Retirer cette photo"
                className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
                onClick={() => removeFile(index)}
                type="button"
              >
                <X aria-hidden="true" size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      {error || limitError ? (
        <p className="text-xs text-[#b33434]" id={errorId}>
          {error ?? limitError}
        </p>
      ) : null}
    </div>
  );
}
