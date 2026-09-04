"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { NewOrderPopup } from "./NewOrderPopup";

/** Bouton d'en-tête de conversation qui ouvre la popup de nouvelle commande. */
export function NewOrderButton({ conversationId }: { conversationId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Créer une commande"
        className="flex size-9 items-center justify-center rounded-[var(--radius-control)] bg-navy text-white"
        onClick={() => setOpen(true)}
        type="button"
      >
        <ShoppingBag aria-hidden="true" size={18} />
      </button>
      {open ? (
        <NewOrderPopup conversationId={conversationId} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
