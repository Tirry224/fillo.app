"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Typography } from "./Typography";

export type PhotoGalleryProps = {
  photos: string[];
  alt: string;
};

export function PhotoGallery({ photos, alt }: PhotoGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="flex h-36 items-center justify-center rounded-[var(--radius-card)] bg-gradient-to-r from-orange to-coral">
        <Typography component="p" variant="caption2" className="text-white">
          Aucune photo disponible
        </Typography>
      </div>
    );
  }

  return (
    <>
      <div
        className={`grid gap-2 ${photos.length === 1 ? "grid-cols-1" : "grid-cols-3"}`}
      >
        {photos.map((photo, index) => (
          <button
            className={`overflow-hidden rounded-[var(--radius-card)] ${photos.length === 1 ? "h-36 w-full" : "aspect-square"}`}
            key={photo}
            onClick={() => setOpenIndex(index)}
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${alt} (${index + 1}/${photos.length})`}
              className="size-full object-cover"
              src={photo}
            />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenIndex(null)}
          role="dialog"
        >
          <button
            aria-label="Fermer"
            className="absolute right-4 top-4 text-white"
            onClick={() => setOpenIndex(null)}
            type="button"
          >
            <X aria-hidden="true" size={28} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={`${alt} (${openIndex + 1}/${photos.length})`}
            className="max-h-full max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
            src={photos[openIndex]}
          />
          {photos.length > 1 ? (
            <div className="absolute bottom-4 flex gap-2">
              {photos.map((photo, index) => (
                <button
                  aria-label={`Voir la photo ${index + 1}`}
                  className={`size-2 rounded-full ${index === openIndex ? "bg-white" : "bg-white/40"}`}
                  key={photo}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenIndex(index);
                  }}
                  type="button"
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
