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

export const clients: Client[] = [];

export const sales: Sale[] = [];

export const shops: Shop[] = [];

export const requests: {
  clientId: string;
  title: string;
  detail: string;
  status: ClientStatus;
}[] = [];

export function getSaleById(id: string) {
  return sales.find((sale) => sale.id.toLowerCase() === id.toLowerCase());
}

export function getShopBySlug(slug: string) {
  const existingShop = shops.find((shop) => shop.slug === slug);
  if (existingShop) return existingShop;

  const name = slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return name
    ? { slug, name, initial: name.charAt(0).toUpperCase() }
    : undefined;
}
