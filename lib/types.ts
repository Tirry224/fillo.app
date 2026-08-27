export type ClientStatus = "new" | "pending" | "completed" | "lost";

export type Client = {
  id: string;
  shopId: string;
  initials: string;
  name: string;
  phone: string;
  color: "blue" | "orange" | "green";
};

export type Sale = {
  id: string;
  shopId: string;
  clientId: string;
  clientName: string;
  requestId: string;
  product: string;
  message: string;
  status: ClientStatus;
  photo?: string;
  createdAt: number;
};

export type ClientRequest = {
  id: string;
  shopId: string;
  clientId: string;
  title: string;
  detail: string;
  message: string;
  photo?: string;
};

export type Shop = {
  id: string;
  slug: string;
  name: string;
  initial: string;
};

/** Vue publique d'une boutique : uniquement les champs affichables sur la page client, sans id ni coordonnées privées. */
export type PublicShop = {
  slug: string;
  name: string;
  initial: string;
};

export type ShopSettings = {
  shopName: string;
  phone: string;
  location: string;
  email: string;
  emailNotifications: boolean;
};
