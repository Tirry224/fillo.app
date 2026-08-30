/**
 * Statut d'une vente, affiché et coloré de façon identique partout dans
 * l'app (voir StatusBadge) : "new" = demande reçue non traitée, "pending" =
 * en cours, "completed" = vente conclue, "lost" = demande n'ayant pas abouti.
 */
export type ClientStatus = "new" | "pending" | "completed" | "lost";

/** Nombre maximum de photos qu'un client peut joindre à une demande. */
export const MAX_REQUEST_PHOTOS = 3;

/** Fiche client d'une boutique. `color` fixe la couleur de son avatar (initiales) dans les listes. */
export type Client = {
  id: string;
  shopId: string;
  initials: string;
  name: string;
  phone: string;
  color: "blue" | "orange" | "green";
};

/**
 * Vente d'une boutique, créée à partir d'une demande client (reçue via la
 * page publique ou ajoutée manuellement). `saleNumber` est un compteur
 * séquentiel par boutique (généré côté base, voir la migration
 * 014_sale_sequential_number.sql), affiché au commerçant à la place de
 * l'identifiant technique `id`.
 */
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
  /** Timestamp (millisecondes epoch) de création, pour trier par date sans reparser une string. */
  createdAt: number;
};

/**
 * Demande transmise par un client, via la page publique de la boutique ou
 * ajoutée manuellement par le commerçant. Chaque demande donne naissance à
 * une `Sale` associée (voir `addClientAction`).
 */
export type ClientRequest = {
  id: string;
  shopId: string;
  clientId: string;
  title: string;
  detail: string;
  message: string;
  photos: string[];
};

/** Boutique d'un commerçant. `initial` est la lettre affichée dans l'icône de marque quand il n'y a pas de logo. */
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

/** Réglages modifiables par le commerçant depuis la page Réglages. `email` est aussi l'email de connexion au compte. */
export type ShopSettings = {
  shopName: string;
  phone: string;
  location: string;
  email: string;
  /** Active l'envoi d'un email au commerçant pour chaque nouvelle demande client. */
  emailNotifications: boolean;
};
