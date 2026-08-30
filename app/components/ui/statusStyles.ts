import type { ClientStatus } from "@/lib/types";

/**
 * Couleurs et libellés associés à chaque statut de vente, partagés par tous
 * les composants qui affichent un statut (StatusBadge, Avatar) : une seule
 * source pour que la couleur d'un statut reste identique partout dans l'app.
 */
export const statusStyles: Record<ClientStatus, string> = {
  new: "bg-[#e8f4ff] text-blue",
  pending: "bg-[#fff4df] text-orange",
  completed: "bg-[#e8f5e9] text-green",
  lost: "bg-[#f0efed] text-grey",
};

export const statusLabels: Record<ClientStatus, string> = {
  new: "Nouvelle",
  pending: "En cours",
  completed: "Complétée",
  lost: "Vente perdue",
};
