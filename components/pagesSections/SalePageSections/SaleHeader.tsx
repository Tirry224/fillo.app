import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { Sale } from "@/lib/mockData";

export function SaleHeader({ sale }: { sale: Sale }) {
  return (
    <header className="flex items-center justify-between">
      <Link
        aria-label="Retour aux clients"
        className="inline-flex items-center gap-2 text-navy"
        href="/clients"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        <span className="text-sm font-bold">Vente #{sale.id}</span>
      </Link>
      <button
        aria-label="Supprimer la vente"
        className="text-xl text-[#c53f3f]"
        type="button"
      >
        <Trash2 aria-hidden="true" size={18} />
      </button>
    </header>
  );
}
