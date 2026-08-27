export type ClientStatus = "new" | "pending" | "completed" | "lost";

/** Nombre maximum de photos qu'un client peut joindre à une demande. */
export const MAX_REQUEST_PHOTOS = 3;

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
  message: string;
  status: ClientStatus;
  photos: string[];
  saleNumber: number;
  createdAt: number;
};

export type ClientRequest = {
  id: string;
  shopId: string;
  clientId: string;
  title: string;
  detail: string;
  message: string;
  photos: string[];
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
