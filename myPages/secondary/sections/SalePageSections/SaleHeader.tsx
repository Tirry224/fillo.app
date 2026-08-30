"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button, Card, Typography } from "@/app/components";
import type { Sale } from "@/lib/types";
import { deleteSaleAction } from "@/lib/actions/shop";

export function SaleHeader({ sale }: { sale: Sale }) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "delete">("idle");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeDialog() {
    setMode("idle");
    setError(null);
  }

  async function handleDeleteConfirm() {
    setPending(true);
    setError(null);
    const result = await deleteSaleAction(sale.id);

    if (result.error) {
      setPending(false);
      setError(result.error);
      return;
    }

    router.push("/ventes");
    router.refresh();
  }

  return (
    <div className="relative">
      <header className="flex items-center justify-between">
        <Link
          aria-label="Retour aux clients"
          className="inline-flex items-center gap-2 text-navy"
          href="/clients"
        >
          <ArrowLeft aria-hidden="true" size={18} />
          <span className="text-sm font-bold">Vente #FL-{sale.saleNumber}</span>
        </Link>
        <button
          aria-label="Supprimer la vente"
          className="text-xl text-[#c53f3f] disabled:opacity-60"
          disabled={pending}
          onClick={() => setMode("delete")}
          type="button"
        >
          <Trash2 aria-hidden="true" size={18} />
        </button>
      </header>

      {mode === "delete" ? (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <Card className="grid w-full max-w-sm gap-3 p-5 text-center shadow-lg" warm>
            <Typography component="p" variant="h4">
              Supprimer cette vente ?
            </Typography>
            <Typography component="p" variant="caption2">
              Cette action est définitive et supprimera l&apos;historique de
              cette vente.
            </Typography>
            {error ? (
              <Typography component="p" variant="caption2" className="text-[#b33434]">
                {error}
              </Typography>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <Button
                disabled={pending}
                onClick={closeDialog}
                type="button"
                variant="secondary"
              >
                Annuler
              </Button>
              <Button
                disabled={pending}
                onClick={handleDeleteConfirm}
                type="button"
                variant="danger"
              >
                {pending ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
