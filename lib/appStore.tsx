"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  clients as initialClients,
  requests as initialRequests,
  sales as initialSales,
  shops as initialShops,
  type Client,
  type ClientStatus,
  type Sale,
  type Shop,
} from "@/lib/mockData";

type ClientRequest = {
  id: string;
  clientId: string;
  title: string;
  detail: string;
  status: ClientStatus;
  message: string;
  photo?: string;
};

type Account = {
  phone: string;
  password: string;
  shop: Shop;
};

type Settings = {
  emailNotifications: boolean;
  shopName: string;
  phone: string;
  location: string;
  email: string;
};

type AppStore = {
  clients: Client[];
  requests: ClientRequest[];
  sales: Sale[];
  shop: Shop;
  settings: Settings;
  isAuthenticated: boolean;
  register: (phone: string, shopName: string, password: string) => void;
  login: (phone: string, password: string) => boolean;
  logout: () => void;
  addRequest: (input: {
    name: string;
    phone: string;
    request: string;
    photo?: string;
  }) => void;
  updateSaleStatus: (saleId: string, status: ClientStatus) => void;
  deleteSale: (saleId: string) => void;
  updateSettings: (updates: Partial<Settings>) => void;
};

const AppStoreContext = createContext<AppStore | null>(null);

function createSlug(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "ma-boutique"
  );
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [clientList, setClientList] = useState(initialClients);
  const [requestList, setRequestList] = useState<ClientRequest[]>(
    initialRequests.map((request, index) => ({
      ...request,
      id: `request-${index + 1}`,
      message: request.title,
    })),
  );
  const [saleList, setSaleList] = useState(initialSales);
  const [shop, setShop] = useState<Shop>(
    initialShops[0] ?? {
      slug: "ma-boutique",
      name: "Ma boutique",
      initial: "M",
    },
  );
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    shopName: initialShops[0]?.name ?? "Ma boutique",
    phone: "",
    location: "",
    email: "",
  });

  function register(phone: string, shopName: string, password: string) {
    const nextShop = {
      slug: createSlug(shopName),
      name: shopName,
      initial: shopName.trim().charAt(0).toUpperCase() || "F",
    };
    setAccounts((current) => [...current, { phone, password, shop: nextShop }]);
    setShop(nextShop);
    setSettings((current) => ({ ...current, shopName, phone }));
    setIsAuthenticated(true);
  }

  function login(phone: string, password: string) {
    const account = accounts.find(
      (candidate) =>
        normalizePhone(candidate.phone) === normalizePhone(phone) &&
        candidate.password === password,
    );
    if (!account) return false;
    setShop(account.shop);
    setSettings((current) => ({ ...current, shopName: account.shop.name }));
    setIsAuthenticated(true);
    return true;
  }

  function logout() {
    setIsAuthenticated(false);
  }

  function addRequest(input: {
    name: string;
    phone: string;
    request: string;
    photo?: string;
  }) {
    const normalizedPhone = normalizePhone(input.phone);
    const existingClient = clientList.find(
      (client) => normalizePhone(client.phone) === normalizedPhone,
    );
    const client = existingClient ?? {
      id: `client-${Date.now()}`,
      initials: input.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      name: input.name,
      phone: input.phone,
      status: "new" as const,
      color: "blue" as const,
    };

    if (!existingClient) setClientList((current) => [...current, client]);
    setClientList((current) =>
      current.map((item) =>
        item.id === client.id ? { ...item, status: "new" } : item,
      ),
    );
    const requestId = `request-${Date.now()}`;
    setRequestList((current) => [
      {
        id: requestId,
        clientId: client.id,
        title: input.request,
        detail: "Reçu à l'instant via le formulaire client",
        status: "new",
        message: input.request,
        photo: input.photo,
      },
      ...current,
    ]);
    setSaleList((current) => [
      {
        id: `FL-${Date.now()}`,
        clientId: client.id,
        clientName: client.name,
        requestId,
        product: input.request,
        message: input.request,
        status: "new",
        photo: input.photo,
        createdAt: Date.now(),
      },
      ...current,
    ]);
  }

  function updateSaleStatus(saleId: string, status: ClientStatus) {
    setSaleList((current) =>
      current.map((sale) => (sale.id === saleId ? { ...sale, status } : sale)),
    );
    const sale = saleList.find((item) => item.id === saleId);
    if (!sale) return;
    setRequestList((current) =>
      current.map((request) =>
        request.id === sale.requestId ? { ...request, status } : request,
      ),
    );
    setClientList((current) =>
      current.map((client) =>
        client.id === sale.clientId ? { ...client, status } : client,
      ),
    );
  }

  function deleteSale(saleId: string) {
    setSaleList((current) => current.filter((sale) => sale.id !== saleId));
  }

  function updateSettings(updates: Partial<Settings>) {
    setSettings((current) => ({ ...current, ...updates }));
    const shopName = updates.shopName;
    if (shopName) {
      setShop((current) => ({ ...current, name: shopName }));
    }
  }

  return (
    <AppStoreContext.Provider
      value={{
        clients: clientList,
        requests: requestList,
        sales: saleList,
        shop,
        settings,
        isAuthenticated,
        register,
        login,
        logout,
        addRequest,
        updateSaleStatus,
        deleteSale,
        updateSettings,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error("useAppStore must be used inside AppStoreProvider");
  }
  return store;
}
