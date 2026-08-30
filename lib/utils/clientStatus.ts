import type { Client, ClientStatus, Sale } from "@/lib/types";

/**
 * Détermine le statut le plus pertinent à afficher pour un client ayant
 * potentiellement plusieurs commandes : une commande "nouvelle" ou "en
 * cours" prend toujours le pas sur les commandes terminées, pour mettre en
 * avant ce qui demande le plus d'attention au commerçant. À défaut, on
 * retient la commande la plus récente. Utilisé à la fois pour le badge de
 * statut et la couleur de l'avatar du client, afin qu'ils restent cohérents
 * entre eux.
 */
export function getClientStatus(
  clientId: Client["id"],
  sales: Sale[],
): ClientStatus {
  const clientSales = sales.filter((sale) => sale.clientId === clientId);

  if (clientSales.length === 0) {
    return "new";
  }

  for (const priorityStatus of ["new", "pending"] as const satisfies ClientStatus[]) {
    if (clientSales.some((sale) => sale.status === priorityStatus)) {
      return priorityStatus;
    }
  }

  return clientSales.reduce((mostRecent, sale) =>
    sale.createdAt > mostRecent.createdAt ? sale : mostRecent,
  ).status;
}
