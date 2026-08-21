export type ClientStatus = "new" | "pending" | "completed" | "lost";

export type Client = {
  id: string;
  initials: string;
  name: string;
  phone: string;
  status: ClientStatus;
  color: "blue" | "orange" | "green";
};

export type Sale = {
  id: string;
  clientId: string;
  clientName: string;
  product: string;
  message: string;
  status: ClientStatus;
};

export type Shop = {
  slug: string;
  name: string;
  initial: string;
};

export const clients: Client[] = [
  {
    id: "client-mamadou-bah",
    initials: "MB",
    name: "Mamadou Bah",
    phone: "+224 621 45 89 12",
    status: "new",
    color: "blue",
  },
  {
    id: "client-fatoumata-camara",
    initials: "FC",
    name: "Fatoumata Camara",
    phone: "+224 624 11 22 33",
    status: "pending",
    color: "orange",
  },
  {
    id: "client-aissatou-diallo",
    initials: "AD",
    name: "Aissatou Diallo",
    phone: "+224 620 99 88 77",
    status: "completed",
    color: "green",
  },
];

export const sales: Sale[] = [
  {
    id: "FL-892",
    clientId: "client-mamadou-bah",
    clientName: "Mamadou Bah",
    product: "Bazin riche (couleur bleue)",
    message: "Je cherche ce modèle précis, 2 pièces, pour un mariage vendredi.",
    status: "new",
  },
];

export const shops: Shop[] = [
  { slug: "diallo-tissus", name: "Boutique Diallo Tissus", initial: "D" },
];

export const requests = [
  {
    clientId: "client-mamadou-bah",
    title: "Bazin riche VIP (2 pièces)",
    detail: "Reçu il y a 10 min par WhatsApp",
    status: "new" as const,
  },
];

export function getClientById(id: string) {
  return clients.find((client) => client.id === id);
}

export function getSaleById(id: string) {
  return sales.find((sale) => sale.id.toLowerCase() === id.toLowerCase());
}

export function getShopBySlug(slug: string) {
  return shops.find((shop) => shop.slug === slug);
}
