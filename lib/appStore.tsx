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
  addRequest: (input: { name: string; phone: string; request: string }) => void;
  updateClientStatus: (clientId: string, status: ClientStatus) => void;
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

  function addRequest(input: { name: string; phone: string; request: string }) {
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
    setRequestList((current) => [
      {
        id: `request-${Date.now()}`,
        clientId: client.id,
        title: input.request,
        detail: "Reçu à l'instant via le formulaire client",
        status: "new",
        message: input.request,
      },
      ...current,
    ]);
  }

  function updateClientStatus(clientId: string, status: ClientStatus) {
    setClientList((current) =>
      current.map((client) =>
        client.id === clientId ? { ...client, status } : client,
      ),
    );
    setRequestList((current) =>
      current.map((request) =>
        request.clientId === clientId ? { ...request, status } : request,
      ),
    );
    if (status === "completed") {
      const clientRequests = requestList.filter(
        (request) => request.clientId === clientId,
      );
      setSaleList((current) => {
        const newSales = clientRequests
          .filter(
            (request) =>
              !current.some(
                (sale) =>
                  sale.clientId === clientId && sale.product === request.title,
              ),
          )
          .map((request, index) => ({
            id: `FL-${Date.now()}-${index + 1}`,
            clientId,
            clientName:
              clientList.find((client) => client.id === clientId)?.name ??
              "Client",
            product: request.title,
            message: request.message,
            status: "completed" as const,
          }));
        return [...current, ...newSales];
      });
    }
  }

  function updateSaleStatus(saleId: string, status: ClientStatus) {
    setSaleList((current) =>
      current.map((sale) => (sale.id === saleId ? { ...sale, status } : sale)),
    );
    const sale = saleList.find((item) => item.id === saleId);
    if (sale) updateClientStatus(sale.clientId, status);
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
        updateClientStatus,
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
