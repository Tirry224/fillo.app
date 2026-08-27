"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { Sale } from "@/lib/types";
import { deleteSaleAction } from "@/lib/actions/shop";

export function SaleHeader({ sale }: { sale: Sale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Supprimer cette vente ?")) return;
    startTransition(async () => {
      const result = await deleteSaleAction(sale.id);
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.push("/ventes");
      router.refresh();
    });
  }

  return (
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
        onClick={handleDelete}
        type="button"
      >
        <Trash2 aria-hidden="true" size={18} />
      </button>
    </header>
  );
}
